import { R } from './runtime';
import { renderAt } from './sim';
import { $, h } from './dom';
import { SEL } from './effects/index';
import { clearTarget, freeTarget, gl, mkTarget } from './gl';
import { LOOKP, LOOKS, SIZES, mkLook, st } from './state';
import { copyTo, outSize, renderScene, resizeMain } from './render';
import { ctlSelect, ctlSlider } from './controls';
import { FPS_OPTS, fpsObj } from './inspector';
import { commit, renderAll } from './history';
import { audioRestart } from './signals';
import { markDirty } from './loop';
import { renderVideo, snapPNG, startRec } from './output';
import { projModal, toast } from './modals';

R.popEl=null;R.popOff=null;
export function closePop(){if(R.popEl){R.popEl.remove();R.popEl=null;}if(R.popOff){document.removeEventListener('pointerdown',R.popOff);R.popOff=null;}}
export function openPop(anchor,...kids){closePop();const cls=typeof kids[0]==='string'?kids.shift():'';R.popEl=h('div',{class:'popover '+cls,role:'dialog'},...kids);document.body.appendChild(R.popEl);
  const r=anchor.getBoundingClientRect();const pw=R.popEl.offsetWidth;R.popEl.style.left=Math.min(window.innerWidth-pw-12,Math.max(12,r.right-pw))+'px';R.popEl.style.top=(r.bottom+6)+'px';
  setTimeout(()=>{R.popOff=e=>{if(R.popEl&&!R.popEl.contains(e.target)&&!anchor.contains(e.target))closePop();};document.addEventListener('pointerdown',R.popOff);},0);}
export const mi=(label,sub,fn)=>h('button',{class:'mi',onclick:()=>{closePop();fn();}},h('span',null,label),sub?h('small',null,sub):null);
$('#canvasBtn').onclick=e=>{
  const sz=h('select',{'aria-label':'Formátum'},...SIZES.map(([g,o])=>h('optgroup',{label:g},...o.map(x=>{const op=h('option',{value:x[0]},x[1]);if(x[0]===st.size)op.selected=true;return op;}))));
  const qs=h('select',{'aria-label':'Előnézeti minőség'},...[['auto','Automatikus (a géphez igazodik)'],['0.5','50% (gyors)'],['0.75','75%'],['1','100%'],['2','200% (retina)']].map(x=>{const op=h('option',{value:x[0]},x[1]);if(x[0]===String(st.qMode==='auto'?'auto':st.q))op.selected=true;return op;}));
  sz.onchange=()=>{st.size=sz.value;if(st.qMode!=='auto'&&+st.size.split('x')[0]<1000&&st.q<1){st.q=2;qs.value='2';}R.aqF=1;resizeMain();commit();};
  qs.onchange=()=>{if(qs.value==='auto'){st.qMode='auto';R.aqF=1;}else{st.qMode='fixed';st.q=+qs.value;}resizeMain();markDirty();};
  const bg=h('input',{type:'color',class:'cwell',value:st.bg,'aria-label':'Háttérszín'});bg.oninput=()=>{st.bg=bg.value;};bg.onchange=commit;
  const sp=h('select',{'aria-label':'Lejátszási tempó'},...['0.25','0.5','1','1.5','2','3'].map(x=>{const op=h('option',{value:x},x+'×');if(+x===R.speed)op.selected=true;return op;}));sp.onchange=()=>{R.speed=+sp.value;audioRestart();};
  openPop(e.currentTarget,h('div',{class:'pl'},'Vászon'),h('div',{class:'pc'},h('div',{class:'row2'},h('span',null,'Formátum'),h('div',{class:'pop'},sz)),h('div',{class:'row2'},h('span',null,'Előnézet'),h('div',{class:'pop'},qs)),
    h('div',{class:'row2'},h('span',null,'Háttér'),bg),h('div',{class:'row2'},h('span',null,'Tempó'),h('div',{class:'pop'},sp)),
    h('p',{class:'small'},'Takarékos: szünetben csak akkor renderel, ha változtatsz valamit. Az előnézeti minőség az exportot nem érinti.')));};
export const EXP:{res:string;fps:number;dur:string|number;mb:number;sh:number;from:string}={res:'1',fps:30,dur:'tl',mb:0,sh:180,from:'0'};
/* motion blur: average N sub-frames inside the shutter interval (premultiplied, float accumulation) */
export function renderMB(ctx,t,fps,N,shDeg){if(!N||N<2)return renderAt(st.layers,ctx,t,st.bg,true);
  if(!ctx.mb||ctx.mb.w!==ctx.w||ctx.mb.h!==ctx.h){if(ctx.mb)freeTarget(ctx.mb);ctx.mb=mkTarget(ctx.w,ctx.h);}
  const acc=ctx.mb;clearTarget(acc,[0,0,0,0]);const span=(shDeg/360)/fps*R.speed;
  for(let i=0;i<N;i++){const ts=Math.max(0,t+((i+.5)/N-.5)*span);const out=renderAt(st.layers,ctx,ts,st.bg,true);
    gl.enable(gl.BLEND);gl.blendColor(0,0,0,1/N);gl.blendFunc(gl.CONSTANT_ALPHA,gl.ONE);copyTo(out.t,acc);gl.disable(gl.BLEND);}
  return acc;}
export function dimsFor(mode){const {W,H}=outSize();const q=mode==='4k'?3840/Math.max(W,H):1;return {q,w:Math.round(W*q/2)*2,h:Math.round(H*q/2)*2};}
$('#exportBtn').onclick=e=>{
  const d1=dimsFor('1'),d4=dimsFor('4k');
  const sel=(label,opts,get,set)=>{const s=h('select',{'aria-label':label},...opts.map(([v,t])=>{const o=h('option',{value:v},t);if(String(get())===String(v))o.selected=true;return o;}));s.onchange=()=>set(s.value);return h('div',{class:'row2'},h('span',null,label),h('div',{class:'pop'},s));};
  const can=!!window.VideoEncoder;
  openPop(e.currentTarget,'wide',h('div',{class:'pl'},'Kép (PNG)'),
    mi(`Teljes méret`,`${d1.w} × ${d1.h}`,()=>snapPNG('1')),mi('4K',`${d4.w} × ${d4.h}`,()=>snapPNG('4k')),h('hr'),
    h('div',{class:'pl'},'Videó (MP4, képkockánként renderelve)'),
    h('div',{class:'pc'},
      sel('Felbontás',[['1',`Teljes · ${d1.w}×${d1.h}`],['4k',`4K · ${d4.w}×${d4.h}`]],()=>EXP.res,v=>EXP.res=v),
      sel('Képkocka',[['30','30 fps'],['60','60 fps']],()=>EXP.fps,v=>EXP.fps=+v),
      sel('Hossz',[['tl',`Idővonal · ${(+st.dur).toFixed(1)} mp`],['5','5 mp'],['10','10 mp'],['15','15 mp'],['20','20 mp'],['30','30 mp'],['60','60 mp']],()=>EXP.dur,v=>EXP.dur=v==='tl'?'tl':+v),
      sel('Kezdés',[['0','Az elejétől (0 mp)'],['head','A lejátszófejtől']],()=>EXP.from,v=>EXP.from=v),
      sel('Mozgási elmosás',[['0','Nincs'],['8','8 részkép (gyors)'],['16','16 részkép (szép)'],['32','32 részkép (filmes)']],()=>EXP.mb,v=>EXP.mb=+v),
      sel('Zárszög',[['90','90° (élesebb)'],['180','180° (mozis)'],['270','270°'],['360','360° (legelmosottabb)']],()=>EXP.sh,v=>EXP.sh=+v),
      h('p',{class:'small'},can?'Akkor is hibátlan, folyamatos videó lesz, ha az előnézet akad: minden képkocka külön renderelődik. A mozgási elmosás képkockánként több részképet átlagol, ezért a renderelés annyiszor lassabb. Visszhang (feedback) rétegek csóvái ilyenkor rövidebbek.':'Ez a böngésző nem tud MP4-et kódolni (WebCodecs hiányzik). Használd a lenti valós idejű felvételt, vagy Chrome-ot/Edge-et.'),
      h('button',{class:'btn accent',disabled:!can,onclick:()=>{closePop();renderVideo(EXP.res,EXP.fps,EXP.dur);}},'Videó renderelése')),
    h('hr'),h('div',{class:'pl'},'Valós idejű felvétel (WebM, előnézeti felbontás)'),
    mi('Felvétel · 10 mp','',()=>startRec(10)),mi('Felvétel · 30 mp','',()=>startRec(30)));};
$('#projBtn').onclick=e=>openPop(e.currentTarget,h('div',{class:'pl'},'Projekt'),mi('Mentés és megnyitás…','',projModal),mi('Új, üres vászon','',()=>{st.layers=[];R.selId=null;commit();renderAll();toast('Üres vászon. ⌘Z visszahozza az előzőt.');}),h('hr'),
  h('div',{class:'pl'},'Megjelenés'),mi('Rendszer szerint','',()=>setTheme('')),mi('Sötét','',()=>setTheme('dark')),mi('Világos','',()=>setTheme('light')));
export function updLookLbl(){const e=$('#lookLbl');if(e)e.textContent=st.look.preset;}
export function openLook(anchor){
  const grid=h('div',{class:'lookgrid'},...Object.keys(LOOKS).map(n=>h('button',{class:'lkb','aria-pressed':String(st.look.preset===n),onclick:()=>{const fp=st.look.fps||0;st.look=mkLook(n);st.look.fps=fp;commit();updLookLbl();openLook(anchor);}},n)));
  const toneObj={get v(){return st.look.tone;},set v(x){st.look.tone=x;st.look.preset='Egyéni';updLookLbl();}};
  const sl=LOOKP.map(d=>ctlSlider(st.look.p[d.k],d,{noAnim:true,onInput:()=>{if(st.look.preset!=='Egyéni'){st.look.preset='Egyéni';updLookLbl();}}}));
  openPop(anchor,h('div',{class:'pl'},'Kinézet · renderelés és színkezelés'),h('div',{class:'pc'},grid,ctlSelect(toneObj,SEL('tone','Tónusleképezés',['Nincs (vágás)','ACES filmes','AgX'],1)),ctlSelect(fpsObj(st.look,()=>{}),SEL('fps','Képkocka-ütem (az egész kép)',FPS_OPTS.map(o=>o[1]),0)),...sl));}
$('#lookBtn').onclick=e=>openLook(e.currentTarget);
export function setTheme(t){if(t)document.documentElement.setAttribute('data-theme',t);else document.documentElement.removeAttribute('data-theme');try{localStorage.setItem('latomas2.theme',t);}catch(_){}}
try{const t=localStorage.getItem('latomas2.theme');if(t)document.documentElement.setAttribute('data-theme',t);}catch(_){}
