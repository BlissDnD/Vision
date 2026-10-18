/** Mozgás v1 UI: the Mozgások section on the Mozgás tab (icon row like the effects: Beúszás/Kiúszás from L.tm + the
 *  draggable motions L.mo, strength ring, „+” grid), the per-layer key Loop (⟲), Képkocka-ütem, a warning for keys past
 *  the project end and attaching from the shelf (click / drop on canvas / drop on a layer row). Canvas gestures: gesture.ts. */
import { R } from './runtime';
import { $, h } from './dom';
import { LIB } from './library';
import { MO, MO_ORDER, AMT, RY_N, RY_PRE, bakeMo, makeMo, moClip, moIcon, moLoopInfo, ryVal, ryValU, setRy, xfSrc, xfTakes } from './motion';
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
import { loopOn } from './time';

R.moSel = {};
const ring = (el: any, v: number) => el.style.setProperty('--s', String(Math.max(0, Math.min(1, v))));
const TMI = { in: '<path d="M3 12h11M10 8l4 4-4 4"/><path d="M19 5v14"/>', out: '<path d="M5 5v14"/><path d="M10 12h11M17 8l4 4-4 4"/>' };
const svg = (p: string) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${p}</svg>`;

/** Attach motion `type` (shelf index i) to an item; selects it and opens it on the Mozgás tab. */
export function attachMo(i: number, refId?: string | null) {
  const li: any = (LIB.motion as any[])[i]; const r = refId ? findItem(refId) : (R.selId ? findItem(R.selId) : null);
  if (!li || !li.mo) return null;
  if (!r) { toast(`${li.name}: jelölj ki egy réteget, vagy húzd rá egy rétegre (vásznon vagy a rétegsorban).`); return null; }
  const L = r.it; const m: any = makeMo(li.mo, li.mo === 'spring' ? { at: Math.round(Math.max(0, R.time) * 100) / 100 } : {});
  if (MO[li.mo] && MO[li.mo].cont && loopOn()) m.lp = 1;  // Körbeér on by default when the project loops
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
// v1.1: motion sliders are animatable (◆ / ∿, keys on the timeline under the motion row); the spring's timing stays on its clip
const moCtl = (m: any, d: any, onInput?: () => void) => d.type === 'sel' ? ctlSelect(m.p[d.k], d) : ctlSlider(m.p[d.k], d, { noAnim: m.t === 'spring' && (d.k === 'at' || d.k === 'dur'), onInput });

/* ---------- Ritmus (continuous motions): preset chips, the editable one-cycle strip with a live dot, Tempó / Erő ---------- */
const RY_MAX = 2;
const ryPath = (P: number[]) => { let d = ''; for (let i = 0; i <= 80; i++) { const u = i / 80, v = ryValU(P, u % 1 === 0 && i ? 0 : u); d += (i ? 'L' : 'M') + (u * 200).toFixed(1) + ' ' + ((1 - v / RY_MAX) * 48).toFixed(1); } return d; };
function rhythmUI(L: any, m: any) {
  const k = m.ry ? m.ry.k : 0, pts = m.ry ? m.ry.pts : Array(RY_N).fill(1);
  const chips = h('div', { class: 'rychips', role: 'radiogroup', 'aria-label': 'Ritmus' },
    ...RY_PRE.map((P, i) => h('button', { class: 'rychip' + (i === k ? ' on' : ''), type: 'button', role: 'radio', 'aria-checked': String(i === k), title: P.tip, onclick: () => { setRy(m, i); commit(); renderInsp(); markDirty(); } }, P.name)),
    k === 5 ? h('span', { class: 'rychip on', role: 'radio', 'aria-checked': 'true', title: 'Saját görbe (a szalagon húzva)' }, 'Egyéni') : null);
  const strip = h('div', { class: 'rystrip', 'data-mo': m.id, title: 'Egy ütem: pont le = lassabb / megáll, fel = gyorsabb · a jobb szélt húzva az ütem hossza' });
  strip.innerHTML = `<svg viewBox="0 0 200 48" preserveAspectRatio="none"><line x1="0" x2="200" y1="24" y2="24" class="rymid"/><path class="rycv" d="${ryPath(pts)}"/></svg>`;
  const cvp: any = strip.querySelector('.rycv');
  const ensure = () => { if (!m.ry) m.ry = { k: 5, cyc: 5, tgt: 0, rnd: 0, seed: 1, pts: [...pts] }; m.ry.k = 5; return m.ry; };
  pts.forEach((v: number, i: number) => {
    const pt = h('i', { class: 'rypt', style: `left:${i / RY_N * 100}%;top:${(1 - v / RY_MAX) * 100}%`, title: `${Math.round(v * 100)}%` });
    pt.onpointerdown = (e: PointerEvent) => { e.preventDefault(); e.stopPropagation(); pt.setPointerCapture(e.pointerId); const ry = ensure();
      pt.onpointermove = (ev: PointerEvent) => { const r = strip.getBoundingClientRect(); let x = Math.max(0, Math.min(RY_MAX, (1 - (ev.clientY - r.top) / r.height) * RY_MAX)); if (Math.abs(x - 1) < .07) x = 1; if (x < .07) x = 0;
        ry.pts[i] = Math.round(x * 100) / 100; pt.style.top = (1 - x / RY_MAX) * 100 + '%'; pt.title = Math.round(x * 100) + '%'; cvp.setAttribute('d', ryPath(ry.pts)); markDirty(); };
      pt.onpointerup = () => { pt.onpointermove = pt.onpointerup = null; commit(); renderInsp(); }; };
    strip.appendChild(pt); });
  const cyc = m.ry ? m.ry.cyc : 5;
  const edge = h('b', { class: 'ryedge', title: 'Húzd: az ütem hossza' }, h('span', null, `${cyc.toFixed(1).replace('.', ',')} mp`));
  edge.onpointerdown = (e: PointerEvent) => { e.preventDefault(); e.stopPropagation(); edge.setPointerCapture(e.pointerId); const ry = ensure(); if (k) ry.k = k; const c0 = ry.cyc, x0 = e.clientX, w = strip.getBoundingClientRect().width || 1;
    edge.onpointermove = (ev: PointerEvent) => { ry.cyc = Math.max(.5, Math.min(30, Math.round(c0 * (w + ev.clientX - x0) / w * 10) / 10)); (edge.firstChild as any).textContent = `${ry.cyc.toFixed(1).replace('.', ',')} mp`; markDirty(); };
    edge.onpointerup = () => { edge.onpointermove = edge.onpointerup = null; commit(); renderInsp(); }; };
  strip.append(edge, h('i', { class: 'rydot' }));
  const kids: any[] = [chips, strip];
  if (m.ry && m.t !== 'spin') { const tg = m.ry.tgt === 1 ? 1 : 0;
    kids.push(h('div', { class: 'seg rytgt', role: 'radiogroup', 'aria-label': 'Mire hat a ritmus' }, ...['Tempó (megáll, ahol van)', 'Erő (visszatér nyugalomba)'].map((l, i) =>
      h('button', { type: 'button', role: 'radio', class: i === tg ? 'on' : '', 'aria-checked': String(i === tg), 'aria-pressed': String(i === tg), onclick: () => { m.ry.tgt = i; commit(); renderInsp(); markDirty(); } }, l)))); }
  if (m.ry && m.ry.rnd) kids.push(h('button', { class: 'btn', type: 'button', title: 'Más, de ugyanúgy ismételhető szünetminta', onclick: () => { m.ry.seed = (m.ry.seed || 1) + 1; commit(); markDirty(); toast('Új szünetminta: ' + m.ry.seed); } }, '🎲 Új minta'));
  const C = moClip(m);
  kids.push(h('p', { class: 'small' }, `Sáv: ${C.a.toFixed(1).replace('.', ',')} mp – ${C.b == null ? 'végig (nyitott vég)' : C.b.toFixed(1).replace('.', ',') + ' mp'}. A Sávokon a réteg ▸ alatt húzhatod; a végein puhán indul és áll le.`));
  return h('div', { class: 'ryw' }, h('div', { class: 'rylab' }, 'Ritmus'), ...kids);
}
/** Live dot on the rhythm strip (called every frame from the render loop). */
R.updMoRy = (t: number) => { const s: any = document.querySelector('#insp .rystrip'); if (!s) return; const L: any = sel(); const m = L && (L.mo || []).find((x: any) => x.id === s.dataset.mo); const dot = s.querySelector('.rydot');
  if (!m) return; const C = moClip(m), x = t - C.a, cyc = m.ry ? Math.max(.2, m.ry.cyc) : 5;
  if (x < 0 || (C.b != null && t > C.b)) { dot.hidden = true; return; } dot.hidden = false; const u = x / cyc - Math.floor(x / cyc), v = m.ry ? ryVal(m.ry, x) : 1;
  dot.style.left = u * 100 + '%'; dot.style.top = (1 - v / RY_MAX) * 100 + '%'; };

/** The Mozgások section (replaces the old Időzítés section). */
/* Körbeér (row 22): whole cycles per loop, so the loop export joins exactly; the stored Ütem is not rewritten */
const loopTip = (m: any) => { const el = document.getElementById('moLoopInfo'); if (el) el.textContent = m.lp ? moLoopInfo(m) || '' : ''; };
function loopRow(m: any) {
  const sw = ctlSwitch('Körbeér (egész kör a loopban)', !!m.lp, v => { if (v) m.lp = 1; else delete m.lp; commit(); renderInsp(); markDirty(); });
  sw.title = 'A tempó a legközelebbi olyan értékre igazodik, amelynél egész számú kör fér a projekt (jelenet) hosszába: a loop vége pontosan az elejébe ér.';
  return h('div', { class: 'moloop' }, sw, h('p', { class: 'small', id: 'moLoopInfo' }, m.lp ? moLoopInfo(m) || '' : ''));
}
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
  const kids: any[] = [R.koSection ? R.koSection(L) : null, row, grid];
  if (cur && cur.startsWith('tm:')) { const w = cur.slice(3) as 'in' | 'out';
    kids.push(h('div', { class: 'fxi' }, h('header', null, h('span', { class: 'ln' }, w === 'in' ? 'Beúszás' : 'Kiúszás'), h('button', { class: 'eye', 'aria-label': 'Eltávolítás', title: 'Eltávolítás', onclick: () => { L.tm[w] = 0; commit(); renderInsp(); } }, '×')),
      h('div', { class: 'fxb' }, ...tmBody(L, w)))); }
  else if (cur) { const m = mos.find((x: any) => x.id === cur), d = MO[m.t]; const i = mos.indexOf(m);
    const eye = h('button', { class: 'eye', 'aria-label': 'Be/ki', title: m.on === false ? 'Bekapcsolás' : 'Kikapcsolás' }, m.on === false ? '○' : '●'); eye.onclick = () => { m.on = m.on === false; commit(); renderInsp(); markDirty(); };
    const del = h('button', { class: 'eye', 'aria-label': 'Eltávolítás', title: 'Eltávolítás' }, '×'); del.onclick = () => { mos.splice(i, 1); commit(); renderInsp(); markDirty(); };
    const ic = row.children[leg.length + i];
    // XF1: a linked motion shows only its own fields (the rest comes from the source); own(0) = rhythm/loop/clip are its own
    const XS = m.src ? xfSrc(m) : null, xmd = XS && XS.xf ? XS.xf.md | 0 : -1;
    const own = (w: number, k?: string) => xmd < 0 ? true : w === 0 ? xmd === 1 : k === 'amt' ? xmd !== 2 : !xfTakes(xmd, k!);
    kids.push(h('div', { class: 'fxi' }, h('header', null, h('span', { class: 'ln' }, d.name), eye, del),
      h('div', { class: 'fxb' }, h('p', { class: 'small' }, d.desc), R.xfSection ? R.xfSection(L, m) : null, d.cont && !own(0) ? null : d.cont ? rhythmUI(L, m) : null, ...d.params.filter((q: any) => own(1, q.k)).map((q: any) => moCtl(m, q, d.cont ? () => loopTip(m) : undefined)), d.cont && own(0) ? loopRow(m) : null, own(1, 'amt') ? ctlSlider(m.p.amt, { ...AMT }, { onInput: () => ring(ic, m.p.amt.v) }) : null,
        m.t === 'spring' ? h('p', { class: 'small' }, 'Tipp: a vásznon a nyíl végét húzva állítod, honnan érkezik; ⌘ + fel/le a tempó, ⌘ + oldalra a karakter, ⌥ vagy a nyíl közepe: ív, ⇧: 15°-os szögek.') : null,
        h('button', { class: 'btn mobake', type: 'button', title: 'A mozgást valódi X / Y / Méret / Szög / Átlátszóság kulcsokká alakítja (a mozgás eltűnik; ⌘Z visszavonja)', onclick: () => {
          const n = bakeMo(L, m); delete R.moSel[L.id]; commit(); renderAll(); markDirty(); toast(`${d.name} → ${n} kulcskocka a réteg saját értékein · ⌘Z visszavonja`); } }, 'Kulcsokká alakítás')))); }
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
R.moMain = (L: any) => (L.mo || []).map((m: any) => ctlSlider(m.p.amt, { ...AMT, l: MO[m.t].name + ' erőssége' }));

/* The on-canvas arrow (Rugalmas beúszás, Beúszás/Kiúszás) and the handles of the continuous motions live in gesture.ts. */
