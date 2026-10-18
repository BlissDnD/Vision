// KO1 Koreográfia (FUNKCIO-LELTAR 27., első szelet) egy 9:16 tipográfiai jeleneten: javasolt szerepek, ✦ gomb → kártya előnézettel
// (a projekt nem változik), szerepenként eltérő érkezés, Mérték / Ritmus / Hangsúly, részvétel és szerepváltás, Elfogadás = egy undo,
// Jelenetmozgás blokk a Sávokon (eltolás, ritmusnyújtás, szerepsorok), réteg Mozgás fül (szerep, részvétel, Önálló mozgássá), Esc,
// mentés → megnyitás, régi projekt.
(()=>{const bad=[],info={};R.noAutoPlay=true;setPlay(false);R.time=0;st.layers=[];st.links=[];st.scenes=[];delete st.ko;st.loop=true;st.dur=8;st.size='1080x1920';resizeMain();commit();
 try{
 const near=(a,b,e=1e-6)=>Math.abs(a-b)<=e;
 const bg=makeLayer('gradient',{name:'Háttér'}),T=makeLayer('text',{name:'Cím'}),S1=makeLayer('text',{name:'Alcím'}),S2=makeLayer('text',{name:'Dátum'}),M=makeLayer('shape',{name:'Kör',p:{kind:0,size:.22}}),Dc=makeLayer('shape',{name:'Pötty',p:{kind:0,size:.05}});
 T.n.s.v=.3;T.n.y.v=.2;S1.n.s.v=.1;S1.n.y.v=-.05;S2.n.s.v=.08;S2.n.y.v=-.2;M.n.y.v=-.35;Dc.n.x.v=.3;Dc.n.y.v=.35;
 st.layers=[bg,M,Dc,S2,S1,T];R.selId=T.id;commit();renderAll();
 const L=id=>st.layers.find(x=>x.id===id),B=(Lr,t)=>moEval(Lr,t)||{dx:0,dy:0,sc:1,op:1,rot:0};
 // 1) suggested roles
 const sr=suggestRoles();info.roles=st.layers.map(x=>x.name+':'+sr[x.id]);
 const want={[bg.id]:'bg',[T.id]:'title',[S1.id]:'sub',[S2.id]:'sub',[M.id]:'main',[Dc.id]:'deco'};
 for(const id in want)if(sr[id]!==want[id])bad.push('szerepjavaslat: '+L(id).name+' = '+sr[id]);
 // 2) the ✦ button opens the card; preview only
 const btn=document.querySelector('.kobtn');if(!btn)bad.push('nincs ✦ Koreográfia gomb');
 const j0=projectJSON(),hi0=R.hi;btn.click();const card=document.querySelector('.kocard');
 if(!card||!R.koPv)bad.push('nincs koreográfia-kártya');
 if(projectJSON()!==j0)bad.push('a kártya nyitása módosította a projektet');
 // 3) role-aware motion: title from below with impact size, background zoom-settle + later drift, order of starts
 const t0=B(T,.35);info.title0=t0;if(!(t0.dy<-.1)||!(t0.sc>1.05)||!(t0.op<.05))bad.push('főcím indulása: '+JSON.stringify(t0));
 if(Math.abs(B(T,3).dy)>1e-4)bad.push('főcím nem érkezett meg');
 const b0=B(bg,0);if(!(b0.sc>1.04))bad.push('háttér nem nagyításból indul: '+b0.sc);if(!(Math.abs(B(bg,4).dy)>1e-4))bad.push('háttér nem lebeg érkezés után');
 const K=R.koPv,start=id=>koParts(K,id)[0].at;info.starts=[bg,T,M,Dc,S1,S2].map(x=>x.name+':'+start(x.id));
 if(!(start(bg.id)<start(T.id)&&start(T.id)<start(M.id)&&start(M.id)<start(Dc.id)&&start(Dc.id)<start(S1.id)&&start(S1.id)<start(S2.id)))bad.push('érkezési sorrend: '+info.starts);
 if(near(koParts(K,Dc.id)[0].ang,koParts(K,T.id)[0].ang))bad.push('díszítő ugyanúgy mozog, mint a cím');
 // 4) Mérték / Ritmus / Hangsúly on the card
 const rg=()=>[...document.querySelectorAll('.kocard > .ctl input[type=range]')];
 const d0=B(T,.35).dy;rg()[0].value=2;rg()[0].oninput();if(!near(B(T,.35).dy,2*d0,1e-6))bad.push('Mérték: '+B(T,.35).dy+' / '+d0);
 rg()[1].value=2;rg()[1].oninput();if(!near(start(S2.id),2*(1+.1),1e-6))bad.push('Ritmus térköz: '+start(S2.id));
 if(!near(koParts(K,T.id)[0].dur,.8))bad.push('Ritmus a belépés sebességét is változtatta');
 rg()[2].value=1;rg()[2].oninput();if(koParts(K,T.id)[0].char!==2)bad.push('Hangsúly: nincs Rugó karakter');
 rg()[0].value=1;rg()[0].oninput();rg()[1].value=1;rg()[1].oninput();
 // 5) roles in the card: switch Pötty to Kísérő szöveg and back, take Dátum out
 card.querySelectorAll('details')[0].open=true;
 const row=n=>[...document.querySelectorAll('.kocard .korow')].find(r=>r.querySelector('.kon').textContent===n);
 const sel=row('Pötty').querySelector('select');sel.value='sub';sel.onchange();if(R.koPv.roles[Dc.id]!=='sub')bad.push('szerepváltás a kártyán');
 const sel2=row('Pötty').querySelector('select');sel2.value='deco';sel2.onchange();
 const cb=row('Dátum').querySelector('input');cb.checked=false;cb.onchange();if(moEval(S2,.5))bad.push('kivett elem mozog');
 // 6) Elfogadás = one undo
 [...document.querySelectorAll('.kocard button')].find(b=>b.textContent==='Accept').click();
 if(R.koPv||document.querySelector('.kocard'))bad.push('a kártya nem zárult');if(R.hi!==hi0+1)bad.push('nem egy undo-lépés: '+(R.hi-hi0));
 info.ko=st.ko&&{ids:st.ko.ids.length,acc:st.ko.acc};if(!st.ko||st.ko.ids.length!==5||st.ko.ids.includes(S2.id)||st.ko.acc!==1)bad.push('st.ko: '+JSON.stringify(st.ko));
 const det=[.2,.5,1,2.5].map(t=>B(T,t).dy);if(det.some((v,i)=>v!==B(T,[.2,.5,1,2.5][i]).dy))bad.push('nem determinisztikus');
 // 7) Sávok: one block; move + stretch; role rows
 setTlx(true);renderTracks();const blk=document.querySelector('.tlx-ko');if(!blk)bad.push('nincs Jelenetmozgás blokk');
 else{const lane=blk.parentElement.getBoundingClientRect(),[va,vb]=viewAB(),px=s=>s/(vb-va)*lane.width,r=blk.getBoundingClientRect(),e0={bubbles:true,pointerId:1,clientY:r.top+5,button:0};
  blk.dispatchEvent(new PointerEvent('pointerdown',{...e0,clientX:r.left+20}));blk.dispatchEvent(new PointerEvent('pointermove',{...e0,clientX:r.left+20+px(1)}));blk.dispatchEvent(new PointerEvent('pointerup',{...e0,clientX:r.left+20+px(1)}));
  info.at=st.ko.at;if(!near(st.ko.at,1,.02))bad.push('blokk eltolása: '+st.ko.at);
  const b2=document.querySelector('.tlx-ko'),r2=b2.getBoundingClientRect(),eb=b2.querySelector('.tlx-ce.b'),e1={...e0,clientY:r2.top+5};
  eb.dispatchEvent(new PointerEvent('pointerdown',{...e1,clientX:r2.right-2}));b2.dispatchEvent(new PointerEvent('pointermove',{...e1,clientX:r2.right-2+px(1)}));b2.dispatchEvent(new PointerEvent('pointerup',{...e1,clientX:r2.right-2+px(1)}));
  info.sp=st.ko.sp;if(!(st.ko.sp>1.05))bad.push('ritmusnyújtás: '+st.ko.sp);
  document.querySelector('.tlx-korow .tlx-chev').click();const rr=document.querySelectorAll('.tlx-korole').length;if(rr!==5)bad.push('szerepsorok: '+rr);}
 setTlx(false);st.ko.at=0;st.ko.sp=1;commit();
 // 8) the layer's Mozgás tab: role, participation, Önálló mozgássá
 R.selId=S1.id;setITab('motion');renderInsp();const kb=document.querySelector('#insp .kobox');if(!kb)bad.push('nincs szerep a Mozgás fülön');
 else{const s=kb.querySelector('select');if(s.value!=='sub')bad.push('Mozgás fül szerepe: '+s.value);s.value='deco';s.onchange();if(st.ko.roles[S1.id]!=='deco')bad.push('szerepváltás a rétegen');
  const c=document.querySelector('#insp .kobox input[type=checkbox]');c.checked=false;c.onchange();if(st.ko.ids.includes(S1.id))bad.push('részvétel kikapcsolása');}
 R.selId=T.id;renderInsp();const tb=[.2,.5,.9,2].map(t=>B(T,t));
 [...document.querySelectorAll('#insp .kobox button')].find(b=>b.textContent==='Make independent motion').click();
 const ta=[.2,.5,.9,2].map(t=>B(T,t));if(!(L(T.id).mo||[]).some(m=>m.t==='spring')||st.ko.ids.includes(T.id))bad.push('Önálló mozgássá: '+JSON.stringify(L(T.id).mo));
 if(tb.some((b,i)=>!near(b.dy,ta[i].dy)||!near(b.sc,ta[i].sc)||!near(b.op,ta[i].op)))bad.push('önálló mozgás más: '+JSON.stringify([tb[1],ta[1]]));
 // 9) Esc closes a new preview without change; save → open keeps the block; undo works
 const j1=projectJSON();koOpen();document.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true}));if(R.koPv||projectJSON()!==j1)bad.push('Esc után változott');
 loadProject(JSON.parse(projectJSON()));if(!st.ko||st.ko.ids.length!==3)bad.push('mentés után: '+JSON.stringify(st.ko&&st.ko.ids));
 undo();undo();if(!st.ko)bad.push('undo után eltűnt a blokk');
 // 10) old project: no block
 loadProject({app:'vel',v:4,state:{layers:[],dur:5}});if(st.ko)bad.push('régi projekt: ko keletkezett');
 }catch(e){bad.push('ERR '+e.message+' '+(e.stack||'').slice(0,300));}
 if(R.koPv)koClose();
 return {bad,info};})()
