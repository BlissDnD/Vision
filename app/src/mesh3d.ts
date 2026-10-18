/* Mesh-alapú 3D réteg (C szakasz / M6): „Gerincfelület”. Decision + measurements: prototypes/red-ribbon-webgl/README.md.
 *
 * A layer that renders real triangle geometry into its layer texture, then goes through Vel's normal chain
 * (layer fx, blend, global look / tone mapping). Passes per frame:
 *   1. mirror: the mesh reflected in the floor plane → half-res texture (+mips = glossy blur)
 *   2. main: 4× MSAA colour + depth: studio background, mirror floor, mesh
 *   3. resolve: blit into the layer target (premultiplied RGBA, linear HDR)
 * Lighting is an analytic studio (sky, back glow, light strips, streaky red floor) evaluated by ray–plane hits and
 * widened by roughness: correct parallax for every shaded point, no cube maps, no prefiltering pass.
 * Geometry: a sheet hanging from an editable spine (L.spine, centripetal Catmull–Rom), rebuilt only when form params change. */
import { R } from './runtime';
import { compile, gl, IFMT, TYPE } from './gl';
import { ev } from './evaluation';
import { hexRGB } from './palettes';

export const DEF_SPINE = [[-6.4, 4.4, 0.6], [-4.2, 3.0, -0.5], [-2.6, 1.2, -1.4], [-1.0, 0.14, -2.0], [0.7, 0.7, -2.6], [2.4, 1.9, -2.2], [3.9, 3.1, -1.2], [5.0, 4.4, 0.6], [5.8, 5.8, 3.0]];

/* ---------------- small vector math ---------------- */
type V3 = [number, number, number];
const sub = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]], add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const mul = (a: V3, s: number): V3 => [a[0] * s, a[1] * s, a[2] * s], dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const len = (a: V3) => Math.hypot(a[0], a[1], a[2]), norm = (a: V3): V3 => { const l = len(a) || 1; return [a[0] / l, a[1] / l, a[2] / l]; };
const smooth = (a: number, b: number, x: number) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };

/** Centripetal Catmull–Rom through the points, resampled by arc length. Returns n points + unit tangents + length. */
export function spinePath(pts: V3[], n: number) {
  const P = [sub(mul(pts[0], 2), pts[1]), ...pts, sub(mul(pts[pts.length - 1], 2), pts[pts.length - 2])], dense: V3[] = [];
  for (let i = 1; i < P.length - 2; i++) {
    const [p0, p1, p2, p3] = [P[i - 1], P[i], P[i + 1], P[i + 2]];
    const t0 = 0, t1 = t0 + Math.sqrt(len(sub(p1, p0)) || 1e-4), t2 = t1 + Math.sqrt(len(sub(p2, p1)) || 1e-4), t3 = t2 + Math.sqrt(len(sub(p3, p2)) || 1e-4);
    for (let k = 0; k < 24; k++) { const t = t1 + (t2 - t1) * k / 24;
      const A1 = add(mul(p0, (t1 - t) / (t1 - t0)), mul(p1, (t - t0) / (t1 - t0))), A2 = add(mul(p1, (t2 - t) / (t2 - t1)), mul(p2, (t - t1) / (t2 - t1))), A3 = add(mul(p2, (t3 - t) / (t3 - t2)), mul(p3, (t - t2) / (t3 - t2)));
      const B1 = add(mul(A1, (t2 - t) / (t2 - t0)), mul(A2, (t - t0) / (t2 - t0))), B2 = add(mul(A2, (t3 - t) / (t3 - t1)), mul(A3, (t - t1) / (t3 - t1)));
      dense.push(add(mul(B1, (t2 - t) / (t2 - t1)), mul(B2, (t - t1) / (t2 - t1)))); } }
  dense.push(pts[pts.length - 1]);
  const cum = [0]; for (let i = 1; i < dense.length; i++) cum.push(cum[i - 1] + len(sub(dense[i], dense[i - 1])));
  const L = cum[cum.length - 1] || 1, out: V3[] = []; let j = 0;
  for (let i = 0; i < n; i++) { const s = L * i / (n - 1); while (j < cum.length - 2 && cum[j + 1] < s) j++; const u = (s - cum[j]) / ((cum[j + 1] - cum[j]) || 1); out.push(add(dense[j], mul(sub(dense[j + 1], dense[j]), u))); }
  const tan = out.map((_, i) => norm(sub(out[Math.min(n - 1, i + 1)], out[Math.max(0, i - 1)])));
  return { pts: out, tan, length: L };
}

/** Build the sheet: interleaved [pos3, nrm3, silver1, muv2, pat1] + indices + 64 floor-contact samples. */
export function buildSheet(F: any, spine: V3[], NA = 260) {
  const NF = 24, NC = 6, ring: any[] = [];
  for (let i = 0; i < NF; i++) ring.push({ u: i / (NF - 1), cap: 0, v: 1, side: 1 });
  for (let i = 1; i < NC; i++) { const a = Math.PI / 2 - (i / NC) * Math.PI; ring.push({ cap: 1, a, side: (Math.sin(a) + 1) / 2 }); }
  for (let i = 0; i < NF; i++) ring.push({ u: 1 - i / (NF - 1), cap: 0, v: -1, side: 0 });
  for (let i = 1; i < NC; i++) { const a = -Math.PI / 2 - (i / NC) * Math.PI; ring.push({ cap: -1, a, side: (Math.sin(a) + 1) / 2 }); }
  const RN = ring.length, S = spinePath(spine.map(p => [p[0], p[1] * F.arch, p[2]] as V3), NA);
  const pos = new Float32Array(NA * RN * 3), extra = new Float32Array(NA * RN * 4), contacts: number[] = [];
  const h = F.thick / 2, r = F.fillet; let prevW: V3 | null = null;
  const squash = (y: number) => (r > 0 && y < r ? Math.max(0.012, r * Math.exp(y / r - 1)) : y);
  for (let i = 0; i < NA; i++) {
    const s = i / (NA - 1), T = S.tan[i], C = S.pts[i];
    const lean = F.lean + (F.leanEnd - F.lean) * smooth(0.15, 0.85, s), D = norm([0, -1, lean]);
    let w = sub(D, mul(T, dot(T, D))); w = len(w) < 1e-4 ? (prevW || [1, 0, 0]) : norm(w);
    const th = F.twist * smooth(0.3, 1, s), tw = cross(T, w); w = norm(add(mul(w, Math.cos(th)), mul(tw, Math.sin(th)))); prevW = w;
    const b = norm(cross(T, w)), W = F.width * Math.max(0.04, 1 + F.taper * (1 - 2 * s)), x0 = 0, x1 = W, hh = Math.min(h, W / 2);
    for (let j = 0; j < RN; j++) {
      const q = ring[j]; let du: number, dv: number;
      if (q.cap === 0) { du = x0 + hh + q.u * (W - 2 * hh); dv = q.v * hh; } else { const cx = q.cap > 0 ? x1 - hh : x0 + hh; du = cx + Math.cos(q.a) * hh; dv = Math.sin(q.a) * hh; }
      const f = (du - x0) / W; dv += F.bend * W * f * f;
      const k = (i * RN + j) * 3, P3 = add(add(C, mul(w, du)), mul(b, dv));
      pos[k] = P3[0]; pos[k + 1] = squash(P3[1]); pos[k + 2] = P3[2];
      const uu = q.cap === 0 ? f : q.cap > 0 ? 1 : 0, up = b[1] >= 0 ? q.side : 1 - q.side, e = (i * RN + j) * 4;
      extra[e] = up * (1 - smooth(0, 0.09, uu)); extra[e + 1] = s * S.length; extra[e + 2] = du - x0; extra[e + 3] = smooth(0.12, 0.35, uu) * (1 - smooth(0.35, 0.55, s));
    }
    if (i % Math.ceil(NA / 21) === 0) for (const f of [0.08, 0.5, 0.92]) { const du = f * W, dv = F.bend * W * f * f, P3 = add(add(C, mul(w, du)), mul(b, dv));
      contacts.push(P3[0], squash(P3[1]), P3[2], Math.max(0.15, W * 0.18)); }
  }
  const idx = new Uint32Array((NA - 1) * RN * 6); let n = 0;
  for (let i = 0; i < NA - 1; i++) for (let j = 0; j < RN; j++) { const a = i * RN + j, b2 = i * RN + (j + 1) % RN, c = a + RN, d = b2 + RN; idx[n++] = a; idx[n++] = c; idx[n++] = b2; idx[n++] = b2; idx[n++] = c; idx[n++] = d; }
  const nrm = new Float32Array(pos.length);
  for (let t = 0; t < idx.length; t += 3) { const a = idx[t] * 3, b2 = idx[t + 1] * 3, c = idx[t + 2] * 3;
    const e1: V3 = [pos[b2] - pos[a], pos[b2 + 1] - pos[a + 1], pos[b2 + 2] - pos[a + 2]], e2: V3 = [pos[c] - pos[a], pos[c + 1] - pos[a + 1], pos[c + 2] - pos[a + 2]], fn = cross(e1, e2);
    for (const o of [a, b2, c]) { nrm[o] += fn[0]; nrm[o + 1] += fn[1]; nrm[o + 2] += fn[2]; } }
  const V = new Float32Array(NA * RN * 10);
  for (let i = 0; i < NA * RN; i++) { const l = Math.hypot(nrm[i * 3], nrm[i * 3 + 1], nrm[i * 3 + 2]) || 1;
    V.set([pos[i * 3], pos[i * 3 + 1], pos[i * 3 + 2], nrm[i * 3] / l, nrm[i * 3 + 1] / l, nrm[i * 3 + 2] / l, extra[i * 4], extra[i * 4 + 1], extra[i * 4 + 2], extra[i * 4 + 3]], i * 10); }
  while (contacts.length < 256) contacts.push(0, 99, 0, 0.01);
  return { V, idx, contacts: new Float32Array(contacts.slice(0, 256)), tris: idx.length / 3 };
}

/* ---------------- shaders ---------------- */
const ENV = `
uniform vec3 uCam, uBack, uFloorC; uniform float uSky, uBackI, uStripPos, uStripSize, uStripI;
float gStrip = 1.0;   // overhead strips light the surfaces only: hidden from the camera and the floor background (studio trick)
vec3 envC(vec3 p, vec3 d, float r){                       // analytic studio, widened by roughness
  float rr = r * r; vec3 col;
  if (d.y > 0.0) {
    col = vec3(0.93, 0.925, 0.92) * uSky * mix(0.82, 1.0, smoothstep(-0.05, 0.5, d.y));
    float H = 7.8 - p.y; vec2 hp = p.xz + d.xz * (H / max(d.y, 0.02)); float w0 = 0.18 * uStripSize, w = w0 + rr * 4.0;
    float z0 = -13.0 - 11.0 * uStripSize, z1 = -13.0 + 11.0 * uStripSize, zf = smoothstep(z0 - 0.5 - rr * 8.0, z0, hp.y) * (1.0 - smoothstep(z1, z1 + 0.5 + rr * 8.0, hp.y));
    float s = 0.0; for (int i = 0; i < 3; i++) { float xi = uStripPos + (float(i) - 1.0) * 2.6; s += exp(-pow((hp.x - xi) / w, 2.0)); }
    col += vec3(1.0, 0.98, 0.96) * s * zf * uStripI * (w0 / w) * smoothstep(0.0, 0.08, d.y) * gStrip;
    float c = max(dot(d, uBack), 0.0);
    col += vec3(1.0, 0.93, 0.86) * uBackI * (pow(c, mix(220.0, 8.0, clamp(rr * 3.0, 0.0, 1.0))) * mix(2.4, 0.6, clamp(rr * 3.0, 0.0, 1.0)) + pow(c, 14.0) * 0.18);
  } else {
    float t = -max(p.y, 0.0) / d.y; vec3 f = p + d * t; float st = 0.0;
    for (int i = 0; i < 7; i++) { float fi = float(i), zi = 6.0 - fi * 3.4, wi = 0.35 + fi * 0.12 + rr * 3.0;
      st += exp(-pow((f.z - zi) / wi, 2.0)) * (0.6 + 0.4 * sin(f.x * 0.21 + fi * 1.7)) * (0.35 + fi * 0.12) / wi; }
    float pool = exp(-length((f.xz - vec2(1.0, -12.0)) * vec2(0.14, 0.08)));
    col = uFloorC * 0.35 + vec3(1.0, 0.5, 0.5) * (st * 4.0 * uStripI / 2.5 + pool * 2.0);
    col = mix(col, vec3(0.93, 0.925, 0.92) * uSky * 0.82, smoothstep(30.0, 90.0, t));   // far floor fades into the studio wall
  }
  if (d.z > 0.0) { float t = (11.0 - p.z) / d.z; vec3 q = p + d * t; float wb = 0.22 * uStripSize + rr * 3.0;   // bars behind the camera
    col += vec3(1.0) * (exp(-pow((q.y - 1.3) / wb, 2.0)) + exp(-pow((q.y - 3.8) / wb, 2.0))) * uStripI * 0.5 * (0.22 * uStripSize / wb) * smoothstep(17.0 * uStripSize + 1.0, 17.0 * uStripSize - 1.0, abs(q.x - uStripPos * 0.5)); }
  return col; }`;

const MESH_VS = `#version 300 es
layout(location=0) in vec3 aP; layout(location=1) in vec3 aN; layout(location=2) in vec4 aX;
uniform mat4 uVP; uniform float uMirror; out vec3 vP; out vec3 vN; out vec4 vX;
void main(){ vP = aP; vN = aN; vX = aX; vec3 q = uMirror > 0.5 ? vec3(aP.x, -aP.y, aP.z) : aP; gl_Position = uVP * vec4(q, 1.0); }`;
const MESH_FS = `#version 300 es
precision highp float; in vec3 vP; in vec3 vN; in vec4 vX; out vec4 o;
uniform vec3 uBase; uniform float uRough, uMetal, uCoat, uTint, uSilver, uDot, uDotS, uMirror, uExpo;
${ENV}
void main(){
  vec3 camP = uMirror > 0.5 ? vec3(uCam.x, -uCam.y, uCam.z) : uCam;   // the mirror shows the surface as seen from below the floor
  vec3 n = normalize(vN); vec3 v = normalize(camP - vP); if (dot(n, v) < 0.0) n = -n;
  float sil = vX.x * uSilver; vec3 base = mix(uBase, vec3(0.86, 0.86, 0.9), sil);
  float rough = uRough, hole = 0.0;
  { vec2 p = vX.yz / uDotS; vec2 rr = vec2(1.0, 1.7320508), hh = rr * 0.5;          // perforated dots (fade below a pixel)
    vec2 a = mod(p, rr) - hh, b = mod(p - hh, rr) - hh; vec2 g = dot(a, a) < dot(b, b) ? a : b; float d = length(g);
    float aa = max(fwidth(d), 1e-4), fade = 1.0 - smoothstep(0.12, 0.35, aa);
    hole = mix(0.28, 1.0 - smoothstep(0.28 - aa, 0.28 + aa, d), fade) * vX.w * uDot; base *= 1.0 - 0.6 * hole; rough = mix(rough, 0.65, hole); }
  float metal = mix(uMetal, 1.0, sil * 0.6), ct = max(dot(n, v), 1e-3); vec3 Rf = reflect(-v, n);
  vec3 F0 = mix(vec3(0.04), base, metal), F = F0 + (max(vec3(1.0 - rough), F0) - F0) * pow(1.0 - ct, 5.0);
  vec3 tc = base / max(max(base.r, base.g), max(base.b, 1e-3)), k = mix(vec3(1.0), tc, uTint * (1.0 - sil));   // "Vörös tükröződés"
  vec3 spec = envC(vP, Rf, rough) * F * k, dif = base * (1.0 - metal) * envC(vP, n, 1.0) * 0.9;
  float Fc = 0.04 + 0.96 * pow(1.0 - ct, 5.0); vec3 coat = envC(vP, Rf, 0.05) * Fc * uCoat * mix(vec3(1.0), tc, uTint * 0.75 * (1.0 - sil));
  o = vec4(((dif + spec) * (1.0 - uCoat * Fc) + coat) * (uMirror > 0.5 ? 1.0 : uExpo), 1.0); }`;   // mirror stays raw: the floor applies the exposure once

const FLOOR_VS = `#version 300 es
layout(location=0) in vec3 aP; uniform mat4 uVP; out vec3 vP; void main(){ vP = aP; gl_Position = uVP * vec4(aP, 1.0); }`;
const FLOOR_FS = `#version 300 es
precision highp float; in vec3 vP; out vec4 o; uniform sampler2D uMir; uniform vec2 uRes; uniform float uRefl, uBlur, uAOk, uExpo; uniform vec4 uAO[64];
${ENV}
void main(){ gStrip = 0.0;
  vec3 v = normalize(uCam - vP); float F = 0.04 + 0.96 * pow(1.0 - max(v.y, 0.0), 5.0), dist = length(uCam - vP);
  vec4 m = textureLod(uMir, gl_FragCoord.xy / uRes, clamp(uBlur * (1.0 + dist * 0.08), 0.0, 6.0));
  vec3 bg = envC(vP + vec3(0.0, 0.001, 0.0), reflect(-v, vec3(0.0, 1.0, 0.0)), 0.25);
  vec3 refl = mix(bg, m.rgb / max(m.a, 1e-4), clamp(m.a, 0.0, 1.0));
  float occ = 0.0; for (int i = 0; i < 64; i++) { vec4 s = uAO[i]; vec2 d = vP.xz - s.xz; float r = s.w + s.y * 0.6; occ += exp(-dot(d, d) / (r * r)) * exp(-max(s.y, 0.0) * 1.6) * 0.35; }
  occ = clamp(occ * uAOk, 0.0, 0.85);
  float pool = exp(-abs(vP.x - 0.9) * 0.28) * smoothstep(2.0, -14.0, vP.z);
  vec3 col = uFloorC * (0.22 + 0.5 * pool) * (1.0 - occ) + refl * uRefl * (F * 0.3 + uFloorC * 1.1);
  col = mix(col, vec3(0.93, 0.925, 0.92) * uSky * 0.82, smoothstep(30.0, 90.0, dist));
  o = vec4(col * uExpo, 1.0); }`;
const BG_VS = `#version 300 es
layout(location=0) in vec2 aP; out vec2 vU; void main(){ vU = aP; gl_Position = vec4(aP, 0.9999, 1.0); }`;
const BG_FS = `#version 300 es
precision highp float; in vec2 vU; out vec4 o; uniform mat4 uInvVP; uniform float uExpo;
${ENV}
void main(){ gStrip = 0.0; vec4 h = uInvVP * vec4(vU, 1.0, 1.0); vec3 d = normalize(h.xyz / h.w - uCam); o = vec4(envC(uCam, d, 0.0) * uExpo, 1.0); }`;

function prog(vs: string, fs: string) { const p: any = gl.createProgram(); gl.attachShader(p, compile(gl.VERTEX_SHADER, vs)); gl.attachShader(p, compile(gl.FRAGMENT_SHADER, fs)); gl.linkProgram(p);
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p) || 'link'); p.u = {}; return p; }
const Uq = (p: any, n: string) => (n in p.u ? p.u[n] : (p.u[n] = gl.getUniformLocation(p, n)));
let PR: any = null;
function progs() { if (PR) return PR === 'err' ? null : PR;
  try { PR = { mesh: prog(MESH_VS, MESH_FS), floor: prog(FLOOR_VS, FLOOR_FS), bg: prog(BG_VS, BG_FS) };
    const q = gl.createVertexArray(); gl.bindVertexArray(q); const b = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, b); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0); gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0); PR.quad = q;
    const f = gl.createVertexArray(); gl.bindVertexArray(f); const fb = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, fb); const S = 120;
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-S, 0, -S, S, 0, -S, -S, 0, S, S, 0, -S, S, 0, S, -S, 0, S]), gl.STATIC_DRAW); gl.enableVertexAttribArray(0); gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0); PR.floorVao = f;
    gl.bindVertexArray(null); return PR; }
  catch (e) { console.warn('Gerincfelület shader:', e); PR = 'err'; R.meshErr = String(e); return null; } }

/* ---------------- per-context targets ---------------- */
export function targets(ctx: any) {
  let T = ctx.mesh; if (T && T.w === ctx.w && T.h === ctx.h) return T;
  if (T) { gl.deleteFramebuffer(T.msF); gl.deleteRenderbuffer(T.msC); gl.deleteRenderbuffer(T.msD); gl.deleteFramebuffer(T.mF); gl.deleteTexture(T.mT); gl.deleteRenderbuffer(T.mD); }
  const w = ctx.w, h = ctx.h, ns = Math.min(4, gl.getParameter(gl.MAX_SAMPLES) || 1);
  const msC = gl.createRenderbuffer(); gl.bindRenderbuffer(gl.RENDERBUFFER, msC); gl.renderbufferStorageMultisample(gl.RENDERBUFFER, ns, IFMT, w, h);
  const msD = gl.createRenderbuffer(); gl.bindRenderbuffer(gl.RENDERBUFFER, msD); gl.renderbufferStorageMultisample(gl.RENDERBUFFER, ns, gl.DEPTH_COMPONENT24, w, h);
  const msF = gl.createFramebuffer(); gl.bindFramebuffer(gl.FRAMEBUFFER, msF); gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.RENDERBUFFER, msC); gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, msD);
  const mw = Math.max(16, w >> 1), mh = Math.max(16, h >> 1), mT = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, mT);
  gl.texImage2D(gl.TEXTURE_2D, 0, IFMT, mw, mh, 0, gl.RGBA, TYPE, null); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE); gl.generateMipmap(gl.TEXTURE_2D);
  const mD = gl.createRenderbuffer(); gl.bindRenderbuffer(gl.RENDERBUFFER, mD); gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT24, mw, mh);
  const mF = gl.createFramebuffer(); gl.bindFramebuffer(gl.FRAMEBUFFER, mF); gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, mT, 0); gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, mD);
  T = ctx.mesh = { w, h, msF, msC, msD, mF, mT, mD, mw, mh }; return T;
}

/* ---------------- geometry cache ---------------- */
const meshes = new Map<string, any>();
const FORM = ['arch', 'width', 'taper', 'thick', 'bend', 'lean', 'leanEnd', 'twist', 'fillet'];
export function formOf(L: any, t: number, def: any) { const F: any = {}; for (const k of FORM) { const d = def.params.find((x: any) => x.k === k); F[k] = ev(L.p[k], d, t); } return F; }
export function meshFor(L: any, t: number, def: any) {
  const F = formOf(L, t, def), spine = L.spine && L.spine.length >= 3 ? L.spine : DEF_SPINE, key = JSON.stringify([F, spine]);
  let M = meshes.get(L.id); if (M && M.key === key) return M;
  const animated = FORM.some(k => L.p[k] && L.p[k].k && L.p[k].k.length), G = buildSheet(F, spine, animated ? 160 : 260);
  if (!M) { M = { vao: gl.createVertexArray(), vbo: gl.createBuffer(), ibo: gl.createBuffer() }; meshes.set(L.id, M); }
  gl.bindVertexArray(M.vao); gl.bindBuffer(gl.ARRAY_BUFFER, M.vbo); gl.bufferData(gl.ARRAY_BUFFER, G.V, gl.DYNAMIC_DRAW);
  gl.enableVertexAttribArray(0); gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 40, 0); gl.enableVertexAttribArray(1); gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 40, 12);
  gl.enableVertexAttribArray(2); gl.vertexAttribPointer(2, 4, gl.FLOAT, false, 40, 24);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, M.ibo); gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, G.idx, gl.DYNAMIC_DRAW); gl.bindVertexArray(null);
  Object.assign(M, { key, count: G.idx.length, contacts: G.contacts, tris: G.tris, V: G.V, idx: G.idx }); return M;   // V/idx kept on the CPU for picking (glint drag)
}

/* ---------------- camera ---------------- */
function persp(fovDeg: number, asp: number, n: number, f: number) { const t = 1 / Math.tan(fovDeg * Math.PI / 360); return [t / asp, 0, 0, 0, 0, t, 0, 0, 0, 0, (f + n) / (n - f), -1, 0, 0, 2 * f * n / (n - f), 0]; }
function lookAt(e: V3, c: V3) { const z = norm(sub(e, c)), x = norm(cross([0, 1, 0], z)), y = cross(z, x); return [x[0], y[0], z[0], 0, x[1], y[1], z[1], 0, x[2], y[2], z[2], 0, -dot(x, e), -dot(y, e), -dot(z, e), 1]; }
function mm(a: number[], b: number[]) { const o = new Array(16).fill(0); for (let c = 0; c < 4; c++) for (let r = 0; r < 4; r++) for (let k = 0; k < 4; k++) o[c * 4 + r] += a[k * 4 + r] * b[c * 4 + k]; return o; }
function inv(m: number[]) { // general 4×4 inverse
  const a = m, o = new Array(16); const [a00, a01, a02, a03, a10, a11, a12, a13, a20, a21, a22, a23, a30, a31, a32, a33] = a;
  const b00 = a00 * a11 - a01 * a10, b01 = a00 * a12 - a02 * a10, b02 = a00 * a13 - a03 * a10, b03 = a01 * a12 - a02 * a11, b04 = a01 * a13 - a03 * a11, b05 = a02 * a13 - a03 * a12;
  const b06 = a20 * a31 - a21 * a30, b07 = a20 * a32 - a22 * a30, b08 = a20 * a33 - a23 * a30, b09 = a21 * a32 - a22 * a31, b10 = a21 * a33 - a23 * a31, b11 = a22 * a33 - a23 * a32;
  const det = 1 / (b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06);
  o[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det; o[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det; o[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det; o[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
  o[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det; o[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det; o[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det; o[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
  o[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det; o[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det; o[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det; o[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
  o[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det; o[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det; o[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det; o[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det; return o; }
export function camOf(L: any, t: number, def: any, asp: number) {
  const P = (k: string) => ev(L.p[k], def.params.find((x: any) => x.k === k), t);
  const yaw = P('ry') * Math.PI / 180, pit = P('rx') * Math.PI / 180, d = P('dist'), c: V3 = [P('tx'), P('ty'), P('tz')];
  const e: V3 = [c[0] + d * Math.cos(pit) * Math.sin(yaw), c[1] + d * Math.sin(pit), c[2] + d * Math.cos(pit) * Math.cos(yaw)]; // rx > 0: camera above the target
  const VP = mm(persp(P('fov'), asp, 0.1, 400), lookAt(e, c)); return { VP, inv: inv(VP), eye: e, c, fov: P('fov'), dist: d };
}

/** Draw the surface layer into `target` (premultiplied linear RGBA). */
export function drawMesh(L: any, target: any, ctx: any, t: number, def: any) {
  const pr = progs(); if (!pr) return;
  const T = targets(ctx), M = meshFor(L, t, def), C = camOf(L, t, def, ctx.w / ctx.h);
  const P = (k: string) => ev(L.p[k], def.params.find((x: any) => x.k === k), t);
  const base = hexRGB(L.p.color.v).map((x: number) => Math.pow(x, 2.2)) as V3;   // sRGB picker → linear
  const floorOn = Math.round(L.p.floor.v) > 0, bgOn = Math.round(L.p.bg.v) > 0;
  const env = (p: any) => { gl.uniform3f(Uq(p, 'uCam'), C.eye[0], C.eye[1], C.eye[2]); const b = norm([0.05, 0.03, -1]); gl.uniform3f(Uq(p, 'uBack'), b[0], b[1], b[2]);
    gl.uniform3f(Uq(p, 'uFloorC'), base[0], base[1], base[2]); gl.uniform1f(Uq(p, 'uSky'), P('sky')); gl.uniform1f(Uq(p, 'uBackI'), P('backI'));
    gl.uniform1f(Uq(p, 'uExpo'), P('expo')); gl.uniform1f(Uq(p, 'uStripPos'), P('stripPos')); gl.uniform1f(Uq(p, 'uStripSize'), P('stripSize')); gl.uniform1f(Uq(p, 'uStripI'), P('stripI')); };
  const meshU = (mirror: number) => { const p = pr.mesh; gl.useProgram(p); env(p); gl.uniformMatrix4fv(Uq(p, 'uVP'), false, C.VP); gl.uniform1f(Uq(p, 'uMirror'), mirror);
    gl.uniform3f(Uq(p, 'uBase'), base[0], base[1], base[2]); for (const k of ['rough', 'metal', 'coat', 'tint', 'silver', 'dot']) gl.uniform1f(Uq(p, 'u' + k[0].toUpperCase() + k.slice(1)), P(k));
    gl.uniform1f(Uq(p, 'uDotS'), P('dotS')); gl.bindVertexArray(M.vao); gl.drawElements(gl.TRIANGLES, M.count, gl.UNSIGNED_INT, 0); };
  gl.enable(gl.DEPTH_TEST); gl.depthFunc(gl.LEQUAL); gl.disable(gl.BLEND); gl.disable(gl.CULL_FACE);
  // 1) mirror
  if (floorOn) { gl.bindFramebuffer(gl.FRAMEBUFFER, T.mF); gl.viewport(0, 0, T.mw, T.mh); gl.clearColor(0, 0, 0, 0); gl.clearDepth(1); gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    meshU(1); gl.bindTexture(gl.TEXTURE_2D, T.mT); gl.generateMipmap(gl.TEXTURE_2D); }
  // 2) main, MSAA
  gl.bindFramebuffer(gl.FRAMEBUFFER, T.msF); gl.viewport(0, 0, ctx.w, ctx.h); gl.clearColor(0, 0, 0, 0); gl.clearDepth(1); gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  if (bgOn) { const p = pr.bg; gl.useProgram(p); env(p); gl.uniformMatrix4fv(Uq(p, 'uInvVP'), false, C.inv); gl.depthMask(false); gl.bindVertexArray(pr.quad); gl.drawArrays(gl.TRIANGLES, 0, 3); gl.depthMask(true); }
  if (floorOn) { const p = pr.floor; gl.useProgram(p); env(p); gl.uniformMatrix4fv(Uq(p, 'uVP'), false, C.VP); gl.uniform2f(Uq(p, 'uRes'), ctx.w, ctx.h);
    gl.uniform1f(Uq(p, 'uRefl'), P('refl')); gl.uniform1f(Uq(p, 'uBlur'), P('blur')); gl.uniform1f(Uq(p, 'uAOk'), P('ao')); gl.uniform4fv(Uq(p, 'uAO'), M.contacts);
    gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, T.mT); gl.uniform1i(Uq(p, 'uMir'), 0); gl.bindVertexArray(pr.floorVao); gl.drawArrays(gl.TRIANGLES, 0, 6); }
  meshU(0);
  gl.bindVertexArray(null); gl.disable(gl.DEPTH_TEST);
  // 3) resolve into the layer target
  gl.bindFramebuffer(gl.READ_FRAMEBUFFER, T.msF); gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, target.f);
  gl.blitFramebuffer(0, 0, ctx.w, ctx.h, 0, 0, target.w, target.h, gl.COLOR_BUFFER_BIT, gl.NEAREST);
  gl.bindFramebuffer(gl.READ_FRAMEBUFFER, null); gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, null);
  R.meshTris = M.tris;
}
