/** Mozgás v1 UI: the Mozgások section on the Mozgás tab (icon row like the effects: Beúszás/Kiúszás from L.tm + the
 *  draggable motions L.mo, strength ring, „+” grid), the per-layer key Loop (⟲), Képkocka-ütem, a warning for keys past
 *  the project end, attaching from the shelf (click / drop on canvas / drop on a layer row), and the on-canvas arrow that
 *  sets where Rugalmas beúszás comes from. */
import { R } from './runtime';
import { $, h } from './dom';
import { LIB } from './library';
import { MO, MO_ORDER, AMT, makeMo, moIcon } from './motion';
import { findItem, sel, st } from './state';
import { S, SEL } from './effects/index';
import { ctlSelect, ctlSlider, ctlSwitch, section } from './controls';
import { commit, renderAll } from './history';
import { FPS_OPTS, fpsObj, renderInsp, setITab } from './inspector';
import { EASES, MOVES, outSize } from './render';
import { cv } from './gl';
import { ev } from './evaluation';
import { BASEK } from './effects/index';
import { toAsp } from './stage';
import { hitsAt } from './pick';
import { paramList, renderTimeline } from './timeline';
import { markDirty } from './loop';
import { toast } from './modals';
import { setPlay } from './transport';

R.moSel = {};
const ring = (el: any, v: number) => el.style.setProperty('--s', String(Math.max(0, Math.min(1, v))));
const TMI = { in: '<path d="M3 12h11M10 8l4 4-4 4"/><path d="M19 5v14"/>', out: '<path d="M5 5v14"/><path d="M10 12h11M17 8l4 4-4 4"/>' };
const svg = (p: string) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${p}</svg>`;

/** Attach motion `type` (shelf index i) to an item; selects it and opens it on the Mozgás tab. */
export function attachMo(i: number, refId?: string | null) {
  const li: any = (LIB.motion as any[])[i]; const r = refId ? findItem(refId) : (R.selId ? findItem(R.selId) : null);
  if (!li || !li.mo) return null;
  if (!r) { toast(`${li.name}: jelölj ki egy réteget, vagy húzd rá egy rétegre (vásznon vagy a rétegsorban).`); return null; }
  const L = r.it; const m = makeMo(li.mo, li.mo === 'spring' ? { at: Math.round(Math.max(0, R.time) * 100) / 100 } : {});
  (L.mo = L.mo || []).push(m); R.moSel[L.id] = m.id; R.selId = L.id; R.moAud = null; R.itab = 'motion';
  try { localStorage.setItem('vel.itab', 'motion'); } catch (_) { /* ignore */ }
  commit(); renderAll(); markDirty(); const wasPlaying = !!R.playing; if (!wasPlaying && !R.noAutoPlay) setPlay(true);
  toast(`${li.name} → ${L.name}${wasPlaying ? '' : ' · lejátszás indul, hogy lásd'} · ⌘Z visszavonja`); return m;
}
R.attachMo = attachMo;
/** Drop on the canvas: the item under the pointer (else the selected one). */
R.dropMo = (i: number, e: DragEvent) => {
  const r = cv.getBoundingClientRect(); const u = (e.clientX - r.left) / r.width, v = (e.clientY - r.top) / r.height; let id = null;
  if (u >= 0 && u <= 1 && v >= 0 && v <= 1) try { const hit = hitsAt(u, v)[0]; if (hit) id = hit.it.id; } catch (_) { /* picking unavailable */ }
  attachMo(i, id);
};

const legacy = (L: any) => { const T = L.tm || {}; const o: any[] = []; if (T.in) o.push({ id: 'tm:in', name: 'Beúszás', icon: TMI.in }); if (T.out) o.push({ id: 'tm:out', name: 'Kiúszás', icon: TMI.out }); return o; };
/** Legacy entry/exit settings (L.tm) as a motion body. */
function tmBody(L: any, which: 'in' | 'out') {
  const T = L.tm; const X = (k: string) => ({ get v() { return T[k]; }, set v(x) { T[k] = x; renderTimeline(); } }); const mx = Math.max(10, st.dur || 10);
  return which === 'in' ? [ctlSelect(X('in'), SEL('in', 'Mozdulat', MOVES, 0)), ctlSlider(X('inAt'), S('inAt', 'Kezdés (mp)', 0, mx, 0), { noAnim: true }), ctlSlider(X('inDur'), S('inDur', 'Időtartam (mp)', .05, 5, .8), { noAnim: true }), ctlSelect(X('ease'), SEL('ease', 'Görbe', EASES.map(e => e[0]), 0))]
    : [ctlSelect(X('out'), SEL('out', 'Mozdulat', MOVES, 0)), ctlSlider(X('outAt'), S('outAt', 'Kezdés (mp)', 0, mx, 0), { noAnim: true }), ctlSlider(X('outDur'), S('outDur', 'Időtartam (mp)', .05, 5, .8), { noAnim: true }), ctlSelect(X('ease'), SEL('ease', 'Görbe', EASES.map(e => e[0]), 0))];
}
const moCtl = (m: any, d: any, onInput?: () => void) => d.type === 'sel' ? ctlSelect(m.p[d.k], d) : ctlSlider(m.p[d.k], d, { noAnim: true, onInput });

/** The Mozgások section (replaces the old Időzítés section). */
export function motionsUI(L: any) {
  const mos = L.mo || [], leg = legacy(L); let cur = R.moSel[L.id];
  const all = [...leg.map(x => x.id), ...mos.map((m: any) => m.id)]; if (!all.includes(cur)) cur = all[0] || null;
  const row = h('div', { class: 'fxrow', role: 'toolbar', 'aria-label': 'Mozgások' });
  const pick = (id: string) => { R.moSel[L.id] = id; renderInsp(); markDirty(); };
  for (const x of leg) row.appendChild(h('button', { class: 'fxic' + (x.id === cur ? ' on' : ''), type: 'button', 'aria-pressed': String(x.id === cur), title: x.name, 'aria-label': x.name, html: svg(x.icon), onclick: () => pick(x.id) }));
  mos.forEach((m: any) => { const b = h('button', { class: 'fxic' + (m.id === cur ? ' on' : '') + (m.on === false ? ' off' : ''), type: 'button', 'aria-pressed': String(m.id === cur), title: `${MO[m.t].name} · erősség ${Math.round(m.p.amt.v * 100)}%`, 'aria-label': MO[m.t].name, html: moIcon(m.t), onclick: () => pick(m.id) }); ring(b, m.p.amt.v); row.appendChild(b); });
  const add = h('button', { class: 'fxic add', type: 'button', title: 'Mozgás hozzáadása', 'aria-label': 'Mozgás hozzáadása', 'aria-expanded': 'false' }, '+'); row.appendChild(add);
  const grid = h('div', { class: 'fxgrid', hidden: true, role: 'menu', 'aria-label': 'Mozgások' },
    ...MO_ORDER.map(t => h('button', { class: 'fxg', type: 'button', role: 'menuitem', title: MO[t].desc, onclick: () => { const i = LIB.motion.findIndex((x: any) => x.mo === t); attachMo(i, L.id); } }, h('span', { class: 'gi', html: moIcon(t) }), h('span', null, MO[t].name))),
    ...(['in', 'out'] as const).filter(w => !(L.tm && L.tm[w])).map(w => h('button', { class: 'fxg', type: 'button', role: 'menuitem', title: w === 'in' ? 'Egyszerű belépés (átúszás, emelkedés, oldalról …)' : 'Egyszerű kilépés', onclick: () => {
      L.tm = L.tm || { in: 0, inAt: 0, inDur: .8, out: 0, outAt: Math.max(0, (st.dur || 10) - 1), outDur: .8, ease: 0 }; L.tm[w] = 1; R.moSel[L.id] = 'tm:' + w; commit(); renderInsp(); } }, h('span', { class: 'gi', html: svg(TMI[w]) }), h('span', null, w === 'in' ? 'Beúszás' : 'Kiúszás'))));
  add.onclick = () => { grid.hidden = !grid.hidden; add.setAttribute('aria-expanded', String(!grid.hidden)); };
  const kids: any[] = [row, grid];
  if (cur && cur.startsWith('tm:')) { const w = cur.slice(3) as 'in' | 'out';
    kids.push(h('div', { class: 'fxi' }, h('header', null, h('span', { class: 'ln' }, w === 'in' ? 'Beúszás' : 'Kiúszás'), h('button', { class: 'eye', 'aria-label': 'Eltávolítás', title: 'Eltávolítás', onclick: () => { L.tm[w] = 0; commit(); renderInsp(); } }, '×')),
      h('div', { class: 'fxb' }, ...tmBody(L, w)))); }
  else if (cur) { const m = mos.find((x: any) => x.id === cur), d = MO[m.t]; const i = mos.indexOf(m);
    const eye = h('button', { class: 'eye', 'aria-label': 'Be/ki', title: m.on === false ? 'Bekapcsolás' : 'Kikapcsolás' }, m.on === false ? '○' : '●'); eye.onclick = () => { m.on = m.on === false; commit(); renderInsp(); markDirty(); };
    const del = h('button', { class: 'eye', 'aria-label': 'Eltávolítás', title: 'Eltávolítás' }, '×'); del.onclick = () => { mos.splice(i, 1); commit(); renderInsp(); markDirty(); };
    const ic = row.children[leg.length + i];
    kids.push(h('div', { class: 'fxi' }, h('header', null, h('span', { class: 'ln' }, d.name), eye, del),
      h('div', { class: 'fxb' }, h('p', { class: 'small' }, d.desc), ...d.params.map((q: any) => moCtl(m, q)), ctlSlider(m.p.amt, { ...AMT }, { noAnim: true, onInput: () => ring(ic, m.p.amt.v) }),
        m.t === 'spring' ? h('p', { class: 'small' }, 'Tipp: a vásznon a szaggatott nyíl végét húzva állítod, honnan és milyen messziről érkezik.') : null))); }
  else kids.push(h('p', { class: 'small' }, 'Még nincs mozgás. A „+” vagy a Mozgás polcról ráhúzott mozgás hozzáad egyet (Lebegés, Forgás, Lüktetés, Keringés, Remegés, Rugalmas beúszás).'));
  // per-layer key Loop
  const keyed = paramList(L).filter(q => q.o.k && q.o.k.length > 1);
  if (keyed.length) { const KL = L.kloop || { on: false, ret: .5 };
    const ret = { get v() { return KL.ret ?? .5; }, set v(x) { KL.ret = x; L.kloop = KL; markDirty(); } };
    kids.push(ctlSwitch('⟲ Kulcsanimáció ismétlése (csak ez a réteg)', !!KL.on, v => { L.kloop = { ...KL, on: v }; commit(); renderInsp(); markDirty(); }));
    if (KL.on) kids.push(ctlSlider(ret, S('ret', 'Visszatérés az elejére (mp)', .05, 5, .5), { noAnim: true }));
    const T = Math.max(...keyed.map(q => q.o.k[q.o.k.length - 1].t)), late = keyed.reduce((s, q) => s + q.o.k.filter((k: any) => k.t > st.dur + 1e-6).length, 0);
    if (late && st.loop && !KL.on) kids.push(h('p', { class: 'small warn' }, `${late} kulcs a projekt hossza (${st.dur} mp) után van, Loopnál ezek nem játszódnak le. `,
      h('button', { class: 'btn', onclick: () => { st.dur = Math.ceil(T); commit(); renderAll(); } }, `Hossz: ${Math.ceil(T)} mp`))); }
  // Képkocka-ütem: shown with its default, written into the layer only on the first change
  if (L.type !== 'group') { const T: any = L.tm || { fps: 0 }; kids.push(ctlSelect(fpsObj(T, () => { if (!L.tm) L.tm = { in: 0, inAt: 0, inDur: .8, out: 0, outAt: Math.max(0, (st.dur || 10) - 1), outDur: .8, ease: 0, fps: T.fps }; renderTimeline(); }), SEL('fps', 'Képkocka-ütem', FPS_OPTS.map(o => o[1]), 0))); }
  return section('Mozgások', 'mos', true, ...kids);
}
R.moUI = motionsUI;
/** Main settings: the strength of each motion (the same value as on the Mozgás tab). */
R.moMain = (L: any) => (L.mo || []).map((m: any) => ctlSlider(m.p.amt, { ...AMT, l: MO[m.t].name + ' erőssége' }, { noAnim: true }));

/* ---------- Rugalmas beúszás: arrow on the canvas (drag its tail = direction + distance) ---------- */
const ar = h('div', { class: 'moarrow', hidden: true });
ar.innerHTML = '<svg><line/></svg><i class="mohandle" title="Húzd: honnan és milyen messziről érkezik"></i>';
$('#wrap').appendChild(ar);
const hd: any = ar.querySelector('.mohandle'), ln: any = ar.querySelector('line'), sv: any = ar.querySelector('svg');
let drag: any = null;
const curSpring = () => { const L: any = sel(); if (!L || R.itab !== 'motion' || !L.mo) return null; const m = L.mo.find((x: any) => x.id === R.moSel[L.id] && x.t === 'spring'); return m ? { L, m } : null; };
R.updMoArrow = (t: number) => {
  const c = curSpring(); if (!c || R.seqPlay) { ar.hidden = true; return; } ar.hidden = false;
  const { L, m } = c; const cr = cv.getBoundingClientRect(), wr = ($('#wrap') as HTMLElement).getBoundingClientRect(); const { W, H } = outSize();
  const x = ev(L.n.x, BASEK.x, t), y = ev(L.n.y, BASEK.y, t), g = m.p.ang.v * Math.PI / 180, D = m.p.dist.v;
  const P = (ax: number, ay: number) => [cr.left - wr.left + (ax / (W / H) + .5) * cr.width, cr.top - wr.top + (.5 - ay) * cr.height];
  const [x1, y1] = P(x, y), [x0, y0] = P(x + Math.cos(g) * D, y + Math.sin(g) * D);
  sv.setAttribute('width', String(wr.width)); sv.setAttribute('height', String(wr.height));
  ln.setAttribute('x1', String(x0)); ln.setAttribute('y1', String(y0)); ln.setAttribute('x2', String(x1)); ln.setAttribute('y2', String(y1));
  hd.style.left = x0 + 'px'; hd.style.top = y0 + 'px';
};
hd.onpointerdown = (e: PointerEvent) => { const c = curSpring(); if (!c) return; e.stopPropagation(); e.preventDefault(); hd.setPointerCapture(e.pointerId); drag = c; };
hd.onpointermove = (e: PointerEvent) => { if (!drag) return; const { L, m } = drag; const p = toAsp(e); const x = ev(L.n.x, BASEK.x, R.time), y = ev(L.n.y, BASEK.y, R.time);
  const dx = p.x - x, dy = p.y - y; m.p.dist.v = Math.min(2, Math.round(Math.hypot(dx, dy) * 1000) / 1000); m.p.ang.v = Math.round(Math.atan2(dy, dx) * 180 / Math.PI); markDirty(); };
hd.onpointerup = () => { if (drag) { drag = null; commit(); renderInsp(); } };
