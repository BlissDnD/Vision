// U5 Színek: every source that gives the selected layer (or group) its colour, in the order they act
// (palette/own gradient → own colour parameters → the layer's Megjelenések → parent group's → global Hangulat),
// each editable in place; ⇢ marks a parameter driven by a Kapcsolat. Plus a contrast warning for text.
import { h } from './dom';
import { R } from './runtime';
import { EFFECTS } from './effects/index';
import { findItem, st } from './state';
import { palCSS, palJS } from './palettes';
import { colorWell } from './colorpick';
import { contrast, gradCSS, harmony, hexToRgb, readableOn, rgbToHex } from './colorutil';
import { commit } from './history';
import { markDirty } from './loop';

/** Megjelenések that change colour (not only shape/blur): shown as „módosítja”. */
export const COLORFX = new Set(['grade', 'psycolor', 'chroma', 'film', 'crt', 'castlight', 'halftone', 'ascii', 'pixelart', 'glitch', 'hologram', 'inksketch', 'glow', 'liquidglass', 'fluidfx', 'feedback']);
const colorParams = (F: any) => (EFFECTS[F.type] && EFFECTS[F.type].params || []).filter((d: any) => d.type === 'color' && F.p && F.p[d.k]);
const linked = (L: any, k: string) => (st.links || []).some((l: any) => l.to.id === L.id && l.to.k === k);

function well(F: any, d: any) { return colorWell(() => F.p[d.k].v, v => { F.p[d.k].v = v; markDirty(); }, ch => { if (ch) commit(); }, d.l); }
function row(kids: any[], src: string, off = false, tip = '') { return h('div', { class: 'csum-row' + (off ? ' off' : ''), title: tip }, ...kids, h('span', null, src)); }

export function colorSummary(L: any) {
  if (!L) return null; const rows: any[] = []; const d = L.type === 'group' ? null : EFFECTS[L.type];
  const usesPal = d && (!d.noPal || d.usesPal);
  const own = d ? colorParams(L) : [];
  if (usesPal) { const sw = h('button', { class: 'cwell cwb', title: 'Paletta · kattints: Szín fül', style: `background:${L.grad ? gradCSS(L.grad.s, L.grad.m | 0) : palCSS(L.pal || 0)}`, onclick: () => R.setITab && R.setITab('look') });
    rows.push(row([sw], L.grad ? 'Saját átmenet' : 'Paletta', false, 'A réteg alapszínei. A saját szín paraméterek és a Megjelenések ezt módosíthatják.')); }
  for (const p of own) rows.push(row([well(L, p), linked(L, p.k) ? h('b', { title: 'Kapcsolat vezérli' }, '⇢') : null], p.l + ' · saját szín'));
  const chain = (list: any[], who: string) => { for (const F of list || []) { if (F.on === false || F.off || !COLORFX.has(F.type)) continue; const E = EFFECTS[F.type]; if (!E) continue;
    const ps = colorParams(F); rows.push(row(ps.length ? ps.map((p: any) => well(F, p)) : [h('i', { class: 'cwell cwb', style: 'background:conic-gradient(#f55,#ff5,#5f5,#5ff,#55f,#f5f,#f55)' })], `${E.name} · ${who}`)); } };
  chain(L.fx, 'Megjelenés, módosítja');
  const par = findItem(L.id); if (par && par.parent) chain(par.parent.fx, `a csoporté (${par.parent.name})`);
  if (st.look && st.look.preset && st.look.preset !== 'Semleges') rows.push(row([h('i', { class: 'cwell cwb', style: 'background:linear-gradient(135deg,#222,#c9a,#fd8)' })], `Hangulat: ${st.look.preset} · az egész képen`));
  if (Math.abs(L.n && L.n.hue ? L.n.hue.v : 0) > .001) rows.push(row([h('i', { class: 'cwell cwb', style: 'background:conic-gradient(red,yellow,lime,cyan,blue,magenta,red)' })], 'Színeltolás (Árnyalat)'));
  // contrast: text colour vs the background colour
  let warn = null; const isText = L.type === 'text' || L.type === 'mtext' || L.text;
  if (isText) { const fgHex = L.p && L.p.color1 ? L.p.color1.v : rgbToHex(palJS(L.pal || 0, .5) as any), fg = hexToRgb(fgHex), bg = hexToRgb(st.bg || '#000'), cr = contrast(fg, bg);
    if (cr < 3) warn = h('div', { class: 'csum-warn' }, `⚠ Gyenge kontraszt a háttérrel (${cr.toFixed(1)}:1)`, L.p && L.p.color1 ? h('button', { class: 'btn', onclick: () => { L.p.color1.v = rgbToHex(readableOn(fg, bg)); if (L.p.fill) L.p.fill.v = 0; commit(); R.renderInsp && R.renderInsp(); } }, 'Olvashatóvá') : null); }
  if (!rows.length && !warn) return null;
  return h('div', { class: 'csum', 'aria-label': 'Színek' }, h('div', { class: 'pl' }, 'Színek · lentről felfelé hatnak'), ...rows, warn);
}

/** A colour dropped on a layer: its first own colour parameter, else a tonal own gradient around the colour. */
export function applyColorTo(L: any, hex: string) {
  if (!L || L.type === 'group') return false; const ps = colorParams(L);
  if (ps.length) { L.p[ps[0].k].v = hex; if (L.p.fill && L.type === 'mtext') L.p.fill.v = 0; }
  else { const cs = harmony(hexToRgb(hex), 'tonal'); L.grad = { s: cs.map((c, j) => [j / 4, rgbToHex(c)]), m: 0 }; }
  commit(); return true;
}
R.dropColor = (hex: string, e: DragEvent) => {
  const cv = document.querySelector('#cv') as HTMLElement, r = cv.getBoundingClientRect(), u = (e.clientX - r.left) / r.width, v = (e.clientY - r.top) / r.height;
  let L = null; try { const hit = R.hitsAt ? R.hitsAt(u, v)[0] : null; if (hit) L = hit.it; } catch (_) { /* picking unavailable */ }
  if (!L && R.selId) { const f = findItem(R.selId); L = f && f.it; }
  if (applyColorTo(L, hex)) { R.selId = L.id; R.renderAll && R.renderAll(); }
};
