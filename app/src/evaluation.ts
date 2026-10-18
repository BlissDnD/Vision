import { R } from './runtime';
import { loopLen, snapRate } from './time';
import { TAU, h } from './dom';
import { EASE_NAMES } from './palettes';
import { S } from './effects/index';
import { easeJ, easeSpringJ } from './render';
import { ctlSlider } from './controls';
import { commit } from './history';
import { fmtT, resetFeedback, setPlay } from './transport';
import { audioRestart, sigVal } from './signals';
import { renderTimeline } from './timeline';
import { markDirty } from './loop';
import { toast } from './modals';

export function wave(w,ph){const fr=((ph%1)+1)%1;if(w===1)return 1-4*Math.abs(((ph+.25)%1+1)%1-.5);if(w===2)return 2*fr-1;if(w===3)return fr<.5?1:-1;return Math.sin(TAU*ph);}
/** Mozgás v1: per-layer key Loop (n._kl = {a,b,ret}, set each frame by motion.syncKLoop): after the layer's last key the
 *  animation glides back to its first value in `ret` seconds and repeats, independent of the project Loop. */
export function klVal(K,t,kl){const span=kl.b-kl.a+kl.ret;if(t<=kl.b||span<=1e-6)return keyVal(K,t);const tt=kl.a+((t-kl.a)%span);if(tt<=kl.b)return keyVal(K,tt);
  const u=Math.min(1,(tt-kl.b)/Math.max(1e-6,kl.ret)),e=u*u*(3-2*u);return keyVal(K,kl.b)*(1-e)+keyVal(K,kl.a)*e;}
export function ev(n,def,t){let v=n._pv!=null?n._pv:n.k&&n.k.length?(n._kl?klVal(n.k,t,n._kl):keyVal(n.k,t)):n.v;if(n.a)v+=wave(n.w,t*(n.lp?snapRate(n.f,loopLen()):n.f))*n.a*(def.max-def.min)*.5;if(n.s)v+=sigVal(n.s,t)*(n.sa??.5)*(def.max-def.min);if(n._lk)v=n._lk.f(t,v);return v;}

/* ----- keyframes: n.k=[{t,v,e,z?,w?,bz?}] on any slider param; e = curve of the segment that starts at this key ----- */
export const KEY_EASES=[...EASE_NAMES,'Egyedi rugó','Egyedi görbe (Bézier)','Sima (átmenő)'];
/** 'Sima (átmenő)': a monotone cubic Hermite segment through the neighbouring keys (no corner, no stop at keys, no overshoot). */
export const SMOOTH_E=14;
export const KEY_EPS=1/60;
export const hasK=n=>!!(n&&n.k&&n.k.length);
export function keyIdx(n,t){if(!hasK(n))return -1;return n.k.findIndex(k=>Math.abs(k.t-t)<KEY_EPS);}
export function bezierY(x,b){const [x1,y1,x2,y2]=b;let u=x;for(let i=0;i<10;i++){const cx=3*x1*u*(1-u)*(1-u)+3*x2*u*u*(1-u)+u*u*u-x;const dx=3*x1*(1-u)*(1-u)+6*(x2-x1)*u*(1-u)+3*(1-x2)*u*u;if(Math.abs(cx)<1e-5||Math.abs(dx)<1e-6)break;u=Math.min(1,Math.max(0,u-cx/dx));}
  return 3*y1*u*(1-u)*(1-u)+3*y2*u*u*(1-u)+u*u*u;}
export function keyEase(k,x){x=Math.min(1,Math.max(0,x));const e=k.e??5;if(e===12)return easeSpringJ(x,Math.min(.98,Math.max(.05,k.z??.5)),Math.max(1,k.w??12));if(e===13)return bezierY(x,k.bz||[.25,.1,.25,1]);if(e===SMOOTH_E)return x*x*(3-2*x);return easeJ(e,x);}
/** Tangent at key i for the smooth curve: Fritsch–Butland mean of the two secants when both neighbouring segments are smooth,
 *  0 at a local extremum or where the curve meets a non-smooth segment / the end (eased neighbours also start/stop at 0, so it stays C1). */
function smTan(K,i){if(i<=0||i>=K.length-1||(K[i-1].e??5)!==SMOOTH_E||(K[i].e??5)!==SMOOTH_E)return 0;
  const h0=K[i].t-K[i-1].t,h1=K[i+1].t-K[i].t;if(h0<1e-9||h1<1e-9)return 0;const d0=(K[i].v-K[i-1].v)/h0,d1=(K[i+1].v-K[i].v)/h1;
  if(d0*d1<=0)return 0;return 3*(h0+h1)/((2*h1+h0)/d0+(h1+2*h0)/d1);}
export function keyVal(K,t){const n=K.length;if(t<=K[0].t)return K[0].v;if(t>=K[n-1].t)return K[n-1].v;
  for(let i=0;i<n-1;i++){const a=K[i],b=K[i+1];if(t<=b.t){const h=Math.max(1e-6,b.t-a.t),x=(t-a.t)/h;
    if((a.e??5)===SMOOTH_E){const x2=x*x,x3=x2*x;return (2*x3-3*x2+1)*a.v+(x3-2*x2+x)*h*smTan(K,i)+(-2*x3+3*x2)*b.v+(x3-x2)*h*smTan(K,i+1);}
    return a.v+(b.v-a.v)*keyEase(a,x);}}return K[n-1].v;}
export const curV=n=>hasK(n)?keyVal(n.k,R.time):n.v;
/** New keys start with 'Lágy' (0); a key inserted after another inherits that one's curve. Old keys without `e` keep the legacy default (5). */
export const DEF_EASE=0;
export function setKey(n,t,v){if(!n.k)n.k=[];const i=keyIdx(n,t);if(i>=0)n.k[i].v=v;else{const prev=n.k.filter(k=>k.t<t).pop();n.k.push({t:Math.round(t*1000)/1000,v,e:prev?(prev.e??5):DEF_EASE});n.k.sort((a,b)=>a.t-b.t);}n.v=v;}
export function delKey(n,i){n.k.splice(i,1);if(!n.k.length)delete n.k;}
/** Value edit of an animatable parameter (slider, number field, canvas drag).
 * Eljátszás take running → the take records it (R.perfHook). Keyed param or Animálás mode → a key at the playhead; the first key of a
 * param edited away from 0 s also keeps the previous value at 0 s. Editing a keyed value pauses playback, otherwise keys would smear
 * along the timeline while the playhead moves. Non-animatable controls (noAnim sliders, proxies) never come through here. */
R.animMode=false;
export function setVal(n,v){if(R.perfHook&&R.perfHook(n,v))return;
  // Mozgás v1: outside Animálás mode a keyed value is not re-keyed: the whole animation shifts by the change (playback keeps going)
  if(hasK(n)&&!R.animMode&&typeof n.v==='number'&&!R.perform){const d=v-curV(n);if(d){for(const k of n.k)k.v+=d;n.v+=d;R.keyShift=(R.keyShift||0)+1;}return;}
  if(hasK(n)||R.animMode){if(R.playing&&!R.perform)setPlay(false);if(!hasK(n)&&R.time>KEY_EPS&&typeof n.v==='number')setKey(n,0,n.v);setKey(n,R.time,v);R.keyEdit=(R.keyEdit||0)+1;}
  else n.v=v;}
/** What animates a param, for the badges: k = keys, w = wave (LFO), s = signal, l = Kapcsolat. */
export function animKinds(n){if(!n||typeof n!=='object')return '';return (hasK(n)?'k':'')+(n.a>0?'w':'')+(n.s?'s':'')+(n._lk?'l':'');}
export const ANIM_SYM={k:'◆',w:'∿',s:'♪',l:'⇢',b:'▭'};
export const ANIM_TIP={k:'kulcskockák',w:'hullám (LFO)',s:'hang / jel',l:'Kapcsolat másik elemről',b:'mozgásblokk (belépés / kilépés)'};
export function toggleKey(n){const i=keyIdx(n,R.time);if(i>=0){delKey(n,i);return false;}setKey(n,R.time,curV(n));return true;}
export function seekTo(t){R.time=Math.max(0,t);resetFeedback();markDirty();if(R.playing)audioRestart();}
export const SVG_KEY='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"><path d="M12 3.5 20.5 12 12 20.5 3.5 12z"/></svg>';
export const SVG_CURVE='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 19c6 0 6-14 18-14"/><circle cx="3" cy="19" r="1.6" fill="currentColor"/><circle cx="21" cy="5" r="1.6" fill="currentColor"/></svg>';
R.liveKed=[];
export function keyButton(obj,label,after){const b=h('button',{class:'kb',type:'button',title:'Kulcskocka ezen az időponton (K)','aria-label':label+' kulcskocka',html:SVG_KEY});
  b.onclick=e=>{e.stopPropagation();const added=toggleKey(obj);commit();renderTimeline();after&&after();
    if(added&&obj.k.length===1)toast(`Kulcskocka: ${label} @ ${fmtT(R.time)}. Lépj máshová az idővonalon, és állítsd át az értéket: új kulcskocka lesz.`);};
  return b;}
export function keyState(obj){return hasK(obj)?(keyIdx(obj,R.time)>=0?'on':'has'):'';}
export function keyEditor(obj,d,label){
  const box=h('div',{class:'ked'});const NS='http://www.w3.org/2000/svg';const W=260,H=86;
  let si=Math.max(0,keyIdx(obj,R.time));let map=null,ph=null;
  const svg=document.createElementNS(NS,'svg');svg.setAttribute('viewBox',`0 0 ${W} ${H}`);svg.setAttribute('class','kgraph');svg.setAttribute('role','img');svg.setAttribute('aria-label',label+' görbéje');
  const info=h('div',{class:'kinfo'});box.append(svg,info);
  const el=(tag,a)=>{const e=document.createElementNS(NS,tag);for(const k in a)e.setAttribute(k,a[k]);return e;};
  function draw(full=true){
    if(!hasK(obj)){box.replaceChildren(h('p',{class:'small'},'Nincs több kulcskocka ezen a paraméteren.'));return;}
    const K=obj.k;si=Math.min(si,K.length-1);const t0=K[0].t,t1=K[K.length-1].t,span=Math.max(.6,t1-t0),a=t0-span*.1,b=t1+span*.1;
    let mn=Infinity,mx=-Infinity;const pts=[];for(let i=0;i<=160;i++){const t=a+(b-a)*i/160,v=keyVal(K,t);pts.push([t,v]);mn=Math.min(mn,v);mx=Math.max(mx,v);}
    if(mx-mn<1e-6){mx+=.5;mn-=.5;}const pd=(mx-mn)*.14;mn-=pd;mx+=pd;
    const X=t=>(t-a)/(b-a)*W,Y=v=>H-((v-mn)/(mx-mn))*H;map={X,a,b};
    svg.replaceChildren();
    svg.appendChild(el('path',{d:'M0 '+(H/2)+'H'+W,class:'kg-mid'}));
    svg.appendChild(el('path',{d:pts.map((p,i)=>(i?'L':'M')+X(p[0]).toFixed(1)+' '+Y(p[1]).toFixed(1)).join(''),class:'kg-line'}));
    ph=el('path',{d:'',class:'kg-ph'});svg.appendChild(ph);
    K.forEach((k,i)=>{const c=el('rect',{x:X(k.t)-5,y:Y(k.v)-5,width:10,height:10,rx:1.5,transform:`rotate(45 ${X(k.t)} ${Y(k.v)})`,class:'kg-key'+(i===si?' on':'')});
      c.addEventListener('pointerdown',e=>{e.stopPropagation();si=i;seekTo(k.t);draw();});svg.appendChild(c);});
    tick();if(full)info.replaceChildren(...keyInfo());}
  function keyInfo(){const K=obj.k,k=K[si];
    const num=(lbl,get,set,step)=>{const i=h('input',{class:'knum',type:'number',step,value:+get().toFixed(3),'aria-label':lbl});i.onchange=()=>{const v=parseFloat(i.value);if(isFinite(v)){set(v);K.sort((x,y)=>x.t-y.t);si=K.indexOf(k);commit();renderTimeline();draw();}};return h('label',{class:'kfield'},h('span',null,lbl),i);};
    const es=h('select',{'aria-label':'Görbe a következő kulcskockáig'},...KEY_EASES.map((n,i)=>{const o=h('option',{value:i},n);if((k.e??5)===i)o.selected=true;return o;}));
    es.onchange=()=>{k.e=+es.value;if(k.e===12){k.z=k.z??.45;k.w=k.w??12;}if(k.e===13)k.bz=k.bz||[.25,.1,.25,1];commit();draw();};
    const rows=[h('div',{class:'krow'},num('Idő (mp)',()=>k.t,v=>{k.t=Math.max(0,v);},.05),num('Érték',()=>k.v,v=>{k.v=v;},(d.max-d.min)/100)),
      h('div',{class:'row2'},h('span',null,si<K.length-1?'Görbe a következőig':'Görbe (utolsó kulcs)'),h('div',{class:'pop'},es))];
    if(k.e===12){const Z={get v(){return k.z??.45;},set v(x){k.z=x;draw(false);markDirty();}},Wn={get v(){return k.w??12;},set v(x){k.w=x;draw(false);markDirty();}};
      rows.push(ctlSlider(Wn,S('w','Merevség',2,40,12),{noAnim:true}),ctlSlider(Z,S('z','Csillapítás',.05,.98,.45),{noAnim:true}));}
    if(k.e===13)rows.push(bezPad(k,draw));
    rows.push(h('div',{class:'btnrow'},
      h('button',{class:'btn',disabled:si<=0,onclick:()=>{si--;seekTo(K[si].t);draw();}},'◀ Előző'),
      h('button',{class:'btn',disabled:si>=K.length-1,onclick:()=>{si++;seekTo(K[si].t);draw();}},'Következő ▶'),
      h('button',{class:'btn',onclick:()=>{delKey(obj,si);si=Math.max(0,si-1);commit();renderTimeline();draw();}},'Törlés')));
    return rows;}
  function tick(){if(!map||!ph)return;const x=map.X(Math.min(map.b,Math.max(map.a,R.time)));ph.setAttribute('d',`M${x.toFixed(1)} 0V${H}`);}
  draw();R.liveKed.push({tick,box});return box;}
export function bezPad(k,redraw){const NS='http://www.w3.org/2000/svg',S0=120,P=14;const svg=document.createElementNS(NS,'svg');svg.setAttribute('viewBox',`0 0 ${S0+P*2} ${S0+P*2}`);svg.setAttribute('class','bez');
  const b=k.bz||(k.bz=[.25,.1,.25,1]);const X=v=>P+v*S0,Y=v=>P+(1-v)*S0;
  const paint=()=>{svg.innerHTML=`<rect x="${P}" y="${P}" width="${S0}" height="${S0}" class="bz-box"/><path class="bz-arm" d="M${X(0)} ${Y(0)}L${X(b[0])} ${Y(b[1])}M${X(1)} ${Y(1)}L${X(b[2])} ${Y(b[3])}"/>`+
    `<path class="bz-c" d="M${X(0)} ${Y(0)}C${X(b[0])} ${Y(b[1])} ${X(b[2])} ${Y(b[3])} ${X(1)} ${Y(1)}"/><circle class="bz-h" cx="${X(b[0])}" cy="${Y(b[1])}" r="6"/><circle class="bz-h" cx="${X(b[2])}" cy="${Y(b[3])}" r="6"/>`;};
  let hnd=-1;const pos=e=>{const r=svg.getBoundingClientRect();const sx=(S0+P*2)/r.width;return [((e.clientX-r.left)*sx-P)/S0,1-((e.clientY-r.top)*sx-P)/S0];};
  svg.addEventListener('pointerdown',e=>{const [x,y]=pos(e);const d0=Math.hypot(x-b[0],y-b[1]),d1=Math.hypot(x-b[2],y-b[3]);hnd=d0<d1?0:2;svg.setPointerCapture(e.pointerId);});
  svg.addEventListener('pointermove',e=>{if(hnd<0)return;const [x,y]=pos(e);b[hnd]=Math.min(1,Math.max(0,x));b[hnd+1]=Math.min(1.6,Math.max(-.6,y));paint();markDirty();});
  svg.addEventListener('pointerup',()=>{if(hnd>=0){hnd=-1;commit();redraw();}});
  paint();
  const presets=[['Lágy',[.25,.1,.25,1]],['Ki',[0,0,.2,1]],['Be',[.6,0,1,1]],['Ki-be',[.65,0,.35,1]],['Túllövés',[.3,1.4,.5,1]]];
  return h('div',{class:'bezw'},svg,h('div',{class:'chips'},...presets.map(([n,v])=>h('button',{class:'chip',type:'button',onclick:()=>{b.splice(0,4,...v);paint();commit();redraw();}},n))));}
