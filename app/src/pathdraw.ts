/* P2 · Útvonal réteg rajzolása: the path (paths.ts) as a triangle strip with per-vertex across (−1…1) / arc (0…1),
 * shaded in the fragment shader: Vonal, Cső (fake 3D tube light, Tubes elve), Csavart szalag, Neon, Gyöngysor.
 * Trim (Kirajzolás) and dashes discard by arc; a closed path can be filled (ear clipping). Pure function of time. */
import { R } from './runtime';
import { EFFECTS, BASEK } from './effects/index';
import { U, gl, clearTarget, errCache } from './gl';
import { ev } from './evaluation';
import { hexRGB } from './palettes';
import { link2, setPal } from './render';
import { Pt, arc, curve, closedOf, ptsOf, smoothOf, toWorld, placeAt } from './paths';

const D = Object.fromEntries(EFFECTS.pathshape.params.map(d => [d.k, d]));
const V = (L: any, k: string, t: number) => { const d = D[k], v = L.p[k]; if (!v) return d.def; return d.type === 'sel' ? Math.round(v.v) : d.type === 'color' ? v.v : ev(v, d, t); };
let PROG: any = null, VAO: any = null, VBO: any = null;
function prog() {
  if (PROG) return PROG === 'err' ? null : PROG;
  const VS = `#version 300 es
precision highp float;
layout(location=0) in vec2 aPos; layout(location=1) in vec4 aD;   // across (geometry), arc 0…1, core/geometry half-width ratio, core half-width (scene units)
uniform vec2 uRes; out vec4 vD; out vec2 vN;
void main(){vD=aD;gl_Position=vec4(aPos/vec2(uRes.x/uRes.y,1.0)*2.0,0.0,1.0);}`;
  const FS = `#version 300 es
precision highp float; in vec4 vD; out vec4 o;
uniform float uLook; uniform float uFill; uniform vec3 uC1; uniform vec3 uC2; uniform vec3 uFillC; uniform float uCol; uniform float uLen; uniform float uTime; uniform float uPx;
uniform float uTS; uniform float uTE; uniform float uTO; uniform float uDash; uniform float uDashL; uniform float uTwist; uniform float uGloss; uniform float uGlow; uniform float uClosed;
uniform vec3 uPA; uniform vec3 uPB; uniform vec3 uPC; uniform vec3 uPD; uniform float uHue;
uniform vec3 uG[16]; uniform float uGOn;
vec3 pal(float t){if(uGOn>0.5){float x=1.0-abs(fract((t+uHue)*0.5)*2.0-1.0);float f=x*15.0;int i=int(min(floor(f),14.0));return mix(uG[i],uG[i+1],f-float(i));}return clamp(uPA+uPB*cos(6.28318530718*(uPC*t+uPD+uHue)),0.0,1.0);}
void main(){
  if(uFill>0.5){o=vec4(uFillC,1.0);return;}
  float s=vD.y,k=max(vD.z,1e-3),x=vD.x/k,aa=uPx/max(vD.w,1e-6);
  float u=s-uTO; if(uClosed>0.5)u=fract(u); if(u<uTS||u>uTE)discard;
  vec3 c=uCol<0.5?uC1:uCol<1.5?mix(uC1,uC2,s):pal(s);
  float d=s*uLen,a=1.0;
  if(uDash>0.5&&uLook<3.5){float q=d/uDashL;
    if(uDash<1.5){if(fract(q)>0.55)discard;}
    else{float f=(fract(q)-0.5)*uDashL/max(vD.w,1e-6);if(length(vec2(f,x))>1.0)discard;}}
  int lk=int(uLook+0.5);
  if(lk==0){a=1.0-smoothstep(1.0-aa,1.0+aa,abs(x));}
  else if(lk==1){float ax=abs(x);if(ax>1.0+aa)discard;float xx=clamp(x,-1.0,1.0);vec3 N=vec3(xx*0.7,xx*0.7,sqrt(max(1.0-xx*xx,0.0)));vec3 Lg=normalize(vec3(-0.45,0.6,0.75));
    float df=0.22+0.78*max(dot(N,Lg),0.0);float sp=pow(max(dot(reflect(-Lg,N),vec3(0.0,0.0,1.0)),0.0),36.0)*uGloss;
    float rim=pow(1.0-N.z,3.0)*0.35;c=c*df+vec3(sp)+c*rim;a=1.0-smoothstep(1.0-aa,1.0+aa,ax);}
  else if(lk==2){float w=cos(uTwist*s*6.28318+uTime*0.7);float ww=max(abs(w),0.06);float xx=x/ww;if(abs(xx)>1.0+aa/ww)discard;
    vec3 base=w>0.0?c:mix(uC2,c,0.35)*0.75;float sh=0.45+0.55*abs(w);float sp=pow(1.0-abs(w),6.0)*uGloss*0.9;c=base*sh*(0.85+0.15*(1.0-abs(xx)))+vec3(sp);a=1.0-smoothstep(1.0-aa/ww,1.0+aa/ww,abs(xx));}
  else if(lk==3){float ax=abs(x);float core=1.0-smoothstep(0.25,0.55,ax);float halo=exp(-ax*ax*0.9/(0.15+uGlow*uGlow))*uGlow;a=clamp(core+halo*0.85,0.0,1.0);c=mix(c,vec3(1.0),core*0.75);o=vec4(c*a,a*0.9);return;}
  else{float cell=2.3*vD.w;float f=(fract(d/cell)-0.5)*cell/max(vD.w,1e-6);float r=length(vec2(f,x));if(r>1.0+aa)discard;float z=sqrt(max(1.0-r*r,0.0));vec3 N=vec3(f,x,z);vec3 Lg=normalize(vec3(-0.45,0.6,0.75));
    c=c*(0.25+0.75*max(dot(N,Lg),0.0))+vec3(pow(max(dot(reflect(-Lg,N),vec3(0,0,1)),0.0),30.0)*uGloss);a=1.0-smoothstep(1.0-aa,1.0+aa,r);}
  o=vec4(c*a,a);}`;
  try { PROG = link2(VS, FS); } catch (e: any) { console.warn('Shader: pathshape', e.message); PROG = 'err'; errCache.set('pathshape', String(e.message)); return null; }
  VAO = gl.createVertexArray(); VBO = gl.createBuffer(); gl.bindVertexArray(VAO); gl.bindBuffer(gl.ARRAY_BUFFER, VBO);
  gl.enableVertexAttribArray(0); gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 24, 0); gl.enableVertexAttribArray(1); gl.vertexAttribPointer(1, 4, gl.FLOAT, false, 24, 8); gl.bindVertexArray(null);
  return PROG;
}
/** Ear clipping (simple polygon, either winding); falls back to a fan. Returns index triples. */
export function earClip(P: Pt[]): number[] {
  const n = P.length; if (n < 3) return []; let area = 0; for (let i = 0; i < n; i++) { const a = P[i], b = P[(i + 1) % n]; area += a[0] * b[1] - b[0] * a[1]; }
  const idx = [...Array(n).keys()]; if (area < 0) idx.reverse(); const out: number[] = []; let guard = 0;
  const cross = (a: Pt, b: Pt, c: Pt) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]);
  const inside = (p: Pt, a: Pt, b: Pt, c: Pt) => cross(a, b, p) >= 0 && cross(b, c, p) >= 0 && cross(c, a, p) >= 0;
  while (idx.length > 3 && guard++ < n * n) {
    let cut = false;
    for (let i = 0; i < idx.length; i++) { const i0 = idx[(i + idx.length - 1) % idx.length], i1 = idx[i], i2 = idx[(i + 1) % idx.length], a = P[i0], b = P[i1], c = P[i2];
      if (cross(a, b, c) <= 1e-12) continue; let ok = true; for (const j of idx) { if (j === i0 || j === i1 || j === i2) continue; if (inside(P[j], a, b, c)) { ok = false; break; } }
      if (ok) { out.push(i0, i1, i2); idx.splice(i, 1); cut = true; break; } }
    if (!cut) { for (let i = 1; i < idx.length - 1; i++) out.push(idx[0], idx[i], idx[i + 1]); return out; }
  }
  if (idx.length === 3) out.push(idx[0], idx[1], idx[2]); return out;
}
/** Geometry of the stroke at t: world polyline (with the live wave), arc fractions, normals, half-widths. Exported for tests. */
export function strokeOf(L: any, t: number, pxScene: number) {
  const P = placeAt(L, t), closed = closedOf(L), loc = curve(ptsOf(L), closed, smoothOf(L), 24), poly = loc.map(p => toWorld(P, p)), A = arc(poly), n = poly.length;
  const nrm: Pt[] = poly.map((_, i) => { const a = poly[Math.max(0, i - 1)], b = poly[Math.min(n - 1, i + 1)]; let dx = b[0] - a[0], dy = b[1] - a[1];
    if (closed && (i === 0 || i === n - 1)) { const a2 = poly[n - 2], b2 = poly[1]; dx = b2[0] - a2[0]; dy = b2[1] - a2[1]; } const l = Math.hypot(dx, dy) || 1; return [-dy / l, dx / l]; });
  const wave = V(L, 'wave', t), wf = V(L, 'wfreq', t), ws = V(L, 'wspeed', t), s = A.cum.map(c => A.len > 0 ? c / A.len : 0);
  if (wave > 0) poly.forEach((p, i) => { const e = closed ? 1 : Math.sin(Math.PI * s[i]), w = Math.sin(6.28318 * (wf * s[i] - ws * t * .25)) * wave * P[2] * e; p[0] += nrm[i][0] * w; p[1] += nrm[i][1] * w; });
  const width = V(L, 'width', t) * P[2], w0 = V(L, 'w0', t), w1 = V(L, 'w1', t), look = V(L, 'look', t), glow = V(L, 'glow', t);
  const half = s.map(x => Math.max(0, width * .5 * (w0 + (w1 - w0) * x))), ext = look === 3 ? 1 + 3.2 * glow : 1;
  return { poly, s, nrm, half, geo: half.map(h => h * ext + pxScene * 1.5), len: arc(poly).len, closed, P };
}
export function drawPathShape(L: any, target: any, ctx: any, t: number) {
  clearTarget(target); const p = prog(); if (!p) { R.pathErr = errCache.get('pathshape'); return; }
  const px = 1 / ctx.h, G = strokeOf(L, t, px), n = G.poly.length; if (n < 2) return;
  gl.bindFramebuffer(gl.FRAMEBUFFER, target.f); gl.viewport(0, 0, ctx.w, ctx.h); gl.useProgram(p); gl.bindVertexArray(VAO); gl.bindBuffer(gl.ARRAY_BUFFER, VBO);
  gl.uniform2f(U(p, 'uRes'), ctx.w, ctx.h); gl.uniform1f(U(p, 'uTime'), t); gl.uniform1f(U(p, 'uPx'), px); gl.uniform1f(U(p, 'uLen'), Math.max(G.len, 1e-6));
  const c3 = (k: string) => hexRGB(V(L, k, t)); { const a = c3('c1'), b = c3('c2'), f = c3('fillc'); gl.uniform3f(U(p, 'uC1'), a[0], a[1], a[2]); gl.uniform3f(U(p, 'uC2'), b[0], b[1], b[2]); gl.uniform3f(U(p, 'uFillC'), f[0], f[1], f[2]); }
  const set = (u: string, k: string) => gl.uniform1f(U(p, u), V(L, k, t));
  set('uLook', 'look'); set('uCol', 'color'); set('uTS', 'trimS'); set('uTE', 'trimE'); set('uTO', 'trimO'); set('uDash', 'dash'); set('uDashL', 'dashL'); set('uTwist', 'twist'); set('uGloss', 'gloss'); set('uGlow', 'glow');
  gl.uniform1f(U(p, 'uClosed'), G.closed ? 1 : 0); setPal(p, L.pal || 0, L); gl.uniform1f(U(p, 'uHue'), ev(L.n.hue, BASEK.hue, t));
  gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
  if (G.closed && V(L, 'fill', t) === 1) {
    const ring = G.poly.slice(0, n - 1), tri = earClip(ring), F = new Float32Array(tri.length * 6);
    tri.forEach((j, i) => F.set([ring[j][0], ring[j][1], 0, 0, 1, 1], i * 6));
    gl.uniform1f(U(p, 'uFill'), 1); gl.bufferData(gl.ARRAY_BUFFER, F, gl.DYNAMIC_DRAW); gl.drawArrays(gl.TRIANGLES, 0, tri.length);
  }
  const B = new Float32Array((n - 1) * 6 * 6); let k = 0;
  const vtx = (i: number, side: number) => { const g = G.geo[i]; B.set([G.poly[i][0] + G.nrm[i][0] * g * side, G.poly[i][1] + G.nrm[i][1] * g * side, side, G.s[i], g > 0 ? G.half[i] / g : 0, Math.max(G.half[i], 1e-6)], k); k += 6; };
  for (let i = 0; i < n - 1; i++) { vtx(i, -1); vtx(i, 1); vtx(i + 1, 1); vtx(i, -1); vtx(i + 1, 1); vtx(i + 1, -1); }
  gl.uniform1f(U(p, 'uFill'), 0); gl.bufferData(gl.ARRAY_BUFFER, B, gl.DYNAMIC_DRAW); gl.drawArrays(gl.TRIANGLES, 0, (n - 1) * 6);
  gl.disable(gl.BLEND); gl.bindVertexArray(null);
}
EFFECTS.pathshape.draw = drawPathShape;
