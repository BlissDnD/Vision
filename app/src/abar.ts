// U5 felső action bar: a per-viewer quick bar inside the canvas toolbar. Drop any library card (Forrás, Megjelenés,
// Mozgás …) or a colour swatch on it; click = apply to the selected layer, drag out = drop like a library card,
// drag inside = reorder, right click = remove. ⋯ = workspace presets (Alaphelyzet + 2 saved layouts). Never commits the project.
import { R } from './runtime';
import { $, h } from './dom';
import { LIB } from './library';
import { catId, catalogIndex, catalogLabel } from './catalog';
import { addFromLib, attachFx } from './itemops';
import { applyColorTo } from './colorsum';
import { findItem } from './state';
import { COLOR_MIME } from './colorpick';
import { toast } from './modals';
import { setShelfFrac } from './workspace';
import { buildCats, buildShelf } from './shelf';

const K = 'vel.abar';
const ls = (k: string, v?: string) => { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (_) { /* private mode */ } return null; };
type Item = { t: 'lib' | 'col'; id: string; name: string };
export function abarItems(): Item[] { try { const a = JSON.parse(ls(K) || '[]'); return Array.isArray(a) ? a.filter(x => x && x.id) : []; } catch (_) { return []; } }
const save = (a: Item[]) => ls(K, JSON.stringify(a.slice(0, 16)));
/** Library item from its stable id (survives shelf reordering). */
export function libById(id: string): [string, number] | null { const legacy: Record<string,string> = { 'motion:bento-atrendezodes~':'motion:bento-layout-rearrangement', 'world:jegvilag~':'world:ice-planet-object', 'world:lavabolygo~':'world:lava-planet-object' };
  const r = catalogIndex().find(x => x.id === (legacy[id] || id)); return r ? [r.cat, r.i] : null; }

export function addToBar(it: Item) { const a = abarItems().filter(x => x.id !== it.id); a.push(it); save(a); renderBar(); }
function useItem(it: Item) {
  if (it.t === 'col') { const f = R.selId && findItem(R.selId); if (!f || !applyColorTo(f.it, it.id)) toast('Jelölj ki egy réteget a színhez.'); else R.renderAll && R.renderAll(); return; }
  const ref = libById(it.id); if (!ref) { toast(`${it.name}: ez az elem már nincs a könyvtárban.`); return; } if (ref[0] === 'fx' && R.selId) attachFx(ref[0], ref[1], R.selId); else addFromLib(ref[0], ref[1], R.selId || null);
}
export function renderBar() {
  const bar = $('#abar'); if (!bar) return; bar.innerHTML = '';
  abarItems().forEach((it, j) => {
    const ref = it.t === 'lib' ? libById(it.id) : null; const name = ref ? catalogLabel(ref[0], ref[1]) : it.name;
    const b = h('button', { class: 'abtn', draggable: 'true', title: `${name} · click: apply to selected layer · drag: drop on a layer · right-click: remove`, style: it.t === 'col' ? `background:${it.id};width:26px` : '' }, it.t === 'col' ? '' : name);
    b.onclick = () => useItem(it);
    b.oncontextmenu = (e: Event) => { e.preventDefault(); save(abarItems().filter(x => x.id !== it.id)); renderBar(); };
    b.ondragstart = (e: DragEvent) => { const dt = e.dataTransfer!; dt.setData('text/x-vel-abar', String(j));
      if (it.t === 'col') dt.setData(COLOR_MIME, it.id); else { const ref = libById(it.id); if (ref) dt.setData('text/x-latomas-lib', ref[0] + ':' + ref[1]); } dt.effectAllowed = 'copyMove'; };
    bar.appendChild(b);
  });
}
function setup() {
  const hud = document.querySelector('.hudbar'); if (!hud || $('#abar')) return;
  const bar = h('div', { class: 'abar', id: 'abar', role: 'toolbar', 'aria-label': 'Gyorssáv' });
  const more = h('button', { class: 'ib', title: 'Munkatér-elrendezések', 'aria-label': 'Munkatér-elrendezések', onclick: () => layoutMenu(more) }, '⋯');
  hud.append(h('span', { class: 'sepv' }), bar, more);
  bar.ondragover = (e: DragEvent) => { const ty = [...e.dataTransfer!.types]; if (ty.includes('text/x-latomas-lib') || ty.includes(COLOR_MIME) || ty.includes('text/x-vel-abar')) { e.preventDefault(); bar.classList.add('drop'); } };
  bar.ondragleave = () => bar.classList.remove('drop');
  bar.ondrop = (e: DragEvent) => { bar.classList.remove('drop'); const dt = e.dataTransfer!; e.preventDefault(); e.stopPropagation();
    const from = dt.getData('text/x-vel-abar');
    if (from !== '') { const a = abarItems(), [m] = a.splice(+from, 1); const btns = [...bar.children] as HTMLElement[];
      let to = btns.findIndex(b => { const r = b.getBoundingClientRect(); return e.clientX < r.left + r.width / 2; }); if (to < 0) to = a.length; else if (to > +from) to--; a.splice(to, 0, m); save(a); renderBar(); return; }
    const col = dt.getData(COLOR_MIME); if (col) { addToBar({ t: 'col', id: col, name: col }); return; }
    const lib = dt.getData('text/x-latomas-lib'); if (lib) { const [c, i] = lib.split(':'); const it = LIB[c] && LIB[c][+i]; if (it) addToBar({ t: 'lib', id: catId(c, +i), name: catalogLabel(c, +i) }); } };
  renderBar();
}
/* ---------- workspace presets: shelf split, inspector tab, library shelf ---------- */
const WKEYS = ['vel.shelfH', 'vel.itab'];
function snapshotWs() { const o: any = { cat: R.cat }; for (const k of WKEYS) o[k] = ls(k); return o; }
function applyWs(o: any) { if (!o) return; for (const k of WKEYS) if (o[k] != null) ls(k, o[k]); if (o.cat && LIB[o.cat]) R.cat = o.cat;
  if (o['vel.shelfH']) setShelfFrac(+o['vel.shelfH'], false);
  if (o['vel.itab'] && R.setITab) R.setITab(o['vel.itab']); buildCats(); buildShelf(); }
export function layoutMenu(anchor: HTMLElement) {
  const old = $('#wsmenu'); if (old) { old.remove(); return; }
  const m = h('div', { class: 'cpick', id: 'wsmenu', style: 'width:200px' });
  const close = () => m.remove();
  m.append(h('button', { class: 'btn', onclick: () => { applyWs({ 'vel.shelfH': '52', 'vel.itab': 'content', cat: 'recipes' }); close(); toast('Munkatér: alaphelyzet'); } }, 'Alaphelyzet'));
  for (const n of [1, 2]) { const sv = ls('vel.ws' + n);
    m.append(h('div', { class: 'btnrow' }, h('button', { class: 'btn', disabled: !sv, onclick: () => { applyWs(JSON.parse(sv!)); close(); } }, `Elrendezés ${n}`), h('button', { class: 'btn', onclick: () => { ls('vel.ws' + n, JSON.stringify(snapshotWs())); close(); toast(`Elrendezés ${n} elmentve`); } }, 'Mentés'))); }
  document.body.appendChild(m); const r = anchor.getBoundingClientRect(); m.style.left = r.left + 'px'; m.style.top = (r.bottom + 6) + 'px';
  setTimeout(() => document.addEventListener('pointerdown', function f(e) { if (!m.contains(e.target as Node)) { m.remove(); document.removeEventListener('pointerdown', f, true); } }, true));
}
setup();
