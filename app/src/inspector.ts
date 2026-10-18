import { R } from './runtime';
import { colorSummary } from './colorsum';
import { $, h } from './dom';
import { SVG_X, BASEK, EFFECTS, KIND_LABEL, PRIM_DEF, PRIM_OP, PRIM_T, S, SEL, iconKind, kindOf, paramsOf, animKeysOf, mainDupOf, pdefOf } from './effects/index';
import { getProg, progError } from './gl';
import { mkN, sel, st } from './state';
import { macroApply } from './macros';
import { RECIPES } from './recipes';
import { ANIM_SYM, ANIM_TIP, KEY_EPS, animKinds, hasK, keyEditor, keyVal, seekTo } from './evaluation';
import { EASES, MOVES } from './render';
import { ungroup } from './itemops';
import { renderLayers } from './layers';
import { blendRow, ctlParam, ctlSelect, ctlSlider, ctlSwitch, fxListUI, palettePicker, scrubField, section } from './controls';
import { commit, scheduleSave } from './history';
import { paramList, renderTimeline } from './timeline';
import { tempoItem } from './retime';
import { markDirty } from './loop';
import { showCode, toast } from './modals';
import { childVariantSection, linkSection, variantSection } from './variantsui';
import { linesSection } from './textlines';
import { spineSection } from './spinegrips';
import { lightSection, usesLight } from './lightui';
import { lottieMeta } from './lottie';
import { effectName, effectDescription, GROUP_EN } from './effectcopy';

export function renderInsp(){
  if(R.updTextbar)R.updTextbar();
  {const L0=sel();const ob=document.querySelector('[data-tool=orbit]');if(ob)ob.classList.toggle('hint3d',!!L0&&(L0.type==='obj3d'||L0.type==='sdfscene'||L0.type==='surface3d'||L0.type==='cloud3d'||L0.type==='terrain3d'));}
  renderTimeline();const P=$('#insp');P.innerHTML='';R.liveCtl=[];R.liveFields=[];R.liveKed=[];R.liveSel=[];
  const L=sel();
  if(!L){P.appendChild(h('div',{class:'empty'},'Select a layer, or start with a recipe from the Library.'));return;}
  const k=kindOf(L);const isG=L.type==='group';const d=isG?null:EFFECTS[L.type];
  const TB={content:[],look:[],motion:[],fx:[],place:[]};const T=(tab,el)=>{if(el)TB[tab].push(el);};
  const nm=h('input',{class:'nm',value:L.name,'aria-label':'Layer name'});nm.onchange=()=>{L.name=nm.value||L.name;commit();renderLayers();};
  P.appendChild(h('div',{class:'ihead'},h('span',{class:'lic',html:iconKind(k)}),h('div',{class:'tt'},nm,h('small',null,isG?(L.macros.length?'Recept · csoport':'Csoport'):(KIND_LABEL[k]+(d.name!==L.name?' · '+effectName(L.type,d.name):'')))),
    h('button',{class:'btn',title:'Save as a preset in your Library (choose a shelf)','aria-label':'Save as preset',onclick:()=>R.savePreset&&R.savePreset(L)},'☆')));
  {const cs=colorSummary(L);if(cs)P.appendChild(cs);}  // U5: Színek sor
  if(isG){
    const Rc=RECIPES.find(r=>r.n===L.recipe);if(Rc)T('content',h('p',{class:'desc'},Rc.desc));
    if(L.layout&&R.layoutControls)T('content',section('Layout','macro',true,R.layoutControls(L,h)));
    if(L.macros.length)T('content',section('Controls','macro',true,...L.macros.map(m=>{const o={v:m.v,a:0};return ctlSlider(o,{k:'m',l:m.l,min:0,max:1},{big:true,noAnim:true,onInput:()=>macroApply(L,m,o.v)});})));
    T('look',section('Appearance','blend',true,blendRow(L),ctlSlider(L.n.opacity,BASEK.opacity),ctlSwitch('Clip to layer below',L.clip,v=>{L.clip=v;commit();renderLayers();})));
    T('fx',section('Csoporteffektek','fx',true,fxListUI(L)));
    T('motion',motionSummary(L));T('motion',R.moUI?R.moUI(L):timingSection(L));
    T('place',placement(L,'Placement (whole group)'));
    T('content',section('Layers','grp',true,h('p',{class:'small'},`It contains ${L.children.length} layers. Open it in the layer tree to fine-tune any of them.`),
      h('div',{class:'btnrow'},h('button',{class:'btn',onclick:()=>{L.open=!L.open;renderLayers();renderInsp();}},L.open?'Hide layers':'Show layers'),h('button',{class:'btn',onclick:()=>ungroup(L)},'Ungroup'))));
    T('content',variantSection(L));T('motion',linkSection(L));
    tabbed(P,L,TB);return;}
  {const er=progError(L);if(er&&L.type!=='custom')T('content',h('div',{class:'errbox'},'This effect could not compile on this device and will render empty. Copy the error below when reporting the problem.',h('pre',null,er)));}
  if(d.groups){
    d.groups.forEach(gr=>{const kids=gr.keys.map(key=>{const pd=d.params.find(p=>p.k===key);return pd?ctlParam(L,pd):null;}).filter(Boolean);
      if(gr.text){const ti=h('input',{class:'txt',value:L.btext||'','aria-label':'Custom label template'});ti.oninput=()=>{L.btext=ti.value;};ti.onchange=commit;
        kids.push(h('div',{class:'ctl'},h('div',{class:'top'},h('span',{class:'lab'},'Custom label template')),ti,h('p',{class:'small'},'Placeholders: {id} {x} {y} {w} {h} {v}. New line: \\n')));}
      T(/(fény|anyag|szín|stúdió|tükör)/i.test(gr.t)?'look':'content',section(GROUP_EN[gr.t] || gr.t,'g:'+gr.t,!!gr.open,...kids));});
    if(d.mesh)T('place',spineSection(L));
    if(d.usesPal)T('look',section('Palette (for Coloring mode)','color',false,palettePicker(L),ctlSlider(L.n.hue,BASEK.hue)));
    T('look',section('Appearance','blend',true,ctlSlider(L.n.opacity,{...BASEK.opacity,l:'Strength'}),ctlSwitch('Clip to layer below',L.clip,v=>{L.clip=v;commit();renderLayers();})));
    T('fx',section('Layer effects','fx',true,fxListUI(L)));
    T('motion',motionSummary(L));T('motion',linkSection(L));
    if(!d.mesh)T('content',section('Details','details',false,h('div',{class:'btnrow'},h('button',{class:'btn',onclick:()=>showCode(L)},'Open GLSL code'))));
    T('content',h('p',{class:'desc'},effectDescription(L.type,d.desc)));tabbed(P,L,TB,true);return;}
  const PS=paramsOf(L);const AK=animKeysOf(L),DUP=mainDupOf(L);
  // U4: motion params live on the Mozgás tab; a few main ones (DUP) stay here too and edit the same value
  const mainKeys=(L.type==='custom'&&PS!==d.params?PS.map(p=>p.k):d.main||PS.slice(0,3).map(p=>p.k)).filter(k=>!AK.includes(k)||DUP.includes(k));
  const mainKids=[];
  if(L.type==='lottie'){
    let meta:any=null;try{meta=lottieMeta(L.asset)?.meta;}catch(_){}
    mainKids.push(h('p',{class:'small'},meta?`Vektoros Lottie · ${meta.width} × ${meta.height} · ${meta.duration.toFixed(1)} mp`:'Missing or invalid Lottie asset. Reopen the original project file.'));
    mainKids.push(h('button',{class:'btn',onclick:()=>R.openLottie&&R.openLottie()},'Add another vector animation…'));
    const start={v:L.media.start},speed={v:L.media.speed};
    T('motion',section('Media timing','lottie-time',true,
      h('p',{class:'small'},'Media timing is independent of the scene and keyframe loops.'),
      ctlSlider(start,{k:'start',l:'Start (s)',min:0,max:Math.max(600,st.dur),def:0,step:.01},{noAnim:true,onInput:()=>{L.media.start=start.v;markDirty();renderTimeline();}}),
      ctlSlider(speed,{k:'speed',l:'Speed',min:.05,max:8,def:1,step:.01},{noAnim:true,onInput:()=>{L.media.speed=speed.v;markDirty();renderTimeline();}}),
      ctlSwitch('Media Loop',L.media.loop,v=>{L.media.loop=v;commit();renderTimeline();})));
  }
  if(L.type==='text'||L.type==='mtext'||d.usesText){const ti=h('textarea',{class:'txt',rows:String(Math.min(5,Math.max(1,String(L.text.str).split('\n').length))),'aria-label':'Text (Enter = new line)'});ti.value=L.text.str;ti.oninput=()=>{L.text.str=ti.value;ti.rows=Math.min(5,Math.max(1,ti.value.split('\n').length));};ti.onchange=commit;
    const FONTS=['Bricolage Grotesque','Instrument Sans','Fraunces','Cinzel','Unbounded','Syne','Orbitron','Major Mono Display','Bodoni Moda'];
    const fs=h('select',{'aria-label':'Font'},...FONTS.map(f=>{const o=h('option',null,f);if(f===L.text.font)o.selected=true;return o;}));fs.onchange=()=>{L.text.font=fs.value;commit();};
    const ws=h('select',{'aria-label':'Weight'},...[['300','Thin'],['400','Normal'],['500','Medium'],['700','Semibold'],['800','Extra']].map(w=>{const o=h('option',{value:w[0]},w[1]);if(w[0]===L.text.weight)o.selected=true;return o;}));ws.onchange=()=>{L.text.weight=ws.value;commit();};
    const tr={v:L.text.track,a:0};mainKids.push(ti,h('div',{class:'row2'},h('span',null,'Font'),h('div',{class:'pop'},fs)),h('div',{class:'row2'},h('span',null,'Weight'),h('div',{class:'pop'},ws)),
      ctlSlider(tr,S('track','Letter spacing',-.1,1,.12),{noAnim:true,onInput:()=>{L.text.track=tr.v;}}));
    const AL=[['left','Balra'],['center','Center'],['right','Jobbra']];const alo={get v(){return Math.max(0,AL.findIndex(a=>a[0]===(L.text.align||'center')));},set v(x){L.text.align=AL[Math.round(x)][0];}};
    const lho={v:L.text.lh??1.15,a:0},wro={v:L.text.wrap||0,a:0};
    mainKids.push(ctlSelect(alo,SEL('align','Alignment',AL.map(a=>a[1]),1)),ctlSlider(lho,S('lh','Line spacing',.7,2,1.15),{noAnim:true,onInput:()=>{L.text.lh=lho.v;}}),
      ctlSlider(wro,S('wrap','Wrap (characters per line, 0 = off)',0,60,0,1),{noAnim:true,onInput:()=>{L.text.wrap=Math.round(wro.v);}}),
      h('p',{class:'small'},'With left alignment, the layer position is at the text\'s left edge; with right alignment, it is at the right edge. Press Enter for multiple lines.'));}
  if(L.type==='particles'&&Math.round(L.p.source.v)===1)mainKids.push(h('div',{class:'btnrow'},h('button',{class:'btn accent',onclick:()=>$('#fileImg').click()},L.asset?'Choose another image…':'Choose image…')));
  if(L.type==='image')mainKids.push(h('div',{class:'btnrow'},h('button',{class:'btn accent',onclick:()=>$('#fileImg').click()},L.asset?'Choose another image…':'Choose image…')));
  if(L.type==='custom'){const ta=h('textarea',{class:'code',spellcheck:'false','aria-label':'GLSL code'});ta.value=L.code;const msg=h('div',{class:'msg'});
    const check=()=>{getProg(L);const e=progError(L);msg.className='msg '+(e?'err':'ok');msg.textContent=e||'Compiled ✓';};let tmo;
    ta.oninput=()=>{clearTimeout(tmo);tmo=setTimeout(()=>{L.code=ta.value;check();scheduleSave();},350);};ta.onchange=()=>{L.code=ta.value;commit();};
    ta.onkeydown=e=>{if(e.key==='Tab'){e.preventDefault();ta.setRangeText('  ',ta.selectionStart,ta.selectionEnd,'end');ta.dispatchEvent(new Event('input'));}};mainKids.push(ta,msg);if(R.cpEditor)mainKids.push(R.cpEditor(L));setTimeout(check,0);}
  for(const key of mainKeys){const pd=PS.find(p=>p.k===key);if(pd)mainKids.push(ctlParam(L,pd,true));}
  if(R.moMain)mainKids.push(...R.moMain(L));
  if(L.type==='sdfscene')T('content',sdfObjectsSection(L));
  if(R.pathSection){const ps=R.pathSection(L);if(ps)T('content',ps);}
  T('content',section(k==='fx'?'Filter':'Main controls','main',true,...mainKids));
  const detKids=PS.filter(p=>!mainKeys.includes(p.k)&&!AK.includes(p.k)).map(pd=>ctlParam(L,pd));
  if(L.type!=='custom')detKids.push(h('div',{class:'btnrow'},h('button',{class:'btn',onclick:()=>showCode(L)},'Open GLSL code')));
  T('content',section('Details (less common settings)','details',false,...detKids));
  if(usesLight(L))T('look',lightSection(L));
  if((k!=='fx'&&!d.noPal)||d.usesPal)T('look',section('Color','color',true,palettePicker(L),ctlSlider(L.n.hue,BASEK.hue)));
  const blendKids=k==='fx'?[ctlSlider(L.n.opacity,{...BASEK.opacity,l:'Strength'})]:[blendRow(L),ctlSlider(L.n.opacity,BASEK.opacity),ctlSlider(L.n.key,BASEK.key)];
  T('look',section('Appearance','blend',true,...blendKids));
  const maskKids=[ctlSwitch('Clip to layer below',L.clip,v=>{L.clip=v;commit();renderLayers();})];
  if(k==='shape')maskKids.push(ctlSwitch('Mask only (invisible)',L.maskOnly,v=>{L.maskOnly=v;commit();renderLayers();}));
  maskKids.push(h('p',{class:'small'},k==='shape'?'Enable clipping on layers above so they appear only inside this shape.':'When enabled, this layer appears only within the layer below, such as a shape.'));
  T('look',section('Maszk','mask',L.clip||L.maskOnly||k==='shape',...maskKids));
  T('fx',section('Layer effects','fx',true,fxListUI(L)));
  if(AK.length){const cp=key=>ctlParam(L,pdefOf(L,key));T('motion',section(L.type==='mtext'?'Text motion':'Motion settings','animp',true,...AK.slice(0,8).map(cp)));
    if(AK.length>8)T('motion',section('Motion details','animp2',false,...AK.slice(8).map(cp)));}
  T('motion',motionSummary(L));if(k!=='fx')T('motion',R.moUI?R.moUI(L):timingSection(L));
  T('place',placement(L,k==='fx'?'Center':'Placement'));
  const ls=linesSection(L);T('content',ls);
  T('content',childVariantSection(L));
  T('motion',linkSection(L));
  T('content',h('p',{class:'desc'},effectDescription(L.type,d.desc)));
  tabbed(P,L,TB);
}
export function timingSection(L){
  // defaults are shown but only written into the layer on the first edit (opening the panel must not change the project)
  const T=L.tm||{in:0,inAt:0,inDur:.8,out:0,outAt:Math.max(0,(st.dur||10)-1),outDur:.8,ease:0};const own=()=>{if(!L.tm)L.tm=T;};
  const X=k=>({get v(){return T[k];},set v(x){own();T[k]=x;renderTimeline();}});const mx=Math.max(10,st.dur||10);
  return section('Timing (entrance, exit, frame rate)','timing',!!(T.in||T.out||T.fps),
    ctlSelect(X('in'),SEL('in','Entrance',MOVES,0)),ctlSlider(X('inAt'),S('inAt','Entrance start (s)',0,mx,0),{noAnim:true}),ctlSlider(X('inDur'),S('inDur','Entrance duration (s)',.05,5,.8),{noAnim:true}),
    ctlSelect(X('out'),SEL('out','Exit',MOVES,0)),ctlSlider(X('outAt'),S('outAt','Exit start (s)',0,mx,0),{noAnim:true}),ctlSlider(X('outDur'),S('outDur','Exit duration (s)',.05,5,.8),{noAnim:true}),
    ctlSelect(X('ease'),SEL('ease','Easing',EASES.map(e=>e[0]),0)),
    ctlSelect(fpsObj(T,()=>{own();renderTimeline();}),SEL('fps','Frame rate (posterize time)',FPS_OPTS.map(o=>o[1]),0)),
    h('p',{class:'small'},'Entrance and exit appear on the timeline when the layer is selected. A lower frame rate creates choppier motion; 12 or 8 frames/s feels hand-drawn.'));}
export const FPS_OPTS=[[0,'Folyamatos'],[24,'24 kocka/mp (mozi)'],[15,'15 kocka/mp'],[12,'12 frames/s (animation)'],[10,'10 kocka/mp'],[8,'8 kocka/mp (stop motion)'],[6,'6 kocka/mp']];
export function fpsObj(T,after){return {get v(){const i=FPS_OPTS.findIndex(o=>o[0]===(T.fps||0));return i<0?0:i;},set v(x){T.fps=(FPS_OPTS[Math.round(x)]||FPS_OPTS[0])[0];after&&after();}};}
export function sdfObjectsSection(L){
  const P=L.prims;L.psel=Math.max(0,Math.min(L.psel|0,P.length-1));
  const chips=h('div',{class:'chips'},...P.map((o,i)=>h('button',{class:'chip','aria-pressed':String(i===L.psel),onclick:()=>{L.psel=i;renderInsp();markDirty();}},`${['+','−','∩'][o.op|0]} ${PRIM_T[o.t|0]} ${i+1}`)));
  const btns=h('div',{class:'btnrow'},
    h('button',{class:'btn',disabled:P.length>=8,onclick:()=>{P.push({...PRIM_DEF,c:Math.round(Math.random()*100)/100,x:Math.round((Math.random()-.5)*60)/100,y:Math.round((Math.random()-.5)*40)/100});L.psel=P.length-1;commit();renderInsp();}},'+ New object'),
    h('button',{class:'btn',disabled:!P.length||P.length>=8,onclick:()=>{const o=P[L.psel];P.splice(L.psel+1,0,{...o,x:o.x+.15});L.psel++;commit();renderInsp();}},'Duplicate'),
    h('button',{class:'btn',disabled:P.length<=1,onclick:()=>{P.splice(L.psel,1);L.psel=Math.max(0,L.psel-1);commit();renderInsp();}},'Delete'));
  const tip=h('div',{class:'tipbox'},h('b',null,'How to shape it:'),'1. Select a shape from the chips, or add a new one.','2. Drag on the canvas to move it. Use the square handle to scale and the colored dot to rotate.','3. Orbit the camera with the 3D Orbit tool (O, the cube above the canvas).','4. Add, Subtract (cut a hole) or Intersect; Smooth blend joins them like clay.');
  const kids=[tip,chips,btns];const o=P[L.psel];
  if(o){const X=k=>({get v(){return o[k];},set v(x){o[k]=(k==='sx'||k==='sy'||k==='sz')?Math.max(.02,x):x;markDirty();}});
    kids.push(ctlSelect(X('t'),SEL('t','Forma',PRIM_T,0)),ctlSelect(X('op'),SEL('op','Operation',PRIM_OP,0)),
      h('div',{class:'grid2'},scrubField('X',X('x'),S('x','X',-3,3,0),.006),scrubField('Y',X('y'),S('y','Y',-3,3,0),.006),scrubField('Z',X('z'),S('z','Z',-3,3,0),.006),h('span')),
      h('div',{class:'grid2'},scrubField('Width',X('sx'),S('sx','Width',.02,3,.3),.004),scrubField('Mag.',X('sy'),S('sy','Mag.',.02,3,.3),.004),scrubField('Depth',X('sz'),S('sz','Depth',.02,3,.3),.004),h('span')),
      ctlSlider(X('k'),S('k','Smooth blend',.001,1,.15),{noAnim:true}),ctlSlider(X('c'),S('c','Color (palette)',0,1,.5),{noAnim:true}),
      ctlSlider(X('rx'),S('rx','Rotation X °',-180,180,0),{noAnim:true}),ctlSlider(X('ry'),S('ry','Rotation Y °',-180,180,0),{noAnim:true}));}
  kids.push(h('p',{class:'small'},'Drag the selected object on the canvas to move it. Use the square handle to scale and the colored dot to rotate. Orbit the camera with the 3D Orbit tool (O). Up to eight objects.'));
  return section('Objektumok','sdfobj',true,...kids);}
export function placement(L,title){
  const curves=h('div',{class:'kcurves'});
  const upd=()=>{curves.replaceChildren();const ks=[['x','X'],['y','Y'],['s','Size'],['r','Angle'],['z','Depth']].filter(([k])=>hasK(L.n[k]));if(!ks.length)return;
    curves.appendChild(h('div',{class:'chips'},...ks.map(([k,l])=>{const b=h('button',{class:'chip',type:'button'},l+' curve');let ed=null;
      b.onclick=()=>{if(ed){ed.remove();ed=null;b.setAttribute('aria-pressed','false');return;}curves.querySelectorAll('.ked').forEach(x=>x.remove());curves.querySelectorAll('.chip').forEach(x=>x.setAttribute('aria-pressed','false'));ed=keyEditor(L.n[k],BASEK[k],l);curves.appendChild(ed);b.setAttribute('aria-pressed','true');};return b;})));};
  const g=h('div',{class:'grid2'},scrubField('X',L.n.x,BASEK.x,.004,upd),scrubField('Y',L.n.y,BASEK.y,.004,upd),scrubField('Size',L.n.s,BASEK.s,.006,upd),scrubField('Angle',L.n.r,BASEK.r,.5,upd),scrubField('Depth',L.n.z,BASEK.z,.01,upd));upd();
  const reset=h('button',{class:'btn',onclick:()=>{for(const k of ['x','y','r','spin'])L.n[k]=mkN(0);delete L.n.s.k;L.n.s=mkN(L.type==='text'?.16:(L.type==='image'||L.type==='lottie')?.8:1);commit();renderInsp();}},'Alaphelyzet');
  return section(title,'place',['x','y','s','r'].some(k=>hasK(L.n[k])),g,curves,h('p',{class:'small'},'◆ adds a keyframe at the current time (K adds all four). Dragging a keyed value on the canvas also creates a keyframe.'),ctlSlider(L.n.spin,BASEK.spin),h('div',{class:'btnrow'},reset));}

/* ----- U1: tabbed inspector ----- */
export const ITABS:[string,string,string][]=[
  ['content','Tartalom','<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M5 6h14M12 6v13M9 19h6"/></svg>'],
  ['look','Color and appearance','<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M12 3.5c3.5 4.2 6 7.4 6 10.5a6 6 0 0 1-12 0c0-3.1 2.5-6.3 6-10.5z"/></svg>'],
  ['motion','Motion','<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 18c4 0 5-12 9-12s5 6 9 6"/><path d="M9 4.5 11 6.5 9 8.5 7 6.5z" fill="currentColor"/></svg>'],
  ['fx','Effektek','<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M10 3l1.7 4.6L16.5 9.3l-4.8 1.7L10 15.6l-1.7-4.6L3.5 9.3l4.8-1.7z"/><path d="M17.5 14l.9 2.3 2.3.9-2.3.9-.9 2.3-.9-2.3-2.3-.9 2.3-.9z"/></svg>'],
  ['place','Placement','<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v18M3 12h18M12 3l-2.5 2.5M12 3l2.5 2.5M12 21l-2.5-2.5M12 21l2.5-2.5M3 12l2.5-2.5M3 12l2.5 2.5M21 12l-2.5-2.5M21 12l-2.5 2.5"/></svg>']];
R.itab=(()=>{try{return localStorage.getItem('vel.itab')||'content';}catch(_){return 'content';}})();
export function setITab(t){R.itab=t;try{localStorage.setItem('vel.itab',t);}catch(_){}document.querySelectorAll('#insp .itab').forEach((b:any)=>b.setAttribute('aria-selected',String(b.dataset.tab===t)));
  document.querySelectorAll('#insp .ipane').forEach((p:any)=>p.hidden=p.dataset.tab!==t);}
/** Tab bar + one pane per tab. Empty tabs are hidden; the Mozgás tab carries a dot when anything animates, Effektek the chain length. */
function tabbed(P,L,TB,_noTiming?){
  const anim=layerAnimated(L);const fxN=(L.fx||[]).length;
  const avail=ITABS.filter(([k])=>TB[k].length);if(!avail.some(([k])=>k===R.itab))R.itab=avail[0]?avail[0][0]:'content';
  const bar=h('div',{class:'itabs',role:'tablist','aria-label':'Properties'},...avail.map(([k,l,ic])=>{const b=h('button',{class:'itab',type:'button',role:'tab','data-tab':k,'aria-selected':String(k===R.itab),title:l,'aria-label':l,html:ic});
    if(k==='motion'&&anim)b.appendChild(h('i',{class:'itab-dot',title:'Has animation'}));if(k==='fx'&&fxN)b.appendChild(h('i',{class:'itab-n'},String(fxN)));b.onclick=()=>setITab(k);return b;}));
  P.appendChild(bar);P.appendChild(h('div',{class:'itab-title'},(ITABS.find(t=>t[0]===R.itab)||ITABS[0])[1]));
  for(const [k] of avail)P.appendChild(h('div',{class:'ipane','data-tab':k,role:'tabpanel',hidden:k!==R.itab},...TB[k]));
  bar.addEventListener('click',()=>{const t=P.querySelector('.itab-title');if(t)t.textContent=(ITABS.find(x=>x[0]===R.itab)||ITABS[0])[1];});}
export function layerAnimated(L){return paramList(L).some(q=>animKinds(q.o))||!!(L.tm&&(L.tm.in||L.tm.out))||!!(L.mo&&L.mo.length);}
/** Mozgás tab head: Animálás mode, Eljátszás, and every animated parameter of the layer with what drives it. */
/** Időzítés gyorsan · Tempó-chip: ½× · 1× · 2× + fine slider. A real retime of the item's data (retime.tempoItem), one undo step. */
export function tempoRow(L){const cur=L.tpo||1,fmt=v=>(v<1&&Math.abs(v-.5)<1e-3?'½':(Math.round(v*100)/100).toString().replace('.',','))+'×';
  const set=v=>{v=Math.min(4,Math.max(.25,v));if(Math.abs(v-cur)<1e-3)return;const n=tempoItem(L,v/cur);commit();renderTimeline();renderInsp();markDirty();toast(`Tempo ${fmt(v)} · ${L.type==='group'?'all group motion':'all layer motion'} retimed (${n} keys) · ⌘Z to undo`);};
  const chips=[.5,1,2].map(v=>h('button',{class:'chip'+(Math.abs(cur-v)<1e-3?' on':''),type:'button','aria-pressed':String(Math.abs(cur-v)<1e-3),title:v===1?'Original tempo':v<1?'Half speed (all motion takes twice as long)':'Twice as fast',onclick:()=>set(v)},fmt(v)));
  const lab=h('span',{class:'small tpov'},fmt(cur));
  const rg=h('input',{type:'range',min:'-2',max:'2',step:'0.05',value:String(Math.log2(cur)),'aria-label':'Fine tempo',title:'Fine tempo (¼× … 4×); retime on release'});
  rg.oninput=()=>{lab.textContent=fmt(Math.pow(2,+rg.value));};rg.onchange=()=>set(Math.round(Math.pow(2,+rg.value)*100)/100);
  return h('div',{class:'arow tporow',title:'All motion on this item—keyframes, entrance/exit and attached motions—speeds up or slows down relative to the motion block start.'},h('span',{class:'asym'},'⏱'),h('span',{class:'aname'},'Tempo'),...chips,rg,lab);}
export function motionSummary(L){
  const prs=paramList(L).map(q=>({...q,kinds:animKinds(q.o)})).filter(q=>q.kinds);const blk=!!(L.tm&&(L.tm.in||L.tm.out));
  const am=h('button',{class:'btn'+(R.animMode?' rec':''),type:'button','aria-pressed':String(!!R.animMode),title:'A'},R.animMode?'● Animate on (A)':'Animate (A)');
  am.onclick=()=>{import('./animate').then(m=>{m.setAnimMode(!R.animMode);renderInsp();});};
  const pf=h('button',{class:'btn'+(R.perform?' rec':''),type:'button','aria-pressed':String(!!R.perform),title:'E'},R.perform?'● Perform armed (E)':'Perform (E)');
  pf.onclick=()=>{import('./perform').then(m=>{m.setPerform(!R.perform);renderInsp();});};
  const rows=prs.map(q=>{const o=q.o;const kids=[h('span',{class:'asym',title:[...q.kinds].map(c=>ANIM_TIP[c]).join(', ')},[...q.kinds].map(c=>ANIM_SYM[c]).join(' ')),h('span',{class:'aname'},q.label)];
    if(hasK(o)){kids.push(h('span',{class:'small'},o.k.length+' kulcs'));
      const nx=h('button',{class:'eye',type:'button',title:'Next keyframe','aria-label':q.label+': next keyframe'},'›');nx.onclick=()=>{const t=o.k.find(x=>x.t>R.time+KEY_EPS);seekTo(t?t.t:o.k[0].t);};kids.push(nx);}
    const rm=h('button',{class:'eye',type:'button',title:'Remove animation from this parameter (undoable)','aria-label':q.label+': remove animation',html:SVG_X});
    rm.onclick=()=>{if(hasK(o)){o.v=keyVal(o.k,R.time);delete o.k;}o.a=0;o.s='';commit();renderInsp();};if(q.kinds!=='l')kids.push(rm);
    return h('div',{class:'arow'},...kids);});
  if(blk)rows.unshift(h('div',{class:'arow'},h('span',{class:'asym'},ANIM_SYM.b),h('span',{class:'aname'},'Entrance / exit'),h('span',{class:'small'},'Timing below')));
  const moved=rows.length||blk||(L.mo&&L.mo.length)||(L.type==='group'&&(L.children||[]).some(c=>(c.mo&&c.mo.length)||(c.tm&&(c.tm.in||c.tm.out))||paramList(c).some(q=>animKinds(q.o))));
  if(moved)rows.push(tempoRow(L));
  return section('Animation','anim',true,h('div',{class:'btnrow'},am,pf),
    rows.length?h('div',{class:'alist'},...rows):h('p',{class:'small'},'This layer has no animation yet. Turn on Animate (A), then drag the layer or adjust a slider to add a keyframe. Symbols: ◆ keyframe · ∿ wave · ♪ audio/cue · ⇢ link · ▭ motion block.'));}

R.renderInsp=renderInsp;R.setITab=setITab;
