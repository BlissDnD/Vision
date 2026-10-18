/* E1 · Részecske Forrás ("emitter"): own emitter (point / line / ring / disc / rect / alpha of the image below),
 * drawn as GL points. Stateless: every particle slot's birth time, age and fate come from scene time + a hash,
 * so seek = export = live. The emitter's past placement and the past Mennyiség are read from 32 samples over the
 * last lifetime (moving the layer leaves a trail; an animated rate does not reshuffle the particles). */
import { R } from './runtime';
import { EFFECTS, BASEK } from './effects/index';
import { U, gl, clearTarget, errCache } from './gl';
import { st } from './state';
import { ev } from './evaluation';
import { hexRGB } from './palettes';
import { link2, setPal, bindTex } from './render';
import { placeAt, findPath, pathWorld, resample } from './paths';

const TN = 32, CN = 16, NMAX = 150000;
const D = Object.fromEntries(EFFECTS.emitter.params.map(d => [d.k, d]));
export const emP = (L: any, k: string, t: number) => { const d = D[k], v = L.p[k]; if (!v) return d.def; return d.type === 'sel' ? Math.round(v.v) : d.type === 'color' ? v.v : ev(v, d, t); };
/** Slot layout for the current frame: capacity, spacing, burst grouping. Pure (tests read it too). */
export function emLayout(L: any, t: number) {
  const mode = emP(L, 'mode', t), W = Math.max(.1, emP(L, 'life', t));
  const rates: number[] = []; for (let j = 0; j < TN; j++) rates.push(Math.max(0, emP(L, 'rate', t - W + W * j / (TN - 1))));
  if (mode === 0) {
    let rmax = Math.max(...rates); rmax = rmax <= 0 ? 0 : Math.pow(1.25, Math.ceil(Math.log(rmax) / Math.log(1.25)));   // bucketed: small rate wobble keeps the slots
    let N = Math.ceil(rmax * W); if (N > NMAX) { N = NMAX; rmax = N / W; }
    return { mode, W, N, cap: rmax, M: 0, B: 0, every: 0, rates };
  }
  const every = Math.max(.2, emP(L, 'every', t)), B = mode === 1 ? Math.ceil(W / every) + 1 : CN;
  const M = Math.max(1, Math.min(Math.round(emP(L, 'burst', t)), Math.floor(NMAX / B)));
  return { mode, W, N: M * B, cap: 0, M, B, every, rates };
}
let PROG: any = null;
function prog() {
  if (PROG) return PROG === 'err' ? null : PROG;
  const PV = EFFECTS.emitter.params.map(d => d.type === 'color' ? `uniform vec3 p_${d.k};` : `uniform float p_${d.k};`).join('\n');
  const VS = `#version 300 es
precision highp float;
uniform sampler2D uSrc; uniform vec2 uRes; uniform float uTime; uniform float uHue; uniform float uMaxPS;
uniform vec3 uPA; uniform vec3 uPB; uniform vec3 uPC; uniform vec3 uPD;
uniform vec4 uTr[${TN}]; uniform float uTrR[${TN}]; uniform float uCue[${CN}];
uniform vec2 uPath[128]; uniform float uPathN; uniform vec3 uBg; uniform float uW; uniform float uCap; uniform float uM; uniform float uB; uniform float uEvery;
${PV}
out vec4 vCol; out vec3 vSh;
uniform vec3 uG[16]; uniform float uGOn;
vec3 pal(float t){if(uGOn>0.5){float x=1.0-abs(fract((t+uHue)*0.5)*2.0-1.0);float f=x*15.0;int i=int(min(floor(f),14.0));return mix(uG[i],uG[i+1],f-float(i));}return clamp(uPA+uPB*cos(6.28318530718*(uPC*t+uPD+uHue)),0.0,1.0);}
uint hu(uint x){x^=x>>16;x*=0x7feb352du;x^=x>>15;x*=0x846ca68bu;x^=x>>16;return x;}
float rn(inout uint s){s=hu(s);return float(s>>8)/16777216.0;}
float h1(float n){return fract(sin(n)*43758.5453);}
float n1(float x){float i=floor(x),f=fract(x);f=f*f*(3.0-2.0*f);return mix(h1(i),h1(i+1.0),f)*2.0-1.0;}
float n3(vec3 x){vec3 i=floor(x),f=fract(x);f=f*f*(3.0-2.0*f);float n=i.x+i.y*57.0+i.z*113.0;
  return mix(mix(mix(h1(n),h1(n+1.0),f.x),mix(h1(n+57.0),h1(n+58.0),f.x),f.y),mix(mix(h1(n+113.0),h1(n+114.0),f.x),mix(h1(n+170.0),h1(n+171.0),f.x),f.y),f.z);}
mat2 rot2(float a){float c=cos(a),s=sin(a);return mat2(c,-s,s,c);}
vec4 trAt(float b){float u=clamp((b-(uTime-uW))/uW,0.0,1.0)*${TN - 1}.0;int i=int(floor(u));int j=min(i+1,${TN - 1});return mix(uTr[i],uTr[j],fract(u));}
float trR(float b){float u=clamp((b-(uTime-uW))/uW,0.0,1.0)*${TN - 1}.0;int i=int(floor(u));int j=min(i+1,${TN - 1});return mix(uTrR[i],uTrR[j],fract(u));}
float fk(float a,float k){return k<0.01?a:(1.0-exp(-k*a))/k;}          // ∫ e^{-k s} ds
float gk(float a,float k){return k<0.01?0.5*a*a:(a-fk(a,k))/k;}        // displacement of a constant force under drag
void hide(){gl_Position=vec4(3.0,3.0,0.0,1.0);gl_PointSize=1.0;vCol=vec4(0.0);vSh=vec3(0.0);}
float asp;
vec2 posAt(float a,vec2 p0,vec2 v,float b,float gs){
  vec2 p=p0+v*fk(a,p_drag);
  p.x+=0.5*p_wind*gk(a,p_drag);
  p.x+=p_gust*0.22*(n1((b+a)*0.55+p0.y*0.8)-n1(b*0.55+p0.y*0.8))+p_gust*0.12*a*(n1((b+a)*0.3)+0.6);
  if(p_floor>0.5&&p_grav>0.0&&p0.y>=p_fy){
    float y=p0.y,vy=v.y,r=a,g=p_grav;
    for(int k=0;k<5;k++){float tau=(vy+sqrt(max(vy*vy+2.0*g*(y-p_fy),0.0)))/g;
      if(r<tau){y=y+vy*r-0.5*g*r*r;r=-1.0;break;}
      r-=tau;vy=-(vy-g*tau)*p_bounce;y=p_fy;if(vy<0.02){r=-1.0;break;}}
    p.y=y;
  }else p.y-=p_grav*gk(a,p_drag);
  float tw=smoothstep(0.0,0.6,a)*p_turb*0.16;
  if(tw>0.0){vec3 q=vec3(p*p_tscale,(b+a)*0.35);p+=tw*vec2(n3(q)-0.5,n3(q+vec3(17.0,31.0,5.0))-0.5)*2.0;}
  if(p_floor>0.5)p.y=max(p.y,p_fy);
  return p;}
void main(){
  asp=uRes.x/uRes.y;int id=gl_VertexID;float fid=float(id);
  float b,cyc;
  if(p_mode<0.5){float ph=fid/max(uCap,1e-6);cyc=floor((uTime-ph)/uW);b=ph+cyc*uW;}
  else{int j=id/int(uM);float bt;
    if(p_mode<1.5){float m0=floor(uTime/uEvery);float m=m0-mod(m0-float(j),uB);if(m<0.0){hide();return;}bt=m*uEvery;cyc=m;}
    else{bt=uCue[j];cyc=float(j)+floor(bt*61.0);if(bt<-1e8){hide();return;}}
    b=bt;}
  float a=uTime-b;
  uint s=hu(uint(id)*1973u+hu(uint(int(cyc)+100000))*9277u+uint(p_seed)*26699u);
  float rL=rn(s),rR=rn(s);
  float life=uW*(1.0-p_lifevar*rL);
  if(a<0.0||a>=life){hide();return;}
  if(p_mode<0.5&&rR>=trR(b)){hide();return;}
  if(p_warm>0.5&&b<0.0){hide();return;}
  vec4 T=trAt(b);float sc=T.z,rot=radians(T.w);
  float r1=rn(s),r2=rn(s),r3=rn(s),r4=rn(s);
  vec2 sp=vec2(0.0),out0=vec2(0.0);vec2 p0;vec3 srcCol=vec3(1.0);bool got=true;
  int shp=int(p_shape+0.5);
  if(shp==5){got=false;for(int k=0;k<16;k++){vec2 uv=vec2(rn(s),rn(s));vec4 c=textureLod(uSrc,uv,0.0);
      if(c.a>0.35&&distance(c.rgb/max(c.a,1e-3),uBg)>0.12){p0=(uv-0.5)*vec2(asp,1.0);srcCol=c.rgb/max(c.a,1e-3);got=true;break;}}
    if(!got){hide();return;}out0=normalize(p0+vec2(1e-4,0.0));}
  else if(shp==6){if(uPathN<2.0){hide();return;}float f=r1*(uPathN-1.0);int i=int(floor(f));int j=min(i+1,int(uPathN)-1);vec2 A=uPath[i],B=uPath[j];p0=mix(A,B,fract(f));
    vec2 tg=B-A;out0=length(tg)>1e-6?normalize(vec2(-tg.y,tg.x)):vec2(0.0,1.0);if(r2<0.5)out0=-out0;
    vec2 uv=p0/vec2(asp,1.0)+0.5;vec4 c=textureLod(uSrc,uv,0.0);srcCol=c.a>0.01?c.rgb/c.a:vec3(0.6);}
  else{
    if(shp==1)sp=vec2((r1-0.5)*p_ew,0.0);
    else if(shp==2){float an=r1*6.28318;sp=vec2(cos(an),sin(an))*p_ew*0.5;}
    else if(shp==3){float an=r1*6.28318;sp=vec2(cos(an),sin(an))*sqrt(r2)*p_ew*0.5;}
    else if(shp==4)sp=vec2((r1-0.5)*p_ew,(r2-0.5)*p_eh);
    out0=length(sp)>1e-5?normalize(rot2(rot)*sp):vec2(cos(radians(p_dir)-rot),sin(radians(p_dir)-rot));
    p0=T.xy+rot2(rot)*(sp*sc);
    vec2 uv=p0/vec2(asp,1.0)+0.5;vec4 c=textureLod(uSrc,uv,0.0);srcCol=c.a>0.01?c.rgb/c.a:vec3(0.6);}
  float an=radians(p_dir)-rot+radians(p_spread)*(r3-0.5);
  float spd=p_speed*max(0.0,1.0+p_speedvar*(r4-0.5)*2.0);
  vec2 v=mix(vec2(cos(an),sin(an)),out0,p_radial)*spd;
  vec2 p=posAt(a,p0,v,b,sc);
  float l01=a/life;
  float r5=rn(s),r6=rn(s),r7=rn(s),r8=rn(s),r9=rn(s);
  float sz=p_size*max(0.05,1.0+p_sizevar*(r5-0.5)*2.0)*mix(1.0,p_sizeEnd,l01)*sc;
  float px=sz*uRes.y/540.0;
  float al=smoothstep(0.0,0.06,l01)*(1.0-smoothstep(1.0-max(p_fade,0.001),1.0,l01));
  int lk=int(p_look+0.5);
  float ang=r7*6.28318+p_spin*a*(r8-0.5)*2.0,flip=cos(p_spin*a*1.3*(0.5+r9)+r9*6.28318),len=0.0;
  if(lk==3){vec2 q=posAt(a+0.03,p0,v,b,sc)-p;float L=length(q)/0.03*uRes.y*0.045;ang=atan(q.y,q.x);len=min(L,px*10.0);}
  if(lk==5)p.x+=sin(a*3.0+r9*6.28)*0.015*p_spin*0.3;
  float ps=min(uMaxPS,max(1.0,max(px,len+px)));
  gl_Position=vec4(p/vec2(asp,1.0)*2.0,0.0,1.0);gl_PointSize=ps;
  vec3 col=p_color<0.5?pal(r6):p_color<1.5?pal(l01*0.85+r6*0.08):p_color<2.5?p_c1:srcCol;
  if(lk==6)al*=0.16;
  vCol=vec4(col*p_bright,al);
  vSh=vec3(ang,lk==3?(len+px)/ps:flip,px/ps);}`;
  const FS = `#version 300 es
precision highp float; in vec4 vCol; in vec3 vSh; out vec4 o; uniform float p_look;
mat2 rot2(float a){float c=cos(a),s=sin(a);return mat2(c,-s,s,c);}
void main(){vec2 q=gl_PointCoord-0.5;q.y=-q.y;int lk=int(p_look+0.5);float r=length(q),a;vec3 c=vCol.rgb;
  if(lk==0)a=1.0-smoothstep(0.1,0.5,r);
  else if(lk==1)a=1.0-smoothstep(0.44,0.5,r);
  else if(lk==2){a=clamp(exp(-r*r*40.0)*1.8+exp(-r*7.0)*0.6,0.0,1.0);c=mix(c,vec3(1.0),exp(-r*r*120.0)*0.8);}
  else if(lk==3){vec2 u=rot2(-vSh.x)*q;float h=max(vSh.y*0.5-vSh.z*0.5,0.0);float w=vSh.z*0.5;float d=length(vec2(max(abs(u.x)-h,0.0),u.y));
    a=1.0-smoothstep(w*0.3,w,d);a*=0.55+0.45*clamp(u.x/max(h,1e-3)*0.5+0.5,0.0,1.0);}
  else if(lk==4){vec2 u=rot2(-vSh.x)*q;float fx=max(abs(vSh.y),0.08);vec2 e=vec2(0.42*fx,0.24);vec2 d=abs(u)-e;a=1.0-smoothstep(-0.02,0.02,max(d.x,d.y));c*=0.75+0.25*sign(vSh.y);}
  else if(lk==5){vec2 u=rot2(-vSh.x)*q;u.x/=max(abs(vSh.y),0.15);float d=max(length(u-vec2(0.0,0.3)),length(u+vec2(0.0,0.3)))-0.52;
    a=1.0-smoothstep(-0.03,0.01,d);c*=(vSh.y>0.0?1.0:0.7)*(0.85+0.3*u.y);if(abs(u.x)<0.02&&abs(u.y)<0.4)c*=0.75;}
  else a=exp(-r*r*10.0)*(1.0-smoothstep(0.35,0.5,r));
  a*=vCol.a;if(a<0.002)discard;o=vec4(c*a,a);}`;
  try { PROG = link2(VS, FS); } catch (e: any) { console.warn('Shader: emitter', e.message); PROG = 'err'; errCache.set('emitter', String(e.message)); return null; }
  return PROG;
}
let maxPS = 0;
/** Cue times ≤ t (latest CN), padded with -1e9. */
export function emCues(t: number) { const c = (st.cues || []).map((x: any) => x.t).filter((x: number) => x <= t).sort((a: number, b: number) => a - b).slice(-CN); while (c.length < CN) c.unshift(-1e9); return c; }
export function drawEmitter(L: any, target: any, ctx: any, t: number, inTex: any) {
  clearTarget(target); const p = prog(); if (!p) { R.emErr = errCache.get('emitter'); return; }
  const Y = emLayout(L, t); R.emN = Y.N; if (!Y.N) return;
  if (!maxPS) maxPS = (gl.getParameter(gl.ALIASED_POINT_SIZE_RANGE) || [1, 64])[1];
  gl.bindFramebuffer(gl.FRAMEBUFFER, target.f); gl.viewport(0, 0, ctx.w, ctx.h); gl.useProgram(p);
  const tr = new Float32Array(TN * 4), trr = new Float32Array(TN);
  for (let j = 0; j < TN; j++) { const tj = t - Y.W + Y.W * j / (TN - 1), [x, y, sc, rot] = placeAt(L, tj); tr.set([x, y, sc, rot], j * 4); trr[j] = Y.cap > 0 ? Y.rates[j] / Y.cap : 1; }
  gl.uniform4fv(U(p, 'uTr'), tr); gl.uniform1fv(U(p, 'uTrR'), trr); gl.uniform1fv(U(p, 'uCue'), new Float32Array(emCues(t)));
  { const bg = hexRGB(st.bg); gl.uniform3f(U(p, 'uBg'), bg[0], bg[1], bg[2]); }
  gl.uniform1f(U(p, 'uW'), Y.W); gl.uniform1f(U(p, 'uCap'), Y.cap); gl.uniform1f(U(p, 'uM'), Y.M); gl.uniform1f(U(p, 'uB'), Y.B); gl.uniform1f(U(p, 'uEvery'), Y.every);
  gl.uniform2f(U(p, 'uRes'), ctx.w, ctx.h); gl.uniform1f(U(p, 'uTime'), t); gl.uniform1f(U(p, 'uMaxPS'), maxPS);
  setPal(p, L.pal || 0, L); gl.uniform1f(U(p, 'uHue'), ev(L.n.hue, BASEK.hue, t));
  for (const d of EFFECTS.emitter.params) { const v = emP(L, d.k, t); if (d.type === 'color') { const c = hexRGB(v); gl.uniform3f(U(p, 'p_' + d.k), c[0], c[1], c[2]); } else gl.uniform1f(U(p, 'p_' + d.k), v); }
  { const pl = new Float32Array(256); let pn = 0; const PL = emP(L, 'shape', t) === 6 && L.path ? findPath(L.path) : null; const W = PL && pathWorld(PL, t);
    if (W && W.A.len > 1e-6) { const q = resample(W.poly, 128); q.forEach((v, i) => { pl[i * 2] = v[0]; pl[i * 2 + 1] = v[1]; }); pn = 128; }
    gl.uniform2fv(U(p, 'uPath'), pl); gl.uniform1f(U(p, 'uPathN'), pn); }
  bindTex(0, inTex); gl.uniform1i(U(p, 'uSrc'), 0);
  gl.enable(gl.BLEND); if (emP(L, 'pblend', t) === 0) gl.blendFunc(gl.ONE, gl.ONE); else gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
  gl.drawArrays(gl.POINTS, 0, Y.N); gl.disable(gl.BLEND);
}
EFFECTS.emitter.draw = drawEmitter;
