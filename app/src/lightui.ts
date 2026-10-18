/* M6 · Scene light: one global key light for obj3d / sdfscene (render.ts lightU), direct controls first
 * ("softer", "larger glint", "melegebb"), global and per-layer switch, and glint drag on the canvas:
 * clicking a point of the object turns the light so that its highlight lands there.
 * FÉNY2: further lights (st.light.more) as chips; the active chip (R.lightSel) gets the sliders and the glint drag. */
import { R } from './runtime';
import { h } from './dom';
import { BASEK, EFFECTS } from './effects/index';
import { LIGHTP, XLIGHT_MAX, makeXLight, st } from './state';
import { ev, setVal } from './evaluation';
import { ctlParam, ctlSelect, ctlSlider, ctlSwitch, section } from './controls';
import { lightRGB } from './render';
import { commit } from './history';
import { markDirty } from './loop';

export const usesLight = (L: any) => !!(L && (L.type === 'obj3d' || L.type === 'sdfscene' || L.type === 'cloud3d' || L.type === 'terrain3d'));
const D = (k: string) => LIGHTP.find(d => d.k === k)!;
R.lightSel = 0;   // 0 = main light, i = st.light.more[i-1]
/** The light the sliders and the glint drag act on. */
export function activeLight() { const m = st.light.more || []; if (R.lightSel > m.length) R.lightSel = 0; return R.lightSel ? m[R.lightSel - 1] : st.light; }
const wrap = (a: number) => ((a + 540) % 360) - 180;
/** Add a further light; each new one gets a different role relative to the main light: rim, cool fill, warm top. */
export function addLight() {
  const m = st.light.more || (st.light.more = []); if (m.length >= XLIGHT_MAX) return null; const az = st.light.p.az.v;
  const P = [{ az: wrap(az + 180), el: 20, pow: .9, warm: -.2, size: .3, shape: 1 }, { az: wrap(az + 95), el: 8, pow: .45, warm: -.6, size: .6, shape: 2 }, { az: wrap(az - 100), el: 62, pow: .6, warm: .5, size: .2, shape: 3 }][m.length];
  const x = makeXLight(P); m.push(x); st.light.on = true; R.lightSel = m.length; return x;
}
export function removeLight(i: number) { const m = st.light.more || []; if (i < 1 || i > m.length) return; m.splice(i - 1, 1); R.lightSel = Math.min(R.lightSel, m.length); if (R.lightSel === i) R.lightSel = 0; }
const swatch = (o: any) => { const c = lightRGB(o.p.warm.v, 1).map((x: number) => Math.round(Math.min(1, x) * 255)); return `rgb(${c[0]},${c[1]},${c[2]})`; };

/** Glint drag for a raymarched object: treat the object as a sphere around its screen centre (radius r, canvas-height units).
 * The highlight is where the normal halves light and view (camera looks down −z), so L = 2(n·v)n − v. */
export function lightFromGlint(cx: number, cy: number, r: number, px: number, py: number) {
  let nx = (px - cx) / r, ny = (py - cy) / r; const q = nx * nx + ny * ny; if (q > 0.98) { const k = Math.sqrt(0.98 / q); nx *= k; ny *= k; }
  const nz = Math.sqrt(Math.max(0, 1 - nx * nx - ny * ny)), Lx = 2 * nz * nx, Ly = 2 * nz * ny, Lz = 2 * nz * nz - 1;
  const el = Math.asin(Math.max(-1, Math.min(1, Ly))) * 180 / Math.PI, az = Math.atan2(Lx, Lz) * 180 / Math.PI;
  return { az: Math.round(az * 10) / 10, el: Math.round(Math.max(D('el').min, Math.min(D('el').max, el)) * 10) / 10 };
}
export function glint3(L: any, p: { x: number, y: number }, t = R.time) {
  const s = ev(L.n.s, BASEK.s, t), cx = ev(L.n.x, BASEK.x, t), cy = ev(L.n.y, BASEK.y, t), r = Math.max(0.02, 0.39 * s);
  const v = lightFromGlint(cx, cy, r, p.x, p.y), A = activeLight(); st.light.on = true; setVal(A.p.az, v.az); setVal(A.p.el, v.el); markDirty(); return v;
}

export function lightSection(L: any) {
  const re = () => import('./inspector').then(m => m.renderInsp());
  const kids: any[] = [
    ctlSwitch('Scene light (for every 3D object)', st.light.on, (v: boolean) => { st.light.on = v; commit(); re(); }),
    ctlParam(L, EFFECTS[L.type].params.find((d: any) => d.k === 'sceneL')),
    h('div', { class: 'btnrow' }, h('button', { class: 'btn' + (R.glint ? ' accent' : ''), 'aria-pressed': String(!!R.glint), title: 'When on, dragging on the object turns the light so the glint stays under the pointer.',
      onclick: () => { R.glint = !R.glint; re(); } }, R.glint ? 'Glint drag: on' : 'Drag the glint on the canvas')),
  ];
  const more = st.light.more || [], A = activeLight();
  const chip = (i: number, o: any, label: string) => h('button', { class: 'btn lchip' + (R.lightSel === i ? ' accent' : '') + (o.on ? '' : ' off'), 'aria-pressed': String(R.lightSel === i), 'data-light': String(i),
    title: i ? 'Additional light (no shadow). Click to make it active; the sliders and glint drag move this one.' : 'Main light (this one casts the shadow).', onclick: () => { R.lightSel = i; re(); } },
    h('span', { class: 'ldot', style: `display:inline-block;width:8px;height:8px;border-radius:50%;margin-right:5px;background:${swatch(o)}` }), label);
  kids.push(h('div', { class: 'btnrow lchips' }, chip(0, st.light, 'Main'), ...more.map((x: any, i: number) => chip(i + 1, x, String(i + 2))),
    more.length < XLIGHT_MAX ? h('button', { class: 'btn', title: 'New light: first a back light, then a cool fill, then a warm top light.', onclick: () => { addLight(); commit(); re(); } }, '+ Light') : null));
  if (R.lightSel) { const i = R.lightSel; kids.push(ctlSwitch('This light on', A.on, (v: boolean) => { A.on = v; commit(); re(); }),
    h('div', { class: 'btnrow' }, h('button', { class: 'btn', onclick: () => { removeLight(i); commit(); re(); } }, 'Delete light'))); }
  for (const k of R.lightSel ? ['size', 'warm', 'pow', 'az', 'el'] : ['soft', 'size', 'warm', 'pow', 'az', 'el']) kids.push(ctlSlider(A.p[k], D(k)));
  kids.push(ctlSelect(A.p.shape, D('shape')));
  kids.push(h('p', { class: 'small' }, 'The light is shared: it affects every 3D object and 3D scene that has “Scene light affects it” turned on. Additional lights cast no shadow; their shape shows as a reflection on glossy surfaces. The Spine surface has its own studio light (Light group).'));
  return section('Scene light', 'light', true, ...kids);
}
