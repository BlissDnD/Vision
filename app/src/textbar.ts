/** U4: text toolbar above the canvas, shown while a text layer (Szöveg / Animált szöveg) is selected — like a rich-text
 *  editor: font, bold, colour, alignment, size, line spacing, letter spacing; ⋯ = everything else on the Tartalom tab,
 *  the motion chip jumps to the Szövegmozgás settings. Rebuilt from renderInsp (R.updTextbar), so both stay in sync. */
import { R } from './runtime';
import { $, h } from './dom';
import { sel } from './state';
import { BASEK, EFFECTS } from './effects/index';
import { curV, setVal } from './evaluation';
import { scrubField } from './controls';
import { colorWell } from './colorpick';
import { commit } from './history';
import { renderInsp, setITab } from './inspector';
import { markDirty } from './loop';
import { S } from './effects/index';
import { cv } from './gl';
import { outSize } from './render';
import { ev } from './evaluation';
import { hitsAt } from './pick';
import { findItem } from './state';
import { renderAll } from './history';

export const TB_FONTS = ['Bricolage Grotesque', 'Instrument Sans', 'Fraunces', 'Cinzel', 'Unbounded', 'Syne', 'Orbitron', 'Major Mono Display', 'Bodoni Moda'];
const AL: [string, string, string][] = [
  ['left', 'Balra', '<path d="M4 6h16M4 10h10M4 14h16M4 18h10"/>'],
  ['center', 'Középre', '<path d="M4 6h16M7 10h10M4 14h16M7 18h10"/>'],
  ['right', 'Jobbra', '<path d="M4 6h16M10 10h10M4 14h16M10 18h10"/>']];
const svg = (p: string) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round">${p}</svg>`;
const bar = h('div', { class: 'textbar', id: 'textbar', role: 'toolbar', 'aria-label': 'Szöveg formázása', hidden: true });
$('#wrap').appendChild(bar);
const done = () => { commit(); markDirty(); renderInsp(); };

export function updTextbar() {
  const L: any = sel(); const on = !!L && (L.type === 'text' || L.type === 'mtext' || !!(EFFECTS[L.type] && EFFECTS[L.type].usesText)) && !!L.text && !R.seqPlay;
  bar.hidden = !on; if (!on) { bar.innerHTML = ''; return; }
  const T = L.text; bar.innerHTML = '';
  const font = h('select', { 'aria-label': 'Betűtípus', title: 'Betűtípus' }, ...TB_FONTS.map(f => { const o = h('option', { value: f, style: `font-family:'${f}'` }, f); if (f === T.font) o.selected = true; return o; }));
  font.onchange = () => { T.font = font.value; done(); };
  const w = +T.weight || 400; const bold = h('button', { class: 'tbb', type: 'button', 'aria-pressed': String(w >= 700), title: 'Félkövér (vastagság: Vékony … Extra a ⋯ alatt)', 'aria-label': 'Félkövér' }, h('b', null, 'B'));
  bold.onclick = () => { T.weight = w >= 700 ? '400' : '700'; done(); };
  const kids: any[] = [h('div', { class: 'pop' }, font), bold];
  // colour: Animált szöveg = Szín 1 (switches the fill to one colour); Szöveg = its palette on the colour tab
  if (L.type === 'mtext' && L.p.color1) {
    const c = colorWell(() => L.p.color1.v, v => { L.p.color1.v = v; if (Math.round(L.p.fill.v) !== 0) L.p.fill.v = 0; markDirty(); }, ch => { if (ch) done(); }, 'Szöveg színe'); kids.push(c);
  } else kids.push(h('button', { class: 'tbb', type: 'button', title: 'Szín: paletta és színezés', 'aria-label': 'Szín', onclick: () => setITab('look'), html: svg('<path d="M12 3.5c3.5 4.2 6 7.4 6 10.5a6 6 0 0 1-12 0c0-3.1 2.5-6.3 6-10.5z"/>') }));
  kids.push(h('span', { class: 'sepv' }));
  const al = T.align || 'center';
  for (const [k, l, p] of AL) kids.push(h('button', { class: 'tbb', type: 'button', 'aria-pressed': String(al === k), title: l + ' igazítás', 'aria-label': l + ' igazítás', html: svg(p), onclick: () => { T.align = k; done(); } }));
  kids.push(h('span', { class: 'sepv' }));
  const size = { get v() { return curV(L.n.s); }, set v(x) { setVal(L.n.s, Math.max(.02, x)); markDirty(); } };
  const lh = { get v() { return T.lh ?? 1.15; }, set v(x) { T.lh = Math.min(2, Math.max(.7, x)); markDirty(); } };
  const tr = { get v() { return T.track ?? 0; }, set v(x) { T.track = Math.min(1, Math.max(-.1, x)); markDirty(); } };
  kids.push(scrubField('Méret', size, BASEK.s, .002), scrubField('Sortáv', lh, S('lh', 'Sortávolság', .7, 2, 1.15), .004), scrubField('Betűköz', tr, S('track', 'Betűköz', -.1, 1, .12), .002));
  if (L.type === 'mtext') { const d = EFFECTS.mtext.params.find((p: any) => p.k === 'anim'); const nm = d && d.opts ? d.opts[Math.round(L.p.anim.v)] : '';
    kids.push(h('button', { class: 'tbchip', type: 'button', title: 'Szövegmozgás beállításai (Mozgás fül)', onclick: () => setITab('motion') }, '↯ ' + (nm || 'Mozgás'))); }
  kids.push(h('button', { class: 'tbb', type: 'button', title: 'További szövegbeállítások (Tartalom fül)', 'aria-label': 'További beállítások', onclick: () => { setITab('content'); const ta: any = document.querySelector('#insp textarea.txt'); if (ta) { ta.focus(); ta.scrollIntoView({ block: 'center' }); } } }, '⋯'));
  for (const k of kids) bar.appendChild(k);
}
R.updTextbar = updTextbar;

/* ---------- double click on a text on the canvas: edit it in place ---------- */
let ed: any = null;
/** Open the in-place editor over text layer L (Enter = new line, ⌘/Ctrl+Enter or click outside = done, Esc = cancel). */
export function editTextInPlace(L: any) {
  closeTextEdit(true); if (!L || !L.text) return null;
  const wrapEl = $('#wrap'), cr = cv.getBoundingClientRect(), wr = wrapEl.getBoundingClientRect(); const { W, H } = outSize(); const t = R.time;
  const x = ev(L.n.x, BASEK.x, t), y = ev(L.n.y, BASEK.y, t), s = ev(L.n.s, BASEK.s, t);
  const px = cr.left - wr.left + (x / (W / H) + .5) * cr.width, py = cr.top - wr.top + (.5 - y) * cr.height;
  const fs = Math.max(14, Math.min(72, s * cr.height * .42));
  const ta = h('textarea', { class: 'tedit', spellcheck: 'false', 'aria-label': 'Felirat szerkesztése a vásznon', title: 'Enter: új sor · ⌘Enter vagy kattintás mellé: kész · Esc: mégse' }) as HTMLTextAreaElement;
  ta.value = L.text.str; const before = L.text.str;
  ta.style.cssText = `font-family:'${L.text.font}',system-ui;font-weight:${L.text.weight};font-size:${fs}px;text-align:${L.text.align || 'center'};`;
  const fit = () => { const n = ta.value.split('\n'); ta.rows = Math.max(1, n.length); const w = Math.min(wr.width - 24, Math.max(160, Math.max(...n.map(l => l.length)) * fs * .62 + 24));
    ta.style.width = w + 'px'; ta.style.left = Math.max(8, Math.min(wr.width - w - 8, px - w / 2)) + 'px'; ta.style.top = Math.max(8, py - (fs * 1.15 * Math.max(1, n.length)) / 2 - 6) + 'px'; };
  fit(); wrapEl.appendChild(ta);
  ta.oninput = () => { L.text.str = ta.value; fit(); markDirty(); };
  ta.onkeydown = (e: KeyboardEvent) => { e.stopPropagation(); if (e.key === 'Escape') { L.text.str = before; closeTextEdit(false); markDirty(); } else if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) { e.preventDefault(); closeTextEdit(true); } };
  ta.onblur = () => closeTextEdit(true);
  ta.onpointerdown = (e: Event) => e.stopPropagation();
  ed = { ta, L, before }; setTimeout(() => { ta.focus(); ta.select(); }, 0); return ta;
}
export function closeTextEdit(keep: boolean) {
  if (!ed) return; const { ta, L, before } = ed; ed = null; ta.onblur = null; ta.remove();
  if (keep && L.text.str !== before) { if (!L.text.str.trim()) L.text.str = before; commit(); renderInsp(); }
}
$('#wrap').addEventListener('dblclick', (e: MouseEvent) => {
  if (R.seqPlay || (e.target as HTMLElement).closest('.hudbar,.hud,.tl,.tlx,.kmenu,.textbar,.scn,.tedit')) return;
  const r = cv.getBoundingClientRect(); const u = (e.clientX - r.left) / r.width, v = (e.clientY - r.top) / r.height; if (u < 0 || u > 1 || v < 0 || v > 1) return;
  const cur: any = sel(); let L: any = null;
  try { const hit = hitsAt(u, v).map((x: any) => x.it).find((it: any) => it.type === 'text' || it.type === 'mtext'); L = hit || null; } catch (_) { /* picking unavailable */ }
  if (!L && cur && (cur.type === 'text' || cur.type === 'mtext')) L = cur;
  if (!L) return; e.preventDefault();
  if (R.selId !== L.id) { R.selId = L.id; renderAll(); }
  editTextInPlace(findItem(L.id) ? findItem(L.id).it : L);
});
