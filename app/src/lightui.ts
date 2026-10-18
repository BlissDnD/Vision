/* M6 · Jelenetfény: one global key light for obj3d / sdfscene (render.ts lightU), direct controls first
 * ("lágyabb", "nagyobb csillanás", "melegebb"), global and per-layer switch, and glint drag on the canvas:
 * clicking a point of the object turns the light so that its highlight lands there. */
import { R } from './runtime';
import { h } from './dom';
import { BASEK, EFFECTS } from './effects/index';
import { LIGHTP, st } from './state';
import { ev, setVal } from './evaluation';
import { ctlParam, ctlSlider, ctlSwitch, section } from './controls';
import { commit } from './history';
import { markDirty } from './loop';

export const usesLight = (L: any) => !!(L && (L.type === 'obj3d' || L.type === 'sdfscene' || L.type === 'cloud3d' || L.type === 'terrain3d'));
const D = (k: string) => LIGHTP.find(d => d.k === k)!;

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
  const v = lightFromGlint(cx, cy, r, p.x, p.y); st.light.on = true; setVal(st.light.p.az, v.az); setVal(st.light.p.el, v.el); markDirty(); return v;
}

export function lightSection(L: any) {
  const re = () => import('./inspector').then(m => m.renderInsp());
  const kids: any[] = [
    ctlSwitch('Jelenetfény (minden 3D tárgyra)', st.light.on, (v: boolean) => { st.light.on = v; commit(); re(); }),
    ctlParam(L, EFFECTS[L.type].params.find((d: any) => d.k === 'sceneL')),
    h('div', { class: 'btnrow' }, h('button', { class: 'btn' + (R.glint ? ' accent' : ''), 'aria-pressed': String(!!R.glint), title: 'Bekapcsolva a tárgyon húzva a fény úgy fordul, hogy a csillanás az egér alatt legyen.',
      onclick: () => { R.glint = !R.glint; re(); } }, R.glint ? 'Csillanás húzása: be' : 'Csillanás húzása a vásznon')),
  ];
  for (const k of ['soft', 'size', 'warm', 'pow', 'az', 'el']) kids.push(ctlSlider(st.light.p[k], D(k)));
  kids.push(h('p', { class: 'small' }, 'A fény közös: minden 3D tárgyra és 3D jelenetre hat, amelyeknél a „Jelenetfény hat rá” be van kapcsolva. A Gerincfelületnek saját stúdiófénye van (Fény csoport).'));
  return section('Jelenetfény', 'light', true, ...kids);
}
