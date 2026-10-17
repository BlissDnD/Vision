/* Vel M2 · red spine-surface look test. Three.js r170, WebGL2.
 * Why Three.js here: a tested PBR stack (clear coat, PMREM env, planar reflector, MSAA, tone mapping) lets the
 * test focus on form / material / light. Integration into Vel (own WebGL2 + SDF renderer) is the second step. */
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { buildRibbon } from './ribbon.js';
import { Env, makeBackLight, makeSky, makeStrips, layoutStrips } from './studio.js';
import { makeFloor, setContacts } from './floor.js';

// ---------- parameters (defaults = reference composition) ----------
const DEF = {
  pts: [[-6.4, 4.4, 0.6], [-4.2, 3.0, -0.5], [-2.6, 1.2, -1.4], [-1.0, 0.14, -2.0], [0.7, 0.7, -2.6], [2.4, 1.9, -2.2], [3.9, 3.1, -1.2], [5.0, 4.4, 0.6], [5.8, 5.8, 3.0]],
  arch: 1, lean: 0.9, leanEnd: -1.2, width: 7, taper: 0, thick: 0.09, twist: 0, bend: 0.12, center: 0, fillet: 0.35,
  red: '#8e0c14', rough: 0.18, coat: 0.35, metal: 0.85, silver: 0.9, tint: 0.92,
  stripPos: 0.6, stripSize: 1, stripI: 2.5, backI: 1.6, sky: 1.05, stripsSeen: false,
  refl: 0.9, blur: 1, ao: 1, exposure: 0.92, bloom: 0.18, tone: 'neutral', res: 1,
};
const P = structuredClone(DEF);
const VIEWS = { ref: { pos: [-0.6, 0.45, 5.2], tgt: [1.0, 1.35, -3] }, alt: { pos: [-8.6, 3.4, 7.2], tgt: [0.2, 1.2, -2.2] } };

// ---------- renderer / scene ----------
const cv = document.getElementById('cv');
const renderer = new THREE.WebGLRenderer({ canvas: cv, antialias: false, powerPreference: 'high-performance' });
renderer.outputColorSpace = THREE.SRGBColorSpace;
const TONES = { neutral: THREE.NeutralToneMapping, agx: THREE.AgXToneMapping, aces: THREE.ACESFilmicToneMapping };
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(62, 1, 0.1, 400);
const orbit = new OrbitControls(camera, cv); orbit.enableDamping = true; orbit.dampingFactor = 0.08;
setView('ref');

const env = new Env(renderer, P);
scene.environment = env.update(P);
scene.add(makeSky(P));
const strips = makeStrips(P), back = makeBackLight(P); scene.add(strips, back);
const sky = scene.children[0];

const ribGeo = new THREE.BufferGeometry();
const ribMat = new THREE.MeshPhysicalMaterial({ vertexColors: true, color: 0xffffff, roughness: P.rough, metalness: P.metal,
  clearcoat: P.coat, clearcoatRoughness: 0.04, envMapIntensity: 1, side: THREE.DoubleSide });
/* "Vörös tükröződés": tint reflections by the base colour. Pure PBR metal turns white at grazing angles (Fresnel), and the
 * low camera sees most of the sheet at grazing angles; the reference keeps the undersides red. Silver areas stay neutral. */
const tintU = { value: P.tint };
ribMat.onBeforeCompile = sh => {
  sh.uniforms.uTint = tintU;
  sh.fragmentShader = 'uniform float uTint;\n' + sh.fragmentShader.replace('#include <lights_fragment_end>', `#include <lights_fragment_end>
  { vec3 tc = diffuseColor.rgb / max(max(diffuseColor.r, diffuseColor.g), max(diffuseColor.b, 1e-3));
    vec3 k = mix(vec3(1.0), tc, uTint);
    reflectedLight.indirectSpecular *= k; reflectedLight.directSpecular *= k;
    #ifdef USE_CLEARCOAT
    clearcoatSpecularIndirect *= mix(vec3(1.0), tc, uTint * 0.75);
    #endif
  }`);
};
const ribbon = new THREE.Mesh(ribGeo, ribMat); scene.add(ribbon);

let floor = null;
function makeFloorNow() {
  if (floor) { scene.remove(floor); floor.getRenderTarget().dispose(); floor.material.dispose(); }
  const s = renderer.getDrawingBufferSize(new THREE.Vector2());
  floor = makeFloor(P, Math.max(256, Math.round(s.x * 0.5)), Math.max(256, Math.round(s.y * 0.5))); scene.add(floor);
  if (info.contacts) setContacts(floor, info.contacts);
  floor.camera.layers.enable(1); // the mirror always sees the light strips
}
const info = { tris: 0, contacts: null };

// ---------- post ----------
const composer = new EffectComposer(renderer, new THREE.WebGLRenderTarget(1, 1, { type: THREE.HalfFloatType, samples: 4 }));
composer.addPass(new RenderPass(scene, camera));
const bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), P.bloom, 0.45, 1.6); composer.addPass(bloom);
composer.addPass(new OutputPass());

function resize() {
  const w = innerWidth, h = innerHeight, pr = Math.min(devicePixelRatio || 1, 2) * P.res;
  renderer.setPixelRatio(pr); renderer.setSize(w, h, false); composer.setPixelRatio(pr); composer.setSize(w, h);
  camera.aspect = w / h; camera.updateProjectionMatrix(); makeFloorNow();
}
addEventListener('resize', resize);

// ---------- apply ----------
function applyGeo() { const r = buildRibbon(ribGeo, P, P.silver); info.tris = r.tris; info.contacts = r.contacts; info.curve = r.curve; if (floor) setContacts(floor, r.contacts); placeHandles(); }
let envT = 0;
function applyLights() {
  layoutStrips(strips, P); strips.children.forEach((m, i) => m.layers.set(P.stripsSeen ? 0 : i < 3 ? 2 : 1)); // studio trick: lights hidden from the camera; overhead bars light via env only, side/back bars also in the floor mirror back.material.color.setRGB(1, 0.95, 0.88).multiplyScalar(P.backI * 6);
  sky.material.uniforms.uBackI.value = P.backI; sky.material.uniforms.uSky.value = P.sky;
  clearTimeout(envT); envT = setTimeout(() => { scene.environment = env.update(P); }, 60); // env follows the lights
}
function applyMat() {
  Object.assign(ribMat, { roughness: P.rough, metalness: P.metal, clearcoat: P.coat }); tintU.value = P.tint;
  const u = floor.material.uniforms; u.uRefl.value = P.refl; u.uBlur.value = P.blur; u.uAOk.value = P.ao; u.uRed.value.set(P.red);
  renderer.toneMapping = TONES[P.tone]; renderer.toneMappingExposure = P.exposure; bloom.strength = P.bloom;
}

// ---------- spine point editing ----------
const handles = new THREE.Group(); handles.visible = false; scene.add(handles);
const hMat = new THREE.MeshBasicMaterial({ color: 0x33aaff, depthTest: false }), hGeo = new THREE.SphereGeometry(0.12, 16, 8);
const tc = new TransformControls(camera, cv); tc.setSize(0.8); scene.add(tc.getHelper());
tc.addEventListener('dragging-changed', e => { orbit.enabled = !e.value; });
tc.addEventListener('objectChange', () => { const o = tc.object; if (!o) return; P.pts[o.userData.i] = [o.position.x, o.position.y / P.arch, o.position.z]; applyGeo(); });
function placeHandles() {
  while (handles.children.length < P.pts.length) { const m = new THREE.Mesh(hGeo, hMat); m.renderOrder = 10; handles.add(m); }
  P.pts.forEach((p, i) => { const m = handles.children[i]; if (tc.dragging && tc.object === m) return; m.position.set(p[0], p[1] * P.arch, p[2]); m.userData.i = i; });
}
const ray = new THREE.Raycaster();
cv.addEventListener('pointerdown', e => {
  if (!handles.visible || tc.dragging) return;
  ray.setFromCamera(new THREE.Vector2(e.clientX / innerWidth * 2 - 1, -(e.clientY / innerHeight) * 2 + 1), camera);
  const hit = ray.intersectObjects(handles.children)[0]; if (hit) tc.attach(hit.object);
});

// ---------- UI ----------
const $ = s => document.querySelector(s);
const fmt = v => (Math.abs(v) >= 10 ? v.toFixed(1) : v.toFixed(2));
function slider(k, label, min, max, step, on) {
  const wrap = document.createElement('div');
  const i = Object.assign(document.createElement('input'), { type: 'range', min, max, step, value: P[k] });
  i.setAttribute('aria-label', label); i.dataset.k = k;
  const o = document.createElement('output'); o.textContent = fmt(P[k]);
  i.oninput = () => { P[k] = +i.value; o.textContent = fmt(P[k]); on(); };
  return { i, o, wrap, label };
}
function row(parent, title, ...sl) {
  const r = document.createElement('div'); r.className = 'row';
  if (sl.length === 1) { const s = sl[0]; const l = document.createElement('label'); l.append(title, s.o); r.append(l, s.i); }
  else { const l = document.createElement('label'); l.textContent = title; const g = document.createElement('div'); g.className = 'pair';
    for (const s of sl) { const c = document.createElement('div'); const sm = document.createElement('small'); sm.append(s.label + ' ', s.o); c.append(sm, s.i); g.append(c); }
    r.append(l, g); }
  parent.append(r);
}
const main = $('#main'), adv = $('#adv');
// the 8 main controls (brief): spine arch, width/taper, thickness, roughness, coat/metal, light strip, floor reflection, exposure
row(main, 'Gerinc íve', slider('arch', 'Ív', 0.4, 1.6, 0.01, applyGeo));
row(main, 'Szélesség / taper', slider('width', 'szél.', 2, 12, 0.05, applyGeo), slider('taper', 'taper', -0.9, 0.9, 0.01, applyGeo));
row(main, 'Vastagság', slider('thick', 'Vastagság', 0.02, 0.6, 0.005, applyGeo));
row(main, 'Vörös anyag érdessége', slider('rough', 'Érdesség', 0.02, 0.8, 0.01, applyMat));
row(main, 'Lakkréteg / fémesség', slider('coat', 'lakk', 0, 1, 0.01, applyMat), slider('metal', 'fém', 0, 1, 0.01, applyMat));
row(main, 'Fénycsík helye / mérete', slider('stripPos', 'hely', -6, 6, 0.05, applyLights), slider('stripSize', 'méret', 0.2, 2.5, 0.01, applyLights));
row(main, 'Padlóreflexió', slider('refl', 'Reflexió', 0, 1.6, 0.01, applyMat));
row(main, 'Expozíció', slider('exposure', 'Expozíció', 0.3, 2.5, 0.01, applyMat));
// advanced
row(adv, 'Lelógás iránya (eleje / vége)', slider('lean', 'eleje', -2.5, 2.5, 0.01, applyGeo), slider('leanEnd', 'vége', -2.5, 2.5, 0.01, applyGeo));
row(adv, 'Keresztirányú hajlítás', slider('bend', 'Hajlítás', -0.5, 0.5, 0.005, applyGeo));
row(adv, 'Csavarodás', slider('twist', 'Csavarodás', -3, 3, 0.01, applyGeo));
row(adv, 'Padló-összeolvadás (lekerekítés)', slider('fillet', 'Sugár', 0, 1.2, 0.01, applyGeo));
row(adv, 'Kontakt-árnyék / reflexió elmosás', slider('ao', 'árnyék', 0, 2, 0.01, applyMat), slider('blur', 'elmosás', 0, 4, 0.01, applyMat));
row(adv, 'Vörös tükröződés', slider('tint', 'Tónus', 0, 1, 0.01, applyMat));
row(adv, 'Ezüst felső oldal', slider('silver', 'Ezüst', 0, 1, 0.01, applyGeo));
row(adv, 'Hátsó fény / stúdió', slider('backI', 'hátsó', 0, 4, 0.01, applyLights), slider('sky', 'stúdió', 0.3, 2, 0.01, applyLights));
row(adv, 'Glow (finom)', slider('bloom', 'Glow', 0, 1, 0.01, applyMat));
{
  const r = document.createElement('div'); r.className = 'row';
  const sel = (label, k, opts, on) => { const l = document.createElement('label'); l.textContent = label; const s = document.createElement('select'); s.setAttribute('aria-label', label);
    for (const [v, t] of opts) s.append(new Option(t, v, false, String(P[k]) === String(v))); s.onchange = () => { P[k] = typeof DEF[k] === 'number' ? +s.value : s.value; on(); }; r.append(l, s); };
  sel('Tónusleképezés', 'tone', [['neutral', 'Khronos PBR Neutral'], ['agx', 'AgX'], ['aces', 'ACES filmes']], applyMat);
  sel('Előnézeti felbontás', 'res', [['0.5', '50%'], ['0.75', '75%'], ['1', '100%']], resize);
  adv.append(r);
  const b = document.createElement('div'); b.className = 'btns';
  const btn = (t, fn, pressed) => { const e = Object.assign(document.createElement('button'), { type: 'button', textContent: t }); if (pressed != null) e.setAttribute('aria-pressed', String(pressed)); e.onclick = () => fn(e); b.append(e); return e; };
  btn('Gerincpontok szerkesztése', e => { handles.visible = !handles.visible; e.setAttribute('aria-pressed', String(handles.visible)); if (!handles.visible) tc.detach(); }, false);
  btn('Fénycsíkok a kamerának', e => { P.stripsSeen = !P.stripsSeen; e.setAttribute('aria-pressed', String(P.stripsSeen)); applyLights(); }, P.stripsSeen);
  btn('Referencia-nézet', () => setView('ref')); btn('Másik nézet', () => setView('alt'));
  btn('Alapállapot', () => { Object.assign(P, structuredClone(DEF)); document.querySelectorAll('input[type=range]').forEach(i => { i.value = P[i.dataset.k]; i.oninput(); }); applyAll(); });
  btn('Mérés', () => bench().then(r => console.table(r)));
  adv.append(b);
}
function setView(n) { const v = VIEWS[n]; camera.position.set(...v.pos); orbit.target.set(...v.tgt); orbit.update(); }
function applyAll() { applyGeo(); applyLights(); applyMat(); }

// ---------- loop + HUD ----------
const hud = $('#hud'); let last = performance.now(), ema = 16, frames = 0, hudT = 0;
function frame(now) {
  const dt = now - last; last = now; ema += (dt - ema) * 0.05; frames++;
  orbit.update(); composer.render();
  if (now - hudT > 400) { hudT = now; const s = renderer.getDrawingBufferSize(new THREE.Vector2());
    hud.innerHTML = `<b>${(1000 / ema).toFixed(0)} fps</b> · ${ema.toFixed(1)} ms\n${s.x}×${s.y} · MSAA 4× · ${(info.tris / 1000).toFixed(0)}k háromszög\nenv újraépítés ${env.ms.toFixed(1)} ms`; }
  requestAnimationFrame(frame);
}

/** Synchronous cost per element: N frames each, GPU flushed with a 1-px readback. Real GPU only means something. */
async function bench(N = 40) {
  const gl = renderer.getContext(), px = new Uint8Array(4);
  const run = () => { const t0 = performance.now(); for (let i = 0; i < N; i++) { composer.render(); gl.readPixels(0, 0, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, px); } return (performance.now() - t0) / N; };
  const out = {}; run();
  out['teljes'] = run();
  bloom.enabled = false; out['glow nélkül'] = run(); bloom.enabled = true;
  floor.visible = false; out['tükröző padló nélkül'] = run(); floor.visible = true;
  ribbon.visible = false; out['szalag nélkül'] = run(); ribbon.visible = true;
  const s = renderer.getDrawingBufferSize(new THREE.Vector2());
  const r = Object.fromEntries(Object.entries(out).map(([k, v]) => [k, +v.toFixed(2)]));
  r.felbontas = `${s.x}x${s.y}`; r.gpu = (() => { const e = gl.getExtension('WEBGL_debug_renderer_info'); return e ? gl.getParameter(e.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER); })();
  window.__bench = r; return r;
}
window.__vel = { THREE, P, tc, handles, applyAll, setView, bench, renderer, scene, camera, orbit, look: (p, t) => { camera.position.set(...p); orbit.target.set(...t); orbit.update(); } };

resize(); applyAll(); requestAnimationFrame(frame);
