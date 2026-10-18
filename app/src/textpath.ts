/* T6 · Szöveg útvonalon: the layer's live text as one quad per glyph, placed by arc length along a P2 path
 * (L.path; none chosen = a built-in arc), rotated to the tangent (or upright). Glyph atlas = canvas 2D, rebuilt
 * when the text/font changes. Offset + speed scroll the text along the path (pure function of time). */
import { R } from './runtime';
import { EFFECTS, BASEK } from './effects/index';
import { U, gl, clearTarget, errCache, texFromCanvas } from './gl';
import { ev } from './evaluation';
import { hexRGB } from './palettes';
import { link2, bindTex } from './render';
import { Pt, arc, curve, findPath, pathWorld, placeAt, sampleArc, toWorld } from './paths';
import { markDirty } from './loop';

const D = Object.fromEntries(EFFECTS.textpath.params.map(d => [d.k, d]));
const V = (L: any, k: string, t: number) => { const d = D[k], v = L.p[k]; if (!v) return d.def; return d.type === 'sel' ? Math.round(v.v) : d.type === 'color' ? v.v : ev(v, d, t); };
export const ARC: Pt[] = [[-.5, -.08], [-.25, .12], [0, .18], [.25, .12], [.5, -.08]];
let PROG: any = null, VAO: any = null, VBO: any = null;
const atlases = new Map<string, any>(), fontReq = new Set<string>();
/** Glyph atlas for a text spec: one row, per glyph {u0,u1,adv} in units of the font size. */
export function atlasOf(id: string, T: any) {
  const k = JSON.stringify([T.str, T.font, T.weight, T.track]); let A = atlases.get(id); if (A && A.k === k) return A;
  const fs = 96, f = `${T.weight || '700'} ${fs}px "${T.font}", Georgia, serif`;
  if (!fontReq.has(f) && document.fonts) { fontReq.add(f); document.fonts.load(f, T.str || 'A').then(() => { for (const a of atlases.values()) a.k = ''; markDirty(); }).catch(() => { }); }
  const chars = [...String(T.str || ' ').replace(/\n/g, ' ')], c = document.createElement('canvas'); let x = c.getContext('2d')!; x.font = f;
  const ws = chars.map(ch => x.measureText(ch).width), pad = 8, W = Math.min(8192, Math.ceil(ws.reduce((a, b) => a + b + pad * 2, 0)) + 2);
  c.width = Math.max(4, W); c.height = Math.ceil(fs * 1.4); x = c.getContext('2d')!; x.font = f; x.fillStyle = '#fff'; x.textBaseline = 'middle';
  let cx = 1; const G = chars.map((ch, i) => { const g = { u0: cx / c.width, u1: (cx + ws[i] + pad * 2) / c.width, w: (ws[i] + pad * 2) / fs, adv: ws[i] / fs + (+T.track || 0), sp: /\s/.test(ch) }; x.fillText(ch, cx + pad, c.height / 2); cx += ws[i] + pad * 2; return g; });
  A = { k, tex: texFromCanvas(c, A && A.tex), G, hr: c.height / fs }; atlases.set(id, A); return A;
}
function prog() {
  if (PROG) return PROG === 'err' ? null : PROG;
  const VS = `#version 300 es
precision highp float; layout(location=0) in vec2 aPos; layout(location=1) in vec2 aUV; uniform vec2 uRes; out vec2 vUV;
void main(){vUV=aUV;gl_Position=vec4(aPos/vec2(uRes.x/uRes.y,1.0)*2.0,0.0,1.0);}`;
  const FS = `#version 300 es
precision highp float; in vec2 vUV; out vec4 o; uniform sampler2D uAtlas; uniform vec3 uC;
void main(){float a=texture(uAtlas,vUV).a;o=vec4(uC*a,a);}`;
  try { PROG = link2(VS, FS); } catch (e: any) { PROG = 'err'; errCache.set('textpath', String(e.message)); return null; }
  VAO = gl.createVertexArray(); VBO = gl.createBuffer(); gl.bindVertexArray(VAO); gl.bindBuffer(gl.ARRAY_BUFFER, VBO);
  gl.enableVertexAttribArray(0); gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 16, 0); gl.enableVertexAttribArray(1); gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 16, 8); gl.bindVertexArray(null);
  return PROG;
}
/** Glyph placements at t: [{x, y, ang, g}] (world units). Exported for tests. */
export function glyphsAt(L: any, t: number) {
  const PL = L.path ? findPath(L.path) : null; let poly: Pt[], A: any, closed = false;
  if (PL) { const W = pathWorld(PL, t); if (!W) return []; poly = W.poly; A = W.A; closed = !!(PL.p.closed && Math.round(PL.p.closed.v) === 1); }
  else { const P = placeAt(L, t); poly = curve(ARC, false, true, 24).map(p => toWorld(P, p)); A = arc(poly); }
  if (A.len <= 1e-6) return [];
  const At = atlasOf(L.id, L.text), size = V(L, 'size', t), sp = V(L, 'spacing', t), loop = V(L, 'loop', t) === 1 || closed, up = V(L, 'upright', t) === 1, lift = V(L, 'lift', t);
  const tot = At.G.reduce((s: number, g: any) => s + g.adv * size * sp, 0), off = (V(L, 'offset', t) + V(L, 'speed', t) * t) * A.len;
  const start = (A.len - tot) / 2 + off; let acc = 0; const out: any[] = [];
  for (const g of At.G) { const adv = g.adv * size * sp, c = start + acc + adv / 2; acc += adv; if (g.sp) continue;
    let d = c; if (loop) { const per = Math.max(A.len, tot + size * 1.5); d = ((d % per) + per) % per; } if (d < 0 || d > A.len) continue;
    const q = sampleArc(poly, A, d / A.len), n = [-Math.sin(q.ang), Math.cos(q.ang)];
    out.push({ x: q.x + n[0] * lift, y: q.y + n[1] * lift, ang: up ? 0 : q.ang, g }); }
  return out;
}
export function drawTextPath(L: any, target: any, ctx: any, t: number) {
  clearTarget(target); const p = prog(); if (!p || !L.text) return;
  const Q = glyphsAt(L, t); if (!Q.length) return; const At = atlasOf(L.id, L.text), size = V(L, 'size', t), hh = size * At.hr / 2;
  const B = new Float32Array(Q.length * 6 * 4); let k = 0;
  for (const q of Q) { const hw = q.g.w * size / 2, c = Math.cos(q.ang), s = Math.sin(q.ang), P = (x: number, y: number, u: number, v: number) => { B.set([q.x + c * x - s * y, q.y + s * x + c * y, u, v], k); k += 4; };
    const u0 = q.g.u0, u1 = q.g.u1; P(-hw, -hh, u0, 0); P(hw, -hh, u1, 0); P(hw, hh, u1, 1); P(-hw, -hh, u0, 0); P(hw, hh, u1, 1); P(-hw, hh, u0, 1); }
  gl.bindFramebuffer(gl.FRAMEBUFFER, target.f); gl.viewport(0, 0, ctx.w, ctx.h); gl.useProgram(p); gl.bindVertexArray(VAO); gl.bindBuffer(gl.ARRAY_BUFFER, VBO); gl.bufferData(gl.ARRAY_BUFFER, B, gl.DYNAMIC_DRAW);
  gl.uniform2f(U(p, 'uRes'), ctx.w, ctx.h); const c = hexRGB(V(L, 'c1', t)), op = 1; gl.uniform3f(U(p, 'uC'), c[0] * op, c[1] * op, c[2] * op);
  bindTex(0, At.tex); gl.uniform1i(U(p, 'uAtlas'), 0); gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
  gl.drawArrays(gl.TRIANGLES, 0, Q.length * 6); gl.disable(gl.BLEND); gl.bindVertexArray(null); void BASEK; void R;
}
EFFECTS.textpath.draw = drawTextPath;
