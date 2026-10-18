import { R } from './runtime';
import { $, h } from './dom';
import { PALS } from './palettes';
import { BASE, BLEND_IDX, EFFECTS, cpDefs, pdefOf } from './effects/index';
import { CODE_MAX, PRESET_SKIP, catalogText, specBody } from './presetfmt';
import { macroApply, macroRead, pathObj } from './macros';
import { makeGroup, makeLayer, mkN, st } from './state';
import { RECIPES, makeRecipe } from './recipes';
import { CAMP, mkCam, outSize } from './render';
import { commit, renderAll } from './history';
import { resetFeedback, setPlay } from './transport';
import { closeModal, openModal, toast } from './modals';

R.SAMPLE=null;try{window.claude&&window.claude.use&&window.claude.use('sample').then(s=>{R.SAMPLE=s;$('#descBtn').hidden=!s;}).catch(()=>{});}catch(_){}
export const DESC_SKIP=new Set([...PRESET_SKIP,'custom']);
export function descCatalog(){return catalogText(DESC_SKIP);}
export function descPrompt(text,dur){const {W,H}=outSize();
  return `You turn a scene description into a layered motion-design composition for a WebGL editor. Reply with ONLY one JSON object, no prose. Use 3–10 layers.

DESCRIPTION (any language; write on-screen text in the description's language):
"""${text.slice(0,4000)}"""

${specBody({W,H,dur,custom:false,macros:false})}`;}
export function clampP(d,v){if(d.type==='color')return /^#[0-9a-f]{6}$/i.test(String(v))?String(v):d.def;const x=Number(v);if(!isFinite(x))return d.def;const c=Math.min(d.max,Math.max(d.min,x));return d.type==='sel'||d.step>=1?Math.round(c):c;}
export function specVal(raw,d){if(raw&&typeof raw==='object'&&Array.isArray(raw.k)){const k=raw.k.filter(x=>x&&isFinite(+x.t)&&isFinite(+x.v)).slice(0,24).map(x=>({t:Math.max(0,+x.t),v:clampP(d,x.v),e:Math.min(11,Math.max(0,Math.round(+x.e||5)))})).sort((a,b)=>a.t-b.t);
    return k.length?{v:k[0].v,k}:d.def;}return clampP(d,raw);}
/** Spec (Claude description or pasted preset) → items. Everything is clamped; whatever cannot be used is listed in `dropped`
 *  (unknown effect, param, slider, macro target). opt.skip: layer types not allowed (default: the description path's list). */
export function buildFromSpec(sp,opt:any={}){if(!sp||!Array.isArray(sp.layers))throw new Error('The response has no layer description ("layers").');
  const skip=opt.skip||DESC_SKIP;const dropped=[];const kids=[];const byIdx=[];
  sp.layers.slice(0,14).forEach((l,li)=>{const d=l&&EFFECTS[l.type];const lname=String(l&&l.name||l&&l.type||'?').slice(0,40);
    if(!d){dropped.push(`${lname}: ismeretlen effekt (${l&&l.type})`);return;}if(skip.has(l.type)){dropped.push(`${lname}: this type cannot be used here (${l.type})`);return;}
    const o:any={name:String(l.name||d.name).slice(0,40),blend:BLEND_IDX[l.blend]!=null?l.blend:undefined,clip:!!l.clip,maskOnly:!!l.maskOnly&&d.kind==='shape'};
    if(isFinite(+l.pal))o.pal=Math.min(PALS.length-1,Math.max(0,Math.round(+l.pal)));
    for(const b of BASE){const raw=b.k==='opacity'?l.opacity:l[b.k];if(raw!=null)o[b.k]=specVal(raw,b);}
    let defs=d.params;
    if(l.type==='custom'){if(typeof l.code==='string'&&l.code.trim())o.code=l.code.slice(0,CODE_MAX);
      if(Array.isArray(l.sliders)){const ok=cpDefs(l.sliders);for(const c of l.sliders)if(!ok.find(x=>x.k===(c&&c.k)))dropped.push(`${lname}: invalid slider (${c&&c.k})`);
        o.cp=ok.map(x=>x.type==='color'?{k:x.k,l:x.l,color:true,def:x.def}:{k:x.k,l:x.l,min:x.min,max:x.max,def:x.def,...(x.step?{step:x.step}:{})});if(ok.length)defs=ok;}}
    o.p={};for(const k in (l.p&&typeof l.p==='object'?l.p:{})){const pd=defs.find(x=>x.k===k);if(!pd){dropped.push(`${lname}: unknown parameter (${k})`);continue;}const raw=l.p[k];if(raw!=null)o.p[k]=pd.type==='sel'||pd.type==='color'?clampP(pd,raw):specVal(raw,pd);}
    if(l.text&&(l.type==='text'||l.type==='mtext')){const T=l.text;o.text={str:String(T.str||'').slice(0,200)||'Vision',font:String(T.font||'Bricolage Grotesque'),weight:String(T.weight||'700'),track:isFinite(+T.track)?+T.track:0,align:['left','center','right'].includes(T.align)?T.align:'center',lh:1.1};}
    if(l.tm&&typeof l.tm==='object'){const T=l.tm,n=(v,a,b,df)=>isFinite(+v)?Math.min(b,Math.max(a,+v)):df;o.tm={in:Math.round(n(T.in,0,8,0)),inAt:n(T.inAt,0,600,0),inDur:n(T.inDur,.05,5,.8),out:Math.round(n(T.out,0,8,0)),outAt:n(T.outAt,0,600,9),outDur:n(T.outDur,.05,5,.8),ease:Math.round(n(T.ease,0,11,5)),fps:[0,6,8,10,12,15,24].includes(+T.fps)?+T.fps:0};}
    if(l.type==='sdfscene')o.prims=undefined;
    try{const L=makeLayer(l.type,o);kids.push(L);byIdx[li]=L;}catch(_){dropped.push(`${lname}: was not created`);}});
  if(sp.layers.length>14)dropped.push(`${sp.layers.length-14} layers over the limit of 14`);
  if(!kids.length)throw new Error('No usable layer came out of the response.'+(dropped.length?' Kimaradt: '+dropped.slice(0,4).join('; '):''));
  const g=makeGroup(String(sp.name||'From description').slice(0,40),kids,{open:true});
  for(const m of (Array.isArray(sp.macros)?sp.macros:[]).slice(0,4)){if(!m||!Array.isArray(m.t))continue;const lab=String(m.l||m.label||'Control').slice(0,30);const t=[];
    for(const x of m.t){const [li,path,a,b]=Array.isArray(x)?x:[];const L=byIdx[+li];const po=L&&typeof path==='string'?pathObj(L,path):null;
      const pd=po&&(po.g==='n'?BASE.find(q=>q.k===po.k):po.g==='p'?pdefOf(L,po.k):null);
      if(!po||!po.o||!pd||pd.type||!isFinite(+a)||!isFinite(+b)){dropped.push(`${lab}: invalid target (${li}, ${path})`);continue;}
      const cl=v=>po.lfo?Math.max(0,Math.min(pd.max-pd.min,+v)):Math.min(pd.max,Math.max(pd.min,+v));t.push([L.id,path,cl(a),cl(b)]);}
    if(!t.length)continue;const mm={l:lab,t,v:0};if(isFinite(+m.v)){macroApply(g,mm,Math.min(1,Math.max(0,+m.v)));}else mm.v=macroRead(g,mm);g.macros.push(mm);}
  if(Array.isArray(sp.macros)&&sp.macros.length>4)dropped.push(`${sp.macros.length-4} controls over the limit of 4`);
  const items=[];const Rc=sp.baseRecipe&&RECIPES.find(r=>r.n===sp.baseRecipe);if(sp.baseRecipe&&!Rc)dropped.push(`ismeretlen alaprecept (${sp.baseRecipe})`);if(Rc)items.push(makeRecipe(Rc));
  items.push(opt.single&&kids.length===1&&!g.macros.length&&!Rc?kids[0]:g);
  let cam=null;if(sp.cam&&typeof sp.cam==='object'){cam=mkCam();cam.on=true;for(const d of CAMP)if(sp.cam[d.k]!=null)cam.n[d.k]=mkN(specVal(sp.cam[d.k],d));}
  return {items,cam,dur:isFinite(+sp.dur)?Math.min(120,Math.max(1,+sp.dur)):null,dropped,macros:g.macros.length};}
export function descModal(){
  const ta=h('textarea',{class:'txt',rows:'5',id:'descText','aria-label':'Scene description',placeholder:'E.g. The moon slowly rises over a night city, the camera drifts forward, and in the middle the title springs in: “Moonrise”, with a smaller caption below. Cinematic, blue-gold mood.'});
  try{ta.value=localStorage.getItem('latomas2.desc')||'';}catch(_){}
  const durS=h('select',{'aria-label':'Hossz',id:'descDur'},...[5,8,10,15,20].map(x=>{const o=h('option',{value:x},x+' mp');if(x===Math.round(st.dur))o.selected=true;return o;}));
  const modeS=h('select',{'aria-label':'Where should it go',id:'descMode'},h('option',{value:'add'},'Add to the scene'),h('option',{value:'replace'},'New scene (replaces the current one)'));
  const stat=h('p',{class:'small',id:'descStat'},'Claude builds layers, keyframes, transitions and, if needed, a camera from the description. The result is fully editable, and ⌘Z undoes it.');
  const go=h('button',{class:'btn accent',type:'button'},'Create scene');const stop=h('button',{class:'btn',type:'button',hidden:true},'Stop');let ctl=null;
  stop.onclick=()=>ctl&&ctl.abort();
  go.onclick=async()=>{const text=ta.value.trim();if(!text){ta.focus();return;}if(!R.SAMPLE){stat.textContent='Claude is not available in this view.';return;}
    try{localStorage.setItem('latomas2.desc',text);}catch(_){}
    ctl=new AbortController();go.disabled=true;stop.hidden=false;stat.textContent='Claude is thinking… (usually 20–60 s)';let chars=0;
    try{const sp=await R.SAMPLE.json(descPrompt(text,+durS.value),{signal:ctl.signal,cache:false,onText:({text})=>{chars=text.length;stat.textContent=`Claude is writing the scene… ${chars} characters`;}});
      const r=buildFromSpec(sp);if(modeS.value==='replace')st.layers=[];
      for(const it of r.items)st.layers.push(it);if(r.cam)st.cam=r.cam;st.dur=r.dur||+durS.value;R.selId=r.items[r.items.length-1].id;R.time=0;resetFeedback();
      commit();renderAll();closeModal();setPlay(true);toast(`Done: ${r.items[r.items.length-1].name} · ${r.items[r.items.length-1].children.length} layers${r.cam?' · with camera':''}`);}
    catch(e){const c=e&&e.code;stat.textContent=c==='cancelled'?'Stopped.':c==='not_granted'||c==='sampling_disabled'?'Using Claude is not enabled on this page.':c==='rate_limited'?'Too many requests right now. Try again a little later.':c==='invalid_json'?'The response could not be interpreted. Phrase it more briefly, or try again.':c==='refused'?'Claude will not make a scene from this description. Rephrase it.':(e&&e.message)||'It did not work. Try again.';
      if(c==='not_granted'||c==='sampling_disabled'){go.hidden=true;$('#descBtn').hidden=true;}}
    finally{go.disabled=false;stop.hidden=true;ctl=null;}};
  openModal(h('h2',null,'Animation from a description'),h('p',null,'Describe what you want to see: topic, mood, colors, text, motion, camera movement.'),ta,
    h('div',{class:'row2'},h('span',null,'Hossz'),h('div',{class:'pop'},durS)),h('div',{class:'row2'},h('span',null,'Where'),h('div',{class:'pop'},modeS)),stat,
    h('div',{class:'bar2'},h('button',{class:'btn',type:'button',onclick:()=>{ctl&&ctl.abort();closeModal();}},'Cancel'),stop,go));}
$('#descBtn').onclick=descModal;
