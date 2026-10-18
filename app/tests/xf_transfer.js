// XF1 Mozgás átadása + Sorrend festése (FUNKCIO-LELTAR 26.): festés a vásznon = célsorrend, sorszámjelvények, előnézet a projekt
// módosítása nélkül, Ritmus / Út (méretarányos) / Teljes, Késés lépcső, Elfogadás = egy undo, a cél követi a forrást, a cél Mozgás
// fülén „Ritmust kap ettől”, terjedési blokk a Sávokon (nyújtás = késés), újrafestés, kivétel, Leválasztás, Esc, mentés, régi projekt.
(()=>{const bad=[],info={};R.noAutoPlay=true;setPlay(false);R.time=0;st.layers=[];st.links=[];st.loop=true;st.dur=10;commit();
 try{
 const near=(a,b,e=1e-6)=>Math.abs(a-b)<=e;
 const cr=()=>cv.getBoundingClientRect(),wrapE=document.getElementById('wrap');
 const C=(ax,ay)=>{const r=cr(),{W,H}=outSize();return [r.left+(ax/(W/H)+.5)*r.width,r.top+(.5-ay)*r.height];};
 const pe=(type,ax,ay,mods={})=>{const [x,y]=C(ax,ay);(type==='pointerdown'?cv:wrapE).dispatchEvent(new PointerEvent(type,{bubbles:true,pointerId:1,clientX:x,clientY:y,button:0,...mods}));};
 const mk=(name,x)=>{const L=makeLayer('shape',{name,p:{kind:0,size:.08}});L.n.x.v=x;L.n.y.v=0;return L;};
 const S=mk('Címszó',-.6),A=mk('Egy',-.2),B=mk('Kettő',.2),D=mk('Három',.6);st.layers=[S,A,B,D];R.selId=S.id;commit();renderAll();
 const idx=t=>LIB.motion.findIndex(x=>x.mo===t);
 attachMo(idx('spring'),S.id);setPlay(false);const sm=()=>st.layers[0].mo[0];sm().p.at.v=0;sm().p.dur.v=.9;sm().p.ang.v=180;sm().p.dist.v=.3;commit();
 const L=id=>st.layers.find(x=>x.id===id);
 // 1) the card from the motion card button
 R.moSel[S.id]=sm().id;setITab('motion');renderInsp();
 const go=document.querySelector('#insp .xfgo');if(!go)bad.push('nincs Átadás gomb');go&&go.click();
 const card=document.querySelector('.xfcard');if(!card||!R.xfPv)bad.push('nincs átadás-kártya');
 const hi0=R.hi,json0=projectJSON();
 // 2) paint: Kettő → Egy → Három (the order of the stroke), passing over the source does not add it
 pe('pointerdown',.2,0);pe('pointermove',-.2,0);pe('pointermove',-.6,0);pe('pointermove',.6,0);pe('pointerup',.6,0);
 info.ids=R.xfPv&&R.xfPv.ids.map(id=>L(id).name);if(JSON.stringify(info.ids)!==JSON.stringify(['Kettő','Egy','Három']))bad.push('festett sorrend: '+info.ids);
 R.updXf(R.time);const nb=[...document.querySelectorAll('.xfnums i')].filter(i=>!i.hidden).map(i=>i.textContent);if(nb.join()!=='1,2,3')bad.push('sorszámjelvények: '+nb);
 if(L(B.id).n.x.v!==.2)bad.push('a festés elmozdította a réteget');
 // 3) preview: the project does not change, but the targets move with the delay
 if(projectJSON()!==json0||R.hi!==hi0)bad.push('az előnézet módosította a projektet');
 const dx=(id,t)=>{const b=moEval(L(id),t);return b?b.dx:0;},dy=(id,t)=>{const b=moEval(L(id),t);return b?b.dy:0;};
 info.pv=[dx(B.id,.05),dx(B.id,5)];if(Math.abs(dx(B.id,.05))<.05||Math.abs(dx(B.id,5))>1e-3)bad.push('előnézetben nem érkezik: '+info.pv);
 for(const t of [.2,.35,.6])if(!near(dx(B.id,t),dx(A.id,t+.12))||!near(dx(B.id,t),dx(D.id,t+.24)))bad.push('lépcső nem 0,12 mp: '+t);
 // Ritmus: own direction (default 180° = from the left, own distance .45), source timing
 if(!near(dx(B.id,.12),-.45,1e-3))bad.push('Ritmus: nem a saját távolságából indul: '+dx(B.id,.12));
 // 4) Út: source direction / distance, scaled by the target size
 const chip=t=>[...document.querySelectorAll('.xfcard .rychip')].find(c=>c.textContent===t);
 sm().p.ang.v=90;L(B.id).n.s.v=2*L(S.id).n.s.v;chip('Út').click();
 info.ut=[dx(B.id,.17),dy(B.id,.17),dy(S.id,.05)];if(!near(dx(B.id,.17),0,1e-6)||!near(dy(B.id,.17),2*dy(S.id,.05),1e-6))bad.push('Út: '+info.ut);
 chip('Teljes').click();if(!near(dy(B.id,.17),dy(S.id,.05),1e-6))bad.push('Teljes: nem a forrás tere');
 chip('Ritmus').click();sm().p.ang.v=180;L(B.id).n.s.v=L(S.id).n.s.v;
 // Késés slider on the card
 const gs=card.querySelector('input[type=range]');gs.value=.2;gs.oninput();if(!near(R.xfPv.gap,.2))bad.push('Késés csúszka: '+R.xfPv.gap);
 // 5) Elfogadás = one undo step, links written
 [...card.querySelectorAll('button')].find(b=>b.textContent==='Elfogadás').click();
 if(R.xfPv||document.querySelector('.xfcard'))bad.push('a kártya nem zárult');
 if(R.hi!==hi0+1)bad.push('nem egy undo-lépés: '+(R.hi-hi0));
 const X=sm().xf;info.xf=X;if(!X||X.md!==0||!near(X.gap,.2)||X.ids.length!==3)bad.push('m.xf: '+JSON.stringify(X));
 for(const T of [A,B,D]){const m=L(T.id).mo&&L(T.id).mo[0];if(!m||!m.src||m.src.m!==sm().id||m.t!=='spring')bad.push('nincs összekötött mozgás: '+T.name);}
 if(!near(dx(D.id,.3),dx(B.id,.3-.4)))bad.push('elfogadás után a lépcső eltér');
 // 6) the target follows a later source fix (Ritmus field), keeps its own Távolság
 sm().p.dur.v=2;const eb=effMo(L(B.id).mo[0],L(B.id));if(!eb||eb.p.dur.v!==2||eb.dl!==.2)bad.push('nem követi a forrást: '+JSON.stringify(eb&&[eb.p.dur.v,eb.dl]));
 L(B.id).mo[0].p.dist.v=.2;if(!near(effMo(L(B.id).mo[0],L(B.id)).p.dist.v,.2))bad.push('a helyi Távolság elveszett');
 sm().p.dur.v=.9;commit();
 // 7) target card: what it gets, only own fields
 R.selId=B.id;R.moSel[B.id]=L(B.id).mo[0].id;setITab('motion');renderInsp();
 const gets=document.querySelector('#insp .xfgets');info.gets=gets&&gets.textContent;if(!gets||!/Ritmust kap ettől: Címszó/.test(gets.textContent))bad.push('cél kártyája: '+info.gets);
 const labs=[...document.querySelectorAll('#insp .fxi .ctl .lt')].map(x=>x.textContent);info.labs=labs;
 if(labs.includes('Időtartam (mp)')||!labs.includes('Távolság'))bad.push('cél mezői: '+labs);
 // 8) timeline: spread block under the source, ticks, right edge stretches the delay
 setTlx(true);if(R.tlxOpenIds){R.tlxOpenIds.add(S.id);R.tlxOpenIds.add(B.id);}renderTracks();
 const sp=document.querySelector('.tlx-spread');if(!sp)bad.push('nincs terjedési blokk');
 else{const tk=[...sp.querySelectorAll('u')].map(u=>u.textContent);if(tk.join()!=='1,2,3')bad.push('blokk jelei: '+tk);
  if(!document.querySelector('.tlx-clip.xf'))bad.push('a cél mozgássora nem jelölt');
  const e=sp.querySelector('.tlx-ce.b'),r=sp.getBoundingClientRect(),lane=sp.parentElement.getBoundingClientRect(),[va,vb]=viewAB();
  const pxs=(.1*3)/(vb-va)*lane.width;const ev0={bubbles:true,pointerId:1,clientY:r.top+5,button:0};
  e.dispatchEvent(new PointerEvent('pointerdown',{...ev0,clientX:r.right-2}));sp.dispatchEvent(new PointerEvent('pointermove',{...ev0,clientX:r.right-2+pxs}));sp.dispatchEvent(new PointerEvent('pointerup',{...ev0,clientX:r.right-2+pxs}));
  info.gap2=sm().xf.gap;if(!near(sm().xf.gap,.3,.011))bad.push('blokk nyújtása: '+sm().xf.gap);}
 setTlx(false);
 // 9) Esc cancels a re-paint without change
 R.selId=S.id;R.moSel[S.id]=sm().id;renderInsp();const j1=projectJSON();document.querySelector('#insp .xfgo').click();
 pe('pointerdown',.6,0);pe('pointerup',.6,0);document.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true}));
 if(R.xfPv||projectJSON()!==j1)bad.push('Esc után változott');
 // 10) re-paint: Három → Egy; Kettő loses its linked motion
 document.querySelector('#insp .xfgo').click();pe('pointerdown',.6,0);pe('pointermove',-.2,0);pe('pointerup',-.2,0);
 [...document.querySelectorAll('.xfcard button')].find(b=>b.textContent==='Elfogadás').click();
 info.re=sm().xf.ids.map(id=>L(id).name);if(info.re.join()!=='Három,Egy')bad.push('újrafestés: '+info.re);
 if((L(B.id).mo||[]).some(m=>m.src))bad.push('kimaradt cél mozgása megmaradt');
 // 11) × on the source list removes one target
 renderInsp();const xs=[...document.querySelectorAll('#insp .xflist button')];xs[0].click();
 if(sm().xf.ids.join()!==A.id||(L(D.id).mo||[]).some(m=>m.src))bad.push('kivétel a sorból');
 // 12) Leválasztás: same motion, ordinary fields (incl. delay)
 const before=[.1,.3,.5,1].map(t=>dx(A.id,t));R.selId=A.id;R.moSel[A.id]=L(A.id).mo[0].id;renderInsp();
 [...document.querySelectorAll('#insp .xfbox button')].find(b=>b.textContent==='Leválasztás').click();
 const am=L(A.id).mo[0];if(am.src||!am.dl)bad.push('leválasztás: '+JSON.stringify({src:am.src,dl:am.dl}));
 const after=[.1,.3,.5,1].map(t=>dx(A.id,t));if(before.some((v,i)=>!near(v,after[i])))bad.push('leválasztás után más: '+before+' / '+after);
 if(sm().xf)bad.push('a forrás sora nem ürült ki');
 // 13) save → open keeps xf / src / dl; a deleted target is flagged, not dropped
 R.selId=S.id;renderInsp();document.querySelector('#insp .xfgo').click();pe('pointerdown',.2,0);pe('pointermove',.6,0);pe('pointerup',.6,0);
 [...document.querySelectorAll('.xfcard button')].find(b=>b.textContent==='Elfogadás').click();
 loadProject(JSON.parse(projectJSON()));const s2=st.layers[0].mo[0];
 if(!s2.xf||s2.xf.ids.length!==2||!st.layers[2].mo[0].src||!st.layers[1].mo[0].dl)bad.push('mentés után: '+JSON.stringify(s2.xf));
 st.layers=st.layers.filter(x=>x.id!==D.id);commit();R.selId=S.id;R.moSel[S.id]=st.layers[0].mo[0].id;setITab('motion');renderInsp();
 const w=document.querySelector('#insp .xfbox .warn');if(!w||!/1 cél hiányzik/.test(w.textContent))bad.push('hiányzó cél jelzése');if(st.layers[0].mo[0].xf.ids.length!==2)bad.push('a hiányzó cél csendben törlődött');
 // 14) old project: no new fields
 const O=normalize({type:'shape',name:'régi',vis:true,blend:'normal',clip:false,n:{},fx:[],mo:[{id:'Mold',t:'spring',on:true,p:{amt:{v:1},at:{v:0},dur:{v:.9}}}]});
 if(['xf','src','dl'].some(k=>k in O.mo[0]))bad.push('régi projekt: új mezők');
 }catch(e){bad.push('ERR '+e.message+' '+(e.stack||'').slice(0,300));}
 if(R.xfPv&&R.xfClose)R.xfClose();
 return {bad,info};})()
