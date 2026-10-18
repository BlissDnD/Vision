import { R } from './runtime';
import { $, h } from './dom';
import { SVG_CHEV, SVG_EYE, SVG_EYEOFF, iconKind, kindOf } from './effects/index';
import { st } from './state';
import { itemCost, itemError } from './cost';
import { addFromLib, attachFx, moveItemTo } from './itemops';
import { LIB } from './library';
import { renderInsp } from './inspector';
import { commit } from './history';
import { variantBadge } from './variantsui';
import { animKinds } from './evaluation';
import { isVariant, linksOf } from './variants';

/** U3: what is on a layer, as small badges: ◆ animated, ✦ Megjelenés, ⇢ Kapcsolat, ⧉ Változat. */
export function layerBadges(it){const out=[];
  const nodes=[];for(const g of ['n','p'])for(const k in it[g]||{})nodes.push(it[g][k]);for(const f of it.fx||[])for(const k in f.p||{})nodes.push(f.p[k]);
  let kf=0,live=0;for(const o of nodes){const a=animKinds(o);if(a.includes('k'))kf++;if(/[ws]/.test(a))live++;}
  if(kf||live)out.push({c:'anim',s:'◆',tip:'Animált: '+[kf?`${kf} paraméter kulcskockákkal`:'',live?`${live} hullámmal vagy jellel`:''].filter(Boolean).join(', ')});
  const nf=(it.fx||[]).length;if(nf)out.push({c:'fxb',s:nf>1?'✦'+nf:'✦',tip:'Megjelenés: '+it.fx.map(f=>f.name||f.type).join(', ')});
  const nl=linksOf(it.id).length;if(nl)out.push({c:'lnk',s:nl>1?'⇢'+nl:'⇢',tip:`Kapcsolat: ${nl} · kattints a beállításhoz`});
  if(isVariant(it)){const vb=variantBadge(it);out.push({c:'var',s:'⧉',tip:'Változat: '+vb.replace(/^◇ /,'')});}
  return out;}
export function renderLayers(){
  const ul=$('#ltree');ul.innerHTML='';let n=0;
  const row=(it,depth)=>{
    n++;const k=kindOf(it);const isG=it.type==='group';
    const li=h('li',{class:'lr'+(it.id===R.selId?' sel':'')+(it.vis?'':' off'),'data-id':it.id,draggable:'true',style:`padding-left:${6+depth*16}px`});
    if(isG){const ch=h('button',{class:'chev'+(it.open?' open':''),'aria-label':it.open?'Összecsukás':'Kinyitás',html:SVG_CHEV});ch.onclick=e=>{e.stopPropagation();it.open=!it.open;renderLayers();};li.appendChild(ch);}
    else li.appendChild(h('span',{class:'clip',title:it.clip?'Az alatta lévő rétegbe vágva':''},it.clip?'↳':''));
    li.appendChild(h('span',{class:'lic',html:iconKind(k)}));
    const sub=it.maskOnly?'maszk':'';
    li.appendChild(h('span',{class:'ln'},it.name,sub?h('span',{class:'lk'},'  '+sub):null));
    if(R.tapBadge){const tb=R.tapBadge(it.id);if(tb)li.appendChild(tb);}
    const bd=layerBadges(it);if(bd.length)li.appendChild(h('span',{class:'bdgs'},...bd.map(b=>{const e=h('span',{class:'bdg '+b.c,title:b.tip},b.s);
      if(b.c==='lnk'){e.setAttribute('role','button');e.onclick=ev=>{ev.stopPropagation();const r=e.getBoundingClientRect();if(R.openLinkCard)R.openLinkCard(it.id,r.left,r.bottom);};}return e;})));
    if(itemError(it))li.appendChild(h('span',{class:'errdot',title:'Ez a réteg nem tudott lefordulni ezen a gépen, ezért üres. Kattints rá a részletekért.'},'!'));
    const cst=itemCost(it);if(cst>=3){const lv=cst>=8?3:cst>=5?2:1;li.appendChild(h('span',{class:'cost',title:'Gépigény: '+['','közepes','nagy','nagyon nagy'][lv]},...[4,7,10].map((hh,i)=>h('i',{style:`height:${hh}px;opacity:${i<lv?1:.25}`}))));}
    const eye=h('button',{class:'eye','aria-label':'Láthatóság',html:it.vis?SVG_EYE:SVG_EYEOFF});eye.onclick=e=>{e.stopPropagation();it.vis=!it.vis;commit();renderLayers();};li.appendChild(eye);
    li.onclick=()=>{if(R.tapArm&&R.tapToggle){R.tapToggle(it.id);return;}R.selId=it.id;renderLayers();renderInsp();};
    li.ondblclick=()=>{const inp=$('#insp input.nm');if(inp){inp.focus();inp.select();}};
    li.ondragstart=e=>{e.dataTransfer.setData('text/x-latomas-layer',it.id);e.dataTransfer.effectAllowed='move';};
    li.ondragover=e=>{e.preventDefault();const lib=[...e.dataTransfer.types].includes('text/x-latomas-lib');li.classList.add(lib||(isG&&it.open)?'drop-in':'drop-above');};
    li.ondragleave=()=>li.classList.remove('drop-in','drop-above');
    li.ondrop=e=>{e.preventDefault();e.stopPropagation();li.classList.remove('drop-in','drop-above');
      const lib=e.dataTransfer.getData('text/x-latomas-lib');
      if(lib){const [c,i]=lib.split(':');if(c==='fx')attachFx(c,+i,it.id);else addFromLib(c,+i,it.id);return;}
      const id=e.dataTransfer.getData('text/x-latomas-layer');if(id)moveItemTo(id,it.id,isG&&it.open);};
    ul.appendChild(li);
    if(isG&&it.open)for(const c of [...it.children].reverse())row(c,depth+1);
  };
  for(const it of [...st.layers].reverse())row(it,0);
  if(!st.layers.length)ul.appendChild(h('li',{class:'lempty'},'Üres. Válassz egy receptet lent, vagy húzz ide bármit a könyvtárból.'));
  $('#layerCount').textContent=n?String(n):'';}
$('#ltree').ondragover=e=>e.preventDefault();
$('#ltree').ondrop=e=>{e.preventDefault();const lib=e.dataTransfer.getData('text/x-latomas-lib');if(lib){const [c,i]=lib.split(':');if(LIB[c]&&LIB[c][+i]&&LIB[c][+i].mo){addFromLib(c,+i,null);return;}R.selId=null;addFromLib(c,+i,null);}};
