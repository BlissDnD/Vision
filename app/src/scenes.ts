/* S1 · Jelenetek és átmenetek (leltár 19.)
 * A scene is a saved copy of the composition (layers keep their ids). The Jelenetek strip lists them in order; the
 * workbench (st.layers) stays the editable canvas: "Betöltés" copies a scene onto it, "Felülírás" stores it back.
 * Jelenetsor mode plays the scenes one after another on the shared clock; st.dur temporarily becomes the total.
 * Transition into scene i (its first trans.dur seconds): layer by layer —
 *   matched (explicit pair › same id › same Közös alap bid › same type + name): placement, colours and parameters glide
 *   from the previous scene (still running past its end) to the new one;
 *   only in the previous scene: fades and shrinks out (keeps running); only in the new one: fades and grows in. */
import { R } from './runtime';
import { $, h } from './dom';
import { BASEK, EFFECTS, pdefOf } from './effects/index';
import { EASE_NAMES, hexRGB } from './palettes';
import { normalize, st } from './state';
export { setScenes } from './history';
import { ev } from './evaluation';
import { EASES } from './render';
import { commit, renderAll } from './history';
import { markDirty } from './loop';
import { resetFeedback, setPlay } from './transport';
import { toast } from './modals';

export interface Scene { id: string; name: string; dur: number; layers: any[]; trans: { dur: number; ease: number; pairs: Record<string, string> } }
const sid = () => 'S' + Math.random().toString(36).slice(2, 9);
const clone = (x: any) => JSON.parse(JSON.stringify(x));
export const scenes = (): Scene[] => (st as any).scenes || ((st as any).scenes = []);
/* ---------- editing ---------- */
export function saveScene(name?: string) {
  const S = scenes(); const s: Scene = { id: sid(), name: name || `Jelenet ${S.length + 1}`, dur: R.seqPlay ? R.seqDurSave : st.dur, layers: clone(st.layers), trans: { dur: 1, ease: 3, pairs: {} } };
  S.push(s); syncTotal(); return s;
}
export function loadScene(id: string) { const s = scenes().find(x => x.id === id); if (!s) return; setSeqPlay(false); st.layers = clone(s.layers).map(normalize); st.dur = s.dur; R.selId = (st.layers[st.layers.length - 1] || {}).id || null; }
export function overwriteScene(id: string) { const s = scenes().find(x => x.id === id); if (!s) return; s.layers = clone(st.layers); s.dur = R.seqPlay ? R.seqDurSave : st.dur; syncTotal(); }
export function removeScene(id: string) { const S = scenes(), i = S.findIndex(x => x.id === id); if (i >= 0) S.splice(i, 1); if (!S.length) setSeqPlay(false); syncTotal(); }
export function moveScene(id: string, d: number) { const S = scenes(), i = S.findIndex(x => x.id === id), j = i + d; if (i < 0 || j < 0 || j >= S.length) return; S.splice(j, 0, S.splice(i, 1)[0]); }
export const seqTotal = () => scenes().reduce((a, s) => a + s.dur, 0);
function syncTotal() { if (R.seqPlay) st.dur = Math.max(.1, seqTotal()); }

/* ---------- matching ---------- */
interface Pair { a?: any; b?: any }
/** Pair the layers of two lists. Order: the new scene's order; previous-only layers stay above their old lower neighbour. */
export function matchLayers(As: any[], Bs: any[], pairs: Record<string, string> = {}): Pair[] {
  const A = As.filter(L => L.vis), B = Bs.filter(L => L.vis), used = new Set<any>(), of = new Map<any, any>();
  const take = (b: any, a: any) => { if (a && !used.has(a)) { used.add(a); of.set(b, a); return true; } return false; };
  for (const b of B) if (pairs[b.id] !== undefined) { take(b, pairs[b.id] ? A.find(a => a.id === pairs[b.id]) : null); if (!of.has(b)) of.set(b, null); }
  for (const b of B) if (!of.has(b)) take(b, A.find(a => a.id === b.id));
  for (const b of B) if (!of.has(b) && b.bid) take(b, A.find(a => a.bid && a.bid === b.bid && !used.has(a)));
  for (const b of B) if (!of.has(b)) take(b, A.find(a => !used.has(a) && a.type === b.type && a.name === b.name));
  const out: Pair[] = B.map(b => ({ a: of.get(b) || undefined, b }));
  // previous-only layers: insert after the pair that holds their nearest lower matched neighbour
  let at = 0;
  for (const a of A) {
    if (used.has(a)) { const k = out.findIndex(p => p.a === a); if (k >= 0) at = k + 1; continue; }
    out.splice(at, 0, { a }); at++;
  }
  return out;
}

/* ---------- transition frame ---------- */
const lerp = (x: number, y: number, e: number) => x + (y - x) * e;
const mixHex = (x: string, y: string, e: number) => '#' + hexRGB(x).map((c, i) => Math.round(lerp(c, hexRGB(y)[i], e) * 255).toString(16).padStart(2, '0')).join('');
const stat = (v: any) => ({ v, a: 0, f: .2, w: 0 });
/** Copy of a node whose value is multiplied by m (keeps keys, waves and Kapcsolat of the original). */
function scaled(n: any, m: number) { const c = { ...n }, prev = n._lk && n._lk.f; Object.defineProperty(c, '_lk', { value: { f: (t: number, v: number) => (prev ? prev(t, v) : v) * m }, enumerable: false }); return c; }
const pdef = (L: any, k: string) => EFFECTS[L.type] && pdefOf(L, k);
function mixGroup(gA: any, gB: any, a: any, b: any, tA: number, tB: number, e: number, isN: boolean) {
  const out: any = {};
  for (const k in b) {
    const nb = b[k], na = a && a[k], d = isN ? (BASEK as any)[k] : pdef(gB, k);
    if (!nb || typeof nb !== 'object' || !d) { out[k] = nb; continue; }
    if (!na) { out[k] = nb; continue; }
    if (d.type === 'color') { out[k] = stat(mixHex(na.v, nb.v, e)); continue; }
    if (d.type) { out[k] = e < .5 ? na : nb; continue; }
    out[k] = stat(lerp(ev(na, d, tA), ev(nb, d, tB), e));
  }
  return out;
}
function mixLayer(a: any, b: any, tA: number, tB: number, e: number, pairs: Record<string, string>, toff: number): any {
  const L: any = { ...b, n: mixGroup(a, b, a.n, b.n, tA, tB, e, true) };
  if (a.type === b.type) {
    if (b.p) L.p = mixGroup(a, b, a.p, b.p, tA, tB, e, false);
    if ((a.fx || []).length === (b.fx || []).length && (b.fx || []).every((f: any, i: number) => f.type === a.fx[i].type))
      L.fx = b.fx.map((f: any, i: number) => ({ ...f, p: mixGroup(a.fx[i], f, a.fx[i].p, f.p, tA, tB, e, false) }));
    if (e < .5) { L.pal = a.pal; if (a.text) L.text = a.text; }
  }
  if (a.type === 'group' && b.type === 'group') L.children = composeList(a.children || [], b.children || [], tA, tB, e, pairs, toff);
  return L;
}
function composeList(As: any[], Bs: any[], tA: number, tB: number, e: number, pairs: Record<string, string>, toff: number) {
  return matchLayers(As, Bs, pairs).map(p => {
    if (p.a && p.b) return mixLayer(p.a, p.b, tA, tB, e, pairs, toff);
    if (p.b) return { ...p.b, n: { ...p.b.n, opacity: scaled(p.b.n.opacity, e), s: scaled(p.b.n.s, .9 + .1 * e) } };
    const L = { ...p.a, n: { ...p.a.n, opacity: scaled(p.a.n.opacity, 1 - e), s: scaled(p.a.n.s, 1 - .08 * e) } };
    Object.defineProperty(L, '_toff', { value: toff, enumerable: false }); return L;
  });
}
/** What to render at sequence time T: { items, t (local time of the current scene), i, e (transition progress or -1) }. */
export function seqFrame(T: number) {
  const S = scenes(); if (!S.length) return null;
  let start = 0;
  for (let i = 0; i < S.length; i++) {
    const s = S[i], last = i === S.length - 1;
    if (T < start + s.dur || last) {
      const u = Math.max(0, T - start), td = s.trans.dur; R.seqLen = s.dur;
      if (i > 0 && td > 0 && u < td) {
        const P = S[i - 1], e = EASES[s.trans.ease] ? EASES[s.trans.ease][1](u / td) : u / td;
        // the previous scene keeps running past its end: its layers are evaluated at P.dur + u
        return { items: composeList(P.layers, s.layers, P.dur + u, u, e, s.trans.pairs, P.dur), t: u, i, e };
      }
      return { items: s.layers, t: u, i, e: -1 };
    }
    start += s.dur;
  }
  return null;
}
R.seqFrame = seqFrame;
export const sceneStart = (i: number) => scenes().slice(0, i).reduce((a, s) => a + s.dur, 0);

/* ---------- Jelenetsor mode ---------- */
R.seqPlay = false; R.seqDurSave = 10;
export function setSeqPlay(on: boolean) {
  if (on === !!R.seqPlay) return;
  if (on) { if (!scenes().length) { toast("Save at least one scene first."); return; } R.seqDurSave = st.dur; R.seqPlay = true; st.dur = Math.max(.1, seqTotal()); R.time = 0; }
  else { R.seqPlay = false; st.dur = R.seqDurSave; R.time = 0; }
  resetFeedback(); markDirty(); renderStrip(); renderAll();
  const d = $('#tlDur') as HTMLInputElement; if (d) d.value = String(+st.dur.toFixed(2));
}
/** restore()/load: the file's own dur is applied by the caller, so just leave the mode. */
R.seqExit = () => { if (R.seqPlay) { R.seqPlay = false; renderStrip(); } };

/* ---------- strip UI ---------- */
const strip = $('#scn') as HTMLElement, btn = $('#scnBtn') as HTMLElement;
let card: HTMLElement | null = null, cardOff: any = null;
export function closeScnCard() { if (card) { card.remove(); card = null; } if (cardOff) { document.removeEventListener('pointerdown', cardOff, true); cardOff = null; } }
function openCard(anchor: HTMLElement, ...kids: any[]) {
  closeScnCard(); card = h('div', { class: 'popover scard', role: 'dialog' }, ...kids); document.body.appendChild(card);
  const r = anchor.getBoundingClientRect(), w = card.offsetWidth, hh = card.offsetHeight;
  card.style.left = Math.min(innerWidth - w - 10, Math.max(10, r.left + r.width / 2 - w / 2)) + 'px'; card.style.top = Math.max(10, r.top - hh - 8) + 'px';
  setTimeout(() => { cardOff = (e: any) => { if (card && !card.contains(e.target) && !anchor.contains(e.target)) closeScnCard(); }; document.addEventListener('pointerdown', cardOff, true); }, 0);
}
const done = (msg?: string) => { commit(); renderStrip(); if (msg) toast(msg); };
function sceneCard(s: Scene, el: HTMLElement) {
  const nm = h('input', { class: 'txt', value: s.name, 'aria-label': 'Jelenet neve' }) as HTMLInputElement; nm.onchange = () => { s.name = nm.value.trim() || s.name; done(); };
  const du = h('input', { class: 'val', type: 'number', min: .5, max: 120, step: .5, value: s.dur, 'aria-label': 'Jelenet hossza (mp)' }) as HTMLInputElement;
  du.onchange = () => { s.dur = Math.min(120, Math.max(.5, +du.value || s.dur)); syncTotal(); done(); };
  openCard(el, h('div', { class: 'pl' }, 'Jelenet'), h('div', { class: 'pc' }, nm, h('div', { class: 'row2' }, h('span', null, 'Hossz (mp)'), du)),
    h('div', { class: 'btnrow' },
      h('button', { class: 'btn', title: "Load this scene onto the canvas for editing (undoable)", onclick: () => { loadScene(s.id); closeScnCard(); commit(); renderAll(); renderStrip(); toast(`Loaded: ${s.name}. Edit it, then choose “Replace with canvas”.`); } }, "Load onto canvas"),
      h('button', { class: 'btn', title: "Replace this scene with the current canvas", onclick: () => { overwriteScene(s.id); closeScnCard(); done(`${s.name}: replaced with the current canvas.`); } }, "Replace with canvas")),
    h('div', { class: 'btnrow' },
      h('button', { class: 'btn', 'aria-label': "Earlier", onclick: () => { moveScene(s.id, -1); closeScnCard(); done(); } }, "← Earlier"),
      h('button', { class: 'btn', 'aria-label': "Later", onclick: () => { moveScene(s.id, 1); closeScnCard(); done(); } }, "Later →"),
      h('button', { class: 'btn', onclick: () => { removeScene(s.id); closeScnCard(); done("Scene deleted."); renderAll(); } }, "Delete")));
}
function transCard(i: number, el: HTMLElement) {
  const S = scenes(), s = S[i], P = S[i - 1];
  const len = h('input', { type: 'range', min: 0, max: 3, step: .1, value: s.trans.dur, 'aria-label': "Transition duration" }) as HTMLInputElement;
  const lv = h('b', null, s.trans.dur.toFixed(1) + ' mp');
  len.oninput = () => { s.trans.dur = Math.min(+len.value, s.dur); lv.textContent = s.trans.dur.toFixed(1) + ' mp'; markDirty(); renderStrip(); }; len.onchange = () => done();
  const es = h('select', { 'aria-label': "Transition curve" }, ...EASE_NAMES.map((n, k) => { const o = h('option', { value: k }, n) as HTMLOptionElement; if (k === s.trans.ease) o.selected = true; return o; })) as HTMLSelectElement;
  es.onchange = () => { s.trans.ease = +es.value; done(); };
  const auto = matchLayers(P.layers, s.layers, {});
  const rows = s.layers.filter((b: any) => b.vis).slice().reverse().map((b: any) => {
    const ap = auto.find(p => p.b === b), an = ap && ap.a ? `Automatikus: ${ap.a.name}` : "Automatic: enters";
    const sel = h('select', { 'aria-label': `${b.name} matches` }, h('option', { value: '*' }, an), h('option', { value: '' }, "No match: enters"),
      ...P.layers.filter((a: any) => a.vis).slice().reverse().map((a: any) => h('option', { value: a.id }, '← ' + a.name))) as HTMLSelectElement;
    sel.value = s.trans.pairs[b.id] === undefined ? '*' : s.trans.pairs[b.id];
    sel.onchange = () => { if (sel.value === '*') delete s.trans.pairs[b.id]; else s.trans.pairs[b.id] = sel.value; done(); };
    return h('div', { class: 'row2' }, h('span', null, b.name), h('div', { class: 'pop' }, sel));
  });
  openCard(el, h('div', { class: 'pl' }, `Transition · ${P.name} → ${s.name}`),
    h('div', { class: 'pc' }, h('div', { class: 'row2' }, h('span', null, 'Hossz'), lv), len, h('div', { class: 'row2' }, h('span', null, "Curve"), h('div', { class: 'pop' }, es))),
    h('p', { class: 'small' }, "Items in both scenes move and transform; items in only one scene enter or exit. Matching:"),
    h('div', { class: 'pc' }, ...rows),
    h('div', { class: 'btnrow' }, h('button', { class: 'btn accent', onclick: () => { closeScnCard(); setSeqPlay(true); R.time = Math.max(0, sceneStart(i) - .6); resetFeedback(); setPlay(true); } }, "Play transition")));
}
export function renderStrip() {
  if (!strip) return; strip.replaceChildren(); const S = scenes(), f = R.seqPlay ? seqFrame(R.time) : null;
  strip.appendChild(h('button', { class: 'ib scplay', 'aria-pressed': String(!!R.seqPlay), title: "Scene sequence: play scenes in order with transitions (the timeline spans the whole sequence). Turn it off to edit the canvas.", onclick: () => { setSeqPlay(!R.seqPlay); if (R.seqPlay) setPlay(true); } },
    h('span', { html: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><rect x="3" y="6" width="7" height="12" rx="1.5"/><rect x="14" y="6" width="7" height="12" rx="1.5"/><path d="m11 12 2 0"/></svg>' })));
  const row = h('div', { class: 'scrow' });
  S.forEach((s, i) => {
    if (i > 0) { const t = h('button', { class: 'sct', title: `Transition: ${s.trans.dur.toFixed(1)} s · click to edit duration, curve and matching` }, `⟷ ${s.trans.dur.toFixed(1).replace('.', ',')}`); t.onclick = () => transCard(i, t); row.appendChild(t); }
    const b = h('button', { class: 'scb' + (f && f.i === i ? ' on' : ''), style: `flex:${s.dur} 1 0`, title: `${s.name} · ${s.dur} s · click for settings` }, h('b', null, s.name), h('small', null, s.dur.toFixed(1).replace('.', ',') + ' mp'));
    b.onclick = () => sceneCard(s, b); row.appendChild(b);
  });
  if (!S.length) row.appendChild(h('span', { class: 'small scempty' }, "No scenes yet. Build a composition and save it as a scene. Change the canvas, then save the next scene."));
  strip.appendChild(row);
  strip.appendChild(h('button', { class: 'btn scadd', title: "Add the current canvas as a new scene at the end", onclick: () => { const s = saveScene(); done(`Mentve: ${s.name}. Change the canvas and save the next scene.`); } }, "+ Save as scene"));
}
export function setStrip(on: boolean) { strip.hidden = !on; btn.setAttribute('aria-pressed', String(on)); $('#wrap').classList.toggle('scn-on', on); try { localStorage.setItem('vel.scn', on ? '1' : '0'); } catch (_) { } if (on) renderStrip(); }
btn.onclick = () => setStrip(strip.hidden);
R.renderStrip = renderStrip;
let lastI = -2;
/** per frame (from the loop): keep the current scene highlighted while Jelenetsor plays */
R.updScenes = () => { if (!R.seqPlay || strip.hidden) { lastI = -2; return; } const f = seqFrame(R.time), i = f ? f.i : -1; if (i !== lastI) { lastI = i; strip.querySelectorAll('.scb').forEach((b: any, k: number) => b.classList.toggle('on', k === i)); } };
try { if (localStorage.getItem('vel.scn') === '1') setStrip(true); } catch (_) { }
