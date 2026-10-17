import { R } from './runtime';
import { $, h } from './dom';
import { SVG_X, BASEK, EFFECTS, KIND_LABEL, PRIM_DEF, PRIM_OP, PRIM_T, S, SEL, iconKind, kindOf, paramsOf } from './effects/index';
import { getProg, progError } from './gl';
import { mkN, sel, st } from './state';
import { macroApply } from './macros';
import { RECIPES } from './recipes';
import { ANIM_SYM, ANIM_TIP, KEY_EPS, animKinds, hasK, keyEditor, keyVal, seekTo } from './evaluation';
import { EASES, MOVES } from './render';
import { ungroup } from './itemops';
import { renderLayers } from './layers';
import { blendRow, ctlParam, ctlSelect, ctlSlider, ctlSwitch, fxListUI, palettePicker, scrubField, section } from './controls';
import { commit, scheduleSave } from './history';
import { paramList, renderTimeline } from './timeline';
import { markDirty } from './loop';
import { showCode } from './modals';
import { childVariantSection, linkSection, variantSection } from './variantsui';
import { linesSection } from './textlines';
import { spineSection } from './spinegrips';
import { lightSection, usesLight } from './lightui';

export function renderInsp(){
  {const L0=sel();const ob=document.querySelector('[data-tool=orbit]');if(ob)ob.classList.toggle('hint3d',!!L0&&(L0.type==='obj3d'||L0.type==='sdfscene'||L0.type==='surface3d'||L0.type==='cloud3d'));}
  renderTimeline();const P=$('#insp');P.innerHTML='';R.liveCtl=[];R.liveFields=[];R.liveKed=[];
  const L=sel();
  if(!L){P.appendChild(h('div',{class:'empty'},'Válassz ki egy réteget, vagy kezdj egy recepttel a lenti könyvtárból.'));return;}
  const k=kindOf(L);const isG=L.type==='group';const d=isG?null:EFFECTS[L.type];
  const TB={content:[],look:[],motion:[],fx:[],place:[]};const T=(tab,el)=>{if(el)TB[tab].push(el);};
  const nm=h('input',{class:'nm',value:L.name,'aria-label':'Réteg neve'});nm.onchange=()=>{L.name=nm.value||L.name;commit();renderLayers();};
  P.appendChild(h('div',{class:'ihead'},h('span',{class:'lic',html:iconKind(k)}),h('div',{class:'tt'},nm,h('small',null,isG?(L.macros.length?'Recept · csoport':'Csoport'):(KIND_LABEL[k]+(d.name!==L.name?' · '+d.name:'')))),
    h('button',{class:'btn',title:'Mentés presetként a saját könyvtárba (polcválasztással)','aria-label':'Mentés presetként',onclick:()=>R.savePreset&&R.savePreset(L)},'☆')));
  if(isG){
    const Rc=RECIPES.find(r=>r.n===L.recipe);if(Rc)T('content',h('p',{class:'desc'},Rc.desc));
    if(L.macros.length)T('content',section('Vezérlők','macro',true,...L.macros.map(m=>{const o={v:m.v,a:0};return ctlSlider(o,{k:'m',l:m.l,min:0,max:1},{big:true,noAnim:true,onInput:()=>macroApply(L,m,o.v)});})));
    T('look',section('Megjelenés','blend',true,blendRow(L),ctlSlider(L.n.opacity,BASEK.opacity),ctlSwitch('Vágás az alatta lévő rétegbe',L.clip,v=>{L.clip=v;commit();renderLayers();})));
    T('fx',section('Csoporteffektek','fx',true,fxListUI(L)));
    T('motion',motionSummary(L));T('motion',timingSection(L));
    T('place',placement(L,'Elhelyezés (az egész csoport)'));
    T('content',section('Rétegek','grp',true,h('p',{class:'small'},`${L.children.length} réteg van benne. Nyisd ki a rétegfában, és bármelyiket finomhangolhatod.`),
      h('div',{class:'btnrow'},h('button',{class:'btn',onclick:()=>{L.open=!L.open;renderLayers();renderInsp();}},L.open?'Rétegek elrejtése':'Rétegek mutatása'),h('button',{class:'btn',onclick:()=>ungroup(L)},'Csoport felbontása'))));
    T('content',variantSection(L));T('motion',linkSection(L));
    tabbed(P,L,TB);return;}
  T('content',h('p',{class:'desc'},d.desc));
  {const er=progError(L);if(er&&L.type!=='custom')T('content',h('div',{class:'errbox'},'Ez az effekt nem fordult le ezen a gépen, ezért üres marad. Másold ki az alábbi hibát, és küldd el, hogy javítsam.',h('pre',null,er)));}
  if(d.groups){
    d.groups.forEach(gr=>{const kids=gr.keys.map(key=>{const pd=d.params.find(p=>p.k===key);return pd?ctlParam(L,pd):null;}).filter(Boolean);
      if(gr.text){const ti=h('input',{class:'txt',value:L.btext||'','aria-label':'Saját felirat-sablon'});ti.oninput=()=>{L.btext=ti.value;};ti.onchange=commit;
        kids.push(h('div',{class:'ctl'},h('div',{class:'top'},h('span',{class:'lab'},'Saját felirat-sablon')),ti,h('p',{class:'small'},'Helyettesítők: {id} {x} {y} {w} {h} {v}. Új sor: \\n')));}
      T(/(fény|anyag|szín|stúdió|tükör)/i.test(gr.t)?'look':'content',section(gr.t,'g:'+gr.t,!!gr.open,...kids));});
    if(d.mesh)T('place',spineSection(L));
    if(d.usesPal)T('look',section('Paletta (a Színezés módhoz)','color',false,palettePicker(L),ctlSlider(L.n.hue,BASEK.hue)));
    T('look',section('Megjelenés','blend',true,ctlSlider(L.n.opacity,{...BASEK.opacity,l:'Erősség'}),ctlSwitch('Vágás az alatta lévő rétegbe',L.clip,v=>{L.clip=v;commit();renderLayers();})));
    T('fx',section('Rétegeffektek','fx',true,fxListUI(L)));
    T('motion',motionSummary(L));T('motion',linkSection(L));
    if(!d.mesh)T('content',section('Részletek','details',false,h('div',{class:'btnrow'},h('button',{class:'btn',onclick:()=>showCode(L)},'GLSL kód megnyitása'))));
    tabbed(P,L,TB,true);return;}
  const PS=paramsOf(L);const mainKeys=L.type==='custom'&&PS!==d.params?PS.map(p=>p.k):d.main||PS.slice(0,3).map(p=>p.k);
  const mainKids=[];
  if(L.type==='text'||L.type==='mtext'){const ti=h('textarea',{class:'txt',rows:String(Math.min(5,Math.max(1,String(L.text.str).split('\n').length))),'aria-label':'Felirat (Enter = új sor)'});ti.value=L.text.str;ti.oninput=()=>{L.text.str=ti.value;ti.rows=Math.min(5,Math.max(1,ti.value.split('\n').length));};ti.onchange=commit;
    const FONTS=['Bricolage Grotesque','Instrument Sans','Fraunces','Cinzel','Unbounded','Syne','Orbitron','Major Mono Display','Bodoni Moda'];
    const fs=h('select',{'aria-label':'Betűtípus'},...FONTS.map(f=>{const o=h('option',null,f);if(f===L.text.font)o.selected=true;return o;}));fs.onchange=()=>{L.text.font=fs.value;commit();};
    const ws=h('select',{'aria-label':'Vastagság'},...[['300','Vékony'],['400','Normál'],['500','Közepes'],['700','Félkövér'],['800','Extra']].map(w=>{const o=h('option',{value:w[0]},w[1]);if(w[0]===L.text.weight)o.selected=true;return o;}));ws.onchange=()=>{L.text.weight=ws.value;commit();};
    const tr={v:L.text.track,a:0};mainKids.push(ti,h('div',{class:'row2'},h('span',null,'Betűtípus'),h('div',{class:'pop'},fs)),h('div',{class:'row2'},h('span',null,'Vastagság'),h('div',{class:'pop'},ws)),
      ctlSlider(tr,S('track','Betűköz',-.1,1,.12),{noAnim:true,onInput:()=>{L.text.track=tr.v;}}));
    const AL=[['left','Balra'],['center','Középre'],['right','Jobbra']];const alo={get v(){return Math.max(0,AL.findIndex(a=>a[0]===(L.text.align||'center')));},set v(x){L.text.align=AL[Math.round(x)][0];}};
    const lho={v:L.text.lh??1.15,a:0},wro={v:L.text.wrap||0,a:0};
    mainKids.push(ctlSelect(alo,SEL('align','Igazítás',AL.map(a=>a[1]),1)),ctlSlider(lho,S('lh','Sortávolság',.7,2,1.15),{noAnim:true,onInput:()=>{L.text.lh=lho.v;}}),
      ctlSlider(wro,S('wrap','Tördelés (karakter / sor, 0 = nincs)',0,60,0,1),{noAnim:true,onInput:()=>{L.text.wrap=Math.round(wro.v);}}),
      h('p',{class:'small'},'Balra zárásnál a réteg helye a szöveg bal széle, jobbra zárásnál a jobb széle. Több sor: Enter a feliratban.'));}
  if(L.type==='particles'&&Math.round(L.p.source.v)===1)mainKids.push(h('div',{class:'btnrow'},h('button',{class:'btn accent',onclick:()=>$('#fileImg').click()},L.asset?'Másik kép…':'Kép választása…')));
  if(L.type==='image')mainKids.push(h('div',{class:'btnrow'},h('button',{class:'btn accent',onclick:()=>$('#fileImg').click()},L.asset?'Másik kép…':'Kép választása…')));
  if(L.type==='custom'){const ta=h('textarea',{class:'code',spellcheck:'false','aria-label':'GLSL kód'});ta.value=L.code;const msg=h('div',{class:'msg'});
    const check=()=>{getProg(L);const e=progError(L);msg.className='msg '+(e?'err':'ok');msg.textContent=e||'Lefordítva ✓';};let tmo;
    ta.oninput=()=>{clearTimeout(tmo);tmo=setTimeout(()=>{L.code=ta.value;check();scheduleSave();},350);};ta.onchange=()=>{L.code=ta.value;commit();};
    ta.onkeydown=e=>{if(e.key==='Tab'){e.preventDefault();ta.setRangeText('  ',ta.selectionStart,ta.selectionEnd,'end');ta.dispatchEvent(new Event('input'));}};mainKids.push(ta,msg);if(R.cpEditor)mainKids.push(R.cpEditor(L));setTimeout(check,0);}
  for(const key of mainKeys){const pd=PS.find(p=>p.k===key);if(pd)mainKids.push(ctlParam(L,pd,true));}
  if(L.type==='sdfscene')T('content',sdfObjectsSection(L));
  T('content',section(k==='fx'?'Szűrő':'Fő beállítások','main',true,...mainKids));
  if(usesLight(L))T('look',lightSection(L));
  if((k!=='fx'&&!d.noPal)||d.usesPal)T('look',section('Szín','color',true,palettePicker(L),ctlSlider(L.n.hue,BASEK.hue)));
  const blendKids=k==='fx'?[ctlSlider(L.n.opacity,{...BASEK.opacity,l:'Erősség'})]:[blendRow(L),ctlSlider(L.n.opacity,BASEK.opacity),ctlSlider(L.n.key,BASEK.key)];
  T('look',section('Megjelenés','blend',true,...blendKids));
  const maskKids=[ctlSwitch('Vágás az alatta lévő rétegbe',L.clip,v=>{L.clip=v;commit();renderLayers();})];
  if(k==='shape')maskKids.push(ctlSwitch('Csak maszkként (láthatatlan)',L.maskOnly,v=>{L.maskOnly=v;commit();renderLayers();}));
  maskKids.push(h('p',{class:'small'},k==='shape'?'A fölötte lévő rétegeknél kapcsold be a vágást, és csak ebben a formában fognak látszani.':'Bekapcsolva csak az alatta lévő réteg (pl. egy alakzat) területén látszik.'));
  T('look',section('Maszk','mask',L.clip||L.maskOnly||k==='shape',...maskKids));
  T('fx',section('Rétegeffektek','fx',true,fxListUI(L)));
  T('motion',motionSummary(L));if(k!=='fx')T('motion',timingSection(L));
  T('place',placement(L,k==='fx'?'Középpont':'Elhelyezés'));
  const detKids=PS.filter(p=>!mainKeys.includes(p.k)).map(pd=>ctlParam(L,pd));
  if(L.type!=='custom')detKids.push(h('div',{class:'btnrow'},h('button',{class:'btn',onclick:()=>showCode(L)},'GLSL kód megnyitása')));
  const ls=linesSection(L);T('content',ls);
  T('content',section('Részletek (ritkább beállítások)','details',false,...detKids));
  T('content',childVariantSection(L));
  T('motion',linkSection(L));
  tabbed(P,L,TB);
}
export function timingSection(L){
  // defaults are shown but only written into the layer on the first edit (opening the panel must not change the project)
  const T=L.tm||{in:0,inAt:0,inDur:.8,out:0,outAt:Math.max(0,(st.dur||10)-1),outDur:.8,ease:0};const own=()=>{if(!L.tm)L.tm=T;};
  const X=k=>({get v(){return T[k];},set v(x){own();T[k]=x;renderTimeline();}});const mx=Math.max(10,st.dur||10);
  return section('Időzítés (belépés, kilépés, képkocka-ütem)','timing',!!(T.in||T.out||T.fps),
    ctlSelect(X('in'),SEL('in','Belépés',MOVES,0)),ctlSlider(X('inAt'),S('inAt','Belépés kezdete (mp)',0,mx,0),{noAnim:true}),ctlSlider(X('inDur'),S('inDur','Belépés hossza (mp)',.05,5,.8),{noAnim:true}),
    ctlSelect(X('out'),SEL('out','Kilépés',MOVES,0)),ctlSlider(X('outAt'),S('outAt','Kilépés kezdete (mp)',0,mx,0),{noAnim:true}),ctlSlider(X('outDur'),S('outDur','Kilépés hossza (mp)',.05,5,.8),{noAnim:true}),
    ctlSelect(X('ease'),SEL('ease','Görbe',EASES.map(e=>e[0]),0)),
    ctlSelect(fpsObj(T,()=>{own();renderTimeline();}),SEL('fps','Képkocka-ütem (posterize time)',FPS_OPTS.map(o=>o[1]),0)),
    h('p',{class:'small'},'A belépés és a kilépés az idővonalon látszik, ha a réteg ki van jelölve. A Képkocka-ütem darabosabb, „mozis” mozgást ad: 12 vagy 8 kocka/mp kézzel rajzolt hatású.'));}
export const FPS_OPTS=[[0,'Folyamatos'],[24,'24 kocka/mp (mozi)'],[15,'15 kocka/mp'],[12,'12 kocka/mp (animáció)'],[10,'10 kocka/mp'],[8,'8 kocka/mp (stop motion)'],[6,'6 kocka/mp']];
export function fpsObj(T,after){return {get v(){const i=FPS_OPTS.findIndex(o=>o[0]===(T.fps||0));return i<0?0:i;},set v(x){T.fps=(FPS_OPTS[Math.round(x)]||FPS_OPTS[0])[0];after&&after();}};}
export function sdfObjectsSection(L){
  const P=L.prims;L.psel=Math.max(0,Math.min(L.psel|0,P.length-1));
  const chips=h('div',{class:'chips'},...P.map((o,i)=>h('button',{class:'chip','aria-pressed':String(i===L.psel),onclick:()=>{L.psel=i;renderInsp();markDirty();}},`${['+','−','∩'][o.op|0]} ${PRIM_T[o.t|0]} ${i+1}`)));
  const btns=h('div',{class:'btnrow'},
    h('button',{class:'btn',disabled:P.length>=8,onclick:()=>{P.push({...PRIM_DEF,c:Math.round(Math.random()*100)/100,x:Math.round((Math.random()-.5)*60)/100,y:Math.round((Math.random()-.5)*40)/100});L.psel=P.length-1;commit();renderInsp();}},'+ Új objektum'),
    h('button',{class:'btn',disabled:!P.length||P.length>=8,onclick:()=>{const o=P[L.psel];P.splice(L.psel+1,0,{...o,x:o.x+.15});L.psel++;commit();renderInsp();}},'Másolat'),
    h('button',{class:'btn',disabled:P.length<=1,onclick:()=>{P.splice(L.psel,1);L.psel=Math.max(0,L.psel-1);commit();renderInsp();}},'Törlés'));
  const tip=h('div',{class:'tipbox'},h('b',null,'Így formálod:'),'1. Válassz egy objektumot a csipek közül, vagy adj hozzá újat.','2. A vásznon húzd: mozgatod. Négyzet fogantyú: méret, színes pötty: forgatás.','3. A kamera a 3D forgatás eszközzel (O, a vászon fölötti kocka) kering.','4. Művelet: Hozzáad, Kivon (lyukat vág) vagy Metsz; az Olvadás agyagszerűen összeforrasztja őket.');
  const kids=[tip,chips,btns];const o=P[L.psel];
  if(o){const X=k=>({get v(){return o[k];},set v(x){o[k]=(k==='sx'||k==='sy'||k==='sz')?Math.max(.02,x):x;markDirty();}});
    kids.push(ctlSelect(X('t'),SEL('t','Forma',PRIM_T,0)),ctlSelect(X('op'),SEL('op','Művelet',PRIM_OP,0)),
      h('div',{class:'grid2'},scrubField('X',X('x'),S('x','X',-3,3,0),.006),scrubField('Y',X('y'),S('y','Y',-3,3,0),.006),scrubField('Z',X('z'),S('z','Z',-3,3,0),.006),h('span')),
      h('div',{class:'grid2'},scrubField('Szél.',X('sx'),S('sx','Szél.',.02,3,.3),.004),scrubField('Mag.',X('sy'),S('sy','Mag.',.02,3,.3),.004),scrubField('Mély.',X('sz'),S('sz','Mély.',.02,3,.3),.004),h('span')),
      ctlSlider(X('k'),S('k','Olvadás',.001,1,.15),{noAnim:true}),ctlSlider(X('c'),S('c','Szín (paletta)',0,1,.5),{noAnim:true}),
      ctlSlider(X('rx'),S('rx','Forgatás X °',-180,180,0),{noAnim:true}),ctlSlider(X('ry'),S('ry','Forgatás Y °',-180,180,0),{noAnim:true}));}
  kids.push(h('p',{class:'small'},'A vásznon húzva mozgatod a kijelölt objektumot, a négyzet fogantyúval méretezed, a színes pöttyel forgatod. A 3D forgatás eszközzel (O) a kamera kering. Legfeljebb 8 objektum.'));
  return section('Objektumok','sdfobj',true,...kids);}
export function placement(L,title){
  const curves=h('div',{class:'kcurves'});
  const upd=()=>{curves.replaceChildren();const ks=[['x','X'],['y','Y'],['s','Méret'],['r','Szög'],['z','Mélység']].filter(([k])=>hasK(L.n[k]));if(!ks.length)return;
    curves.appendChild(h('div',{class:'chips'},...ks.map(([k,l])=>{const b=h('button',{class:'chip',type:'button'},l+' görbéje');let ed=null;
      b.onclick=()=>{if(ed){ed.remove();ed=null;b.setAttribute('aria-pressed','false');return;}curves.querySelectorAll('.ked').forEach(x=>x.remove());curves.querySelectorAll('.chip').forEach(x=>x.setAttribute('aria-pressed','false'));ed=keyEditor(L.n[k],BASEK[k],l);curves.appendChild(ed);b.setAttribute('aria-pressed','true');};return b;})));};
  const g=h('div',{class:'grid2'},scrubField('X',L.n.x,BASEK.x,.004,upd),scrubField('Y',L.n.y,BASEK.y,.004,upd),scrubField('Méret',L.n.s,BASEK.s,.006,upd),scrubField('Szög',L.n.r,BASEK.r,.5,upd),scrubField('Mélység',L.n.z,BASEK.z,.01,upd));upd();
  const reset=h('button',{class:'btn',onclick:()=>{for(const k of ['x','y','r','spin'])L.n[k]=mkN(0);delete L.n.s.k;L.n.s=mkN(L.type==='text'?.16:L.type==='image'?.8:1);commit();renderInsp();}},'Alaphelyzet');
  return section(title,'place',['x','y','s','r'].some(k=>hasK(L.n[k])),g,curves,h('p',{class:'small'},'◆ = kulcskocka az aktuális időpontra (K: mind a négyre). Kulcskockás értéknél a vásznon húzva is kulcskocka keletkezik.'),ctlSlider(L.n.spin,BASEK.spin),h('div',{class:'btnrow'},reset));}

/* ----- U1: tabbed inspector ----- */
export const ITABS:[string,string,string][]=[
  ['content','Tartalom','<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M5 6h14M12 6v13M9 19h6"/></svg>'],
  ['look','Szín és megjelenés','<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M12 3.5c3.5 4.2 6 7.4 6 10.5a6 6 0 0 1-12 0c0-3.1 2.5-6.3 6-10.5z"/></svg>'],
  ['motion','Mozgás','<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 18c4 0 5-12 9-12s5 6 9 6"/><path d="M9 4.5 11 6.5 9 8.5 7 6.5z" fill="currentColor"/></svg>'],
  ['fx','Effektek','<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M10 3l1.7 4.6L16.5 9.3l-4.8 1.7L10 15.6l-1.7-4.6L3.5 9.3l4.8-1.7z"/><path d="M17.5 14l.9 2.3 2.3.9-2.3.9-.9 2.3-.9-2.3-2.3-.9 2.3-.9z"/></svg>'],
  ['place','Elhelyezés','<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v18M3 12h18M12 3l-2.5 2.5M12 3l2.5 2.5M12 21l-2.5-2.5M12 21l2.5-2.5M3 12l2.5-2.5M3 12l2.5 2.5M21 12l-2.5-2.5M21 12l-2.5 2.5"/></svg>']];
R.itab=(()=>{try{return localStorage.getItem('vel.itab')||'content';}catch(_){return 'content';}})();
export function setITab(t){R.itab=t;try{localStorage.setItem('vel.itab',t);}catch(_){}document.querySelectorAll('#insp .itab').forEach((b:any)=>b.setAttribute('aria-selected',String(b.dataset.tab===t)));
  document.querySelectorAll('#insp .ipane').forEach((p:any)=>p.hidden=p.dataset.tab!==t);}
/** Tab bar + one pane per tab. Empty tabs are hidden; the Mozgás tab carries a dot when anything animates, Effektek the chain length. */
function tabbed(P,L,TB,_noTiming?){
  const anim=layerAnimated(L);const fxN=(L.fx||[]).length;
  const avail=ITABS.filter(([k])=>TB[k].length);if(!avail.some(([k])=>k===R.itab))R.itab=avail[0]?avail[0][0]:'content';
  const bar=h('div',{class:'itabs',role:'tablist','aria-label':'Tulajdonságok'},...avail.map(([k,l,ic])=>{const b=h('button',{class:'itab',type:'button',role:'tab','data-tab':k,'aria-selected':String(k===R.itab),title:l,'aria-label':l,html:ic});
    if(k==='motion'&&anim)b.appendChild(h('i',{class:'itab-dot',title:'Van animáció'}));if(k==='fx'&&fxN)b.appendChild(h('i',{class:'itab-n'},String(fxN)));b.onclick=()=>setITab(k);return b;}));
  P.appendChild(bar);P.appendChild(h('div',{class:'itab-title'},(ITABS.find(t=>t[0]===R.itab)||ITABS[0])[1]));
  for(const [k] of avail)P.appendChild(h('div',{class:'ipane','data-tab':k,role:'tabpanel',hidden:k!==R.itab},...TB[k]));
  bar.addEventListener('click',()=>{const t=P.querySelector('.itab-title');if(t)t.textContent=(ITABS.find(x=>x[0]===R.itab)||ITABS[0])[1];});}
export function layerAnimated(L){return paramList(L).some(q=>animKinds(q.o))||!!(L.tm&&(L.tm.in||L.tm.out));}
/** Mozgás tab head: Animálás mode, Eljátszás, and every animated parameter of the layer with what drives it. */
export function motionSummary(L){
  const prs=paramList(L).map(q=>({...q,kinds:animKinds(q.o)})).filter(q=>q.kinds);const blk=!!(L.tm&&(L.tm.in||L.tm.out));
  const am=h('button',{class:'btn'+(R.animMode?' rec':''),type:'button','aria-pressed':String(!!R.animMode),title:'A'},R.animMode?'● Animálás be (A)':'Animálás (A)');
  am.onclick=()=>{import('./animate').then(m=>{m.setAnimMode(!R.animMode);renderInsp();});};
  const pf=h('button',{class:'btn'+(R.perform?' rec':''),type:'button','aria-pressed':String(!!R.perform),title:'E'},R.perform?'● Eljátszás élesítve (E)':'Eljátszás (E)');
  pf.onclick=()=>{import('./perform').then(m=>{m.setPerform(!R.perform);renderInsp();});};
  const rows=prs.map(q=>{const o=q.o;const kids=[h('span',{class:'asym',title:[...q.kinds].map(c=>ANIM_TIP[c]).join(', ')},[...q.kinds].map(c=>ANIM_SYM[c]).join(' ')),h('span',{class:'aname'},q.label)];
    if(hasK(o)){kids.push(h('span',{class:'small'},o.k.length+' kulcs'));
      const nx=h('button',{class:'eye',type:'button',title:'Következő kulcs','aria-label':q.label+': következő kulcs'},'›');nx.onclick=()=>{const t=o.k.find(x=>x.t>R.time+KEY_EPS);seekTo(t?t.t:o.k[0].t);};kids.push(nx);}
    const rm=h('button',{class:'eye',type:'button',title:'Animáció eltávolítása erről a paraméterről (visszavonható)','aria-label':q.label+': animáció eltávolítása',html:SVG_X});
    rm.onclick=()=>{if(hasK(o)){o.v=keyVal(o.k,R.time);delete o.k;}o.a=0;o.s='';commit();renderInsp();};if(q.kinds!=='l')kids.push(rm);
    return h('div',{class:'arow'},...kids);});
  if(blk)rows.unshift(h('div',{class:'arow'},h('span',{class:'asym'},ANIM_SYM.b),h('span',{class:'aname'},'Belépés / kilépés'),h('span',{class:'small'},'Időzítés lent')));
  return section('Animáció','anim',true,h('div',{class:'btnrow'},am,pf),
    rows.length?h('div',{class:'alist'},...rows):h('p',{class:'small'},'Ezen a rétegen még nincs animáció. Kapcsold be az Animálást (A), és húzd a réteget vagy állíts egy csúszkát: kulcskocka lesz. Jelek: ◆ kulcs · ∿ hullám · ♪ hang/jel · ⇢ Kapcsolat · ▭ mozgásblokk.'));}
