import { R } from './runtime';
import { h } from './dom';
import { PALS, PAL_ORDER, palCSS, palJS } from './palettes';
import { colorWell } from './colorpick';
import { gradEditor, gradSwatches } from './gradui';
import { rgbToHex } from './colorutil';
import { markDirty } from './loop';
import { fxFits, fxHostNote, BASEK, BLENDS, EFFECTS, SVG_CHEV, SVG_EYE, SVG_EYEOFF, SVG_WAVE, SVG_X, WAVES } from './effects/index';
import { LIB } from './library';
import { catalogLabel } from './catalog';
import { sel, st } from './state';
import { ANIM_SYM, ANIM_TIP, SVG_CURVE, animKinds, curV, hasK, keyButton, keyEditor, setVal } from './evaluation';
import { renderLayers } from './layers';
import { renderInsp } from './inspector';
import { commit } from './history';
import { AUD, sigLabel, sigList } from './signals';
import { queueTL, renderTimeline } from './timeline';
import { toast } from './modals';
import { fxIcon } from './fxicons';
import { effectName, effectParam } from './effectcopy';
import { cyclesIn, loopLen, loopOn } from './time';
import { animMenu, animItems, segIcons, switchRow } from './ui/common';
import { WAVE_ICON } from './ui/icons';

R.liveCtl=[];R.liveFields=[];
export function fmt(v,d){if(d.type==='sel')return d.opts[Math.round(v)]||'';const r=d.max-d.min;const dg=d.step>=1||r>=50?0:2;return (+v).toFixed(dg);}
export const SECOPEN=(()=>{try{return JSON.parse(localStorage.getItem('latomas2.sec')||'{}');}catch(_){return {};}})();
export function section(title,key,open,...kids){const d=h('details',{class:'sec'},h('summary',null,title),h('div',{class:'content'},...kids));d.open=SECOPEN[key]??open;
  d.ontoggle=()=>{SECOPEN[key]=d.open;try{localStorage.setItem('latomas2.sec',JSON.stringify(SECOPEN));}catch(_){}};return d;}
export function setFill(r){const p=(r.value-r.min)/(r.max-r.min)*100;r.style.setProperty('--p',Math.max(0,Math.min(100,p))+'%');}
export function ctlSlider(obj,d,{big,onInput,noAnim,dice}:any={}){
  const step=d.step||((d.max-d.min)/1000);
  const rng=h('input',{type:'range',min:d.min,max:d.max,step,value:obj.v,'aria-label':d.l});setFill(rng);
  const val=h('input',{class:'val',value:fmt(obj.v,d),'aria-label':d.l+' value'});
  const mod=h('i',{class:'mod',hidden:true});
  // WA1: the ◇ animate menu replaces the old ∿ button; the wave pane is still what „Wave” opens
  const anb=noAnim?null:h('button',{class:'anb',title:'Animate',html:SVG_WAVE,'aria-label':d.l+' animate',hidden:true});
  let ked=null;const kgr=noAnim?null:h('button',{class:'kb kgr',type:'button',title:'Keyframes and curve',html:SVG_CURVE,'aria-label':d.l+' curve'});
  const kbtn=noAnim?null:keyButton(obj,d.l,()=>{box.classList.toggle('keyed',hasK(obj));if(ked&&!hasK(obj)){ked.remove();ked=null;}});
  const dz=dice?h('button',{class:'anb',style:'opacity:1',title:'New random value','aria-label':'New random seed',html:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="4" y="4" width="16" height="16" rx="3"/><circle cx="9" cy="9" r="1.2" fill="currentColor"/><circle cx="15" cy="15" r="1.2" fill="currentColor"/><circle cx="12" cy="12" r="1.2" fill="currentColor"/></svg>',onclick:()=>{obj.v=Math.floor(Math.random()*1000);rng.value=obj.v;setFill(rng);val.value=fmt(obj.v,d);onInput&&onInput();commit();}}):null;
  const ab=noAnim?null:h('span',{class:'abadge'});
  const ics=h('span',{class:'ics'},dz,kbtn,anb);
  // U4: one row (name · slider · icons · value); big controls (group Vezérlők) keep the slider on its own line
  const box=h('div',{class:'ctl'+(big?' big':'')+(obj.a||obj.s?' anim':'')+(hasK(obj)?' keyed':'')},h('div',{class:'top'},h('span',{class:'lab',title:d.l},h('span',{class:'lt'},d.l),ab,ics),h('div',{class:'rngw'},rng,mod),val));
  const put=v=>{if(noAnim)obj.v=v;else setVal(obj,v);};
  if(kgr)kgr.onclick=()=>{if(ked){ked.remove();ked=null;return;}if(!hasK(obj)){toast('Add a keyframe with ◆ first.');return;}ked=keyEditor(obj,d,d.l);box.appendChild(ked);};
  const live={obj,d,mod,rng,val,kbtn,ab,box,busy:false,ak:null};
  rng.addEventListener('pointerdown',()=>{live.busy=true;});const unbusy=()=>{live.busy=false;};rng.addEventListener('pointerup',unbusy);rng.addEventListener('pointercancel',unbusy);rng.addEventListener('blur',unbusy);
  rng.oninput=()=>{const v=+rng.value;put(v);val.value=fmt(v,d);setFill(rng);onInput&&onInput();syncTwins(live);if(hasK(obj)){box.classList.add('keyed');queueTL();}};rng.onchange=()=>{live.busy=false;commit();};
  val.onchange=()=>{const v=parseFloat(String(val.value).replace(',','.'));if(isFinite(v)){put(v);rng.value=v;setFill(rng);onInput&&onInput();syncTwins(live);commit();}val.value=fmt(curV(obj),d);};
  val.onkeydown=e=>{if(e.key==='Enter')val.blur();};
  if(anb){let pane=null;anb.onclick=()=>{if(pane){pane.remove();pane=null;return;}
    const a=h('input',{type:'range',min:0,max:1,step:.005,value:obj.a,'aria-label':'Depth'}),f=h('input',{type:'range',min:.01,max:3,step:.01,value:obj.f,'aria-label':'Rhythm'});
    // WA1: the waveform is an icon group (the icon draws the wave), so the names cannot truncate
    const w=segIcons('Waveform',WAVES.map((x,i)=>({icon:WAVE_ICON[i]||WAVE_ICON[0],tip:x,name:x})),Math.max(0,obj.w|0),i=>{obj.w=i;commit();});
    // Körbeér (row 22): whole cycles per loop; the stored Ütem stays, the snap happens in ev()
    const lpI=h('span',{class:'small lpinfo'}),lpInfo=()=>{const L=loopLen();lpI.textContent=!obj.lp?'':L>0?`${cyclesIn(obj.f,L)} cycles / ${+L.toFixed(2)} s`:'No loop to align with';};
    const lpRow:any=switchRow('Seamless loop','The wave completes a whole number of cycles during the scene so its end matches its beginning.',!!obj.lp,v=>{if(v)obj.lp=1;else delete obj.lp;lpInfo();commit();});const lp=lpRow.velSwitch;
    a.oninput=()=>{obj.a=+a.value;setFill(a);box.classList.toggle('anim',obj.a>0);};a.onchange=commit;f.oninput=()=>{obj.f=+f.value;setFill(f);lpInfo();};f.onchange=commit;
    const sg=h('select',{'aria-label':'Jel'},h('option',{value:''},'— none —'),...sigList().map(([k,l])=>{const o=h('option',{value:k},l);if(obj.s===k)o.selected=true;return o;}));
    const sa=h('input',{type:'range',min:-1,max:1,step:.01,value:obj.sa??.5,'aria-label':'Signal strength'});
    sg.onchange=()=>{obj.s=sg.value;if(obj.sa==null)obj.sa=.5;box.classList.toggle('anim',!!(obj.a||obj.s));commit();};sa.oninput=()=>{obj.sa=+sa.value;setFill(sa);};sa.onchange=commit;
    pane=h('div',{class:'lfo'},h('span',null,'Wave'),w,h('span',null,'Depth'),a,h('span',null,'Rhythm'),f,h('div',{class:'lprow'},lpRow,lpI),h('span',null,'Jel'),h('div',{class:'pop'},sg),h('span',null,'Signal strength'),sa);box.appendChild(pane);
    if(!obj.a&&!obj.s&&!AUD.buf&&!AUD.stems.length){obj.a=.25;a.value=.25;if(loopOn()){obj.lp=1;lp.checked=true;}box.classList.add('anim');commit();}lpInfo();setFill(a);setFill(f);setFill(sa);};}
  if(!noAnim){
    const paneOpen=()=>!!box.querySelector(':scope > .lfo');
    const openPane=()=>{if(!paneOpen())anb.click();};
    ics.appendChild(animMenu(d.l+' — animate',animItems({
      wave:()=>anb.click(),
      loop:()=>{openPane();const sw:any=box.querySelector('.lfo wa-switch');if(sw&&!sw.checked){sw.checked=true;sw.dispatchEvent(new Event('change'));}},
      loopOn:!!obj.lp,
      keys:()=>{if(kgr)kgr.onclick(null as any);},
      link:()=>{openPane();const sg:any=box.querySelector('.lfo select');if(sg)sg.focus();},
    })));
  }
  if(!noAnim){box.ondragover=e=>{if([...e.dataTransfer.types].includes('text/x-latomas-sig')){e.preventDefault();box.classList.add('sigdrop');}};
    box.ondragleave=()=>box.classList.remove('sigdrop');
    box.ondrop=e=>{const k=e.dataTransfer.getData('text/x-latomas-sig');box.classList.remove('sigdrop');if(!k)return;e.preventDefault();obj.s=k;if(obj.sa==null)obj.sa=.5;box.classList.add('anim');commit();toast(`${sigLabel(k)} → ${d.l}`);};}
  R.liveCtl.push(live);return box;}
/** U4: the same value shown in two places (main settings + Mozgás tab) follows the one being edited. */
export function syncTwins(src){for(const c of R.liveCtl)if(c!==src&&c.obj===src.obj){const v=curV(c.obj);c.rng.value=v;setFill(c.rng);c.val.value=fmt(v,c.d);}}
/** ◆ ∿ ♪ ⇢ badges next to a parameter label: what animates it. Updated live from the frame loop (cheap string compare). */
export function paintBadge(el,kinds){if(!el||el.dataset.k===kinds)return;el.dataset.k=kinds;el.textContent=[...kinds].map(c=>ANIM_SYM[c]).join(' ');el.title=kinds?'Animated by: '+[...kinds].map(c=>ANIM_TIP[c]).join(', '):'';}
export const liveKinds=o=>animKinds(o);
export function ctlSelect(obj,d){
  if(!R.liveSel)R.liveSel=[];const me:any={obj};const twins=()=>{for(const t of R.liveSel)if(t!==me&&t.obj===obj)t.set(Math.round(obj.v));};
  if(d.opts.length<=3){const seg=h('div',{class:'seg',role:'group','aria-label':d.l});me.set=i=>[...seg.children].forEach((b,j)=>b.setAttribute('aria-pressed',String(j===i)));
    d.opts.forEach((o,i)=>seg.appendChild(h('button',{'aria-pressed':String(Math.round(obj.v)===i),onclick:()=>{obj.v=i;me.set(i);twins();commit();}},o)));
    R.liveSel.push(me);return h('div',{class:'row2'},h('span',null,d.l),seg);}
  const s=h('select',{'aria-label':d.l},...d.opts.map((o,i)=>{const op=h('option',{value:i},o);if(Math.round(obj.v)===i)op.selected=true;return op;}));me.set=i=>{s.value=String(i);};s.onchange=()=>{obj.v=+s.value;twins();commit();};
  R.liveSel.push(me);return h('div',{class:'row2'},h('span',null,d.l),h('div',{class:'pop'},s));}
/** U5: the shared picker (project + palette swatches, drop a dragged colour on it); one undo step per edit. */
export function ctlColor(obj,d){const L=sel();const c=colorWell(()=>obj.v,v=>{obj.v=v;markDirty();},ch=>{if(ch)commit();},d.l,{alpha:!!d.alpha,extra:()=>L?[0,.25,.5,.75,1].map(t=>rgbToHex(palJS(L.pal||0,t) as any)):[]});return h('div',{class:'row2'},h('span',null,d.l),c);}
export function ctlSwitch(label,checked,on){const s=h('input',{type:'checkbox',class:'sw','aria-label':label});s.checked=!!checked;s.onchange=()=>on(s.checked);return h('label',{class:'row2'},h('span',null,label),s);}
export function ctlParam(L,d,big?){d=effectParam(L.type,d);const o=L.p[d.k];if(d.type==='sel')return ctlSelect(o,d);if(d.type==='color')return ctlColor(o,d);return ctlSlider(o,d,{big,dice:d.k==='seed'});}
export function scrubField(lbl,obj,d,scale,keyed?){
  const inp=h('input',{value:fmt(curV(obj),d),'aria-label':lbl});const kbtn=keyed?keyButton(obj,lbl,keyed):null;const ab=keyed?h('span',{class:'abadge'}):null;const box=h('div',{class:'scrub',title:'Drag horizontally to adjust the value'},h('b',null,lbl,ab),inp,kbtn);
  let sx=null,v0=0;box.onpointerdown=e=>{if(e.target===inp||e.target.closest('.kb'))return;box.setPointerCapture(e.pointerId);sx=e.clientX;v0=curV(obj);};
  const put=v=>{if(keyed)setVal(obj,v);else obj.v=v;};
  box.onpointermove=e=>{if(sx==null)return;let v=v0+(e.clientX-sx)*scale*(e.shiftKey?.1:1);if(d.k==='s')v=Math.max(.02,v);put(v);inp.value=fmt(v,d);if(hasK(obj))queueTL();};
  box.onpointerup=()=>{if(sx!=null){sx=null;commit();if(hasK(obj))renderTimeline();keyed&&keyed();}};
  inp.onchange=()=>{const v=parseFloat(String(inp.value).replace(',','.'));if(isFinite(v)){put(v);commit();keyed&&keyed();}inp.value=fmt(curV(obj),d);};inp.onkeydown=e=>{if(e.key==='Enter')inp.blur();};
  R.liveFields.push({obj,d,inp,kbtn,ab});return box;}
export function palettePicker(L){const wrap=h('div',{class:'palpick'});const build=()=>{wrap.innerHTML='';
  const box=h('div',{class:'swatches',role:'group','aria-label':'Paletta'});PAL_ORDER.forEach(i=>{const p=PALS[i];const b=h('button',{class:'swatch',title:p.n,'aria-label':'Paletta: '+p.n,'aria-pressed':String(!L.grad&&L.pal===i),style:`background:${palCSS(i)}`});
  b.onclick=()=>{L.pal=i;delete L.grad;commit();build();};box.appendChild(b);});
  // U5: own gradient (✎) and saved own palettes; the editor opens under the swatches when the layer uses its own gradient
  box.append(...gradSwatches(L,build));wrap.appendChild(box);if(L.grad)wrap.appendChild(gradEditor(L,build));};build();return wrap;}
export function blendRow(L){const s=h('select',{'aria-label':'Blend mode'},...BLENDS.map(b=>{const o=h('option',{value:b[0]},b[1]);if(b[0]===L.blend)o.selected=true;return o;}));
  s.onchange=()=>{L.blend=s.value;commit();renderLayers();};return h('div',{class:'row2'},h('span',null,'Blend'),h('div',{class:'pop'},s));}
/** U4: the layer's appearance chain as an icon row (order = chain order, drag to reorder; dimmed = off). The chosen icon
 *  opens one detail strip (name, order, on/off, remove, its settings). „+” opens an icon grid instead of a long list. */
R.fxSel={};R.fxBody={};
export function fxListUI(L){
  const list=h('div',{class:'fxl'});const n=L.fx.length;let si=Math.min(R.fxSel[L.id]??0,n-1);
  const row=h('div',{class:'fxrow',role:'toolbar','aria-label':'Layer effects in order'});
  L.fx.forEach((F,i)=>{const d=EFFECTS[F.type];
    const b=h('button',{class:'fxic'+(F.vis?'':' off')+(i===si?' on':'')+(fxFits(F.type,L)?'':' bad'),type:'button',draggable:'true','aria-pressed':String(i===si),title:`${i+1}. ${effectName(F.type,d.name)}${F.vis?'':' (off)'} · strength ${Math.round(curV(F.n.opacity)*100)}% · drag to reorder`,'aria-label':effectName(F.type,d.name),html:fxIcon(F.type,effectName(F.type,d.name))});
    b.appendChild(h('i',{class:'fxno'},String(i+1)));b.style.setProperty('--s',String(Math.max(0,Math.min(1,curV(F.n.opacity)))));
    b.onclick=()=>{R.fxSel[L.id]=i;if(i===si)R.fxBody[L.id]=!R.fxBody[L.id];renderInsp();};
    b.ondragstart=e=>{e.dataTransfer.setData('text/x-vel-fx',String(i));e.dataTransfer.effectAllowed='move';};
    b.ondragover=e=>{if([...e.dataTransfer.types].includes('text/x-vel-fx')){e.preventDefault();b.classList.add('dropat');}};
    b.ondragleave=()=>b.classList.remove('dropat');
    b.ondrop=e=>{b.classList.remove('dropat');const from=+e.dataTransfer.getData('text/x-vel-fx');if(!isFinite(from)||from===i)return;e.preventDefault();const [m]=L.fx.splice(from,1);L.fx.splice(i,0,m);R.fxSel[L.id]=i;commit();renderInsp();renderLayers();};
    row.appendChild(b);});
  const add=h('button',{class:'fxic add',type:'button',title:'Add Appearance','aria-label':'Add Appearance','aria-expanded':'false'},'+');row.appendChild(add);
  list.appendChild(row);
  const grid=h('div',{class:'fxgrid',hidden:true,role:'menu','aria-label':'Appearances'},...LIB.fx.map((it:any,i)=>{if(it.head)return null;const ty=it.make().type,ok=fxFits(ty,L);
    return h('button',{class:'fxg',type:'button',role:'menuitem',disabled:!ok,title:ok?catalogLabel('fx',i):`${catalogLabel('fx',i)}: ${fxHostNote(ty)}`,onclick:()=>{L.fx.push(LIB.fx[i].make());R.fxSel[L.id]=L.fx.length-1;R.fxBody[L.id]=true;commit();renderInsp();renderLayers();}},
      h('span',{class:'gi',html:fxIcon(ty,catalogLabel('fx',i))}),h('span',null,catalogLabel('fx',i)));}));
  add.onclick=()=>{grid.hidden=!grid.hidden;add.setAttribute('aria-expanded',String(!grid.hidden));};
  list.appendChild(grid);
  if(n){const i=si,F=L.fx[i],d=EFFECTS[F.type];const open=!!R.fxBody[L.id];
    const mv=dir=>{const j=i+dir;if(j<0||j>=L.fx.length)return;[L.fx[i],L.fx[j]]=[L.fx[j],L.fx[i]];R.fxSel[L.id]=j;commit();renderInsp();renderLayers();};
    const tog=h('button',{class:'chev'+(open?' open':''),html:SVG_CHEV,'aria-label':effectName(F.type,d.name)+' settings','aria-expanded':String(open)});
    const nm=h('span',{class:'ln'},h('span',{class:'fxn'},(i+1)+'.'),' ',effectName(F.type,d.name));
    const up=n>1?h('button',{class:'eye','aria-label':'Move earlier in chain',title:'Earlier',disabled:i===0},'◀'):null;if(up)up.onclick=()=>mv(-1);
    const dn=n>1?h('button',{class:'eye','aria-label':'Move later in chain',title:'Later',disabled:i===n-1},'▶'):null;if(dn)dn.onclick=()=>mv(1);
    const eye=h('button',{class:'eye','aria-label':'Be/ki',html:F.vis?SVG_EYE:SVG_EYEOFF});eye.onclick=()=>{F.vis=!F.vis;commit();renderInsp();renderLayers();};
    const del=h('button',{class:'eye','aria-label':'Remove',html:SVG_X});del.onclick=()=>{L.fx.splice(i,1);R.fxSel[L.id]=Math.max(0,i-1);commit();renderInsp();renderLayers();};
    const body=h('div',{class:'fxb',hidden:!open});
    if(open){if(F.type==='pdisp')body.appendChild(pdispExtra(L,F));if(!fxFits(F.type,L))body.appendChild(h('p',{class:'small warn'},'Does not affect this layer: '+fxHostNote(F.type)+'.'));for(const pd of d.params)body.appendChild(ctlParam(F,pd));if(d.usesPal)body.appendChild(palettePicker(F));body.appendChild(ctlSlider(F.n.opacity,{...BASEK.opacity,l:'Strength'},{onInput:()=>{const ic=row.children[i];if(ic)ic.style.setProperty('--s',String(Math.max(0,Math.min(1,curV(F.n.opacity)))));}}));}
    const toggle=()=>{R.fxBody[L.id]=!open;renderInsp();};tog.onclick=toggle;nm.onclick=toggle;
    list.appendChild(h('div',{class:'fxi'},h('header',null,tog,nm,up,dn,eye,del),body));}
  list.appendChild(h('p',{class:'small'},n?'Effects apply from left to right. Click an icon for settings or drag to reorder. You can also drag an Appearance from the Library onto this layer.':'No layer effects yet. Use + or drag an Appearance from the Library onto this layer.'));return list;}

/** Részecskékre bontás: new texts for the scatter → reassemble cycle (text layers only) + a hint about cues. */
function pdispExtra(L,F){const isT=L.text&&(L.type==='text'||L.type==='mtext');const kids=[];
  if(Math.round(F.p.trig.v)===1&&!(st.cues&&st.cues.length))kids.push(h('p',{class:'small'},'No cues yet. Press J to the beat during playback, or choose Repeated mode.'));
  if(isT){const ta=h('textarea',{class:'code',rows:3,spellcheck:'false','aria-label':'New text on reassembly',placeholder:'One new text per line (empty: restore the original)'});ta.value=(F.alts||[]).join('\n');
    ta.onchange=()=>{const a=ta.value.split(/\r?\n/).map(s=>s.trim()).filter(Boolean);if(a.length)F.alts=a;else delete F.alts;commit();};
    kids.push(h('div',{class:'ctl'},h('div',{class:'top'},h('span',{class:'lab'},'New text on reassembly (one per line)')),ta,h('p',{class:'small'},'After disintegration, the next text reassembles, looping through the list. The original layer text stays editable.')));}
  return h('div',null,...kids);}
