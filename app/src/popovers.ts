import { R } from './runtime';
import { frameAt, renderAt } from './sim';
import { $, h } from './dom';
import { SEL } from './effects/index';
import { clearTarget, freeTarget, gl, mkTarget } from './gl';
import { LOOKP, LOOKS, SIZES, mkLook, st } from './state';
import { copyTo, outSize, renderScene, resizeMain } from './render';
import { ctlSelect, ctlSlider } from './controls';
import { FPS_OPTS, fpsObj } from './inspector';
import { commit, renderAll, scheduleSave } from './history';
import { audioRestart } from './signals';
import { markDirty } from './loop';
import { colorWell } from './colorpick';
import { renderVideo, snapPNG, startRec } from './output';
import { projModal, toast } from './modals';

R.popEl=null;R.popOff=null;
export function closePop(){if(R.popEl){R.popEl.remove();R.popEl=null;}if(R.popOff){document.removeEventListener('pointerdown',R.popOff);R.popOff=null;}}
export function openPop(anchor,...kids){closePop();const cls=typeof kids[0]==='string'?kids.shift():'';R.popEl=h('div',{class:'popover '+cls,role:'dialog'},...kids);document.body.appendChild(R.popEl);
  const r=anchor.getBoundingClientRect();const pw=R.popEl.offsetWidth;R.popEl.style.left=Math.min(window.innerWidth-pw-12,Math.max(12,r.right-pw))+'px';R.popEl.style.top=(r.bottom+6)+'px';
  setTimeout(()=>{R.popOff=e=>{if(R.popEl&&!R.popEl.contains(e.target)&&!anchor.contains(e.target))closePop();};document.addEventListener('pointerdown',R.popOff);},0);}
export const mi=(label,sub,fn)=>h('button',{class:'mi',onclick:()=>{closePop();fn();}},h('span',null,label),sub?h('small',null,sub):null);
$('#canvasBtn').onclick=e=>{
  const sz=h('select',{'aria-label':"Format"},...SIZES.map(([g,o])=>h('optgroup',{label:g},...o.map(x=>{const op=h('option',{value:x[0]},x[1]);if(x[0]===st.size)op.selected=true;return op;}))));
  const qs=h('select',{'aria-label':"Preview quality"},...[['auto',"Automatic (adapts to your device)"],['0.5','50% (gyors)'],['0.75','75%'],['1','100%'],['2','200% (retina)']].map(x=>{const op=h('option',{value:x[0]},x[1]);if(x[0]===String(st.qMode==='auto'?'auto':st.q))op.selected=true;return op;}));
  sz.onchange=()=>{st.size=sz.value;if(st.qMode!=='auto'&&+st.size.split('x')[0]<1000&&st.q<1){st.q=2;qs.value='2';}R.aqF=1;resizeMain();commit();};
  qs.onchange=()=>{if(qs.value==='auto'){st.qMode='auto';R.aqF=1;}else{st.qMode='fixed';st.q=+qs.value;}resizeMain();markDirty();};
  const bg=colorWell(()=>st.bg,v=>{st.bg=v.slice(0,7);markDirty();},ch=>{if(ch)commit();},"Background color");
  const sp=h('select',{'aria-label':"Playback speed"},...['0.25','0.5','1','1.5','2','3'].map(x=>{const op=h('option',{value:x},x+'×');if(+x===R.speed)op.selected=true;return op;}));sp.onchange=()=>{R.speed=+sp.value;audioRestart();};
  openPop(e.currentTarget,h('div',{class:'pl'},"Canvas"),h('div',{class:'pc'},h('div',{class:'row2'},h('span',null,"Format"),h('div',{class:'pop'},sz)),h('div',{class:'row2'},h('span',null,"Preview"),h('div',{class:'pop'},qs)),
    h('div',{class:'row2'},h('span',null,"Background"),bg),h('div',{class:'row2'},h('span',null,"Speed"),h('div',{class:'pop'},sp)),
    h('p',{class:'small'},"Efficient mode renders while paused only when you make a change. Preview quality does not affect export.")));};
export const EXP_DEF:{res:string;fps:number;dur:string|number;mb:number;sh:number;from:string}={res:'1',fps:30,dur:'tl',mb:0,sh:180,from:'0'};
/** Export settings live in the project (state.exp), so a 15 s / from-playhead export is the same after reopening. */
export const EXP:typeof EXP_DEF={...EXP_DEF};
export function applyExp(o:any){Object.assign(EXP,EXP_DEF);if(!o||typeof o!=='object')return;
  if(o.res==='1'||o.res==='4k')EXP.res=o.res;if(o.fps===30||o.fps===60)EXP.fps=o.fps;
  if(o.dur==='tl'||(typeof o.dur==='number'&&o.dur>0&&o.dur<=600))EXP.dur=o.dur;if(o.from==='0'||o.from==='head')EXP.from=o.from;
  if([0,8,16,32].includes(o.mb))EXP.mb=o.mb;if([90,180,270,360].includes(o.sh))EXP.sh=o.sh;}
/* motion blur: average N sub-frames inside the shutter interval (premultiplied, float accumulation) */
export function renderMB(ctx,t,fps,N,shDeg){if(!N||N<2){const f=frameAt(t);return renderAt(f.items,ctx,f.t,st.bg,true);}
  if(!ctx.mb||ctx.mb.w!==ctx.w||ctx.mb.h!==ctx.h){if(ctx.mb)freeTarget(ctx.mb);ctx.mb=mkTarget(ctx.w,ctx.h);}
  const acc=ctx.mb;clearTarget(acc,[0,0,0,0]);const span=(shDeg/360)/fps*R.speed;
  for(let i=0;i<N;i++){const ts=Math.max(0,t+((i+.5)/N-.5)*span);const f=frameAt(ts);const out=renderAt(f.items,ctx,f.t,st.bg,true);
    gl.enable(gl.BLEND);gl.blendColor(0,0,0,1/N);gl.blendFunc(gl.CONSTANT_ALPHA,gl.ONE);copyTo(out.t,acc);gl.disable(gl.BLEND);}
  return acc;}
export function dimsFor(mode){const {W,H}=outSize();const q=mode==='4k'?3840/Math.max(W,H):1;return {q,w:Math.round(W*q/2)*2,h:Math.round(H*q/2)*2};}
$('#exportBtn').onclick=e=>{
  const d1=dimsFor('1'),d4=dimsFor('4k');
  const sel=(label,opts,get,set)=>{const s=h('select',{'aria-label':label},...opts.map(([v,t])=>{const o=h('option',{value:v},t);if(String(get())===String(v))o.selected=true;return o;}));s.onchange=()=>{set(s.value);scheduleSave();};return h('div',{class:'row2'},h('span',null,label),h('div',{class:'pop'},s));};
  const can=!!window.VideoEncoder;
  openPop(e.currentTarget,'wide',h('div',{class:'pl'},"Image (PNG)"),
    mi("Full size",`${d1.w} × ${d1.h}`,()=>snapPNG('1')),mi('4K',`${d4.w} × ${d4.h}`,()=>snapPNG('4k')),h('hr'),
    h('div',{class:'pl'},"Video (MP4, rendered frame by frame)"),
    h('div',{class:'pc'},
      sel("Resolution",[['1',`Teljes · ${d1.w}×${d1.h}`],['4k',`4K · ${d4.w}×${d4.h}`]],()=>EXP.res,v=>EXP.res=v),
      sel("Frame rate",[['30','30 fps'],['60','60 fps']],()=>EXP.fps,v=>EXP.fps=+v),
      sel('Hossz',[['tl',`Timeline · ${(+st.dur).toFixed(1)} mp`],['5','5 mp'],['10','10 mp'],['15','15 mp'],['20','20 mp'],['30','30 mp'],['60','60 mp']],()=>EXP.dur,v=>EXP.dur=v==='tl'?'tl':+v),
      sel("Start",[['0',"From the beginning (0 s)"],['head',"From the playhead"]],()=>EXP.from,v=>EXP.from=v),
      sel("Motion blur",[['0','Nincs'],['8',"8 samples (fast)"],['16',"16 samples (smooth)"],['32',"32 samples (cinematic)"]],()=>EXP.mb,v=>EXP.mb=+v),
      sel("Shutter angle",[['90',"90° (sharper)"],['180','180° (mozis)'],['270','270°'],['360','360° (legelmosottabb)']],()=>EXP.sh,v=>EXP.sh=+v),
      h('p',{class:'small'},can?"Every frame is rendered separately, so the exported video stays smooth even when preview stutters. Motion blur averages several samples per frame and increases render time accordingly. Feedback trails may appear shorter.":"This browser cannot encode MP4 (WebCodecs is unavailable). Use real-time recording below, or open Vel in Chrome or Edge."),
      h('button',{class:'btn accent',disabled:!can,onclick:()=>{closePop();renderVideo(EXP.res,EXP.fps,EXP.dur);}},"Render video")),
    h('hr'),h('div',{class:'pl'},"Real-time recording (WebM, preview resolution)"),
    mi("Record · 10 s",'',()=>startRec(10)),mi("Record · 30 s",'',()=>startRec(30)));};
$('#projBtn').onclick=e=>openPop(e.currentTarget,h('div',{class:'pl'},'Projekt'),mi("Save and open…",'',projModal),mi("New blank canvas",'',()=>{st.layers=[];R.selId=null;commit();renderAll();toast("Blank canvas. Press ⌘Z to restore the previous one.");}),h('hr'),
  h('div',{class:'pl'},"Appearance"),mi('Rendszer szerint','',()=>setTheme('')),mi("Dark",'',()=>setTheme('dark')),mi("Light",'',()=>setTheme('light')));
export function updLookLbl(){const e=$('#lookLbl');if(e)e.textContent=st.look.preset;}
export function openLook(anchor){
  const grid=h('div',{class:'lookgrid'},...Object.keys(LOOKS).map(n=>h('button',{class:'lkb','aria-pressed':String(st.look.preset===n),onclick:()=>{const fp=st.look.fps||0;st.look=mkLook(n);st.look.fps=fp;commit();updLookLbl();openLook(anchor);}},n)));
  const toneObj={get v(){return st.look.tone;},set v(x){st.look.tone=x;st.look.preset="Custom";updLookLbl();}};
  const sl=LOOKP.map(d=>ctlSlider(st.look.p[d.k],d,{noAnim:true,onInput:()=>{if(st.look.preset!=="Custom"){st.look.preset="Custom";updLookLbl();}}}));
  openPop(anchor,h('div',{class:'pl'},"Look · rendering and color management"),h('div',{class:'pc'},grid,ctlSelect(toneObj,SEL('tone',"Tone mapping",["None (clipping)",'ACES filmes','AgX'],1)),ctlSelect(fpsObj(st.look,()=>{}),SEL('fps',"Frame rate (entire image)",FPS_OPTS.map(o=>o[1]),0)),...sl));}
$('#lookBtn').onclick=e=>openLook(e.currentTarget);
export function setTheme(t){if(t)document.documentElement.setAttribute('data-theme',t);else document.documentElement.removeAttribute('data-theme');try{localStorage.setItem('latomas2.theme',t);}catch(_){}}
try{const t=localStorage.getItem('latomas2.theme');if(t)document.documentElement.setAttribute('data-theme',t);}catch(_){}
