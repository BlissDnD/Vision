/* F1 · Folyadékmező: GPU Stable Fluids per layer (Áramló tinta source, Folyadékos torzítás appearance), on the shared sim clock.
 * Grid size depends only on aspect + Minőség (never on output size), so preview, seek and 4K export simulate the same field.
 * Steps only when ctx.advance (like Visszhang); resetSim clears it. Algorithm: Stam 1999; pattern: artcodev/three-fluid-fx (MIT). */
import { BASEK, EFFECTS, pdefOf } from './effects/index';
import { HALF, U, clearTarget, freeTarget, gl, link, mkTarget } from './gl';
import { ev } from './evaluation';
import { PALS } from './palettes';

const STEP = 1 / 60;   // = sim.ts STEP (sim.ts imports this module, so no import back)

const FH = `#version 300 es
precision highp float; in vec2 vUv; out vec4 o; uniform vec2 uTx;
`;
const NB = `vec4 sL(sampler2D s){return texture(s,vUv-vec2(uTx.x,0.0));} vec4 sR(sampler2D s){return texture(s,vUv+vec2(uTx.x,0.0));}
vec4 sB(sampler2D s){return texture(s,vUv-vec2(0.0,uTx.y));} vec4 sT(sampler2D s){return texture(s,vUv+vec2(0.0,uTx.y));}
`;
const SRC = {
  splat: (FH + `uniform sampler2D uSrc; uniform int uN; uniform vec4 uE[8]; uniform vec4 uC[8]; uniform float uAsp;
void main(){vec4 c=texture(uSrc,vUv); for(int i=0;i<8;i++){if(i>=uN)break; vec2 d=(vUv-uE[i].xy)*vec2(uAsp,1.0); c+=uC[i]*exp(-dot(d,d)/uE[i].z);} o=c;}`),
  curl: (FH + NB + `uniform sampler2D uV;
void main(){o=vec4(0.5*(sR(uV).y-sL(uV).y-sT(uV).x+sB(uV).x),0.0,0.0,1.0);}`),
  vort: (FH + NB + `uniform sampler2D uV; uniform sampler2D uW; uniform float uK; uniform float uDt;
void main(){float L=sL(uW).x,R=sR(uW).x,B=sB(uW).x,T=sT(uW).x,C=texture(uW,vUv).x;
 vec2 f=0.5*vec2(abs(T)-abs(B),abs(R)-abs(L)); f/=length(f)+1e-4; f*=uK*C; f.y=-f.y;
 vec2 v=texture(uV,vUv).xy+f*uDt; o=vec4(clamp(v,-8.0,8.0),0.0,1.0);}`),
  div: (FH + NB + `uniform sampler2D uV;
void main(){vec2 C=texture(uV,vUv).xy; float L=sL(uV).x,R=sR(uV).x,B=sB(uV).y,T=sT(uV).y;
 if(vUv.x-uTx.x<0.0)L=-C.x; if(vUv.x+uTx.x>1.0)R=-C.x; if(vUv.y-uTx.y<0.0)B=-C.y; if(vUv.y+uTx.y>1.0)T=-C.y;
 o=vec4(0.5*(R-L+T-B),0.0,0.0,1.0);}`),
  scale: (FH + `uniform sampler2D uSrc; uniform float uK; void main(){o=texture(uSrc,vUv)*uK;}`),
  jacobi: (FH + NB + `uniform sampler2D uP; uniform sampler2D uD;
void main(){o=vec4((sL(uP).x+sR(uP).x+sB(uP).x+sT(uP).x-texture(uD,vUv).x)*0.25,0.0,0.0,1.0);}`),
  grad: (FH + NB + `uniform sampler2D uP; uniform sampler2D uV;
void main(){vec2 v=texture(uV,vUv).xy-0.5*vec2(sR(uP).x-sL(uP).x,sT(uP).x-sB(uP).x); o=vec4(v,0.0,1.0);}`),
  adv: (FH + `uniform sampler2D uV; uniform sampler2D uSrc; uniform float uDt; uniform float uDiss; uniform float uAsp;
void main(){vec2 p=vUv-uDt*texture(uV,vUv).xy/vec2(uAsp,1.0); o=texture(uSrc,p)/(1.0+uDiss*uDt);}`),
};
// linked on first use: this module sits in an import cycle with gl.ts, so gl is not ready at load time
let P: Record<keyof typeof SRC, any> | null = null;
const progs = () => P || (P = Object.fromEntries(Object.entries(SRC).map(([k, s]) => [k, link(s)])) as any);

const ROWS = [96, 144, 220];
const JACOBI = 20;
type T = ReturnType<typeof mkTarget>;
interface Fluid { W: number; H: number; DW: number; DH: number; v: [T, T]; p: [T, T]; d: [T, T]; div: T; curl: T; stepped: boolean; last: number[] | null; used: boolean; free(): void }

const fmt = () => HALF ? [gl.RGBA16F, gl.HALF_FLOAT] : [gl.RGBA8, gl.UNSIGNED_BYTE];
function mk(W: number, H: number, DW: number, DH: number): Fluid {
  const [f, ty] = fmt(); const m = (w: number, h: number) => { const x = mkTarget(w, h, f, ty); clearTarget(x); return x; };
  const F: Fluid = { W, H, DW, DH, v: [m(W, H), m(W, H)], p: [m(W, H), m(W, H)], d: [m(DW, DH), m(DW, DH)], div: m(W, H), curl: m(W, H), stepped: false, last: null, used: true,
    free() { [...F.v, ...F.p, ...F.d, F.div, F.curl].forEach(freeTarget); } };
  return F;
}
/** The field of layer `id` in this render context (allocated / resized on demand). */
function stateOf(ctx: any, L: any): Fluid {
  if (!ctx.fluid) ctx.fluid = new Map();
  const q = Math.round(L.p.qual ? L.p.qual.v : 1), H = ROWS[Math.max(0, Math.min(2, q))], W = Math.max(8, Math.round(H * ctx.w / ctx.h));
  const DH = Math.min(512, H * 2), DW = Math.round(DH * ctx.w / ctx.h);
  let F = ctx.fluid.get(L.id);
  if (F && (F.W !== W || F.H !== H)) { F.free(); F = null; }
  if (!F) { F = mk(W, H, DW, DH); ctx.fluid.set(L.id, F); }
  F.used = true; return F;
}
export function resetFluid(ctx: any) { if (!ctx || !ctx.fluid) return; for (const F of ctx.fluid.values()) { [...F.v, ...F.p, ...F.d].forEach(x => clearTarget(x)); F.stepped = false; F.last = null; } }
export function fluidMark(ctx: any) { if (ctx.fluid) for (const F of ctx.fluid.values()) F.used = false; }
export function fluidSweep(ctx: any) { if (ctx.fluid) for (const [id, F] of ctx.fluid) if (!F.used) { F.free(); ctx.fluid.delete(id); } }

function pass(prog: any, target: T, tex: Record<string, WebGLTexture>, set?: (p: any) => void) {
  gl.bindFramebuffer(gl.FRAMEBUFFER, target.f); gl.viewport(0, 0, target.w, target.h); gl.useProgram(prog);
  gl.uniform2f(U(prog, 'uTx'), 1 / target.w, 1 / target.h);
  let i = 0; for (const k in tex) { gl.activeTexture(gl.TEXTURE0 + i); gl.bindTexture(gl.TEXTURE_2D, tex[k]); gl.uniform1i(U(prog, k), i); i++; }
  if (set) set(prog); gl.drawArrays(gl.TRIANGLES, 0, 3);
}
const swap = (a: [T, T]) => { const s = a[0]; a[0] = a[1]; a[1] = s; };

const pv = (L: any, k: string, t: number) => { const n = L.p[k], d = pdefOf(L, k); return !n ? (d ? d.def : 0) : d && d.type === 'sel' ? n.v : ev(n, d, t); };
function rnd(seed: number) { let s = (Math.floor(seed) * 2654435761 + 12345) >>> 0; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }
function palAt(i: number, x: number, hue: number) { const p = PALS[i] || PALS[0]; return [0, 1, 2].map(k => Math.min(1, Math.max(0, p.a[k] + p.b[k] * Math.cos(2 * Math.PI * (p.c[k] * x + p.d[k] + hue))))); }

export interface Emitter { x: number; y: number; vx: number; vy: number; col: number[] }
/** Seeded emitters at scene time t (q-space: height 1, origin at the centre). Pure: same layer + t → same emitters. */
export function emitters(L: any, t: number): Emitter[] {
  const r = rnd(pv(L, 'seed', t) + 1), n = Math.max(1, Math.min(6, Math.round(pv(L, 'count', t))));
  const cx = ev(L.n.x, BASEK.x, t), cy = ev(L.n.y, BASEK.y, t), sc = Math.max(.05, ev(L.n.s, BASEK.s, t));
  const spread = pv(L, 'spread', t) * sc, tempo = pv(L, 'tempo', t), hue = ev(L.n.hue, BASEK.hue, t);
  const out: Emitter[] = [];
  for (let i = 0; i < n; i++) {
    const rad = spread * (.35 + .65 * r()), w = (.35 + .55 * r()) * (r() < .5 ? -1 : 1), k = .6 + .8 * r(), ph = r() * 6.283, ph2 = r() * 6.283;
    const a = w * tempo * t + ph, b = w * k * tempo * t + ph2;
    const x = cx + rad * Math.cos(a), y = cy + rad * .8 * Math.sin(b);
    let vx = -rad * Math.sin(a) * w, vy = rad * .8 * Math.cos(b) * w * k; const l = Math.hypot(vx, vy) || 1; vx /= l; vy /= l;
    out.push({ x, y, vx, vy, col: palAt(L.pal || 0, n > 1 ? i / n : .3, hue) });
  }
  return out;
}

/** One fixed STEP of layer L's field: splats → vorticity → projection → advection. */
function stepFluid(F: Fluid, L: any, t: number, asp: number, mono: boolean) {
  gl.disable(gl.BLEND); const P = progs(); const dt = STEP;
  const E = emitters(L, t), force = pv(L, 'force', t), size = pv(L, 'size', t), wind = pv(L, 'wind', t), dir = pv(L, 'dir', t) * Math.PI / 180;
  const pulse = pv(L, 'pulse', t), sc = Math.max(.05, ev(L.n.s, BASEK.s, t));
  const R2 = (.045 * size * sc) ** 2, wx = Math.sin(dir) * wind, wy = Math.cos(dir) * wind;
  const eU = new Float32Array(32), vU = new Float32Array(32), dU = new Float32Array(32); let n = 0;
  const toUV = (x: number, y: number) => [x / asp + .5, y + .5];
  E.forEach((e, i) => {
    const beat = Math.pow(Math.max(0, Math.sin(t * 4.4 + i * 2.1)), 4) * 3, rate = (1 - pulse) + pulse * beat;
    const [u, v] = toUV(e.x, e.y); eU.set([u, v, R2, 0], n * 4);
    vU.set([(e.vx * force * 10 + wx * 12) * dt * rate, (e.vy * force * 10 + wy * 12) * dt * rate, 0, 0], n * 4);
    const c = mono ? [1, 1, 1] : e.col; const k = 2.6 * dt * rate; dU.set([c[0] * k, c[1] * k, c[2] * k, k], n * 4); n++;
  });
  // canvas drag: the layer's own movement between ticks pushes the fluid (live gesture; keyed moves replay on export)
  const cx = ev(L.n.x, BASEK.x, t), cy = ev(L.n.y, BASEK.y, t);
  if (F.last && n < 8) { let dx = (cx - F.last[0]) / dt, dy = (cy - F.last[1]) / dt; const l = Math.hypot(dx, dy);
    if (l > .05) { const m = Math.min(1, 4 / l); dx *= m; dy *= m; const [u, v] = toUV(cx, cy); eU.set([u, v, R2 * 2.5, 0], n * 4); vU.set([dx * .7, dy * .7, 0, 0], n * 4);
      const c = mono ? [1, 1, 1] : E[0].col, k = Math.min(.25, l * .05); dU.set([c[0] * k, c[1] * k, c[2] * k, k], n * 4); n++; } }
  F.last = [cx, cy];
  const spl = (target: [T, T], U4: Float32Array) => { pass(P.splat, target[1], { uSrc: target[0].t }, p => { gl.uniform1i(U(p, 'uN'), n); gl.uniform4fv(U(p, 'uE[0]'), eU); gl.uniform4fv(U(p, 'uC[0]'), U4); gl.uniform1f(U(p, 'uAsp'), asp); }); swap(target); };
  spl(F.v, vU); spl(F.d, dU);
  pass(P.curl, F.curl, { uV: F.v[0].t });
  const curlK = pv(L, 'curl', t) * 0.15 * F.H;
  pass(P.vort, F.v[1], { uV: F.v[0].t, uW: F.curl.t }, p => { gl.uniform1f(U(p, 'uK'), curlK); gl.uniform1f(U(p, 'uDt'), dt); }); swap(F.v);
  pass(P.div, F.div, { uV: F.v[0].t });
  pass(P.scale, F.p[1], { uSrc: F.p[0].t }, p => gl.uniform1f(U(p, 'uK'), .8)); swap(F.p);
  for (let i = 0; i < JACOBI; i++) { pass(P.jacobi, F.p[1], { uP: F.p[0].t, uD: F.div.t }); swap(F.p); }
  pass(P.grad, F.v[1], { uP: F.p[0].t, uV: F.v[0].t }); swap(F.v);
  const vd = .15 + pv(L, 'fade', t) * .3, dd = pv(L, 'fade', t) * 2.2;
  pass(P.adv, F.v[1], { uV: F.v[0].t, uSrc: F.v[0].t }, p => { gl.uniform1f(U(p, 'uDt'), dt); gl.uniform1f(U(p, 'uDiss'), vd); gl.uniform1f(U(p, 'uAsp'), asp); }); swap(F.v);
  pass(P.adv, F.d[1], { uV: F.v[0].t, uSrc: F.d[0].t }, p => { gl.uniform1f(U(p, 'uDt'), dt); gl.uniform1f(U(p, 'uDiss'), dd); gl.uniform1f(U(p, 'uAsp'), asp); }); swap(F.d);
}

let CUR: Fluid | null = null;
/** Advance (if this render may) and select layer L's field for the display pass that follows (setU binds it). */
export function fluidPrep(L: any, ctx: any, t: number) {
  const F = stateOf(ctx, L);
  if (ctx.advance !== false || !F.stepped) { stepFluid(F, L, t, ctx.w / ctx.h, L.type === 'fluidfx'); F.stepped = true; }
  CUR = F; return F;
}
function bindField(p: any) {
  const F = CUR; if (!F) return;
  gl.activeTexture(gl.TEXTURE4); gl.bindTexture(gl.TEXTURE_2D, F.d[0].t); gl.uniform1i(U(p, 'uDye'), 4);
  gl.activeTexture(gl.TEXTURE5); gl.bindTexture(gl.TEXTURE_2D, F.v[0].t); gl.uniform1i(U(p, 'uVel'), 5);
}
EFFECTS.fluid.setU = bindField;
EFFECTS.fluidfx.setU = bindField;
