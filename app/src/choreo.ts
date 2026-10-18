/** KO1 Koreográfia (row 27, first slice): one scene-motion block st.ko = {prof, at, amt (Mérték), sp (Ritmus = spacing), acc
 *  (Hangsúly), ids (participants in play order), roles {id: role}, w / d {role: weight / delay}}. Each participant gets ordinary
 *  motions (Rugalmas beúszás, Lebegés) built from its role at evaluation time (R.koMos → motion.moEval), so seek = export = reopen.
 *  The ✦ Koreográfia card suggests roles and previews (R.koPv) before Elfogadás (one undo step). */
import { R } from './runtime';
import { $, h } from './dom';
import { makeMo } from './motion';
import { EFFECTS, S } from './effects/index';
import { findItem, st } from './state';
import { commit, renderAll } from './history';
import { gizmoRadius } from './stage';
import { ctlSlider } from './controls';
import { renderTracks } from './timeline';
import { markDirty } from './loop';
import { toast } from './modals';
import { setPlay } from './transport';

export const ROLES: [string, string][] = [['bg', 'Háttér'], ['title', 'Főcím'], ['sub', 'Kísérő szöveg'], ['main', 'Fő forma'], ['deco', 'Díszítő forma'], ['img', 'Kép/Videó'], ['part', 'Részecske']];
const RK = ROLES.map(r => r[0]), roleName = (r: string) => (ROLES.find(x => x[0] === r) || ['', r])[1];
export const PROFILES: Record<string, string> = { ed: 'Editorial érkezés' };
const FULL3D = ['terrain3d', 'gyroid', 'sdfscene', 'surface3d'], PART = ['particles', 'bokeh', 'waves'];

/** Suggested role of every visible top-level layer (type, size and order; never written until Elfogadás). */
export function suggestRoles(list: any[] = st.layers): Record<string, string> {
  const out: Record<string, string> = {}, vis = list.filter(L => L.vis !== false);
  const kind = (L: any) => L.type === 'group' ? 'group' : (EFFECTS[L.type] || {}).kind;
  const size = (L: any) => { try { return gizmoRadius(L, 0); } catch (_) { return L.n && L.n.s ? L.n.s.v : .3; } };
  const texts = vis.filter(L => kind(L) === 'text').sort((a, b) => (b.n.s ? b.n.s.v : 0) - (a.n.s ? a.n.s.v : 0));
  const top = texts.length ? (texts[0].n.s ? texts[0].n.s.v : 1) : 0;
  texts.forEach((L, i) => { out[L.id] = i === 0 || (L.n.s && L.n.s.v >= top * .85) ? 'title' : 'sub'; });
  const forms = vis.filter(L => (kind(L) === 'shape' || kind(L) === '3d') && !FULL3D.includes(L.type)).sort((a, b) => size(b) - size(a));
  forms.forEach((L, i) => { out[L.id] = i === 0 ? 'main' : 'deco'; });
  for (const L of vis) { if (out[L.id]) continue; const k = kind(L);
    out[L.id] = k === 'image' ? 'img' : k === 'gen' ? (PART.includes(L.type) ? 'part' : 'bg') : FULL3D.includes(L.type) ? 'bg'
      : k === 'group' ? ((L.children || []).some((c: any) => kind(c) === 'text') ? 'sub' : 'deco') : 'deco'; }
  return out;
}
/** Play order: by role, then reading order (top → bottom, left → right). */
const ordered = (ids: string[], roles: Record<string, string>) => ids.map(id => findItem(id)).filter(Boolean).map((r: any) => r.it)
  .sort((a: any, b: any) => (RK.indexOf(roles[a.id]) - RK.indexOf(roles[b.id])) || ((b.n.y ? b.n.y.v : 0) - (a.n.y ? a.n.y.v : 0)) || ((a.n.x ? a.n.x.v : 0) - (b.n.x ? b.n.x.v : 0))).map((L: any) => L.id);
export function newKo(): any { const roles = suggestRoles(); const ids = ordered(Object.keys(roles), roles);
  return { prof: 'ed', at: 0, amt: 1, sp: 1, acc: .5, ids, roles, w: {}, d: {} }; }
R.normKo = (o: any) => { if (!o || !Array.isArray(o.ids)) return null; const cl = (v: any, a: number, b: number, d: number) => isFinite(v) ? Math.max(a, Math.min(b, +v)) : d;
  const roles: any = {}; for (const id in o.roles || {}) if (RK.includes(o.roles[id])) roles[id] = o.roles[id];
  const num = (m: any, a: number, b: number) => { const r: any = {}; for (const k in m || {}) if (RK.includes(k) && isFinite(m[k])) r[k] = cl(m[k], a, b, 0); return r; };
  return { prof: PROFILES[o.prof] ? o.prof : 'ed', at: cl(o.at, 0, 600, 0), amt: cl(o.amt, 0, 2, 1), sp: cl(o.sp, .3, 3, 1), acc: cl(o.acc, 0, 1, .5),
    ids: o.ids.filter((id: any) => typeof id === 'string' && roles[id]), roles, w: num(o.w, 0, 2), d: num(o.d, -2, 5) }; };

/* ---------- the Editorial érkezés profile: role → start (s, before Ritmus spacing), step per index, motion ---------- */
const BT: Record<string, [number, number]> = { bg: [0, .1], img: [.2, .12], title: [.35, .14], main: [.6, .15], deco: [.8, .07], sub: [1, .1], part: [1.3, .1] };
const DECO_ANG = [200, 330, 120, 20, 250, 80];
/** The motions of one participant: [{t, at, dur, …}] as plain values (spring = Rugalmas beúszás, float = Lebegés). */
export function koParts(K: any, id: string): any[] | null {
  const r = K.roles[id]; if (!r || !K.ids.includes(id)) return null;
  const i = K.ids.filter((x: string) => K.roles[x] === r).indexOf(id), [b0, st0] = BT[r] || [0, .1];
  const at = Math.max(0, K.at + (b0 + i * st0) * K.sp + (K.d[r] || 0)), A = K.amt * (K.w[r] ?? 1), acc = K.acc;
  const sp = (o: any) => ({ t: 'spring', at: Math.round(at * 1000) / 1000, ...o });
  switch (r) {
    case 'bg': return [sp({ dur: 2.2, char: 0, dist: .05 * A, ang: 90, fade: .8, from: 1 + .08 * A, bend: 0 }), { t: 'float', a: at + 2.2, amp: .012 * A, period: 7, ang: 90, phase: 0 }];
    case 'title': return [sp({ dur: .8, char: acc > .66 ? 2 : 1, dist: .22 * A, ang: 270, fade: 1, from: 1 + .35 * acc * Math.min(1, A), bend: 0 })];
    case 'sub': return [sp({ dur: .7, char: 0, dist: .06 * A, ang: 270, fade: 1, from: 1, bend: 0 })];
    case 'main': return [sp({ dur: 1, char: 2, dist: .12 * A, ang: 0, fade: 1, from: Math.max(.2, 1 - .4 * A), bend: 0 })];
    case 'deco': return [sp({ dur: .7, char: 1, dist: .35 * A, ang: DECO_ANG[i % 6], fade: 1, from: Math.max(.2, 1 - .5 * A), bend: i % 2 ? .35 : -.35 })];
    case 'img': return [sp({ dur: 1.1, char: 0, dist: .05 * A, ang: 270, fade: 1, from: 1 + .12 * A, bend: 0 })];
    case 'part': return [sp({ dur: 1.2, char: 0, dist: 0, ang: 270, fade: 1, from: 1, bend: 0 })];
  }
  return null;
}
/** Plain values → real motion objects (also what Önálló mozgássá writes). */
function toMo(P: any) { const { t, a, ...o } = P; const m: any = makeMo(t, o); if (a != null) m.a = Math.round(a * 1000) / 1000; return m; }
const MCACHE = new WeakMap<any, Map<string, any[]>>();
/** moEval hook: the scene-motion motions of layer L (preview wins); none in Jelenetsor playback. */
R.koMos = (L: any) => {
  const K = R.koPv || st.ko; if (!K || R.seqPlay || !L || !L.id || !K.roles[L.id]) return null;
  let M = MCACHE.get(K); const sig = JSON.stringify(K); if (!M || (M as any).sig !== sig) { M = new Map(); (M as any).sig = sig; MCACHE.set(K, M); }
  if (!M.has(L.id)) { const P = koParts(K, L.id); M.set(L.id, P ? P.map(x => { const m = toMo(x); m.id = 'ko:' + L.id; return m; }) : []); }
  const r = M.get(L.id)!; return r.length ? r : null;
};
/** End of the block (s): the last participant's arrival. */
export function koEnd(K: any) { let e = K.at; for (const id of K.ids) for (const P of koParts(K, id) || []) if (P.t === 'spring') e = Math.max(e, P.at + P.dur); return e; }

/* ---------- ✦ Koreográfia card ---------- */
const wrapEl = $('#wrap') as HTMLElement; let card: HTMLElement | null = null;
const prox = (o: any, k: string) => ({ get v() { return o[k]; }, set v(x) { o[k] = x; markDirty(); } });
export function koOpen() {
  koClose(); if (!st.layers.length) { toast('Előbb tegyél elemeket a vászonra.'); return; }
  const D = st.ko ? JSON.parse(JSON.stringify(st.ko)) : newKo();
  // layers added since: suggested role, not participating until ticked
  const sug = suggestRoles(); for (const id in sug) if (!D.roles[id]) D.roles[id] = sug[id];
  R.koPv = D; card = h('div', { class: 'xfcard kocard', role: 'dialog', 'aria-label': 'Koreográfia' }); wrapEl.appendChild(card); drawKo();
  R.time = D.at; if (!R.noAutoPlay) setPlay(true); markDirty();
}
R.koOpen = koOpen;
export function koClose() { R.koPv = null; if (card) { card.remove(); card = null; } markDirty(); }
function drawKo() {
  const D = R.koPv; if (!card || !D) return; card.innerHTML = '';
  const reorder = () => { D.ids = ordered(D.ids, D.roles); };
  const rows = st.layers.filter((L: any) => D.roles[L.id]).map((L: any) => {
    const sel = h('select', { 'aria-label': 'Szerep: ' + L.name }, ...ROLES.map(([k, n]) => { const o = h('option', { value: k }, n); if (D.roles[L.id] === k) o.selected = true; return o; }));
    sel.onchange = () => { D.roles[L.id] = sel.value; reorder(); markDirty(); drawKo(); };
    const cb = h('input', { type: 'checkbox', class: 'sw', 'aria-label': 'Részt vesz: ' + L.name }); cb.checked = D.ids.includes(L.id);
    cb.onchange = () => { D.ids = cb.checked ? ordered([...D.ids, L.id], D.roles) : D.ids.filter((x: string) => x !== L.id); markDirty(); };
    return h('div', { class: 'korow' }, h('span', { class: 'kon', title: L.name }, L.name), sel, cb);
  });
  const used = RK.filter(r => D.ids.some((id: string) => D.roles[id] === r));
  const wd = h('details', { class: 'kodet' }, h('summary', null, 'Szerepsúlyok és késés'),
    ...used.flatMap(r => { const w = { get v() { return D.w[r] ?? 1; }, set v(x) { D.w[r] = x; markDirty(); } }, d = { get v() { return D.d[r] ?? 0; }, set v(x) { D.d[r] = x; markDirty(); } };
      return [ctlSlider(w, S('w', roleName(r) + ': részvétel', 0, 2, 1, .05), { noAnim: true }), ctlSlider(d, S('d', roleName(r) + ': késés (mp)', -1, 2, 0, .05), { noAnim: true })]; }));
  card.append(h('div', { class: 'xfhd' }, h('b', null, '✦ Jelenetmozgás'), h('span', { class: 'small' }, ' · ' + PROFILES[D.prof])),
    h('p', { class: 'small' }, `${D.ids.length} elem, szerepenként eltérő érkezéssel. Előnézet fut; a projekt az Elfogadásig nem változik.`),
    ctlSlider(prox(D, 'amt'), S('amt', 'Mérték', 0, 2, 1, .05), { noAnim: true }),
    ctlSlider(prox(D, 'sp'), S('sp', 'Ritmus (térköz)', .3, 3, 1, .05), { noAnim: true }),
    ctlSlider(prox(D, 'acc'), S('acc', 'Hangsúly', 0, 1, .5, .05), { noAnim: true }),
    h('details', { class: 'kodet' }, h('summary', null, `Szerepek (${rows.length})`), ...rows), wd,
    h('div', { class: 'xfbtns' },
      st.ko ? h('button', { class: 'btn', type: 'button', title: 'A jelenetmozgás eltávolítása', onclick: koRemove }, 'Törlés') : null,
      h('button', { class: 'btn', type: 'button', onclick: koClose }, 'Mégse'),
      h('button', { class: 'btn accent', type: 'button', onclick: koAccept }, 'Elfogadás')));
}
export function koAccept() {
  const D = R.koPv; if (!D) return; R.koPv = null; if (card) { card.remove(); card = null; }
  const ko = R.normKo(D); if (!ko || !ko.ids.length) { delete st.ko; commit(); renderAll(); return; }
  st.ko = ko; commit(); renderAll(); markDirty(); toast(`Jelenetmozgás (${PROFILES[ko.prof]}) · ${ko.ids.length} elem · ⌘Z visszavonja`);
}
function koRemove() { R.koPv = null; if (card) { card.remove(); card = null; } delete st.ko; commit(); renderAll(); markDirty(); toast('Jelenetmozgás törölve · ⌘Z visszavonja'); }
document.addEventListener('keydown', e => { if (e.key === 'Escape' && R.koPv) { e.stopPropagation(); koClose(); } }, true);
// the button in the Rétegek header
{ const ph = $('#layerCount') && ($('#layerCount') as HTMLElement).parentElement;
  if (ph) ph.appendChild(h('button', { class: 'ib kobtn', type: 'button', title: 'Koreográfia: a Vel szerepenként összehangolt érkezést javasol a jelenetre (előnézet, majd Elfogadás)', 'aria-label': 'Koreográfia', onclick: koOpen }, '✦')); }

/** Önálló mozgássá: this layer's part becomes ordinary, editable motions and leaves the block. */
export function koDetach(L: any) {
  const K = st.ko; if (!K) return; const P = koParts(K, L.id); if (P) (L.mo = L.mo || []).push(...P.map(toMo));
  K.ids = K.ids.filter((x: string) => x !== L.id); if (!K.ids.length) delete st.ko;
}
/** Mozgás tab: role in this scene, participation, Önálló mozgássá (only while the scene has a scene-motion block). */
R.koSection = (L: any) => {
  const K = st.ko; if (!K || !L || L.type === 'camera' || !st.layers.includes(L)) return null;
  const role = K.roles[L.id] || suggestRoles()[L.id] || 'deco', inK = K.ids.includes(L.id);
  const sel = h('select', { 'aria-label': 'Szerep ebben a jelenetben' }, ...ROLES.map(([k, n]) => { const o = h('option', { value: k }, n); if (role === k) o.selected = true; return o; }));
  sel.onchange = () => { K.roles[L.id] = sel.value; if (inK) K.ids = ordered(K.ids, K.roles); commit(); renderAll(); markDirty(); };
  const cb = h('input', { type: 'checkbox', class: 'sw', 'aria-label': 'Részt vesz a jelenetmozgásban' }); cb.checked = inK;
  cb.onchange = () => { K.roles[L.id] = K.roles[L.id] || role; K.ids = cb.checked ? ordered([...K.ids, L.id], K.roles) : K.ids.filter((x: string) => x !== L.id); commit(); renderAll(); markDirty(); };
  return h('div', { class: 'xfbox kobox' }, h('p', { class: 'xfgets' }, '✦ Jelenetmozgás: ', h('b', null, PROFILES[K.prof])),
    h('label', { class: 'row2' }, h('span', null, 'Szerep ebben a jelenetben'), sel), h('label', { class: 'row2' }, h('span', null, 'Részt vesz'), cb),
    h('div', { class: 'xfbtns' }, h('button', { class: 'btn', type: 'button', onclick: koOpen }, 'Jelenetmozgás…'),
      inK ? h('button', { class: 'btn', type: 'button', title: 'A réteg része valódi, szerkeszthető mozgás lesz, és kilép a blokkból', onclick: () => { koDetach(L); commit(); renderAll(); markDirty(); toast('Önálló mozgás lett · ⌘Z visszavonja'); } }, 'Önálló mozgássá') : null));
};

/* ---------- Sávok: one collapsible Jelenetmozgás block (move = at, right edge = Ritmus spacing), role rows when open ---------- */
R.koRows = (va: number, vb: number, X: (t: number) => number) => {
  const K = st.ko; if (!K || !K.ids.length) return [];
  const a = K.at, b = Math.max(a + .1, koEnd(K)), open = !!R.koTlOpen;
  const ch = h('button', { class: 'tlx-chev' + (open ? ' open' : ''), type: 'button', 'aria-expanded': String(open), 'aria-label': 'Szerepcsoportok', title: 'Szerepcsoportok' }, '›');
  ch.onclick = (e: Event) => { e.stopPropagation(); R.koTlOpen = !open; renderTracks(); };
  const lane = h('div', { class: 'tlx-lane tlx-molane' });
  const blk = h('i', { class: 'tlx-clip tlx-ko', style: `left:${Math.max(0, X(a))}%;width:${Math.max(.6, Math.min(100, X(b)) - Math.max(0, X(a)))}%`,
    title: `Jelenetmozgás · ${PROFILES[K.prof]} · ${K.ids.length} elem · húzás: eltolás · jobb szél: ritmus nyújtása · dupla katt: beállítások` }, h('span', null, '✦ ' + PROFILES[K.prof]));
  const eb = h('b', { class: 'tlx-ce b', title: 'Ritmus nyújtása (a belépések sebessége marad)' }); blk.appendChild(eb);
  blk.ondblclick = () => koOpen();
  blk.onpointerdown = (ev: PointerEvent) => { ev.stopPropagation(); ev.preventDefault(); try { blk.setPointerCapture(ev.pointerId); } catch (_) { /* ignore */ }
    const r0 = lane.getBoundingClientRect(), at0 = K.at, sp0 = K.sp, len0 = b - a, edge = ev.target === eb; let moved = false;
    blk.onpointermove = (e: PointerEvent) => { if (!(r0.width > 0)) return; const dt = (e.clientX - ev.clientX) / r0.width * (vb - va); if (Math.abs(dt) > 1e-3) moved = true;
      if (edge) K.sp = Math.max(.3, Math.min(3, Math.round(sp0 * Math.max(.05, len0 + dt) / len0 * 100) / 100)); else K.at = Math.max(0, Math.round((at0 + dt) * 100) / 100); markDirty(); };
    blk.onpointerup = () => { blk.onpointermove = blk.onpointerup = null; if (moved) { commit(); renderTracks(); } }; };
  lane.appendChild(blk);
  const out = [h('div', { class: 'tlx-row tlx-morow tlx-korow' }, h('div', { class: 'tlx-name tlx-moname', title: 'Jelenetmozgás' }, ch, h('span', null, 'Jelenetmozgás')), lane)];
  if (open) for (const r of RK) { const ids = K.ids.filter((id: string) => K.roles[id] === r); if (!ids.length) continue;
    const ln = h('div', { class: 'tlx-lane tlx-molane' });
    for (const id of ids) { const P = (koParts(K, id) || []).find(x => x.t === 'spring'); const it = findItem(id); if (!P || !it) continue;
      const bar = h('i', { class: 'tlx-clip tlx-korole', style: `left:${Math.max(0, X(P.at))}%;width:${Math.max(.6, X(P.at + P.dur) - Math.max(0, X(P.at)))}%`, title: `${it.it.name} · ${roleName(r)}` });
      bar.onpointerdown = (e: Event) => { e.stopPropagation(); R.selId = id; R.itab = 'motion'; renderAll(); }; ln.appendChild(bar); }
    out.push(h('div', { class: 'tlx-row tlx-morow' }, h('div', { class: 'tlx-name tlx-moname tlx-xfname', style: 'padding-left:28px' }, h('span', null, `${roleName(r)} · ${ids.length}`)), ln)); }
  return out;
};
