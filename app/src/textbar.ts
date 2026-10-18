/** U4: text toolbar above the canvas, shown while a text layer (Szöveg / Animált szöveg) is selected — like a rich-text
 *  editor: font, bold, colour, alignment, size, line spacing, letter spacing; ⋯ = everything else on the Tartalom tab,
 *  the motion chip jumps to the Szövegmozgás settings. Rebuilt from renderInsp (R.updTextbar), so both stay in sync. */
import { R } from './runtime';
import { $, h } from './dom';
import { sel } from './state';
import { BASEK, EFFECTS } from './effects/index';
import { curV, setVal } from './evaluation';
import { scrubField } from './controls';
import { commit } from './history';
import { renderInsp, setITab } from './inspector';
import { markDirty } from './loop';
import { S } from './effects/index';

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
  const L: any = sel(); const on = !!L && (L.type === 'text' || L.type === 'mtext') && !!L.text && !R.seqPlay;
  bar.hidden = !on; if (!on) { bar.innerHTML = ''; return; }
  const T = L.text; bar.innerHTML = '';
  const font = h('select', { 'aria-label': 'Betűtípus', title: 'Betűtípus' }, ...TB_FONTS.map(f => { const o = h('option', { value: f, style: `font-family:'${f}'` }, f); if (f === T.font) o.selected = true; return o; }));
  font.onchange = () => { T.font = font.value; done(); };
  const w = +T.weight || 400; const bold = h('button', { class: 'tbb', type: 'button', 'aria-pressed': String(w >= 700), title: 'Félkövér (vastagság: Vékony … Extra a ⋯ alatt)', 'aria-label': 'Félkövér' }, h('b', null, 'B'));
  bold.onclick = () => { T.weight = w >= 700 ? '400' : '700'; done(); };
  const kids: any[] = [h('div', { class: 'pop' }, font), bold];
  // colour: Animált szöveg = Szín 1 (switches the fill to one colour); Szöveg = its palette on the colour tab
  if (L.type === 'mtext' && L.p.color1) {
    const c = h('input', { type: 'color', class: 'cwell', value: L.p.color1.v, title: 'Szín', 'aria-label': 'Szöveg színe' });
    c.oninput = () => { L.p.color1.v = c.value; if (Math.round(L.p.fill.v) !== 0) L.p.fill.v = 0; markDirty(); }; c.onchange = done; kids.push(c);
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
