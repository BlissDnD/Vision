/* Inspector sections for Közös alap / Variant and Kapcsolat. Every action is one commit (undoable) and says what it did. */
import { R } from './runtime';
import { h } from './dom';
import { BASE, EFFECTS, paramsOf } from './effects/index';
import { findItem, st, walk } from './state';
import { section } from './controls';
import { commit, renderAll } from './history';
import { toast } from './modals';
import { addLink, describeLink, detach, diffCount, isVariant, linksOf, localDiff, makeBase, newVariant, paramDef, removeLink, transfer, variantsOf } from './variants';

const PATH_HU: Record<string, string> = { text: 'text', str: 'content', font: 'font', n: '', p: '', v: 'value', k: 'keyframes', pal: 'palette', name: 'name', vis: 'visibility', fx: 'effect chain', tm: 'timing', blend: 'blend' };
function pathLabel(V: any, e: any) {
  const c = V.children.find((x: any) => x.bid === e.bid);
  const pd = (e.path[0] === 'n' || e.path[0] === 'p') && c ? paramDef(c, e.path[0], e.path[1]) : null;
  const what = pd ? pd.l : e.path.map((p: string) => PATH_HU[p] ?? p).filter(Boolean).join(' · ');
  return `${c ? c.name : '?'}: ${what}`;
}

/** Group inspector: turn into a shared base, or manage this variant. */
export function variantSection(G: any) {
  if (!isVariant(G)) {
    return section('Shared base and variants', 'variant', false,
      h('p', { class: 'small' }, 'This group becomes a Shared base and is its first Variant. Then use the “New variant” button to make more posts. Editing one variant stays local; it only reaches the others through “Pass on”.'),
      h('div', { class: 'btnrow' }, h('button', { class: 'btn', onclick: () => { makeBase(G.id); commit(); renderAll(); toast('Shared base ready. This is the first variant.'); } }, 'Convert to shared base')));
  }
  const B = st.bases[G.variant.base], d = localDiff(G), others = variantsOf(B.id).filter(v => v !== G);
  const list = d.values.slice(0, 6).map(e => h('li', null, pathLabel(G, e)));
  if (d.values.length > 6) list.push(h('li', null, `… and ${d.values.length - 6} more`));
  if (d.added.length) list.push(h('li', null, `+${d.added.length} own layers`));
  if (d.removed.length) list.push(h('li', null, `−${d.removed.length} layers removed`));
  const checks = others.map(v => { const c = h('input', { type: 'checkbox', checked: true }) as HTMLInputElement; return { v, c, row: h('label', { class: 'row2' }, h('span', null, v.name), c) }; });
  return section(`Variant · ${B.name}`, 'variant', true,
    h('p', { class: 'small' }, `Shared base: “${B.name}”, ${others.length + 1} variants. ${d.values.length + d.added.length + d.removed.length ? 'Local differences in this variant:' : 'This variant is now identical to the shared base.'}`),
    list.length ? h('ul', { class: 'small difflist' }, ...list) : null,
    h('div', { class: 'btnrow' },
      h('button', { class: 'btn', onclick: () => { const id = newVariant(G.id); commit(); R.selId = id; renderAll(); toast('New variant from the same shared base. I hid the previous one; switch between them with the eye icon.'); } }, 'New variant'),
      h('button', { class: 'btn', disabled: !d.values.length, title: 'Local values go into the shared base; the other variants receive them, except what you already changed locally there.', onclick: () => { const n = transfer(G.id, 'base'); commit(); renderAll(); toast(`Passed to the shared base: ${n} settings, also into ${others.length} other variants.`); } }, 'Pass to the shared base')),
    others.length ? h('div', { class: 'pc' }, h('p', { class: 'small' }, 'Pass only to the selected variants:'), ...checks.map(x => x.row),
      h('div', { class: 'btnrow' }, h('button', { class: 'btn', disabled: !d.values.length, onclick: () => { const to = checks.filter(x => x.c.checked).map(x => x.v.id); const n = transfer(G.id, to); commit(); renderAll(); toast(`Passed to ${to.length} variants: ${n} settings.`); } }, 'Pass to the selected'))) : null,
    h('div', { class: 'btnrow' }, h('button', { class: 'btn', onclick: () => { detach(G.id); commit(); renderAll(); toast('Detached: this is now a plain group. The other variants did not change.'); } }, 'Detach from the shared base')));
}

/** A layer inside a variant: transfer only this element. */
export function childVariantSection(L: any) {
  const r = findItem(L.id), V = r && r.parent; if (!V || !isVariant(V) || !L.bid) return null;
  const n = localDiff(V).values.filter(e => e.bid === L.bid).length;
  return section('Variant', 'variantChild', n > 0,
    h('p', { class: 'small' }, n ? `This element has ${n} local differences from the “${st.bases[V.variant.base].name}” base.` : 'This element is identical to the shared base.'),
    h('div', { class: 'btnrow' }, h('button', { class: 'btn', disabled: !n, onclick: () => { const k = transfer(V.id, 'base', L.bid); commit(); renderAll(); toast(`Only this element: ${k} settings into the shared base.`); } }, 'Only this one: to the shared base')));
}

const numParams = (L: any) => [...BASE.filter((b: any) => b.k !== 'blend').map((b: any) => ['n', b.k, b.l]),
  ...paramsOf(L).filter((d: any) => !d.type).map((d: any) => ['p', d.k, d.l])];
const nameOf = (id: string) => { const r = findItem(id); return r ? r.it.name : '(deleted)'; };

/** Links of this element (incoming, outgoing) + a compact „new link” row targeting this element. */
export function linkSection(L: any) {
  const rows = linksOf(L.id).map((lk: any) => {
    const on = h('input', { type: 'checkbox', checked: lk.on, 'aria-label': 'Link enabled' }) as HTMLInputElement; on.onchange = () => { lk.on = on.checked; commit(); };
    return h('div', { class: 'row2 linkrow' }, h('span', { class: 'small' }, `${describeLink(lk)} (${lk.kind === 'sunsky' ? 'light' : lk.kind === 'follow' ? `follow, ${(lk.lag || 0).toFixed(2)} s lag` : lk.mode === 'set' ? 'drives' : 'adds'} ${lk.amt})`),
      on, h('button', { class: 'ib', 'aria-label': 'Delete link', title: 'Delete', onclick: () => { removeLink(lk.id); commit(); renderAll(); } }, '×'));
  });
  const srcs: any[] = []; walk(st.layers, (it: any) => { if (it.type !== 'group' && it.id !== L.id) srcs.push(it); });
  const ss = h('select', { 'aria-label': 'Source element' }, ...srcs.map(s => h('option', { value: s.id }, s.name))) as HTMLSelectElement;
  const sp = h('select', { 'aria-label': 'Source parameter' }) as HTMLSelectElement;
  const fillSp = () => { sp.innerHTML = ''; const s = findItem(ss.value); if (s) for (const [g, k, l] of numParams(s.it)) sp.append(h('option', { value: g + ':' + k }, l)); };
  ss.onchange = fillSp; fillSp();
  const tp = h('select', { 'aria-label': 'Target parameter' }, ...numParams(L).map(([g, k, l]) => h('option', { value: g + ':' + k }, l))) as HTMLSelectElement;
  const md = h('select', { 'aria-label': 'Mode' }, h('option', { value: 'add' }, 'adds (modulation)'), h('option', { value: 'set' }, 'drives (following)')) as HTMLSelectElement;
  const add = () => { if (!ss.value) return; const [fg, fk] = sp.value.split(':'), [tg, tk] = tp.value.split(':');
    addLink({ id: ss.value, g: fg as any, k: fk }, { id: L.id, g: tg as any, k: tk }, md.value as any, 1); commit(); renderAll(); toast('Link ready. Its strength can be set in the list.'); };
  return section('Links', 'links', rows.length > 0,
    rows.length ? h('div', null, ...rows) : h('p', { class: 'small' }, 'No links. On the canvas, drag a cord from the ⇢ dot next to the selected element onto another element; an exact parameter link can also be made below.'),
    srcs.length ? h('div', { class: 'pc' }, h('div', { class: 'row2' }, h('span', null, 'Source'), h('div', { class: 'pop' }, ss)), h('div', { class: 'row2' }, h('span', null, '· parameter'), h('div', { class: 'pop' }, sp)),
      h('div', { class: 'row2' }, h('span', null, 'To: its'), h('div', { class: 'pop' }, tp)), h('div', { class: 'row2' }, h('span', null, 'Mode'), h('div', { class: 'pop' }, md)),
      h('div', { class: 'btnrow' }, h('button', { class: 'btn', onclick: add }, 'Add link'))) : null);
}

/** Small badge text for the layer tree. */
export const variantBadge = (it: any) => (isVariant(it) ? `◇ ${st.bases[it.variant.base].name}${diffCount(it) ? ` · ${diffCount(it)} helyi` : ''}` : '');
