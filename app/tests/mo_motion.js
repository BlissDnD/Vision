// Mozgás v1: Mozgás polc (ráhúzható mozgások), előnézet rámutatásra, ráhúzás vászonra / kattintás, Mozgás fül ikonsor,
// folyamatos mozgás a projekt Loopjától függetlenül, Rugalmas beúszás (Anime.js-görbe, determinisztikus), nyíl a vásznon,
// rétegenkénti kulcs-Loop, kulcs csak Animálás módban (különben eltolás), késői kulcsok jelzése, mentés → megnyitás.
(()=>{const bad=[],info={};R.noAutoPlay=true;setPlay(false);R.time=0;st.layers=[];st.links=[];st.loop=true;st.dur=10;setAnimMode&&setAnimMode(false);commit();
 try{
 const idx=t=>LIB.motion.findIndex(x=>x.mo===t);
 // 1) shelf
 info.shelf=LIB.motion.filter(x=>x.mo).map(x=>x.name);if(info.shelf.length!==7||LIB.motion[0].head!=='Ráhúzható mozgások')bad.push('Mozgás polc: '+info.shelf);
 R.cat='motion';R.libQ='';buildCats();buildShelf();const cards=[...document.querySelectorAll('#items .item')].filter(b=>/rétegre/.test(b.textContent));if(cards.length<6)bad.push('rétegre-címke: '+cards.length);
 // 2) hover preview on the selected layer, click attaches
 const A=makeLayer('shape',{name:'Kör',p:{kind:0,size:.15}});st.layers=[A];R.selId=A.id;commit();renderAll();
 setAudition('motion',idx('float'));if(!R.moAud||R.moAud.id!==A.id)bad.push('előnézet a kijelölt rétegen');const pv=behav(A,0);setAudition(null);if(R.moAud)bad.push('előnézet nem szűnik meg');
 if(!pv)bad.push('előnézet nem hat');
 addFromLib('motion',idx('float'),null);if(!A.mo||A.mo.length!==1||A.mo[0].t!=='float')bad.push('kattintás nem tette rá');
 if(R.itab!=='motion')bad.push('nem a Mozgás fülre vált');
 undo();if(st.layers[0].mo&&st.layers[0].mo.length)bad.push('undo');redo();
 let L=st.layers[0];
 // 3) continuous: periodic and independent of the project Loop (keeps moving after the end with Loop off)
 const f=L.mo[0];f.p.period.v=2;const y=t=>behav(L,t).dy;
 if(Math.abs(y(.3)-y(2.3))>1e-9)bad.push('lebegés nem periodikus');st.loop=false;if(Math.abs(y(25.25)-y(25.5))<1e-4)bad.push('Loop nélkül megáll');st.loop=true;
 // 4) drop on the canvas: the layer under the pointer gets it
 const r=cv.getBoundingClientRect();R.selId=null;R.dropMo(idx('pulse'),{clientX:r.left+r.width/2,clientY:r.top+r.height/2});L=st.layers[0];
 if(!L.mo||L.mo.length!==2||L.mo[1].t!=='pulse')bad.push('vászonra ejtés: '+(L.mo||[]).map(m=>m.t));
 // 5) Rugalmas beúszás: before = hidden + offset, end = exactly in place, from the left (ang 180), deterministic render
 R.selId=L.id;R.time=1;const S=attachMo(idx('spring'),L.id);L=st.layers[0];const Sp=L.mo.find(m=>m.t==='spring');
 if(!Sp||Math.abs(Sp.p.at.v-1)>1e-9)bad.push('beúszás a lejátszófejnél kezdődik');
 L.mo.forEach(m=>{if(m.t!=='spring')m.on=false;});const b0=behav(L,.5),bm=behav(L,1.03),be=behav(L,1+Sp.p.dur.v+.01);info.spring={b0,bm,be};
 if(!(b0.op<.01))bad.push('kezdés előtt látszik');if(!(bm.dx<-.01))bad.push('nem balról érkezik: '+bm.dx);if(Math.abs(be.dx)>1e-9||Math.abs(be.sc-1)>1e-9||be.op!==1)bad.push('a végén nincs a helyén');
 const px=t=>{const out=renderScene(st.layers,R.main,t,'#000');present(R.main,out.t,null,cv.width,cv.height,t);const b=new Uint8Array(4*64);gl.bindFramebuffer(gl.FRAMEBUFFER,null);gl.readPixels((cv.width>>1)-32,cv.height>>1,32,2,gl.RGBA,gl.UNSIGNED_BYTE,b);return b.reduce((s,v)=>s+v,0);};
 const s1=px(1.3);px(3);px(.2);const s2=px(1.3);if(s1!==s2)bad.push('ugrás után más kép: '+s1+' / '+s2);
 // 6) Mozgás tab: icon row with ring, no old Időzítés section, strength also among the main settings (synced)
 L.mo.forEach(m=>m.on=true);L.tm={in:1,inAt:0,inDur:.5,out:0,outAt:9,outDur:.8,ease:0};commit();R.selId=L.id;R.moSel[L.id]=Sp.id;renderInsp();setITab('motion');
 const mp=document.querySelector('#insp .ipane[data-tab=motion]');const chips=mp.querySelectorAll('.fxrow .fxic:not(.add)');info.chips=chips.length;
 if(chips.length!==4)bad.push('ikonsor: '+chips.length+' (Beúszás + 3 mozgás)');if(/Időzítés \(belépés/.test(document.querySelector('#insp').textContent))bad.push('a régi Időzítés szekció még látszik');
 const amts=R.liveCtl.filter(c=>c.obj===Sp.p.amt);if(amts.length!==2)bad.push('erősség nem két helyen: '+amts.length);
 // 7) arrow on the canvas: drag its tail → direction + distance
 R.updMoArrow(R.time);const ar=document.querySelector('.moarrow');if(!ar||ar.hidden)bad.push('nincs nyíl');
 else{const hd=ar.querySelector('.mohandle');const cr=cv.getBoundingClientRect();hd.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true,pointerId:1,clientX:0,clientY:0}));
  hd.dispatchEvent(new PointerEvent('pointermove',{bubbles:true,pointerId:1,clientX:cr.left+cr.width/2,clientY:cr.top+cr.height*.1}));hd.dispatchEvent(new PointerEvent('pointerup',{bubbles:true,pointerId:1}));
  info.arrow={ang:Sp.p.ang.v,dist:Sp.p.dist.v};const Sp2=st.layers[0].mo.find(m=>m.t==='spring');if(!(Math.abs(Sp2.p.ang.v-90)<3&&Sp2.p.dist.v>.3))bad.push('nyílhúzás: '+JSON.stringify({ang:Sp2.p.ang.v,dist:Sp2.p.dist.v}));}
 // 8) timeline / retime know the spring block
 L=st.layers[0];if(!layerSegs(L).some(s=>s.cls==='mo'))bad.push('nincs idővonal-szakasz');if(!timeFields(L).some(f=>f.len&&Math.abs(f.get()-1)<1e-9))bad.push('retime nem látja');
 // 9) per-layer key Loop: after the last key it glides back and repeats
 const K=makeLayer('shape',{name:'Kulcsos'});K.n.x.k=[{t:0,v:0,e:4},{t:1,v:.5,e:4}];K.kloop={on:true,ret:.5};st.layers=[K];commit();renderScene(st.layers,R.main,0,'#000');
 const X=t=>ev(K.n.x,BASEK.x,t);info.kl=[X(.5),X(1.25),X(1.5),X(2)].map(v=>+v.toFixed(3));
 if(!(X(1.25)<.5&&X(1.25)>0)||Math.abs(X(1.5))>1e-6||Math.abs(X(2)-X(.5))>1e-6)bad.push('kulcs-Loop: '+info.kl);
 K.kloop.on=false;renderScene(st.layers,R.main,0,'#000');if(Math.abs(X(2)-.5)>1e-6)bad.push('kikapcsolva is ismétel');K.kloop.on=true;
 // 10) keys only in Animálás mode: otherwise the whole animation shifts, playback keeps going
 R.time=.5;setPlay(true);setVal(K.n.x,X(.5)+.2);setPlay(false);
 if(K.n.x.k.length!==2||Math.abs(K.n.x.k[0].v-.2)>1e-9||Math.abs(K.n.x.k[1].v-.7)>1e-9)bad.push('nem tolta el: '+JSON.stringify(K.n.x.k.map(k=>k.v)));
 setAnimMode(true);setVal(K.n.x,.1);setAnimMode(false);if(K.n.x.k.length!==3)bad.push('Animálás módban nem lett kulcs');
 // 11) keys past the project end are flagged (Loop on)
 K.kloop.on=false;K.n.x.k.push({t:14,v:0});st.dur=10;st.loop=true;R.selId=K.id;commit();renderInsp();setITab('motion');if(!/projekt hossza/.test(document.querySelector('#insp').textContent))bad.push('késői kulcsok nincsenek jelezve');
 // 12) save → reopen keeps motions and the key Loop
 const B=makeLayer('text');B.mo=[makeMo('orbit'),makeMo('shake')];B.mo[0].p.radius.v=.2;B.kloop={on:true,ret:1};st.layers=[B];commit();loadProject(JSON.parse(projectJSON()));
 const B2=st.layers[0];if(!B2.mo||B2.mo.length!==2||Math.abs(B2.mo[0].p.radius.v-.2)>1e-9||!B2.kloop||!B2.kloop.on)bad.push('mentés → megnyitás: '+JSON.stringify(B2.mo));
 const junk=normalize({type:'shape',name:'x',vis:true,blend:'normal',clip:false,n:{},fx:[],mo:[{t:'nincs'},{t:'spin',p:{speed:{v:90}}}]});if(junk.mo.length!==1||junk.mo[0].p.speed.v!==90||!junk.mo[0].p.amt)bad.push('normalizálás');
 }catch(e){bad.push('ERR '+e.message+' '+(e.stack||'').slice(0,300));}
 return {bad,info};})()
