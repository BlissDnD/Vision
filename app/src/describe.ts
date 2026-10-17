import { R } from './runtime';
import { $, h } from './dom';
import { PALS } from './palettes';
import { BASE, BLEND_IDX, EFFECTS } from './effects/index';
import { makeGroup, makeLayer, mkN, st } from './state';
import { RECIPES, makeRecipe } from './recipes';
import { CAMP, mkCam, outSize } from './render';
import { commit, renderAll } from './history';
import { resetFeedback, setPlay } from './transport';
import { closeModal, openModal, toast } from './modals';

R.SAMPLE=null;try{window.claude&&window.claude.use&&window.claude.use('sample').then(s=>{R.SAMPLE=s;$('#descBtn').hidden=!s;}).catch(()=>{});}catch(_){}
export const DESC_SKIP=new Set(['custom','blob','sky','obj3d','gyroid','ascii']);
export function descCatalog(){const L=[];for(const [k,d] of Object.entries(EFFECTS)){if(DESC_SKIP.has(k))continue;
    const ps=d.params.map(p=>p.type==='sel'?`${p.k}=${p.opts.map((o,i)=>i+':'+o).join('|')}`:p.type==='color'?`${p.k}=#hex`:`${p.k}=${p.min}..${p.max}(${p.def})`).join('; ');
    L.push(`${k} [${d.kind}] ${d.name}: ${ps}`);}return L.join('\n');}
export function descPrompt(text,dur){const {W,H}=outSize();const ax=(W/H/2).toFixed(2);
  return `You turn a scene description into a layered motion-design composition for a WebGL editor. Reply with ONLY one JSON object, no prose.

DESCRIPTION (any language; write on-screen text in the description's language):
"""${text.slice(0,4000)}"""

OUTPUT SHAPE:
{"name":"short title","dur":${dur},"baseRecipe":null|"<recipe name>","cam":null|{"x":N|K,"y":N|K,"zoom":N|K,"focus":N,"ap":N,"roll":N|K},
 "layers":[ {"type":"<effect key>","name":"…","blend":"normal|add|screen|multiply|overlay","opacity":0..1,"x":N|K,"y":N|K,"s":N|K,"r":N|K,"z":N,"clip":false,"maskOnly":false,"pal":0..17,
   "text":{"str":"…","font":"Bricolage Grotesque|Instrument Sans|Fraunces|Cinzel|Unbounded|Syne|Orbitron|Major Mono Display|Bodoni Moda","weight":"400|600|700|800","align":"left|center|right"},
   "tm":{"in":0..8,"inAt":sec,"inDur":sec,"out":0..8,"outAt":sec,"outDur":sec,"ease":0..11,"fps":0|8|12|24},
   "p":{"<param>":N|K, …}} ]}
N = number. K = keyframed value: {"k":[{"t":sec,"v":N,"e":ease},…]} (e = curve of the segment starting at that key).
Layers are listed BOTTOM to TOP (first = background). 3–10 layers. Use only effect keys and params from the catalog; omit params you keep at default.
Coordinates: x from -${ax} (left) to ${ax} (right), y from -0.5 (bottom) to 0.5 (top); s = size (1 = default; text layers ~0.06–0.25); r = degrees; z = depth for the camera (0 = picture plane, positive = farther, -1 = near), only matters when "cam" is set.
Masking: a layer with "clip":true only shows inside the nearest non-clip layer below it (e.g. a shape or bento with "maskOnly":true or visible).
Ease indices: 0 soft, 1 strong, 3 in-out, 4 linear, 5 spring soft, 6 spring bouncy, 7 back, 8 elastic, 9 bounce, 10 expo, 11 steps.
tm.in/out moves: 0 none, 1 fade, 2 rise, 3 sink, 4 from left, 5 from right, 6 zoom in, 7 zoom out, 8 pop.
Titles: use "mtext" (animated text) with p.anim/start/dur/stagger. Transitions over everything below: "reveal". Film look: "projector". Grids/cards: "bento". Skies/landscapes: skygrad, sun, clouds, shape kind 13 (ridge, maskOnly) + terrain (clip), haze. Keep the timeline within ${dur} s and make motion feel designed: staggered entrances, spring easing, one clear focal point.
baseRecipe (optional, placed under your layers): one of ${RECIPES.map(r=>r.n).join(', ')}.
Palettes (pal): ${PALS.map((p,i)=>i+' '+p.n).join(', ')}.

CATALOG (key [kind] name: params; sel params list index:label):
${descCatalog()}`;}
export function clampP(d,v){if(d.type==='color')return /^#[0-9a-f]{6}$/i.test(String(v))?String(v):d.def;const x=Number(v);if(!isFinite(x))return d.def;const c=Math.min(d.max,Math.max(d.min,x));return d.type==='sel'||d.step>=1?Math.round(c):c;}
export function specVal(raw,d){if(raw&&typeof raw==='object'&&Array.isArray(raw.k)){const k=raw.k.filter(x=>x&&isFinite(+x.t)&&isFinite(+x.v)).slice(0,24).map(x=>({t:Math.max(0,+x.t),v:clampP(d,x.v),e:Math.min(11,Math.max(0,Math.round(+x.e||5)))})).sort((a,b)=>a.t-b.t);
    return k.length?{v:k[0].v,k}:d.def;}return clampP(d,raw);}
export function buildFromSpec(sp){if(!sp||!Array.isArray(sp.layers))throw new Error('A válaszban nincs rétegleírás.');
  const kids=[];for(const l of sp.layers.slice(0,14)){const d=l&&EFFECTS[l.type];if(!d||DESC_SKIP.has(l.type))continue;
    const o:any={name:String(l.name||d.name).slice(0,40),blend:BLEND_IDX[l.blend]!=null?l.blend:undefined,clip:!!l.clip,maskOnly:!!l.maskOnly&&d.kind==='shape'};
    if(isFinite(+l.pal))o.pal=Math.min(PALS.length-1,Math.max(0,Math.round(+l.pal)));
    for(const b of BASE){const raw=b.k==='opacity'?l.opacity:l[b.k];if(raw!=null)o[b.k]=specVal(raw,b);}
    o.p={};for(const pd of d.params){const raw=l.p&&l.p[pd.k];if(raw!=null)o.p[pd.k]=pd.type==='sel'||pd.type==='color'?clampP(pd,raw):specVal(raw,pd);}
    if(l.text&&(l.type==='text'||l.type==='mtext')){const T=l.text;o.text={str:String(T.str||'').slice(0,200)||'Látomás',font:String(T.font||'Bricolage Grotesque'),weight:String(T.weight||'700'),track:isFinite(+T.track)?+T.track:0,align:['left','center','right'].includes(T.align)?T.align:'center',lh:1.1};}
    if(l.tm&&typeof l.tm==='object'){const T=l.tm,n=(v,a,b,df)=>isFinite(+v)?Math.min(b,Math.max(a,+v)):df;o.tm={in:Math.round(n(T.in,0,8,0)),inAt:n(T.inAt,0,600,0),inDur:n(T.inDur,.05,5,.8),out:Math.round(n(T.out,0,8,0)),outAt:n(T.outAt,0,600,9),outDur:n(T.outDur,.05,5,.8),ease:Math.round(n(T.ease,0,11,5)),fps:[0,6,8,10,12,15,24].includes(+T.fps)?+T.fps:0};}
    if(l.type==='sdfscene')o.prims=undefined;
    try{kids.push(makeLayer(l.type,o));}catch(_){}}
  if(!kids.length)throw new Error('A válaszból nem jött létre használható réteg.');
  const g=makeGroup(String(sp.name||'Leírásból').slice(0,40),kids,{open:true});const items=[];
  const R=sp.baseRecipe&&RECIPES.find(r=>r.n===sp.baseRecipe);if(R)items.push(makeRecipe(R));items.push(g);
  let cam=null;if(sp.cam&&typeof sp.cam==='object'){cam=mkCam();cam.on=true;for(const d of CAMP)if(sp.cam[d.k]!=null)cam.n[d.k]=mkN(specVal(sp.cam[d.k],d));}
  return {items,cam,dur:isFinite(+sp.dur)?Math.min(120,Math.max(1,+sp.dur)):null};}
export function descModal(){
  const ta=h('textarea',{class:'txt',rows:'5',id:'descText','aria-label':'A jelenet leírása',placeholder:'Pl. Éjszakai város fölött lassan felkel a hold, a kamera előre úszik, a közepén rugóval beugrik a cím: „Holdkelte”, alatta kisebb felirat. Filmes, kékes-arany hangulat.'});
  try{ta.value=localStorage.getItem('latomas2.desc')||'';}catch(_){}
  const durS=h('select',{'aria-label':'Hossz',id:'descDur'},...[5,8,10,15,20].map(x=>{const o=h('option',{value:x},x+' mp');if(x===Math.round(st.dur))o.selected=true;return o;}));
  const modeS=h('select',{'aria-label':'Hová kerüljön',id:'descMode'},h('option',{value:'add'},'Hozzáadás a jelenethez'),h('option',{value:'replace'},'Új jelenet (a mostani lecserélése)'));
  const stat=h('p',{class:'small',id:'descStat'},'Claude a leírásból rétegeket, kulcskockákat, átmeneteket és szükség esetén kamerát rak össze. Az eredmény teljesen szerkeszthető, a ⌘Z visszavonja.');
  const go=h('button',{class:'btn accent',type:'button'},'Jelenet létrehozása');const stop=h('button',{class:'btn',type:'button',hidden:true},'Leállítás');let ctl=null;
  stop.onclick=()=>ctl&&ctl.abort();
  go.onclick=async()=>{const text=ta.value.trim();if(!text){ta.focus();return;}if(!R.SAMPLE){stat.textContent='Ebben a nézetben Claude nem érhető el.';return;}
    try{localStorage.setItem('latomas2.desc',text);}catch(_){}
    ctl=new AbortController();go.disabled=true;stop.hidden=false;stat.textContent='Claude gondolkodik… (általában 20–60 mp)';let chars=0;
    try{const sp=await R.SAMPLE.json(descPrompt(text,+durS.value),{signal:ctl.signal,cache:false,onText:({text})=>{chars=text.length;stat.textContent=`Claude írja a jelenetet… ${chars} karakter`;}});
      const r=buildFromSpec(sp);if(modeS.value==='replace')st.layers=[];
      for(const it of r.items)st.layers.push(it);if(r.cam)st.cam=r.cam;st.dur=r.dur||+durS.value;R.selId=r.items[r.items.length-1].id;R.time=0;resetFeedback();
      commit();renderAll();closeModal();setPlay(true);toast(`Kész: ${r.items[r.items.length-1].name} · ${r.items[r.items.length-1].children.length} réteg${r.cam?' · kamerával':''}`);}
    catch(e){const c=e&&e.code;stat.textContent=c==='cancelled'?'Leállítva.':c==='not_granted'||c==='sampling_disabled'?'Claude használata ennél a lapnál nincs engedélyezve.':c==='rate_limited'?'Most túl sok a kérés. Próbáld újra kicsit később.':c==='invalid_json'?'A válasz nem volt értelmezhető. Fogalmazd rövidebben, vagy próbáld újra.':c==='refused'?'Erre a leírásra Claude nem készít jelenetet. Fogalmazd át.':(e&&e.message)||'Nem sikerült. Próbáld újra.';
      if(c==='not_granted'||c==='sampling_disabled'){go.hidden=true;$('#descBtn').hidden=true;}}
    finally{go.disabled=false;stop.hidden=true;ctl=null;}};
  openModal(h('h2',null,'Leírásból animáció'),h('p',null,'Írd le, mit szeretnél látni: témát, hangulatot, színeket, szöveget, mozgást, kameramozgást.'),ta,
    h('div',{class:'row2'},h('span',null,'Hossz'),h('div',{class:'pop'},durS)),h('div',{class:'row2'},h('span',null,'Hová'),h('div',{class:'pop'},modeS)),stat,
    h('div',{class:'bar2'},h('button',{class:'btn',type:'button',onclick:()=>{ctl&&ctl.abort();closeModal();}},'Mégse'),stop,go));}
$('#descBtn').onclick=descModal;
