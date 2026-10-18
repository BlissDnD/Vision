import { R } from './runtime';
import { $, h } from './dom';
import { CATS, CAT_HINT, LIB } from './library';
import { TH, TW, renderThumb, thumbCache } from './thumbs';
import { addFromLib } from './itemops';
import { markDirty } from './loop';
import { thumbGet, thumbPut } from './thumbstore';
import { EFFECTS } from './effects/index';
import { makeMo, moIcon } from './motion';
import { findItem } from './state';
import { ROLES, TOPICS, catRoleCounts, catSearch, resetCatalog, topicItems, catalogLabel } from './catalog';
import { SECTION_EN } from './catalogcopy';
import { iconBtn } from './ui/common';
import { CAT_COLOR, CAT_ICON } from './ui/icons';

R.cat='recipes';R.thumbJob=0;R.libQ='';
/** Search across every shelf by name (accent-insensitive): [cat, index] pairs. */
/** CAT-01: synonym-aware search over every shelf, optionally narrowed to one role (R.libRole). */
export function libSearch(q){return catSearch(q,R.libRole||null);}
$('#libSearch').oninput=e=>{R.libQ=e.target.value;buildCats();buildShelf();};
const tagCache={};
/** Cache key of a card: own (user library) items by id, so deleting one never shifts another's thumbnail. */
export const ikey=(cat,i)=>{const it=LIB[cat][i];return it&&it.own?'own:'+it.own:cat+':'+i;};
/** U3: what a library card can be dropped on (Megjelenések only), e.g. „csak Felhő”. null = a normal standalone element. */
export function dropTag(cat,i){if(LIB[cat][i]&&LIB[cat][i].mo)return {only:false,s:'on layer',tip:'Drag onto a layer to attach it, or select a layer and click. Hover to preview it.'};if(cat!=='fx'&&cat!=='particles')return null;const key=ikey(cat,i);
  if(!(key in tagCache)){let t=null;try{const d=EFFECTS[LIB[cat][i].make().type];
    if(d&&d.host)t={only:true,s:'restricted',tip:`Only compatible with ${d.host.join(', ')} layers`};
    else if(d&&(cat==='fx'||d.kind==='fx'))t={only:false,s:'on layer too',tip:'Drag onto a layer to affect only that layer. Click to add a separate filter layer.'};}catch(_){}tagCache[key]=t;}
  return tagCache[key];}
export function buildCats(){const s=$('#cats');s.innerHTML='';
  // CAT-01: while searching, the shelf row turns into role chips (Mind + the four roles with hit counts)
  if(R.libQ&&R.libQ.trim()){const tp0=$('#topics');if(tp0)tp0.hidden=true;const n=catRoleCounts(R.libQ);const chip=(k,l)=>h('button',{class:'rolechip','aria-pressed':String((R.libRole||null)===k),onclick:()=>{R.libRole=k;buildCats();buildShelf();}},l);
    s.appendChild(chip(null,'All'));for(const [k,l] of ROLES)if(n[k]||R.libRole===k)s.appendChild(chip(k,`${l} ${n[k]}`));return;}
  R.libRole=null;resetCatalog();
  // CAT-01 themes: a second chip row under the shelves; a theme lists its entries from every shelf
  let tp=$('#topics');if(!tp){tp=h('div',{class:'seg topics',id:'topics',role:'group','aria-label':'Themes'});s.after(tp);}tp.hidden=false;tp.innerHTML='';
  for(const [k,l] of TOPICS)tp.appendChild(h('button',{'aria-pressed':String(R.libTopic===k),onclick:()=>{R.libTopic=R.libTopic===k?null:k;buildCats();buildShelf();}},l));  // WA1: the shelf row is icon-first — category colour + generic icon + one-sentence tooltip; the name stays next to it
  for(const [k,l] of CATS)s.appendChild(iconBtn({icon:CAT_ICON[k]||CAT_ICON.gen,tip:`${l} — ${CAT_HINT[k]||''}`.trim(),label:l,tint:CAT_COLOR[k]||'--vel-cat-library',
    pressed:!R.libQ&&!R.libTopic&&k===R.cat,cls:'catb',onclick:()=>{R.cat=k;R.libQ='';R.libTopic=null;$('#libSearch').value='';buildCats();buildShelf();}}));}
export function buildShelf(){
  const box=$('#items');box.innerHTML='';const found=R.libQ?libSearch(R.libQ):R.libTopic?topicItems(R.libTopic):null;
  $('#shelfHint').textContent=found?(found.length?`${found.length} results across shelves`:'No results. Try a shorter search.'):CAT_HINT[R.cat]||'';
  const job=++R.thumbJob;const todo=[];
  // P1: own items first (under „Saját”), then the built-in shelf
  let list=found;if(!list){const all=LIB[R.cat].map((_,i)=>[R.cat,i]);const own=all.filter(([c,i])=>LIB[c][i].own),rest=all.filter(([c,i])=>!LIB[c][i].own);
    list=own.length?[['#head','Yours'],...own,...(rest.length&&!LIB[R.cat][rest[0][1]].head?[['#head','Built in']]:[]),...rest]:rest;}
  list.forEach(([cat,i])=>{if(cat==='#head'){box.appendChild(h('div',{class:'shsep','aria-hidden':'true'},i));return;}const item=LIB[cat][i];
    if(item.head){box.appendChild(h('div',{class:'shsep','aria-hidden':'true'},SECTION_EN[item.head] || item.head));return;}
    const c=h('canvas',{width:TW,height:TH});const tg=dropTag(cat,i);const own=item.own;const label=catalogLabel(cat,i);
    const b=h('button',{class:'item'+(own?' own':''),draggable:'true',title:(tg?`${label} · ${tg.tip}`:label)+(own?' · yours · right-click to rename, move or delete':'')},c,h('span',null,label),
      own?h('span',{class:'ftag own'},'yours',h('i',{class:'omenu',role:'button','aria-label':'Manage your item',title:'Rename, move or delete',onclick:e=>{e.stopPropagation();R.ownMenu&&R.ownMenu(own);}},'⋯')):tg?h('span',{class:'ftag'+(tg.only?' only':'')},tg.s):null);
    if(own)b.oncontextmenu=e=>{e.preventDefault();R.ownMenu&&R.ownMenu(own);};
    const key=ikey(cat,i);if(thumbCache[key])c.getContext('2d').drawImage(thumbCache[key],0,0);
    else if(own&&item.thumb){const im=new Image();im.onload=()=>{const cnv=document.createElement('canvas');cnv.width=TW;cnv.height=TH;cnv.getContext('2d').drawImage(im,0,0,TW,TH);thumbCache[key]=cnv;c.getContext('2d').drawImage(cnv,0,0);};im.src=item.thumb;}
    else if(item.mo)drawMoThumb(c,item.mo,key);
    else if(item.lottie)drawLottieThumb(c,key);
    else if(item.polyhaven)drawPolyHavenThumb(c,key);
    else todo.push([i,c,key,cat]);
    const cc=cat;
    b.onmouseenter=()=>setAudition(cc,i);b.onmouseleave=()=>setAudition(null);b.onfocus=()=>setAudition(cc,i);b.onblur=()=>setAudition(null);
    b.onclick=()=>{setAudition(null);addFromLib(cc,i,null);};
    b.ondragstart=e=>{setAudition(null);e.dataTransfer.setData('text/x-latomas-lib',cc+':'+i);e.dataTransfer.effectAllowed='copy';};
    box.appendChild(b);});
  // 1) draw what the persistent cache already has (async, no GPU work), 2) render the rest one by one and store them
  const pending=[];let checked=0;
  const step=()=>{if(job!==R.thumbJob)return;const j=pending.shift();if(!j)return;const cc=j[3];try{const img=renderThumb(cc,j[0]);thumbCache[j[2]]=img;j[1].getContext('2d').drawImage(img,0,0);if(!LIB[cc][j[0]].own)thumbPut(cc,LIB[cc][j[0]].name,img);}catch(e){console.warn(e);}setTimeout(step,12);};
  if(!todo.length)return;
  for(const j of todo)(LIB[j[3]][j[0]].own?Promise.resolve(null):thumbGet(j[3],LIB[j[3]][j[0]].name)).then(bmp=>{if(job!==R.thumbJob)return;
    if(bmp){const cnv=document.createElement('canvas');cnv.width=TW;cnv.height=TH;cnv.getContext('2d').drawImage(bmp,0,0);thumbCache[j[2]]=cnv;j[1].getContext('2d').drawImage(cnv,0,0);}else pending.push(j);
    if(++checked===todo.length&&pending.length)setTimeout(step,30);});}
R.audition=null;export const audCache={};
export function setAudition(c,i?){markDirty();if(c==null){R.audition=null;R.moAud=null;$('#audition').hidden=true;return;}
  if(LIB[c][i].lottie){R.audition=null;R.moAud=null;const a=$('#audition');a.hidden=false;a.textContent='Vector animation (Lottie) · click to choose a local JSON file';return;}
  if(LIB[c][i].polyhaven){R.audition=null;R.moAud=null;const a=$('#audition');a.hidden=false;a.textContent='Poly Haven CC0 textures · click to browse';return;}
  if(LIB[c][i].mo){const L=R.selId&&findItem(R.selId);const a=$('#audition');a.hidden=false;R.audition=null;
    if(L){R.moAud={id:L.it.id,mo:makeMo(LIB[c][i].mo,{at:0}),t0:performance.now()};a.textContent=`Preview: ${catalogLabel(c,i)} on “${L.it.name}” · click or drag to apply`;}
    else{R.moAud=null;a.textContent=`${catalogLabel(c,i)}: select a layer to preview, or drag onto a layer`;}return;}const key=ikey(c,i);R.audition=audCache[key]||(audCache[key]=LIB[c][i].make());
  const a=$('#audition');a.textContent=`Preview: ${catalogLabel(c,i)} · click to add`;a.hidden=false;}

/** Motion cards: their icon on a dark tile (a still frame cannot show a motion; hovering previews it on the selected layer). */
function drawMoThumb(c,t,key){const im=new Image();im.onload=()=>{const cnv=document.createElement('canvas');cnv.width=TW;cnv.height=TH;const x=cnv.getContext('2d');
  const g=x.createLinearGradient(0,0,TW,TH);g.addColorStop(0,'#1d1b33');g.addColorStop(1,'#0b0a14');x.fillStyle=g;x.fillRect(0,0,TW,TH);x.drawImage(im,TW/2-30,TH/2-30,60,60);thumbCache[key]=cnv;c.getContext('2d').drawImage(cnv,0,0);};
  im.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(moIcon(t).replace('stroke="currentColor"','stroke="#b9b4ff"').replace(/fill="currentColor"/g,'fill="#b9b4ff"'));}
function drawLottieThumb(c,key){const x=c.getContext('2d'),g=x.createLinearGradient(0,0,TW,TH);g.addColorStop(0,'#34315f');g.addColorStop(1,'#11101c');x.fillStyle=g;x.fillRect(0,0,TW,TH);
  x.fillStyle='#c8bfff';x.beginPath();x.arc(TW*.5,TH*.5,Math.min(TW,TH)*.24,0,Math.PI*2);x.fill();x.fillStyle='#222038';x.beginPath();x.moveTo(TW*.46,TH*.36);x.lineTo(TW*.46,TH*.64);x.lineTo(TW*.63,TH*.5);x.closePath();x.fill();
  const cnv=document.createElement('canvas');cnv.width=TW;cnv.height=TH;cnv.getContext('2d').drawImage(c,0,0);thumbCache[key]=cnv;}
function drawPolyHavenThumb(c,key){const x=c.getContext('2d'),g=x.createLinearGradient(0,0,TW,TH);g.addColorStop(0,'#74736d');g.addColorStop(1,'#292a32');x.fillStyle=g;x.fillRect(0,0,TW,TH);x.fillStyle='#dedbd1';x.font='bold 34px sans-serif';x.textAlign='center';x.fillText('PH',TW/2,TH/2+12);const cnv=document.createElement('canvas');cnv.width=TW;cnv.height=TH;cnv.getContext('2d').drawImage(c,0,0);thumbCache[key]=cnv;}
