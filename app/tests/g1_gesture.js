// G1 Gesztus-mozgás: módosítós nyíl (⌘ tempó/karakter, ⌥ ív, ⇧ 15°), a hajlított pálya valóban kiértékelődik,
// szellemképek csak húzás közben, címke csak módosítóval, súgó rámutatásra, az öt folyamatos mozgás fogantyúja,
// húzásonként egy undo, pálya-húzás = előnézeti tekerés, determinizmus hajlított pályával, mentés → megnyitás.
(()=>{const bad=[],info={};R.noAutoPlay=true;setPlay(false);R.time=0;st.layers=[];st.links=[];st.loop=true;st.dur=10;commit();
 try{
 const cr=()=>cv.getBoundingClientRect();
 // aspect coordinates → client px (inverse of toAsp)
 const C=(ax,ay)=>{const r=cr(),{W,H}=outSize();return [r.left+(ax/(W/H)+.5)*r.width,r.top+(.5-ay)*r.height];};
 const pe=(el,type,ax,ay,mods={})=>{const [x,y]=C(ax,ay);el.dispatchEvent(new PointerEvent(type,{bubbles:true,pointerId:1,clientX:x,clientY:y,...mods}));};
 const peC=(el,type,x,y,mods={})=>el.dispatchEvent(new PointerEvent(type,{bubbles:true,pointerId:1,clientX:x,clientY:y,...mods}));
 const ov=document.querySelector('.moarrow'),hd=ov.querySelector('.mohandle'),mid=ov.querySelector('.momid'),hit=ov.querySelector('.mohit'),lab=ov.querySelector('.molab'),tip=ov.querySelector('.motip'),gh=ov.querySelector('.moghosts');
 const upd=()=>R.updMoArrow(R.time);
 const L0=makeLayer('shape',{name:'Kör',p:{kind:0,size:.12}});st.layers=[L0];R.selId=L0.id;commit();renderAll();setITab('motion');
 const idx=t=>LIB.motion.findIndex(x=>x.mo===t);
 attachMo(idx('spring'),L0.id);let L=st.layers[0],m=L.mo[0];R.moSel[L.id]=m.id;renderInsp();setITab('motion');upd();
 if(ov.hidden)bad.push('nincs nyíl');
 const hi0=()=>R.hi;
 // 1) plain drag of the tail: direction + distance, ghosts on during drag, no label without modifiers; one undo step
 let h0=hi0();pe(hd,'pointerdown',-.4,0);pe(hd,'pointermove',.3,.05);upd();
 info.ghostsOn=gh.classList.contains('on');if(!info.ghostsOn)bad.push('szellemkép nincs húzás közben');
 const rects=[...gh.querySelectorAll('rect')];if(rects.length<6||rects.length>8)bad.push('szellemkép-szám: '+rects.length);
 const tr=rects.map(r=>r.getAttribute('transform'));if(new Set(tr).size<5)bad.push('szellemképek nem a pálya mentén: '+tr.slice(0,3));
 if(!lab.hidden)bad.push('címke módosító nélkül');
 pe(hd,'pointerup',.3,.05);upd();if(gh.classList.contains('on'))bad.push('szellemkép nem tűnik el');
 m=st.layers[0].mo[0];info.dir={ang:m.p.ang.v,dist:m.p.dist.v};if(Math.abs(m.p.ang.v-Math.round(Math.atan2(.05,.3)*180/Math.PI))>1||Math.abs(m.p.dist.v-Math.hypot(.3,.05))>.01)bad.push('irány/távolság: '+JSON.stringify(info.dir));
 if(R.hi!==h0+1)bad.push('húzás nem egy undo: '+(R.hi-h0));
 // 2) ⇧: angle snaps to 15°, label shows the angle
 pe(hd,'pointerdown',.3,.05);pe(hd,'pointermove',.3,.13,{shiftKey:true});upd();m=st.layers[0].mo[0];info.snap=m.p.ang.v;
 if(m.p.ang.v%15!==0)bad.push('⇧ nem 15°: '+m.p.ang.v);if(lab.hidden||!/°/.test(lab.textContent))bad.push('⇧ címke: '+lab.textContent);
 pe(hd,'pointerup',.3,.13);if(!lab.hidden)bad.push('címke elengedés után');
 // 3) ⌘ vertical = tempo (up = shorter), horizontal = character
 const d0=m.p.dur.v,c0=m.p.char.v;const [hx,hy]=C(.3,.13);h0=R.hi;
 peC(hd,'pointerdown',hx,hy,{metaKey:true});peC(hd,'pointermove',hx,hy-90,{metaKey:true});m=st.layers[0].mo[0];
 if(!(m.p.dur.v<d0*.6))bad.push('⌘ fel nem gyorsít: '+d0+'→'+m.p.dur.v);if(lab.hidden||!/mp · /.test(lab.textContent))bad.push('⌘ címke: '+lab.textContent);info.cmdLab=lab.textContent;
 peC(hd,'pointermove',hx-90,hy,{metaKey:true});m=st.layers[0].mo[0];if(Math.abs(m.p.dur.v-d0)>.06)bad.push('⌘ le nem lassít vissza: '+m.p.dur.v);if(m.p.char.v!==Math.max(0,c0-2))bad.push('⌘ balra nem lágyabb: '+m.p.char.v);
 if(!/Lágy/.test(lab.textContent))bad.push('karakter címke: '+lab.textContent);
 peC(hd,'pointermove',hx-45,hy,{metaKey:true});m=st.layers[0].mo[0];if(m.p.char.v!==Math.max(0,c0-1))bad.push('⌘ jobbra: '+m.p.char.v);
 peC(hd,'pointerup',hx-45,hy);if(R.hi!==h0+1)bad.push('⌘ húzás nem egy undo');
 // 4) ⌥ bend (from the middle grip) → the layer really travels along the curve
 L=st.layers[0];m=L.mo[0];m.p.ang.v=180;m.p.dist.v=.4;m.p.char.v=0;m.p.dur.v=1;m.p.at.v=0;m.p.fade.v=0;m.p.from.v=1;commit();upd();
 const straight=behav(L,.35);pe(mid,'pointerdown',-.2,0,{altKey:true});pe(mid,'pointermove',-.2,.15,{altKey:true});upd();
 if(!/ív/.test(lab.textContent)||lab.hidden)bad.push('⌥ címke: '+lab.textContent);pe(mid,'pointerup',-.2,.15);
 L=st.layers[0];m=L.mo[0];info.bend=m.p.bend.v;if(!(m.p.bend.v<-.4))bad.push('ív nem hajlik: '+m.p.bend.v); // pointer above a leftward arrow → negative (right-hand normal points down)
 const bent=behav(L,.35);info.paths={straight:[straight.dx,straight.dy],bent:[bent.dx,bent.dy]};
 if(Math.abs(straight.dy)>1e-9)bad.push('egyenes pálya nem egyenes');if(!(bent.dy>.03))bad.push('hajlított pálya nem ível: '+bent.dy);
 const e1=behav(L,1.01);if(Math.abs(e1.dx)>1e-9||Math.abs(e1.dy)>1e-9)bad.push('ívvel nem a helyére érkezik');
 const b0=behav(L,0);if(Math.abs(b0.dx+.4)>1e-6||Math.abs(b0.dy)>1e-6)bad.push('ív kezdőpont: '+[b0.dx,b0.dy]);
 // 5) determinism with a bent path: seek order does not change values or pixels
 const vals=[.1,.5,.8].map(t=>JSON.stringify(behav(L,t)));[.9,.2,.7].forEach(t=>behav(L,t));if(vals.join()!==[.1,.5,.8].map(t=>JSON.stringify(behav(L,t))).join())bad.push('ívelt pálya nem determinisztikus');
 const px=t=>{const out=renderScene(st.layers,R.main,t,'#000');present(R.main,out.t,null,cv.width,cv.height,t);const b=new Uint8Array(4*64*16);gl.bindFramebuffer(gl.FRAMEBUFFER,null);gl.readPixels((cv.width>>1)-64,(cv.height>>1)-8,64,16,gl.RGBA,gl.UNSIGNED_BYTE,b);return b.reduce((s,v,i)=>s+v*(i%7+1),0);};
 const p1=px(.4);px(2);px(.05);const p2=px(.4);if(p1!==p2)bad.push('ugrás után más kép: '+p1+'/'+p2);
 // 6) scrub: dragging the path previews the layer at that point; release restores, no undo step
 h0=R.hi;const q=behav(L,.3);pe(hit,'pointerdown',q.dx,q.dy);info.scrub=R.moScrub&&R.moScrub.t;
 if(!R.moScrub||Math.abs(R.moScrub.t-.3)>.05)bad.push('tekerés idő: '+JSON.stringify(R.moScrub));const sb=behav(L,5);if(Math.abs(sb.dx-q.dx)>.02)bad.push('tekerés nem mutatja a pontot');
 pe(hit,'pointerup',q.dx,q.dy);if(R.moScrub)bad.push('tekerés megmaradt');if(R.hi!==h0)bad.push('tekerés undo-t írt');
 // 7) hover hint at the tail
 hd.dispatchEvent(new PointerEvent('pointerenter',{pointerId:1}));if(tip.hidden||!/⌘ tempó · ⌥ ív · ⇧ szög/.test(tip.textContent))bad.push('súgó: '+tip.textContent);hd.dispatchEvent(new PointerEvent('pointerleave',{pointerId:1}));if(!tip.hidden)bad.push('súgó nem tűnik el');
 // 8) the five continuous handles
 const H={};const sel1=t=>{attachMo(idx(t),L.id);L=st.layers[0];const mm=L.mo[L.mo.length-1];R.moSel[L.id]=mm.id;setPlay(false);R.time=0;renderInsp();setITab('motion');upd();return mm;};
 const drag=(a,b,mods={},el=hd)=>{const h1=R.hi;pe(el,'pointerdown',a[0],a[1],mods);pe(el,'pointermove',b[0],b[1],mods);pe(el,'pointerup',b[0],b[1],mods);upd();return R.hi-h1;};
 const cur=id=>st.layers[0].mo.find(x=>x.id===id);
 let f=sel1('float');if(ov.hidden)bad.push('lebegés fogantyú nincs');
 if(drag([0,.04],[.15,0])!==1)bad.push('lebegés undo');let F=cur(f.id);if(Math.abs(F.p.amp.v-.15)>.005||Math.abs(F.p.ang.v)>1)bad.push('lebegés: '+[F.p.amp.v,F.p.ang.v]);
 const pr0=F.p.period.v;{const [x,y]=C(.15,0);const h1=R.hi;peC(hd,'pointerdown',x,y,{metaKey:true});peC(hd,'pointermove',x,y-90,{metaKey:true});peC(hd,'pointerup',x,y-90);if(R.hi!==h1+1)bad.push('lebegés ⌘ undo');}
 F=cur(f.id);if(!(F.p.period.v<pr0*.6))bad.push('lebegés tempó: '+pr0+'→'+F.p.period.v);
 f=sel1('orbit');if(drag([.08,0],[.2,0])!==1)bad.push('keringés undo');F=cur(f.id);if(Math.abs(F.p.radius.v-.2)>.005)bad.push('keringés sugár: '+F.p.radius.v);
 const dir0=Math.round(F.p.dir.v);{const h1=R.hi,pts=dir0?[[.2,0],[.14,-.14],[0,-.2]]:[[.2,0],[.14,.14],[0,.2]];pe(hd,'pointerdown',...pts[0],{altKey:true});pe(hd,'pointermove',...pts[1],{altKey:true});pe(hd,'pointermove',...pts[2],{altKey:true});pe(hd,'pointerup',...pts[2]);if(R.hi!==h1+1)bad.push('keringés ⌥ undo');}
 F=cur(f.id);if(Math.round(F.p.dir.v)===dir0)bad.push('keringés ⌥ irány nem vált');
 f=sel1('spin');{const rr=Math.max(.03,gizmoRadius(st.layers[0],0))*1.25,s0=f.p.speed.v,a0=Math.PI/2+s0*Math.PI/180,a1=a0+Math.PI/2;
  const h1=R.hi;pe(hd,'pointerdown',Math.cos(a0)*rr,Math.sin(a0)*rr);pe(hd,'pointermove',Math.cos(a0+.7)*rr,Math.sin(a0+.7)*rr);pe(hd,'pointermove',Math.cos(a1)*rr,Math.sin(a1)*rr);pe(hd,'pointerup',0,0);if(R.hi!==h1+1)bad.push('forgás undo');
  F=cur(f.id);info.spin=[s0,F.p.speed.v];if(Math.abs(F.p.speed.v-(s0+90))>3)bad.push('forgás sebesség: '+info.spin);}
 f=sel1('pulse');{const gr=Math.max(.03,gizmoRadius(st.layers[0],0));if(drag([gr*1.08,0],[gr*1.5,0])!==1)bad.push('lüktetés undo');F=cur(f.id);if(Math.abs(F.p.amp.v-.5)>.02)bad.push('lüktetés erő: '+F.p.amp.v);
  const p0=F.p.period.v,[x,y]=C(gr*1.5,0);peC(hd,'pointerdown',x,y,{metaKey:true});peC(hd,'pointermove',x,y+90,{metaKey:true});peC(hd,'pointerup',x,y+90);F=cur(f.id);if(!(F.p.period.v>p0*1.6))bad.push('lüktetés ütem: '+p0+'→'+F.p.period.v);}
 f=sel1('shake');{const gr=Math.max(.03,gizmoRadius(st.layers[0],0)),x0=gr*1.15+.04;if(drag([x0+.025,0],[x0+.2,0])!==1)bad.push('remegés undo');F=cur(f.id);if(Math.abs(F.p.amp.v-.08)>.003)bad.push('remegés erő: '+F.p.amp.v);
  const r0=F.p.rate.v,[x,y]=C(x0+.2,0);peC(hd,'pointerdown',x,y,{metaKey:true});peC(hd,'pointermove',x,y-90,{metaKey:true});peC(hd,'pointerup',x,y-90);F=cur(f.id);if(!(F.p.rate.v>r0*1.6))bad.push('remegés gyorsaság: '+r0+'→'+F.p.rate.v);}
 // ghosts also for a continuous handle
 {f=sel1('float');pe(hd,'pointerdown',.04,0);pe(hd,'pointermove',.1,0);upd();if(!gh.classList.contains('on'))bad.push('lebegés szellemkép');pe(hd,'pointerup',.1,0);upd();if(gh.classList.contains('on'))bad.push('lebegés szellemkép marad');}
 // 9) Beúszás chip: arrow direction picks the move, ⌘ = tempo
 L=st.layers[0];L.tm={in:1,inAt:0,inDur:.8,out:0,outAt:9,outDur:.8,ease:0};R.moSel[L.id]='tm:in';commit();renderInsp();setITab('motion');upd();if(ov.hidden)bad.push('beúszás nyíl nincs');
 drag([-.2,0],[.3,0]);if(st.layers[0].tm.in!==5)bad.push('beúszás irány (Jobbról): '+st.layers[0].tm.in);
 {const o=moveFx(5,0),[x,y]=C(o.dx,o.dy);peC(hd,'pointerdown',x,y,{metaKey:true});peC(hd,'pointermove',x,y-90,{metaKey:true});peC(hd,'pointerup',x,y-90);if(!(st.layers[0].tm.inDur<.5))bad.push('beúszás tempó: '+st.layers[0].tm.inDur);}
 // 10) save → reopen keeps the bend; an old project without bend loads as a straight path
 L=st.layers[0];const sp=L.mo.find(x=>x.t==='spring');const bv=sp.p.bend.v,ref=JSON.stringify(behav(L,.35));loadProject(JSON.parse(projectJSON()));
 const L2=st.layers[0],sp2=L2.mo.find(x=>x.t==='spring');if(!sp2||Math.abs(sp2.p.bend.v-bv)>1e-9)bad.push('ív nem mentődik');if(JSON.stringify(behav(L2,.35))!==ref)bad.push('újranyitva más mozgás');
 const pj=JSON.parse(projectJSON());const ms=(typeof pj.state==='string'?null:pj.state).layers[0].mo.find(x=>x.t==='spring');delete ms.p.bend;ms.p.ang.v=180;ms.p.dist.v=.4;loadProject(pj);const o2=st.layers[0].mo.find(x=>x.t==='spring');
 if(!o2||o2.p.bend.v!==0)bad.push('régi projekt ív: '+(o2&&o2.p.bend.v));
 }catch(e){bad.push('ERR '+e.message+' '+(e.stack||'').slice(0,300));}
 return {bad,info};})()
