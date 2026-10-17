import { $ } from './dom';
import { HEAD, HEAD_LINES, VS } from './glsl';
import { EFFECTS, paramsOf } from './effects/index';
import { sel } from './state';
import { renderLayers } from './layers';
import { renderInsp } from './inspector';

export const cv=$('#cv');
export const gl=cv.getContext('webgl2',{preserveDrawingBuffer:false,antialias:false,alpha:false,depth:false,stencil:false,premultipliedAlpha:false,powerPreference:'high-performance'});
if(!gl){document.body.innerHTML='<p style="padding:24px;font:15px system-ui">Ez a böngésző nem támogatja a WebGL2-t. Próbáld Chrome-ban, Edge-ben, Firefoxban vagy Safari 15+ alatt.</p>';throw new Error('no webgl2');}
export const HALF=!!gl.getExtension('EXT_color_buffer_float');
export const IFMT=HALF?gl.RGBA16F:gl.RGBA8, TYPE=HALF?gl.HALF_FLOAT:gl.UNSIGNED_BYTE;
gl.bindVertexArray(gl.createVertexArray());
export function compile(type,src){const s=gl.createShader(type);gl.shaderSource(s,src);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS)){const e=gl.getShaderInfoLog(s);gl.deleteShader(s);throw new Error(e||'compile error');}return s;}
export const VSO=compile(gl.VERTEX_SHADER,VS);
export function link(fs){const p=gl.createProgram();gl.attachShader(p,VSO);gl.attachShader(p,compile(gl.FRAGMENT_SHADER,fs));gl.linkProgram(p);if(!gl.getProgramParameter(p,gl.LINK_STATUS))throw new Error(gl.getProgramInfoLog(p)||'link error');p.u={};return p;}
export const U=(p,n)=>(n in p.u)?p.u[n]:(p.u[n]=gl.getUniformLocation(p,n));
export function fragFor(def,code){const decl=def.params.map(p=>p.type==='color'?`uniform vec3 p_${p.k};`:`uniform float p_${p.k};`).join('\n');return HEAD+decl+'\n'+(def.lib||'')+'\n'+code+'\nvoid main(){o=fx();}';}
export const progCache=new Map(),errCache=new Map();
export const codeOf=L=>L.type==='custom'?(L.code||''):EFFECTS[L.type].code;
/** Program cache key: the type for library effects (their code never changes), type+code only for custom GLSL. Avoids hashing kilobytes of shader text per layer per frame. */
export const cpSig=L=>paramsOf(L).map(p=>p.k+(p.type==='color'?':c':'')).join(',');
export const progKey=L=>L.type==='custom'?'custom|'+cpSig(L)+'|'+(L.code||''):L.type;
const defOf=L=>{const d=EFFECTS[L.type];return L.type==='custom'?{params:paramsOf(L),lib:d.lib}:d;};
export function getProg(L){const def=defOf(L);const key=progKey(L);if(progCache.has(key))return progCache.get(key);const code=codeOf(L);
  if(progCache.has(key))return progCache.get(key);if(errCache.has(key))return null;
  try{const p=link(fragFor(def,code));progCache.set(key,p);return p;}catch(e){errCache.set(key,fixLines(String(e.message||e),def));console.warn('Shader:',L.type,e.message);
    if(!(getProg as any).pending){(getProg as any).pending=1;setTimeout(()=>{(getProg as any).pending=0;try{renderLayers();if(sel())renderInsp();}catch(_){}},50);}return null;}}
export const progError=L=>errCache.get(progKey(L))||null;
export function fixLines(msg,def){const off=HEAD_LINES-1+def.params.length+(def.lib?def.lib.split('\n').length:1);return msg.replace(/ERROR:\s*0:(\d+)/g,(m,n)=>`Hiba a(z) ${Math.max(1,n-off)}. sorban`).trim();}

export const COMP=link(`#version 300 es
precision highp float; in vec2 vUv; out vec4 o;
uniform sampler2D uBase; uniform sampler2D uSrc; uniform sampler2D uMask;
uniform int uMode; uniform int uIsFilter; uniform int uUseMask; uniform float uOpacity; uniform float uKey; uniform float uMaskKey;
float lu(vec3 c){return dot(c,vec3(0.299,0.587,0.114));}
vec3 ov(vec3 b,vec3 s){return mix(2.0*b*s,1.0-2.0*(1.0-b)*(1.0-s),step(0.5,b));}
vec3 bl(vec3 b,vec3 s){
  if(uMode==1) return b+s;
  if(uMode==2) return 1.0-(1.0-clamp(b,0.0,1.0))*(1.0-clamp(s,0.0,1.0));
  if(uMode==3) return b*s;
  if(uMode==4) return ov(clamp(b,0.0,1.0),clamp(s,0.0,1.0));
  if(uMode==5) return abs(b-s);
  if(uMode==6) return max(b,s);
  if(uMode==7) return min(b,s);
  if(uMode==8) return b/max(1.0-clamp(s,0.0,1.0),0.02);
  if(uMode==9) return b+s-2.0*b*s;
  return s;}
void main(){
  vec4 B=texture(uBase,vUv); vec4 S=texture(uSrc,vUv); float m=1.0;
  if(uUseMask==1){vec4 M=texture(uMask,vUv); vec3 mc=M.a>0.0001?M.rgb/M.a:vec3(0.0); m=clamp(M.a,0.0,1.0)*mix(1.0,smoothstep(0.02,0.45,lu(mc)),uMaskKey);}
  if(uIsFilter==1){o=mix(B,S,clamp(uOpacity*m,0.0,1.0));return;}
  vec3 Sc=S.a>0.0001?S.rgb/S.a:vec3(0.0);
  float sa=clamp(S.a,0.0,1.0)*uOpacity*m*mix(1.0,smoothstep(0.02,0.45,lu(Sc)),uKey);
  vec3 Bc=B.a>0.0001?B.rgb/B.a:vec3(0.0);
  vec3 Cs=mix(Sc,bl(Bc,Sc),clamp(B.a,0.0,1.0));
  o=vec4(sa*Cs+(1.0-sa)*B.rgb,sa+B.a*(1.0-sa));}`);
export const SHOW=link(`#version 300 es
precision highp float; in vec2 vUv; out vec4 o; uniform sampler2D uSrc;
void main(){o=vec4(clamp(texture(uSrc,vUv).rgb,0.0,1.0),1.0);}`);
export const DOWN=link(`#version 300 es
precision highp float; in vec2 vUv; out vec4 o; uniform sampler2D uSrc; uniform vec2 uTexel; uniform int uPre; uniform float uTh; uniform float uExp;
vec3 pf(vec3 c){if(uPre==0) return c; c=pow(max(c,0.0),vec3(2.2))*exp2(uExp); float br=max(c.r,max(c.g,c.b)); float soft=clamp(br-uTh+0.5,0.0,1.0); soft=soft*soft*0.5; return c*max(soft,br-uTh)/max(br,0.0001);}
void main(){vec2 d=uTexel;
  vec3 s=pf(texture(uSrc,vUv).rgb)*4.0+pf(texture(uSrc,vUv+vec2(-d.x,-d.y)).rgb)+pf(texture(uSrc,vUv+vec2(d.x,-d.y)).rgb)+pf(texture(uSrc,vUv+vec2(-d.x,d.y)).rgb)+pf(texture(uSrc,vUv+vec2(d.x,d.y)).rgb);
  o=vec4(s/8.0,1.0);}`);
export const UPS=link(`#version 300 es
precision highp float; in vec2 vUv; out vec4 o; uniform sampler2D uSrc; uniform vec2 uTexel; uniform float uScale;
void main(){vec2 d=uTexel; vec3 s=texture(uSrc,vUv+vec2(-d.x*2.0,0.0)).rgb+texture(uSrc,vUv+vec2(-d.x,d.y)).rgb*2.0+texture(uSrc,vUv+vec2(0.0,d.y*2.0)).rgb+texture(uSrc,vUv+vec2(d.x,d.y)).rgb*2.0
  +texture(uSrc,vUv+vec2(d.x*2.0,0.0)).rgb+texture(uSrc,vUv+vec2(d.x,-d.y)).rgb*2.0+texture(uSrc,vUv+vec2(0.0,-d.y*2.0)).rgb+texture(uSrc,vUv+vec2(-d.x,-d.y)).rgb*2.0;
  o=vec4(s/12.0*uScale,1.0);}`);
export const POST=link(`#version 300 es
precision highp float; in vec2 vUv; out vec4 o; uniform sampler2D uSrc; uniform sampler2D uBloom; uniform vec2 uRes; uniform float uTime;
uniform int uTone; uniform float uExp; uniform float uBloomAmt; uniform float uHal; uniform float uGrain; uniform float uVig; uniform float uChroma; uniform float uContrast; uniform float uSat; uniform float uTemp; uniform float uFade; uniform float uSharpen;
vec3 acesF(vec3 x){return clamp((x*(2.51*x+0.03))/(x*(2.43*x+0.59)+0.14),0.0,1.0);}
vec3 agx(vec3 c){
  const mat3 inm=mat3(0.842479062253094,0.0423282422610123,0.0423756549057051,0.0784335999999992,0.878468636469772,0.0784336,0.0792237451477643,0.0791661274605434,0.879142973793104);
  const mat3 outm=mat3(1.19687900512017,-0.0528968517574562,-0.0529716355144438,-0.0980208811401368,1.15190312990417,-0.0980434501171241,-0.0990297440797205,-0.0989611768448433,1.15107367264116);
  c=inm*c; c=clamp(log2(max(c,vec3(1e-10))),-12.47393,4.026069); c=(c+12.47393)/16.49999;
  vec3 x2=c*c; vec3 x4=x2*x2; c=15.5*x4*x2-40.14*x4*c+31.96*x4-6.868*x2*c+0.4298*x2+0.1191*c-0.00232;
  c=outm*c; return clamp(pow(max(c,vec3(0.0)),vec3(2.2)),0.0,1.0);}
float hsh(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}
void main(){
  vec2 q=vUv-0.5; vec2 off=q*uChroma*0.012;
  vec3 c0=texture(uSrc,vUv).rgb,cr=texture(uSrc,vUv+off).rgb,cb=texture(uSrc,vUv-off).rgb;
  float hi=max(max(max(c0.r,c0.g),c0.b),max(max(cr.r,cr.g),max(cb.b,cb.g)));   // HDR highlights (specular glints): no fringe, else a 1-px glint turns into a cyan/red dot
  vec3 c=mix(c0,vec3(cr.r,c0.g,cb.b),1.0/(1.0+3.0*max(hi-1.0,0.0)));
  if(uSharpen>0.0){vec2 px=1.0/uRes; vec3 b=(texture(uSrc,vUv+vec2(px.x,0.0)).rgb+texture(uSrc,vUv-vec2(px.x,0.0)).rgb+texture(uSrc,vUv+vec2(0.0,px.y)).rgb+texture(uSrc,vUv-vec2(0.0,px.y)).rgb)*0.25; c+=(c-b)*uSharpen;}
  vec3 lin=pow(max(c,0.0),vec3(2.2))*exp2(uExp);
  vec3 bl=texture(uBloom,vUv).rgb; lin+=bl*uBloomAmt*0.35+bl*vec3(1.0,0.28,0.1)*uHal*0.5;
  lin*=vec3(1.0+uTemp*0.12,1.0,1.0-uTemp*0.12);
  vec3 m;
  if(uTone==1) m=pow(acesF(lin*0.8),vec3(1.0/2.2));
  else if(uTone==2) m=pow(agx(lin*1.3),vec3(1.0/2.2));
  else m=pow(clamp(lin,0.0,1.0),vec3(1.0/2.2));
  m=(m-0.5)*uContrast+0.5;
  float l=dot(m,vec3(0.299,0.587,0.114)); m=mix(vec3(l),m,uSat);
  m=m*(1.0-uFade*0.15)+uFade*0.15*vec3(0.55,0.52,0.6);
  float vg=1.0-smoothstep(0.2,0.85,length(q*vec2(uRes.x/uRes.y,1.0)*0.9)); m*=mix(1.0,vg,uVig);
  float lm=clamp(dot(m,vec3(0.333)),0.0,1.0); m+=(hsh(gl_FragCoord.xy+fract(uTime*11.0)*317.0)-0.5)*uGrain*0.14*(0.35+lm*(1.0-lm)*2.6);
  m+=(hsh(gl_FragCoord.xy*1.37+7.0)-0.5)/255.0;
  o=vec4(clamp(m,0.0,1.0),1.0);}`);
export const COPY=link(`#version 300 es
precision highp float; in vec2 vUv; out vec4 o; uniform sampler2D uSrc;
void main(){o=texture(uSrc,vUv);}`);
export const MIX=link(`#version 300 es
precision highp float; in vec2 vUv; out vec4 o; uniform sampler2D uA; uniform sampler2D uB; uniform float uK;
void main(){o=mix(texture(uA,vUv),texture(uB,vUv),uK);}`);
export const XFORM=link(fragFor({params:[]},`vec4 fx(){vec2 q=toQ(vUv); vec2 uv=q/ASP()+0.5; float inb=step(0.0,uv.x)*step(uv.x,1.0)*step(0.0,uv.y)*step(uv.y,1.0); return texture(uInput,uv)*inb;}`));
export const NULLP=link(HEAD+'void main(){o=vec4(0.0);}');

export function mkTex(w,h,ifmt=IFMT,type=TYPE){const t=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,t);gl.texImage2D(gl.TEXTURE_2D,0,ifmt,w,h,0,gl.RGBA,type,null);
  gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);return t;}
export function mkTarget(w,h,ifmt?,type?){const t=mkTex(w,h,ifmt,type);const f=gl.createFramebuffer();gl.bindFramebuffer(gl.FRAMEBUFFER,f);gl.framebufferTexture2D(gl.FRAMEBUFFER,gl.COLOR_ATTACHMENT0,gl.TEXTURE_2D,t,0);return {t,f,w,h};}
export function freeTarget(x){if(!x)return;gl.deleteTexture(x.t);gl.deleteFramebuffer(x.f);}
export function clearTarget(x,c=[0,0,0,0]){gl.bindFramebuffer(gl.FRAMEBUFFER,x.f);gl.viewport(0,0,x.w,x.h);gl.clearColor(c[0],c[1],c[2],c[3]);gl.clear(gl.COLOR_BUFFER_BIT);}
export function mkSet(w,h,depth){return {w,h,depth,A:mkTarget(w,h),B:mkTarget(w,h),base:mkTarget(w,h),W:[mkTarget(w,h),mkTarget(w,h),mkTarget(w,h)]};}
export function freeSet(s){if(!s)return;freeTarget(s.A);freeTarget(s.B);freeTarget(s.base);s.W.forEach(freeTarget);}
export function mkCtx(w,h){const mips=[];let mw=w>>1,mh=h>>1;while(mips.length<6&&mw>=4&&mh>=4){mips.push(mkTarget(mw,mh));mw>>=1;mh>>=1;}return {w,h,sets:[mkSet(w,h,0),null],hist:new Map(),mips};}
export function freeCtx(c){if(!c)return;if(c.mb)freeTarget(c.mb);c.sets.forEach(freeSet);(c.mips||[]).forEach(freeTarget);for(const x of c.hist.values()){freeTarget(x.cur);freeTarget(x.next);}}
export function texFromCanvas(c,old?){const t=old||gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,t);gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,true);
  gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,c);gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,false);
  gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);return t;}
export const BLANK=(()=>{const t=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,t);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,1,1,0,gl.RGBA,gl.UNSIGNED_BYTE,new Uint8Array([0,0,0,0]));return t;})();
export const PLACEHOLDER=(()=>{const c=document.createElement('canvas');c.width=640;c.height=400;const x=c.getContext('2d');
  const g=x.createLinearGradient(0,0,640,400);g.addColorStop(0,'#2c2b45');g.addColorStop(1,'#15151c');x.fillStyle=g;x.fillRect(0,0,640,400);
  x.strokeStyle='#8f8df7';x.setLineDash([10,8]);x.lineWidth=3;x.strokeRect(14,14,612,372);x.fillStyle='#e8e8f0';x.font='600 30px system-ui,sans-serif';x.textAlign='center';
  x.fillText('Válassz egy képet',320,200);x.font='22px system-ui,sans-serif';x.fillStyle='#a6a6b4';x.fillText('a jobb oldali panelen',320,238);return {tex:texFromCanvas(c),w:640,h:400};})();

export const ASCII_ATLAS=(()=>{const chars=' .:-=+*#%@';const c=document.createElement('canvas');c.width=chars.length*32;c.height=48;const x=c.getContext('2d');
  x.fillStyle='#fff';x.font='bold 38px "SF Mono",Menlo,Consolas,monospace';x.textAlign='center';x.textBaseline='middle';[...chars].forEach((ch,i)=>x.fillText(ch,i*32+16,26));return {tex:texFromCanvas(c),w:c.width,h:c.height};})();
