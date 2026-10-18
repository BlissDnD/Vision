/** XF1 Mozgás átadása + Sorrend festése (row 26): from a motion card, paint across other layers on the canvas; the touch order
 *  becomes the stagger order (numbered badges), a small card picks Ritmus / Út / Teljes and Késés. Until Elfogadás everything is a
 *  preview (R.xfPv, read by motion.effMo); Elfogadás = m.xf on the source + linked motions (m.src) on the targets, one undo step. */
import { R } from './runtime';
import { $, h } from './dom';
import { MO, XF_GETS, XF_MODES, effMo, makeMo, xfDetach, xfSrc } from './motion';
import { findItem, st, uid } from './state';
import { commit, renderAll } from './history';
import { ev } from './evaluation';
import { BASEK, S } from './effects/index';
import { behav, outSize } from './render';
import { cv } from './gl';
import { gizmoRadius, toAsp } from './stage';
import { ctlSlider } from './controls';
import { markDirty } from './loop';
import { toast } from './modals';
import { setPlay } from './transport';

const wrapEl = $('#wrap') as HTMLElement;
const nums = h('div', { class: 'xfnums', hidden: true }); wrapEl.appendChild(nums);
let card: HTMLElement | null = null, stroke = false;
const f2 = (v: number) => v.toFixed(2).replace('.', ',');

/** Rest position + motion of a layer now (aspect units), and a hit radius. */
function spot(L: any, t: number) {
  const B = behav(L, t), x = ev(L.n.x, BASEK.x, t) + (B ? B.dx : 0), y = ev(L.n.y, BASEK.y, t) + (B ? B.dy : 0);
  return { x, y, r: Math.max(.035, gizmoRadius(L, t)) };
}
/** The top-level layer under an aspect point (closest centre, relative to its size); the source is never a target. */
function hitLayer(p: { x: number; y: number }, srcId: string) {
  let best: any = null, bd = 1;
  for (const L of st.layers) { if (!L.vis || L.id === srcId || L.type === 'camera') continue;
    const s = spot(L, R.time), d = Math.hypot(p.x - s.x, p.y - s.y) / s.r; if (d < bd) { bd = d; best = L; } }
  return best;
}

/** Open the transfer card for motion m of layer L (re-paint when it already has targets). */
export function xfStart(L: any, m: any) {
  if (!L || !m || m.src) return; xfClose();
  const X = m.xf || {}; R.xfPv = { L, m, md: X.md | 0, gap: X.gap ?? .12, ids: [...(X.ids || [])] };
  card = h('div', { class: 'xfcard', role: 'dialog', 'aria-label': 'Transfer motion' });
  wrapEl.appendChild(card); drawCard(); markDirty();
  toast(`Drag across the targets (or click them): the order is the painting order · ⇧ appends · Esc cancels`);
}
R.xfStart = xfStart;
function drawCard() {
  const P = R.xfPv; if (!card || !P) return; card.innerHTML = '';
  const chips = h('div', { class: 'rychips', role: 'radiogroup', 'aria-label': 'What to transfer' },
    ...XF_MODES.map((nm, i) => h('button', { class: 'rychip' + (P.md === i ? ' on' : ''), type: 'button', role: 'radio', 'aria-checked': String(P.md === i),
      title: ['Targets arrive at their own positions, with the source\'s timing and character', 'Targets get the source\'s direction, distance and arc, scaled to their own size', 'Everything: time, space and strength'][i],
      onclick: () => { P.md = i; drawCard(); markDirty(); } }, nm)));
  const gap = { get v() { return P.gap; }, set v(x) { P.gap = x; markDirty(); } };
  const names = P.ids.map((id: string, i: number) => { const r = findItem(id); return `${i + 1}. ${r ? r.it.name : '(missing)'}`; });
  card.append(h('div', { class: 'xfhd' }, h('b', null, `Transfer ${MO[P.m.t].name}`), h('span', { class: 'small' }, ` · source: ${P.L.name}`)),
    h('p', { class: 'small' }, P.ids.length ? names.join(' · ') : 'Paint across the targets on the canvas (clicking works too). ⇧: append.'),
    chips, ctlSlider(gap, S('gap', 'Delay (s / target)', 0, 1, .12, .01), { noAnim: true }),
    h('div', { class: 'xfbtns' },
      h('button', { class: 'btn', type: 'button', onclick: xfClose }, 'Cancel'),
      h('button', { class: 'btn accent', type: 'button', onclick: xfAccept }, P.ids.length || P.m.xf ? 'Accept' : 'Done')));
}
/** Close without changing the project. */
export function xfClose() { R.xfPv = null; stroke = false; if (card) { card.remove(); card = null; } markDirty(); }
/** Elfogadás: write the source's m.xf and one linked motion per target (removed targets lose theirs); one undo step. */
export function xfAccept() {
  const P = R.xfPv; if (!P) return; const { L, m } = P; R.xfPv = null;
  const ids = P.ids.filter((id: string) => findItem(id));
  for (const id of new Set([...(m.xf ? m.xf.ids : []), ...ids])) { const r = findItem(id); if (!r) continue; const T = r.it;
    const has = (T.mo || []).find((x: any) => x.src && x.src.m === m.id);
    if (ids.includes(id)) { if (!has) (T.mo = T.mo || []).push({ ...makeMo(m.t), id: 'M' + uid().slice(1), src: { l: L.id, m: m.id } }); }
    else if (has) T.mo.splice(T.mo.indexOf(has), 1); }
  if (ids.length) m.xf = { md: P.md, gap: Math.round(P.gap * 1000) / 1000, ids }; else delete m.xf;
  if (card) { card.remove(); card = null; }
  commit(); renderAll(); markDirty();
  if (ids.length) toast(`${MO[m.t].name} → ${ids.length} targets (${XF_MODES[P.md]}, ${f2(P.gap)} s step) · ⌘Z undoes it`);
}

// painting: capture-phase so the stage does not move the selected layer
const addAt = (e: PointerEvent) => { const P = R.xfPv; const T = hitLayer(toAsp(e), P.L.id); if (T && !P.ids.includes(T.id)) { P.ids.push(T.id); P.v = null; drawCard(); markDirty();
  if (!R.playing && !R.noAutoPlay) setPlay(true); } };
wrapEl.addEventListener('pointerdown', (e: PointerEvent) => {
  if (!R.xfPv || e.button !== 0 || (e.target as HTMLElement).closest('.xfcard,.hudbar,.hud,.tl,.tlx,.textbar')) return;
  e.stopPropagation(); e.preventDefault(); stroke = true; try { wrapEl.setPointerCapture(e.pointerId); } catch (_) { /* ignore */ }
  if (!e.shiftKey) { R.xfPv.ids = []; R.xfPv.v = null; } addAt(e); drawCard();
}, true);
wrapEl.addEventListener('pointermove', (e: PointerEvent) => { if (!stroke || !R.xfPv) return; e.stopPropagation(); addAt(e); }, true);
const endStroke = (e: PointerEvent) => { if (!stroke) return; stroke = false; e.stopPropagation(); };
wrapEl.addEventListener('pointerup', endStroke, true); wrapEl.addEventListener('pointercancel', endStroke, true);
document.addEventListener('keydown', e => { if (e.key === 'Escape' && R.xfPv) { e.stopPropagation(); xfClose(); } }, true);

/** Numbered order badges: while painting, and (faint) while the source motion is open on the Mozgás tab. */
R.updXf = (t: number) => {
  let src: any = null, ids: string[] = [], live = false;
  if (R.xfPv) { src = R.xfPv; ids = R.xfPv.ids; live = true; }
  else if (R.itab === 'motion' && R.selId && !R.seqPlay) { const r = findItem(R.selId), L = r && r.it, m = L && (L.mo || []).find((x: any) => x.id === R.moSel[L.id]) || (L && L.mo && L.mo[0]);
    if (m && m.xf) { src = { L, m }; ids = m.xf.ids; } }
  if (!src || !ids.length) { if (!nums.hidden) { nums.hidden = true; nums.innerHTML = ''; } return; }
  nums.hidden = false; nums.classList.toggle('live', live);
  const cr = cv.getBoundingClientRect(), wr = wrapEl.getBoundingClientRect(), { W, H } = outSize();
  while (nums.children.length < ids.length) nums.appendChild(h('i', null));
  while (nums.children.length > ids.length) nums.lastChild!.remove();
  ids.forEach((id, i) => { const el = nums.children[i] as HTMLElement, r = findItem(id); if (!r) { el.hidden = true; return; } el.hidden = false;
    const s = spot(r.it, t); el.textContent = String(i + 1);
    el.style.left = (cr.left - wr.left + (s.x / (W / H) + .5) * cr.width) + 'px'; el.style.top = (cr.top - wr.top + (.5 - s.y - s.r * .7) * cr.height) + 'px'; });
};

/** Mozgás tab: the transfer part of a motion card (source: button + summary + targets; target: what it gets, Leválasztás). */
export function xfSection(L: any, m: any): HTMLElement | null {
  if (!MO[m.t]) return null;
  if (m.src) { const S = xfSrc(m);
    if (!S) return h('div', { class: 'xfbox' }, h('p', { class: 'small' }, 'Transferred motion, but its source is gone: it runs on its own values.'),
      h('button', { class: 'btn', type: 'button', onclick: () => { delete m.src; commit(); renderAll(); } }, 'Detach'));
    const i = S.xf ? S.xf.ids.indexOf(L.id) : -1, E = effMo(m, L);
    return h('div', { class: 'xfbox' }, h('p', { class: 'xfgets' }, `${XF_GETS[S.xf ? S.xf.md | 0 : 0]} from: `, h('b', null, S.L.name)),
      h('p', { class: 'small' }, i >= 0 ? `${i + 1}. in the queue · ${f2(E && E.dl || 0)} s delay · follows the source's edits` : 'Not in the source\'s order: not running now.'),
      h('div', { class: 'xfbtns' },
        h('button', { class: 'btn', type: 'button', title: 'Open the source motion', onclick: () => { R.selId = S.L.id; R.moSel[S.L.id] = S.m.id; renderAll(); } }, 'Source'),
        h('button', { class: 'btn', type: 'button', title: 'Becomes independent motion with the values you see now (no longer follows the source)', onclick: () => { xfDetach(L, m); commit(); renderAll(); markDirty(); toast('Detached: independent motion · ⌘Z undoes it'); } }, 'Detach')));
  }
  const X = m.xf, kids: any[] = [h('button', { class: 'btn xfgo', type: 'button', title: 'Paint across the other elements on the canvas: the same motion reaches them in painting order, staggered', onclick: () => xfStart(L, m) }, X ? '⇢ Repaint the order' : '⇢ Transfer / Paint the order')];
  if (X) { const miss = X.ids.filter((id: string) => !findItem(id)).length;
    const gap = { get v() { return X.gap; }, set v(x) { X.gap = x; markDirty(); } };
    kids.push(h('div', { class: 'rychips', role: 'radiogroup', 'aria-label': 'What it transfers' }, ...XF_MODES.map((nm, i) => h('button', { class: 'rychip' + ((X.md | 0) === i ? ' on' : ''), type: 'button', role: 'radio', 'aria-checked': String((X.md | 0) === i), onclick: () => { X.md = i; commit(); renderAll(); markDirty(); } }, nm))),
      ctlSlider(gap, S('gap', 'Delay (s / target)', 0, 1, .12, .01), { noAnim: true }),
      h('ol', { class: 'xflist' }, ...X.ids.map((id: string) => { const r = findItem(id);
        return h('li', { class: r ? '' : 'miss' }, h('span', null, r ? r.it.name : '(missing target)'), h('button', { class: 'eye', type: 'button', 'aria-label': 'Remove from queue', title: 'Remove from queue (the target\'s motion ends)', onclick: () => {
          X.ids = X.ids.filter((x: string) => x !== id); if (r) { const has = (r.it.mo || []).find((x: any) => x.src && x.src.m === m.id); if (has) r.it.mo.splice(r.it.mo.indexOf(has), 1); }
          if (!X.ids.length) delete m.xf; commit(); renderAll(); markDirty(); } }, '×')); })),
      miss ? h('p', { class: 'small warn' }, `${miss} targets missing (deleted layers). × removes them from the queue.`) : null);
  }
  return h('div', { class: 'xfbox' }, ...kids);
}
R.xfSection = xfSection;
