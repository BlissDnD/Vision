/* Rétegválasztás a vásznon: mi van a kattintási pont alatt?
 * Pixel-exact and type-agnostic: every candidate (top-level item; children of an open group) is rendered alone into a
 * small offscreen context, on black and on white, and compared with the empty scene at the clicked pixel (3×3). Collapsed groups count as one unit.
 *  - right click on the canvas: list of hits, topmost first, with a tiny preview → click selects
 *  - Alt+click (or a plain click when nothing is selected): select the topmost hit directly
 * Selection stays sticky afterwards: the next drag moves the chosen item, as before. */
import { R } from './runtime';
import { $, h } from './dom';
import { kindOf, iconKind, KIND_LABEL } from './effects/index';
import { cv, freeCtx, freeTarget, gl, mkCtx, mkTarget } from './gl';
import { copyTo, outSize, renderScene } from './render';
import { sel, st } from './state';
import { renderAll } from './history';
import { toast } from './modals';

const PW = 192;
let PC: any = null, PT: any = null;
function pickCtx() {
  const { W, H } = outSize(), w = PW, hh = Math.max(8, Math.round(PW * H / W));
  if (!PC || PC.w !== w || PC.h !== hh) { if (PC) freeCtx(PC); if (PT) freeTarget(PT); PC = mkCtx(w, hh); PT = mkTarget(w, hh, gl.RGBA8, gl.UNSIGNED_BYTE); }
  return PC;
}
function renderPixels(items: any[], bg = st.bg) {
  const ctx = pickCtx(); const out = renderScene(items, ctx, R.time, bg); copyTo(out.t, PT);
  const b = new Uint8Array(PT.w * PT.h * 4); gl.bindFramebuffer(gl.FRAMEBUFFER, PT.f); gl.readPixels(0, 0, PT.w, PT.h, gl.RGBA, gl.UNSIGNED_BYTE, b); return b;
}
/** Candidates in paint order (bottom → top). */
export function units(list = st.layers): any[] {
  const r: any[] = [];
  for (const it of list) { if (!it.vis) continue; if (it.type === 'group' && it.open) r.push(...units(it.children)); else r.push(it); }
  return r;
}
/** Items under a canvas point (u, v ∈ 0..1, v from the top), topmost first, each with a preview canvas. */
export function hitsAt(u: number, v: number) {
  // two backgrounds: a dark layer over a dark background still differs on white (covers the pixel)
  const bases = ['#000000', '#ffffff'].map(bg => renderPixels([], bg)), x = Math.min(PT.w - 1, Math.max(0, Math.floor(u * PT.w))), y = Math.min(PT.h - 1, Math.max(0, Math.floor((1 - v) * PT.h)));
  const hits: any[] = [];
  for (const it of units()) {
    let d = 0, px: Uint8Array = null as any;
    for (let bi = 0; bi < 2; bi++) { const base = bases[bi]; const q = renderPixels([it], bi ? '#ffffff' : '#000000'); if (!bi) px = q;
    for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) { // 3×3 so thin strokes are clickable
      const xx = Math.min(PT.w - 1, Math.max(0, x + dx)), yy = Math.min(PT.h - 1, Math.max(0, y + dy)), i = (yy * PT.w + xx) * 4;
      d = Math.max(d, Math.abs(q[i] - base[i]) + Math.abs(q[i + 1] - base[i + 1]) + Math.abs(q[i + 2] - base[i + 2])); } }
    let inBox = false;
    if (d <= 10) { // nothing drawn exactly here (e.g. the dark hole of a ring): inside the drawn footprint's bounding box still counts
      const b0 = bases[0]; let x0 = 1e9, x1 = -1, y0 = 1e9, y1 = -1;
      for (let yy = 0; yy < PT.h; yy++) for (let xx = 0; xx < PT.w; xx++) { const i = (yy * PT.w + xx) * 4;
        if (Math.abs(px[i] - b0[i]) + Math.abs(px[i + 1] - b0[i + 1]) + Math.abs(px[i + 2] - b0[i + 2]) > 10) { if (xx < x0) x0 = xx; if (xx > x1) x1 = xx; if (yy < y0) y0 = yy; if (yy > y1) y1 = yy; } }
      inBox = x >= x0 && x <= x1 && y >= y0 && y <= y1;
    }
    if (d > 10 || inBox) hits.push({ it, d, edge: !(d > 10), prev: preview(px) });
  }
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  return hits.reverse();
}
function preview(px: Uint8Array) {
  const c = document.createElement('canvas'); c.width = PT.w; c.height = PT.h; const g = c.getContext('2d')!, im = g.createImageData(PT.w, PT.h);
  for (let y = 0; y < PT.h; y++) im.data.set(px.subarray((PT.h - 1 - y) * PT.w * 4, (PT.h - y) * PT.w * 4), y * PT.w * 4);
  for (let i = 3; i < im.data.length; i += 4) im.data[i] = 255;
  g.putImageData(im, 0, 0); c.className = 'pickprev'; return c;
}
const uvOf = (e: MouseEvent) => { const r = cv.getBoundingClientRect(); return { u: (e.clientX - r.left) / r.width, v: (e.clientY - r.top) / r.height, inside: e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom }; };
function select(it: any) { R.selId = it.id; renderAll(); }

let menu: HTMLElement | null = null;
export function closePick() { if (menu) { menu.remove(); menu = null; } }
function openPick(e: MouseEvent, hits: any[]) {
  closePick();
  const rows = hits.map((x, i) => h('button', { class: 'mi pickrow' + (x.it.id === R.selId ? ' cur' : ''), onclick: () => { closePick(); select(x.it); } },
    x.prev, h('span', { class: 'lic', html: iconKind(kindOf(x.it)) }), h('span', null, x.it.name, h('small', null, ' ' + [i === 0 ? 'on top' : (KIND_LABEL as any)[kindOf(x.it)] || '', x.edge ? 'a kerete alatt' : ''].filter(Boolean).join(' · ')))));
  menu = h('div', { class: 'popover pickmenu', role: 'menu', 'aria-label': 'Layers under the click' },
    h('div', { class: 'pl' }, hits.length ? `Under the point: ${hits.length} layers` : 'No layer under the point'), ...rows);
  document.body.appendChild(menu);
  menu.style.left = Math.min(innerWidth - menu.offsetWidth - 8, e.clientX + 4) + 'px'; menu.style.top = Math.min(innerHeight - menu.offsetHeight - 8, e.clientY + 4) + 'px';
  setTimeout(() => document.addEventListener('pointerdown', function off(ev) { if (menu && !menu.contains(ev.target as Node)) { closePick(); document.removeEventListener('pointerdown', off); } }), 0);
}

const wrap = $('#wrap');
wrap.addEventListener('contextmenu', (e: MouseEvent) => {
  const p = uvOf(e); if (!p.inside || (e.target as HTMLElement).closest('.hudbar,.hud,.tl,.tlx,.kmenu,.textbar')) return;
  e.preventDefault(); openPick(e, hitsAt(p.u, p.v));
});
wrap.addEventListener('pointerdown', (e: PointerEvent) => {
  if (e.button !== 0 || (e.target as HTMLElement).closest('.hudbar,.hud,.tl,.tlx,.kmenu,.textbar') || (e.target as HTMLElement).dataset.h) return;
  if (!e.altKey && sel()) return;                                   // sticky selection: drag the selected item
  const p = uvOf(e); if (!p.inside) return;
  const hit = hitsAt(p.u, p.v)[0];
  if (hit) { select(hit.it); if (e.altKey) { e.stopImmediatePropagation(); toast(`Selected: ${hit.it.name}. Right-click: every layer under the point.`); } }
}, { capture: true });
R.hitsAt=hitsAt;
