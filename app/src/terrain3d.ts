/* T1 · 3D Terep: seeded procedural heightfield as real geometry (own orbit camera, scene light, cast shadow, water, sky).
 * Height = pure function of (x, z, params): seek = export = live. Six recipes (mountain, dune, island, canyon, mesa, crater).
 * Noise core (hash12, quintic value noise, fbm, ridged multifractal, terrace, crater2, dune2) adapted from
 * ZyFou/ProceduralTerrains, src/engine/terrain/terrainGLSL.js + noise/noisePrimsGLSL.js — MIT License, Copyright (c) 2026 ZyFou
 * (https://github.com/ZyFou/ProceduralTerrains). Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files, to deal in the Software without restriction, subject to: the above copyright
 * notice and this permission notice shall be included in all copies or substantial portions of the Software. THE SOFTWARE IS
 * PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND. Not ported: React editor, Three.js materials, chunk streaming, paint, erosion. */
import { R } from './runtime';
import { compile, gl } from './gl';
import { ev } from './evaluation';
import { camOf, targets } from './mesh3d';

/** World half-extent of the "near" terrain (the grid reaches FAR × this, coarser outward = distance LOD). */
export const HALF = 6, FAR = 3, HSCALE = 2.6;
/** Grid vertices per side for the quality profiles (Vázlat / Normál / Részletes); ×2 at ≥ 2K output. */
export const QN = [160, 384, 640];

const HEIGHT = `
uniform vec2 uSeed; uniform float uType, uExt, uRelief, uPers; uniform int uLoopGuard;
// --- adapted from ProceduralTerrains (MIT, (c) 2026 ZyFou): sine-free hash, quintic value noise, fbm, ridged ---
float hash12(vec2 p){ vec3 p3=fract(vec3(p.xyx)*0.1031); p3+=dot(p3,p3.yzx+33.33); return fract((p3.x+p3.y)*p3.z); }
float vnoise(vec2 p){ vec2 i=floor(p), f=fract(p); vec2 u=f*f*f*(f*(f*6.0-15.0)+10.0);
  return mix(mix(hash12(i),hash12(i+vec2(1,0)),u.x),mix(hash12(i+vec2(0,1)),hash12(i+vec2(1,1)),u.x),u.y); }
const mat2 ROT2=mat2(0.80,-0.60,0.60,0.80);
float fbmN(vec2 p,int n){ float a=0.5,s=0.0,nm=0.0; for(int i=0;i<n+uLoopGuard;i++){ s+=a*vnoise(p); nm+=a; a*=uPers; p=ROT2*p*2.0; } return s/max(nm,1e-4); }
float fbm4(vec2 p){ float a=0.5,s=0.0,nm=0.0; for(int i=0;i<4+uLoopGuard;i++){ s+=a*vnoise(p); nm+=a; a*=0.5; p=ROT2*p*2.0; } return s/nm; }
float ridgedN(vec2 p,int n){ float a=0.5,s=0.0,nm=0.0,c=1.0; for(int i=0;i<n+uLoopGuard;i++){ float v=1.0-abs(vnoise(p)*2.0-1.0); v*=v;
  s+=a*v*c; c=clamp(v*1.4,0.0,1.0); nm+=a; a*=uPers; p=ROT2*p*2.0; } return s/max(nm,1e-4); }
float terrace(float h,float steps){ float t=h*steps; return (floor(t)+smoothstep(0.2,0.8,fract(t)))/steps; }
float crater2(vec2 p,float density,float depth,float rim,float rimWidth){ vec2 ip=floor(p), fp=fract(p); float best=8.0, rnd=0.0;
  for(int y=-1;y<=1;y++) for(int x=-1;x<=1;x++){ vec2 g=vec2(x,y); vec2 o=vec2(hash12(ip+g),hash12(ip+g+vec2(23.7,5.9)));
    float d=length(g+o-fp); if(d<best){ best=d; rnd=hash12(ip+g+vec2(61.1,7.3)); } }
  if(rnd>density) return 0.0; float radius=mix(0.18,0.46,hash12(ip+vec2(rnd*17.0))); float t=best/max(radius,0.02);
  return -depth*(1.0-smoothstep(0.0,1.0,t))+rim*exp(-pow((t-1.0)/max(rimWidth,0.02),2.0)); }
float dune2(vec2 p,float windDir,float sharp,float rippleScale,float rippleStr){ vec2 dir=vec2(cos(windDir),sin(windDir));
  float across=dot(p,vec2(-dir.y,dir.x)), along=dot(p,dir); float warp=(vnoise(p*0.5)-0.5)*2.0;
  float dn=pow(clamp(1.0-abs(sin(across+warp)),0.0,1.0),max(sharp,0.1)); return clamp(dn+(vnoise(vec2(across*rippleScale,along*0.3))-0.5)*rippleStr,0.0,1.0); }
// --- Vel recipes (normalised height, ~0..1.2) ---
float shape01(vec2 xz,int oct){
  vec2 p=xz/${HALF.toFixed(1)}*uExt+uSeed; int T=int(uType+0.5);
  vec2 w=vec2(fbm4(p+vec2(13.7,41.3)),fbm4(p+vec2(87.2,9.1)));
  if(T==1){ vec2 q=p+(w-0.5)*0.35; return 0.06+fbmN(q*0.5,oct)*0.16+dune2(q*4.0,0.7,1.5,5.0,0.10)*0.18; }                 // dűne
  if(T==3){ vec2 q=p+(w-0.5)*0.5; float c=abs(fbm4(q*0.55+vec2(4.1,9.3))-0.5); float c2=abs(fbm4(q*1.3+vec2(7.7,1.9))-0.5);  // kanyon
    float h=0.62+fbmN(q,oct)*0.14-(1.0-smoothstep(0.015,0.11,c))*0.52-(1.0-smoothstep(0.01,0.05,c2))*0.16; return mix(h,terrace(h,9.0),0.8); }
  if(T==4){ vec2 q=p+(w-0.5)*0.6; float m=smoothstep(0.55,0.6,fbmN(q*0.8,4)); float h=0.1+fbmN(q,oct)*0.1+m*0.42;          // fennsík
    return mix(h,terrace(h,4.0),0.7); }
  if(T==5){ vec2 q=p+(w-0.5)*0.25; return 0.3+fbmN(q,oct)*0.16+crater2(p*1.1,0.75,0.55,0.32,0.35)*0.34+crater2(p*3.3+vec2(9.1,3.7),0.6,0.45,0.25,0.3)*0.1; }
  vec2 q=p+(w-0.5)*0.55; float ridge=ridgedN(q*1.7+vec2(31.4,27.2),oct); float chain=smoothstep(0.3,0.66,fbm4(q*0.35+vec2(5.1,17.7)));
  float h=0.06+fbmN(q,oct)*0.3+mix(pow(ridge,1.35),pow(ridge,0.62)*0.58,0.35)*mix(0.3,1.0,chain)*0.9;                                                // hegy
  if(T==2){ float r=length(xz)/${HALF.toFixed(1)}*(1.0+(fbm4(p*1.3+vec2(2.3,8.8))-0.5)*0.7);                          // sziget
    float fall=smoothstep(0.0,1.0,clamp((1.0-r)/0.75,0.0,1.0)); h=mix(-0.12,h*0.85+0.12,fall); }
  return h; }
float terrainH(vec2 xz,int oct){ return shape01(xz,oct)*uRelief*${HSCALE.toFixed(1)}; }
`;

const VS = `#version 300 es
precision highp float; precision highp int;
layout(location=0) in vec2 aG; uniform mat4 uVP; uniform int uOct; uniform float uCell; uniform vec3 uLDir; uniform float uLSoftK;
${HEIGHT}
out vec3 vW; out vec3 vN; out float vSh; out float vCav; out float vMoist; out vec2 vP;
void main(){
  vec2 g=sign(aG)*pow(abs(aG),vec2(1.8)); vec2 xz=g*${(HALF * FAR).toFixed(1)};                       // dense centre, coarse rim (distance LOD)
  float e=max(uCell,uCell*${(1.8 * FAR).toFixed(1)}*pow(max(abs(aG.x),abs(aG.y)),0.8));
  int oc=length(xz)>${(HALF * 1.6).toFixed(1)}?max(uOct-2,3):uOct;
  float h=terrainH(xz,oc), hl=terrainH(xz-vec2(e,0),oc), hr=terrainH(xz+vec2(e,0),oc), hd=terrainH(xz-vec2(0,e),oc), hu=terrainH(xz+vec2(0,e),oc);
  vN=normalize(vec3(hl-hr,2.0*e,hd-hu)); vCav=clamp((hl+hr+hd+hu-4.0*h)/(e*8.0),-1.0,1.0);
  // cast shadow: march the heightfield toward the light (soft penumbra; scene-light softness)
  float sh=1.0; vec3 L=normalize(uLDir); if(L.y>0.0){ float t=0.06; for(int i=0;i<28+uLoopGuard;i++){ vec3 q=vec3(xz.x,h,xz.y)+L*t;
      if(q.y>${(HSCALE * 2.6).toFixed(1)}) break; float d=q.y-terrainH(q.xz,3); sh=min(sh,clamp(uLSoftK*0.35*d/t,0.0,1.0)); if(sh<0.01) break; t*=1.18; t+=0.04; } } else sh=0.0;
  vSh=sh; vP=xz/${HALF.toFixed(1)}*uExt+uSeed; vMoist=fbm4(vP*0.8+vec2(19.1,3.3));
  vW=vec3(xz.x,h,xz.y); gl_Position=uVP*vec4(vW,1.0); }`;

const SKY = `
uniform vec3 uLDir, uLCol; uniform float uExpo, uFog, uBg;
vec3 lin(vec3 c){ return pow(c,vec3(2.2)); }
vec3 skyAt(vec3 d){ vec3 L=normalize(uLDir); float day=smoothstep(-0.15,0.35,L.y);
  vec3 zen=mix(lin(vec3(0.06,0.07,0.14)),lin(vec3(0.27,0.47,0.78)),day), hor=mix(lin(vec3(0.55,0.36,0.32)),lin(vec3(0.80,0.86,0.92)),day);
  vec3 c=mix(hor,zen,pow(clamp(d.y,0.0,1.0),0.55)); float s=max(dot(d,L),0.0);
  c+=uLCol*lin(vec3(1.0,0.78,0.5))*(pow(s,8.0)*0.35+pow(s,600.0)*12.0)*(0.4+0.6*day); return c*mix(1.0,0.35,step(d.y,0.0)*smoothstep(0.0,-0.3,d.y)); }`;

const FS = `#version 300 es
precision highp float; precision highp int;
in vec3 vW; in vec3 vN; in float vSh; in float vCav; in float vMoist; in vec2 vP; out vec4 o;
uniform vec3 uCam; uniform float uStyle, uSea, uDetail, uLWrap; uniform int uLoopGuard;
${SKY}
float h12(vec2 p){ vec3 p3=fract(vec3(p.xyx)*0.1031); p3+=dot(p3,p3.yzx+33.33); return fract((p3.x+p3.y)*p3.z); }
// value noise with analytic derivative (after ProceduralTerrains vnoised2, MIT (c) 2026 ZyFou)
vec3 vnd(vec2 p){ vec2 i=floor(p), f=fract(p); vec2 u=f*f*f*(f*(f*6.0-15.0)+10.0), du=30.0*f*f*(f*(f-2.0)+1.0);
  float a=h12(i), b=h12(i+vec2(1,0)), c=h12(i+vec2(0,1)), d=h12(i+vec2(1,1));
  return vec3(a+(b-a)*u.x+(c-a)*u.y+(a-b-c+d)*u.x*u.y, du*(vec2(b-a,c-a)+(a-b-c+d)*u.yx)); }
void main(){
  vec3 V=uCam-vW; float dist=length(V); V/=dist; vec3 n=normalize(vN);
  float fine=clamp(1.0-dist/30.0,0.0,1.0)*(0.25+uDetail*0.6); vec2 dg=vec2(0.0); float amp=1.0; vec2 q=vP*14.0;
  for(int i=0;i<3+uLoopGuard;i++){ vec3 r=vnd(q); dg+=r.yz*amp; amp*=0.5; q=mat2(0.8,-0.6,0.6,0.8)*q*2.03; }
  n=normalize(n-vec3(dg.x,0.0,dg.y)*fine*0.06);
  float hn=vW.y/${HSCALE.toFixed(1)}, slope=1.0-n.y, m=vMoist, vary=h12(floor(vP*90.0))*0.06+vnd(vP*6.0).x*0.12;
  int S=int(uStyle+0.5); float seaN=uSea/${HSCALE.toFixed(1)};
  vec3 shore, low, mid, rock, top; float snowAt=0.78, glow=0.0;
  if(S==1){ shore=vec3(0.86,0.72,0.50); low=vec3(0.85,0.62,0.36); mid=vec3(0.76,0.52,0.30); rock=vec3(0.55,0.34,0.22); top=vec3(0.90,0.74,0.52); snowAt=9.0; }
  else if(S==2){ shore=vec3(0.66,0.76,0.84); low=vec3(0.88,0.91,0.95); mid=vec3(0.93,0.95,0.98); rock=vec3(0.36,0.38,0.43); top=vec3(0.97,0.98,1.0); snowAt=0.0; }
  else if(S==3){ shore=vec3(0.36,0.33,0.31); low=vec3(0.33,0.30,0.28); mid=vec3(0.40,0.36,0.33); rock=vec3(0.24,0.21,0.20); top=vec3(0.58,0.56,0.54); snowAt=0.95; }
  else if(S==4){ shore=vec3(1.0,0.55,0.66); low=vec3(0.42,0.25,0.62); mid=vec3(0.30,0.20,0.55); rock=vec3(0.16,0.42,0.48); top=vec3(1.0,0.83,0.42); snowAt=0.85; }
  else { shore=vec3(0.80,0.72,0.55); low=vec3(0.30,0.46,0.17); mid=vec3(0.50,0.52,0.28); rock=vec3(0.40,0.37,0.33); top=vec3(0.95,0.96,0.98); }
  vec3 alb=mix(low,mid,smoothstep(0.35,0.65,m+hn*0.3+vary));
  alb=mix(shore,alb,smoothstep(seaN+0.01,seaN+0.05,hn+vary*0.2));
  alb=mix(alb,rock,smoothstep(0.32,0.55,slope+vary*0.6));
  alb=mix(alb,top,smoothstep(snowAt-0.04,snowAt+0.04,hn+vary-slope*0.5)*(1.0-smoothstep(0.55,0.75,slope)));
  if(S==3) glow=smoothstep(0.15,0.6,vCav)*smoothstep(0.62,0.5,m+vary)*(1.0-smoothstep(seaN+0.25,seaN+0.45,hn));
  alb=lin(alb);
  vec3 L=normalize(uLDir); float nl=dot(n,L), dif=clamp((nl+uLWrap)/(1.0+uLWrap),0.0,1.0)*vSh;
  float occ=clamp(0.75-vCav*0.6,0.25,1.0), day=smoothstep(-0.15,0.35,L.y);
  vec3 sk=skyAt(normalize(n+vec3(0,0.6,0))); vec3 amb=mix(sk,vec3(dot(sk,vec3(0.333))),0.45)*(0.55+0.45*n.y)*occ*0.9;
  vec3 col=alb*(uLCol*dif*2.4*(0.25+0.75*day)+amb);
  vec3 Hh=normalize(L+V); float spec=pow(max(dot(n,Hh),0.0),40.0)*vSh*0.25*(S==2?2.0:0.4); col+=uLCol*spec;
  col+=lin(vec3(1.0,0.35,0.06))*glow*3.0;
  float f=1.0-exp(-max(dist-4.0,0.0)*0.035*uFog); col=mix(col,skyAt(-V),f);
  float edge=smoothstep(${(HALF * FAR).toFixed(1)},${(HALF * FAR * 0.8).toFixed(1)},max(abs(vW.x),abs(vW.z)));
  float a=uBg>0.5?1.0:edge; o=vec4(col*uExpo*a,a); }`;

const W_VS = `#version 300 es
layout(location=0) in vec2 aG; uniform mat4 uVP; uniform float uSea; out vec3 vW;
void main(){ vW=vec3(aG.x*${(HALF * FAR * 4).toFixed(1)},uSea,aG.y*${(HALF * FAR * 4).toFixed(1)}); gl_Position=uVP*vec4(vW,1.0); }`;
const W_FS = `#version 300 es
precision highp float; precision highp int;
in vec3 vW; out vec4 o; uniform vec3 uCam; uniform float uSea, uTime, uStyle;
${HEIGHT}
${SKY}
void main(){
  vec3 V=uCam-vW; float dist=length(V); V/=dist;
  float depth=uSea-terrainH(vW.xz,3); if(depth<=0.0) discard;
  vec2 p=vW.xz*1.3; float t=uTime*0.35; float e=0.05;
  float r0=fbm4(p+vec2(t,t*0.7)), rx=fbm4(p+vec2(e,0)+vec2(t,t*0.7)), rz=fbm4(p+vec2(0,e)+vec2(t,t*0.7));
  vec3 n=normalize(vec3((r0-rx)*0.6,1.0,(r0-rz)*0.6));
  int S=int(uStyle+0.5);
  vec3 deep=S==3?lin(vec3(0.9,0.22,0.03)):S==4?lin(vec3(0.05,0.35,0.30)):S==2?lin(vec3(0.10,0.24,0.34)):lin(vec3(0.04,0.22,0.32));
  vec3 shal=S==3?lin(vec3(1.0,0.6,0.15)):S==4?lin(vec3(0.3,0.9,0.7)):lin(vec3(0.12,0.48,0.52));
  vec3 L=normalize(uLDir); float day=smoothstep(-0.15,0.35,L.y);
  vec3 body=mix(shal,deep,smoothstep(0.0,0.8,depth))*(0.25+0.75*day)*uLCol*(S==3?2.5:1.0)+skyAt(vec3(0,1,0))*0.12;
  float fr=0.02+0.98*pow(1.0-max(dot(n,V),0.0),5.0); vec3 refl=skyAt(reflect(-V,n));
  vec3 col=mix(body,refl,S==3?0.05:fr)+uLCol*pow(max(dot(reflect(-L,n),V),0.0),220.0)*6.0*day;
  float foam=(1.0-smoothstep(0.0,0.06,depth))*(S==3?0.0:0.6); col=mix(col,vec3(0.9)*(0.3+0.7*day),foam);
  float a=clamp(depth*6.0,0.0,1.0)*mix(0.82,1.0,fr); if(S==3) a=clamp(depth*10.0,0.0,1.0);
  float f=1.0-exp(-max(dist-4.0,0.0)*0.035*uFog); col=mix(col,skyAt(-V),f); a=mix(a,1.0,f*uBg);
  o=vec4(col*uExpo*a,a); }`;

const BG_VS = `#version 300 es
layout(location=0) in vec2 aP; out vec2 vU; void main(){ vU=aP; gl_Position=vec4(aP,1.0,1.0); }`;
const BG_FS = `#version 300 es
precision highp float; in vec2 vU; out vec4 o; uniform mat4 uInvVP; uniform vec3 uCam;
${SKY}
void main(){ vec4 h=uInvVP*vec4(vU,1.0,1.0); vec3 d=normalize(h.xyz/h.w-uCam); o=vec4(skyAt(d)*uExpo,1.0); }`;

function prog(vs: string, fs: string) { const p: any = gl.createProgram(); gl.attachShader(p, compile(gl.VERTEX_SHADER, vs)); gl.attachShader(p, compile(gl.FRAGMENT_SHADER, fs)); gl.linkProgram(p);
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p) || 'link'); p.u = {}; return p; }
const Uq = (p: any, n: string) => (n in p.u ? p.u[n] : (p.u[n] = gl.getUniformLocation(p, n)));
let PR: any = null;
function progs() { if (PR) return PR === 'err' ? null : PR;
  try { PR = { land: prog(VS, FS), water: prog(W_VS, W_FS), bg: prog(BG_VS, BG_FS) };
    const q = gl.createVertexArray(); gl.bindVertexArray(q); const b = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, b);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW); gl.enableVertexAttribArray(0); gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0); PR.tri = q;
    const w = gl.createVertexArray(); gl.bindVertexArray(w); const wb = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, wb);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, -1, 1, 1, -1, 1]), gl.STATIC_DRAW); gl.enableVertexAttribArray(0); gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0); PR.quad = w;
    gl.bindVertexArray(null); return PR; }
  catch (e) { console.warn('3D Terep shader:', e); PR = 'err'; R.terrErr = String(e); return null; } }

/** One shared N×N grid per resolution: positions in [-1,1]² (warped outward in the vertex shader). */
const grids = new Map<number, any>();
export function gridOf(N: number) {
  let G = grids.get(N); if (G) return G;
  const V = new Float32Array(N * N * 2); for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) { V[(j * N + i) * 2] = i / (N - 1) * 2 - 1; V[(j * N + i) * 2 + 1] = j / (N - 1) * 2 - 1; }
  const I = new Uint32Array((N - 1) * (N - 1) * 6); let k = 0;
  for (let j = 0; j < N - 1; j++) for (let i = 0; i < N - 1; i++) { const a = j * N + i, b = a + 1, c = a + N, d = c + 1; I[k++] = a; I[k++] = c; I[k++] = b; I[k++] = b; I[k++] = c; I[k++] = d; }
  G = { vao: gl.createVertexArray(), count: I.length, tris: I.length / 3 }; gl.bindVertexArray(G.vao);
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer()); gl.bufferData(gl.ARRAY_BUFFER, V, gl.STATIC_DRAW); gl.enableVertexAttribArray(0); gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer()); gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, I, gl.STATIC_DRAW); gl.bindVertexArray(null);
  grids.set(N, G); return G;
}
/** Seed → noise-domain offset (kept small: large offsets cost float precision in the value noise). */
export const seedOff = (s: number) => [((Math.round(s) * 0.6180339887) % 1) * 97 + 3, ((Math.round(s) * 0.4142135624) % 1) * 89 + 5];
/** Grid size for a quality profile at an output height (4K export gets the denser grid + one more octave). */
export function gridN(q: number, h: number) { const b = QN[Math.max(0, Math.min(2, Math.round(q)))]; return h >= 1800 ? Math.min(1024, b * 2) : b; }

/** Draw the terrain layer into `target` (premultiplied linear RGBA). `light` sets uLDir/uLCol/uLSoftK/uLWrap (render.ts lightU). */
export function drawTerrain(L: any, target: any, ctx: any, t: number, def: any, light: (p: any, L: any, t: number) => void) {
  const pr = progs(); if (!pr) return;
  const T = targets(ctx), C = camOf(L, t, def, ctx.w / ctx.h);
  const P = (k: string) => ev(L.p[k], def.params.find((x: any) => x.k === k), t);
  const q = Math.round(P('qual')), N = gridN(q, ctx.h), G = gridOf(N), oct = [5, 6, 7][Math.max(0, Math.min(2, q))] + (ctx.h >= 1800 ? 1 : 0);
  const so = seedOff(P('seed')), relief = P('relief'), water = P('water'), bgOn = Math.round(P('bg')) > 0;
  const sea = water > 0.001 ? (water * 0.9 - 0.04) * relief * HSCALE : -1e3;
  const common = (p: any) => { gl.useProgram(p); light(p, L, t); gl.uniform3f(Uq(p, 'uCam'), C.eye[0], C.eye[1], C.eye[2]); gl.uniformMatrix4fv(Uq(p, 'uVP'), false, C.VP);
    gl.uniform2f(Uq(p, 'uSeed'), so[0], so[1]); gl.uniform1f(Uq(p, 'uType'), P('ttype')); gl.uniform1f(Uq(p, 'uExt'), P('size')); gl.uniform1f(Uq(p, 'uRelief'), relief);
    gl.uniform1f(Uq(p, 'uPers'), 0.38 + 0.22 * P('detail')); gl.uniform1f(Uq(p, 'uDetail'), P('detail')); gl.uniform1f(Uq(p, 'uStyle'), P('style')); gl.uniform1f(Uq(p, 'uSea'), sea);
    gl.uniform1f(Uq(p, 'uExpo'), P('expo')); gl.uniform1f(Uq(p, 'uFog'), P('fog')); gl.uniform1f(Uq(p, 'uBg'), bgOn ? 1 : 0); gl.uniform1f(Uq(p, 'uTime'), t); };
  gl.bindFramebuffer(gl.FRAMEBUFFER, T.msF); gl.viewport(0, 0, ctx.w, ctx.h); gl.clearColor(0, 0, 0, 0); gl.clearDepth(1); gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.disable(gl.BLEND); gl.disable(gl.CULL_FACE);
  if (bgOn) { const p = pr.bg; common(p); gl.uniformMatrix4fv(Uq(p, 'uInvVP'), false, C.inv); gl.bindVertexArray(pr.tri); gl.drawArrays(gl.TRIANGLES, 0, 3); }
  gl.enable(gl.DEPTH_TEST); gl.depthFunc(gl.LEQUAL);
  { const p = pr.land; common(p); gl.uniform1i(Uq(p, 'uOct'), oct); gl.uniform1f(Uq(p, 'uCell'), 2 * HALF * FAR / (N - 1) * 0.35);
    gl.bindVertexArray(G.vao); gl.drawElements(gl.TRIANGLES, G.count, gl.UNSIGNED_INT, 0); }
  if (sea > -100) { const p = pr.water; common(p); gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA); gl.depthMask(false);
    gl.bindVertexArray(pr.quad); gl.drawArrays(gl.TRIANGLES, 0, 6); gl.depthMask(true); gl.disable(gl.BLEND); }
  gl.bindVertexArray(null); gl.disable(gl.DEPTH_TEST);
  gl.bindFramebuffer(gl.READ_FRAMEBUFFER, T.msF); gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, target.f);
  gl.blitFramebuffer(0, 0, ctx.w, ctx.h, 0, 0, target.w, target.h, gl.COLOR_BUFFER_BIT, gl.NEAREST);
  gl.bindFramebuffer(gl.READ_FRAMEBUFFER, null); gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, null);
  R.terrTris = G.tris;
}
