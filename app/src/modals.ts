import { SHORTCUTS } from './workspace';
import { R } from './runtime';
import { $, h } from './dom';
import { ff, hexRGB } from './palettes';
import { EFFECTS } from './effects/index';
import { texFromCanvas } from './gl';
import { assets, imgTex, makeLayer, sel } from './state';
import { insertItem } from './itemops';
import { commit, loadMsg, loadProject, projectJSON, renderAll } from './history';
import { saveFile } from './output';

export function openModal(...kids){const d=$('#dlg');d.innerHTML='';kids.forEach(k=>d.appendChild(k));$('#modal').hidden=false;const f=d.querySelector('button,input,textarea');f&&f.focus();}
export function closeModal(){$('#modal').hidden=true;$('#dlg').innerHTML='';}
$('#modal').addEventListener('click',e=>{if(e.target.id==='modal')closeModal();});
export const closeBtn=()=>h('button',{class:'btn',onclick:closeModal},'Bezárás');
export function openMedia(kind,url,name,label,blob){
  openModal(h('h2',null,kind==='img'?'Kép elkészült':'Videó elkészült'),kind==='img'?h('img',{src:url,alt:'Elkészült kép'}):h('video',{src:url,controls:true,autoplay:true,loop:true,muted:true,playsinline:true}),
    h('p',null,`${label} · ${name}. Ha a mentés nem működne, kattints jobb gombbal, majd mentés másként.`),
    h('div',{class:'bar2'},closeBtn(),h('button',{class:'btn accent',onclick:()=>saveFile(name,blob)},'Mentés fájlba')));}
export function showCode(L){const d=EFFECTS[L.type];const code=(d.lib?d.lib+'\n\n':'')+d.code;
  openModal(h('h2',null,d.name+' · GLSL'),h('p',null,'Az fx() függvény minden pixelre lefut. A p_… nevek a csúszkák. Klónozd saját rétegként, és írd át kedvedre.'),h('pre',null,code),
    h('div',{class:'bar2'},closeBtn(),h('button',{class:'btn accent',onclick:()=>{
      const defs=d.params.map(p=>p.type==='color'?`#define p_${p.k} vec3(${hexRGB(L.p[p.k].v).map(x=>ff(+x.toFixed(4))).join(',')})`:`#define p_${p.k} ${ff(+(+L.p[p.k].v).toFixed(4))}`).join('\n');
      const c=makeLayer('custom',{name:d.name+' (saját)',pal:L.pal,blend:L.blend,code:`// ${d.name}: a csúszkák értékei konstansként rögzítve\n${defs}\n${d.lib||''}\n${d.code}`});insertItem(c,L.id);commit();renderAll();closeModal();}},'Klónozás saját GLSL-ként')));}
$('#helpBtn').onclick=()=>openModal(h('h2',null,'Így működik'),
  h('p',null,'Kezdj egy receptből (Portál, Lélek, Bolygó, Tűz…). Minden recept egy csoport néhány nagy vezérlővel. Kinyithatod, és bármelyik rétegét átírhatod.'),
  h('p',null,'Maszk: tegyél be egy alakzatot, fölé egy forrást, és annál kapcsold be a „Vágás az alatta lévő rétegbe” opciót. Az alakzat „Csak maszkként” láthatatlan marad.'),
  h('p',null,'Rétegeffekt: húzz egy szűrőt (pl. Elmosás, Organikus torzítás) a könyvtárból egy rétegre, és csak arra hat. Egy alakzatra húzott elmosás puha maszkot ad.'),
  h('p',null,'A csúszkák hullám-ikonja animációt kapcsol rá. A kijelölt réteget a vásznon húzással mozgatod, a négyzet fogantyúval méretezed, a színes pöttyel forgatod.'),
  h('table',null,...[['Hang gomb','Hangfájl, stem-ek; a jelet húzd rá egy csúszkára'],['Idővonal','Kattintás vagy húzás: ugrás; ⟲ ismétlés; jobbra a hossz'],...SHORTCUTS.flatMap(g=>g[1])].map(([a,b])=>h('tr',null,h('td',null,a),h('td',null,b)))),
  h('div',{class:'bar2'},closeBtn()));
export const savedList=()=>{try{return JSON.parse(localStorage.getItem('latomas2.saved')||'[]');}catch(_){return [];}};
export function projModal(){const list=savedList();const name=h('input',{class:'txt',placeholder:'Projekt neve','aria-label':'Projekt neve'});const ta=h('textarea',{class:'code',style:'min-height:120px','aria-label':'Projektfájl'});ta.value=projectJSON();
  const ul=h('ul',{class:'saved'},...(list.length?list.map((p,i)=>h('li',null,h('span',null,p.name+'  ',h('small',{class:'small'},new Date(p.t).toLocaleString('hu-HU'))),
    h('button',{class:'btn',onclick:()=>{try{loadProject(JSON.parse(list[i].data));closeModal();toast(loadMsg());}catch(e){toast(e.message);}}},'Megnyitás'),
    h('button',{class:'btn',onclick:()=>{const l=savedList();l.splice(i,1);try{localStorage.setItem('latomas2.saved',JSON.stringify(l));}catch(_){}projModal();}},'Törlés'))):[h('li',null,h('span',{class:'small'},'Még nincs mentett projekt.'))]));
  openModal(h('h2',null,'Projekt'),h('div',{class:'btnrow'},name,h('button',{class:'btn accent',onclick:()=>{const n=name.value.trim()||'Névtelen látomás';const l=savedList();l.unshift({name:n,t:Date.now(),data:projectJSON()});
      try{localStorage.setItem('latomas2.saved',JSON.stringify(l.slice(0,30)));toast('Mentve: '+n);projModal();}catch(_){toast('Nem fért el a böngészőben (a képek sok helyet foglalnak). Mentsd fájlba.');}}},'Mentés a böngészőbe')),ul,
    h('p',null,'Projektfájl: mentsd le, vagy illessz be egyet a betöltéshez.'),ta,
    h('div',{class:'bar2'},h('button',{class:'btn',onclick:()=>$('#fileJson').click()},'Fájl megnyitása…'),h('button',{class:'btn',onclick:()=>{try{loadProject(JSON.parse(ta.value));closeModal();toast(loadMsg());}catch(e){toast('Nem sikerült: '+e.message);}}},'Betöltés a mezőből'),
      h('button',{class:'btn',onclick:()=>saveFile(`latomas-projekt-${Date.now()}.json`,projectJSON())},'Mentés fájlba'),closeBtn()));}
$('#fileJson').onchange=e=>{const f=e.target.files[0];if(!f)return;f.text().then(t=>{loadProject(JSON.parse(t));closeModal();toast(loadMsg());}).catch(err=>toast('Hibás fájl: '+err.message));e.target.value='';};
$('#fileImg').onchange=e=>{const f=e.target.files[0];e.target.value='';const L=sel();if(!f||!L||(L.type!=='image'&&L.type!=='particles'))return;
  const im=new Image();im.onload=()=>{const sc=Math.min(1,2048/Math.max(im.naturalWidth,im.naturalHeight));const c=document.createElement('canvas');c.width=Math.round(im.naturalWidth*sc);c.height=Math.round(im.naturalHeight*sc);c.getContext('2d').drawImage(im,0,0,c.width,c.height);
    const id='A'+Date.now().toString(36);assets[id]=c.toDataURL(f.type==='image/jpeg'?'image/jpeg':'image/png',.9);imgTex.set(id,{tex:texFromCanvas(c),w:c.width,h:c.height});
    L.asset=id;if(L.name==='Kép')L.name=f.name.replace(/\.[^.]+$/,'').slice(0,40);commit();renderAll();URL.revokeObjectURL(im.src);};
  im.onerror=()=>toast('Ezt a képet nem tudtam megnyitni.');im.src=URL.createObjectURL(f);};
R.toastT=undefined;export function toast(m){const t=$('#toast');t.textContent=m;t.hidden=false;clearTimeout(R.toastT);R.toastT=setTimeout(()=>t.hidden=true,3200);}
