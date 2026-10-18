/** Gesztus-mozgás: motion set by showing it on the canvas. The arrow of Rugalmas beúszás / Beúszás / Kiúszás (tail = direction +
 *  distance, ⌘ ↕ tempo · ↔ character, ⌥ or the middle grip = bend, ⇧ = 15°) and one handle per continuous motion (Lebegés double
 *  arrow, Keringés circle, Forgás arc, Lüktetés rings, Remegés zigzag). While dragging: faint ghost copies at equal time steps,
 *  a label only while a modifier is held; dragging the path itself scrubs (R.moScrub, preview only). One drag = one undo step. */
import { R } from './runtime';
import { $, h } from './dom';
import { moEval } from './motion';
import { sel } from './state';
import { commit } from './history';
import { renderInsp } from './inspector';
import { EASES, moveFx, outSize } from './render';
import { cv } from './gl';
import { ev } from './evaluation';
import { BASEK } from './effects/index';
import { gizmoRadius, toAsp } from './stage';
import { textCache } from './text';
import { markDirty } from './loop';

const TAU = Math.PI * 2, NG = 8, CHAR = ['Lágy', 'Ütés', 'Rugó'];
const NS = 'http://www.w3.org/2000/svg';
const ov = h('div', { class: 'moarrow', hidden: true });
ov.innerHTML = '<svg><g class="moghosts"></g><path class="mopath"/><path class="moshape"/><path class="mohit"/></svg>'
  + '<i class="mohandle"></i><i class="momid" title="Húzd oldalra: ív"></i><span class="motip" hidden></span><span class="molab" hidden></span>';
$('#wrap').appendChild(ov);
const sv: any = ov.querySelector('svg'), gh: any = ov.querySelector('.moghosts'), pth: any = ov.querySelector('.mopath'), shp: any = ov.querySelector('.moshape'), hit: any = ov.querySelector('.mohit');
const hd: any = ov.querySelector('.mohandle'), mid: any = ov.querySelector('.momid'), tip: any = ov.querySelector('.motip'), lab: any = ov.querySelector('.molab');
for (let i = 0; i < NG; i++) gh.appendChild(document.createElementNS(NS, 'rect'));
const TIPS: Record<string, string> = {
  spring: '⌘ tempó · ⌥ ív · ⇧ szög', in: 'húzd: irány · ⌘ tempó · ⌘↔ görbe', out: 'húzd: irány · ⌘ tempó · ⌘↔ görbe',
  float: 'húzd: kitérés + irány · ⌘ tempó · ⇧ szög', orbit: 'húzd: sugár · ⌘ tempó · ⌥ irány', spin: 'húzd körbe: sebesség + irány · ⇧ 15°',
  pulse: 'húzd: erő · ⌘ ütem', shake: 'húzd: erő · ⌘ gyorsaság',
};
const f2 = (v: number, d = 1) => v.toFixed(d).replace('.', ',');
const cl = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
const r2 = (v: number, q = 100) => Math.round(v * q) / q;
const snap15 = (deg: number) => Math.round(deg / 15) * 15;

/** The motion whose chip is selected on the Mozgás tab (same default as the inspector: the first chip). */
function cur(): any {
  const L: any = sel(); if (!L || R.itab !== 'motion' || !L.vis || R.seqPlay) return null;
  const T = L.tm || {}, ids = [...(T.in ? ['tm:in'] : []), ...(T.out ? ['tm:out'] : []), ...(L.mo || []).map((m: any) => m.id)];
  let id = R.moSel[L.id]; if (!ids.includes(id)) id = ids[0]; if (!id) return null;
  if (id === 'tm:in' || id === 'tm:out') return { L, kind: id.slice(3), T };
  const m = L.mo.find((x: any) => x.id === id); return m ? { L, kind: m.t, m } : null;
}
const base = (L: any, t: number) => [ev(L.n.x, BASEK.x, t), ev(L.n.y, BASEK.y, t)];
/** Start offset of a legacy entry/exit move (aspect units); null for moves without a direction. */
const tmOff = (mv: number) => { const r = moveFx(mv, 0); return Math.hypot(r.dx, r.dy) > 1e-6 ? [r.dx, r.dy] : null; };
const bez = (S: number[], C: number[], s: number) => { const u = 1 - s; return [u * u * S[0] + 2 * u * s * C[0], u * u * S[1] + 2 * u * s * C[1]]; };
function springGeo(m: any) {
  const g = m.p.ang.v * Math.PI / 180, D = m.p.dist.v, b = m.p.bend.v, cg = Math.cos(g), sg = Math.sin(g);
  return { S: [cg * D, sg * D], C: [cg * D / 2 - sg * b * D, sg * D / 2 + cg * b * D], n: [-sg, cg], D };
}
/** Ghost sample x ∈ [0,1): {dx, dy, sc, rot, op} of this motion alone. */
function ghostAt(c: any, x: number) {
  const { kind, m, T } = c;
  if (kind === 'in' || kind === 'out') { const E = (EASES[T.ease | 0] || EASES[0])[1]; const r: any = moveFx(kind === 'in' ? T.in : T.out, kind === 'in' ? E(x) : 1 - E(x)); r.rot = 0; return r; }
  if (kind === 'spring') return moEval({ mo: [{ ...m, on: true }] }, m.p.at.v + x * m.p.dur.v);
  const P = kind === 'spin' || kind === 'shake' ? 1 : Math.max(.05, m.p.period.v);
  return moEval({ mo: [{ ...m, on: true, a: undefined, b: undefined, ry: undefined }] }, R.time + x * P);
}

let G: any = null; // active drag
R.updMoArrow = (t: number) => {
  const c = cur(); if (!c) { ov.hidden = true; return; } ov.hidden = false;
  const { L, kind, m, T } = c; const cr = cv.getBoundingClientRect(), wr = ($('#wrap') as HTMLElement).getBoundingClientRect(); const { W, H } = outSize();
  const k = cr.height, [bx, by] = base(L, t);
  const P = (ax: number, ay: number) => [cr.left - wr.left + (ax / (W / H) + .5) * cr.width, cr.top - wr.top + (.5 - ay) * cr.height];
  const pt = (ax: number, ay: number) => { const [x, y] = P(bx + ax, by + ay); return x.toFixed(1) + ' ' + y.toFixed(1); };
  sv.setAttribute('width', String(wr.width)); sv.setAttribute('height', String(wr.height));
  const gr = Math.max(.03, gizmoRadius(L, t));
  let d = '', sd = '', hp = [0, 0], mp: number[] | null = null, stub = false;
  if (kind === 'spring') { const { S, C } = springGeo(m); for (let i = 0; i <= 24; i++) { const q = bez(S, C, i / 24); d += (i ? 'L' : 'M') + pt(q[0], q[1]); }
    const e0 = bez(S, C, .9), a = Math.atan2(-e0[1], -e0[0]); sd = arrowHead(pt, 0, 0, a); hp = S; mp = bez(S, C, .5); }
  else if (kind === 'in' || kind === 'out') { const o = tmOff(kind === 'in' ? T.in : T.out); stub = !o; const S = o || [-.2, 0];
    d = 'M' + pt(S[0], S[1]) + 'L' + pt(0, 0); sd = kind === 'in' ? arrowHead(pt, 0, 0, Math.atan2(-S[1], -S[0])) : arrowHead(pt, S[0], S[1], Math.atan2(S[1], S[0])); hp = S; }
  else if (kind === 'float') { const A = Math.max(.02, m.p.amp.v), g = m.p.ang.v * Math.PI / 180, ux = Math.cos(g) * A, uy = Math.sin(g) * A;
    d = 'M' + pt(-ux, -uy) + 'L' + pt(ux, uy); sd = arrowHead(pt, ux, uy, g) + arrowHead(pt, -ux, -uy, g + Math.PI); hp = [ux, uy]; }
  else if (kind === 'orbit') { const r0 = Math.max(.02, m.p.radius.v); d = circ(pt, r0); const cw = Math.round(m.p.dir.v) === 0;
    sd = arrowHead(pt, 0, r0, cw ? 0 : Math.PI); hp = [r0, 0]; }
  else if (kind === 'spin') { const rr = gr * 1.25, sp = cl(m.p.speed.v, -359, 359) * Math.PI / 180, n = 32; for (let i = 0; i <= n; i++) { const a = Math.PI / 2 + sp * i / n; d += (i ? 'L' : 'M') + pt(Math.cos(a) * rr, Math.sin(a) * rr); }
    const ae = Math.PI / 2 + sp; hp = [Math.cos(ae) * rr, Math.sin(ae) * rr]; if (Math.abs(sp) > .05) sd = arrowHead(pt, hp[0], hp[1], ae + Math.sign(sp) * Math.PI / 2); }
  else if (kind === 'pulse') { const r0 = gr, r1 = gr * (1 + m.p.amp.v); d = circ(pt, r0); sd = circ(pt, r1); hp = [r1, 0]; }
  else if (kind === 'shake') { const x0 = gr * 1.15, len = .04 + m.p.amp.v * 2.5, n = 7; for (let i = 0; i <= n; i++) d += (i ? 'L' : 'M') + pt(x0 + len * i / n, i % 2 ? .018 : -.018); hp = [x0 + len, 0]; }
  ov.classList.toggle('stub', stub);
  pth.setAttribute('d', d); hit.setAttribute('d', d); shp.setAttribute('d', sd);
  const [hx, hy] = P(bx + hp[0], by + hp[1]); hd.style.left = hx + 'px'; hd.style.top = hy + 'px'; hd.title = TIPS[kind] || '';
  mid.hidden = !mp; if (mp) { const [mx, my] = P(bx + mp[0], by + mp[1]); mid.style.left = mx + 'px'; mid.style.top = my + 'px'; }
  if (!tip.hidden) { tip.style.left = hx + 'px'; tip.style.top = hy + 'px'; }
  // ghosts: only while dragging; they fade out (CSS) after release
  const on = !!G; gh.classList.toggle('on', on);
  if (on) { const rs = textCache.get(L.id), ar = (L.type === 'text' || L.type === 'mtext') && rs ? Math.min(4, rs.w / rs.h) : 1, w = 2 * gr * k, hh = w / ar, r0 = ev(L.n.r, BASEK.r, t);
    for (let i = 0; i < NG; i++) { const q = ghostAt(c, i / NG) || { dx: 0, dy: 0, sc: 1, rot: 0, op: 1 }, el = gh.children[i], [gx, gy] = P(bx + q.dx, by + q.dy);
      el.setAttribute('x', String(-w / 2)); el.setAttribute('y', String(-hh / 2)); el.setAttribute('width', String(w)); el.setAttribute('height', String(hh)); el.setAttribute('rx', String(Math.min(w, hh) * (L.type === 'shape' ? .5 : .12)));
      el.setAttribute('transform', `translate(${gx.toFixed(1)} ${gy.toFixed(1)}) rotate(${(-(r0 + (q.rot || 0))).toFixed(1)}) scale(${Math.max(.01, q.sc).toFixed(3)})`);
      el.setAttribute('opacity', (.15 + .5 * cl(q.op, 0, 1)).toFixed(2)); } }
};
function arrowHead(pt: any, x: number, y: number, a: number) { const s = .025, l = a + 2.6, r = a - 2.6; return 'M' + pt(x + Math.cos(l) * s, y + Math.sin(l) * s) + 'L' + pt(x, y) + 'L' + pt(x + Math.cos(r) * s, y + Math.sin(r) * s); }
function circ(pt: any, r: number) { let d = ''; for (let i = 0; i <= 48; i++) { const a = TAU * i / 48; d += (i ? 'L' : 'M') + pt(Math.cos(a) * r, Math.sin(a) * r); } return d + 'Z'; }

/* ---------- dragging ---------- */
const modeOf = (e: PointerEvent) => e.metaKey || e.ctrlKey ? 'cmd' : e.altKey ? 'alt' : 'base';
/** Snapshot of the values a drag may change (re-taken when the modifier changes, so each mode works relative to its start). */
function snap(c: any) { if (c.m) { const o: any = {}; for (const k in c.m.p) o[k] = c.m.p[k].v; return o; } return { ...c.T }; }
function start(e: PointerEvent, part: string) {
  const c = cur(); if (!c) return; e.stopPropagation(); e.preventDefault(); try { (e.target as any).setPointerCapture(e.pointerId); } catch (_) { /* synthetic pointer */ }
  G = { c, part, mode: part === 'scrub' ? 'scrub' : modeOf(e), x0: e.clientX, y0: e.clientY, v0: snap(c), rot: 0, pa: ptAng(c, e) }; tip.hidden = true; if (part === 'scrub') move(e); else markDirty();
}
function move(e: PointerEvent) {
  if (!G) return; const { c, part } = G, { L, kind, m, T } = c; const mode = part === 'scrub' ? 'scrub' : modeOf(e);
  if (mode !== G.mode) { G.mode = mode; G.x0 = e.clientX; G.y0 = e.clientY; G.v0 = snap(c); G.rot = 0; G.pa = ptAng(c, e); }
  const p = toAsp(e), [bx, by] = base(L, R.time), dx = p.x - bx, dy = p.y - by, ddx = e.clientX - G.x0, ddy = e.clientY - G.y0, v0 = G.v0;
  const tempo = (v: number, lo: number, hi: number) => cl(r2(v * Math.pow(2, ddy / 90), 20), lo, hi); // up = shorter = faster
  const ang = Math.atan2(dy, dx), deg = Math.round(ang * 180 / Math.PI), sh = e.shiftKey;
  let label = '';
  if (mode === 'scrub') { const ts = scrubT(c, dx, dy); if (ts != null) R.moScrub = { id: L.id, t: ts }; }
  else if (kind === 'spring') {
    if (mode === 'cmd') { m.p.dur.v = tempo(v0.dur, .1, 4); m.p.char.v = cl(Math.round(v0.char + ddx / 45), 0, 2); label = `${f2(m.p.dur.v, 2)} mp · ${CHAR[m.p.char.v]}`; }
    else if (mode === 'alt' || part === 'mid') { const { S, n, D } = springGeo(m); if (D > 1e-4) m.p.bend.v = cl(r2(2 * ((dx - S[0] / 2) * n[0] + (dy - S[1] / 2) * n[1]) / D), -1.5, 1.5); label = `ív ${Math.round(m.p.bend.v * 100)}%`; }
    else { m.p.dist.v = Math.min(2, r2(Math.hypot(dx, dy), 1000)); m.p.ang.v = sh ? snap15(deg) : deg; if (sh) label = `${m.p.ang.v}°`; } }
  else if (kind === 'in' || kind === 'out') { const k = kind === 'in' ? 'inDur' : 'outDur';
    if (mode === 'cmd') { T[k] = tempo(v0[k], .05, 5); T.ease = cl(Math.round((v0.ease | 0) + ddx / 45), 0, EASES.length - 1); label = `${f2(T[k], 2)} mp · ${EASES[T.ease][0]}`; }
    else if (Math.hypot(dx, dy) > .04) { const a = (deg + 360) % 360; T[kind] = a < 45 || a >= 315 ? 5 : a < 135 ? 3 : a < 225 ? 4 : 2; if (sh) label = ['', '', 'Emelkedés', 'Süllyedés', 'Balról', 'Jobbról'][T[kind]]; } }
  else if (kind === 'float') {
    if (mode === 'cmd') { m.p.period.v = tempo(v0.period, .3, 12); label = `${f2(m.p.period.v, 2)} mp / kör`; }
    else { m.p.amp.v = Math.min(.5, r2(Math.hypot(dx, dy), 1000)); m.p.ang.v = sh ? snap15(deg) : deg; if (sh) label = `${m.p.ang.v}°`; } }
  else if (kind === 'orbit') {
    if (mode === 'cmd') { m.p.period.v = tempo(v0.period, .3, 20); label = `${f2(m.p.period.v, 2)} mp / kör`; }
    else if (mode === 'alt') { G.rot += turn(ang);
      if (Math.abs(G.rot) > .15) m.p.dir.v = G.rot > 0 ? 1 : 0; label = Math.round(m.p.dir.v) ? '↺ Ellentétesen' : '↻ Óramutatóval'; }
    else m.p.radius.v = Math.min(.6, r2(Math.hypot(dx, dy), 1000)); }
  else if (kind === 'spin') { G.rot += turn(ang);
    // the handle sits at the arc end: dragging it around adds the swept angle (counter-clockwise = positive)
    let s = v0.speed + G.rot * 180 / Math.PI; s = cl(Math.round(s), -360, 360); if (sh) { s = snap15(s); label = `${s}°/mp`; } m.p.speed.v = s; }
  else if (kind === 'pulse') {
    if (mode === 'cmd') { m.p.period.v = tempo(v0.period, .2, 8); label = `${f2(m.p.period.v, 2)} mp / ütem`; }
    else { const gr = Math.max(.03, gizmoRadius(L, R.time)); m.p.amp.v = cl(r2(Math.hypot(dx, dy) / gr - 1), 0, 1); } }
  else if (kind === 'shake') {
    if (mode === 'cmd') { m.p.rate.v = cl(r2(v0.rate * Math.pow(2, -ddy / 90), 10), .5, 30); label = `${f2(m.p.rate.v)} Hz`; }
    else { const gr = Math.max(.03, gizmoRadius(L, R.time)); m.p.amp.v = cl(r2((dx - gr * 1.15 - .04) / 2.5, 1000), 0, .1); } }
  G.changed = true;
  // label only while a modifier is held
  const on = !!label && (e.metaKey || e.ctrlKey || e.altKey || e.shiftKey); lab.hidden = !on;
  if (on) { const wr = ($('#wrap') as HTMLElement).getBoundingClientRect(); lab.textContent = label; lab.style.left = e.clientX - wr.left + 'px'; lab.style.top = e.clientY - wr.top + 'px'; }
  markDirty();
}
/** Pointer angle around the layer's rest position; turn() accumulates the unwrapped change since the last move. */
function ptAng(c: any, e: PointerEvent) { const p = toAsp(e), [bx, by] = base(c.L, R.time); return Math.atan2(p.y - by, p.x - bx); }
function turn(a: number) { let da = a - G.pa; da -= TAU * Math.round(da / TAU); G.pa = a; return da; }
function end() { if (!G) return; const was = G; G = null; lab.hidden = true; if (R.moScrub) { R.moScrub = null; markDirty(); }
  if (was.part !== 'scrub' && was.changed) { commit(); renderInsp(); } else markDirty(); }
/** Scrub: the scene time at which the motion puts the layer nearest to the pointer (dx, dy relative to the rest position). */
function scrubT(c: any, dx: number, dy: number): number | null {
  const { kind, m, T } = c; const near = (n: number, f: (x: number) => number[]) => { let bi = 0, bd = Infinity; for (let i = 0; i <= n; i++) { const q = f(i / n), d = (q[0] - dx) ** 2 + (q[1] - dy) ** 2; if (d < bd) { bd = d; bi = i; } } return bi / n; };
  const pa = (x: number) => (Math.atan2(dy, dx) / TAU + x + 1) % 1; // pointer angle as a fraction of a turn (+offset)
  if (kind === 'spring') { const at = m.p.at.v, dur = m.p.dur.v; return at + near(80, x => { const q = moEval({ mo: [{ ...m, on: true }] }, at + x * dur); return [q.dx, q.dy]; }) * dur; }
  if (kind === 'in' || kind === 'out') { const a = kind === 'in' ? T.inAt : T.outAt, du = kind === 'in' ? T.inDur : T.outDur; return a + near(60, x => { const q = ghostAt(c, x); return [q.dx, q.dy]; }) * du; }
  const P = Math.max(.05, (m.p.period || { v: 1 }).v), t0 = (+m.a || 0) + Math.floor(Math.max(0, R.time - (+m.a || 0)) / P) * P;
  if (kind === 'float' || kind === 'shake') { const W = kind === 'shake' ? 1 : P; return t0 + near(80, x => { const q = moEval({ mo: [{ ...m, on: true, a: undefined, b: undefined, ry: undefined }] }, t0 + x * W); return [q.dx, q.dy]; }) * W; }
  if (kind === 'orbit') { const sg = Math.round(m.p.dir.v) === 0 ? -1 : 1; let f = (sg * pa(0) - m.p.phase.v) % 1; if (f < 0) f += 1; return t0 + f * P; }
  if (kind === 'pulse') { const f = (pa(-.25) - m.p.phase.v + 1) % 1; return t0 + f * P; }
  if (kind === 'spin') { const sp = m.p.speed.v; if (Math.abs(sp) < 1) return null; let a = pa(-.25) * 360; if (sp < 0) a -= 360; return a / sp; }
  return null;
}
hd.onpointerdown = (e: PointerEvent) => start(e, 'h');
mid.onpointerdown = (e: PointerEvent) => start(e, 'mid');
hit.onpointerdown = (e: PointerEvent) => start(e, 'scrub');
for (const el of [hd, mid, hit]) { el.onpointermove = move; el.onpointerup = el.onpointercancel = end; }
hd.onpointerenter = () => { if (G) return; const c = cur(); if (!c) return; tip.textContent = TIPS[c.kind] || ''; tip.hidden = false; tip.style.left = hd.style.left; tip.style.top = hd.style.top; };
hd.onpointerleave = () => { tip.hidden = true; };
