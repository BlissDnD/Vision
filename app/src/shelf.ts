import { R } from './runtime';
import { $, h } from './dom';
import { CATS, CAT_HINT, LIB } from './library';
import { TH, TW, renderThumb, thumbCache } from './thumbs';
import { addFromLib } from './itemops';
import { markDirty } from './loop';
import { thumbGet, thumbPut } from './thumbstore';

R.cat='recipes';R.thumbJob=0;
export function buildCats(){const s=$('#cats');s.innerHTML='';for(const [k,l] of CATS)s.appendChild(h('button',{'aria-pressed':String(k===R.cat),onclick:()=>{R.cat=k;buildCats();buildShelf();}},l));}
export function buildShelf(){
  const box=$('#items');box.innerHTML='';$('#shelfHint').textContent=CAT_HINT[R.cat]||'';
  const job=++R.thumbJob;const todo=[];
  LIB[R.cat].forEach((item,i)=>{
    if(item.head){box.appendChild(h('div',{class:'shsep','aria-hidden':'true'},item.head));return;}
    const c=h('canvas',{width:TW,height:TH});const b=h('button',{class:'item',draggable:'true',title:item.name},c,h('span',null,item.name));
    const key=R.cat+':'+i;if(thumbCache[key])c.getContext('2d').drawImage(thumbCache[key],0,0);else todo.push([i,c,key]);
    const cc=R.cat;
    b.onmouseenter=()=>setAudition(cc,i);b.onmouseleave=()=>setAudition(null);b.onfocus=()=>setAudition(cc,i);b.onblur=()=>setAudition(null);
    b.onclick=()=>{setAudition(null);addFromLib(cc,i,null);};
    b.ondragstart=e=>{setAudition(null);e.dataTransfer.setData('text/x-latomas-lib',cc+':'+i);e.dataTransfer.effectAllowed='copy';};
    box.appendChild(b);});
  const cc=R.cat;
  // 1) draw what the persistent cache already has (async, no GPU work), 2) render the rest one by one and store them
  const pending=[];let checked=0;
  const step=()=>{if(job!==R.thumbJob)return;const j=pending.shift();if(!j)return;try{const img=renderThumb(cc,j[0]);thumbCache[j[2]]=img;j[1].getContext('2d').drawImage(img,0,0);thumbPut(cc,LIB[cc][j[0]].name,img);}catch(e){console.warn(e);}setTimeout(step,12);};
  if(!todo.length)return;
  for(const j of todo)thumbGet(cc,LIB[cc][j[0]].name).then(bmp=>{if(job!==R.thumbJob)return;
    if(bmp){const cnv=document.createElement('canvas');cnv.width=TW;cnv.height=TH;cnv.getContext('2d').drawImage(bmp,0,0);thumbCache[j[2]]=cnv;j[1].getContext('2d').drawImage(cnv,0,0);}else pending.push(j);
    if(++checked===todo.length&&pending.length)setTimeout(step,30);});}
R.audition=null;export const audCache={};
export function setAudition(c,i?){markDirty();if(c==null){R.audition=null;$('#audition').hidden=true;return;}const key=c+':'+i;R.audition=audCache[key]||(audCache[key]=LIB[c][i].make());
  const a=$('#audition');a.textContent=`Előnézet: ${LIB[c][i].name} · kattints a hozzáadáshoz`;a.hidden=false;}
