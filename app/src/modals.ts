import { SHORTCUTS } from './workspace';
import { R } from './runtime';
import { $, h } from './dom';
import { ff, hexRGB } from './palettes';
import { EFFECTS } from './effects/index';
import { texFromCanvas } from './gl';
import { assets, imgTex, makeLayer, sameAsset, sel } from './state';
import { insertItem } from './itemops';
import { commit, loadMsg, loadProject, projectJSON, renderAll } from './history';
import { saveFile } from './output';
import { tr } from './locale';

export function openModal(...kids){const d=$('#dlg');d.innerHTML='';kids.forEach(k=>d.appendChild(k));$('#modal').hidden=false;const f=d.querySelector('button,input,textarea');f&&f.focus();}
/** Closing by any route (button, Escape, backdrop) runs the owner's close hook once, e.g. the video export's cancel. */
export function closeModal(){const f=R.onModalClose;R.onModalClose=null;$('#modal').hidden=true;$('#dlg').innerHTML='';if(f)f();}
$('#modal').addEventListener('click',e=>{if(e.target.id==='modal')closeModal();});
export const closeBtn=()=>h('button',{class:'btn',onclick:closeModal},tr('project.close'));
export function openMedia(kind,url,name,label,blob){
  openModal(h('h2',null,kind==='img'?tr('media.image.ready'):tr('media.video.ready')),kind==='img'?h('img',{src:url,alt:tr('media.image.alt')}):h('video',{src:url,controls:true,autoplay:true,loop:true,muted:true,playsinline:true}),
    h('p',null,tr('media.save.hint',{label,name})),
    h('div',{class:'bar2'},closeBtn(),h('button',{class:'btn accent',onclick:()=>saveFile(name,blob)},tr('media.save'))));}
export function showCode(L){const d=EFFECTS[L.type];const code=(d.lib?d.lib+'\n\n':'')+d.code;
  openModal(h('h2',null,d.name+' · GLSL'),h('p',null,tr('code.note')),h('pre',null,code),
    h('div',{class:'bar2'},closeBtn(),h('button',{class:'btn accent',onclick:()=>{
      const defs=d.params.map(p=>p.type==='color'?`#define p_${p.k} vec3(${hexRGB(L.p[p.k].v).map(x=>ff(+x.toFixed(4))).join(',')})`:`#define p_${p.k} ${ff(+(+L.p[p.k].v).toFixed(4))}`).join('\n');
      const c=makeLayer('custom',{name:d.name+' (custom)',pal:L.pal,blend:L.blend,code:`// ${d.name}: slider values captured as constants\n${defs}\n${d.lib||''}\n${d.code}`});insertItem(c,L.id);commit();renderAll();closeModal();}},tr('code.clone'))));}
$('#helpBtn').onclick=()=>openModal(h('h2',null,tr('help.overview.title')),
  h('p',null,tr('help.overview.recipes')),
  h('p',null,tr('help.overview.mask')),
  h('p',null,tr('help.overview.effect')),
  h('p',null,tr('help.overview.controls')),
  h('table',null,...[[tr('help.overview.audio'),tr('help.overview.audio.note')],[tr('help.overview.timeline'),tr('help.overview.timeline.note')],...SHORTCUTS.flatMap(g=>g[1])].map(([a,b])=>h('tr',null,h('td',null,a),h('td',null,b)))),
  h('div',{class:'bar2'},closeBtn()));
export const savedList=()=>{try{return JSON.parse(localStorage.getItem('latomas2.saved')||'[]');}catch(_){return [];}};
export function projModal(){const list=savedList();const name=h('input',{class:'txt',placeholder:tr('project.name'),'aria-label':tr('project.name')});const ta=h('textarea',{class:'code',style:'min-height:120px','aria-label':tr('project.file')});ta.value=projectJSON();
  const ul=h('ul',{class:'saved'},...(list.length?list.map((p,i)=>h('li',null,h('span',null,p.name+'  ',h('small',{class:'small'},new Date(p.t).toLocaleString('en-US'))),
    h('button',{class:'btn',onclick:()=>{try{loadProject(JSON.parse(list[i].data));closeModal();toast(loadMsg());}catch(e){toast(e.message);}}},tr('project.open')),
    h('button',{class:'btn',onclick:()=>{const l=savedList();l.splice(i,1);try{localStorage.setItem('latomas2.saved',JSON.stringify(l));}catch(_){}projModal();}},tr('project.delete')))):[h('li',null,h('span',{class:'small'},tr('project.empty')))]));
  openModal(h('h2',null,tr('project.title')),h('div',{class:'btnrow'},name,h('button',{class:'btn accent',onclick:()=>{const n=name.value.trim()||tr('project.untitled');const l=savedList();l.unshift({name:n,t:Date.now(),data:projectJSON()});
      try{localStorage.setItem('latomas2.saved',JSON.stringify(l.slice(0,30)));toast(tr('project.saved',{name:n}));projModal();}catch(_){toast(tr('project.storage.full'));}}},tr('project.save.browser'))),ul,
    R.projExtra?R.projExtra():null,h('div',{class:'btnrow'},h('button',{class:'btn',onclick:()=>R.openLottie&&R.openLottie()},tr('project.import.lottie'))),h('p',null,tr('project.file.instructions')),ta,
    h('div',{class:'bar2'},h('button',{class:'btn',onclick:()=>$('#fileJson').click()},tr('project.load.file')),h('button',{class:'btn',onclick:()=>{try{loadProject(JSON.parse(ta.value));closeModal();toast(loadMsg());}catch(e){toast(tr('project.load.failed',{error:e.message}));}}},tr('project.load.field')),
      h('button',{class:'btn',onclick:()=>saveFile(`vel-project-${Date.now()}.json`,projectJSON())},tr('project.save.file')),closeBtn()));}
$('#fileJson').onchange=e=>{const f=e.target.files[0];if(!f)return;f.text().then(t=>{loadProject(JSON.parse(t));closeModal();toast(loadMsg());}).catch(err=>toast(tr('project.file.invalid',{error:err.message})));e.target.value='';};
$('#fileImg').onchange=e=>{const f=e.target.files[0];e.target.value='';const L=sel();if(!f||!L||(L.type!=='image'&&L.type!=='particles'))return;
  const im=new Image();im.onload=()=>{const sc=Math.min(1,2048/Math.max(im.naturalWidth,im.naturalHeight));const c=document.createElement('canvas');c.width=Math.round(im.naturalWidth*sc);c.height=Math.round(im.naturalHeight*sc);c.getContext('2d').drawImage(im,0,0,c.width,c.height);
    const data=c.toDataURL(f.type==='image/jpeg'?'image/jpeg':'image/png',.9),old=sameAsset(data),id=old||'A'+Date.now().toString(36);if(!old){assets[id]=data;imgTex.set(id,{tex:texFromCanvas(c),w:c.width,h:c.height});}
    L.asset=id;if(L.name==='Kép')L.name=f.name.replace(/\.[^.]+$/,'').slice(0,40);commit();renderAll();URL.revokeObjectURL(im.src);};
  im.onerror=()=>toast(tr('project.image.invalid'));im.src=URL.createObjectURL(f);};
R.toastT=undefined;export function toast(m){const t=$('#toast');t.textContent=m;t.hidden=false;clearTimeout(R.toastT);R.toastT=setTimeout(()=>t.hidden=true,3200);}
