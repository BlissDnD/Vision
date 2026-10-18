import { objects3d } from './objects3d';
import { shapes } from './shapes';
import { generators } from './generators';
import { media } from './media';
import { filters } from './filters';
import { worlds } from './worlds';
import { worldBlocks } from './worldBlocks';
import { motionText } from './motionText';
import { motionDesign } from './motionDesign';
import { particles } from './particles';
import { soft3d } from './soft3d';
import { codepenEffects } from './codepen';
import { S, COL } from './helpers';
export * from './helpers';

/** All layer types. Key = layer.type. Each: kind, name, desc, params, main, code (GLSL `vec4 fx()`), optional lib/passes/feedback/points/setU. */
import type { EffectDef } from '../types';
export const EFFECTS:Record<string,EffectDef>={...objects3d,...shapes,...generators,...media,...filters,...worlds,...worldBlocks,...motionText,...motionDesign,...particles,...soft3d,...codepenEffects};
/** Can appearance `fxType` act on layer L? Ordinary appearances: always. Host appearances: only on their listed types. */
export const fxFits = (fxType:string, L:any) => { const h = EFFECTS[fxType] && EFFECTS[fxType].host; return !h || (!!L && h.includes(L.type)); };
export const fxHostNote = (fxType:string) => { const h = EFFECTS[fxType] && EFFECTS[fxType].host; return h ? 'csak ' + h.map((t:string) => EFFECTS[t].name).join(', ') + ' rétegen hat' : ''; };
export const BLOB_PD=Object.fromEntries(EFFECTS.blob.params.map(p=>[p.k,p]));
export const DEFAULT_CODE=`// Saját effekt. Elérhető: P() koordináta, uTime, pal(t) paletta,
// fbm(), noise(), hash(), rot(a), IN(uv) = az alatta lévő kép,
// p_a … p_d csúszkák (0–1). Kimenet: előszorzott RGBA.
vec4 fx(){
  vec2 p = P();
  float t = uTime * (0.2 + p_a);
  float r = length(p), a = atan(p.y, p.x);
  float petals = 3.0 + floor(p_b * 9.0);
  float f = sin(a * petals + t) * 0.5 + 0.5;
  float ring = sin(r * (8.0 + p_c * 30.0) - t * 3.0 + f * 4.0);
  vec3 col = pal(r * 0.5 + f * p_d - t * 0.1) * smoothstep(0.0, 1.0, ring + f);
  col *= exp(-r * 1.2) * 2.0;
  return vec4(col, 1.0);
}`;
EFFECTS.custom.code=DEFAULT_CODE;
/** P1: a 'custom' layer may carry its own named sliders in L.cp = [{k,l,min,max,def} | {k,l,color:true,def:'#rrggbb'}] (max 8).
 *  They become uniforms p_<k> and animate like built-in params. Without L.cp the fixed p_a … p_d stay. */
export const CP_MAX=8;
export const CP_KEY=/^[a-z][a-z0-9_]{0,19}$/i;
export function cpDefs(cp:any[]):any[]{const out=[];const seen=new Set();for(const c of (Array.isArray(cp)?cp:[])){if(!c||!CP_KEY.test(String(c.k))||seen.has(c.k)||out.length>=CP_MAX)continue;seen.add(c.k);
  const l=String(c.l||c.k).slice(0,40);
  if(c.color||c.type==='color'){out.push(COL(c.k,l,/^#[0-9a-f]{6}$/i.test(String(c.def))?String(c.def):'#ffffff'));continue;}
  let mn=isFinite(+c.min)?+c.min:0,mx=isFinite(+c.max)?+c.max:1;if(!(mx>mn))mx=mn+1;const df=isFinite(+c.def)?Math.min(mx,Math.max(mn,+c.def)):(mn+mx)/2;
  out.push(S(c.k,l,mn,mx,df,c.step>0?+c.step:undefined));}
  return out;}
const cpMemo=new WeakMap();
/** Param definitions of one layer: the type's list, or the layer's own sliders for a custom shader (L.cp is replaced, never mutated, on edit). */
export function paramsOf(L:any):any[]{const d=L&&EFFECTS[L.type];if(!d)return [];if(L.type!=='custom'||!Array.isArray(L.cp)||!L.cp.length)return d.params;
  let r=cpMemo.get(L.cp);if(!r){r=cpDefs(L.cp);cpMemo.set(L.cp,r);}return r;}
export const pdefOf=(L:any,k:string)=>paramsOf(L).find(p=>p.k===k)||null;
export const SDF_MAP=`uniform vec4 uA[8]; uniform vec4 uB[8]; uniform vec4 uC[8]; uniform float uN;
float sdPrim(vec3 l,float ty,vec3 s){
  if(ty<0.5){float k0=length(l/s); float k1=length(l/(s*s)); return k0*(k0-1.0)/max(k1,1e-4);}
  if(ty<1.5){vec3 q=abs(l)-s+0.04; return length(max(q,0.0))+min(max(q.x,max(q.y,q.z)),0.0)-0.04;}
  if(ty<2.5){vec2 q=vec2(length(l.xz)-s.x,l.y); return length(q)-s.y*0.35;}
  if(ty<3.5){vec2 d=abs(vec2(length(l.xz),l.y))-vec2(s.x,s.y); return min(max(d.x,d.y),0.0)+length(max(d,0.0));}
  if(ty<4.5){vec3 q=l; q.y-=clamp(q.y,-s.y,s.y); return length(q)-s.x*0.5;}
  return (abs(l.x)+abs(l.y)+abs(l.z)-s.x)*0.57735;}
vec2 map(vec3 p){vec3 q=gM*p; float d=1e9; float cc=0.0;
  for(int i=0;i<8;i++){if(float(i)>=uN) break; vec4 A=uA[i],B=uB[i],C=uC[i];
    vec3 l=rX(C.y)*(rY(C.x)*(q-A.xyz)); float di=sdPrim(l,A.w,max(B.xyz,vec3(0.01))); float k=max(C.z,0.001);
    if(B.w<0.5){float h=clamp(0.5+0.5*(di-d)/k,0.0,1.0); d=mix(di,d,h)-k*h*(1.0-h); cc=mix(C.w,cc,h);}
    else if(B.w<1.5){float h=clamp(0.5-0.5*(d+di)/k,0.0,1.0); d=mix(d,-di,h)+k*h*(1.0-h);}
    else {float h=clamp(0.5-0.5*(di-d)/k,0.0,1.0); d=mix(d,di,h)+k*h*(1.0-h);}}
  return vec2(d,2.0+cc);}
vec3 calcN(vec3 p){vec2 e=vec2(0.0015,-0.0015);return normalize(e.xyy*map(p+e.xyy).x+e.yyx*map(p+e.yyx).x+e.yxy*map(p+e.yxy).x+e.xxx*map(p+e.xxx).x);}
`;
export const SDF_RENDER=`vec4 render(vec2 p){
  vec3 ro,rd; camRay(p,ro,rd);
  float tt=0.0; float md=1e9; float hit=-1.0;
  for(int i=0;i<128;i++){vec3 pos=ro+rd*tt; float d=map(pos).x; md=min(md,d); if(d<0.0007*(1.0+tt)){hit=tt;break;} tt+=d*0.8; if(tt>10.0) break;}
  vec3 L=uLDir;
  if(hit<0.0){vec4 res=vec4(0.0); float fsh=0.0; vec2 fq=vec2(0.0);
    if(p_floor>0.001&&rd.y<0.0){float tf=(-1.0-ro.y)/rd.y; vec3 fp=ro+rd*tf; float sh=softShadow(fp+vec3(0.0,0.002,0.0),L); float ao=clamp(map(fp).x*1.2,0.0,1.0);
      res.a=clamp((1.0-min(sh,0.25+0.75*ao))*p_floor*exp(-length(fp.xz)*0.35),0.0,1.0); fsh=res.a; fq=fp.xz;}
    if(p_floorM>0.5&&rd.y<0.0){float tf=(-1.0-ro.y)/rd.y; vec3 fp=ro+rd*tf; vec4 m=tr2(fp+vec3(0.0,0.002,0.0),reflect(rd,vec3(0.0,1.0,0.0)));   // FÉNY2 floor mirror
      float k=clamp(p_mirror*m.a*(0.35+0.65*pow(1.0-abs(rd.y),3.0))*exp(-length(fp.xz)*0.3),0.0,1.0); res.rgb=res.rgb*(1.0-k)+m.rgb*k; res.a=max(res.a,k);}
    float halo=exp(-max(md,0.0)*14.0)*p_glow*0.4; res.rgb+=pal(0.6)*halo; res.a=max(res.a,clamp(halo,0.0,1.0));
    if(uMt>0.5) res=mix(res,matMiss(md,fsh,fq,3.5/(uRes.y*uScale*1.8)),uMs); return res;}
  vec3 pos=ro+rd*hit; vec3 n=calcN(pos); vec3 v=-rd; float ct=map(pos).y-2.0;
  if(uMt>0.5){float ao0=calcAO(pos,n),sh0=softShadow(pos+n*0.003,L); vec3 g0=vec3(0.7)*(envMap(n,1.0)*0.9+0.03)*mix(0.35,1.0,ao0)*mix(0.55,1.0,sh0)+0.42*max((dot(n,L)+uLWrap)/(1.0+uLWrap),0.0)*mix(sh0,1.0,uLWrap*0.6)*uLCol*1.6;   // MAT1: host appearance (material3d)
    gMat=matHit(dot(g0,vec3(0.2126,0.7152,0.0722)),max(dot(n,v),0.0),(gM*pos),gM*n,hit/(uRes.y*uScale*1.8),pal(0.3+(gM*pos).y*0.25)*g0*1.3,pos.y);
    if(uMs>0.999) return gMat;}
  float fres=pow(1.0-max(dot(n,v),0.0),3.0); float rough=clamp(p_rough,0.02,1.0); float metal=p_metal; vec3 alb;
  int mt=int(p_material+0.5);
  if(mt==0) alb=pal(ct);
  else if(mt==1){alb=mix(vec3(0.82,0.79,0.75),pal(ct),0.35); rough=max(rough,0.7); metal=0.0;}
  else if(mt==2){alb=mix(vec3(0.95),pal(ct),0.3); metal=1.0; rough=rough*0.5;}
  else if(mt==3){alb=pal(fres*0.9+n.y*0.3+ct); metal=max(metal,0.75); rough=rough*0.6;}
  else return MX(vec4(n*0.5+0.5,1.0));
  float ao=calcAO(pos,n); float sh=softShadow(pos+n*0.003,L);
  gP=pos; gPrim=1.0; gAlb=alb; gRough=rough;
  return MX(vec4(shadePBR(n,rd,alb,rough,metal,ao,sh)+pal(0.6)*fres*p_glow*0.25,1.0));}
vec4 fx(){vec2 p=matWarp(P()); gM=rX(p_rx*PI/180.0)*rY(p_ry*PI/180.0+uTime*p_spin);
  vec2 px=vec2(1.0/(uRes.y*uScale)); int ns=p_aa<0.5?1:4; vec4 acc=vec4(0.0);   // one call site: the raymarcher is inlined once (shader compile time)
  for(int i=0;i<4;i++){if(i>=ns) break; vec2 o=ns==1?vec2(0.0):px*vec2(i==0||i==2?-0.25:0.25,i<2?-0.25:0.25); acc+=render(p+o);}
  return ns==1?acc:acc*0.25;}`;
(()=>{const o3=EFFECTS.obj3d.code;const head=o3.slice(0,o3.indexOf('float body(vec3 q){'));const lib=o3.slice(o3.indexOf('float h1(float n)'),o3.indexOf('vec4 render(vec2 p)'));
  EFFECTS.sdfscene.code=head+SDF_MAP+lib+SDF_RENDER;})();
export const DEF_PRIMS=[{t:0,op:0,x:0,y:.12,z:0,sx:.55,sy:.55,sz:.55,rx:0,ry:0,k:.25,c:.1},{t:2,op:0,x:0,y:-.38,z:0,sx:.62,sy:.42,sz:.62,rx:0,ry:0,k:.22,c:.55},{t:0,op:1,x:.28,y:.28,z:.38,sx:.26,sy:.26,sz:.26,rx:0,ry:0,k:.12,c:.3}];
export const PRIM_T=['Gömb','Doboz','Tórusz','Henger','Kapszula','Oktaéder'],PRIM_OP=['Hozzáad','Kivon','Metsz'];
export const PRIM_DEF={t:0,op:0,x:0,y:0,z:0,sx:.3,sy:.3,sz:.3,rx:0,ry:0,k:.15,c:.5};
export const KIND_LABEL={gen:'Forrás',fx:'Szűrő','3d':'3D',shape:'Alakzat',text:'Szöveg',image:'Kép',group:'Csoport'};
export const BLENDS=[['normal','Normál'],['add','Hozzáadás'],['screen','Képernyő'],['multiply','Szorzás'],['overlay','Átfedés'],['difference','Különbség'],['lighten','Világosítás'],['darken','Sötétítés'],['dodge','Színfakítás'],['exclusion','Kizárás']];
export const BLEND_IDX=Object.fromEntries(BLENDS.map((b,i)=>[b[0],i]));
export const BASE=[S('opacity','Átlátszóság',0,1,1),S('key','Fekete kiütése',0,1,0),S('x','X',-2,2,0),S('y','Y',-1.2,1.2,0),S('s','Méret',.05,5,1),S('r','Szög',-180,180,0),S('spin','Pörgés °/mp',-90,90,0),S('hue','Színeltolás',-.5,.5,0),S('z','Mélység (Z)',-1.5,8,0)];
export const BASEK=Object.fromEntries(BASE.map(b=>[b.k,b]));
export const WAVES=['Szinusz','Háromszög','Fűrész','Négyszög'];
export const ICONS={
 group:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>',
 gen:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1"/><circle cx="12" cy="12" r="3"/></svg>',
 fx:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M4 7h10M18 7h2M4 17h4M12 17h8"/><circle cx="16" cy="7" r="2"/><circle cx="10" cy="17" r="2"/></svg>',
 '3d':'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M12 3 4 7.5v9L12 21l8-4.5v-9z"/><path d="M4 7.5 12 12l8-4.5M12 12v9"/></svg>',
 shape:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="9" cy="10" r="5.5"/><rect x="11" y="11" width="9" height="9" rx="1.5"/></svg>',
 text:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M5 6V4h14v2M12 4v16M9 20h6"/></svg>',
 image:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="m21 16-5-5-9 9"/></svg>',
};
export const SVG_EYE='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>';
export const SVG_EYEOFF='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 3l18 18M10.6 5.1A10 10 0 0 1 12 5c6.5 0 10 7 10 7a17 17 0 0 1-3.2 4.2M6.6 6.6C3.8 8.3 2 12 2 12s3.5 7 10 7a9.7 9.7 0 0 0 4.4-1"/></svg>';
export const SVG_WAVE='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M2 12c2.5-6 5-6 7.5 0s5 6 7.5 0 3.5-4 5-2"/></svg>';
export const SVG_X='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>';
export const SVG_CHEV='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="m9 6 6 6-6 6"/></svg>';
export const SVG_PLAY='<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 4v16l13-8z"/></svg>',SVG_PAUSE='<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 5h4v14H6zM14 5h4v14h-4z"/></svg>';
export const kindOf=it=>it.type==='group'?'group':EFFECTS[it.type].kind;
export const iconKind=k=>ICONS[k]||ICONS.gen;

/** U4: which params are motion settings (they live on the Mozgás tab). Timed effects list theirs; elsewhere tempo-like keys.
 *  MAIN_DUP: motion params that also stay among the main settings (both controls edit the same value). */
const ANIM_P:Record<string,string[]>={
  mtext:['anim','unit','order','start','dur','stagger','outAt','ease','shimmer','shimspeed','boil','boilfps','stretch','pulse'],
  reveal:['mode','dir','at','dur','outAt','ease'],
  bento:['anim','order','start','dur','stagger','ease','layout2','morphAt','morphDur','outAt'],
  pdisp:['trig','out','hold','back','every','speed'],
};
const MAIN_DUP:Record<string,string[]>={mtext:['anim','dur'],reveal:['mode','dur'],bento:['anim'],pdisp:['trig']};
const TEMPO=new Set(['speed','spin','bspeed','cloudspeed','shimspeed','drift','twinkle','wobble','rate','wind','boil','boilfps','pulse']);
export function animKeysOf(L:any):string[]{const ps=paramsOf(L).map(p=>p.k);return ANIM_P[L.type]?ANIM_P[L.type].filter(k=>ps.includes(k)):L.type==='custom'?[]:ps.filter(k=>TEMPO.has(k));}
/** Motion params shown among the main settings too: the listed ones, or a tempo param the effect already treats as main. */
export function mainDupOf(L:any):string[]{const d=EFFECTS[L.type];if(MAIN_DUP[L.type])return MAIN_DUP[L.type];return animKeysOf(L).filter(k=>(d.main||[]).includes(k));}
