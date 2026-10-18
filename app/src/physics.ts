/* F2 · Fizikai test: 2D impulse rigid bodies on the top-level layers carrying the 'phys' motion (motion.ts adds the result).
 * World state at t = fixed 60 Hz steps from t = 0 (no randomness, no wall clock), cached with 1 s checkpoints and invalidated
 * by a key of everything physics reads, so seek = export = live. Circle / box (SAT), Coulomb friction, restitution, canvas walls.
 * Principle: Oimo.js (MIT, lo-th) and Box2D-lite (zlib, Erin Catto) — own code, no dependency. */
import { st } from './state';
import { ev } from './evaluation';
import { BASEK } from './effects/index';
import { textCache } from './text';

const HZ = 60, DT = 1 / HZ, ITER = 8, CP = 60, MAX_STEPS = HZ * 900, SLOP = .002, BETA = .2;
export const PHYS_HZ = HZ;
const D2R = Math.PI / 180;

interface Body { id: string; L: any; m: any; circle: boolean; r: number; hx: number; hy: number; mass: number; I: number;
  x: number; y: number; a: number; vx: number; vy: number; w: number; on: boolean; out: number; im: number; iI: number }
interface Contact { A: Body | null; B: Body; nx: number; ny: number; pts: number[][] }

const V = (m: any, k: string, t: number) => { const n = m.p[k]; return n ? ev(n, { min: -1e9, max: 1e9 }, t) : 0; };
const physOf = (L: any) => (L.mo || []).find((m: any) => m && m.t === 'phys' && m.on !== false);
function members(): any[] { return (st.layers || []).filter((L: any) => L && L.vis !== false && L.type !== 'group' && physOf(L)); }
function aspect() { const [w, h] = String(st.size || '1920x1080').split('x').map(Number); return (w > 0 && h > 0) ? w / h : 16 / 9; }

/** Collision shape of a layer (q-space: canvas height 1). Automatikus: circles for round shapes, boxes for the rest. */
function shapeOf(L: any, m: any, t: number) {
  const s = Math.max(.01, ev(L.n.s, BASEK.s, t)), want = Math.round(V(m, 'shape', t));
  let circle = true, r = .3 * s, hx = .3 * s, hy = .3 * s;
  if (L.type === 'shape') { const k = Math.round(L.p.kind.v), z = L.p.size.v * s, asp = L.p.aspect.v; hx = z * asp; hy = z; r = z * Math.sqrt(asp);
    circle = (k <= 1 && Math.abs(asp - 1) < .15) || (k > 2 && k !== 13); if (k > 2) r = z * .9; }
  else if (L.type === 'text' || L.type === 'mtext') { const c = textCache.get(L.id), ar = c ? Math.min(6, c.w / c.h) : 2; hy = .5 * s * .5; hx = hy * ar; circle = false; }
  else if (L.type === 'image' || L.type === 'lottie') { hx = .5 * s; hy = .5 * s; circle = false; }
  else if (L.type === 'obj3d') { r = .39 * s; }
  if (want === 1) { circle = true; r = r || Math.max(hx, hy); } else if (want === 2) { if (circle) { hx = hy = r; } circle = false; }
  return { circle, r, hx, hy };
}
const baseOf = (L: any, t: number) => [ev(L.n.x, BASEK.x, t), ev(L.n.y, BASEK.y, t), (ev(L.n.r, BASEK.r, t) + (L.n.spin ? L.n.spin.v : 0) * t) * D2R];

function keyOf(list: any[]) {
  let k = st.size + '|';
  for (const L of list) { const m = physOf(L); k += L.id + JSON.stringify([L.n.x, L.n.y, L.n.r, L.n.s, L.n.spin && L.n.spin.v, m.p, L.type === 'shape' ? [L.p.kind.v, L.p.size.v, L.p.aspect.v] : 0]) + ';'; }
  return k;
}

/* ---------- narrow phase (normal points from A to B) ---------- */
const verts = (b: Body) => { const c = Math.cos(b.a), s = Math.sin(b.a); return [[1, 1], [-1, 1], [-1, -1], [1, -1]].map(([u, v]) => [b.x + c * u * b.hx - s * v * b.hy, b.y + s * u * b.hx + c * v * b.hy]); };
function inside(b: Body, p: number[], e = 1e-4) { const c = Math.cos(b.a), s = Math.sin(b.a), dx = p[0] - b.x, dy = p[1] - b.y; const u = c * dx + s * dy, v = -s * dx + c * dy; return Math.abs(u) <= b.hx + e && Math.abs(v) <= b.hy + e; }
function circleCircle(A: Body, B: Body): Contact | null {
  const dx = B.x - A.x, dy = B.y - A.y, d = Math.hypot(dx, dy), pen = A.r + B.r - d; if (pen <= 0) return null;
  const nx = d > 1e-9 ? dx / d : 0, ny = d > 1e-9 ? dy / d : 1; return { A, B, nx, ny, pts: [[A.x + nx * (A.r - pen / 2), A.y + ny * (A.r - pen / 2), pen]] };
}
function boxCircle(A: Body, B: Body): Contact | null {   // A box, B circle
  const c = Math.cos(A.a), s = Math.sin(A.a), dx = B.x - A.x, dy = B.y - A.y; const u = c * dx + s * dy, v = -s * dx + c * dy;
  const cu = Math.max(-A.hx, Math.min(A.hx, u)), cv = Math.max(-A.hy, Math.min(A.hy, v));
  let nu, nv, pen;
  if (cu === u && cv === v) {   // centre inside the box: push out through the nearest face
    const ex = A.hx - Math.abs(u), ey = A.hy - Math.abs(v);
    if (ex < ey) { nu = Math.sign(u) || 1; nv = 0; pen = ex + B.r; } else { nu = 0; nv = Math.sign(v) || 1; pen = ey + B.r; }
  } else { const ddx = u - cu, ddy = v - cv, d = Math.hypot(ddx, ddy); pen = B.r - d; if (pen <= 0) return null; nu = ddx / d; nv = ddy / d; }
  const nx = c * nu - s * nv, ny = s * nu + c * nv; return { A, B, nx, ny, pts: [[B.x - nx * (B.r - pen / 2), B.y - ny * (B.r - pen / 2), pen]] };
}
function boxBox(A: Body, B: Body): Contact | null {
  const va = verts(A), vb = verts(B); let best = Infinity, nx = 0, ny = 0;
  for (const ang of [A.a, A.a + Math.PI / 2, B.a, B.a + Math.PI / 2]) {
    const ax = Math.cos(ang), ay = Math.sin(ang); let a0 = Infinity, a1 = -Infinity, b0 = Infinity, b1 = -Infinity;
    for (const p of va) { const d = p[0] * ax + p[1] * ay; a0 = Math.min(a0, d); a1 = Math.max(a1, d); }
    for (const p of vb) { const d = p[0] * ax + p[1] * ay; b0 = Math.min(b0, d); b1 = Math.max(b1, d); }
    const o = Math.min(a1, b1) - Math.max(a0, b0); if (o <= 0) return null;
    if (o < best - 1e-9) { best = o; const dir = ((B.x - A.x) * ax + (B.y - A.y) * ay) < 0 ? -1 : 1; nx = ax * dir; ny = ay * dir; }
  }
  let pts = [...vb.filter(p => inside(A, p, best * .5)), ...va.filter(p => inside(B, p, best * .5))].map(p => [p[0], p[1], best]);
  if (!pts.length) pts = [[(A.x + B.x) / 2, (A.y + B.y) / 2, best]];
  if (pts.length > 2) {   // keep the two points farthest apart along the contact tangent
    const tx = -ny, ty = nx; pts.sort((p, q) => (p[0] * tx + p[1] * ty) - (q[0] * tx + q[1] * ty)); pts = [pts[0], pts[pts.length - 1]];
  }
  return { A, B, nx, ny, pts };
}
function collide(A: Body, B: Body): Contact | null {
  if (A.circle && B.circle) return circleCircle(A, B);
  if (!A.circle && B.circle) return boxCircle(A, B);
  if (A.circle && !B.circle) { const c = boxCircle(B, A); if (!c) return null; return { A, B, nx: -c.nx, ny: -c.ny, pts: c.pts }; }
  return boxBox(A, B);
}
/** Contacts of body B against the four canvas walls (A = null, infinite mass; normal points into the canvas). */
function walls(B: Body, asp: number, out: Contact[]) {
  const P = [[1, 0, -asp / 2], [-1, 0, -asp / 2], [0, 1, -.5], [0, -1, -.5]];
  for (const [nx, ny, c] of P) {
    const pts: number[][] = [];
    if (B.circle) { const s = nx * B.x + ny * B.y - c, pen = B.r - s; if (pen > 0) pts.push([B.x - nx * B.r, B.y - ny * B.r, pen]); }
    else for (const v of verts(B)) { const s = nx * v[0] + ny * v[1] - c; if (s < 0) pts.push([v[0], v[1], -s]); }
    if (pts.length) out.push({ A: null, B, nx, ny, pts: pts.slice(0, 2) });
  }
}
const canTouch = (A: Body, B: Body, t: number) => {
  const ca = Math.round(V(A.m, 'coll', t)), cb = Math.round(V(B.m, 'coll', t)); if (ca === 2 || cb === 2) return false;
  if (ca === 1 || cb === 1) return Math.round(V(A.m, 'group', t)) === Math.round(V(B.m, 'group', t)); return true;
};

/* ---------- solver ---------- */
function solve(cs: Contact[], t: number) {
  const rows: any[] = [];
  for (const c of cs) {
    const A = c.A, B = c.B, imA = A ? A.im : 0, iIA = A ? A.iI : 0;
    if (imA + B.im === 0) continue;
    const e = Math.max(A ? V(A.m, 'bounce', t) : 0, V(B.m, 'bounce', t)), mu = Math.sqrt((A ? V(A.m, 'fric', t) : .5) * V(B.m, 'fric', t));
    for (const p of c.pts) {
      const rax = A ? p[0] - A.x : 0, ray = A ? p[1] - A.y : 0, rbx = p[0] - B.x, rby = p[1] - B.y;
      const ran = rax * c.ny - ray * c.nx, rbn = rbx * c.ny - rby * c.nx, tx = -c.ny, ty = c.nx;
      const rat = rax * ty - ray * tx, rbt = rbx * ty - rby * tx;
      const kn = imA + B.im + iIA * ran * ran + B.iI * rbn * rbn, kt = imA + B.im + iIA * rat * rat + B.iI * rbt * rbt;
      const vn0 = relV(A, B, rax, ray, rbx, rby, c.nx, c.ny);
      rows.push({ c, A, B, rax, ray, rbx, rby, tx, ty, kn, kt, mu, pn: 0, pt: 0, bias: Math.max(BETA / DT * (p[2] - SLOP), vn0 < -.4 ? -e * vn0 : 0) });
    }
  }
  for (let it = 0; it < ITER; it++) for (const r of rows) {
    const { A, B, c } = r;
    let vn = relV(A, B, r.rax, r.ray, r.rbx, r.rby, c.nx, c.ny), d = (r.bias - vn) / r.kn, p0 = r.pn; r.pn = Math.max(0, p0 + d); d = r.pn - p0;
    apply(A, B, r, c.nx * d, c.ny * d);
    const vt = relV(A, B, r.rax, r.ray, r.rbx, r.rby, r.tx, r.ty), lim = r.mu * r.pn; let dt = -vt / r.kt; const t0 = r.pt; r.pt = Math.max(-lim, Math.min(lim, t0 + dt)); dt = r.pt - t0;
    apply(A, B, r, r.tx * dt, r.ty * dt);
  }
}
function relV(A: Body | null, B: Body, rax: number, ray: number, rbx: number, rby: number, nx: number, ny: number) {
  const vbx = B.vx - B.w * rby, vby = B.vy + B.w * rbx, vax = A ? A.vx - A.w * ray : 0, vay = A ? A.vy + A.w * rax : 0;
  return (vbx - vax) * nx + (vby - vay) * ny;
}
function apply(A: Body | null, B: Body, r: any, px: number, py: number) {
  B.vx += px * B.im; B.vy += py * B.im; B.w += (r.rbx * py - r.rby * px) * B.iI;
  if (A) { A.vx -= px * A.im; A.vy -= py * A.im; A.w -= (r.rax * py - r.ray * px) * A.iI; }
}

/* ---------- world ---------- */
function makeBodies(list: any[]): Body[] {
  return list.map(L => { const m = physOf(L), sh = shapeOf(L, m, 0), [x, y, a] = baseOf(L, 0), mass = Math.max(.01, V(m, 'mass', 0));
    const I = sh.circle ? mass * sh.r * sh.r / 2 : mass * (4 * sh.hx * sh.hx + 4 * sh.hy * sh.hy) / 12;
    return { id: L.id, L, m, ...sh, mass, I, x, y, a, vx: 0, vy: 0, w: 0, on: false, out: -1, im: 0, iI: 0 }; });
}
function step(bs: Body[], k: number, asp: number) {
  const t = k * DT;
  for (const b of bs) {
    const fixed = Math.round(V(b.m, 'fixed', t)) === 1, at = V(b.m, 'at', t);
    if (fixed || t < at) {   // kinematic: follows its own animation, pushes the others
      const [x, y, a] = baseOf(b.L, t), [px, py, pa] = baseOf(b.L, Math.max(0, t - DT));
      b.x = x; b.y = y; b.a = a; b.vx = (x - px) / DT; b.vy = (y - py) / DT; b.w = (a - pa) / DT; b.im = 0; b.iI = 0; b.on = false; continue;
    }
    if (!b.on) { const sp = V(b.m, 'push', t), g = V(b.m, 'pang', t) * D2R; b.vx = Math.cos(g) * sp; b.vy = Math.sin(g) * sp; b.w = V(b.m, 'spinv', t) * D2R; b.on = true; }
    b.im = 1 / b.mass; b.iI = 1 / Math.max(1e-6, b.I);
    const g = V(b.m, 'grav', t) * 3, ga = V(b.m, 'gang', t) * D2R; b.vx += Math.cos(ga) * g * DT; b.vy += Math.sin(ga) * g * DT;
    const damp = 1 / (1 + DT * .05); b.vx *= damp; b.vy *= damp; b.w *= 1 / (1 + DT * .1);
  }
  const cs: Contact[] = [];
  for (let i = 0; i < bs.length; i++) for (let j = i + 1; j < bs.length; j++) {
    const A = bs[i], B = bs[j]; if (A.im + B.im === 0 || !canTouch(A, B, t)) continue;
    const ra = A.circle ? A.r : Math.hypot(A.hx, A.hy), rb = B.circle ? B.r : Math.hypot(B.hx, B.hy);
    if (Math.hypot(B.x - A.x, B.y - A.y) > ra + rb) continue;
    const c = collide(A, B); if (c) cs.push(c);
  }
  for (const b of bs) if (b.im > 0 && Math.round(V(b.m, 'walls', t)) === 0) walls(b, asp, cs);
  solve(cs, t);
  for (const b of bs) {
    if (b.im === 0) continue; b.x += b.vx * DT; b.y += b.vy * DT; b.a += b.w * DT;
    const ext = b.circle ? b.r : Math.max(b.hx, b.hy);
    if (b.out < 0 && (Math.abs(b.x) - ext > asp / 2 || Math.abs(b.y) - ext > .5)) b.out = t;
    if (Math.abs(b.x) > 50 || Math.abs(b.y) > 50) { b.vx = b.vy = b.w = 0; }   // far away: park it
  }
}
const snap = (bs: Body[]) => bs.map(b => [b.x, b.y, b.a, b.vx, b.vy, b.w, b.on ? 1 : 0, b.out]);
function load(bs: Body[], s: number[][]) { bs.forEach((b, i) => { const q = s[i]; b.x = q[0]; b.y = q[1]; b.a = q[2]; b.vx = q[3]; b.vy = q[4]; b.w = q[5]; b.on = !!q[6]; b.out = q[7]; }); }

let W: { key: string; ids: string[]; cps: Map<number, number[][]>; k: number; s: number[][] } | null = null;
/** World state at tick k (cached; checkpoints every CP steps). */
function stateAt(k: number) {
  const list = members(); if (!list.length) { W = null; return null; }
  const key = keyOf(list), bs = makeBodies(list), asp = aspect();
  if (!W || W.key !== key) { W = { key, ids: list.map(L => L.id), cps: new Map([[0, snap(bs)]]), k: 0, s: snap(bs) }; }
  k = Math.max(0, Math.min(MAX_STEPS, k));
  let k0 = 0; if (W.k <= k) k0 = W.k; else for (const c of W.cps.keys()) if (c <= k && c > k0) k0 = c;
  if (k0 === W.k) load(bs, W.s); else load(bs, W.cps.get(k0)!);
  for (let i = k0 + 1; i <= k; i++) { step(bs, i, asp); if (i % CP === 0 && !W.cps.has(i)) W.cps.set(i, snap(bs)); }
  W.k = k; W.s = snap(bs);
  return { ids: W.ids, s: W.s, bs };
}
const tick = (t: number) => Math.floor(t * HZ + 1e-6);
/** The physics offset of layer L at scene time t (added by moEval), or null when L is not a body. */
export function physAt(L: any, t: number) {
  const S = stateAt(tick(t)); if (!S) return null; const i = S.ids.indexOf(L.id); if (i < 0) return null;
  const q = S.s[i], [x, y, a] = baseOf(L, t);
  return { dx: q[0] - x, dy: q[1] - y, rot: (q[2] - a) / D2R, out: q[7] };
}
/** Time the body first left the canvas (walls = Átengedi), or -1. */
export function physOut(L: any, t: number) { const r = physAt(L, t); return r ? r.out : -1; }
export function physReset() { W = null; }
