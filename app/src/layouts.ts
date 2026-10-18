// M10 korai: layout receipts. Magazinrács (own editorial study after WIDE, not an original port): a group of framed
// image layers + live text, re-arranged per canvas aspect (1:1 · 4:5 · 9:16 · 16:9) and per title length, with a
// staggered arrival. Szövött galéria: native port of Unwoven (Clément Grellier, MIT) — ribbon geometry + original
// shaders, a scrolling card row that unravels at the edges, pure function of time (seekable).
import { R } from './runtime';
import { EFFECTS, BASEK, S, SEL } from './effects/index';
import { U, gl, clearTarget } from './gl';
import { ev } from './evaluation';
import { assets, imgTex, makeGroup, makeLayer, st, walk, findItem } from './state';
import { loadAsset } from './text';
import { LIB } from './library';
import { link2, resizeMain } from './render';
import { commit } from './history';

/* ---------- placeholder photos (deterministic, so identical ids/content dedupe) ---------- */
const PH = [['#e8d9c4', '#7a4e3a'], ['#c9d6e3', '#2d3e5c'], ['#e9c7c9', '#6b2a3a'], ['#d4e0c8', '#3b5236'], ['#e6dcb0', '#6a5520'], ['#d8cbe6', '#40305e']];
export function placeholderAsset(i: number) {
  const id = 'LAYPH' + (i + 1); if (assets[id]) { loadAsset(id); return id; }
  const c = document.createElement('canvas'); c.width = 480; c.height = 600; const g = c.getContext('2d')!, [a, b] = PH[i % PH.length];
  const gr = g.createLinearGradient(0, 0, 480, 600); gr.addColorStop(0, a); gr.addColorStop(1, b); g.fillStyle = gr; g.fillRect(0, 0, 480, 600);
  g.fillStyle = 'rgba(255,255,255,.18)'; g.beginPath(); g.arc(240, 250, 150, 0, Math.PI * 2); g.fill();
  g.fillStyle = 'rgba(0,0,0,.35)'; g.font = '600 64px system-ui,sans-serif'; g.textAlign = 'center'; g.fillText(String(i + 1), 240, 520);
  assets[id] = c.toDataURL('image/jpeg', .85); loadAsset(id); return id;
}

/* ---------- Magazinrács ---------- */
// rects in % of the content box [x, y, w, h], y down (independent study after WIDE's five compositions)
export const COMPS = [
  [[0, 0, 65, 100], [71, 3, 29, 29], [71, 65, 29, 35]],
  [[0, 4, 37, 82], [42, 22, 58, 78], [73, 0, 27, 18]],
  [[0, 0, 100, 100], [5, 60, 22, 35], [73, 5, 22, 35]],
  [[0, 0, 48, 100], [52, 0, 48, 100], [38, 64, 24, 31]],
  [[0, 28, 65, 72], [70, 0, 30, 55], [70, 61, 30, 39]],
];
export const COMP_NAMES = ['Nagy + két kicsi', 'Lépcső', 'Teljes kép', 'Kettős', 'Oszlop'];
export const ASPECTS: [string, string][] = [['1080x1080', '1:1'], ['1080x1350', '4:5'], ['1080x1920', '9:16'], ['1920x1080', '16:9']];
const aspectOf = () => { const [w, h] = String(st.size || '1920x1080').split('x').map(Number); return w > 0 && h > 0 ? w / h : 16 / 9; };

/** Place every part of a Magazinrács group for the current canvas aspect, composition and title length. */
export function relayout(g: any) {
  const Lo = g && g.layout; if (!Lo) return; const A = aspectOf(), m = .06, gut = .012;
  const portrait = A < .9, comp = COMPS[Lo.comp % COMPS.length].map(r => portrait ? [r[1], r[0], r[3], r[2]] : r);
  const kids = g.children; const imgs = kids.filter((k: any) => k.role === 'img'), title = kids.find((k: any) => k.role === 'title'), sub = kids.find((k: any) => k.role === 'sub');
  const bx0 = -A / 2 + m, BW = A - 2 * m, top = .5 - m, BH = 1 - 2 * m - (portrait ? .22 : .16);   // bottom band = title area
  imgs.forEach((L: any, i: number) => { const r = comp[i] || comp[0];
    L.n.x.v = bx0 + (r[0] + r[2] / 2) / 100 * BW; L.n.y.v = top - (r[1] + r[3] / 2) / 100 * BH; L.n.s.v = 1;
    L.p.fw.v = Math.max(.02, r[2] / 100 * BW - gut); L.p.fh.v = Math.max(.02, r[3] / 100 * BH - gut); });
  const band = -.5 + m + (portrait ? .22 : .16) / 2;
  if (title) { const n = Math.max(4, String(title.text && title.text.str || '').length); title.n.x.v = 0; title.n.y.v = band + .02;
    title.n.s.v = Math.max(.035, Math.min(portrait ? .11 : .1, BW * 1.7 / n)); }
  if (sub) { sub.n.x.v = 0; sub.n.y.v = band - .055; sub.n.s.v = Math.min(.026, BW * .9 / Math.max(10, String(sub.text && sub.text.str || '').length)); }
}
export function makeMagazine(comp = 0) {
  const bg = makeLayer('gradient', { name: 'Papír', pal: 17, p: { span: .35, speed: 0, mode: 1 } });
  const imgs = [0, 1, 2].map(i => { const L: any = makeLayer('image', { name: `Kép ${i + 1}`, asset: placeholderAsset(i) }); L.role = 'img'; L.p.round.v = .006;
    L.tm = { in: [2, 5, 4][i], inAt: .15 + i * .22, inDur: .9, out: 0, outAt: 9, outDur: .8, ease: 0 }; return L; });
  const title: any = makeLayer('mtext', { name: 'Cím', text: { str: 'NYÁRI KOLLEKCIÓ', font: 'Bricolage Grotesque', weight: '800', track: -.02, align: 'center' }, p: { anim: 2, unit: 1, start: .8, dur: .7, stagger: .08, ease: 5, fill: 0, color1: '#141216' } });
  title.role = 'title';
  const sub: any = makeLayer('mtext', { name: 'Alcím', text: { str: 'VOL. 01 · SZERKESZTŐI VÁLOGATÁS', font: 'Inter', weight: '500', track: .05, align: 'center' }, p: { anim: 1, start: 1.3, dur: .6, fill: 0, color1: '#3a3438' } });
  sub.role = 'sub';
  const g: any = makeGroup('Magazinrács', [bg, ...imgs, title, sub], { open: true }); g.recipe = 'Magazinrács'; g.layout = { k: 'wide', comp };
  relayout(g); return g;
}
/** Re-run every Magazinrács after a canvas size / text change (called by the layout controls). */
export function relayoutAll() { walk(st.layers, (it: any) => { if (it.layout && it.layout.k === 'wide') relayout(it); }); }
R.relayoutAll = relayoutAll;

/** Inspector controls for a layout group: composition, aspect chips, title text. */
export function layoutControls(g: any, h: any) {
  if (!g.layout || g.layout.k !== 'wide') return null;
  const seg = (labels: string[], cur: number, on: (i: number) => void) => h('div', { class: 'seg', role: 'group' }, ...labels.map((l, i) => h('button', { 'aria-pressed': String(i === cur), onclick: () => on(i) }, l)));
  const done = () => { relayout(g); commit(); R.renderInsp && R.renderInsp(); };
  const title = g.children.find((k: any) => k.role === 'title');
  const ti = h('input', { class: 'txt', value: title ? title.text.str : '', 'aria-label': 'Cím' }); ti.onchange = () => { if (title) title.text.str = ti.value; done(); };
  const curA = ASPECTS.findIndex(a => a[0] === st.size);
  return h('div', { class: 'fxb' },
    h('div', { class: 'row2' }, h('span', null, 'Kompozíció'), seg(['1', '2', '3', '4', '5'], g.layout.comp, i => { g.layout.comp = i; done(); })),
    h('p', { class: 'small' }, COMP_NAMES[g.layout.comp] || ''),
    h('div', { class: 'row2' }, h('span', null, 'Képarány'), seg(ASPECTS.map(a => a[1]), curA, i => { st.size = ASPECTS[i][0]; resizeMain(); relayoutAll(); commit(); R.renderInsp && R.renderInsp(); })),
    h('div', { class: 'row2' }, h('span', null, 'Cím'), ti),
    h('p', { class: 'small' }, 'Képcsere: jelöld ki a képet a rétegek között, és tölts be sajátot. A cím mérete a hosszához igazodik.'));
}

/* ---------- Szövött galéria (Unwoven port) ---------- */
EFFECTS.unwoven = { kind: 'gen', name: 'Szövött galéria', noPal: true, desc: 'Képkártyák sora, amely a vászon szélén szálakra bomlik (Unwoven, Clément Grellier, MIT). Visszatekerhető; a képek cserélhetők.',
  main: ['speed', 'strength', 'zone', 'cardh'],
  params: [S('speed', 'Sodródás (egység/mp)', -1, 1, .12), S('strength', 'Bomlás', 0, 1, 1), S('zone', 'Bomlási sáv', .05, .6, .28), S('wobble', 'Lebegés', 0, 2, 1),
    S('cardh', 'Kártya magasság', .2, 1, .62), S('cardw', 'Kártya szélesség (× magasság)', .4, 1.6, .78), S('gap', 'Térköz', 0, .2, .035), S('radius', 'Sarok', 0, .08, .018),
    S('threads', 'Szálak', 8, 96, 48), S('seed', 'Véletlen', 0, 99, 7), S('offset', 'Eltolás', -4, 4, 0)],
  code: 'vec4 fx(){return vec4(0.0);}' } as any;
const VS = `#version 300 es
precision highp float;
layout(location=0) in vec2 aPos; layout(location=1) in vec2 aUv; layout(location=2) in float aRim; layout(location=3) in float aThread;
uniform vec2 uRes; uniform vec2 uOff; uniform float uTime; uniform float uHalfWidth; uniform float uZone; uniform float uStrength; uniform float uWobble; uniform float uSeed;
out vec2 vUv; out float vTear; out float vRim; out float vRandom;
float hash(float n){return fract(sin(n*127.1+311.7)*43758.5453);}
void main(){ vUv=aUv; vRim=aRim; vec2 world=aPos+uOff; float x=world.x;
  float left=1.0-smoothstep(-uHalfWidth,-uHalfWidth+uZone,x); float right=smoothstep(uHalfWidth-uZone,uHalfWidth,x); float tear=max(left,right)*uStrength;
  float direction=x<0.0?-1.0:1.0; float randomA=hash(aThread+uSeed*57.0); float randomB=hash(aThread*3.7+uSeed*91.0); vRandom=randomA;
  float t=pow(tear,1.4); float run=t*(60.0+randomA*420.0); run*=0.85+0.15*sin(uTime*(1.0+randomB*2.0)+randomA*6.2831); world.x+=direction*run;
  world.y+=(randomA-0.5)*170.0*t*t; world.y+=sin(world.x*0.02+uTime*(1.6+randomA*2.2)+randomA*6.2831)*(5.0+13.0*randomA)*t*uWobble;
  vTear=tear; gl_Position=vec4(world/(uRes*0.5),0.0,1.0); }`;
const FS = `#version 300 es
precision highp float; uniform sampler2D uMap; uniform vec2 uCardSize; uniform float uRadius; uniform float uImageAspect;
in vec2 vUv; in float vTear; in float vRim; in float vRandom; out vec4 o;
float sdRoundBox(vec2 p,vec2 b,float r){vec2 q=abs(p)-b+r;return length(max(q,0.0))+min(max(q.x,q.y),0.0)-r;}
void main(){ float tear=vTear; float rim=abs(vRim);
  float coreWidth=mix(0.8,0.16+vRandom*0.12,smoothstep(0.0,0.85,tear)); float threadAlpha=1.0-smoothstep(coreWidth-0.10,coreWidth+0.06,rim); threadAlpha=mix(1.0,threadAlpha,smoothstep(0.03,0.30,tear));
  vec2 p=(vUv-0.5)*uCardSize; float cardAlpha=1.0-smoothstep(-1.5,0.5,sdRoundBox(p,uCardSize*0.5,uRadius));
  float fade=1.0-smoothstep(0.75,1.0,tear)*0.65; float alpha=cardAlpha*threadAlpha*fade; if(alpha<0.003)discard;
  float cardAspect=uCardSize.x/uCardSize.y; vec2 scale=cardAspect>uImageAspect?vec2(1.0,uImageAspect/cardAspect):vec2(cardAspect/uImageAspect,1.0);
  vec3 color=texture(uMap,(vUv-0.5)*scale+0.5).rgb;
  color*=1.0-tear*0.4*rim*rim; color+=tear*0.18*(1.0-smoothstep(0.0,0.45,rim)); color=mix(color,vec3(1.0),smoothstep(0.55,1.0,tear)*0.8);
  o=vec4(color*alpha,alpha); }`;
let PROG: any = null, VAO: any = null, VBO: any = null, IBO: any = null, GEO: any = null;
/** Original ribbon geometry (buildRibbonGeometry), interleaved pos(2) uv(2) rim thread, in pixels. */
function ribbon(width: number, height: number, threads: number, segments = 48) {
  const cols = segments + 1, per = cols * 2, V = new Float32Array(threads * per * 6), I: number[] = []; let v = 0;
  for (let t = 0; t < threads; t++) { for (let row = 0; row < 2; row++) { const vy = (t + row) / threads; for (let c = 0; c < cols; c++) { const ux = c / segments; V.set([(ux - .5) * width, (vy - .5) * height, ux, vy, row === 0 ? -1 : 1, t], v * 6); v++; } }
    const b = t * per; for (let c = 0; c < segments; c++) { const bl = b + c, br = b + c + 1, tl = b + cols + c, tr = b + cols + c + 1; I.push(bl, br, tl, br, tr, tl); } }
  return { V, I: new Uint32Array(I) };
}
function prog() { if (PROG) return PROG === 'err' ? null : PROG; try { PROG = link2(VS, FS); VAO = gl.createVertexArray(); VBO = gl.createBuffer(); IBO = gl.createBuffer(); } catch (e) { R.unwovenErr = String(e); PROG = 'err'; return null; } return PROG; }
export const galleryAssets = (L: any) => (Array.isArray(L.imgs) && L.imgs.length ? L.imgs : [0, 1, 2, 3, 4, 5].map(placeholderAsset));
const PV = (L: any, k: string, t: number) => { const d = EFFECTS.unwoven.params.find((x: any) => x.k === k), v = L.p[k]; return v ? ev(v, d, t) : d.def; };
/** Card centres (pixels) at t: a row of cards drifting with `speed`, wrapped so the row is endless. Exported for tests. */
export function cardsAt(L: any, t: number, W: number, H: number) {
  const ch = PV(L, 'cardh', t) * H, cw = ch * PV(L, 'cardw', t), gap = PV(L, 'gap', t) * H, n = galleryAssets(L).length, step = cw + gap, span = step * n;
  const shift = ((PV(L, 'speed', t) * t + PV(L, 'offset', t)) * H) % span; const out: { x: number; y: number; i: number }[] = [];
  const cx = ev(L.n.x, BASEK.x, t) * H, cy = ev(L.n.y, BASEK.y, t) * H;
  for (let k = -1; k <= Math.ceil(W / span) + 1; k++) for (let i = 0; i < n; i++) { let x = i * step - shift + k * span - span / 2 + step / 2 + cx; if (x > -W / 2 - cw && x < W / 2 + cw) out.push({ x, y: cy, i }); }
  return { cw, ch, cards: out };
}
export function drawUnwoven(L: any, target: any, ctx: any, t: number) {
  clearTarget(target); const p = prog(); if (!p) return; const W = ctx.w, H = ctx.h, C = cardsAt(L, t, W, H), threads = Math.round(PV(L, 'threads', t));
  const key = [Math.round(C.cw), Math.round(C.ch), threads].join(); gl.bindVertexArray(VAO);
  if (!GEO || GEO.key !== key) { const G = ribbon(C.cw, C.ch, threads); gl.bindBuffer(gl.ARRAY_BUFFER, VBO); gl.bufferData(gl.ARRAY_BUFFER, G.V, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, IBO); gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, G.I, gl.STATIC_DRAW);
    const F = 24; gl.enableVertexAttribArray(0); gl.vertexAttribPointer(0, 2, gl.FLOAT, false, F, 0); gl.enableVertexAttribArray(1); gl.vertexAttribPointer(1, 2, gl.FLOAT, false, F, 8);
    gl.enableVertexAttribArray(2); gl.vertexAttribPointer(2, 1, gl.FLOAT, false, F, 16); gl.enableVertexAttribArray(3); gl.vertexAttribPointer(3, 1, gl.FLOAT, false, F, 20); GEO = { key, n: G.I.length }; }
  gl.bindFramebuffer(gl.FRAMEBUFFER, target.f); gl.viewport(0, 0, W, H); gl.useProgram(p);
  const u1 = (n: string, v: number) => gl.uniform1f(U(p, n), v);
  gl.uniform2f(U(p, 'uRes'), W, H); u1('uTime', t); u1('uHalfWidth', W / 2); u1('uZone', PV(L, 'zone', t) * W / 2); u1('uStrength', PV(L, 'strength', t)); u1('uWobble', PV(L, 'wobble', t));
  u1('uSeed', PV(L, 'seed', t)); gl.uniform2f(U(p, 'uCardSize'), C.cw, C.ch); u1('uRadius', PV(L, 'radius', t) * H); gl.uniform1i(U(p, 'uMap'), 0);
  gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA); gl.activeTexture(gl.TEXTURE0); const ids = galleryAssets(L);
  for (const c of C.cards) { const m = imgTex.get(ids[c.i]); if (!m) { loadAsset(ids[c.i]); continue; } gl.bindTexture(gl.TEXTURE_2D, m.tex); u1('uImageAspect', m.w / m.h);
    gl.uniform2f(U(p, 'uOff'), c.x, c.y); gl.drawElements(gl.TRIANGLES, GEO.n, gl.UNSIGNED_INT, 0); }
  gl.disable(gl.BLEND); gl.bindVertexArray(null);
}
EFFECTS.unwoven.draw = drawUnwoven;

/* ---------- library entries (Receptek, Layout theme) ---------- */
LIB.recipes.push({ name: 'Magazinrács', desc: 'layout magazin racs grid kepek cim kepkarany', make: () => makeMagazine(0) } as any,
  { name: 'Szövött galéria', desc: 'layout galeria kartya kepek unwoven szal', make: () => { const L: any = makeLayer('unwoven', { name: 'Szövött galéria' }); L.imgs = galleryAssets(L); return L; } } as any);
export const LAYOUT_READY = true;
R.layoutControls = layoutControls;
void findItem; void SEL;
