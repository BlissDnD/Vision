import { R } from './runtime';
import { h } from './dom';
import { PALS, PAL_ORDER, palCSS } from './palettes';
import { BASEK, BLENDS, EFFECTS, SVG_CHEV, SVG_EYE, SVG_EYEOFF, SVG_WAVE, SVG_X, WAVES } from './effects/index';
import { LIB } from './library';
import { SVG_CURVE, curV, hasK, keyButton, keyEditor, setVal } from './evaluation';
import { renderLayers } from './layers';
import { renderInsp } from './inspector';
import { commit } from './history';
import { AUD, sigLabel, sigList } from './signals';
import { renderTimeline } from './timeline';
import { toast } from './modals';

R.liveCtl=[];R.liveFields=[];
export function fmt(v,d){if(d.type==='sel')return d.opts[Math.round(v)]||'';const r=d.max-d.min;const dg=d.step>=1||r>=50?0:2;return (+v).toFixed(dg);}
export const SECOPEN=(()=>{try{return JSON.parse(localStorage.getItem('latomas2.sec')||'{}');}catch(_){return {};}})();
export function section(title,key,open,...kids){const d=h('details',{class:'sec'},h('summary',null,title),h('div',{class:'content'},...kids));d.open=SECOPEN[key]??open;
  d.ontoggle=()=>{SECOPEN[key]=d.open;try{localStorage.setItem('latomas2.sec',JSON.stringify(SECOPEN));}catch(_){}};return d;}
export function setFill(r){const p=(r.value-r.min)/(r.max-r.min)*100;r.style.setProperty('--p',Math.max(0,Math.min(100,p))+'%');}
export function ctlSlider(obj,d,{big,onInput,noAnim,dice}:any={}){
  const step=d.step||((d.max-d.min)/1000);
  const rng=h('input',{type:'range',min:d.min,max:d.max,step,value:obj.v,'aria-label':d.l});setFill(rng);
  const val=h('input',{class:'val',value:fmt(obj.v,d),'aria-label':d.l+' értéke'});
  const mod=h('i',{class:'mod',hidden:true});
  const anb=noAnim?null:h('button',{class:'anb',title:'Animálás',html:SVG_WAVE,'aria-label':d.l+' animálása'});
  let ked=null;const kgr=noAnim?null:h('button',{class:'kb kgr',type:'button',title:'Kulcskockák és görbe',html:SVG_CURVE,'aria-label':d.l+' görbéje'});
  const kbtn=noAnim?null:keyButton(obj,d.l,()=>{box.classList.toggle('keyed',hasK(obj));if(ked&&!hasK(obj)){ked.remove();ked=null;}});
  const dz=dice?h('button',{class:'anb',style:'opacity:1',title:'Új véletlen','aria-label':'Új véletlen mag',html:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="4" y="4" width="16" height="16" rx="3"/><circle cx="9" cy="9" r="1.2" fill="currentColor"/><circle cx="15" cy="15" r="1.2" fill="currentColor"/><circle cx="12" cy="12" r="1.2" fill="currentColor"/></svg>',onclick:()=>{obj.v=Math.floor(Math.random()*1000);rng.value=obj.v;setFill(rng);val.value=fmt(obj.v,d);onInput&&onInput();commit();}}):null;
  const box=h('div',{class:'ctl'+(big?' big':'')+(obj.a||obj.s?' anim':'')+(hasK(obj)?' keyed':'')},h('div',{class:'top'},h('span',{class:'lab'},h('span',null,d.l),h('i',{class:'ad'})),dz,kgr,kbtn,anb,val),h('div',{class:'rngw'},rng,mod));
  if(kgr)kgr.onclick=()=>{if(ked){ked.remove();ked=null;return;}if(!hasK(obj)){toast('Előbb tegyél kulcskockát a ◆ gombbal.');return;}ked=keyEditor(obj,d,d.l);box.appendChild(ked);};
  rng.oninput=()=>{const v=+rng.value;setVal(obj,v);val.value=fmt(v,d);setFill(rng);onInput&&onInput();if(hasK(obj))renderTimeline();};rng.onchange=()=>commit();
  val.onchange=()=>{const v=parseFloat(String(val.value).replace(',','.'));if(isFinite(v)){setVal(obj,v);rng.value=v;setFill(rng);onInput&&onInput();commit();}val.value=fmt(curV(obj),d);};
  val.onkeydown=e=>{if(e.key==='Enter')val.blur();};
  if(anb){let pane=null;anb.onclick=()=>{if(pane){pane.remove();pane=null;return;}
    const a=h('input',{type:'range',min:0,max:1,step:.005,value:obj.a,'aria-label':'Mélység'}),f=h('input',{type:'range',min:.01,max:3,step:.01,value:obj.f,'aria-label':'Ütem'});
    const w=h('select',{'aria-label':'Hullámforma'},...WAVES.map((x,i)=>{const o=h('option',{value:i},x);if(obj.w===i)o.selected=true;return o;}));
    a.oninput=()=>{obj.a=+a.value;setFill(a);box.classList.toggle('anim',obj.a>0);};a.onchange=commit;f.oninput=()=>{obj.f=+f.value;setFill(f);};f.onchange=commit;w.onchange=()=>{obj.w=+w.value;commit();};
    const sg=h('select',{'aria-label':'Jel'},h('option',{value:''},'— nincs —'),...sigList().map(([k,l])=>{const o=h('option',{value:k},l);if(obj.s===k)o.selected=true;return o;}));
    const sa=h('input',{type:'range',min:-1,max:1,step:.01,value:obj.sa??.5,'aria-label':'Jel erőssége'});
    sg.onchange=()=>{obj.s=sg.value;if(obj.sa==null)obj.sa=.5;box.classList.toggle('anim',!!(obj.a||obj.s));commit();};sa.oninput=()=>{obj.sa=+sa.value;setFill(sa);};sa.onchange=commit;
    pane=h('div',{class:'lfo'},h('span',null,'Hullám'),h('div',{class:'pop'},w),h('span',null,'Mélység'),a,h('span',null,'Ütem'),f,h('span',null,'Jel'),h('div',{class:'pop'},sg),h('span',null,'Jel erőssége'),sa);box.appendChild(pane);
    if(!obj.a&&!obj.s&&!AUD.buf&&!AUD.stems.length){obj.a=.25;a.value=.25;box.classList.add('anim');commit();}setFill(a);setFill(f);setFill(sa);};}
  if(!noAnim){box.ondragover=e=>{if([...e.dataTransfer.types].includes('text/x-latomas-sig')){e.preventDefault();box.classList.add('sigdrop');}};
    box.ondragleave=()=>box.classList.remove('sigdrop');
    box.ondrop=e=>{const k=e.dataTransfer.getData('text/x-latomas-sig');box.classList.remove('sigdrop');if(!k)return;e.preventDefault();obj.s=k;if(obj.sa==null)obj.sa=.5;box.classList.add('anim');commit();toast(`${sigLabel(k)} → ${d.l}`);};}
  R.liveCtl.push({obj,d,mod,rng,val,kbtn});return box;}
export function ctlSelect(obj,d){
  if(d.opts.length<=3){const seg=h('div',{class:'seg',role:'group','aria-label':d.l});d.opts.forEach((o,i)=>seg.appendChild(h('button',{'aria-pressed':String(Math.round(obj.v)===i),onclick:()=>{obj.v=i;[...seg.children].forEach((b,j)=>b.setAttribute('aria-pressed',String(j===i)));commit();}},o)));
    return h('div',{class:'row2'},h('span',null,d.l),seg);}
  const s=h('select',{'aria-label':d.l},...d.opts.map((o,i)=>{const op=h('option',{value:i},o);if(Math.round(obj.v)===i)op.selected=true;return op;}));s.onchange=()=>{obj.v=+s.value;commit();};
  return h('div',{class:'row2'},h('span',null,d.l),h('div',{class:'pop'},s));}
export function ctlColor(obj,d){const c=h('input',{type:'color',class:'cwell',value:obj.v,'aria-label':d.l});c.oninput=()=>{obj.v=c.value;};c.onchange=commit;return h('div',{class:'row2'},h('span',null,d.l),c);}
export function ctlSwitch(label,checked,on){const s=h('input',{type:'checkbox',class:'sw','aria-label':label});s.checked=!!checked;s.onchange=()=>on(s.checked);return h('label',{class:'row2'},h('span',null,label),s);}
export function ctlParam(L,d,big?){const o=L.p[d.k];if(d.type==='sel')return ctlSelect(o,d);if(d.type==='color')return ctlColor(o,d);return ctlSlider(o,d,{big,dice:d.k==='seed'});}
export function scrubField(lbl,obj,d,scale,keyed?){
  const inp=h('input',{value:fmt(curV(obj),d),'aria-label':lbl});const kbtn=keyed?keyButton(obj,lbl,keyed):null;const box=h('div',{class:'scrub',title:'Húzd vízszintesen az érték állításához'},h('b',null,lbl),inp,kbtn);
  let sx=null,v0=0;box.onpointerdown=e=>{if(e.target===inp||e.target.closest('.kb'))return;box.setPointerCapture(e.pointerId);sx=e.clientX;v0=curV(obj);};
  box.onpointermove=e=>{if(sx==null)return;let v=v0+(e.clientX-sx)*scale*(e.shiftKey?.1:1);if(d.k==='s')v=Math.max(.02,v);setVal(obj,v);inp.value=fmt(v,d);};
  box.onpointerup=()=>{if(sx!=null){sx=null;commit();if(hasK(obj))renderTimeline();}};
  inp.onchange=()=>{const v=parseFloat(String(inp.value).replace(',','.'));if(isFinite(v)){setVal(obj,v);commit();}inp.value=fmt(curV(obj),d);};inp.onkeydown=e=>{if(e.key==='Enter')inp.blur();};
  R.liveFields.push({obj,d,inp,kbtn});return box;}
export function palettePicker(L){const box=h('div',{class:'swatches',role:'group','aria-label':'Paletta'});PAL_ORDER.forEach(i=>{const p=PALS[i];const b=h('button',{class:'swatch',title:p.n,'aria-label':'Paletta: '+p.n,'aria-pressed':String(L.pal===i),style:`background:${palCSS(i)}`});
  b.onclick=()=>{L.pal=i;[...box.children].forEach(x=>x.setAttribute('aria-pressed',String(x===b)));commit();};box.appendChild(b);});return box;}
export function blendRow(L){const s=h('select',{'aria-label':'Keverési mód'},...BLENDS.map(b=>{const o=h('option',{value:b[0]},b[1]);if(b[0]===L.blend)o.selected=true;return o;}));
  s.onchange=()=>{L.blend=s.value;commit();renderLayers();};return h('div',{class:'row2'},h('span',null,'Keverés'),h('div',{class:'pop'},s));}
export function fxListUI(L){
  const list=h('div',{class:'fxl'});
  L.fx.forEach((F,i)=>{const d=EFFECTS[F.type];let open=false;const body=h('div',{class:'fxb',hidden:true});
    const tog=h('button',{class:'chev',html:SVG_CHEV,'aria-label':d.name+' beállításai'});
    const eye=h('button',{class:'eye','aria-label':'Be/ki',html:F.vis?SVG_EYE:SVG_EYEOFF});eye.onclick=()=>{F.vis=!F.vis;eye.innerHTML=F.vis?SVG_EYE:SVG_EYEOFF;commit();};
    const del=h('button',{class:'eye','aria-label':'Eltávolítás',html:SVG_X});del.onclick=()=>{L.fx.splice(i,1);commit();renderInsp();renderLayers();};
    const nm=h('span',{class:'ln'},h('span',{class:'fxn'},(i+1)+'.'),' ',d.name);
    // order matters (top = applied first): move up / down in the chain
    const mv=(dir)=>{const j=i+dir;if(j<0||j>=L.fx.length)return;[L.fx[i],L.fx[j]]=[L.fx[j],L.fx[i]];commit();renderInsp();renderLayers();};
    const up=L.fx.length>1?h('button',{class:'eye','aria-label':'Előrébb a láncban',title:'Előrébb',disabled:i===0},'▲'):null;if(up)up.onclick=()=>mv(-1);
    const dn=L.fx.length>1?h('button',{class:'eye','aria-label':'Hátrébb a láncban',title:'Hátrébb',disabled:i===L.fx.length-1},'▼'):null;if(dn)dn.onclick=()=>mv(1);
    const hd=h('header',null,tog,nm,up,dn,eye,del);
    const toggle=()=>{open=!open;body.hidden=!open;tog.classList.toggle('open',open);if(open&&!body.childElementCount){for(const pd of d.params)body.appendChild(ctlParam(F,pd));if(d.usesPal)body.appendChild(palettePicker(F));body.appendChild(ctlSlider(F.n.opacity,{...BASEK.opacity,l:'Erősség'}));}};
    tog.onclick=toggle;nm.onclick=toggle;
    list.appendChild(h('div',{class:'fxi'},hd,body));});
  const s=h('select',{'aria-label':'Megjelenés hozzáadása'},h('option',{value:''},'Megjelenés hozzáadása…'),...LIB.fx.map((it,i)=>h('option',{value:i},it.name)));
  s.onchange=()=>{if(s.value==='')return;L.fx.push(LIB.fx[+s.value].make());commit();renderInsp();renderLayers();};
  list.appendChild(h('div',{class:'addfx'},h('div',{class:'pop'},s)));
  list.appendChild(h('p',{class:'small'},'A lánc felülről lefelé hat. Tipp: húzz egy Megjelenést a könyvtárból közvetlenül erre a rétegre.'));return list;}
