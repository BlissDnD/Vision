import { motionName, motionParam as displayMotionParam } from './motioncopy';
import { effectName, effectParam } from './effectcopy';
import { R } from './runtime';
import { cyclesIn, loopLen } from './time';
import { $, h } from './dom';
import { BASEK, BENTO, EFFECTS, pdefOf } from './effects/index';
import { findItem, sel, st } from './state';
import { ANIM_SYM, ANIM_TIP, KEY_EASES, KEY_EPS, animKinds, delKey, hasK, keyIdx, seekTo, setKey } from './evaluation';
import { textCache } from './text';
import { openCam } from './render';
import { renderLayers } from './layers';
import { renderInsp } from './inspector';
import { commit, renderAll } from './history';
import { fmtT, resetFeedback } from './transport';
import { AUD, audioRestart } from './signals';
import { markDirty } from './loop';
import { toast } from './modals';
import { addCue, blockOf, removeCue, shiftBlock, stretchBlock } from './retime';
import { MO, XF_GETS, effMo, moClip, moParam, xfSrc } from './motion';
import { lottieMeta } from './lottie';

export const tlHeadEl=$('#tlHead'),tlTrack=$('#tlTrack');
/* timing segments of a layer: [{a,b,cls,f:[[group,key],…]}] – f = fields that shift together when the bar is dragged */
const moById=(L,g)=>(L.mo||[]).find(m=>'mo:'+m.id===g);
const segGet=(L,g,k)=>g==='tm'?L.tm[k]:g==='media'?L.media[k]:g.startsWith('mo:')?(moById(L,g)||{p:{[k]:{v:0}}}).p[k].v:L.p[k].v;
const segSet=(L,g,k,v)=>{if(g==='tm')L.tm[k]=v;else if(g==='media')L.media[k]=v;else if(g.startsWith('mo:')){const m=moById(L,g);if(m)m.p[k].v=v;}else L.p[k].v=v;};
const keyLoopRange=L=>{let a=Infinity,b=-Infinity;for(const q of paramList(L))if(q.o.k&&q.o.k.length){a=Math.min(a,q.o.k[0].t);b=Math.max(b,q.o.k[q.o.k.length-1].t);}return b>a?{a,b}:null;};
export function layerSegs(L){const out=[];const add=(a,b,cls,f)=>{if(b>a)out.push({a,b,cls,f});};if(!L||L.type==='group'&&!L.tm&&!(L.mo&&L.mo.length))return out;
  const T=L.tm;if(T&&T.in)add(T.inAt,T.inAt+T.inDur,'',[['tm','inAt']]);if(T&&T.out)add(T.outAt,T.outAt+T.outDur,'out',[['tm','outAt']]);
  for(const m of L.mo||[])if(m.t==='spring'&&m.on!==false)add(m.p.at.v,m.p.at.v+m.p.dur.v,'mo',[['mo:'+m.id,'at']]);
  if(L._klSet){const kl=keyLoopRange(L);if(kl)add(kl.b,Math.max(kl.b+.01,st.dur),'kloop',[]);}
  if(L.type==='group')return out;const P=k=>L.p[k].v;
  if(L.type==='lottie'){const meta=lottieMeta(L.asset)?.meta;const a=L.media?.start||0;const b=meta?a+meta.duration/Math.max(.05,L.media?.speed||1):st.dur;add(a,L.media?.loop?Math.max(a+.01,st.dur):b,'lottie',[['media','start']]);}
  if(L.type==='mtext'){const tc=textCache.get(L.id),u=Math.round(P('unit'));const n=tc&&tc.info?(u===0?tc.info[0]:u===1?tc.info[1]:tc.geo[0]):(L.text.str||'').length;
    add(P('start'),P('start')+P('dur')+P('stagger')*n,'',[['p','start']]);if(P('outAt')>0)add(P('outAt'),P('outAt')+P('dur')+P('stagger')*n,'out',[['p','outAt']]);}
  if(L.type==='bento'){const n=(BENTO[Math.round(P('layout'))]||BENTO[0])[1].length;if(Math.round(P('anim'))!==7)add(P('start'),P('start')+P('dur')+P('stagger')*n,'',[['p','start']]);
    if(Math.round(P('layout2'))>0)add(P('morphAt'),P('morphAt')+P('morphDur'),'morph',[['p','morphAt']]);if(P('outAt')>0)add(P('outAt'),P('outAt')+P('dur')+P('stagger')*n,'out',[['p','outAt']]);}
  if(L.type==='reveal'){const dd=Math.round(P('dir'));if(dd===0||dd===2)add(P('at'),P('at')+P('dur'),'',[['p','at']]);if(dd===1)add(P('at'),P('at')+P('dur'),'out',[['p','at']]);if(dd===2)add(P('outAt'),P('outAt')+P('dur'),'out',[['p','outAt']]);}
  return out;}
/** Every animatable param of an item: own placement (n), own params (p) and its Megjelenések (f<i>.p / f<i>.n). path = 'n.x', 'p.size', 'f0.p.amt'. */
export function paramList(L){const out=[];if(!L)return out;
  const add=(g,obj,defs,pre,lblPre)=>{for(const k in obj||{}){const o=obj[k];if(!o||typeof o!=='object'||typeof o.v!=='number')continue;const d=defs(k);out.push({path:pre+g+'.'+k,o,label:lblPre+(d?d.l:k),d});}};
  const pd=X=>k=>pdefOf(X,k);
  add('n',L.n,k=>L===st.cam?null:BASEK[k],'','');if(L.p)add('p',L.p,L===st.cam?(()=>null):pd(L),'','');
  (L.fx||[]).forEach((F,i)=>{const nm=effectName(F.type)+' · ';add('p',F.p,k=>{const d=pd(F)(k);return d?effectParam(F.type,d):d},'f'+i+'.',nm);add('n',F.n,k=>k==='opacity'?{...BASEK.opacity,l:'Strength'}:BASEK[k],'f'+i+'.',nm);});
  for(const m of L.mo||[])if(MO[m.t])add('p',m.p,k=>{const d=moParam(m,k);return d?displayMotionParam(m.t,d):d},'mo:'+m.id+'.',motionName(m.t)+' · ');
  return out;}
export function objAt(L,path){const a=path.split('.');let o=L;if(a[0].startsWith('mo:')){o=(L.mo||[]).find(m=>'mo:'+m.id===a[0]);a.shift();}else if(a[0][0]==='f'&&a.length===3){o=(L.fx||[])[+a[0].slice(1)];a.shift();}return o&&o[a[0]]?o[a[0]][a[1]]:null;}
export function layerKeyTimes(L,path?){const m=new Map();for(const q of paramList(L)){if(path&&q.path!==path)continue;const o=q.o;if(hasK(o))o.k.forEach(x=>{const t=Math.round(x.t*1000)/1000;m.set(t,(m.get(t)||0)+1);});}return m;}
export function keysAt(L,t,path?){const r=[];for(const q of paramList(L)){if(path&&q.path!==path)continue;const o=q.o;if(!hasK(o))continue;o.k.forEach((x,i)=>{if(Math.abs(x.t-t)<KEY_EPS)r.push({o,i,path:q.path});});}return r;}
export function moveKeys(L,t0,t1,copy,path?){t1=Math.max(0,Math.round(t1*1000)/1000);if(Math.abs(t1-t0)<KEY_EPS&&!copy)return;
  for(const {o,i} of keysAt(L,t0,path).sort((a,b)=>b.i-a.i)){const k=o.k[i];const nk=copy?{...k,bz:k.bz?[...k.bz]:undefined}:k;
    o.k=o.k.filter((x,j)=>(j===i&&!copy)||Math.abs(x.t-t1)>=KEY_EPS);if(copy)o.k.push(nk);else if(!o.k.includes(k))o.k.push(k);nk.t=t1;o.k.sort((a,b)=>a.t-b.t);}}
/** The keys the selection stands for: [{o,key}] (a layer-level entry = every param at that time; param entries = that param). */
export function selKeyRefs(sels=R.tlxSels){const seen=new Set(),out=[];
  for(const s of sels){const it=itemById(s.id);if(!it)continue;for(const {o,i} of keysAt(it,s.t,s.p)){const key=o.k[i];if(seen.has(key))continue;seen.add(key);out.push({o,key,id:s.id});}}return out;}
/** Re-time every selected key with f(t) at once (move, stretch). Selected keys are lifted out first, so moving through or onto
 * each other never loses one; a non-selected key at a destination time is replaced (as in any editor). copy keeps the originals. */
export function retimeSel(f,copy=false){const refs=selKeyRefs();const moved=[];
  for(const {o,key} of refs){const nt=Math.max(0,Math.round(f(key.t)*1000)/1000);const k2=copy?{...key,bz:key.bz?[...key.bz]:undefined}:key;if(!copy)o.k.splice(o.k.indexOf(key),1);moved.push({o,k2,nt});}
  for(const {o,k2,nt} of moved){o.k=o.k.filter(x=>Math.abs(x.t-nt)>=KEY_EPS||moved.some(m=>m.k2===x));k2.t=nt;o.k.push(k2);}
  for(const {o} of moved){o.k.sort((a,b)=>a.t-b.t);if(!o.k.length)delete o.k;}
  R.tlxSels=R.tlxSels.map(s=>({...s,t:Math.max(0,Math.round(f(s.t)*1000)/1000)}));return moved.length;}
/** Set the curve of every selected key (the segment that starts at it). */
export function easeSel(e){let n=0;for(const {key} of selKeyRefs()){key.e=e;if(e===12){key.z=key.z??.45;key.w=key.w??12;}if(e===13)key.bz=key.bz||[.25,.1,.25,1];n++;}return n;}
/** Coalesce timeline redraws while a value is being dragged (a full Sávok rebuild per input event made sliders lag). */
export function queueTL(){if(R.tlQ)return;R.tlQ=setTimeout(()=>{R.tlQ=0;renderTimeline();},40);}
/* ----- bottom bar (selected layer) ----- */
export function renderTimeline(){const segs=$('#tlSegs');if(!segs)return;segs.innerHTML='';const D=Math.max(.1,st.dur);
  if((AUD.buf||AUD.stems.length)&&st.bpm){const bar=240/st.bpm;if(D/bar<400)for(let x=st.bpmOff;x<D;x+=bar)segs.appendChild(h('i',{class:'tl-beat',style:`left:${x/D*100}%`}));}
  const L=sel();if(L){for(const t of layerKeyTimes(L).keys())if(t<=D)segs.appendChild(h('i',{class:'tl-key',style:`left:${t/D*100}%`,title:'Kulcskocka '+fmtT(t)}));
    for(const s of layerSegs(L)){const l=Math.max(0,s.a/D),r=Math.min(1,s.b/D);if(r>l)segs.appendChild(h('i',{class:'tl-seg'+(s.cls?' '+s.cls:''),style:`left:${l*100}%;width:${(r-l)*100}%`}));}}
  const di=$('#tlDur');if(di&&document.activeElement!==di)di.value=(+st.dur).toFixed(1);{const lb=$('#loopBtn'),on=!!st.loop;lb.setAttribute('aria-pressed',String(on));lb.title=on?"Loop: on · return to the start at the range end (click to turn off)":"Loop: off · the scene keeps running after the range (click to turn on)";}$('#camBtn').setAttribute('aria-pressed',String(!!(st.cam&&st.cam.on)));
  renderTracks();}
R.keyClip=null;R.tlxSels=[];R.tlxView=null;
export const itemById=id=>id==='__cam'?st.cam:(findItem(id)||{}).it;
/** Layer row (no path): only a whole-time entry; param row: its own entry or the layer's whole-time entry. */
export const isSelK=(id,t,p?)=>R.tlxSels.some(s=>s.id===id&&Math.abs(s.t-t)<KEY_EPS&&(!s.p||s.p===p));
export function copyKeys(L,t){const sels=R.tlxSels.length?R.tlxSels:(L?[{id:L.id,t}]:[]);const t0=Math.min(...sels.map(s=>s.t));const out=[];
  for(const s of sels){const it=itemById(s.id);if(!it)continue;for(const {o,i,path} of keysAt(it,s.t,s.p))if(!out.some(c=>c.id===s.id&&c.path===path&&Math.abs(c.dt-(o.k[i].t-t0))<KEY_EPS))out.push({id:s.id,path,dt:o.k[i].t-t0,key:{...o.k[i],bz:o.k[i].bz?[...o.k[i].bz]:undefined}});}
  R.keyClip=out.length?out:null;return !!R.keyClip;}
export function pasteKeys(L,t){if(!R.keyClip)return 0;const ids=new Set(R.keyClip.map(c=>c.id));const single=ids.size===1;let n=0;
  for(const c of R.keyClip){const it=single?L:itemById(c.id);if(!it)continue;const o=objAt(it,c.path);if(!o||typeof o.v!=='number')continue;const tt=Math.max(0,t+c.dt);
    setKey(o,tt,c.key.v);const kk=o.k[keyIdx(o,tt)];if(kk){kk.e=c.key.e;if(c.key.z!=null)kk.z=c.key.z;if(c.key.w!=null)kk.w=c.key.w;if(c.key.bz)kk.bz=[...c.key.bz];}n++;}return n;}
export function deleteSelKeys(){let n=0;for(const {o,key} of selKeyRefs()){const i=o.k.indexOf(key);if(i>=0){delKey(o,i);n++;}}R.tlxSels=[];return n;}
/* ----- tracks panel ----- */
R.tlxOpen=(()=>{try{return localStorage.getItem('latomas2.tlx')==='1';}catch(_){return false;}})();
export function setTlx(o){R.tlxOpen=o;try{localStorage.setItem('latomas2.tlx',o?'1':'0');}catch(_){}$('#tlxBtn').setAttribute('aria-pressed',String(o));$('#tlx').hidden=!o;renderTracks();}
export function trackRows(){const rows=[];if(st.cam&&st.cam.on)rows.push({L:st.cam,d:0});for(const it of [...st.layers].reverse()){rows.push({L:it,d:0});if(it.type==='group'&&it.open)for(const c of [...it.children].reverse())rows.push({L:c,d:1});}return rows;}
export function viewAB(){const D=Math.max(.1,st.dur);if(!R.tlxView)return [0,D];let [a,b]=R.tlxView;const w=Math.min(D,Math.max(.25,b-a));a=Math.min(Math.max(0,a),D-w);return [a,a+w];}
export function setView(a,b){const D=Math.max(.1,st.dur);if(b-a>=D-1e-6){R.tlxView=null;}else R.tlxView=[a,b];renderTracks();}
export function zoomView(f,center){const [a,b]=viewAB();const c=center??(a+b)/2;const w=Math.min(Math.max(.25,(b-a)*f),Math.max(.1,st.dur));setView(c-(c-a)/(b-a)*w,c-(c-a)/(b-a)*w+w);}
export function renderTracks(){const P=$('#tlx');if(!P||!R.tlxOpen)return;const [va,vb]=viewAB();const VW=vb-va;const X=t=>(t-va)/VW*100;const inV=t=>t>=va-1e-6&&t<=vb+1e-6;
  const body=$('#tlxBody');body.replaceChildren();
  const zb=(l,t,f)=>{const b=h('button',{class:'tlx-zb',type:'button',title:t,'aria-label':t},l);b.onclick=e=>{e.stopPropagation();f();};return b;};
  const nameCell=h('div',{class:'tlx-name'},h('span',null,"Time"),zb('−',"Zoom out (Ctrl + scroll)",()=>zoomView(1.6,R.time)),zb('+',"Zoom in (Ctrl + scroll)",()=>zoomView(1/1.6,R.time)),zb('↔','Teljes hossz',()=>setView(0,st.dur)));
  const ruler=h('div',{class:'tlx-row tlx-ruler'},nameCell,h('div',{class:'tlx-lane'}));const rl=ruler.lastChild;
  const steps=[.1,.25,.5,1,2,5,10,15,30,60];const step=steps.find(s=>VW/s<=12)||60;
  for(let x=Math.ceil(va/step)*step;x<=vb+1e-6;x+=step)rl.appendChild(h('span',{class:'tlx-tick',style:`left:${X(x)}%`},(Math.round(x*100)/100)+'s'));
  rl.onpointerdown=ev=>{const r=rl.getBoundingClientRect();seekTo(va+Math.min(1,Math.max(0,(ev.clientX-r.left)/r.width))*VW);};
  body.appendChild(ruler);
  // Jelzések: manual cues (J while playing, double-click here); keys on a cue are anchors during retime
  const cl=h('div',{class:'tlx-lane tlx-cues',title:"Cues: press J during playback to tap to the beat · double-click to add · Alt-click a cue to delete"});
  for(const c of st.cues||[]){if(!inV(c.t))continue;const m=h('i',{class:'tlx-cue',style:`left:${X(c.t)}%`,title:`Cue @ ${fmtT(c.t)} · Alt-click to delete`});
    m.onpointerdown=ev=>{ev.stopPropagation();if(ev.altKey){removeCue(c.id);commit();renderTracks();}else seekTo(c.t);};cl.appendChild(m);}
  cl.ondblclick=ev=>{const r=cl.getBoundingClientRect();addCue(va+Math.min(1,Math.max(0,(ev.clientX-r.left)/r.width))*VW);commit();renderTracks();};
  body.appendChild(h('div',{class:'tlx-row'},h('div',{class:'tlx-name'},"Cues"),cl));
  if(R.koRows)for(const el of R.koRows(va,vb,X))body.appendChild(el);  // KO1 Jelenetmozgás block
  const rows=trackRows();if(!rows.length)body.appendChild(h('p',{class:'small',style:'padding:8px 10px'},"No layers yet."));
  for(const {L,d} of rows){const isSel=L.id===R.selId;
    const name=h('div',{class:'tlx-name'+(L===st.cam?' cam':''),style:`padding-left:${8+d*14}px`,title:L.name},L.name);name.onclick=()=>{if(L===st.cam){openCam(name);return;}R.selId=L.id;renderAll();};
    const lane=h('div',{class:'tlx-lane','data-id':L.id});
    if(L.type==='lottie'){
      const meta=lottieMeta(L.asset)?.meta,a=L.media?.start||0,b=L.media?.loop?Math.max(st.dur,vb):(a+(meta?.duration||0)/Math.max(.05,L.media?.speed||1));
      if(!(b<va||a>vb)){const l=Math.max(0,X(a)),r=Math.min(100,X(b));
        const clip=h('i',{class:'tlx-clip lottie'+(L.media?.loop?' open':''),style:`left:${l}%;width:${Math.max(.6,r-l)}%`,title:`Vector animation · ${fmtT(a)} start · drag to retime · media Loop ${L.media?.loop?'be':'ki'}`},h('span',null,"Vector animation"));
        clip.onpointerdown=ev=>mediaDrag(ev,L,lane);lane.appendChild(clip);}}
    const B=L===st.cam?null:blockOf(L);
    if(B&&B.b>B.a&&!(B.b<va||B.a>vb)){const l=Math.max(0,X(B.a)),r=Math.min(100,X(B.b));
      const blk=h('i',{class:'tlx-block'+(R.blockSel.has(L.id)?' on':''),style:`left:${l}%;width:${Math.max(.4,r-l)}%`,title:"Motion block · drag to move · Shift-click to select multiple · drag right edge to stretch the middle (Alt: slow the ending)"});
      const end=h('b',{class:'tlx-bend',title:"Drag to stretch the middle while keeping entrance speed · Alt-drag to slow the ending"});blk.appendChild(end);
      blk.onpointerdown=ev=>blockDrag(ev,L,lane,ev.target===end?(ev.altKey?'close':'hold'):'move');lane.appendChild(blk);}
    for(const s of layerSegs(L)){if(s.cls==='lottie'||s.b<va||s.a>vb)continue;const l=Math.max(0,X(s.a)),r=Math.min(100,X(s.b));if(r<=l)continue;
      const e=h('i',{class:'tlx-seg'+(s.cls?' '+s.cls:''),style:`left:${l}%;width:${r-l}%`,title:"Drag to shift timing"});e.onpointerdown=ev=>segDrag(ev,L,s,lane);lane.appendChild(e);}
    for(const [t,n] of layerKeyTimes(L)){if(!inV(t))continue;
      const e=h('i',{class:'tlx-key'+(isSelK(L.id,t)?' on':''),style:`left:${X(t)}%`,'data-t':String(t),title:`${n} kulcskocka @ ${fmtT(t)} · drag to move · Shift-click for multiple · Alt-drag to stretch · ⌘/Ctrl-drag to copy · right-click for curve`});
      e.onpointerdown=ev=>keyDrag(ev,L,t,lane);e.oncontextmenu=ev=>keyMenu(ev,L,t);lane.appendChild(e);}
    lane.onpointerdown=ev=>{if(ev.target!==lane)return;laneDown(ev,L,lane);};
    const prs=animParams(L).filter(q=>!q.path.startsWith('mo:'));const mos=L===st.cam?[]:(L.mo||[]).filter(m=>MO[m.t]);const open=R.tlxOpenIds.has(L.id);
    if(prs.length||mos.length){const chev=h('button',{class:'tlx-chev'+(open?' open':''),type:'button',title:open?"Hide motions and parameters":"Show motions and animated parameters",'aria-label':(open?"Hide: ":"Expand: ")+L.name,'aria-expanded':String(open)},'›');
      chev.onclick=ev=>{ev.stopPropagation();open?R.tlxOpenIds.delete(L.id):R.tlxOpenIds.add(L.id);renderTracks();};name.prepend(chev);
      if(prs.length)name.appendChild(h('span',{class:'tlx-sym',title:"Animated: "+[...new Set(prs.flatMap(q=>[...q.kinds]))].map(c=>ANIM_TIP[c]).join(', ')},[...new Set(prs.flatMap(q=>[...q.kinds]))].map(c=>ANIM_SYM[c]).join('')));}
    body.appendChild(h('div',{class:'tlx-row'+(isSel?' sel':'')+(L.vis?'':' off')},name,lane));
    // a param row (keys, wave / signal / link marks); dep = indent level
    const prow=(q,dep)=>{const pl=h('div',{class:'tlx-lane','data-id':L.id,'data-p':q.path});
      if(q.kinds&&q.kinds.includes('w'))pl.appendChild(h('i',{class:'tlx-wave',title:`Wave (LFO): ${(q.o.f||0).toFixed(2)} Hz · depth ${Math.round((q.o.a||0)*100)}%${q.o.lp&&loopLen()>0?` · Seamless loop: ${cyclesIn(q.o.f||0,loopLen())} cycles / ${+loopLen().toFixed(2)} mp`:''}`}));
      if(q.kinds&&q.kinds.includes('s'))pl.appendChild(h('i',{class:'tlx-sig',title:"Driven by audio or cue"}));
      if(q.kinds&&q.kinds.includes('l'))pl.appendChild(h('i',{class:'tlx-link',title:"Linked to another item's value"}));
      if(hasK(q.o))for(const k of q.o.k){if(!inV(k.t))continue;const kt=Math.round(k.t*1000)/1000;
        const e=h('i',{class:'tlx-key sub'+(isSelK(L.id,kt,q.path)?' on':''),style:`left:${X(kt)}%`,'data-t':String(kt),'data-p':q.path,title:`${q.label} · ${fmtT(kt)} · ${KEY_EASES[k.e??5]||''} · right-click for curve`});
        e.onpointerdown=ev=>keyDrag(ev,L,kt,pl,q.path);e.oncontextmenu=ev=>keyMenu(ev,L,kt,q.path);pl.appendChild(e);}
      pl.onpointerdown=ev=>{if(ev.target!==pl)return;laneDown(ev,L,pl);};
      const nm=h('div',{class:'tlx-name tlx-pname',style:`padding-left:${22+dep*14}px`,title:q.label},h('span',{class:'tlx-sym'},[...(q.kinds||'')].map(c=>ANIM_SYM[c]).join('')),h('span',null,q.short||q.label));
      body.appendChild(h('div',{class:'tlx-row tlx-prow'+(L.vis?'':' off')},nm,pl));};
    if(open){
      // Mozgássávok: one clip row per motion (layer ▸ motion ▸ param ▸ keys)
      for(const m of mos){const key=L.id+'|'+m.id,mopen=R.tlxOpenIds.has(key);const cl=h('div',{class:'tlx-lane tlx-molane'});
        // XF1: a linked motion is drawn where it really runs (source fields + delay) and edited at the source; m.dl shifts any motion
        const E:any=m.src?effMo(m,L):m,lk=!!m.src,dl=E?+E.dl||0:0;const C0:any=!E?{a:0,b:0,r:0}:E.t==='spring'?{a:E.p.at.v,b:E.p.at.v+E.p.dur.v,r:0,timed:true}:moClip(E);
        const C:any={...C0,a:C0.a+dl,b:C0.b==null?null:C0.b+dl};const b=C.b??Math.max(st.dur,vb);
        if(!(b<va||C.a>vb)){const l=Math.max(0,X(C.a)),r=Math.min(100,X(b));const rp=C.r/(b-C.a||1)*100;
          const XS=lk?xfSrc(m):null;const clip=h('i',{class:'tlx-clip'+(m.on===false||!E?' off':'')+(C.b==null?' open':'')+(lk?' xf':''),style:`left:${l}%;width:${Math.max(.6,r-l)}%;--ri:${C.a>0?rp:0}%;--ro:${C.b!=null?rp:0}%`,
            title:lk?`${motionName(m.t)} · ${XS?`${XF_GETS[XS.xf?XS.xf.md|0:0]} from: ${XS.L.name}`:"source removed"} · ${fmtT(C.a)} – ${C.b==null?"open end":fmtT(C.b)} · edit at the source`:`${motionName(m.t)} · ${fmtT(C.a)} – ${C.b==null?"open end (continues past the scene end)":fmtT(C.b)} · drag to shift · edges: start / end${C.timed?'':" (drag the end to the scene end to leave it open)"}`});
          const ea=h('b',{class:'tlx-ce a',title:"Start"}),eb=h('b',{class:'tlx-ce b',title:C.timed?"Duration":"End (drag to the scene end for an open end)"});clip.append(ea,h('span',null,motionName(m.t)),eb);
          clip.onpointerdown=ev=>{if(lk){ev.stopPropagation();R.selId=L.id;R.moSel[L.id]=m.id;R.itab='motion';renderAll();return;}clipDrag(ev,L,m,cl,ev.target===ea?'a':ev.target===eb?'b':'move');};cl.appendChild(clip);}
        const qs=paramList({mo:[m]}).map(q=>({...q,kinds:animKinds(q.o),short:q.d?q.d.l:q.label}));
        const ch=h('button',{class:'tlx-chev'+(mopen?' open':''),type:'button','aria-expanded':String(mopen),'aria-label':(mopen?"Hide: ":"Parameters: ")+motionName(m.t),title:"Motion parameters (keyframes)"},'›');
        ch.onclick=ev=>{ev.stopPropagation();mopen?R.tlxOpenIds.delete(key):R.tlxOpenIds.add(key);renderTracks();};
        const nk=qs.reduce((s,q)=>s+(hasK(q.o)?q.o.k.length:0),0);
        const nm=h('div',{class:'tlx-name tlx-moname',style:`padding-left:${14+d*14}px`,title:motionName(m.t)},ch,h('span',null,motionName(m.t)),nk?h('span',{class:'tlx-sym',title:nk+' kulcs'},'◆'):null);
        nm.onclick=()=>{R.selId=L.id;R.moSel[L.id]=m.id;R.itab='motion';renderAll();};
        body.appendChild(h('div',{class:'tlx-row tlx-morow'+(L.vis?'':' off')},nm,cl));
        if(m.xf&&m.xf.ids.length)body.appendChild(spreadRow(L,m,C,d,va,vb,X));
        if(mopen)for(const q of qs)if(!(q.d&&q.d.type==='sel'))prow(q,d+2);}
      for(const q of prs)prow(q,d);}}
  body.appendChild(h('i',{class:'tlx-ph',id:'tlxPh'}));
  const sb=h('div',{class:'tlx-scroll',hidden:!R.tlxView},h('i',{style:`left:${va/Math.max(.1,st.dur)*100}%;width:${VW/Math.max(.1,st.dur)*100}%`}));
  sb.onpointerdown=ev=>{const r=sb.getBoundingClientRect();const D=Math.max(.1,st.dur);const c=(ev.clientX-r.left)/r.width*D;setView(c-VW/2,c+VW/2);};body.appendChild(sb);
  tlxTick();}
export function tlxTick(){const ph=$('#tlxPh');if(!ph)return;const [va,vb]=viewAB();const f=(R.time-va)/(vb-va);ph.style.setProperty('--f',String(f));ph.hidden=f<0||f>1;}
export function laneT(lane,x){const [va,vb]=viewAB();const r=lane.getBoundingClientRect();return va+Math.min(1,Math.max(0,(x-r.left)/r.width))*(vb-va);}
export function laneDown(ev,L,lane){const body=$('#tlxBody');const br=body.getBoundingClientRect();const x0=ev.clientX,y0=ev.clientY;let marq=null;try{lane.setPointerCapture(ev.pointerId);}catch(_){}
  lane.onpointermove=e=>{if(!marq&&Math.hypot(e.clientX-x0,e.clientY-y0)<5)return;if(!marq){marq=h('i',{class:'tlx-marq'});body.appendChild(marq);}
    const l=Math.min(x0,e.clientX)-br.left,tp=Math.min(y0,e.clientY)-br.top+body.parentElement.scrollTop*0;marq.style.cssText=`left:${l}px;top:${Math.min(y0,e.clientY)-br.top}px;width:${Math.abs(e.clientX-x0)}px;height:${Math.abs(e.clientY-y0)}px`;};
  lane.onpointerup=e=>{lane.onpointermove=lane.onpointerup=null;
    if(!marq){seekTo(laneT(lane,e.clientX));if(!e.shiftKey)R.tlxSels=[];if(L!==st.cam&&R.selId!==L.id){R.selId=L.id;renderAll();}else renderTracks();return;}
    marq.remove();const ta=laneT(lane,Math.min(x0,e.clientX)),tb=laneT(lane,Math.max(x0,e.clientX)),ya=Math.min(y0,e.clientY),yb=Math.max(y0,e.clientY);
    if(!e.shiftKey)R.tlxSels=[];
    for(const ln of body.querySelectorAll('.tlx-lane[data-id]') as any){const r=ln.getBoundingClientRect();if(r.bottom<ya||r.top>yb)continue;const it=itemById(ln.dataset.id);if(!it)continue;const p=ln.dataset.p;
      for(const t of layerKeyTimes(it,p).keys())if(t>=ta-KEY_EPS&&t<=tb+KEY_EPS&&!isSelK(it.id,t,p))R.tlxSels.push(p?{id:it.id,t,p}:{id:it.id,t});}
    renderTracks();if(R.tlxSels.length)toast(`${R.tlxSels.length} keyframe times selected`);};}
export function snapT(t,lane,ex?){const [va,vb]=viewAB(),px=lane.getBoundingClientRect().width||1,tol=7/px*(vb-va);let best=null,bd=tol;
  const cands=[R.time,0,st.dur,...(st.cues||[]).map(c=>c.t)];for(const r of trackRows())for(const k of layerKeyTimes(r.L).keys())if(!isSelK(r.L.id,k)&&(ex==null||Math.abs(k-ex)>KEY_EPS))cands.push(k);
  if((AUD.buf||AUD.stems.length)&&st.bpm){const b=60/st.bpm;cands.push(Math.round((t-st.bpmOff)/b)*b+st.bpmOff);}
  for(const c of cands){const d=Math.abs(c-t);if(d<bd){bd=d;best=c;}}return best!=null?best:Math.round(t*30)/30;}
export function keyDrag(ev,L,t0,lane,p?){ev.stopPropagation();ev.preventDefault();if(ev.button===2)return;const tgt=ev.currentTarget;try{tgt.setPointerCapture(ev.pointerId);}catch(_){}
  const same=s=>s.id===L.id&&Math.abs(s.t-t0)<KEY_EPS&&(s.p||null)===(p||null);
  if(ev.shiftKey){if(R.tlxSels.some(same))R.tlxSels=R.tlxSels.filter(s=>!same(s));else R.tlxSels.push(p?{id:L.id,t:t0,p}:{id:L.id,t:t0});renderTracks();return;}
  if(!isSelK(L.id,t0,p))R.tlxSels=[p?{id:L.id,t:t0,p}:{id:L.id,t:t0}];if(L!==st.cam&&R.selId!==L.id){R.selId=L.id;renderLayers();renderInsp();}
  paintSel();
  const group=R.tlxSels.slice();const times:number[]=[...new Set<number>(group.map(s=>+s.t))].sort((a,b)=>a-b);const minT=times[0],maxT=times[times.length-1];const D=Math.max(.1,st.dur);let moved=false,dt=0;
  const copy=ev.metaKey||ev.ctrlKey||(ev.altKey&&times.length<2);const stretch=ev.altKey&&times.length>=2;
  // stretch: the dragged key follows the pointer, the far end of the selection stays put, everything between scales
  const anchor=Math.abs(t0-minT)<KEY_EPS?maxT:minT;const fOf=dd=>{const f=(t0+dd-anchor)/(t0-anchor||1);return (t:number)=>anchor+(t-anchor)*Math.max(0,f);};
  const els:any[]=[...$('#tlxBody').querySelectorAll('.tlx-key.on')];const base=els.map(e=>+e.dataset.t);const [va,vb]=viewAB();
  tgt.onpointermove=e=>{if(!moved&&Math.abs(e.clientX-ev.clientX)<3)return;moved=true;const t=laneT(lane,e.clientX);let t1=e.shiftKey?Math.round(t*100)/100:snapT(t,lane,t0);
    dt=Math.max(-minT,Math.min(D,t1)-t0);const f=stretch?fOf(dt):(x=>x+dt);els.forEach((el,i)=>el.style.left=((f(base[i])-va)/(vb-va)*100)+'%');tgt.title=fmtT(t0+dt);};
  tgt.onpointerup=()=>{tgt.onpointermove=tgt.onpointerup=null;if(!moved){seekTo(t0);renderTracks();return;}
    const n=retimeSel(stretch?fOf(dt):(x=>x+dt),copy);commit();renderInsp();
    toast(stretch?`${n} keyframes stretched (${((t0+dt-anchor)/(t0-anchor||1)*100).toFixed(0)}%)`:`${n} kulcskocka ${copy?"copied":"moved"} (${dt>=0?'+':''}${dt.toFixed(2)} mp)`);};}
/** Repaint the selected state of the visible diamonds without rebuilding the panel (keeps pointer capture during a drag). */
export function paintSel(){for(const e of $('#tlxBody').querySelectorAll('.tlx-key') as any){const lane=e.parentElement;e.classList.toggle('on',isSelK(lane.dataset.id,+e.dataset.t,e.dataset.p));}}
/** Animated params of an item, for the expandable rows. */
export function animParams(L){return paramList(L).map(q=>({...q,kinds:animKinds(q.o)})).filter(q=>q.kinds);}
R.tlxOpenIds=new Set();
export const QUICK_EASES:[string,number][]=[["Linear",4],["Smooth (through)",14],["Soft",0],['Ki-be',3],["Strong",1],["Spring",5],["Bounce",9],["Overshoot",7],['Gumi',8],["Stepped",11]];
/** Right click on a key: curve quick menu for the selection (the clicked key joins / becomes the selection). */
export function keyMenu(ev,L,t,p?){ev.preventDefault();ev.stopPropagation();if(!isSelK(L.id,t,p))R.tlxSels=[p?{id:L.id,t,p}:{id:L.id,t}];paintSel();
  closeKeyMenu();const refs=selKeyRefs();const cur=refs.length?refs[0].key.e??5:-1;
  const m=h('div',{class:'kmenu',role:'menu'},h('div',{class:'kmenu-h'},`Curve · ${refs.length} kulcs`),
    ...QUICK_EASES.map(([l,e])=>{const b=h('button',{type:'button',role:'menuitem',class:cur===e?'on':''},l);b.onclick=()=>{const n=easeSel(e);commit();closeKeyMenu();renderTracks();renderInsp();toast(`Curve: ${l} · ${n} keys (segments until the next key)`);};return b;}),
    h('hr'),(()=>{const b=h('button',{type:'button',role:'menuitem'},"Delete");b.onclick=()=>{const n=deleteSelKeys();commit();closeKeyMenu();renderInsp();toast(`${n} keyframes deleted`);};return b;})());
  document.body.appendChild(m);const r=m.getBoundingClientRect();m.style.left=Math.min(ev.clientX,innerWidth-r.width-8)+'px';m.style.top=Math.max(8,Math.min(ev.clientY,innerHeight-r.height-8))+'px';R.keyMenuEl=m;
  setTimeout(()=>document.addEventListener('pointerdown',outside,true),0);}
function outside(e){if(R.keyMenuEl&&!R.keyMenuEl.contains(e.target))closeKeyMenu();}
export function closeKeyMenu(){if(R.keyMenuEl){R.keyMenuEl.remove();R.keyMenuEl=null;}document.removeEventListener('pointerdown',outside,true);}
export function segDrag(ev,L,s,lane){ev.stopPropagation();ev.preventDefault();const tgt=ev.currentTarget;try{tgt.setPointerCapture(ev.pointerId);}catch(_){}const [va,vb]=viewAB();
  if(!s.f.length)return;const orig=s.f.map(([g,k])=>segGet(L,g,k));let moved=false;if(R.selId!==L.id){R.selId=L.id;renderLayers();renderInsp();}const l0=parseFloat(tgt.style.left);
  tgt.onpointermove=e=>{if(!moved&&Math.abs(e.clientX-ev.clientX)<3)return;moved=true;const r=lane.getBoundingClientRect();let dt=(e.clientX-ev.clientX)/r.width*(vb-va);if(!e.shiftKey){const sn=snapT(orig[0]+dt,lane);dt=sn-orig[0];}
    s.f.forEach(([g,k],i)=>{const v=Math.max(0,Math.round((orig[i]+dt)*100)/100);segSet(L,g,k,v);});markDirty();tgt.style.left=(l0+dt/(vb-va)*100)+'%';};
  tgt.onpointerup=()=>{tgt.onpointermove=tgt.onpointerup=null;if(moved){commit();renderInsp();}else{seekTo(s.a);}};}
/** A Lottie clip moves only the media start. Keyframe and scene Loops remain independent. */
export function mediaDrag(ev,L,lane){ev.stopPropagation();ev.preventDefault();const tgt=ev.currentTarget;try{tgt.setPointerCapture(ev.pointerId);}catch(_){}
  const [va,vb]=viewAB(),a0=L.media.start;let moved=false;
  if(R.selId!==L.id){R.selId=L.id;renderLayers();renderInsp();}
  tgt.onpointermove=e=>{if(!moved&&Math.abs(e.clientX-ev.clientX)<3)return;moved=true;
    const r=lane.getBoundingClientRect(),raw=a0+(e.clientX-ev.clientX)/r.width*(vb-va);
    L.media.start=Math.max(0,Math.round((e.shiftKey?raw:snapT(raw,lane))*100)/100);
    tgt.style.left=Math.max(0,(L.media.start-va)/(vb-va)*100)+'%';markDirty();};
  tgt.onpointerup=()=>{tgt.onpointermove=tgt.onpointerup=null;if(moved){commit();renderInsp();renderTimeline();}
    else seekTo(a0);};}
/** XF1 terjedési blokk under a source motion: from its start to the last target's start (+ the timed duration); ticks = targets
 *  in painted order; the right edge stretches the delay (Késés), a click re-opens the painting. */
function spreadRow(L,m,C,d,va,vb,X){const X0=m.xf,n=X0.ids.length,du=C.timed?C.b-C.a:0,a=C.a,b=a+n*X0.gap+du;const lane=h('div',{class:'tlx-lane tlx-molane'});
  const nm=h('div',{class:'tlx-name tlx-moname tlx-xfname',style:`padding-left:${28+d*14}px`,title:"Motion spread in painted order"},h('span',null,`Spread · ${n} targets`));
  if(!(b<va||a>vb)){const l=Math.max(0,X(a)),r=Math.min(100,X(Math.max(b,a+.05)));
    const blk=h('i',{class:'tlx-clip tlx-spread',style:`left:${l}%;width:${Math.max(.6,r-l)}%`,title:`Spread: ${n} targets · ${String(X0.gap).replace('.',',')} s / target · ${['Ritmus',"Path",'Teljes'][X0.md|0]} · click to repaint order · drag right edge to stretch delay`});
    for(let i=1;i<=n;i++)blk.appendChild(h('u',{style:`left:${(i*X0.gap)/(Math.max(.05,b-a))*100}%`},String(i)));
    const eb=h('b',{class:'tlx-ce b',title:"Stretch delay"});blk.appendChild(eb);
    blk.onpointerdown=ev=>{ev.stopPropagation();ev.preventDefault();if(ev.target!==eb){if(R.xfStart)R.xfStart(L,m);return;}
      try{blk.setPointerCapture(ev.pointerId);}catch(_){}const g0=X0.gap,r0=lane.getBoundingClientRect();
      blk.onpointermove=e=>{if(!(r0.width>0))return;const dt=(e.clientX-ev.clientX)/r0.width*(vb-va);X0.gap=Math.max(0,Math.round((g0+dt/n)*100)/100);const bb=a+n*X0.gap+du;blk.style.width=Math.max(.6,X(Math.max(bb,a+.05))-l)+'%';markDirty();};
      blk.onpointerup=()=>{blk.onpointermove=blk.onpointerup=null;commit();renderInsp();renderTimeline();toast(`Delay: ${String(X0.gap).replace('.',',')} s / target`);};};
    lane.appendChild(blk);}
  return h('div',{class:'tlx-row tlx-morow tlx-xfrow'+(L.vis?'':' off')},nm,lane);}
/** Drag a motion clip: move it, or its start ('a') / end ('b'). The timed Rugalmas beúszás moves at / stretches dur;
 *  a continuous motion's end dragged to the scene end becomes open-ended again. */
export function clipDrag(ev,L,m,lane,mode){ev.stopPropagation();ev.preventDefault();const tgt=ev.currentTarget;try{tgt.setPointerCapture(ev.pointerId);}catch(_){}const [va,vb]=viewAB();
  const sp=m.t==='spring',a0=sp?m.p.at.v:moClip(m).a,b0=sp?a0+m.p.dur.v:moClip(m).b;const D=Math.max(.1,st.dur);let moved=false;
  if(R.selId!==L.id||R.moSel[L.id]!==m.id){R.selId=L.id;R.moSel[L.id]=m.id;renderLayers();renderInsp();}
  tgt.onpointermove=e=>{if(!moved&&Math.abs(e.clientX-ev.clientX)<3)return;moved=true;const r=lane.getBoundingClientRect();let dt=(e.clientX-ev.clientX)/r.width*(vb-va);
    const ref=mode==='b'?(b0??D):a0;if(!e.shiftKey)dt=snapT(ref+dt,lane)-ref;const R3=v=>Math.round(v*100)/100;
    if(mode==='move'){const a=Math.max(0,R3(a0+dt));if(sp)m.p.at.v=a;else{if(a>0)m.a=a;else delete m.a;if(b0!=null)m.b=R3(b0+(a-a0));}}
    else if(mode==='a'){const lim=(sp?b0:(b0??Infinity))-.1;const a=Math.max(0,Math.min(lim,R3(a0+dt)));if(sp){m.p.at.v=a;m.p.dur.v=R3(b0-a);}else if(a>0)m.a=a;else delete m.a;}
    else{const b=Math.max(a0+.1,R3(ref+dt));if(sp)m.p.dur.v=R3(b-a0);else if(b>=D-1e-3)delete m.b;else m.b=b;}
    markDirty();const C0=sp?{a:m.p.at.v,b:m.p.at.v+m.p.dur.v}:moClip(m),dl=+m.dl||0,C={a:C0.a+dl,b:C0.b==null?null:C0.b+dl};const bb=C.b??Math.max(D,vb);tgt.style.left=Math.max(0,(C.a-va)/(vb-va)*100)+'%';tgt.style.width=Math.max(.6,(Math.min(vb,bb)-Math.max(va,C.a))/(vb-va)*100)+'%';tgt.classList.toggle('open',C.b==null);};
  tgt.onpointerup=()=>{tgt.onpointermove=tgt.onpointerup=null;if(!moved){seekTo(a0);renderTracks();return;}commit();renderInsp();renderTimeline();
    const C=sp?{a:m.p.at.v,b:m.p.at.v+m.p.dur.v}:moClip(m);toast(`${motionName(m.t)}: ${fmtT(C.a)} – ${C.b==null?"open end":fmtT(C.b)}`);};}
R.blockSel=new Set();
/** Drag a motion block: move / stretch the middle / slow the close. Shift+click adds blocks; the op hits every selected block. */
export function blockDrag(ev,L,lane,mode){ev.stopPropagation();ev.preventDefault();
  if(ev.shiftKey&&mode==='move'){R.blockSel.has(L.id)?R.blockSel.delete(L.id):R.blockSel.add(L.id);renderTracks();return;}
  if(!R.blockSel.has(L.id))R.blockSel=new Set([L.id]);
  const tgt=ev.currentTarget;try{tgt.setPointerCapture(ev.pointerId);}catch(_){}const [va,vb]=viewAB();const ids=[...R.blockSel];
  const snap0=ids.map(id=>{const it=itemById(id);return it?[it,JSON.stringify({tm:it.tm,p:it.p,n:it.n,mo:it.mo}),blockOf(it)]:null;}).filter(Boolean);
  const restore=()=>{for(const [it,js] of snap0){const o=JSON.parse(js);if(o.tm)it.tm=o.tm;if(o.p)it.p=o.p;it.n=o.n;if(o.mo)it.mo=o.mo;}};
  let moved=false,kept=0;const B0=blockOf(L);
  tgt.onpointermove=e=>{if(!moved&&Math.abs(e.clientX-ev.clientX)<3)return;moved=true;const r=lane.getBoundingClientRect();let dt=(e.clientX-ev.clientX)/r.width*(vb-va);
    const ref=mode==='move'?B0.a:B0.b;if(!e.shiftKey)dt=snapT(ref+dt,lane)-ref;restore();kept=0;
    for(const [it,,B] of snap0){if(!B)continue;kept+=mode==='move'?shiftBlock(it,dt,!e.shiftKey):stretchBlock(it,B.b+dt,mode,!e.shiftKey);}
    markDirty();renderTimeline();};
  tgt.onpointercancel=()=>tgt.onpointerup&&tgt.onpointerup();
  tgt.onpointerup=()=>{tgt.onpointermove=tgt.onpointerup=tgt.onpointercancel=null;if(!moved){R.selId=L.id;renderAll();renderTracks();return;}
    const B1=blockOf(L);if(mode!=='move'&&B1&&Math.abs(B1.b-B0.b)<1e-3){restore();renderTimeline();renderTracks();toast(mode==='close'?"This layer has no exit to slow down. Add one in Timing.":"There is no stretchable middle or exit. Add an exit in Timing, or a keyframe at the end.");return;}
    commit();renderInsp();renderTracks();const what=mode==='move'?'Eltolva':mode==='hold'?"Middle stretched":"Ending slowed";
    toast(`${what}: ${ids.length} blokk.${kept?` ${kept} keyframes stayed on their cues (anchored; Shift to move without anchors).`:''}`);};}
R.tlDrag=false;export const tlSeek=e=>{const r=tlTrack.getBoundingClientRect();const f=Math.min(1,Math.max(0,(e.clientX-r.left)/r.width));R.time=f*st.dur;resetFeedback();markDirty();if(R.playing)audioRestart();};
tlTrack.onpointerdown=e=>{R.tlDrag=true;tlTrack.setPointerCapture(e.pointerId);tlSeek(e);};tlTrack.onpointermove=e=>{if(R.tlDrag)tlSeek(e);};tlTrack.onpointerup=()=>{R.tlDrag=false;};
$('#tlDur').onchange=e=>{const v=parseFloat(String(e.target.value).replace(',','.'));if(isFinite(v)&&v>.2){st.dur=Math.min(600,v);commit();}renderTimeline();};
$('#tlDur').onkeydown=e=>{if(e.key==='Enter')e.target.blur();};
$('#loopBtn').onclick=()=>{st.loop=!st.loop;if(st.loop&&R.time>=st.dur)seekTo(R.time%Math.max(.1,st.dur));commit();renderTimeline();toast(st.loop?"Loop on: return to the start at the range end.":"Loop off: the scene keeps running after the range (timed items stay at their end state).");};
$('#tlOver').onclick=()=>seekTo(0);
$('#tlxBtn').onclick=()=>setTlx(!R.tlxOpen);
$('#tlx').addEventListener('wheel',e=>{const lane=$('#tlxBody .tlx-lane[data-id]')||$('#tlxBody .tlx-ruler .tlx-lane');if(!lane)return;
  if(e.ctrlKey||e.metaKey){e.preventDefault();zoomView(Math.exp(e.deltaY*.0025),laneT(lane,e.clientX));}
  else if(e.shiftKey||Math.abs(e.deltaX)>Math.abs(e.deltaY)){if(!R.tlxView)return;e.preventDefault();const [a,b]=viewAB();const d=(e.shiftKey?e.deltaY:e.deltaX)/600*(b-a);setView(a+d,b+d);}},{passive:false});
$('#camBtn').onclick=e=>openCam(e.currentTarget);
