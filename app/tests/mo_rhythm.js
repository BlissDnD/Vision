// Mozgás v1.1: Ritmus (chipek, Megáll időnként tényleg megáll és puhán újraindul, Tempó befagyaszt / Erő nyugalomba visz,
// Véletlen szünetek ismételhető), ugrás utáni azonos kép, Mozgássávok (kezdés/vége + puha felfutás, réteg ▸ mozgás ▸ paraméter ▸ kulcs),
// ◆ a mozgáscsúszkán kulcsot ír, Kulcsokká alakítás + undo, mentés → megnyitás, régi projekt, verziócímke.
(()=>{const bad=[],info={};R.noAutoPlay=true;setPlay(false);R.time=0;st.layers=[];st.links=[];st.loop=true;st.dur=20;setAnimMode&&setAnimMode(false);commit();
 try{
 const idx=t=>LIB.motion.findIndex(x=>x.mo===t);
 const A=makeLayer('shape',{name:'Kör',p:{kind:0,size:.15}});st.layers=[A];R.selId=A.id;commit();renderAll();
 attachMo(idx('float'),A.id);let L=st.layers[0];let m=L.mo[0];m.p.period.v=2;m.p.phase.v=.1;commit();
 const dy=t=>{const b=behav(st.layers[0],t);return b?b.dy:0;};
 // 1) chips on the Mozgás tab; Folyamatos = no rhythm field written on open
 R.moSel[L.id]=m.id;setITab('motion');renderInsp();
 if(m.ry)bad.push('megnyitáskor ritmus íródott a projektbe');
 const chips=[...document.querySelectorAll('#insp .rychip')];info.chips=chips.map(c=>c.textContent);
 if(chips.length!==5)bad.push('ritmus-chipek: '+info.chips);
 if(!document.querySelector('#insp .rystrip .rypt'))bad.push('nincs ritmus-szalag');
 const cont=[dy(3.2),dy(3.8)];
 chips.find(c=>/Megáll/.test(c.textContent)).click();L=st.layers[0];m=L.mo[0];
 if(!m.ry||m.ry.k!==1)bad.push('Megáll chip: '+JSON.stringify(m.ry));
 // 2) Megáll időnként: stopped in [3,4] and [8,9] (5 s cycle), moving otherwise, smooth restart
 const fr1=[3.05,3.4,3.95].map(dy),fr2=[8.05,8.5,8.95].map(dy);info.frozen=[fr1,fr2];
 if(Math.max(...fr1)-Math.min(...fr1)>1e-9||Math.max(...fr2)-Math.min(...fr2)>1e-9)bad.push('nem áll meg: '+JSON.stringify(info.frozen));
 if(Math.abs(cont[0]-cont[1])<1e-4)bad.push('Folyamatosnál is állt');
 if(Math.abs(dy(1)-dy(1.3))<1e-4)bad.push('a szünet előtt nem mozog');
 const sp=t=>(moTime(m,t+1e-3).tau-moTime(m,t-1e-3).tau)/2e-3;info.speed=[2.4,2.75,3.5,4.05,4.25,4.6].map(t=>+sp(t).toFixed(3));
 if(Math.abs(sp(2.4)-1)>1e-3||sp(3.5)>1e-6||!(sp(4.05)<.1)||!(sp(4.25)>.2&&sp(4.25)<.8)||Math.abs(sp(4.6)-1)>1e-3)bad.push('nem puha lassulás/újraindulás: '+info.speed);
 // tempo integral is exact: analytic phase = numeric integral of the speed
 {let s=0;const n=4000,T=13.7;for(let i=0;i<n;i++)s+=sp((i+.5)*T/n)*T/n;if(Math.abs(s-moTime(m,T).tau)>2e-3)bad.push('fázisintegrál: '+s+' / '+moTime(m,T).tau);}
 // 3) Tempó freezes where it is (non-zero), Erő returns to rest
 renderInsp();const tg=[...document.querySelectorAll('#insp .rytgt button')];if(tg.length!==2)bad.push('Tempó/Erő kapcsoló: '+tg.length);
 else{tg[1].click();m=st.layers[0].mo[0];if(m.ry.tgt!==1)bad.push('Erő nem kapcsolt');
  if(Math.abs(dy(3.5))>1e-9)bad.push('Erő módban nem nyugalomban: '+dy(3.5));if(Math.abs(dy(.5)-(Math.sin(2*Math.PI*(.5/2+.1))*m.p.amp.v))>1e-9)bad.push('Erő mód a szünet előtt eltér');
  document.querySelectorAll('#insp .rytgt button')[0].click();m=st.layers[0].mo[0];}
 if(Math.abs(fr1[0])<1e-3)info.warnFrozenZero=true;
 // 4) other presets: Lassul–gyorsul keeps average tempo, Elcsendesedik = strength, Véletlen = repeatable and seeded
 renderInsp();[...document.querySelectorAll('#insp .rychip')].find(c=>/Lassul/.test(c.textContent)).click();m=st.layers[0].mo[0];
 if(m.ry.k!==2||Math.abs(moTime(m,6).tau-6)>1e-6)bad.push('Lassul–gyorsul átlaga: '+moTime(m,6).tau);
 renderInsp();[...document.querySelectorAll('#insp .rychip')].find(c=>/Elcsend/.test(c.textContent)).click();m=st.layers[0].mo[0];
 if(m.ry.tgt!==1||Math.abs(moTime(m,4).amp)>1e-9||Math.abs(moTime(m,8).amp-1)>1e-9)bad.push('Elcsendesedik: '+moTime(m,4).amp);
 renderInsp();[...document.querySelectorAll('#insp .rychip')].find(c=>/Véletlen/.test(c.textContent)).click();m=st.layers[0].mo[0];
 {const stops=[];for(let c=0;c<12;c++)stops.push(sp(c*3.5+3.5*.5)<1e-6);info.rndStops=stops.map(x=>x?1:0).join('');
  const t1=moTime(m,40).tau,t2=moTime(m,40).tau;m.ry.seed=5;const t3=moTime(m,40).tau;m.ry.seed=1;
  if(t1!==t2||!stops.some(x=>x)||stops.every(x=>x)||t1===t3)bad.push('Véletlen szünetek: '+info.rndStops+' '+[t1,t3]);}
 // 5) seek determinism by pixels (rhythm on)
 renderInsp();[...document.querySelectorAll('#insp .rychip')].find(c=>/Megáll/.test(c.textContent)).click();m=st.layers[0].mo[0];m.p.amp.v=.3;
 const px=t=>{const out=renderScene(st.layers,R.main,t,'#000');present(R.main,out.t,null,cv.width,cv.height,t);const b=new Uint8Array(4*64*8);gl.bindFramebuffer(gl.FRAMEBUFFER,null);gl.readPixels((cv.width>>1)-32,(cv.height>>1)-60,64,8,gl.RGBA,gl.UNSIGNED_BYTE,b);return b.reduce((s,v,i)=>s+v*(i%7+1),0);};
 const p1=px(7.3);px(12);px(.4);const p2=px(7.3);if(p1!==p2)bad.push('ugrás után más kép: '+p1+' / '+p2);
 // 6) clip start / end with soft ramps; spin freezes after its end
 m.a=2;m.b=6;const amp=t=>moTime(m,t).amp;info.ramp=[1.9,2.3,4,5.8,6.5].map(t=>+amp(t).toFixed(3));
 if(amp(1.9)!==0||!(amp(2.3)>0&&amp(2.3)<1)||amp(2.9)!==1||!(amp(5.8)>0&&amp(5.8)<1)||amp(6.5)!==0||Math.abs(dy(1.5))>1e-9||Math.abs(dy(7))>1e-9)bad.push('sáv + felfutás: '+info.ramp);
 const Sm=makeMo('spin');Sm.a=1;Sm.b=3;const rot=t=>moEval({mo:[Sm]},t).rot;if(rot(.5)!==0||Math.abs(rot(3.5)-rot(5))>1e-9||!(rot(3)>0))bad.push('forgás a sáv végén nem áll meg: '+[rot(.5),rot(3),rot(5)]);
 delete m.b;commit();
 // 7) Sávok: layer ▸ motion clip ▸ params with keys; drag the clip end
 setTlx(true);R.tlxOpenIds.add(L.id);renderTracks();const clip=document.querySelector('#tlxBody .tlx-clip');
 if(!clip)bad.push('nincs mozgássáv a Sávokon');
 else{if(!clip.classList.contains('open'))bad.push('nyitott vég nincs jelölve');const eb=clip.querySelector('.tlx-ce.b'),lane=clip.parentElement,r=lane.getBoundingClientRect();
  eb.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true,pointerId:1,clientX:r.right-2,clientY:r.top+5}));
  clip.dispatchEvent(new PointerEvent('pointermove',{bubbles:true,pointerId:1,clientX:r.left+r.width*.5,clientY:r.top+5,shiftKey:true}));
  clip.dispatchEvent(new PointerEvent('pointerup',{bubbles:true,pointerId:1}));m=st.layers[0].mo[0];info.clipB=m.b;
  if(!(m.b>8&&m.b<12))bad.push('sávvég húzása: '+m.b);
  undo();m=st.layers[0].mo[0];if(m.b!=null)bad.push('sávhúzás undo');}
 L=st.layers[0];m=L.mo[0];R.selId=L.id;R.moSel[L.id]=m.id;renderInsp();setITab('motion');
 const path='mo:'+m.id+'.p.amp';if(!paramList(L).some(q=>q.path===path))bad.push('paramList nem látja a mozgásparamétert');
 // ◆ on the Kitérés slider writes a key at the playhead
 R.time=1;const ctl=[...document.querySelectorAll('#insp .ipane[data-tab=motion] .ctl')].find(c=>/Kitérés/.test(c.textContent));const kb=ctl&&ctl.querySelector('.kb:not(.kgr)');
 if(!kb)bad.push('nincs ◆ a mozgáscsúszkán');else{kb.click();m=st.layers[0].mo[0];if(!m.p.amp.k||m.p.amp.k.length!==1)bad.push('◆ nem írt kulcsot');}
 R.time=3;setAnimMode(true);setVal(st.layers[0].mo[0].p.amp,.1);setAnimMode(false);m=st.layers[0].mo[0];if(!m.p.amp.k||m.p.amp.k.length!==2)bad.push('Animálás módban nem lett 2. kulcs');
 L=st.layers[0];R.tlxOpenIds.add(L.id+'|'+m.id);renderTracks();const sk=document.querySelectorAll(`#tlxBody .tlx-key.sub[data-p="${path}"]`);info.subKeys=sk.length;if(sk.length!==2)bad.push('a mozgás paramétersorán nincs 2 kulcs: '+sk.length);
 if(!layerKeyTimes(L).has(3))bad.push('a rétegsor nem mutatja a mozgáskulcsot');
 R.tlxSels=[{id:L.id,t:3,p:path}];retimeSel(t=>t+1);m=st.layers[0].mo[0];if(Math.abs(m.p.amp.k[1].t-4)>1e-9)bad.push('mozgáskulcs nem mozgatható: '+m.p.amp.k.map(k=>k.t));
 R.tlxSels=[{id:L.id,t:1,p:path},{id:L.id,t:4,p:path}];retimeSel(t=>1+(t-1)*2);m=st.layers[0].mo[0];if(Math.abs(m.p.amp.k[1].t-7)>1e-9)bad.push('mozgáskulcs nem nyújtható');R.tlxSels=[];commit();
 // 8) Kulcsokká alakítás (Rugalmas beúszás) → real keys, motion removed, same path; one undo step brings it back
 const B=makeLayer('shape',{name:'Beúszó'});B.n.x.v=.2;st.layers=[B];R.selId=B.id;commit();R.time=1;attachMo(idx('spring'),B.id);
 const B1=st.layers[0];const pos=(Lr,t)=>{const b=behav(Lr,t)||{dx:0,dy:0,sc:1,op:1};return [ev(Lr.n.x,BASEK.x,t)+b.dx,ev(Lr.n.y,BASEK.y,t)+b.dy,ev(Lr.n.s,BASEK.s,t)*b.sc,ev(Lr.n.opacity,BASEK.opacity,t)*b.op];};
 const ts=[.5,1,1.1,1.25,1.5,1.8,2.5];const before=ts.map(t=>pos(B1,t));R.moSel[B1.id]=B1.mo[0].id;renderInsp();setITab('motion');
 const bk=document.querySelector('#insp .mobake');if(!bk)bad.push('nincs Kulcsokká alakítás gomb');else bk.click();
 const B2=st.layers[0];info.baked={mo:(B2.mo||[]).length,x:(B2.n.x.k||[]).length,op:(B2.n.opacity.k||[]).length};
 if((B2.mo||[]).length||!B2.n.x.k||!B2.n.opacity.k)bad.push('kulcsokká alakítás: '+JSON.stringify(info.baked));
 else{const after=ts.map(t=>pos(B2,t));const err=Math.max(...after.flatMap((a,i)=>a.map((v,j)=>Math.abs(v-before[i][j]))));info.bakeErr=err;if(err>.01)bad.push('a kulcsok mozgása eltér: '+err);
  if(B2.n.x.k.length>40)bad.push('túl sok kulcs: '+B2.n.x.k.length);}
 undo();const B3=st.layers[0];if(!B3.mo||B3.mo.length!==1||B3.n.x.k)bad.push('undo nem állítja vissza egy lépésben');
 // 9) save → reopen keeps rhythm + clip; old v1 project unchanged
 const C=makeLayer('text');C.mo=[makeMo('float'),makeMo('pulse')];setRy(C.mo[0],4);C.mo[0].ry.seed=9;C.mo[0].ry.pts[2]=.5;C.mo[0].ry.k=5;C.mo[0].a=1.5;C.mo[0].b=9;st.layers=[C];commit();loadProject(JSON.parse(projectJSON()));
 const C2=st.layers[0].mo[0];if(!C2.ry||C2.ry.k!==5||C2.ry.seed!==9||C2.ry.pts[2]!==.5||!C2.ry.rnd||C2.a!==1.5||C2.b!==9)bad.push('mentés → megnyitás: '+JSON.stringify(C2));
 if(st.layers[0].mo[1].ry||'a' in st.layers[0].mo[1]||'b' in st.layers[0].mo[1])bad.push('megnyitás új mezőket írt');
 const old={type:'shape',name:'régi',vis:true,blend:'normal',clip:false,n:{},fx:[],mo:[{id:'Mold',t:'float',on:true,p:{amt:{v:1},amp:{v:.1},period:{v:2},ang:{v:90},phase:{v:0}}}]};
 const O=normalize(old);if(O.mo[0].ry||O.mo[0].a!=null||O.mo[0].b!=null)bad.push('régi projekt: új mezők');
 const od=t=>moEval(O,t).dy,ex=t=>Math.sin(2*Math.PI*t/2)*.1;if([0,.3,1.7,25.2].some(t=>Math.abs(od(t)-ex(t))>1e-9))bad.push('régi projekt mozgása eltér');
 // 10) visible version label
 const ver=document.querySelector('.brand .ver');info.ver=ver&&ver.textContent;if(!ver||!/^v0\.\d+\.\d+-/.test(ver.textContent))bad.push('verziócímke: '+info.ver);
 }catch(e){bad.push('ERR '+e.message+' '+(e.stack||'').slice(0,300));}
 return {bad,info};})()
