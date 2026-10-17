/* Inspector sections for Közös alap / Változat and Kapcsolat. Every action is one commit (undoable) and says what it did. */
import { R } from './runtime';
import { h } from './dom';
import { BASE, EFFECTS } from './effects/index';
import { findItem, st, walk } from './state';
import { section } from './controls';
import { commit, renderAll } from './history';
import { toast } from './modals';
import { addLink, detach, diffCount, isVariant, linksOf, localDiff, makeBase, newVariant, paramDef, removeLink, transfer, variantsOf } from './variants';

const PATH_HU: Record<string, string> = { text: 'szöveg', str: 'tartalom', font: 'betűtípus', n: '', p: '', v: 'érték', k: 'kulcskockák', pal: 'paletta', name: 'név', vis: 'láthatóság', fx: 'effektlánc', tm: 'időzítés', blend: 'keverés' };
function pathLabel(V: any, e: any) {
  const c = V.children.find((x: any) => x.bid === e.bid);
  const pd = (e.path[0] === 'n' || e.path[0] === 'p') && c ? paramDef(c, e.path[0], e.path[1]) : null;
  const what = pd ? pd.l : e.path.map((p: string) => PATH_HU[p] ?? p).filter(Boolean).join(' · ');
  return `${c ? c.name : '?'}: ${what}`;
}

/** Group inspector: turn into a shared base, or manage this variant. */
export function variantSection(G: any) {
  if (!isVariant(G)) {
    return section('Közös alap és változatok', 'variant', false,
      h('p', { class: 'small' }, 'Ebből a csoportból Közös alap lesz, ez pedig az első Változat. Utána a „Új változat” gombbal készíthetsz további posztokat. Egy változat módosítása helyi marad; másokhoz csak „Átadással” jut el.'),
      h('div', { class: 'btnrow' }, h('button', { class: 'btn', onclick: () => { makeBase(G.id); commit(); renderAll(); toast('Közös alap kész. Ez az első változat.'); } }, 'Közös alappá alakítás')));
  }
  const B = st.bases[G.variant.base], d = localDiff(G), others = variantsOf(B.id).filter(v => v !== G);
  const list = d.values.slice(0, 6).map(e => h('li', null, pathLabel(G, e)));
  if (d.values.length > 6) list.push(h('li', null, `… és még ${d.values.length - 6}`));
  if (d.added.length) list.push(h('li', null, `+${d.added.length} saját réteg`));
  if (d.removed.length) list.push(h('li', null, `−${d.removed.length} réteg kivéve`));
  const checks = others.map(v => { const c = h('input', { type: 'checkbox', checked: true }) as HTMLInputElement; return { v, c, row: h('label', { class: 'row2' }, h('span', null, v.name), c) }; });
  return section(`Változat · ${B.name}`, 'variant', true,
    h('p', { class: 'small' }, `Közös alap: „${B.name}”, ${others.length + 1} változat. ${d.values.length + d.added.length + d.removed.length ? 'Helyi eltérések ebben a változatban:' : 'Ez a változat most azonos a közös alappal.'}`),
    list.length ? h('ul', { class: 'small difflist' }, ...list) : null,
    h('div', { class: 'btnrow' },
      h('button', { class: 'btn', onclick: () => { const id = newVariant(G.id); commit(); R.selId = id; renderAll(); toast('Új változat ugyanebből a közös alapból. Az előzőt elrejtettem; a szem ikonnal váltasz köztük.'); } }, 'Új változat'),
      h('button', { class: 'btn', disabled: !d.values.length, title: 'A helyi értékek a közös alapba kerülnek; a többi változat megkapja, kivéve amit ott helyben már átírtál.', onclick: () => { const n = transfer(G.id, 'base'); commit(); renderAll(); toast(`Átadva a közös alapnak: ${n} beállítás, ${others.length} másik változatba is.`); } }, 'Átadás a közös alapnak')),
    others.length ? h('div', { class: 'pc' }, h('p', { class: 'small' }, 'Átadás csak a kijelölt változatoknak:'), ...checks.map(x => x.row),
      h('div', { class: 'btnrow' }, h('button', { class: 'btn', disabled: !d.values.length, onclick: () => { const to = checks.filter(x => x.c.checked).map(x => x.v.id); const n = transfer(G.id, to); commit(); renderAll(); toast(`Átadva ${to.length} változatnak: ${n} beállítás.`); } }, 'Átadás a kijelölteknek'))) : null,
    h('div', { class: 'btnrow' }, h('button', { class: 'btn', onclick: () => { detach(G.id); commit(); renderAll(); toast('Leválasztva: ez most sima csoport. A többi változat nem változott.'); } }, 'Leválasztás a közös alapról')));
}

/** A layer inside a variant: transfer only this element. */
export function childVariantSection(L: any) {
  const r = findItem(L.id), V = r && r.parent; if (!V || !isVariant(V) || !L.bid) return null;
  const n = localDiff(V).values.filter(e => e.bid === L.bid).length;
  return section('Változat', 'variantChild', n > 0,
    h('p', { class: 'small' }, n ? `Ennek az elemnek ${n} helyi eltérése van a „${st.bases[V.variant.base].name}” alaphoz képest.` : 'Ez az elem azonos a közös alappal.'),
    h('div', { class: 'btnrow' }, h('button', { class: 'btn', disabled: !n, onclick: () => { const k = transfer(V.id, 'base', L.bid); commit(); renderAll(); toast(`Csak ez az elem: ${k} beállítás a közös alapba.`); } }, 'Csak ezt: a közös alapnak')));
}

const numParams = (L: any) => [...BASE.filter((b: any) => b.k !== 'blend').map((b: any) => ['n', b.k, b.l]),
  ...((EFFECTS[L.type] && EFFECTS[L.type].params) || []).filter((d: any) => !d.type).map((d: any) => ['p', d.k, d.l])];
const nameOf = (id: string) => { const r = findItem(id); return r ? r.it.name : '(törölve)'; };

/** Kapcsolatok of this element (incoming, outgoing) + a compact „new link” row targeting this element. */
export function linkSection(L: any) {
  const rows = linksOf(L.id).map((lk: any) => {
    const a = findItem(lk.from.id), b = findItem(lk.to.id);
    const pl = (x: any, g: string, k: string) => { const d = x && paramDef(x.it, g as any, k); return d ? d.l : k; };
    const on = h('input', { type: 'checkbox', checked: lk.on, 'aria-label': 'Kapcsolat be' }) as HTMLInputElement; on.onchange = () => { lk.on = on.checked; commit(); };
    return h('div', { class: 'row2 linkrow' }, h('span', { class: 'small' }, `${nameOf(lk.from.id)} · ${pl(a, lk.from.g, lk.from.k)} → ${nameOf(lk.to.id)} · ${pl(b, lk.to.g, lk.to.k)} (${lk.mode === 'set' ? 'vezérli' : 'hozzáad'} ${lk.amt})`),
      on, h('button', { class: 'ib', 'aria-label': 'Kapcsolat törlése', title: 'Törlés', onclick: () => { removeLink(lk.id); commit(); renderAll(); } }, '×'));
  });
  const srcs: any[] = []; walk(st.layers, (it: any) => { if (it.type !== 'group' && it.id !== L.id) srcs.push(it); });
  const ss = h('select', { 'aria-label': 'Forrás elem' }, ...srcs.map(s => h('option', { value: s.id }, s.name))) as HTMLSelectElement;
  const sp = h('select', { 'aria-label': 'Forrás paraméter' }) as HTMLSelectElement;
  const fillSp = () => { sp.innerHTML = ''; const s = findItem(ss.value); if (s) for (const [g, k, l] of numParams(s.it)) sp.append(h('option', { value: g + ':' + k }, l)); };
  ss.onchange = fillSp; fillSp();
  const tp = h('select', { 'aria-label': 'Cél paraméter' }, ...numParams(L).map(([g, k, l]) => h('option', { value: g + ':' + k }, l))) as HTMLSelectElement;
  const md = h('select', { 'aria-label': 'Mód' }, h('option', { value: 'add' }, 'hozzáad (moduláció)'), h('option', { value: 'set' }, 'vezérli (követés)')) as HTMLSelectElement;
  const add = () => { if (!ss.value) return; const [fg, fk] = sp.value.split(':'), [tg, tk] = tp.value.split(':');
    addLink({ id: ss.value, g: fg as any, k: fk }, { id: L.id, g: tg as any, k: tk }, md.value as any, 1); commit(); renderAll(); toast('Kapcsolat kész. Az erősség a listában kapcsolható.'); };
  return section('Kapcsolatok', 'links', rows.length > 0,
    rows.length ? h('div', null, ...rows) : h('p', { class: 'small' }, 'Nincs kapcsolat. Egy másik elem paramétere vezérelheti ennek az elemnek egy paraméterét.'),
    srcs.length ? h('div', { class: 'pc' }, h('div', { class: 'row2' }, h('span', null, 'Forrás'), h('div', { class: 'pop' }, ss)), h('div', { class: 'row2' }, h('span', null, '· paramétere'), h('div', { class: 'pop' }, sp)),
      h('div', { class: 'row2' }, h('span', null, 'Ide: ennek'), h('div', { class: 'pop' }, tp)), h('div', { class: 'row2' }, h('span', null, 'Mód'), h('div', { class: 'pop' }, md)),
      h('div', { class: 'btnrow' }, h('button', { class: 'btn', onclick: add }, 'Kapcsolat hozzáadása'))) : null);
}

/** Small badge text for the layer tree. */
export const variantBadge = (it: any) => (isVariant(it) ? `◇ ${st.bases[it.variant.base].name}${diffCount(it) ? ` · ${diffCount(it)} helyi` : ''}` : '');
