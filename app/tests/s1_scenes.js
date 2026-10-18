// S1 · Jelenetek + átmenetek: mentés jelenetként, Jelenetsor, rétegpárosítás (id › alap › típus+név), odamozgás, be-/kiúszás, kézi párosítás, undo, mentés, export-keret.
(()=>{const bad=[],info={};setPlay(false);R.time=0;if(R.seqPlay)setSeqPlay(false);
 st.layers=[];st.links=[];st.scenes=[];
 const bg=makeLayer('plasma',{name:'Háttér'}),T=makeLayer('text',{name:'Cím',x:-.4});st.layers=[bg,T];st.dur=4;commit();
 let s1=saveScene();commit();
 T.n.x.v=.4;T.n.s.v=1.5;const C=makeLayer('shape',{name:'Kör',pal:3});st.layers.push(C);st.dur=3;commit();
 let s2=saveScene();commit();
 {undo();const u1=scenes().length;redo();info.undo=[u1,scenes().length];if(u1!==1||scenes().length!==2)bad.push('undo/redo jelenetmentés: '+info.undo);s1=scenes()[0];s2=scenes()[1];}
 info.scenes=scenes().map(s=>[s.name,s.dur,s.layers.length]);
 if(scenes().length!==2||s1.dur!==4||s2.dur!==3)bad.push('mentés: '+JSON.stringify(info.scenes));
 // 1) pairing: the title by id, the circle only in the new scene, nothing left over
 const m=matchLayers(s1.layers,s2.layers,{});info.match=m.map(p=>(p.a?p.a.name:'-')+'>'+(p.b?p.b.name:'-'));
 if(info.match.join()!=='Háttér>Háttér,Cím>Cím,->Kör')bad.push('párosítás: '+info.match);
 // 2) mid transition: the title glides between the two places, the circle fades in, the scene time restarts
 const tr=s2.trans.dur;const mid=seqFrame(4+tr/2),end=seqFrame(4+tr+.2),pre=seqFrame(3.9);
 const title=mid.items.find(L=>L.name==='Cím'),circ=mid.items.find(L=>L.name==='Kör');
 const tx=ev(title.n.x,BASEK.x,mid.t),ts=ev(title.n.s,BASEK.s,mid.t),co=ev(circ.n.opacity,BASEK.opacity,mid.t);info.mid={t:+mid.t.toFixed(3),e:+mid.e.toFixed(3),x:+tx.toFixed(3),s:+ts.toFixed(3),op:+co.toFixed(3)};
 const sA=s1.layers.find(L=>L.name==='Cím').n.s.v;info.mid.sExp=+((sA+1.5)/2).toFixed(3);if(!(tx>-.3&&tx<.3&&Math.abs(ts-(sA+1.5)/2)<.05))bad.push('a cím nem odamozog: '+JSON.stringify(info.mid));
 if(!(co>.2&&co<.8))bad.push('a kör nem beúszik: '+co);
 if(end.items!==s2.layers||Math.abs(end.t-(tr+.2))>1e-9)bad.push('átmenet után nem a 2. jelenet');
 if(pre.items!==s1.layers||pre.i!==0)bad.push('átmenet előtt nem az 1. jelenet');
 // 3) manual pairing: "no pair" → the old title fades out, the new one fades in
 s2.trans.pairs[T.id]='';const m2=matchLayers(s1.layers,s2.layers,s2.trans.pairs);info.manual=m2.map(p=>(p.a?p.a.name:'-')+'>'+(p.b?p.b.name:'-'));
 if(info.manual.length!==4)bad.push('kézi párosítás: '+info.manual);
 const f3=seqFrame(4+tr/2);const outs=f3.items.filter(L=>L.name==='Cím');if(outs.length!==2||!outs.some(L=>L._toff===4))bad.push('kiúszó cím nem fut tovább a régi jelenet idején');
 delete s2.trans.pairs[T.id];
 // same type + name (a different element, e.g. retyped title) still pairs
 const T3=makeLayer('text',{name:'Cím',x:0});if(!matchLayers(s1.layers,[T3],{}).some(p=>p.a&&p.b))bad.push('típus+név párosítás');
 // 4) Jelenetsor: the timeline is the whole sequence, a render works, the project dur is untouched
 setSeqPlay(true);info.seqDur=st.dur;if(st.dur!==7)bad.push('Jelenetsor hossza: '+st.dur);
 if(JSON.parse(snapshot()).dur!==3)bad.push('Jelenetsor átírta a projekt hosszát');
 R.time=4+tr/2;const fr=frameAt(R.time);if(fr.items===st.layers)bad.push('frameAt nem a jelenetsort adja');
 const out=renderMB(R.main,R.time,30,0,180);present(R.main,out.t,null,cv.width,cv.height,R.time);if(gl.getError())bad.push('GL hiba átmenetben');
 const px=t=>{const o=renderMB(R.main,t,30,0,180);present(R.main,o.t,null,cv.width,cv.height,t);const b=new Uint8Array(4);gl.readPixels(Math.round(cv.width*.3),Math.round(cv.height*.5),1,1,gl.RGBA,gl.UNSIGNED_BYTE,b);return [...b];};
 info.px={s1:px(1),s2:px(6)};
 updGizmo(R.time);if(!document.querySelector('#gizmo').hidden)bad.push('Jelenetsorban látszik a fogantyú');
 // 5) strip UI: blocks, transition chip, its card edits the pairing
 setStrip(true);info.ui=[document.querySelectorAll('#scn .scb').length,document.querySelectorAll('#scn .sct').length];
 if(info.ui.join()!=='2,1')bad.push('sáv: '+info.ui);
 document.querySelector('#scn .sct').click();const sels=[...document.querySelectorAll('.scard select')].filter(s=>/matches/.test(s.getAttribute('aria-label')));
 info.cardRows=sels.length;if(sels.length!==3)bad.push('párosítás sorai: '+sels.length);
 else{const sc=sels.find(s=>s.getAttribute('aria-label').startsWith('Kör'));sc.value=bg.id;sc.onchange();if(s2.trans.pairs[C.id]!==bg.id)bad.push('kártya nem írta a párosítást');delete s2.trans.pairs[C.id];}
 closeScnCard();
 // 6) leaving Jelenetsor restores the workbench; undo / redo; save → reopen
 setSeqPlay(false);if(st.dur!==3)bad.push('kilépés után a hossz: '+st.dur);
 loadScene(s1.id);commit();if(Math.abs(st.layers.find(L=>L.name==='Cím').n.x.v+.4)>1e-9||st.dur!==4)bad.push('betöltés a vászonra');
 const j=JSON.parse(projectJSON());loadProject(j);info.reload=scenes().map(s=>s.layers.length+'/'+s.dur+'/'+s.trans.dur);
 if(scenes().length!==2||!scenes()[1].layers.find(L=>L.name==='Kör'))bad.push('újranyitás: '+info.reload);
 // 7) an old file without scenes opens with none
 const old=JSON.parse(projectJSON());delete old.state.scenes;loadProject(old);if(scenes().length!==0)bad.push('régi projektben jelenet');
 setStrip(false);st.layers=[];st.scenes=[];commit();
 return {bad,info};})()
