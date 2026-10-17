import type { Camera } from './types';
import { R } from './runtime';
import { $, h } from './dom';
import { EASE_NAMES, PALS, hexRGB, v3 } from './palettes';
import { BASEK, BENTO, BLEND_IDX, EFFECTS, S, kindOf } from './effects/index';
import { BLANK, COMP, COPY, DOWN, NULLP, PLACEHOLDER, POST, U, UPS, XFORM, clearTarget, compile, cv, errCache, freeCtx, freeTarget, getProg, gl, mkCtx, mkSet, mkTarget } from './gl';
import { LIGHTP, imgTex, makeLayer, mkN, st } from './state';
import { ev, hasK } from './evaluation';
import { mediaFor } from './text';
import { blobPrep } from './blob';
import { drawMesh } from './mesh3d';
import { ctlSlider, ctlSwitch } from './controls';
import { commit } from './history';
import { fitCanvas } from './stage';
import { renderTimeline } from './timeline';
import { markDirty } from './loop';
import { openPop } from './popovers';

export function bindTex(u,t){gl.activeTexture(gl.TEXTURE0+u);gl.bindTexture(gl.TEXTURE_2D,t||BLANK);}
export function setXform(p,L,t){const n=L.n,B=behav(L,t);let ox=ev(n.x,BASEK.x,t),oy=ev(n.y,BASEK.y,t),sc=Math.max(.01,ev(n.s,BASEK.s,t));
  if(B){ox+=B.dx;oy+=B.dy;sc*=Math.max(.001,B.sc);}
  let rot=ev(n.r,BASEK.r,t)+n.spin.v*t;if(R.CAMON&&L.type!=='group'&&kindOf(L)!=='fx')[ox,oy,sc,rot]=camApply(L,t,ox,oy,sc,rot);
  gl.uniform2f(U(p,'uOff'),ox,oy);gl.uniform1f(U(p,'uScale'),Math.max(1e-4,sc));
  gl.uniform1f(U(p,'uRot'),rot*Math.PI/180);}
/* ----- 2.5D camera: per-layer depth (n.z), parallax + depth of field on top-level layers ----- */
export const CAMP=[S('x','Kamera X',-3,3,0),S('y','Kamera Y',-2,2,0),S('zoom','Zoom',.2,5,1),S('f','Fókusztáv (látószög)',.5,8,2.5),S('focus','Élességi sík (Z)',-1.5,8,0),S('ap','Mélységélesség (blende)',0,3,0),S('roll','Döntés °',-45,45,0)];
export const CAMK=Object.fromEntries(CAMP.map(d=>[d.k,d]));
export function mkCam():Camera{const n={};for(const d of CAMP)n[d.k]=mkN(d.def);return <Camera>{id:'__cam',name:'Kamera',type:'cam',vis:true,on:false,n,p:{}};}
export function normCam(o){const c=mkCam();if(!o)return c;c.on=!!o.on;for(const d of CAMP)if(o.n&&o.n[d.k])c.n[d.k]=mkN(o.n[d.k]);return c;}
R.CAMON=false;
export function camXf(L,t){if(!R.CAMON||!L)return null;const C=st.cam.n,E=k=>ev(C[k],CAMK[k],t);const z=ev(L.n.z,BASEK.z,t),f=Math.max(.2,E('f'));const den=f+z;
  const k=den>.05?f/den:0;const zoom=Math.max(.05,E('zoom'));const ap=E('ap');const foc=E('focus');
  return {k,zoom,cx:E('x'),cy:E('y'),roll:E('roll'),hide:den<=.05,blur:Math.min(10,ap*Math.abs(z-foc)*k*1.6)};}
export function camApply(L,t,ox,oy,sc,rot){const c=camXf(L,t);if(!c)return [ox,oy,sc,rot];const m=c.k*c.zoom;let x=(ox-c.cx)*m,y=(oy-c.cy)*m;
  if(c.roll){const a=-c.roll*Math.PI/180,ca=Math.cos(a),sa=Math.sin(a);[x,y]=[x*ca-y*sa,x*sa+y*ca];}return [x,y,sc*m,rot-c.roll];}
export const dofCache=new Map();
export function dofLayer(id,r){let F=dofCache.get(id);if(!F){F=makeLayer('blur');dofCache.set(id,F);}F.p.radius.v=r;return F;}
export function openCam(anchor){
  const C=st.cam;const on=ctlSwitch('Kamera bekapcsolva',C.on,v=>{C.on=v;commit();renderTimeline();});
  const sl=CAMP.map(d=>ctlSlider(C.n[d.k],d,{onInput:markDirty}));
  openPop(anchor,h('div',{class:'pl'},'Kamera · 2,5D tér'),h('div',{class:'pc'},on,...sl,
    h('p',{class:'small'},'Minden réteg Elhelyezés szekciójában van egy Mélység (Z) érték: 0 a képsík, a pozitív hátrébb, a negatív előrébb van. Kameramozgásnál a távoli rétegek lassabban mozognak (parallaxis), a blende az élességi síktól távoli rétegeket elmossa. A ◆ gombokkal a kamera is kulcskockázható, a Sávok panelen külön sora van.')));}
st.cam=mkCam();
/* ----- behaviours (enter / exit) ----- */
export const easeSpringJ=(x,z,w)=>{if(x>=1)return 1;const wd=w*Math.sqrt(1-z*z);return 1-Math.exp(-z*w*x)*(Math.cos(wd*x)+(z*w/wd)*Math.sin(wd*x));};
export const easeBounceJ=x=>{const n=7.5625,d=2.75;if(x<1/d)return n*x*x;if(x<2/d){x-=1.5/d;return n*x*x+.75;}if(x<2.5/d){x-=2.25/d;return n*x*x+.9375;}x-=2.625/d;return n*x*x+.984375;};
export const EASE_FNS:((x:number)=>number)[]=[x=>1-Math.pow(1-x,3),x=>x>=1?1:1-Math.pow(2,-10*x),x=>x>=1?1:1-Math.exp(-6*x)*Math.cos(9*x),x=>x<.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2,x=>x,
 x=>easeSpringJ(x,.55,10),x=>easeSpringJ(x,.32,14),x=>{const c1=1.70158,c3=c1+1;return 1+c3*Math.pow(x-1,3)+c1*Math.pow(x-1,2);},
 x=>x<=0?0:x>=1?1:Math.pow(2,-10*x)*Math.sin((x*10-.75)*2.0943951)+1,easeBounceJ,x=>x<=0?0:x>=1?1:x<.5?Math.pow(2,20*x-10)/2:(2-Math.pow(2,-20*x+10))/2,x=>Math.min(1,Math.floor(x*6)/5)];
export const EASES:[string,(x:number)=>number][]=EASE_NAMES.map((n,i)=>[n,(x:number)=>EASE_FNS[i](Math.min(1,Math.max(0,x)))]);
export const easeJ=(k,x)=>(EASES[Math.round(k)]||EASES[0])[1](x);
export const MOVES=['Nincs','Átúszás','Emelkedés','Süllyedés','Balról','Jobbról','Ráközelítés','Távolodás','Pattanás'];
export function moveFx(type,e){const r={op:1,dx:0,dy:0,sc:1};if(!type)return r;const u=1-e,o=Math.max(0,Math.min(1,e*1.5));
  switch(type){case 1:r.op=Math.max(0,Math.min(1,e));break;case 2:r.op=o;r.dy=-u*.12;break;case 3:r.op=o;r.dy=u*.12;break;case 4:r.op=o;r.dx=-u*.35;break;case 5:r.op=o;r.dx=u*.35;break;
    case 6:r.op=o;r.sc=.7+.3*e;break;case 7:r.op=o;r.sc=1.4-.4*e;break;case 8:r.op=Math.max(0,Math.min(1,e*3));r.sc=Math.max(.001,e);break;}return r;}
export function behav(L,t){const T=L.tm;if(!T||(!T.in&&!T.out))return null;const E=(EASES[T.ease|0]||EASES[0])[1];let a={op:1,dx:0,dy:0,sc:1};
  if(T.in){const x=Math.min(1,Math.max(0,(t-T.inAt)/Math.max(.01,T.inDur)));a=moveFx(T.in,E(x));if(t<T.inAt)a.op=0;}
  if(T.out){const x=Math.min(1,Math.max(0,(t-T.outAt)/Math.max(.01,T.outDur)));if(x>0){const b=moveFx(T.out,1-E(x));a.op*=b.op;a.dx+=b.dx;a.dy+=b.dy;a.sc*=b.sc;}}
  return a;}
/* ----- Bento grid: per-box rects computed in JS (spring morph + staggered entrances) ----- */
export const BENTO_PD=Object.fromEntries(EFFECTS.bento.params.map(p=>[p.k,p]));
export function bentoRects(li,bw,bh,gap){const Lr=(BENTO[li]||BENTO[0])[1];
  return Lr.map(([x,y,w,hh])=>[-bw/2+(x+w/2)*bw,bh/2-(y+hh/2)*bh,Math.max(0,w*bw/2-gap/2),Math.max(0,hh*bh/2-gap/2)]);}
export function bentoBoxes(L,t){
  const V=k=>{const d=BENTO_PD[k];return d.type==='sel'?Math.round(L.p[k].v):ev(L.p[k],d,t);};
  const bw=V('bw'),bh=V('bh'),gap=V('gap'),ease=V('ease');
  const A=bentoRects(V('layout'),bw,bh,gap);let R=A.map(r=>r.slice());
  const l2=V('layout2');
  if(l2>0){const B=bentoRects(l2-1,bw,bh,gap);const m=easeJ(ease,(t-V('morphAt'))/Math.max(.01,V('morphDur')));const n=Math.max(A.length,B.length);R=[];
    for(let i=0;i<n;i++){const a=A[i],b=B[i];
      if(a&&b)R.push(a.map((v,k)=>v+(b[k]-v)*m));
      else if(a)R.push([a[0],a[1],Math.max(0,a[2]*(1-m)),Math.max(0,a[3]*(1-m))]);
      else R.push([b[0],b[1],Math.max(0,b[2]*m),Math.max(0,b[3]*m)]);}}
  const N=Math.min(9,R.length);const order=V('order');let keys;
  if(order===1){const ds=R.map((r,i)=>[Math.hypot(r[0],r[1]),i]).sort((a,b)=>a[0]-b[0]);keys=new Array(N);ds.forEach(([_,i],k)=>keys[i]=k);}
  else if(order===2){const rs=R.map((r,i)=>[((Math.sin((i+1)*12.9898)*43758.5453)%1+1)%1,i]).sort((a,b)=>a[0]-b[0]);keys=new Array(N);rs.forEach(([_,i],k)=>keys[i]=k);}
  else if(order===3)keys=R.map(()=>0);
  else if(order===4){const rs=R.map((r,i)=>[-r[2]*r[3],i]).sort((a,b)=>a[0]-b[0]);keys=new Array(N);rs.forEach(([_,i],k)=>keys[i]=k);}
  else keys=R.map((_,i)=>i);
  const start=V('start'),dur=Math.max(.01,V('dur')),stag=V('stagger'),anim=V('anim'),outAt=V('outAt');
  const out=[];
  for(let i=0;i<N;i++){let [cx,cy,hw,hh]=R[i];const k=keys[i]||0;
    const x=Math.min(1,Math.max(0,(t-start-k*stag)/dur));let e=anim===7?1:easeJ(ease,x);let al=anim===7?1:Math.min(1,x*4);
    if(outAt>0){const xo=Math.min(1,Math.max(0,(t-outAt-k*stag)/dur));if(xo>0){e*=1-easeJ(ease,xo);if(xo>=1)al=0;}}
    if(t<start+k*stag&&anim!==7)al=0;
    const ep=Math.max(0,e);
    switch(anim){
      case 0:hh*=ep;break;
      case 1:hw*=ep;hh*=ep;break;
      case 2:cy-=(1-e)*(bh*.6+.25);break;
      case 3:cx-=(1-e)*(bw*.55+.25);break;
      case 4:{const n=hw*ep;cx=cx-hw+n;hw=n;break;}
      case 5:{const n=hh*ep;cy=cy-hh+n;hh=n;break;}
      case 6:al*=Math.min(1,ep);break;}
    out.push([cx,cy,Math.max(0,hw),Math.max(0,hh),al]);}
  return out;}
export function bentoU(p,L,t){const B=bentoBoxes(L,t);const R=new Float32Array(36),S2=new Float32Array(36);
  B.forEach((b,i)=>{R.set(b.slice(0,4),i*4);S2[i*4]=b[4];});
  gl.uniform4fv(U(p,'uBR'),R);gl.uniform4fv(U(p,'uBS'),S2);gl.uniform1f(U(p,'uBN'),B.length);}
EFFECTS.bento.setU=bentoU;
/** Scene light → obj3d / sdfscene uniforms. Light off (globally or for the layer): the old fixed studio key. */
const LDEF={az:-39.81,el:45.58,soft:.5,size:0,warm:0,pow:1};
const dirAE=(az,el)=>{const a=az*Math.PI/180,e=el*Math.PI/180;return [Math.cos(e)*Math.sin(a),Math.sin(e),Math.cos(e)*Math.cos(a)];};
export function lightVals(L,t){const on=st.light&&st.light.on&&(!L.p.sceneL||Math.round(L.p.sceneL.v)>0);if(!on)return {...LDEF};
  const o:any={};for(const d of LIGHTP)o[d.k]=ev(st.light.p[d.k],d,t);return o;}
export function lightU(p,L,t){const v=lightVals(L,t),off=v.az===LDEF.az&&v.el===LDEF.el;
  const d=off?[-0.447214,0.715542,0.536656]:dirAE(v.az,v.el);
  const e0=[-0.6,0.6,0.55],el0=Math.asin(e0[1]/Math.hypot(...e0))*180/Math.PI,az0=Math.atan2(e0[0],e0[2])*180/Math.PI;   // studio glint keeps its offset from the key
  const e=off?e0.map(x=>x/Math.hypot(...e0)):dirAE(az0+v.az-LDEF.az,Math.max(-10,Math.min(89,el0+v.el-LDEF.el)));
  const w=v.warm,c=[1+Math.max(-w,0)*-.2,.97+Math.max(w,0)*-.12+Math.max(-w,0)*-.03,.92+Math.max(w,0)*-.3+Math.max(-w,0)*.08].map(x=>x*v.pow);
  gl.uniform3f(U(p,'uLDir'),d[0],d[1],d[2]);gl.uniform3f(U(p,'uLEnv'),e[0],e[1],e[2]);gl.uniform3f(U(p,'uLCol'),c[0],c[1],c[2]);
  gl.uniform1f(U(p,'uLSoftK'),v.soft<=.5?16-12*v.soft:10-16*(v.soft-.5));gl.uniform1f(U(p,'uLWrap'),Math.max(0,v.soft-.5)*1.6);gl.uniform1f(U(p,'uLSize'),v.size);}
EFFECTS.obj3d.setU=lightU;
EFFECTS.sdfscene.setU=(p,L,t)=>{lightU(p,L,t);const P=(L.prims||[]).slice(0,8);const A=new Float32Array(32),B=new Float32Array(32),C=new Float32Array(32);
  P.forEach((o,i)=>{A.set([o.x,o.y,o.z,o.t],i*4);B.set([o.sx,o.sy,o.sz,o.op],i*4);C.set([o.ry*Math.PI/180,o.rx*Math.PI/180,o.k,o.c],i*4);});
  gl.uniform4fv(U(p,'uA'),A);gl.uniform4fv(U(p,'uB'),B);gl.uniform4fv(U(p,'uC'),C);gl.uniform1f(U(p,'uN'),P.length);};
/* ----- particles: GL points sampled from a texture ----- */
R.PPROG=null;
export function link2(vs,fs){const p=gl.createProgram();gl.attachShader(p,compile(gl.VERTEX_SHADER,vs));gl.attachShader(p,compile(gl.FRAGMENT_SHADER,fs));gl.linkProgram(p);if(!gl.getProgramParameter(p,gl.LINK_STATUS))throw new Error(gl.getProgramInfoLog(p)||'link error');p.u={};return p;}
/** Palette as 4 uniforms (IQ cosine palette) instead of a per-pixel branch over every palette. */
export function setPal(p,i){const P=PALS[i]||PALS[0];gl.uniform3fv(U(p,'uPA'),P.a);gl.uniform3fv(U(p,'uPB'),P.b);gl.uniform3fv(U(p,'uPC'),P.c);gl.uniform3fv(U(p,'uPD'),P.d);}
export function particleProg(){
  if(R.PPROG)return R.PPROG==='err'?null:R.PPROG;
  const PALFN=`uniform vec3 uPA; uniform vec3 uPB; uniform vec3 uPC; uniform vec3 uPD;
vec3 pal(float t){return clamp(uPA+uPB*cos(6.28318530718*(uPC*t+uPD+uHue)),0.0,1.0);}`;
  const VSP=`#version 300 es
precision highp float;
uniform sampler2D uSrc; uniform vec2 uGrid; uniform vec2 uRes; uniform float uTime; uniform vec2 uOff; uniform float uScale; uniform float uRot; uniform float uPal; uniform float uHue; uniform float uAspI;
${EFFECTS.particles.params.map(d=>`uniform float p_${d.k};`).join('\n')}
out vec4 vCol;
${PALFN}
float hsh(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}
float h1(float n){return fract(sin(n)*43758.5453);}
float n3(vec3 x){vec3 i=floor(x),f=fract(x);f=f*f*(3.0-2.0*f);float n=i.x+i.y*57.0+i.z*113.0;
  return mix(mix(mix(h1(n),h1(n+1.0),f.x),mix(h1(n+57.0),h1(n+58.0),f.x),f.y),mix(mix(h1(n+113.0),h1(n+114.0),f.x),mix(h1(n+170.0),h1(n+171.0),f.x),f.y),f.z);}
mat2 rot2(float a){float c=cos(a),s=sin(a);return mat2(c,-s,s,c);}
void main(){
  int gx=int(uGrid.x); int id=gl_VertexID; vec2 cell=vec2(float(id%gx),float(id/gx)); vec2 uv=(cell+0.5)/uGrid;
  vec4 c=textureLod(uSrc,uv,0.0); vec3 col=c.a>0.0001?c.rgb/c.a:vec3(0.0); float l=dot(col,vec3(0.299,0.587,0.114))*c.a;
  if(c.a<0.02||l<p_thresh){gl_Position=vec4(3.0,3.0,0.0,1.0);gl_PointSize=1.0;vCol=vec4(0.0);return;}
  float t=uTime*p_speed; float h=hsh(uv*91.7+3.1);
  vec3 pos=vec3((uv.x-0.5)*uAspI,uv.y-0.5,(l-0.5)*p_depth);
  vec3 rnd=normalize(vec3(hsh(uv+1.3),hsh(uv+2.7),hsh(uv+5.1))-0.5+vec3(1e-4));
  pos+=(rnd*0.7+normalize(pos+vec3(1e-4))*0.5)*p_explode*(0.4+h);
  vec3 q=pos*2.5; pos+=(vec3(n3(q+vec3(0.0,0.0,t*0.3)),n3(q+vec3(17.0,3.0,t*0.3)),n3(q+vec3(5.0,31.0,-t*0.3)))-0.5)*p_swirl*0.35;
  pos.z+=sin(pos.x*7.0+t*2.0)*cos(pos.y*5.0-t*1.3)*p_wave*0.08;
  pos+=(vec3(hsh(uv+fract(t*7.0)),hsh(uv+fract(t*5.0)+0.3),0.5)-0.5)*p_jitter*0.02;
  pos.xz=rot2(radians(p_turn)+t*p_spin)*pos.xz; pos.yz=rot2(radians(p_tilt))*pos.yz;
  float persp=2.4/max(2.4-pos.z,0.2); vec2 sp=pos.xy*persp;
  sp=rot2(uRot)*(sp*uScale)+uOff;
  gl_Position=vec4(sp/vec2(uRes.x/uRes.y,1.0)*2.0,0.0,1.0);
  gl_PointSize=max(1.0,p_size*uRes.y/540.0*persp*(0.6+0.8*h)*uScale);
  vec3 cc=p_color<0.5?col:pal(l*0.8+h*0.15+t*0.03);
  vCol=vec4(cc*p_bright,1.0);}`;
  const FSP=`#version 300 es
precision highp float; in vec4 vCol; out vec4 o;
void main(){vec2 q=gl_PointCoord-0.5; float a=(1.0-smoothstep(0.25,0.5,length(q)))*vCol.a; o=vec4(vCol.rgb*a,a);}`;
  try{R.PPROG=link2(VSP,FSP);}catch(e){console.warn('Shader: particles',e.message);R.PPROG='err';errCache.set('particles',String(e.message));return null;}
  return R.PPROG;}
export function drawPoints(L,target,ctx,t,inTex){
  clearTarget(target);const p=particleProg();if(!p)return;const def=EFFECTS[L.type];
  gl.bindFramebuffer(gl.FRAMEBUFFER,target.f);gl.viewport(0,0,ctx.w,ctx.h);gl.useProgram(p);
  let tex,asp;if(Math.round(L.p.source.v)===1){const m=(L.asset&&imgTex.get(L.asset))||PLACEHOLDER;tex=m.tex;asp=m.w/m.h;}else{tex=inTex;asp=ctx.w/ctx.h;}
  const N=[256,384,512][Math.round(L.p.density.v)]||256;const gx=Math.max(8,Math.round(N*Math.sqrt(asp))),gy=Math.max(8,Math.round(N/Math.sqrt(asp)));
  gl.uniform2f(U(p,'uGrid'),gx,gy);gl.uniform2f(U(p,'uRes'),ctx.w,ctx.h);gl.uniform1f(U(p,'uTime'),t);gl.uniform1f(U(p,'uAspI'),asp);setXform(p,L,t);
  setPal(p,L.pal||0);gl.uniform1f(U(p,'uHue'),ev(L.n.hue,BASEK.hue,t));
  for(const d of def.params){const v=L.p[d.k];gl.uniform1f(U(p,'p_'+d.k),v?(d.type==='sel'?v.v:ev(v,d,t)):d.def);}
  bindTex(0,tex);gl.uniform1i(U(p,'uSrc'),0);
  gl.enable(gl.BLEND);if(Math.round(L.p.pblend.v)===0)gl.blendFunc(gl.ONE,gl.ONE);else gl.blendFunc(gl.ONE,gl.ONE_MINUS_SRC_ALPHA);
  gl.drawArrays(gl.POINTS,0,gx*gy);gl.disable(gl.BLEND);}
export function drawFx(L,target,ctx,t,inTex,prevTex,pass){
  const def=EFFECTS[L.type];const p=getProg(L)||NULLP;
  gl.bindFramebuffer(gl.FRAMEBUFFER,target.f);gl.viewport(0,0,ctx.w,ctx.h);gl.useProgram(p);
  gl.uniform2f(U(p,'uRes'),ctx.w,ctx.h);gl.uniform1f(U(p,'uTime'),t);gl.uniform1f(U(p,'uPass'),pass||0);setXform(p,L,t);
  setPal(p,L.pal||0);gl.uniform1f(U(p,'uHue'),ev(L.n.hue,BASEK.hue,t));
  for(const d of def.params){const v=L.p[d.k];if(d.type==='color'){const c=hexRGB(v?v.v:d.def);gl.uniform3f(U(p,'p_'+d.k),c[0],c[1],c[2]);}
    else gl.uniform1f(U(p,'p_'+d.k),v?(d.type==='sel'?v.v:ev(v,d,t)):d.def);}
  const m=mediaFor(L);bindTex(0,inTex);bindTex(1,prevTex);bindTex(2,m&&m.tex);
  gl.uniform1i(U(p,'uInput'),0);gl.uniform1i(U(p,'uPrev'),1);gl.uniform1i(U(p,'uImage'),2);gl.uniform2f(U(p,'uImgSize'),m?m.w:1,m?m.h:1);
  bindTex(3,m&&m.aux);gl.uniform1i(U(p,'uAux'),3);{const I=m&&m.info?m.info:[0,0,0,0],G=m&&m.geo?m.geo:[1,0,1,1];gl.uniform4f(U(p,'uAuxInfo'),I[0],I[1],I[2]||0,0);gl.uniform4f(U(p,'uAux2'),G[0],G[1],G[2],G[3]);}
  if(def.setU)def.setU(p,L,t);
  gl.drawArrays(gl.TRIANGLES,0,3);}
export function copyTo(srcTex,target){gl.bindFramebuffer(gl.FRAMEBUFFER,target.f);gl.viewport(0,0,target.w,target.h);gl.useProgram(COPY);bindTex(0,srcTex);gl.uniform1i(U(COPY,'uSrc'),0);gl.drawArrays(gl.TRIANGLES,0,3);}
export function histFor(ctx,id){let x=ctx.hist.get(id);if(!x){x={cur:mkTarget(ctx.w,ctx.h),next:mkTarget(ctx.w,ctx.h)};clearTarget(x.cur);clearTarget(x.next);ctx.hist.set(id,x);}x.used=true;return x;}
export const freeW=(set,ex)=>set.W.find(w=>!ex.includes(w));
export function runChain(list,inTex,inTarget,set,ctx,t){
  let cur=inTarget,curTex=inTex;
  for(const F of list){if(!F.vis)continue;const def=EFFECTS[F.type];const out=freeW(set,[cur]);
    if(def.feedback){const x=histFor(ctx,F.id);if(ctx.advance!==false||!x.stepped){drawFx(F,x.next,ctx,t,curTex,x.cur.t,0);const s=x.cur;x.cur=x.next;x.next=s;x.stepped=true;}copyTo(x.cur.t,out);}
    else if(def.blob){const B=blobPrep(F,ctx,t,curTex);drawFx(F,out,ctx,t,curTex,B.mkTex,0);}
    else if(def.passes===2){const mid=freeW(set,[cur,out]);drawFx(F,mid,ctx,t,curTex,null,0);drawFx(F,out,ctx,t,mid.t,curTex,1);}
    else drawFx(F,out,ctx,t,curTex,null,0);
    cur=out;curTex=out.t;}
  return cur;}
export function isIdentity(n){return !hasK(n.x)&&!hasK(n.y)&&!hasK(n.s)&&!hasK(n.r)&&!n.x.v&&!n.y.v&&n.s.v===1&&!n.r.v&&!n.spin.v&&!n.x.a&&!n.y.a&&!n.s.a&&!n.r.a;}
export const postT=(t,F)=>F>0?Math.floor(t*F+1e-6)/F:t;
export function renderList(items,set,ctx,t0,clear){
  clearTarget(set.A,clear);
  let baseOK=false,baseHidden=false,baseKey=0;
  for(const L of items){
    const t=postT(t0,L.tm&&L.tm.fps||0);const camHere=!!(st.cam&&st.cam.on)&&!ctx.noCam;R.CAMON=camHere;
    if(L.clip){if(baseHidden)continue;}else{baseHidden=!L.vis;baseOK=false;}
    if(!L.vis)continue;
    let out;const kind=kindOf(L);
    if(L.type==='group'){
      let sub=ctx.sets[set.depth+1];if(!sub){if(set.depth>0)continue;sub=ctx.sets[1]=mkSet(ctx.w,ctx.h,1);}
      const acc=renderList(L.children,sub,ctx,t,[0,0,0,0]);R.CAMON=camHere;const w0=set.W[0];
      if(isIdentity(L.n)&&!behav(L,t))copyTo(acc.t,w0);
      else{gl.bindFramebuffer(gl.FRAMEBUFFER,w0.f);gl.viewport(0,0,ctx.w,ctx.h);gl.useProgram(XFORM);gl.uniform2f(U(XFORM,'uRes'),ctx.w,ctx.h);setXform(XFORM,L,t);bindTex(0,acc.t);gl.uniform1i(U(XFORM,'uInput'),0);gl.drawArrays(gl.TRIANGLES,0,3);}
      out=runChain(L.fx,w0.t,w0,set,ctx,t);
    }else if(kind==='fx'){out=runChain([L,...L.fx],set.A.t,set.A,set,ctx,t);}
    else{const w0=set.W[0];if(EFFECTS[L.type].mesh)drawMesh(L,w0,ctx,t,EFFECTS[L.type]);else if(EFFECTS[L.type].points)drawPoints(L,w0,ctx,t,set.A.t);else drawFx(L,w0,ctx,t,set.A.t,null,0);out=runChain(L.fx,w0.t,w0,set,ctx,t);}
    if(R.CAMON&&kind!=='fx'&&kind!=='group'){const c=camXf(L,t);if(c&&c.blur>.05)out=runChain([dofLayer(L.id,c.blur)],out.t,out,set,ctx,t);}
    const useMask=L.clip&&baseOK;
    if(!L.maskOnly){
      gl.bindFramebuffer(gl.FRAMEBUFFER,set.B.f);gl.viewport(0,0,ctx.w,ctx.h);gl.useProgram(COMP);
      bindTex(0,set.A.t);bindTex(1,out.t);bindTex(2,useMask?set.base.t:BLANK);
      gl.uniform1i(U(COMP,'uBase'),0);gl.uniform1i(U(COMP,'uSrc'),1);gl.uniform1i(U(COMP,'uMask'),2);
      gl.uniform1i(U(COMP,'uMode'),BLEND_IDX[L.blend]||0);gl.uniform1i(U(COMP,'uIsFilter'),(kind==='fx'||(L.type==='particles'&&L.p.hidesrc.v>.5&&L.p.source.v<.5))?1:0);gl.uniform1i(U(COMP,'uUseMask'),useMask?1:0);
      {const Bh=behav(L,t);const cz=R.CAMON&&kind!=='fx'&&kind!=='group'?camXf(L,t):null;gl.uniform1f(U(COMP,'uOpacity'),Math.min(1,Math.max(0,ev(L.n.opacity,BASEK.opacity,t)*(Bh?Bh.op:1)*(cz&&cz.hide?0:1))));}
      gl.uniform1f(U(COMP,'uKey'),Math.min(1,Math.max(0,ev(L.n.key,BASEK.key,t))));gl.uniform1f(U(COMP,'uMaskKey'),baseKey);
      gl.drawArrays(gl.TRIANGLES,0,3);const s=set.A;set.A=set.B;set.B=s;}
    if(!L.clip){const i=set.W.indexOf(out);if(i>=0){set.W[i]=set.base;set.base=out;}else copyTo(out.t,set.base);baseOK=true;baseKey=kind==='fx'?0:Math.min(1,Math.max(0,ev(L.n.key,BASEK.key,t)));}
  }
  return set.A;}
export function renderScene(items,ctx,t,bg){t=postT(t,st.look&&st.look.fps||0);for(const x of ctx.hist.values())x.used=false;const c=hexRGB(bg);const out=renderList(items,ctx.sets[0],ctx,t,[c[0],c[1],c[2],1]);
  for(const [id,x] of ctx.hist)if(!x.used){freeTarget(x.cur);freeTarget(x.next);ctx.hist.delete(id);}return out;}
export function present(ctx,tex,fb,w,h,t){
  const LK=st.look,P=k=>LK.p[k].v;const mips=ctx.mips||[];let bloomTex=BLANK;
  gl.disable(gl.BLEND);
  if(mips.length&&(P('bloom')>.001||P('hal')>.001)){
    let src=tex,sw=ctx.w,sh=ctx.h;
    for(let i=0;i<mips.length;i++){const m=mips[i];gl.bindFramebuffer(gl.FRAMEBUFFER,m.f);gl.viewport(0,0,m.w,m.h);gl.useProgram(DOWN);bindTex(0,src);gl.uniform1i(U(DOWN,'uSrc'),0);
      gl.uniform2f(U(DOWN,'uTexel'),1/sw,1/sh);gl.uniform1i(U(DOWN,'uPre'),i===0?1:0);gl.uniform1f(U(DOWN,'uTh'),P('thresh'));gl.uniform1f(U(DOWN,'uExp'),P('exposure'));gl.drawArrays(gl.TRIANGLES,0,3);src=m.t;sw=m.w;sh=m.h;}
    gl.enable(gl.BLEND);gl.blendFunc(gl.ONE,gl.ONE);
    for(let i=mips.length-2;i>=0;i--){const m=mips[i],sm=mips[i+1];gl.bindFramebuffer(gl.FRAMEBUFFER,m.f);gl.viewport(0,0,m.w,m.h);gl.useProgram(UPS);bindTex(0,sm.t);gl.uniform1i(U(UPS,'uSrc'),0);
      gl.uniform2f(U(UPS,'uTexel'),1/sm.w,1/sm.h);gl.uniform1f(U(UPS,'uScale'),.35+.65*P('radius'));gl.drawArrays(gl.TRIANGLES,0,3);}
    gl.disable(gl.BLEND);bloomTex=mips[0].t;}
  gl.bindFramebuffer(gl.FRAMEBUFFER,fb);gl.viewport(0,0,w,h);gl.useProgram(POST);bindTex(0,tex);bindTex(1,bloomTex);
  gl.uniform1i(U(POST,'uSrc'),0);gl.uniform1i(U(POST,'uBloom'),1);gl.uniform2f(U(POST,'uRes'),w,h);gl.uniform1f(U(POST,'uTime'),t||0);gl.uniform1i(U(POST,'uTone'),LK.tone|0);
  for(const [u,k] of [['uExp','exposure'],['uBloomAmt','bloom'],['uHal','hal'],['uGrain','grain'],['uVig','vig'],['uChroma','chroma'],['uContrast','contrast'],['uSat','sat'],['uTemp','temp'],['uFade','fade'],['uSharpen','sharpen']])gl.uniform1f(U(POST,u),P(k));
  gl.drawArrays(gl.TRIANGLES,0,3);}

R.main=null;
export const outSize=()=>{const [w,hh]=st.size.split('x').map(Number);return {W:w,H:hh};};
export function resizeMain(){const {W,H}=outSize();const w=Math.max(16,Math.round(W*st.q/2)*2),hh=Math.max(16,Math.round(H*st.q/2)*2);
  if(R.main&&R.main.w===w&&R.main.h===hh)return;freeCtx(R.main);cv.width=w;cv.height=hh;R.main=mkCtx(w,hh);fitCanvas();$('#canvasLbl').textContent=`${W} × ${H}`;}
