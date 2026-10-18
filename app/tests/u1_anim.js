// U1 · Animálás mód, mozgáspálya, Sávok paramétersorai, görbe-gyorsmenü, animáció-jelek, fülek, Eljátszás bármely paraméterrel.
(async()=>{const bad=[],info={};const wait=ms=>new Promise(r=>setTimeout(r,ms));
 st.layers=[];setPlay(false);R.time=0;
 const L=makeLayer('text');st.layers=[L];R.selId=L.id;renderAll();

 // 1) Animálás: drag at 0 s, drag at 2 s → two keys, no clicking on ◆
 setAnimMode(true);R.time=0;setVal(L.n.x,-.6);setVal(L.n.y,0);R.time=2;setVal(L.n.x,.6);setVal(L.n.y,.2);setAnimMode(false);
 info.keys={x:L.n.x.k.map(k=>k.t+':'+k.v),y:L.n.y.k.map(k=>k.t+':'+k.v)};
 if(L.n.x.k.length!==2||L.n.x.k[0].v!==-.6||L.n.x.k[1].v!==.6)bad.push('Animálás: x kulcsok '+info.keys.x);
 {const m=ev(L.n.x,BASEK.x,1);if(!(m>-.6&&m<.6))bad.push('Animálás: köztes érték '+m);}
 if(L.n.x.k[0].e!==0)bad.push('új kulcs alapgörbéje nem Lágy: '+L.n.x.k[0].e);
 // first edit away from 0 s keeps the previous value at 0 s
 setAnimMode(true);R.time=1.5;const s0=L.n.s.v;setVal(L.n.s,.4);setAnimMode(false);
 if(!(L.n.s.k&&L.n.s.k.length===2&&L.n.s.k[0].t===0&&L.n.s.k[0].v===s0&&L.n.s.k[1].v===.4))bad.push('első kulcs nem 0-n kezdi az előző értékkel: '+JSON.stringify(L.n.s.k));
 // outside Animálás an un-keyed param just changes
 R.time=1;setVal(L.n.opacity,.8);if(L.n.opacity.k||L.n.opacity.v!==.8)bad.push('Animálás nélkül kulcs keletkezett');
 // non-animatable controls (timing) never key, even in Animálás
 setAnimMode(true);L.tm={in:1,inAt:0,inDur:.8,out:0,outAt:9,outDur:.8,ease:0};R.moSel[L.id]='tm:in';renderInsp();setITab('motion');const tctl=[...document.querySelectorAll('#insp .ipane[data-tab=motion] .ctl')].find(c=>c.textContent.includes('Kezdés (mp)'));
 if(!tctl)bad.push('Időzítés csúszka hiányzik a Mozgás fülön');else{const r=tctl.querySelector('input[type=range]');r.value='1.25';r.dispatchEvent(new Event('input'));
   if(!L.tm||L.tm.inAt!==1.25)bad.push('Időzítés csúszka nem írt: '+JSON.stringify(L.tm));if(L.tm&&L.tm.k)bad.push('Időzítés proxyra kulcs került');}
 setAnimMode(false);delete L.tm;
 // editing a keyed value while playing pauses (keys must not smear along the timeline)
 setPlay(true);R.time=2;setVal(L.n.x,.7);info.keepsPlayingOutsideAnim=R.playing;if(!R.playing)bad.push('Animálás mód nélkül az állítás megállította a lejátszást (Mozgás v1: az animáció eltolódik)');
 setAnimMode(true);setVal(L.n.x,curV(L.n.x));info.pausedOnEdit=!R.playing;if(R.playing)bad.push('Animálás módban a kulcsos érték állítása lejátszás közben nem állította meg a lejátszást');setAnimMode(false);
 if(L.n.x.k.length!==2)bad.push('lejátszás közbeni állítás több kulcsot írt: '+L.n.x.k.length);
 setVal(L.n.x,.6);commit();

 // 2) Mozgáspálya: path + one dot per key time, dragging a dot moves that key in 2D
 R.time=0;R.gizmoOn=true;updPath(0);const mp=document.querySelector('.mpath');const dots=[...document.querySelectorAll('.mp-dot')];
 info.path={shown:mp&&mp.style.display!=='none',dots:dots.length,d:(document.querySelector('.mp-line').getAttribute('d')||'').length};
 if(!info.path.shown||dots.length!==2)bad.push('mozgáspálya: '+JSON.stringify(info.path));
 if(dots[1]){const c=dots[1],b=c.getBoundingClientRect(),x=b.left+b.width/2,y=b.top+b.height/2;const x0=keyVal(L.n.x.k,2),y0=keyVal(L.n.y.k,2);
   c.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true,clientX:x,clientY:y,pointerId:1,button:0}));
   c.dispatchEvent(new PointerEvent('pointermove',{bubbles:true,clientX:x-40,clientY:y+30,pointerId:1}));
   c.dispatchEvent(new PointerEvent('pointerup',{bubbles:true,clientX:x-40,clientY:y+30,pointerId:1}));
   const x1=keyVal(L.n.x.k,2),y1=keyVal(L.n.y.k,2);info.dotDrag={dx:+(x1-x0).toFixed(3),dy:+(y1-y0).toFixed(3),t:R.time};
   if(!(x1<x0-.05&&y1<y0-.05))bad.push('pálya-pont húzása nem mozdította a kulcsot '+JSON.stringify(info.dotDrag));
   if(L.n.x.k.length!==2)bad.push('pálya-pont húzása új kulcsot hozott létre');
   undo();const L2=st.layers[0];if(Math.abs(keyVal(L2.n.x.k,2)-x0)>1e-9)bad.push('pálya-pont húzása nem visszavonható');}
 let T=st.layers[0];R.selId=T.id;

 // 3) Effect (Megjelenés) params are part of the timeline now
 T.fx.push(makeLayer('glow'));const F=T.fx[0];const fk=EFFECTS.glow.params[0].k;setKey(F.p[fk],1,.2);setKey(F.p[fk],3,.9);
 info.fxTimes=[...layerKeyTimes(T).keys()];if(!info.fxTimes.includes(3))bad.push('Megjelenés-kulcs nem látszik az idővonalon');
 const pl=paramList(T).map(q=>q.path);if(!pl.includes('f0.p.'+fk))bad.push('paramList: '+pl.join(','));

 // 4) Sávok: expandable param rows, param-level selection, stretch, move-through, curve menu
 setTlx(true);R.tlxOpenIds.add(T.id);renderTracks();
 const prow=document.querySelectorAll('#tlxBody .tlx-prow');const subk=document.querySelectorAll('#tlxBody .tlx-key.sub');info.rows={params:prow.length,subKeys:subk.length};
 if(prow.length<4)bad.push('paramétersorok: '+prow.length);
 R.tlxSels=[{id:T.id,t:2,p:'n.x'}];const ny=T.n.y.k.length;const nd=deleteSelKeys();if(nd!==1||T.n.x.k.length!==1||T.n.y.k.length!==ny)bad.push('paraméter-szintű törlés: '+nd);
 setKey(T.n.x,2,.6);
 // stretch 0..2 → 0..4 (anchor = 0 s)
 R.tlxSels=[{id:T.id,t:0,p:'n.x'},{id:T.id,t:2,p:'n.x'}];retimeSel(t=>t*2);info.stretch=T.n.x.k.map(k=>k.t);
 if(info.stretch.join()!=='0,4')bad.push('nyújtás: '+info.stretch);
 // moving two keys onto/through each other loses nothing
 R.tlxSels=[{id:T.id,t:0,p:'n.x'},{id:T.id,t:4,p:'n.x'}];retimeSel(t=>t===0?4:0);info.swap=T.n.x.k.map(k=>k.t+':'+k.v);
 if(T.n.x.k.length!==2||T.n.x.k[0].v!==.6||T.n.x.k[1].v!==-.6)bad.push('kulcsok átmozgatása egymáson: '+info.swap);
 // a whole-time (layer row) selection hits every param at that time
 R.tlxSels=[{id:T.id,t:0}];info.refs=selKeyRefs().length;if(info.refs<2)bad.push('réteg-szintű kijelölés: '+info.refs);
 // curve quick menu on right click
 R.tlxSels=[];renderTracks();const kd=[...document.querySelectorAll('#tlxBody .tlx-key.sub')].find(e=>e.dataset.p==='n.x'&&+e.dataset.t===0);
 if(!kd)bad.push('nincs x kulcs a paramétersorban');else{kd.dispatchEvent(new MouseEvent('contextmenu',{bubbles:true,clientX:300,clientY:300}));
   const m=document.querySelector('.kmenu');if(!m)bad.push('görbe-gyorsmenü nem nyílt meg');else{const b=[...m.querySelectorAll('button')].find(b=>b.textContent==='Rugós');b.click();
     if(T.n.x.k[0].e!==5)bad.push('Rugós nem állt be: '+T.n.x.k[0].e);if(document.querySelector('.kmenu'))bad.push('menü nem zárult');if(T.n.y.k[0].e===5)bad.push('a menü a nem kijelölt paramétert is átírta');}}
 // param-row marquee picks only that param
 renderTracks();const lane=document.querySelector('#tlxBody .tlx-lane[data-p="n.y"]');
 if(lane){const r=lane.getBoundingClientRect();R.tlxSels=[];lane.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true,clientX:r.left+1,clientY:r.top+2,pointerId:3,button:0}));
   lane.dispatchEvent(new PointerEvent('pointermove',{bubbles:true,clientX:r.right-1,clientY:r.bottom-2,pointerId:3}));lane.dispatchEvent(new PointerEvent('pointerup',{bubbles:true,clientX:r.right-1,clientY:r.bottom-2,pointerId:3}));
   info.marq=R.tlxSels.map(s=>s.p+'@'+s.t);if(!R.tlxSels.length||R.tlxSels.some(s=>s.p!=='n.y'))bad.push('téglalapos kijelölés a paramétersorban: '+info.marq);}
 R.tlxSels=[];setTlx(false);

 // 5) Badges + tabs
 T.p[EFFECTS.text.params[0].k].a=.3;renderInsp();setITab('content');await wait(250);
 const badges=[...document.querySelectorAll('#insp .abadge')].map(b=>b.textContent).filter(Boolean);info.badges=badges;
 if(!badges.some(b=>b.includes('∿')))bad.push('hullám-jel nem látszik');
 const tabs=[...document.querySelectorAll('#insp .itab')].map(b=>b.dataset.tab);info.tabs=tabs;if(tabs.join()!=='content,look,motion,fx,place')bad.push('fülek: '+tabs);
 setITab('motion');const mp2=document.querySelector('#insp .ipane[data-tab=motion]');
 if(!mp2||mp2.hidden||!mp2.textContent.includes('◆'))bad.push('Mozgás fül nem mutatja az animált paramétert');
 if(!document.querySelector('#insp .itab[data-tab=motion] .itab-dot'))bad.push('Mozgás fül jelzőpontja hiányzik');
 setITab('place');if(!document.querySelector('#insp .ipane[data-tab=place]:not([hidden]) .scrub .abadge'))bad.push('Elhelyezés mezőjén nincs jelvény');
 T.p[EFFECTS.text.params[0].k].a=0;

 // 6) Eljátszás: armed → stopped; first change starts the take; release → keys, playhead back, stopped
 setPerform(true);if(R.playing)bad.push('Eljátszás élesítésekor nem állt meg a lejátszás');
 const pk=EFFECTS.text.params.find(p=>!p.type).k,pd=EFFECTS.text.params.find(p=>p.k===pk),po=T.p[pk];delete po.k;
 R.time=3;const t0=R.time;document.body.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true,pointerId:5,button:0}));
 if(R.playing)bad.push('lejátszás már a lenyomásra elindult');
 for(let i=0;i<=45;i++){setVal(po,pd.min+(pd.max-pd.min)*(.5+.4*Math.sin(i/45*Math.PI*2)));if(i===0&&!R.playing)bad.push('az első mozdulatra nem indult a lejátszás');R.time+=1/30;}
 if(po.k)bad.push('felvétel közben már a projektbe írt');
 document.body.dispatchEvent(new PointerEvent('pointerup',{bubbles:true,pointerId:5}));
 info.perf={keys:po.k?po.k.length:0,time:R.time,playing:R.playing};
 if(!po.k||po.k.length<4||po.k.length>30)bad.push('csúszka-eljátszás kulcsai: '+info.perf.keys);
 if(Math.abs(R.time-t0)>1e-6)bad.push('a lejátszófej nem ugrott vissza: '+R.time);if(R.playing)bad.push('elengedés után nem állt meg');
 if(po.k){let err=0;for(let i=2;i<=43;i++){const t=t0+i/30,want=pd.min+(pd.max-pd.min)*(.5+.4*Math.sin(i/45*Math.PI*2));err=Math.max(err,Math.abs(ev(po,pd,t)-want)/(pd.max-pd.min));}info.perf.err=+err.toFixed(3);if(err>.08)bad.push('csúszka-felvétel eltér: '+err);}
 if(projectJSON().includes('_pv'))bad.push('_pv a fájlban');
 // canvas move = x and y together (2 components of one take)
 delete T.n.x.k;delete T.n.y.k;R.time=5;document.body.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true,pointerId:6,button:0}));
 for(let i=0;i<=30;i++){setVal(T.n.x,.5*Math.cos(i/30*Math.PI));setVal(T.n.y,.5*Math.sin(i/30*Math.PI));R.time+=1/30;}
 const ps=perfState();document.body.dispatchEvent(new PointerEvent('pointerup',{bubbles:true,pointerId:6}));
 info.perf2={comps:ps.comps,kx:T.n.x.k&&T.n.x.k.length,ky:T.n.y.k&&T.n.y.k.length};if(ps.comps!==2||!T.n.x.k||T.n.x.k.length!==T.n.y.k.length)bad.push('vászon-eljátszás: '+JSON.stringify(info.perf2));
 // a click without moving anything records nothing
 const before=JSON.stringify(T.n);document.body.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true,pointerId:7,button:0}));document.body.dispatchEvent(new PointerEvent('pointerup',{bubbles:true,pointerId:7}));
 if(JSON.stringify(T.n)!==before)bad.push('mozdulat nélküli kattintás változtatott');
 setPerform(false);

 // 7) save → reopen keeps everything (incl. effect keys and curves)
 const ek=F.p[fk].k.length;loadProject(JSON.parse(projectJSON()));const T2=st.layers[0];
 if(!T2.fx[0].p[fk].k||T2.fx[0].p[fk].k.length!==ek)bad.push('Megjelenés-kulcsok újranyitás után');if(T2.n.x.k[0].e!==T.n.x.k[0].e)bad.push('görbe újranyitás után');
 // old keys without a curve still evaluate with the legacy default
 const O=makeLayer('shape');O.n.x.k=[{t:0,v:0},{t:1,v:1}];info.legacy=+ev(O.n.x,BASEK.x,.5).toFixed(4);const O2=makeLayer('shape');O2.n.x.k=[{t:0,v:0,e:5},{t:1,v:1}];
 if(info.legacy!==+ev(O2.n.x,BASEK.x,.5).toFixed(4))bad.push('régi kulcs alapgörbéje megváltozott');
 st.layers=[];commit();
 return {bad,info};})()
