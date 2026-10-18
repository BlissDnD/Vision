// Időzítés gyorsan: Koppintás kosárral (sorrend, átrendezés, kivétel, kijelölés átvétele, koppintás sorban állítja a belépéseket,
// alapbelépés ha nincs, J-jelzések, egy undo, Esc visszavon), Tempó-chip (½× / 2× átidőzíti a kulcsokat, blokkokat, mozgásokat; undo),
// Sima (átmenő) kulcsgörbe (átmegy a kulcsokon, nincs töréspont, nem áll meg), Eljátszás simán és varratmentesen.
(()=>{const bad=[],info={};R.noAutoPlay=true;setPlay(false);R.time=0;st.layers=[];st.links=[];st.cues=[];st.loop=true;st.dur=20;setAnimMode&&setAnimMode(false);commit();
 try{
 const mk=(name,o={})=>makeLayer('shape',{name,p:{kind:0,size:.1},...o});
 // A: Beúszás at 1s (+ exit, + a key after the entry) · B: Rugalmas beúszás at 4s · C: nothing (gets a default entrance)
 const A=mk('A');A.tm={in:1,inAt:1,inDur:.8,out:1,outAt:8,outDur:.8,ease:0};A.n.x.k=[{t:2,v:0,e:0},{t:3,v:.3,e:0}];
 const B=mk('B');B.mo=[makeMo('spring',{at:4})];
 const C=mk('C');
 st.layers=[A,B,C];R.selId=null;commit();renderAll();
 const L=id=>findItem(id).it;
 // 1) arm + basket in click order, numbered badges, remove, reorder
 setTapArm(true);if(!R.tapArm||!document.querySelector('.tapstrip')||document.querySelector('.tapstrip').hidden)bad.push('élesítés: nincs sáv');
 if(!document.getElementById('tapBtn'))bad.push('nincs Koppintás gomb a sávon');
 basketToggle(C.id);basketToggle(A.id);basketToggle(B.id);
 if(R.tapBasket.join()!==[C.id,A.id,B.id].join())bad.push('kosár sorrend');
 const bd=[...document.querySelectorAll('#ltree .tapbdg')].map(e=>e.textContent);info.badges=bd;if(bd.length!==3)bad.push('rétegjelvények: '+bd);
 basketToggle(C.id);if(R.tapBasket.join()!==[A.id,B.id].join())bad.push('kivétel újrakattintással');
 basketToggle(C.id);basketMove(2,0);if(R.tapBasket.join()!==[C.id,A.id,B.id].join())bad.push('átrendezés: '+R.tapBasket);
 // layer-list click while armed toggles instead of selecting
 const row=document.querySelector(`#ltree li[data-id="${B.id}"]`);row.click();if(R.tapBasket.includes(B.id)||R.selId===B.id)bad.push('listakattintás élesítve');
 row.click();if(R.tapBasket.join()!==[C.id,A.id,B.id].join())bad.push('listakattintás vissza: '+R.tapBasket);
 const chips=[...document.querySelectorAll('.tapstrip .tapchip')].map(c=>c.textContent);info.chips=chips;if(chips.length!==3||!/^1C/.test(chips[0]))bad.push('sáv chipjei: '+chips);
 if(!document.querySelector('.tapstrip .tapchip.next'))bad.push('a következő nincs jelölve');
 // 2) taps: C at 2.0, A at 5.0, B at 6.5 → one undo step, cues stored
 const h0=R.hi;
 tapNow(2);tapNow(5);
 if(R.hi!==h0)bad.push('koppintás közben commit történt');
 tapNow(6.5);
 const c=L(C.id),a=L(A.id),b=L(B.id);
 if(!c.mo||!c.mo.length||c.mo[0].t!=='spring'||Math.abs(c.mo[0].p.at.v-2)>1e-6)bad.push('alapbelépés: '+JSON.stringify(c.mo&&c.mo.map(m=>[m.t,m.p.at&&m.p.at.v])));
 if(Math.abs(entranceStart(a)-5)>1e-6||Math.abs(a.tm.outAt-12)>1e-6||Math.abs(a.n.x.k[0].t-6)>1e-6)bad.push('A blokk eltolása: '+JSON.stringify([a.tm.inAt,a.tm.outAt,a.n.x.k.map(k=>k.t)]));
 if(Math.abs(b.mo[0].p.at.v-6.5)>1e-6)bad.push('B Rugalmas beúszás: '+b.mo[0].p.at.v);
 info.cues=st.cues.map(q=>[q.t,q.label]);if(st.cues.length!==3||st.cues.map(q=>q.t).join()!=='2,5,6.5')bad.push('jelzések: '+JSON.stringify(info.cues));
 if(R.hi!==h0+1)bad.push('nem egy undo-lépés: '+(R.hi-h0));
 if(R.tapArm)bad.push('mind a helyén, mégis élesítve');
 if(!/Done/.test(document.querySelector('.tapstrip').textContent))bad.push('nincs „Kész” üzenet');
 undo();{const a2=L(A.id),c2=L(C.id);if(Math.abs(a2.tm.inAt-1)>1e-6||(c2.mo&&c2.mo.length)||(st.cues||[]).length)bad.push('undo nem állította vissza');}
 // 3) Esc cancels a running take (stays armed), second Esc disarms
 setTapArm(true);if(R.tapBasket.length!==3)bad.push('a kosár megmaradt? '+R.tapBasket.length);
 const hE=R.hi;tapNow(3);if(Math.abs(L(C.id).mo[0].p.at.v-3)>1e-6)bad.push('2. menet koppintás');
 tapEsc();if((L(C.id).mo||[]).length||(st.cues||[]).length||R.hi!==hE)bad.push('Esc nem vont vissza');
 if(!R.tapArm||R.tapIdx!==0)bad.push('Esc után élesítve kell maradjon');
 tapEsc();if(R.tapArm)bad.push('második Esc nem lépett ki');
 // take over a selected group's children
 const g=makeGroup('Csop',[mk('G1'),mk('G2')]);st.layers.push(g);R.tapBasket=[];R.selId=g.id;commit();renderAll();
 setTapArm(true);if(R.tapBasket.join()!==g.children.map(x=>x.id).join())bad.push('csoport átvétele: '+R.tapBasket.length);
 setTapArm(false);R.tapBasket=[];
 // 4) Tempó: ½× / 2× rescale keys, blocks, motions around the block start; undo
 const T=mk('T');T.tm={in:1,inAt:2,inDur:1,out:1,outAt:6,outDur:1,ease:0};T.n.x.k=[{t:3,v:0,e:0},{t:5,v:.4,e:0}];
 T.mo=[makeMo('float',{period:3}),makeMo('spin',{speed:40}),makeMo('shake',{rate:10}),makeMo('spring',{at:2,dur:1})];T.mo[0].ry={k:5,cyc:4,tgt:0,rnd:0,seed:1,pts:[1,1,1,1,1,1,1,1]};
 st.layers=[T];R.selId=T.id;commit();renderAll();
 setITab('motion');renderInsp();const trow=document.querySelector('#insp .tporow');if(!trow)bad.push('nincs Tempó sor a Mozgás fülön');
 const hT=R.hi;const half=[...document.querySelectorAll('#insp .tporow .chip')].find(x=>x.textContent==='½×');half&&half.click();
 let t2=st.layers[0];info.half={tm:[t2.tm.inAt,t2.tm.inDur,t2.tm.outAt,t2.tm.outDur],k:t2.n.x.k.map(k=>k.t),per:t2.mo[0].p.period.v,spd:t2.mo[1].p.speed.v,rate:t2.mo[2].p.rate.v,at:t2.mo[3].p.at.v,dur:t2.mo[3].p.dur.v,cyc:t2.mo[0].ry.cyc,tpo:t2.tpo};
 const H=info.half;if(H.tm.join()!=='2,2,10,2'||H.k.join()!=='4,8'||H.per!==6||H.spd!==20||H.rate!==5||H.at!==2||H.dur!==2||H.cyc!==8||H.tpo!==.5)bad.push('½×: '+JSON.stringify(H));
 if(R.hi!==hT+1)bad.push('½× nem egy undo');
 const two=[...document.querySelectorAll('#insp .tporow .chip')].find(x=>x.textContent==='2×');two&&two.click();t2=st.layers[0];
 info.two={tm:[t2.tm.inAt,t2.tm.inDur,t2.tm.outAt],k:t2.n.x.k.map(k=>k.t),per:t2.mo[0].p.period.v,tpo:t2.tpo};
 if(info.two.tm.join()!=='2,0.5,4'||info.two.k.join()!=='2.5,3.5'||info.two.per!==1.5||info.two.tpo!==2)bad.push('2× (½× után = 4× gyorsítás): '+JSON.stringify(info.two));
 undo();undo();t2=st.layers[0];if(t2.tm.outAt!==6||t2.n.x.k[1].t!==5||t2.mo[0].p.period.v!==3||t2.tpo)bad.push('Tempó undo: '+JSON.stringify([t2.tm.outAt,t2.n.x.k[1].t,t2.mo[0].p.period.v,t2.tpo]));
 if(document.querySelector('#insp .tporow')&&st.layers[0].tpo)bad.push('megnyitáskor tempó íródott');
 // group tempo: children compress around the common start
 const g1=mk('g1'),g2=mk('g2');g1.tm={in:1,inAt:1,inDur:1,out:0,outAt:9,outDur:1,ease:0};g2.tm={in:1,inAt:3,inDur:1,out:0,outAt:9,outDur:1,ease:0};
 const G=makeGroup('G',[g1,g2]);st.layers=[G];commit();tempoItem(G,2);if(g2.tm.inAt!==2||g1.tm.inAt!==1||G.tpo!==2)bad.push('csoport-tempó: '+[g1.tm.inAt,g2.tm.inAt,G.tpo]);
 // 5) Sima (átmenő) curve: passes through keys, no corner, does not stop at keys, no overshoot
 if(KEY_EASES[SMOOTH_E]!=='Smooth (pass-through)')bad.push('görbenév: '+KEY_EASES[SMOOTH_E]);
 const K=[{t:0,v:0},{t:1,v:.5},{t:1.6,v:.8},{t:3,v:.2},{t:4,v:.4}].map(k=>({...k,e:SMOOTH_E}));
 for(const k of K)if(Math.abs(keyVal(K,k.t)-k.v)>1e-9)bad.push('nem megy át a kulcson @'+k.t);
 const d=t=>(keyVal(K,t+1e-4)-keyVal(K,t-1e-4))/2e-4,dl=t=>(keyVal(K,t)-keyVal(K,t-1e-4))/1e-4,dr=t=>(keyVal(K,t+1e-4)-keyVal(K,t))/1e-4;
 info.corner=[1,1.6,3].map(t=>+(dl(t)-dr(t)).toFixed(4));if(info.corner.some(x=>Math.abs(x)>2e-2))bad.push('töréspont: '+info.corner);
 if(Math.abs(d(1))<.05)bad.push('megáll a kulcsnál (monoton szakaszon)');
 for(let t=0;t<4;t+=.01){const v=keyVal(K,t);if(v<-1e-9||v>.8+1e-9){bad.push('túllövés @'+t.toFixed(2));break;}}
 // LIN for comparison has a corner at 1.6
 const KL=K.map(k=>({...k,e:4}));if(Math.abs((keyVal(KL,1.6)-keyVal(KL,1.6-1e-4))/1e-4-(keyVal(KL,1.6+1e-4)-keyVal(KL,1.6))/1e-4)<.05)bad.push('a lineáris próba nem törött?');
 // 6) performance: performed keys get the smooth curve; a closed gesture loops seamlessly; Simítás still reduces keys
 const P=mk('P');st.layers=[P];commit();
 const S=[];for(let i=0;i<=120;i++){const t=1+i/60,a=i/120*2*Math.PI;S.push({t,v:[.2*Math.cos(a),.2*Math.sin(a)]});}
 const n1=applyTakeN([P.n.x,P.n.y],S,.2,[1,1]);
 if(!P.n.x.k.every(k=>k.e===SMOOTH_E))bad.push('Eljátszás kulcsai nem simák: '+P.n.x.k.map(k=>k.e));
 const xs=P.n.x.k,a0=keyVal(xs,xs[0].t),a1=keyVal(xs,xs[xs.length-1].t);info.seam=[a0,a1];if(Math.abs(a0-a1)>2e-3)bad.push('varrat: '+info.seam);
 // per-layer key Loop across the seam stays continuous
 P.kloop={on:true,ret:.3};syncKLoop(P);const kl=P.n.x._kl;if(!kl)bad.push('nincs kulcs-Loop');else{const span=kl.b-kl.a+kl.ret;const vs=[kl.b-1e-3,kl.b+1e-3,kl.a+span-1e-3,kl.a+span+1e-3].map(t=>ev(P.n.x,BASEK.x,t));
   if(Math.abs(vs[0]-vs[1])>3e-3||Math.abs(vs[2]-vs[3])>3e-3)bad.push('Loop ugrik: '+vs);}
 // no corner inside the take
 let mx=0;const kx=P.n.x.k;for(let i=1;i<kx.length-1;i++){const t=kx[i].t,l=(keyVal(kx,t)-keyVal(kx,t-1e-4))/1e-4,r=(keyVal(kx,t+1e-4)-keyVal(kx,t))/1e-4;mx=Math.max(mx,Math.abs(l-r)/Math.max(.05,Math.abs(l)+Math.abs(r)));}
 info.takeCorner=+mx.toFixed(4);if(mx>.03)bad.push('töréspont a felvételben: '+mx);
 const n2=applyTakeN([P.n.x,P.n.y],S,.9,[1,1]);info.keys=[n1,n2];if(!(n2<n1))bad.push('Simítás nem ritkít: '+[n1,n2]);
 // key-curve menu offers the new curve
 if(!QUICK_EASES.some(q=>q[1]===SMOOTH_E))bad.push('a görbemenüben nincs Sima');
 // save → open keeps the curve and the tempo field
 const Q=mk('Q');Q.n.x.k=K.map(k=>({...k}));st.layers=[Q];tempoItem(Q,2);commit();loadProject(JSON.parse(projectJSON()));
 if(st.layers[0].n.x.k[0].e!==SMOOTH_E||st.layers[0].tpo!==2)bad.push('mentés → megnyitás');
 }catch(e){bad.push('ERR '+e.message+' '+(e.stack||'').slice(0,300));}
 setTapArm&&setTapArm(false);
 return {bad,info};})()
