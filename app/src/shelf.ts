import { R } from './runtime';
import { $, h } from './dom';
import { CATS, CAT_HINT, LIB } from './library';
import { TH, TW, renderThumb, thumbCache } from './thumbs';
import { addFromLib } from './itemops';
import { markDirty } from './loop';
import { thumbGet, thumbPut } from './thumbstore';
import { EFFECTS } from './effects/index';

R.cat='recipes';R.thumbJob=0;R.libQ='';
const fold=s=>s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
/** Search across every shelf by name (accent-insensitive): [cat, index] pairs. */
export function libSearch(q){const f=fold(q.trim());if(!f)return [];const r=[];for(const [c] of CATS)LIB[c].forEach((it,i)=>{if(!it.head&&fold(it.name).includes(f))r.push([c,i]);});return r;}
$('#libSearch').oninput=e=>{R.libQ=e.target.value;buildCats();buildShelf();};
const tagCache={};
/** U3: what a library card can be dropped on (Megjelenések only), e.g. „csak Felhő”. null = a normal standalone element. */
export function dropTag(cat,i){if(cat!=='fx'&&cat!=='particles')return null;const key=cat+':'+i;
  if(!(key in tagCache)){let t=null;try{const d=EFFECTS[LIB[cat][i].make().type];
    if(d&&d.host)t={only:true,s:'csak '+d.host.map(x=>EFFECTS[x].name).join(', '),tip:`Csak ${d.host.map(x=>EFFECTS[x].name).join(', ')} rétegre húzható`};
    else if(d&&(cat==='fx'||d.kind==='fx'))t={only:false,s:'rétegre is',tip:'Rétegre húzva csak arra hat; kattintva önálló szűrőréteg'};}catch(_){}tagCache[key]=t;}
  return tagCache[key];}
export function buildCats(){const s=$('#cats');s.innerHTML='';for(const [k,l] of CATS)s.appendChild(h('button',{'aria-pressed':String(!R.libQ&&k===R.cat),onclick:()=>{R.cat=k;R.libQ='';$('#libSearch').value='';buildCats();buildShelf();}},l));}
export function buildShelf(){
  const box=$('#items');box.innerHTML='';const found=R.libQ?libSearch(R.libQ):null;
  $('#shelfHint').textContent=found?(found.length?`${found.length} találat minden polcról`:'Nincs találat. Próbálj rövidebb szót.'):CAT_HINT[R.cat]||'';
  const job=++R.thumbJob;const todo=[];
  (found||LIB[R.cat].map((_,i)=>[R.cat,i])).forEach(([cat,i])=>{const item=LIB[cat][i];
    if(item.head){box.appendChild(h('div',{class:'shsep','aria-hidden':'true'},item.head));return;}
    const c=h('canvas',{width:TW,height:TH});const tg=dropTag(cat,i);const b=h('button',{class:'item',draggable:'true',title:tg?`${item.name} · ${tg.tip}`:item.name},c,h('span',null,item.name),tg?h('span',{class:'ftag'+(tg.only?' only':'')},tg.s):null);
    const key=cat+':'+i;if(thumbCache[key])c.getContext('2d').drawImage(thumbCache[key],0,0);else todo.push([i,c,key,cat]);
    const cc=cat;
    b.onmouseenter=()=>setAudition(cc,i);b.onmouseleave=()=>setAudition(null);b.onfocus=()=>setAudition(cc,i);b.onblur=()=>setAudition(null);
    b.onclick=()=>{setAudition(null);addFromLib(cc,i,null);};
    b.ondragstart=e=>{setAudition(null);e.dataTransfer.setData('text/x-latomas-lib',cc+':'+i);e.dataTransfer.effectAllowed='copy';};
    box.appendChild(b);});
  // 1) draw what the persistent cache already has (async, no GPU work), 2) render the rest one by one and store them
  const pending=[];let checked=0;
  const step=()=>{if(job!==R.thumbJob)return;const j=pending.shift();if(!j)return;const cc=j[3];try{const img=renderThumb(cc,j[0]);thumbCache[j[2]]=img;j[1].getContext('2d').drawImage(img,0,0);thumbPut(cc,LIB[cc][j[0]].name,img);}catch(e){console.warn(e);}setTimeout(step,12);};
  if(!todo.length)return;
  for(const j of todo)thumbGet(j[3],LIB[j[3]][j[0]].name).then(bmp=>{if(job!==R.thumbJob)return;
    if(bmp){const cnv=document.createElement('canvas');cnv.width=TW;cnv.height=TH;cnv.getContext('2d').drawImage(bmp,0,0);thumbCache[j[2]]=cnv;j[1].getContext('2d').drawImage(cnv,0,0);}else pending.push(j);
    if(++checked===todo.length&&pending.length)setTimeout(step,30);});}
R.audition=null;export const audCache={};
export function setAudition(c,i?){markDirty();if(c==null){R.audition=null;$('#audition').hidden=true;return;}const key=c+':'+i;R.audition=audCache[key]||(audCache[key]=LIB[c][i].make());
  const a=$('#audition');a.textContent=`Előnézet: ${LIB[c][i].name} · kattints a hozzáadáshoz`;a.hidden=false;}
