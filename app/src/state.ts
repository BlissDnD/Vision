import { R } from './runtime';
import { BASE, DEFAULT_CODE, DEF_PRIMS, EFFECTS, S, paramsOf } from './effects/index';

R.uidN=1;export const uid=()=>'L'+Date.now().toString(36)+(R.uidN++).toString(36);
export const mkN=(v:any):NParam=>{if(!(v&&typeof v==='object'))return {v,a:0,f:.2,w:0,s:'',sa:.5};const o:NParam={v:v.v,a:v.a||0,f:v.f??.2,w:v.w||0,s:v.s||'',sa:v.sa??.5};if(v.k&&v.k.length)o.k=v.k.map(k=>({...k,bz:k.bz?[...k.bz]:undefined}));return o;};
export function makeLayer(type:string,o:any={}):Layer{
  const d=EFFECTS[type];
  const L:Layer={id:uid(),type,name:o.name||d.name,vis:true,blend:o.blend||'normal',pal:o.pal??(d.kind==='fx'?0:12),clip:!!o.clip,maskOnly:!!o.maskOnly,n:{},p:{},fx:(o.fx||[]).map(([t,oo])=>makeLayer(t,oo))};
  for(const b of BASE){let dv=b.def;if(type==='text'&&b.k==='s')dv=.16;if(type==='mtext'&&b.k==='s')dv=.2;if((type==='image'||type==='lottie')&&b.k==='s')dv=.8;L.n[b.k]=mkN(o[b.k]??dv);}
  if(type==='custom'&&Array.isArray(o.cp)&&o.cp.length)L.cp=o.cp.map(c=>({...c}));
  for(const p of paramsOf(L))L.p[p.k]=mkN(o.p?.[p.k]??p.def);
  if(type==='text')L.text={str:'ÉBREDÉS',font:'Cinzel',weight:'700',track:.12,...(o.text||{})};
  if(type==='mtext')L.text={str:'Új látomás',font:'Bricolage Grotesque',weight:'800',track:-.01,...(o.text||{})};
  if(type==='sdfscene'){L.prims=JSON.parse(JSON.stringify(o.prims||DEF_PRIMS));L.psel=0;}
  if(type==='particles')L.asset=o.asset||null;
  if(o.tm)L.tm={...o.tm};
  if(type==='custom')L.code=o.code||DEFAULT_CODE;
  if(type==='image'||type==='lottie')L.asset=o.asset||null;
  if(type==='lottie')L.media={start:Number.isFinite(+o.media?.start)?Math.max(0,+o.media.start):0,speed:Number.isFinite(+o.media?.speed)?Math.max(0,+o.media.speed):1,loop:o.media?.loop!==false};
  if(type==='blob')L.btext=o.btext??'{id} · {x}, {y}';
  if(type==='pdisp'&&Array.isArray(o.alts))L.alts=[...o.alts];
  if(d.spine)L.spine=JSON.parse(JSON.stringify(o.spine||d.spine));
  return L;
}
export function makeGroup(name:string,children:Layer[],o:any={}):Layer{const g:Layer={id:uid(),type:'group',name,vis:true,open:o.open??false,blend:o.blend||'normal',clip:!!o.clip,n:{},fx:[],children,macros:[]};for(const b of BASE)g.n[b.k]=mkN(b.def);return g;}
export function normalize(L:any):Layer{
  if(!L.id)L.id=uid();if(R.normMo)R.normMo(L);L.n=L.n||{};L.fx=(L.fx||[]).filter(f=>EFFECTS[f.type]).map(normalize);
  for(const b of BASE)if(!L.n[b.k])L.n[b.k]=mkN(b.def);
  if(L.type==='group'){L.children=(L.children||[]).filter(c=>c.type!=='group'&&EFFECTS[c.type]).map(normalize);L.macros=L.macros||[];return L;}
  const d=EFFECTS[L.type];L.p=L.p||{};for(const pd of paramsOf(L))if(!L.p[pd.k])L.p[pd.k]=mkN(pd.def);
  if(L.type==='text'&&!L.text)L.text={str:'ÉBREDÉS',font:'Cinzel',weight:'700',track:.12};if(L.type==='mtext'&&!L.text)L.text={str:'Új látomás',font:'Bricolage Grotesque',weight:'800',track:-.01};if(L.type==='lottie'){L.media=L.media||{};L.media.start=Number.isFinite(+L.media.start)?Math.max(0,+L.media.start):0;L.media.speed=Number.isFinite(+L.media.speed)?Math.max(0,+L.media.speed):1;L.media.loop=L.media.loop!==false;}if(L.type==='sdfscene'&&!Array.isArray(L.prims)){L.prims=JSON.parse(JSON.stringify(DEF_PRIMS));L.psel=0;}if(L.type==='custom'&&!L.code)L.code=DEFAULT_CODE;if(L.type==='blob'&&L.btext==null)L.btext='{id} · {x}, {y}';if(d.spine&&!Array.isArray(L.spine))L.spine=JSON.parse(JSON.stringify(d.spine));return L;}
export const SIZES:[string,string[][]][]=[['Képernyő',[['1920x1080','16:9 · 1920 × 1080'],['1080x1080','1:1 · 1080 × 1080'],['1080x1350','4:5 · 1080 × 1350'],['1080x1920','9:16 · 1080 × 1920'],['3840x2160','4K · 3840 × 2160']]],
 ['Bannerek',[['300x250','300 × 250'],['300x600','300 × 600'],['728x90','728 × 90'],['970x250','970 × 250'],['160x600','160 × 600']]]];
export const LOOKP=[S('exposure','Expozíció',-2,2,0),S('bloom','Bloom',0,2,.5),S('radius','Bloom-sugár',0,1,.6),S('thresh','Bloom-küszöb',0,2,.8),S('hal','Halation (filmes vörös derengés)',0,1.5,.3),
 S('grain','Filmszemcse',0,1.5,.25),S('vig','Vignetta',0,1,.35),S('chroma','Lencsehiba',0,1,.1),S('contrast','Kontraszt',.6,1.6,1.05),S('sat','Telítettség',0,1.8,.95),S('temp','Színhőmérséklet',-1,1,.08),S('fade','Fakítás',0,1,.03),S('sharpen','Élesítés',0,1,.15)];
export const LOOKS={
 'Filmes':{tone:1,exposure:0,bloom:.5,radius:.6,thresh:.8,hal:.3,grain:.25,vig:.35,chroma:.1,contrast:1.05,sat:.95,temp:.08,fade:.03,sharpen:.15},
 'Tiszta':{tone:2,exposure:.1,bloom:.35,radius:.5,thresh:.9,hal:0,grain:.06,vig:.15,chroma:0,contrast:1.04,sat:1.05,temp:0,fade:0,sharpen:.25},
 'Álomszerű':{tone:2,exposure:.15,bloom:.9,radius:.85,thresh:.5,hal:.2,grain:.15,vig:.3,chroma:.05,contrast:.95,sat:.85,temp:.05,fade:.1,sharpen:0},
 'Analóg':{tone:1,exposure:0,bloom:.4,radius:.55,thresh:.75,hal:.55,grain:.5,vig:.5,chroma:.3,contrast:1.1,sat:.88,temp:.15,fade:.07,sharpen:.05},
 'Neon noir':{tone:1,exposure:.2,bloom:1,radius:.7,thresh:.6,hal:.15,grain:.2,vig:.45,chroma:.15,contrast:1.15,sat:1.15,temp:-.12,fade:0,sharpen:.1},
 'Nyers':{tone:0,exposure:0,bloom:0,radius:.6,thresh:.8,hal:0,grain:0,vig:0,chroma:0,contrast:1,sat:1,temp:0,fade:0,sharpen:0},
};
export function mkLook(name){const L=LOOKS[name]||LOOKS.Filmes;const o={preset:LOOKS[name]?name:'Filmes',tone:L.tone,fps:0,p:{}};for(const d of LOOKP)o.p[d.k]={v:L[d.k]??d.def,a:0,f:.2,w:0};return o;}
export function normLook(o){if(!o||!o.p)return mkLook('Filmes');const b=mkLook(LOOKS[o.preset]?o.preset:'Filmes');b.preset=o.preset||b.preset;b.tone=o.tone??b.tone;b.fps=+o.fps||0;for(const d of LOOKP)if(o.p[d.k]&&isFinite(o.p[d.k].v))b.p[d.k]={v:+o.p[d.k].v,a:0,f:.2,w:0};return b;}
import type { Project, Layer, NParam } from './types';
/** Global scene light (C / M6): drives the key light, its shadow and the studio glint of obj3d / sdfscene layers.
 * Defaults reproduce the old fixed light (dir normalize(-0.5,0.8,0.6), shadow k 10, colour (1,.97,.92)). */
export const LIGHTP=[S('az','Irány (körbe, °)',-180,180,-39.81),S('el','Magasság (°)',-10,90,45.58),S('soft','Lágyabb árnyék',0,1,.5),S('size','Nagyobb csillanás',0,1,0),S('warm','Melegebb ↔ hidegebb',-1,1,0),S('pow','Erősség',0,3,1)];
export function normLight(o){const b:any={on:!(o&&o.on===false),p:{}};for(const d of LIGHTP){const v=o&&o.p&&o.p[d.k];b.p[d.k]=v&&isFinite(v.v)?mkN(v):mkN(d.def);}return b;}
export const st:Project={layers:[],bg:'#050409',size:'1920x1080',q:.5,qMode:'auto',look:mkLook('Filmes'),light:normLight(null),dur:10,loop:true,bpm:120,bpmOff:0,bases:{},links:[],cues:[],scenes:[]};
R.selId=null;export const assets={};export const vectorAssets:Record<string,string>={};export const imgTex=new Map();

export function walk(list,fn,parent=null){for(const it of list){fn(it,list,parent);if(it.type==='group')walk(it.children,fn,it);}}
export function findItem(id){let r=null;walk(st.layers,(it,list,parent)=>{if(it.id===id)r={it,list,parent,i:list.indexOf(it)};});return r;}
export const sel=()=>{const r=R.selId&&findItem(R.selId);return r?r.it:null;};
export function cloneItem(it){const c=JSON.parse(JSON.stringify(it));const map={};
  const re=x=>{const nid=uid();map[x.id]=nid;x.id=nid;(x.fx||[]).forEach(re);(x.children||[]).forEach(re);};re(c);
  if(c.macros)c.macros.forEach(m=>m.t.forEach(t=>{if(map[t[0]])t[0]=map[t[0]];}));return c;}
