import { R } from './runtime';
import { $, h } from './dom';
import { PALS, palJS } from './palettes';
import { EFFECTS, SEL } from './effects/index';
import { makeGroup, makeLayer, mkLook, st } from './state';
import { macroRead } from './macros';
import { itemCost } from './cost';
import { insertItem } from './itemops';
import { ctlSelect, ctlSlider, ctlSwitch } from './controls';
import { commit, renderAll } from './history';
import { resetFeedback } from './transport';
import { openPop, updLookLbl } from './popovers';
import { toast } from './modals';
import { fixCulprit, judgeScene, qThreshold } from './rndq';
import { tasteClear, tasteCount, tasteMul, tasteVote } from './taste';

export const AXES=[['energy','Energy','calm','intense'],['complex','Complexity','minimal','dense'],['light','Light','dark','radiant'],['warm','Temperature','cold','warm'],['organic','Form','geometric','organic'],
 ['cosmic','Cosmic quality','earthly','cosmic'],['spirit','Sacredness','profane','sacred'],['tech','Technology','analog','digital'],['chaos','Order','order','chaos'],['dream','Dreaminess','sharp','dreamlike']];
/** Display names for mood keys; the Hungarian keys stay persisted identities. */
export const MOOD_EN:Record<string,string>={"Nyugodt": "Calm", "Extatikus": "Ecstatic", "Misztikus": "Mystic", "Kozmikus": "Cosmic", "Sötét": "Dark", "Álomszerű": "Dreamlike", "Organikus": "Organic", "Geometrikus": "Geometric", "Sci-fi": "Sci-fi", "Szakrális": "Sacred", "Tüzes": "Fiery", "Jeges": "Icy", "Kaotikus": "Chaotic", "Minimál": "Minimal", "Melankolikus": "Melancholic", "Pszichedelikus": "Psychedelic", "Glitch": "Glitch", "Lebegő": "Floating", "Ünnepi": "Festive", "Rejtélyes": "Mysterious"};
export const MOODS={'Nyugodt':{energy:-.35,chaos:-.25,dream:.15},'Extatikus':{energy:.45,light:.3,chaos:.15,complex:.15},'Misztikus':{spirit:.35,light:-.2,dream:.3,cosmic:.1},'Kozmikus':{cosmic:.5,light:-.05},
 'Sötét':{light:-.45,warm:-.1},'Álomszerű':{dream:.45,energy:-.15,light:.1},'Organikus':{organic:.45,tech:-.15},'Geometrikus':{organic:-.45,spirit:.1,chaos:-.15},'Sci-fi':{tech:.45,organic:-.15,cosmic:.15},
 'Szakrális':{spirit:.5,warm:.15,chaos:-.1},'Tüzes':{warm:.5,energy:.25,light:.15},'Jeges':{warm:-.5,energy:-.1},'Kaotikus':{chaos:.5,complex:.25,energy:.2},'Minimál':{complex:-.45,chaos:-.25},
 'Melankolikus':{light:-.25,energy:-.3,warm:-.15,dream:.15},'Pszichedelikus':{complex:.3,energy:.25,chaos:.2,spirit:.1},'Glitch':{tech:.4,chaos:.35},'Lebegő':{dream:.3,energy:-.2,organic:.15},
 'Ünnepi':{light:.35,warm:.25,energy:.2},'Rejtélyes':{light:-.3,spirit:.2,dream:.2,complex:.1}};
export const PAL_AFF=[{energy:.5,chaos:.4,complex:.3},{warm:.6,light:.4},{warm:.3,dream:.4},{energy:.4,warm:.2},{warm:.6},{energy:.4,chaos:.3,tech:.2},{organic:.4},{cosmic:.7,light:-.5,warm:-.3},{spirit:.7,warm:.5},{warm:-.8},
 {tech:.3,warm:.1},{spirit:.6,cosmic:.3,light:-.2},{dream:.5,warm:.2,spirit:.2},{dream:.6,light:.5,tech:.3},{cosmic:.3,warm:-.6,light:-.3},{warm:.9,light:-.2},{tech:.5,complex:-.3,warm:-.2},{dream:.7,light:.5,energy:-.4}];
export const BGS:any[]=[{t:'nebula',a:{cosmic:.8,dream:.4,organic:.3}},{t:'gradient',a:{complex:-.8,dream:.3,chaos:-.5}},{t:'aurora',a:{cosmic:.4,dream:.5,warm:-.3,energy:-.2}},{t:'liquid',a:{organic:.8,chaos:.3,energy:.2}},
 {t:'plasma',a:{energy:.4,organic:.4,complex:.1}},{t:'cells',a:{organic:.7,tech:.2,complex:.3}},{t:'galaxy',a:{cosmic:.9,spirit:.2}},{t:'waves',a:{tech:.5,dream:.3,energy:-.1,cosmic:.1}},{t:'tunnel',a:{energy:.5,cosmic:.3,spirit:.3,chaos:.2}},
 {t:'grid',a:{tech:.9,organic:-.6}},{t:'sacred',a:{spirit:.9,organic:-.6,complex:.3}},{t:'blackhole',a:{cosmic:.9,light:-.3}},{t:'kali',a:{complex:.7,organic:.3,spirit:.3,chaos:.3}},{t:'julia',a:{complex:.6,spirit:.2,chaos:.2}},
 {t:'moire',a:{tech:.3,organic:-.4,energy:.3}},{t:'hyper',a:{energy:.8,cosmic:.6,tech:.4}},{t:'gyroid',a:{complex:.7,tech:.5,cosmic:.3}},{t:'fire',a:{warm:.9,energy:.6,organic:.4}},{t:'lava',a:{organic:.6,warm:.4,dream:.3,energy:-.2}}];
export const OVS=[{t:'sacred',a:{spirit:.8,organic:-.4}},{t:'moire',a:{tech:.3,energy:.2}},{t:'galaxy',a:{cosmic:.8}},{t:'waves',a:{tech:.5,dream:.2}},{t:'aurora',a:{dream:.5,cosmic:.3,warm:-.3}},{t:'hyper',a:{energy:.7,cosmic:.4}},
 {t:'cells',a:{organic:.6,tech:.2}},{t:'kali',a:{complex:.6,spirit:.3}},{t:'lava',a:{organic:.6,dream:.3}},{t:'flare',a:{light:.7,cosmic:.3}},{t:'nebula',a:{cosmic:.6,dream:.4}},{t:'liquid',a:{organic:.6}}];
export const FOCALS:any[]=[{t:'3d',w:1.3,a:{tech:.3,complex:-.1,spirit:.1}},{t:'portal',shape:1,a:{spirit:.5,cosmic:.4,energy:.2}},{t:'orb',shape:1,a:{spirit:.5,dream:.5,light:.3,organic:.2}},{t:'flare',a:{light:.6,cosmic:.3}},
 {t:'sacred',a:{spirit:.8,organic:-.5}},{t:'symbol',shape:1,a:{spirit:.6,complex:-.3,organic:-.2}},{t:'none',w:.7,a:{complex:-.5,chaos:.2}}];
BGS.push({t:'space',a:{cosmic:.9,light:-.3}},{t:'sky',a:{dream:.3,light:.6,cosmic:-.7,organic:.4,warm:.2}},{t:'bokeh',a:{dream:.7,light:.3,complex:-.3}});
FOCALS.push({t:'planet',w:1.1,a:{cosmic:.8,complex:-.1}});
export const SHAPES3=[{v:0,a:{organic:.4}},{v:1,a:{}},{v:2,a:{tech:.6,organic:-.6}},{v:3,a:{spirit:.3,organic:-.5}},{v:4,a:{spirit:.9,organic:-.5}},{v:5,a:{complex:.6,tech:.4}},{v:6,a:{complex:.4,chaos:.3}},{v:7,a:{spirit:.5,organic:-.5}},{v:8,a:{spirit:.4,tech:.2,organic:-.4}},{v:9,a:{organic:.8,dream:.3}}];
export const MATS3=[{v:0,a:{dream:.5,spirit:.2}},{v:1,a:{energy:.5,chaos:.3}},{v:2,w:.7,a:{cosmic:.9}},{v:3,a:{tech:.8,dream:.2}},{v:4,a:{tech:.5,light:.2}},{v:5,a:{warm:.8,energy:.4}},{v:6,a:{dream:.4,light:.3}},{v:7,w:.5,a:{tech:.3,chaos:.2}},{v:8,w:.5,a:{chaos:.2,complex:-.3}},{v:9,a:{organic:.4,complex:-.5,chaos:-.4}},{v:10,a:{dream:.6,light:.3,spirit:.3}},{v:11,a:{dream:.3,light:-.3,warm:.2}}];
export const ENVS3=[{v:0,a:{complex:-.3,tech:.2}},{v:1,a:{warm:.7}},{v:2,a:{cosmic:.7,spirit:.2}},{v:3,a:{tech:.7,light:-.2}}];
export const FILLS=[{t:'tunnel',a:{energy:.4,cosmic:.3}},{t:'plasma',a:{organic:.4}},{t:'kali',a:{complex:.5,spirit:.3}},{t:'galaxy',a:{cosmic:.8}},{t:'nebula',a:{cosmic:.5,dream:.4}},{t:'julia',a:{complex:.4}},{t:'liquid',a:{organic:.6}},{t:'fire',a:{warm:.9}},{t:'cells',a:{organic:.5,tech:.2}}];
export const DIST=[{t:'lens',a:{cosmic:.6,spirit:.3}},{t:'swirl',a:{energy:.3,chaos:.4}},{t:'kaleido',a:{spirit:.7,complex:.4,organic:-.2}},{t:'mirror',a:{spirit:.5,organic:-.4,chaos:-.4}},{t:'warp',a:{organic:.6,chaos:.3}},
 {t:'ripple',a:{organic:.4,dream:.3}},{t:'polar',a:{chaos:.4,energy:.3}},{t:'feedback',a:{dream:.6,energy:.3,complex:.3}}];
export const STYLE=[{t:'glitch',k:'style',a:{tech:.7,chaos:.6}},{t:'ascii',k:'style',a:{tech:.9}},{t:'halftone',k:'style',a:{tech:.3,organic:-.2}},{t:'pixelart',k:'style',a:{tech:.7}},{t:'edge',a:{tech:.5,light:.3}},
 {t:'psycolor',a:{chaos:.4,energy:.4,spirit:.2}},{t:'chroma',a:{tech:.4,energy:.3}},{t:'blob',k:'track',a:{tech:.9,chaos:.2}}];
export const LOOK_AFF=[{n:'Filmes',w:1.2,a:{}},{n:'Tiszta',a:{tech:.3,dream:-.3,complex:-.2}},{n:'Álomszerű',a:{dream:.8,light:.2}},{n:'Analóg',a:{organic:.4,warm:.4,tech:-.5}},{n:'Neon noir',a:{tech:.6,light:-.4,energy:.3}}];
export const ADJ={energy:[['Pulsing','Racing','Exploding'],['Quiet','Resting','Hushed']],complex:[['Intricate','Many-faced','Layered'],['Clear','Simple','Bare']],light:[['Radiant','Shining','Beaming'],['Midnight','Shadowy','Deep']],
 warm:[['Glowing','Golden','Blazing'],['Icy','Silver','Crystal']],organic:[['Living','Breathing','Lush'],['Angular','Ordered','Polished']],cosmic:[['Interstellar','Celestial','Cosmic'],['Earthly','Near','Hidden']],
 spirit:[['Sacred','Ancient','Blessed'],['Urban','Everyday','Silent']],tech:[['Digital','Synthetic','Encoded'],['Analog','Handwritten','Old']],chaos:[['Swirling','Broken','Wild'],['Ordered','Calm','Symmetric']],
 dream:[['Floating','Dreaming','Foggy'],['Sharp','Real','Clear']]};
export const NOUNS=['gate','prayer','vision','awakening','echo','core','vortex','veil','trail','breath','mirror','sanctuary','sign','wave','dream','star','space','crystal','spring','memory','passage','melody'];
export const PCAT={speed:new Set(['speed','spin','rate','shimmer','wander']),intens:new Set(['glow','bright','amount','intensity','core','stars','sun']),complex:new Set(['zoom','density','count','iter','segments','rings','branches','freq','bands','sides','repeat','cycles']),chaos:new Set(['warp','twist','displace','turb','wobble','drift','morph','curve','ripple','jitter'])};
export function mulberry32(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
export function moodAxes(moods){const a:any={};for(const [k] of AXES)a[k]=.5;for(const m of moods){const d=MOODS[m];if(d)for(const k in d)a[k]+=d[k];}for(const k in a)a[k]=Math.min(1,Math.max(0,a[k]));return a;}
export const RND:any=(()=>{const def:any={moods:['Kozmikus','Misztikus'],seed:1,variant:0,allow:{d3:true,shapes:true,track:false,style:true,feedback:true},mode:'replace',q:{on:true,strict:.5}};
  try{const o=JSON.parse(localStorage.getItem('latomas2.rnd')||'null');if(o){Object.assign(def,o);def.allow=Object.assign({d3:true,shapes:true,track:false,style:true,feedback:true},o.allow||{});def.q=Object.assign({on:true,strict:.5},o.q||{});}}catch(_){}
  if(!def.axes)def.axes=moodAxes(def.moods);return def;})();
export function saveRnd(){try{localStorage.setItem('latomas2.rnd',JSON.stringify(RND));}catch(_){}}
export function scoreA(aff,ax){let s=0;for(const k in aff)s+=aff[k]*((ax[k]??.5)-.5)*2;return Math.exp(1.7*s);}
/** Weighted pick by mood affinity; with `cat` the user's taste multiplier (Q1) also applies and the pick is recorded in `keys`. */
export const ingKey=x=>String(x.t??x.v??x.n??x.i);
export function pickW(rng,list,ax,cat?,keys?){const w=list.map(x=>scoreA(x.a||{},ax)*(x.w??1)*(cat?tasteMul(cat+':'+ingKey(x)):1));const r0=pickW0(rng,list,w);if(cat&&keys)keys.push(cat+':'+ingKey(r0));return r0;}
function pickW0(rng,list,w){const tot=w.reduce((a,b)=>a+b,0);let r=rng()*tot;for(let i=0;i<list.length;i++){r-=w[i];if(r<=0)return list[i];}return list[list.length-1];}
export const toHex=c=>'#'+c.map(x=>Math.round(Math.min(1,Math.max(0,x))*255).toString(16).padStart(2,'0')).join('');
export function randParams(L,rng,ax){const d=EFFECTS[L.type];const tg={speed:[],intens:[],chaos:[]};
  for(const pd of d.params){if(pd.type)continue;let cat=null;for(const c in PCAT)if(PCAT[c].has(pd.k))cat=c;if(!cat)continue;if(L.type==='blob'&&cat!=='speed')continue;
    const base=cat==='speed'?.06+.4*ax.energy:cat==='intens'?.25+.4*ax.light:cat==='complex'?.15+.55*ax.complex:.05+.55*ax.chaos;
    const f=Math.min(1,Math.max(0,base+(rng()-.5)*.35));let v=(pd.min<0&&pd.max>0)?(rng()<.5?-1:1)*f*Math.min(-pd.min,pd.max):pd.min+f*(pd.max-pd.min);
    if(pd.step>=1)v=Math.round(v);L.p[pd.k].v=v;if(tg[cat])tg[cat].push(pd.k);}
  return tg;}
export function generateScene(){
  const ax=RND.axes,A=RND.allow,rs=mulberry32((RND.seed>>>0)||1),rp=mulberry32(((RND.seed*7919)^(RND.variant*104729+1))>>>0);
  const palList=PALS.map((p,i)=>({i,a:PAL_AFF[i]||{}}));const K:string[]=[];const main=pickW(rs,palList,ax,'pal',K).i;const acc=pickW(rs,palList.filter(x=>x.i!==main),ax).i;
  const base=[],focal=[],after=[],tgs=[],sizeT=[];const take=(L)=>{tgs.push([L,randParams(L,rp,ax)]);if(L.p&&L.p.seed)L.p.seed.v=Math.floor(rp()*1000);return L;};
  const bgT=pickW(rs,BGS.filter(b=>A.d3||b.t!=='gyroid'),ax,'bg',K).t;base.push(take(makeLayer(bgT,{pal:main})));
  if(rs()<.2+.6*ax.complex){const o=pickW(rs,OVS.filter(x=>x.t!==bgT),ax,'ov',K).t;const L=take(makeLayer(o,{pal:rs()<.6?main:acc,blend:o==='flare'?'add':rs()<.5?'screen':'add',opacity:.3+.45*rs(),key:o==='flare'?0:.5+.4*rs()}));
    if(o==='flare'){L.n.x.v=(rs()-.5)*1.2;L.n.y.v=(rs()-.3)*.6;}base.push(L);}
  const foc=pickW(rs,FOCALS.filter(f=>(f.t!=='3d'||A.d3)&&(!f.shape||A.shapes)),ax,'foc',K).t;
  if(foc==='3d'){const mat=pickW(rs,MATS3,ax,'mat',K).v,s0=.55+.35*rs();
    const L=makeLayer('obj3d',{name:'Body',pal:acc,s:s0,p:{shape:pickW(rs,SHAPES3,ax).v,material:mat,env:pickW(rs,ENVS3,ax).v,rough:.1+.6*rs(),metal:mat===4?1:rs()<.3?.8:0,detail:.05+.45*rs()*ax.organic,
      floor:rs()<.35?.5:0,ring:mat===2&&rs()<.6?.7:0,rx:(rs()-.5)*60,spin:.08+.6*ax.energy*rs(),displace:rs()*.4*ax.chaos,speed:.2+ax.energy,glow:.3+ax.light*.8}});
    focal.push(L);sizeT.push([L.id,'n.s',s0*.4,s0*1.6]);}
  else if(foc==='portal'){const K:any=[[0,{}],[3,{sides:6}],[6,{inner:.5}],[4,{sides:6,inner:.6}],[8,{sides:8,inner:.4}],[1,{thick:.08}]][Math.floor(rs()*6)];const size=.22+.14*rs();
    const mk=makeLayer('shape',{name:'Mask',maskOnly:true,p:{kind:K[0],size,soft:.03+.1*rs(),...K[1]}});
    const fill=take(makeLayer(pickW(rs,FILLS,ax,'fill',K).t,{name:'Fill',clip:true,pal:acc}));
    const rim=makeLayer('shape',{name:'Edge',blend:'screen',pal:main,p:{kind:K[0],size,outline:.004+.006*rs(),soft:.05,fill:1,...K[1]},fx:[['glow',{p:{amount:1+rs(),radius:2,thresh:0}}]]});
    focal.push(mk,fill,rim);sizeT.push([mk.id,'p.size',size*.4,size*1.6],[rim.id,'p.size',size*.4,size*1.6]);}
  else if(foc==='orb'){const sz=.14+.12*rs();const core=makeLayer('shape',{name:'Core',maskOnly:true,p:{kind:0,size:sz,soft:.5+.3*rs()}});
    const inner=take(makeLayer(['plasma','moire','liquid','cells'][Math.floor(rs()*4)],{name:'Inner light',clip:true,pal:acc}));
    const aura=makeLayer('shape',{name:'Aura',blend:'screen',opacity:.4+.3*rs(),pal:main,s:{v:1,a:.02+.03*rs(),f:.15+.2*rs()},p:{kind:0,size:sz*2,soft:.9,fill:1}});
    focal.push(core,inner,aura);sizeT.push([core.id,'p.size',sz*.4,sz*1.6],[aura.id,'p.size',sz*.8,sz*3.2]);}
  else if(foc==='planet'){const r0=.22+.15*rs();const L=makeLayer('planet',{name:'Planet',pal:acc,p:{ptype:Math.floor(rs()*7),seed:Math.floor(rs()*1000),radius:r0,sunang:-160+rs()*320,ring:rs()<.35?.6+.4*rs():0,clouds:rs()*.8,lights:rs()<.3?1:0,tint:rs()<.4?.3+.5*rs():0,atmocol:toHex(palJS(main,.6))}});
    focal.push(L);sizeT.push([L.id,'p.radius',r0*.4,r0*1.8]);}
  else if(foc==='flare'){const L=makeLayer('flare',{name:'Light source',blend:'add',pal:main,x:(rs()-.5)*1.2,y:(rs()-.2)*.6});focal.push(L);sizeT.push([L.id,'p.size',.3,1.7]);}
  else if(foc==='sacred'){const L=take(makeLayer('sacred',{name:'Geometry',blend:'screen',key:.8,opacity:.5+.4*rs(),pal:acc,spin:(rs()-.5)*10}));focal.push(L);sizeT.push([L.id,'p.radius',L.p.radius.v*.4,L.p.radius.v*1.6]);}
  else if(foc==='symbol'){const kk=[5,6,10,12,8,4,7][Math.floor(rs()*7)];const sz=.2+.12*rs();
    const L=makeLayer('shape',{name:'Symbol',blend:'screen',pal:acc,p:{kind:kk,size:sz,outline:.004+.005*rs(),thick:.012,fill:rs()<.5?1:2,inner:.3+.4*rs(),sides:5+Math.floor(rs()*4)},fx:[['glow',{p:{amount:1.2,radius:2,thresh:0}}]]});
    focal.push(L);sizeT.push([L.id,'p.size',sz*.4,sz*1.6]);}
  const strongF=['3d','planet','portal','symbol','sacred'].includes(foc);const nd=Math.min(strongF?1:2,Math.floor(rs()*.8+ax.complex*1.4+ax.chaos*.6));let pool=DIST.filter(d=>A.feedback||d.t!=='feedback');const before=[];
  for(let i=0;i<nd&&pool.length;i++){const dd=pickW(rs,pool,ax,'dist',K);pool=pool.filter(x=>x!==dd);const L=take(makeLayer(dd.t));
    if(dd.t==='mirror')L.p.mode.v=Math.floor(rs()*4);if(dd.t==='polar'||dd.t==='ripple')L.p.mode.v=rs()<.5?0:1;
    if(dd.t==='feedback'){L.p.decay.v=.85+.1*rs();L.p.zoom.v=(rs()-.4)*3;L.p.rot.v=(rs()-.5)*2;L.p.mode.v=rs()<.7?0:1;}
    if(dd.t==='lens'){L.p.mass.v=.4+.8*rs();L.p.hole.v=rs()<.5?0:.8;}if(dd.t==='kaleido')L.p.segments.v=Math.round(3+rs()*(5+ax.complex*10));
    (rs()<.55?before:after).push(L);}
  const sp=STYLE.filter(x=>(x.k!=='style'||A.style)&&(x.k!=='track'||A.track));
  if(sp.length&&rs()<.12+.45*Math.max(ax.tech,ax.chaos)-.25*ax.dream){const st0=pickW(rs,sp,ax,'sty',K).t;const L=take(makeLayer(st0,{pal:acc}));
    if(st0==='ascii'){L.p.mode.v=Math.floor(rs()*4);L.p.size.v=7+rs()*10;}if(st0==='halftone'){L.p.mode.v=Math.floor(rs()*3);L.p.size.v=6+rs()*14;}
    if(st0==='pixelart'){L.p.size.v=Math.round(3+rs()*8);L.p.levels.v=Math.round(3+rs()*6);}
    if(st0==='blob'){const p=L.p;p.style.v=Math.floor(rs()*6);p.link.v=Math.floor(rs()*5);p.label.v=[1,2,7,5,0][Math.floor(rs()*5)];p.detect.v=rs()<.6?1:0;p.count.v=Math.round(6+rs()*20);
      p.color.v=toHex(palJS(acc,.7));p.colormode.v=rs()<.4?1:0;p.inside.v=rs()<.3?1+Math.floor(rs()*7):0;p.dash.v=rs()<.3?1:0;p.guides.v=rs()<.25?1:0;}
    after.push(L);}
  // Q1 recipe rules: at most 3 finishing extras; a kaleidoscope gets no colour split / rays, a glowing focal no extra glow
  const kal=[...before,...after].some(l=>l.type==='kaleido'),glowF=['symbol','portal','sacred'].includes(foc);let nx=0;
  const X=(k,p,ok=true)=>{if(!ok||nx>=3)return false;const y=rs()<p*tasteMul('x:'+k);if(y){nx++;K.push('x:'+k);}return y;};
  if(X('glow',.25+.55*ax.light,!(kal&&glowF))){const L=makeLayer('glow');L.p.amount.v=.4+ax.light*.9;L.p.thresh.v=.25+.3*rs();L.p.radius.v=1+rs()*2;after.push(L);tgs.push([L,{speed:[],intens:['amount'],chaos:[]}]);}
  if(X('radial',.1+.6*ax.cosmic*ax.light,!kal))after.push(makeLayer('radial',{p:{amount:.5+rs()*.6,length:.8+rs()}}));
  if(X('texture',.12+.45*ax.organic))after.push(makeLayer('texture',{p:{mode:ax.tech>.6?4:[0,1,3][Math.floor(rs()*3)],amount:.12+.25*rs()}}));
  if(X('grade',.3))after.push(makeLayer('grade',{p:{sat:.8+.6*ax.energy,contrast:1+.2*rs()}}));
  if(X('chroma',.1+.5*ax.chaos*ax.energy,!kal))after.push(makeLayer('chroma',{p:{amount:.4+rs()}}));
  const life=[...base,...focal.filter(l=>!l.maskOnly)];
  if(life.length&&rs()<.3+.6*ax.energy){const L=life[Math.floor(rs()*life.length)];if(rs()<.5)L.n.hue={v:L.n.hue.v,a:.1+.2*rs(),f:.02+.08*rs(),w:0};else L.n.opacity={v:L.n.opacity.v,a:.15+.2*rs(),f:.05+.2*rs(),w:0};}
  let layers=[...base,...before,...focal,...after];
  const g0=()=>layers.reduce((s,l)=>s+itemCost(l),0);
  while(g0()>24&&after.length){const x=after.pop();layers=layers.filter(l=>l!==x);}
  const dev:any[]=AXES.map(([k])=>[k,ax[k]-.5]).sort((a:any,b:any)=>Math.abs(b[1])-Math.abs(a[1]));
  const adj=([k,d]:any)=>{const l=ADJ[k][d>=0?0:1];return l[Math.floor(rs()*l.length)];};
  const title=`${adj(dev[0])} ${adj(dev[1]).toLowerCase()} ${NOUNS[Math.floor(rs()*NOUNS.length)]}`;
  const g=makeGroup(title,layers,{open:false});
  const mkM=(l,cat)=>{const t=[];for(const [L,tg] of tgs){if(!layers.includes(L))continue;for(const k of tg[cat]){const pd=EFFECTS[L.type].params.find(p=>p.k===k);const cur=L.p[k].v;t.push([L.id,'p.'+k,0,Math.abs(cur)<.01?pd.max*.5:cur*2]);}}return t.length?{l,t:t.slice(0,12),v:.5}:null;};
  g.macros=[mkM('Tempo','speed'),mkM('Light','intens'),mkM('Chaos','chaos'),sizeT.length?{l:'Size',t:sizeT,v:.5}:null].filter(Boolean);
  for(const m of g.macros)m.v=macroRead(g,m);
  const look=mkLook(pickW(rs,LOOK_AFF,ax,'look',K).n);const lp:any=look.p;
  lp.temp.v=Math.max(-1,Math.min(1,lp.temp.v+(ax.warm-.5)*.6));lp.sat.v=Math.max(0,Math.min(1.8,lp.sat.v*(.85+.35*ax.energy)));lp.bloom.v=Math.min(2,lp.bloom.v*(.6+ax.light*.9));lp.exposure.v+=(ax.light-.5)*.5;look.preset='Generated';
  return {group:g,look,bg:toHex(palJS(main,.02).map(x=>x*.1)),title,keys:K};}
/** Q1: generate and, with the quality filter on, judge the scene on a small render; a failing scene first gets its single
 * culprit effect weakened/removed, otherwise it is re-rolled (new seed, or new variant for "Variation"; a typed seed is kept).
 * Up to 6 tries within ~700 ms; the best one wins. Returns the result with `q` (score, symptoms) and `why` (Hungarian notes). */
export function pickScene(reroll:'seed'|'variant'|null){
  const t0=performance.now(),Q=RND.q||{on:true,strict:.5},rej:string[]=[],notes:string[]=[];let best:any=null;
  for(let i=0;i<6;i++){
    if(i>0){if(reroll==='seed'){RND.seed=(Math.random()*1e9)>>>0;RND.variant=0;}else if(reroll==='variant')RND.variant++;else break;}
    const r:any=generateScene();r.seed=RND.seed;r.variant=RND.variant;if(!Q.on)return r;
    const look=RND.mode==='replace'?r.look:st.look,bg=RND.mode==='replace'?r.bg:st.bg;
    try{r.q=judgeScene([r.group],look,bg,Q.strict);
      if(!r.q.pass){const f=fixCulprit(r.group,look,bg,r.q,Q.strict);if(f){r.q=f.q;r.fix=f.msgs;}}}
    catch(e){console.warn('Random quality check failed',e);return r;}
    if(!best||r.q.score>best.q.score)best=r;
    if(r.q.pass)break;
    rej.push(r.q.sym.slice(0,2).map(x=>x.name).join(', ')||'gyenge');
    if(performance.now()-t0>700)break;}
  RND.seed=best.seed;RND.variant=best.variant;
  if(best.fix)notes.push(...best.fix);
  const tried=rej.length-(best.q.pass?0:1);if(tried>0)notes.unshift(`${tried} rolls discarded (${[...new Set(rej.slice(0,tried).join(', ').split(', '))].slice(0,3).join(', ')})`);
  if(!best.q.pass)notes.push(`even the best is weak: ${best.q.sym.slice(0,2).map(x=>x.name).join(', ')}`);
  best.why=notes;best.ms=Math.round(performance.now()-t0);return best;}
export function runRandom(fresh,reroll?:'seed'|'variant'|null){
  if(fresh){RND.seed=(Math.random()*1e9)>>>0;RND.variant=0;}
  const r=pickScene(reroll!==undefined?reroll:fresh?'seed':null);
  if(RND.mode==='replace'){st.layers=[r.group];st.look=r.look;st.bg=r.bg;}else insertItem(r.group,null);
  R.selId=r.group.id;R.rndLast=r;resetFeedback();commit();renderAll();updLookLbl();saveRnd();
  const msg=`${r.title} · #${RND.seed}${RND.variant?'.'+RND.variant:''}${r.why&&r.why.length?' · '+r.why.join(' · '):''}`;toast(msg);showRndFb(msg);
  const sf=document.getElementById('seedIn');if(sf)(sf as HTMLInputElement).value=RND.seed;}
/** "Ugly" (dislike: its ingredients get rarer, then a new roll) / "Like" (like: more often) on the last Random scene. */
export function rndVote(v:1|-1){const r=R.rndLast;if(!r||r.voted)return false;r.voted=true;tasteVote(r.keys||[],v,{score:r.q?.score,sym:r.q?r.q.sym.map(x=>x.k):[]});
  if(v<0)runRandom(true);else{hideRndFb();toast('Noted: I\'ll roll things like this more often.');}return true;}
R.rndFbT=undefined;
function hideRndFb(){const el=document.getElementById('rndFb');if(el)el.hidden=true;}
function showRndFb(msg){let el=document.getElementById('rndFb');
  if(!el){el=h('div',{class:'rndfb',id:'rndFb',role:'group','aria-label':'Randomize feedback'});document.body.appendChild(el);}
  el.replaceChildren(h('span',{class:'rndfb-t'},msg),h('button',{class:'btn',title:'I\'ll pick its ingredients less often and roll a new one',onclick:()=>rndVote(-1)},'Ugly'),h('button',{class:'btn',title:'I\'ll pick its ingredients more often',onclick:()=>rndVote(1)},'Like'));
  el.hidden=false;$('#toast').hidden=true;clearTimeout(R.rndFbT);R.rndFbT=setTimeout(hideRndFb,9000);}
export function openRandom(anchor){
  const chips=h('div',{class:'chips',role:'group','aria-label':'Moods'},...Object.keys(MOODS).map(m=>h('button',{class:'chip','aria-pressed':String(RND.moods.includes(m)),onclick:()=>{
    RND.moods=RND.moods.includes(m)?RND.moods.filter(x=>x!==m):[...RND.moods,m];RND.axes=moodAxes(RND.moods);saveRnd();openRandom(anchor);}},MOOD_EN[m]||m)));
  const axCtl=AXES.map(([k,l,lo,hi])=>{const o={v:RND.axes[k],a:0};return h('div',null,ctlSlider(o,{k,l,min:0,max:1},{noAnim:true,onInput:()=>{RND.axes[k]=o.v;saveRnd();}}),h('div',{class:'axhint'},h('span',null,lo),h('span',null,hi)));});
  const sw=(lab,key)=>ctlSwitch(lab,RND.allow[key],v=>{RND.allow[key]=v;saveRnd();});
  const seedIn=h('input',{class:'txt',id:'seedIn',value:RND.seed,inputmode:'numeric','aria-label':'Seed',style:'max-width:140px'});
  seedIn.onchange=()=>{const v=parseInt(seedIn.value,10);if(isFinite(v)){RND.seed=v>>>0;RND.variant=0;runRandom(false);}};
  const qObj={v:RND.q.strict,a:0};
  const modeObj={get v(){return RND.mode==='add'?1:0;},set v(x){RND.mode=x?'add':'replace';saveRnd();}};
  const det=(t,open,...k)=>{const d=h('details',{class:'sec',style:'padding:0;border-top:1px solid var(--sep)'},h('summary',null,t),h('div',{class:'content'},...k));d.open=open;return d;};
  openPop(anchor,'wide',h('div',{class:'pl'},'Random vision'),h('div',{class:'pc'},
    h('p',{class:'small'},'Pick moods and combine as many as you like. Elements, colors, motion and post effects follow them: over a trillion base combinations, practically endless with the continuous parameters.'),
    chips,
    det('Fine-tuning',false,...axCtl,h('button',{class:'btn',onclick:()=>{RND.axes=moodAxes(RND.moods);saveRnd();openRandom(anchor);}},'Back to moods')),
    det('What can be included',false,sw('3D bodies','d3'),sw('Shapes and masks','shapes'),sw('Echo (feedback)','feedback'),sw('Stylization (ASCII, pixel, halftone, glitch)','style'),sw('Blob tracking','track')),
    det('Quality filter',false,ctlSwitch('Filter out ugly rolls',RND.q.on,v=>{RND.q.on=v;saveRnd();}),
      ctlSlider(qObj,{k:'strict',l:'Strictness',min:0,max:1},{noAnim:true,onInput:()=>{RND.q.strict=qObj.v;saveRnd();}}),h('div',{class:'axhint'},h('span',null,'loose'),h('span',null,'strict')),
      h('p',{class:'small'},`I measure every roll at small size (dark, muddy, flat, noisy, crowded, unfocused, garish, hard cut, pixelated) and re-roll weak ones. Threshold: ${Math.round(qThreshold(RND.q.strict))}/100. Taste: ${tasteCount()} marks (saved in the project file too).`),
      h('button',{class:'btn',onclick:()=>{if(confirm('Clear your Ugly/Like marks?')){tasteClear();openRandom(anchor);}}},'Clear taste')),
    ctlSelect(modeObj,SEL('mode','Result',['New scene','Add as a layer'],0)),
    h('div',{class:'row2'},h('span',null,'Seed'),seedIn),
    h('div',{class:'btnrow',style:'justify-content:flex-end'},h('button',{class:'btn',title:'Same structure, different parameters',onclick:()=>{RND.variant++;runRandom(false,'variant');}},'Variation'),h('button',{class:'btn accent',onclick:()=>runRandom(true)},'Generate  (R)'))));}
$('#rndBtn').onclick=e=>openRandom(e.currentTarget);
