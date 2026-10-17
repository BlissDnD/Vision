// M5 · mozgásblokk: eltolás, a rugalmas közép nyújtása (a beúszás sebessége marad), zárás lassítása, horgonyzott jelzések, mentés.
(()=>{const bad=[],info={};st.layers=[];st.cues=[];
 const mk=()=>{const L=makeLayer('plasma',{tm:{in:1,inAt:1,inDur:1,out:1,outAt:6,outDur:1,ease:0}});for(const [t,v] of [[2,0],[4,.3],[6.5,.6]])setKey(L.n.x,t,v);return L;};
 const ks=L=>L.n.x.k.map(k=>k.t);const near=(a,b)=>Math.abs(a-b)<1e-6;
 let L=mk();st.layers=[L];
 const B=blockOf(L);info.block=B;if(!(near(B.a,1)&&near(B.inEnd,2)&&near(B.outStart,6)&&near(B.b,7)))bad.push('blokkhatárok');
 // 1) move: everything together
 shiftBlock(L,1);info.shift={inAt:L.tm.inAt,outAt:L.tm.outAt,keys:ks(L)};
 if(L.tm.inAt!==2||L.tm.outAt!==7||ks(L).join()!=='3,5,7.5')bad.push('eltolás');
 // 2) right edge: elastic middle, entry speed unchanged, exit later at the same speed
 L=mk();st.layers=[L];stretchBlock(L,9,'hold');info.hold={inAt:L.tm.inAt,inDur:L.tm.inDur,outAt:L.tm.outAt,outDur:L.tm.outDur,keys:ks(L),b:blockOf(L).b};
 if(L.tm.inAt!==1||L.tm.inDur!==1)bad.push('a beúszás megváltozott');if(L.tm.outAt!==8||L.tm.outDur!==1)bad.push('a zárás nem csak későbbre került');
 if(ks(L).join()!=='2,5,8.5')bad.push('középső kulcsok nyújtása: '+ks(L).join());if(!near(blockOf(L).b,9))bad.push('új blokkvég');
 // 3) „Zárás lassítása”: only the exit phase gets longer
 L=mk();st.layers=[L];stretchBlock(L,9,'close');info.close={outAt:L.tm.outAt,outDur:L.tm.outDur,keys:ks(L)};
 if(L.tm.outAt!==6||L.tm.outDur!==3||ks(L).join()!=='2,4,7.5')bad.push('zárás lassítása');
 // 4) anchors: a key on a cue stays on it, and the count is reported
 L=mk();st.layers=[L];addCue(4);const kept=stretchBlock(L,9,'hold');info.anchor={kept,keys:ks(L)};
 if(kept!==1||!ks(L).includes(4))bad.push('horgonyzott kulcs elcsúszott');
 const kept2=stretchBlock(L,10,'hold',false);if(kept2!==0||ks(L).includes(4))bad.push('horgony nélküli mód');
 // 5) typed timing: animated text start/out move with the block
 const T=makeLayer('mtext',{text:{str:'HELLO'},p:{start:.5,outAt:4}});shiftBlock(T,1);info.mtext=[T.p.start.v,T.p.outAt.v];if(T.p.start.v!==1.5||T.p.outAt.v!==5)bad.push('szöveg időzítése');
 // 6) cues saved and reopened; UI shows blocks and cues
 st.layers=[mk(),T];commit();addCue(2.5);commit();const s1=snapshot();loadProject(JSON.parse(projectJSON()));
 info.cues=st.cues.map(c=>c.t);if(snapshot()!==s1||st.cues.length!==2)bad.push('jelzések mentése');
 setTlx(true);renderTracks();info.ui={blocks:document.querySelectorAll('.tlx-block').length,cues:document.querySelectorAll('.tlx-cue').length};
 if(info.ui.blocks<2||info.ui.cues!==2)bad.push('blokk/jelzés a Sávok panelen');setTlx(false);
 st.layers=[];st.cues=[];commit();
 return {bad,info};})()
