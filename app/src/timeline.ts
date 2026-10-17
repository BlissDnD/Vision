import { R } from './runtime';
import { $, h } from './dom';
import { BENTO } from './effects/index';
import { findItem, sel, st } from './state';
import { KEY_EPS, delKey, hasK, keyIdx, seekTo, setKey } from './evaluation';
import { textCache } from './text';
import { openCam } from './render';
import { renderLayers } from './layers';
import { renderInsp } from './inspector';
import { commit, renderAll } from './history';
import { fmtT, resetFeedback } from './transport';
import { AUD, audioRestart } from './signals';
import { markDirty } from './loop';
import { toast } from './modals';

export const tlHeadEl=$('#tlHead'),tlTrack=$('#tlTrack');
/* timing segments of a layer: [{a,b,cls,f:[[group,key],…]}] – f = fields that shift together when the bar is dragged */
export function layerSegs(L){const out=[];const add=(a,b,cls,f)=>{if(b>a)out.push({a,b,cls,f});};if(!L||L.type==='group'&&!L.tm)return out;
  const T=L.tm;if(T&&T.in)add(T.inAt,T.inAt+T.inDur,'',[['tm','inAt']]);if(T&&T.out)add(T.outAt,T.outAt+T.outDur,'out',[['tm','outAt']]);
  if(L.type==='group')return out;const P=k=>L.p[k].v;
  if(L.type==='mtext'){const tc=textCache.get(L.id),u=Math.round(P('unit'));const n=tc&&tc.info?(u===0?tc.info[0]:u===1?tc.info[1]:tc.geo[0]):(L.text.str||'').length;
    add(P('start'),P('start')+P('dur')+P('stagger')*n,'',[['p','start']]);if(P('outAt')>0)add(P('outAt'),P('outAt')+P('dur')+P('stagger')*n,'out',[['p','outAt']]);}
  if(L.type==='bento'){const n=(BENTO[Math.round(P('layout'))]||BENTO[0])[1].length;if(Math.round(P('anim'))!==7)add(P('start'),P('start')+P('dur')+P('stagger')*n,'',[['p','start']]);
    if(Math.round(P('layout2'))>0)add(P('morphAt'),P('morphAt')+P('morphDur'),'morph',[['p','morphAt']]);if(P('outAt')>0)add(P('outAt'),P('outAt')+P('dur')+P('stagger')*n,'out',[['p','outAt']]);}
  if(L.type==='reveal'){const dd=Math.round(P('dir'));if(dd===0||dd===2)add(P('at'),P('at')+P('dur'),'',[['p','at']]);if(dd===1)add(P('at'),P('at')+P('dur'),'out',[['p','at']]);if(dd===2)add(P('outAt'),P('outAt')+P('dur'),'out',[['p','outAt']]);}
  return out;}
export function layerKeyTimes(L){const m=new Map();for(const g of ['n','p'])for(const k in L[g]||{}){const o=L[g][k];if(hasK(o))o.k.forEach(x=>{const t=Math.round(x.t*1000)/1000;m.set(t,(m.get(t)||0)+1);});}return m;}
export function keysAt(L,t){const r=[];for(const g of ['n','p'])for(const k in L[g]||{}){const o=L[g][k];if(!hasK(o))continue;o.k.forEach((x,i)=>{if(Math.abs(x.t-t)<KEY_EPS)r.push({o,i,g,k});});}return r;}
export function moveKeys(L,t0,t1,copy){t1=Math.max(0,Math.round(t1*1000)/1000);if(Math.abs(t1-t0)<KEY_EPS&&!copy)return;
  for(const {o,i} of keysAt(L,t0).sort((a,b)=>b.i-a.i)){const k=o.k[i];const nk=copy?{...k,bz:k.bz?[...k.bz]:undefined}:k;
    o.k=o.k.filter((x,j)=>(j===i&&!copy)||Math.abs(x.t-t1)>=KEY_EPS);if(copy)o.k.push(nk);else if(!o.k.includes(k))o.k.push(k);nk.t=t1;o.k.sort((a,b)=>a.t-b.t);}}
/* ----- bottom bar (selected layer) ----- */
export function renderTimeline(){const segs=$('#tlSegs');if(!segs)return;segs.innerHTML='';const D=Math.max(.1,st.dur);
  if((AUD.buf||AUD.stems.length)&&st.bpm){const bar=240/st.bpm;if(D/bar<400)for(let x=st.bpmOff;x<D;x+=bar)segs.appendChild(h('i',{class:'tl-beat',style:`left:${x/D*100}%`}));}
  const L=sel();if(L){for(const t of layerKeyTimes(L).keys())if(t<=D)segs.appendChild(h('i',{class:'tl-key',style:`left:${t/D*100}%`,title:'Kulcskocka '+fmtT(t)}));
    for(const s of layerSegs(L)){const l=Math.max(0,s.a/D),r=Math.min(1,s.b/D);if(r>l)segs.appendChild(h('i',{class:'tl-seg'+(s.cls?' '+s.cls:''),style:`left:${l*100}%;width:${(r-l)*100}%`}));}}
  const di=$('#tlDur');if(di&&document.activeElement!==di)di.value=(+st.dur).toFixed(1);{const lb=$('#loopBtn'),on=!!st.loop;lb.setAttribute('aria-pressed',String(on));lb.title=on?'Ismétlés: be · a tartomány végén vissza az elejére (kattints: kikapcsolás)':'Ismétlés: ki · a jelenet a tartomány után is fut tovább (kattints: bekapcsolás)';}$('#camBtn').setAttribute('aria-pressed',String(!!(st.cam&&st.cam.on)));
  renderTracks();}
R.keyClip=null;R.tlxSels=[];R.tlxView=null;
export const itemById=id=>id==='__cam'?st.cam:(findItem(id)||{}).it;
export const isSelK=(id,t)=>R.tlxSels.some(s=>s.id===id&&Math.abs(s.t-t)<KEY_EPS);
export function copyKeys(L,t){const sels=R.tlxSels.length?R.tlxSels:(L?[{id:L.id,t}]:[]);const t0=Math.min(...sels.map(s=>s.t));const out=[];
  for(const s of sels){const it=itemById(s.id);if(!it)continue;for(const {o,i,g,k} of keysAt(it,s.t))out.push({id:s.id,path:g+'.'+k,dt:s.t-t0,key:{...o.k[i],bz:o.k[i].bz?[...o.k[i].bz]:undefined}});}
  R.keyClip=out.length?out:null;return !!R.keyClip;}
export function pasteKeys(L,t){if(!R.keyClip)return 0;const ids=new Set(R.keyClip.map(c=>c.id));const single=ids.size===1;let n=0;
  for(const c of R.keyClip){const it=single?L:itemById(c.id);if(!it)continue;const [g,k]=c.path.split('.');const o=it[g]&&it[g][k];if(!o||typeof o.v!=='number')continue;const tt=Math.max(0,t+c.dt);
    setKey(o,tt,c.key.v);const kk=o.k[keyIdx(o,tt)];if(kk){kk.e=c.key.e;if(c.key.z!=null)kk.z=c.key.z;if(c.key.w!=null)kk.w=c.key.w;if(c.key.bz)kk.bz=[...c.key.bz];}n++;}return n;}
export function deleteSelKeys(){let n=0;for(const s of R.tlxSels){const it=itemById(s.id);if(!it)continue;for(const {o,i} of keysAt(it,s.t).sort((a,b)=>b.i-a.i)){delKey(o,i);n++;}}R.tlxSels=[];return n;}
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
  const nameCell=h('div',{class:'tlx-name'},h('span',null,'Idő'),zb('−','Kicsinyítés (Ctrl + görgetés)',()=>zoomView(1.6,R.time)),zb('+','Nagyítás (Ctrl + görgetés)',()=>zoomView(1/1.6,R.time)),zb('↔','Teljes hossz',()=>setView(0,st.dur)));
  const ruler=h('div',{class:'tlx-row tlx-ruler'},nameCell,h('div',{class:'tlx-lane'}));const rl=ruler.lastChild;
  const steps=[.1,.25,.5,1,2,5,10,15,30,60];const step=steps.find(s=>VW/s<=12)||60;
  for(let x=Math.ceil(va/step)*step;x<=vb+1e-6;x+=step)rl.appendChild(h('span',{class:'tlx-tick',style:`left:${X(x)}%`},(Math.round(x*100)/100)+'s'));
  rl.onpointerdown=ev=>{const r=rl.getBoundingClientRect();seekTo(va+Math.min(1,Math.max(0,(ev.clientX-r.left)/r.width))*VW);};
  body.appendChild(ruler);
  const rows=trackRows();if(!rows.length)body.appendChild(h('p',{class:'small',style:'padding:8px 10px'},'Még nincs réteg.'));
  for(const {L,d} of rows){const isSel=L.id===R.selId;
    const name=h('div',{class:'tlx-name'+(L===st.cam?' cam':''),style:`padding-left:${8+d*14}px`,title:L.name},L.name);name.onclick=()=>{if(L===st.cam){openCam(name);return;}R.selId=L.id;renderAll();};
    const lane=h('div',{class:'tlx-lane','data-id':L.id});
    for(const s of layerSegs(L)){if(s.b<va||s.a>vb)continue;const l=Math.max(0,X(s.a)),r=Math.min(100,X(s.b));if(r<=l)continue;
      const e=h('i',{class:'tlx-seg'+(s.cls?' '+s.cls:''),style:`left:${l}%;width:${r-l}%`,title:'Húzd az időzítés eltolásához'});e.onpointerdown=ev=>segDrag(ev,L,s,lane);lane.appendChild(e);}
    for(const [t,n] of layerKeyTimes(L)){if(!inV(t))continue;
      const e=h('i',{class:'tlx-key'+(isSelK(L.id,t)?' on':''),style:`left:${X(t)}%`,'data-t':String(t),title:`${n} kulcskocka @ ${fmtT(t)} · Shift+katt: több kijelölése · húzás: áthelyezés · Alt+húzás: másolás`});
      e.onpointerdown=ev=>keyDrag(ev,L,t,lane);lane.appendChild(e);}
    lane.onpointerdown=ev=>{if(ev.target!==lane)return;laneDown(ev,L,lane);};
    body.appendChild(h('div',{class:'tlx-row'+(isSel?' sel':'')+(L.vis?'':' off')},name,lane));}
  body.appendChild(h('i',{class:'tlx-ph',id:'tlxPh'}));
  const sb=h('div',{class:'tlx-scroll',hidden:!R.tlxView},h('i',{style:`left:${va/Math.max(.1,st.dur)*100}%;width:${VW/Math.max(.1,st.dur)*100}%`}));
  sb.onpointerdown=ev=>{const r=sb.getBoundingClientRect();const D=Math.max(.1,st.dur);const c=(ev.clientX-r.left)/r.width*D;setView(c-VW/2,c+VW/2);};body.appendChild(sb);
  tlxTick();}
export function tlxTick(){const ph=$('#tlxPh');if(!ph)return;const [va,vb]=viewAB();const f=(R.time-va)/(vb-va);ph.style.setProperty('--f',String(f));ph.hidden=f<0||f>1;}
export function laneT(lane,x){const [va,vb]=viewAB();const r=lane.getBoundingClientRect();return va+Math.min(1,Math.max(0,(x-r.left)/r.width))*(vb-va);}
export function laneDown(ev,L,lane){const body=$('#tlxBody');const br=body.getBoundingClientRect();const x0=ev.clientX,y0=ev.clientY;let marq=null;lane.setPointerCapture(ev.pointerId);
  lane.onpointermove=e=>{if(!marq&&Math.hypot(e.clientX-x0,e.clientY-y0)<5)return;if(!marq){marq=h('i',{class:'tlx-marq'});body.appendChild(marq);}
    const l=Math.min(x0,e.clientX)-br.left,tp=Math.min(y0,e.clientY)-br.top+body.parentElement.scrollTop*0;marq.style.cssText=`left:${l}px;top:${Math.min(y0,e.clientY)-br.top}px;width:${Math.abs(e.clientX-x0)}px;height:${Math.abs(e.clientY-y0)}px`;};
  lane.onpointerup=e=>{lane.onpointermove=lane.onpointerup=null;
    if(!marq){seekTo(laneT(lane,e.clientX));if(!e.shiftKey)R.tlxSels=[];if(L!==st.cam&&R.selId!==L.id){R.selId=L.id;renderAll();}else renderTracks();return;}
    marq.remove();const ta=laneT(lane,Math.min(x0,e.clientX)),tb=laneT(lane,Math.max(x0,e.clientX)),ya=Math.min(y0,e.clientY),yb=Math.max(y0,e.clientY);
    if(!e.shiftKey)R.tlxSels=[];
    for(const ln of body.querySelectorAll('.tlx-lane[data-id]')){const r=ln.getBoundingClientRect();if(r.bottom<ya||r.top>yb)continue;const it=itemById(ln.dataset.id);if(!it)continue;
      for(const t of layerKeyTimes(it).keys())if(t>=ta-KEY_EPS&&t<=tb+KEY_EPS&&!isSelK(it.id,t))R.tlxSels.push({id:it.id,t});}
    renderTracks();if(R.tlxSels.length)toast(`${R.tlxSels.length} kulcskocka-időpont kijelölve`);};}
export function snapT(t,lane,ex?){const [va,vb]=viewAB(),px=lane.getBoundingClientRect().width||1,tol=7/px*(vb-va);let best=null,bd=tol;
  const cands=[R.time,0,st.dur];for(const r of trackRows())for(const k of layerKeyTimes(r.L).keys())if(!isSelK(r.L.id,k)&&(ex==null||Math.abs(k-ex)>KEY_EPS))cands.push(k);
  if((AUD.buf||AUD.stems.length)&&st.bpm){const b=60/st.bpm;cands.push(Math.round((t-st.bpmOff)/b)*b+st.bpmOff);}
  for(const c of cands){const d=Math.abs(c-t);if(d<bd){bd=d;best=c;}}return best!=null?best:Math.round(t*30)/30;}
export function keyDrag(ev,L,t0,lane){ev.stopPropagation();ev.preventDefault();const tgt=ev.currentTarget;tgt.setPointerCapture(ev.pointerId);
  if(ev.shiftKey){if(isSelK(L.id,t0))R.tlxSels=R.tlxSels.filter(s=>!(s.id===L.id&&Math.abs(s.t-t0)<KEY_EPS));else R.tlxSels.push({id:L.id,t:t0});renderTracks();return;}
  if(!isSelK(L.id,t0))R.tlxSels=[{id:L.id,t:t0}];if(L!==st.cam&&R.selId!==L.id){R.selId=L.id;renderLayers();renderInsp();}
  const group=R.tlxSels.slice();const minT=Math.min(...group.map(s=>s.t));const D=Math.max(.1,st.dur);let moved=false,dt=0;const copy=ev.altKey;
  const els=[...$('#tlxBody').querySelectorAll('.tlx-key.on')];const base=els.map(e=>parseFloat(e.style.left));const [va,vb]=viewAB();
  tgt.onpointermove=e=>{if(!moved&&Math.abs(e.clientX-ev.clientX)<3)return;moved=true;const t=laneT(lane,e.clientX);let t1=e.shiftKey?Math.round(t*100)/100:snapT(t,lane,t0);
    dt=Math.max(-minT,Math.min(D,t1)-t0);els.forEach((el,i)=>el.style.left=(base[i]+dt/(vb-va)*100)+'%');tgt.title=fmtT(t0+dt);};
  tgt.onpointerup=()=>{tgt.onpointermove=tgt.onpointerup=null;if(!moved){seekTo(t0);renderTracks();return;}
    const order=dt>0?[...group].sort((a,b)=>b.t-a.t):[...group].sort((a,b)=>a.t-b.t);
    for(const s of order){const it=itemById(s.id);if(it)moveKeys(it,s.t,s.t+dt,copy);}
    R.tlxSels=group.map(s=>({id:s.id,t:Math.round((s.t+dt)*1000)/1000}));commit();renderInsp();
    toast(`${group.length>1?group.length+' időpont ':''}kulcskockái ${copy?'másolva':'áthelyezve'} (${dt>=0?'+':''}${dt.toFixed(2)} mp)`);};}
export function segDrag(ev,L,s,lane){ev.stopPropagation();ev.preventDefault();const tgt=ev.currentTarget;tgt.setPointerCapture(ev.pointerId);const [va,vb]=viewAB();
  const orig=s.f.map(([g,k])=>g==='tm'?L.tm[k]:L.p[k].v);let moved=false;if(R.selId!==L.id){R.selId=L.id;renderLayers();renderInsp();}const l0=parseFloat(tgt.style.left);
  tgt.onpointermove=e=>{if(!moved&&Math.abs(e.clientX-ev.clientX)<3)return;moved=true;const r=lane.getBoundingClientRect();let dt=(e.clientX-ev.clientX)/r.width*(vb-va);if(!e.shiftKey){const sn=snapT(orig[0]+dt,lane);dt=sn-orig[0];}
    s.f.forEach(([g,k],i)=>{const v=Math.max(0,Math.round((orig[i]+dt)*100)/100);if(g==='tm')L.tm[k]=v;else L.p[k].v=v;});markDirty();tgt.style.left=(l0+dt/(vb-va)*100)+'%';};
  tgt.onpointerup=()=>{tgt.onpointermove=tgt.onpointerup=null;if(moved){commit();renderInsp();}else{seekTo(s.a);}};}
R.tlDrag=false;export const tlSeek=e=>{const r=tlTrack.getBoundingClientRect();const f=Math.min(1,Math.max(0,(e.clientX-r.left)/r.width));R.time=f*st.dur;resetFeedback();markDirty();if(R.playing)audioRestart();};
tlTrack.onpointerdown=e=>{R.tlDrag=true;tlTrack.setPointerCapture(e.pointerId);tlSeek(e);};tlTrack.onpointermove=e=>{if(R.tlDrag)tlSeek(e);};tlTrack.onpointerup=()=>{R.tlDrag=false;};
$('#tlDur').onchange=e=>{const v=parseFloat(String(e.target.value).replace(',','.'));if(isFinite(v)&&v>.2){st.dur=Math.min(600,v);commit();}renderTimeline();};
$('#tlDur').onkeydown=e=>{if(e.key==='Enter')e.target.blur();};
$('#loopBtn').onclick=()=>{st.loop=!st.loop;if(st.loop&&R.time>=st.dur)seekTo(R.time%Math.max(.1,st.dur));commit();renderTimeline();toast(st.loop?'Ismétlés be: a tartomány végén vissza az elejére.':'Ismétlés ki: a jelenet a tartomány után is fut tovább (időzített elemek a végállapotban).');};
$('#tlOver').onclick=()=>seekTo(0);
$('#tlxBtn').onclick=()=>setTlx(!R.tlxOpen);
$('#tlx').addEventListener('wheel',e=>{const lane=$('#tlxBody .tlx-lane[data-id]')||$('#tlxBody .tlx-ruler .tlx-lane');if(!lane)return;
  if(e.ctrlKey||e.metaKey){e.preventDefault();zoomView(Math.exp(e.deltaY*.0025),laneT(lane,e.clientX));}
  else if(e.shiftKey||Math.abs(e.deltaX)>Math.abs(e.deltaY)){if(!R.tlxView)return;e.preventDefault();const [a,b]=viewAB();const d=(e.shiftKey?e.deltaY:e.deltaX)/600*(b-a);setView(a+d,b+d);}},{passive:false});
$('#camBtn').onclick=e=>openCam(e.currentTarget);
