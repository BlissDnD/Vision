// Q1 · Random minőségszűrő: a „rondaság” tünetei mesterséges képeken helyes sorrendet adnak (sötét, sáros, zajos,
// pixeles, kemény vágás vs. tiszta fókuszos kép), a tünetlista bővíthető, a hibás effektet megtalálja és csak azt
// gyengíti/veszi ki, a receptszabályok tartanak, a Ronda/Tetszik ízlés súlyoz, megmarad, és a projektfájl viszi.
(()=>{const bad=[],info={};
 const W=320,H=180,mk=f=>{const b=new Uint8Array(W*H*4);for(let y=0;y<H;y++)for(let x=0;x<W;x++){const c=f(x,y),j=(y*W+x)*4;b[j]=c[0];b[j+1]=c[1];b[j+2]=c[2];b[j+3]=255;}return b;};
 let seed=7;const rnd=()=>{seed=(seed*16807)%2147483647;return seed/2147483647;};
 const orb=(x,y)=>{const d=Math.hypot(x-W/2,y-H/2)/60,o=Math.exp(-d*d*1.5);return [20+o*200,25+o*120,60+o*190];};
 const imgs={
  clean:mk(orb),
  dark:mk((x,y)=>{const o=orb(x,y);return o.map(v=>v*.04);}),
  mud:mk((x,y)=>{const n=Math.sin(x*.21)*Math.sin(y*.19)*12;return [115+n,88+n,50+n*.5];}),
  noise:mk((x,y)=>{const o=orb(x,y);return o.map(v=>Math.max(0,Math.min(255,v+(rnd()-.5)*190)));}),
  pixel:mk((x,y)=>{const bx=Math.floor(x/6),by=Math.floor(y/6),h=Math.sin(bx*12.9898+by*78.233)*43758.5453,f=h-Math.floor(h);return [40+f*200,60+(1-f)*150,120+f*100];}),
  cut:mk((x,y)=>{const o=orb(x,y);return (x<110&&y>60&&y<120)?[3,3,5]:o.map(v=>v+40);}),
 };
 const sc={},sy={};for(const k in imgs){const q=judgeStats([measureImg(imgs[k],W,H)],.5);sc[k]=q.score;sy[k]=q.sym.map(s=>s.k);}
 info.scores=sc;info.sym=sy;
 if(!(sc.clean>=85&&!sy.clean.length))bad.push('a tiszta, fókuszos kép nem kap jó pontot');
 for(const [k,s] of [['dark','dark'],['mud','mud'],['noise','noise'],['pixel','pixel'],['cut','cut']]){
  if(!sy[k].includes(s))bad.push(`${k}: hiányzik a(z) ${s} tünet`);if(!(sc[k]<sc.clean))bad.push(`${k}: nem rosszabb a tisztánál`);}
 if(!(sc.dark<qThreshold(.5)&&sc.noise<qThreshold(.5)&&sc.pixel<qThreshold(.5)))bad.push('a súlyos esetek átmennek az alap küszöbön');
 // the symptom list is extendable
 SYMPTOMS.push({k:'test',name:'teszt',w:.5,p:s=>s.mean>0?1:0});const qx=judgeStats([measureImg(imgs.clean,W,H)],.5);SYMPTOMS.pop();
 if(!qx.sym.some(s=>s.k==='test'&&s.name==='teszt'))bad.push('új tünet nem számít bele');
 // culprit search on a real scene: an added heavy film grain / pixel art is found, only that effect changes
 RND.q={on:true,strict:.5};const base=()=>{RND.seed=102948;RND.variant=0;return generateScene();};
 const r0=base(),q0=judgeScene([r0.group],r0.look,r0.bg,.5);info.base=q0.score;if(!q0.pass)bad.push('az alapjelenet nem megy át ('+q0.score+')');
 for(const [t,p] of [['film',{grain:2}],['pixelart',{size:8}]]){const r=base();const L=makeLayer(t);for(const k in p)L.p[k].v=p[k];r.group.children.push(L);const n0=r.group.children.length;
  const q=judgeScene([r.group],r.look,r.bg,.5);const f=fixCulprit(r.group,r.look,r.bg,q,.5);info[t]={before:q.score,sym:q.sym.map(s=>s.k),after:f&&f.q.score,msg:f&&f.msgs[0]};
  if(q.pass)bad.push(t+': nem bukik el');if(!f||f.fixed!==t)bad.push(t+': nem találta meg a hibás effektet');else if(!f.q.pass)bad.push(t+': javítás után sem megy át');
  if(f&&r.group.children.length<n0-1)bad.push(t+': több réteget is kivett');}
 // recipe rules
 const DT=new Set(DIST.map(d=>d.t)),EX=['glow','radial','texture','grade','chroma'];let ruleBad=0;
 for(let i=0;i<60;i++){RND.seed=1000+i*7777;const r=generateScene();const ty=r.group.children.map(l=>l.type);
  const nx=r.keys.filter(k=>k.startsWith('x:')).length;if(nx>3)ruleBad++;
  if(ty.includes('kaleido')&&(r.keys.includes('x:chroma')||r.keys.includes('x:radial')))ruleBad++;
  if(['foc:3d','foc:planet','foc:portal','foc:symbol','foc:sacred'].some(k=>r.keys.includes(k))&&r.keys.filter(k=>k.startsWith('dist:')).length>1)ruleBad++;}
 if(ruleBad)bad.push('receptszabály sérült '+ruleBad+'×');
 // reroll: every pick has a score; a failing pick says why
 const t0=performance.now();let rer=0;for(let i=0;i<4;i++){const r=pickScene('seed');if(!r.q)bad.push('nincs pontszám');else if(!r.q.pass&&!r.why.some(w=>w.includes('legjobb')))bad.push('gyenge eredmény indoklás nélkül');if(r.why&&r.why.length)rer++;}
 info.pickMs=Math.round((performance.now()-t0)/4);info.withNotes=rer;
 // taste: Ronda lowers, Tetszik raises, both persist; strong dislike makes an ingredient rarer
 tasteClear();runRandom(true);const last=R.rndLast;if(!last||!last.keys||!last.keys.length)bad.push('az utolsó dobás összetevői hiányoznak');
 const fb=document.getElementById('rndFb');if(!fb||fb.hidden||![...fb.querySelectorAll('button')].some(b=>b.textContent==='Ronda'))bad.push('nincs Ronda/Tetszik sáv');
 const k0=last.keys[0];rndVote(-1);if(!(tasteMul(k0)<1))bad.push('a Ronda nem csökkent');
 try{const saved=JSON.parse(localStorage.getItem('latomas2.rndTaste')||'{}');if(!saved.k||!saved.k[k0])bad.push('az ízlés nem mentődött');}catch(_){info.ls='nincs localStorage a tesztoldalon';}
 const k1=R.rndLast.keys[0],m1=tasteMul(k1);rndVote(1);if(!(tasteMul(k1)>m1))bad.push('a Tetszik nem növelt');
 const freq=()=>{let n=0;RND.axes=moodAxes(['Kozmikus']);for(let i=0;i<120;i++){RND.seed=5000+i*31;if(generateScene().keys.includes('foc:planet'))n++;}return n;};
 tasteClear();const fA=freq();tasteVote(['foc:planet'],-1);for(let i=0;i<9;i++)tasteVote(['foc:planet'],-1);const fB=freq();info.planet={before:fA,after:fB};
 if(!(fB<fA*.7))bad.push('a sok Ronda nem ritkította a bolygót');
 // project file carries the taste; opening merges (twice = no change); an old file without taste opens fine
 st.layers=[makeLayer('gradient')];commit();const pj=JSON.parse(projectJSON());if(!pj.taste||!pj.taste.k['foc:planet'])bad.push('a projektfájl nem viszi az ízlést');
 tasteClear();loadProject(pj);if(!TASTE.k['foc:planet']||TASTE.k['foc:planet'][1]!==10)bad.push('megnyitáskor nem fésülte össze');
 loadProject(pj);if(TASTE.k['foc:planet'][1]!==10)bad.push('kétszeri megnyitás duplázott');
 const old=JSON.parse(JSON.stringify(pj));delete old.taste;tasteClear();tasteVote(['bg:nebula'],1);try{loadProject(old);}catch(e){bad.push('régi projekt hiba: '+e.message);}
 if(!TASTE.k['bg:nebula']||TASTE.k['foc:planet'])bad.push('régi projekt megváltoztatta az ízlést');
 // popover section
 const a=document.getElementById('rndBtn');openRandom(a);const pop=document.querySelector('.popover');if(!pop||!pop.textContent.includes('Minőségszűrő')||!pop.textContent.includes('Ízlés törlése'))bad.push('nincs Minőségszűrő a panelen');closePop();
 tasteClear();st.layers=[];commit();
 return {bad,info};})()
