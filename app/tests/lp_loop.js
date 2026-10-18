// Körbeér (FUNKCIO-LELTAR 22.): the LFO wave and the continuous motions snap to whole cycles per loop, so t=0 and t=dur
// give the same frame; the stored Ütem is not rewritten; the switch in the LFO pane / on the Mozgás tab; Loop off = no snap;
// Jelenetsor uses the scene's own length; save → open keeps it; old projects (no flag) are unchanged.
(()=>{const bad=[],info={};R.noAutoPlay=true;setPlay(false);R.time=0;st.layers=[];st.links=[];st.loop=true;st.dur=10;setAnimMode&&setAnimMode(false);commit();
 try{
 const near=(a,b,e=1e-6)=>Math.abs(a-b)<=e;
 // 1) LFO: f=.37 Hz over 10 s → 4 cycles; seam closes only with Körbeér
 const n=mkN(.5);n.a=.5;n.f=.37;n.w=0;const d={min:0,max:1};
 if(near(ev(n,d,0),ev(n,d,10),1e-3))bad.push('teszt hibás: varrat nélkül is egyezik');
 n.lp=1;info.lfo=[ev(n,d,0),ev(n,d,10)];
 if(!near(ev(n,d,0),ev(n,d,10)))bad.push('LFO varrat: '+info.lfo);
 if(n.f!==.37)bad.push('a tárolt Ütem átíródott: '+n.f);
 if(!near(snapRate(.37,10),.4))bad.push('snapRate: '+snapRate(.37,10));
 if(!near(snapRate(.01,10),.1))bad.push('legalább egy kör kell: '+snapRate(.01,10));
 st.dur=7;if(!near(ev(n,d,0),ev(n,d,7)))bad.push('hosszváltás után nincs igazítás');
 // all four wave shapes
 for(const w of [1,2,3]){n.w=w;if(!near(ev(n,d,.013),ev(n,d,7.013)))bad.push('hullámforma '+w+' varrat');}n.w=0;
 // Loop off: no snapping
 st.loop=false;if(!near(ev(n,d,1.3),.5+Math.sin(2*Math.PI*1.3*.37)*.25))bad.push('Loop nélkül is igazít');st.loop=true;st.dur=10;
 // 2) LFO pane switch: new wave with Loop on → Körbeér on, label shows cycles
 const A=makeLayer('shape',{name:'Kör',p:{kind:0,size:.15}});st.layers=[A];R.selId=A.id;setITab&&setITab('layer');commit();renderAll();
 const anb=[...document.querySelectorAll('#insp .ctl .anb')].find(b=>!b.closest('.ctl').classList.contains('anim'));
 if(!anb)bad.push('nincs ∿ gomb');else{anb.click();const box=anb.closest('.ctl'),cb=box.querySelector('.lfo input[aria-label="Seamless loop"]');
  const ctlObjs=R.liveCtl.filter(c=>c.box===box);const o=ctlObjs[0]&&ctlObjs[0].obj;
  if(!cb)bad.push('nincs Körbeér kapcsoló');else{if(!cb.checked||!o||o.lp!==1)bad.push('új hullámon nincs bekapcsolva');
   info.lfoLabel=box.querySelector('.lpinfo').textContent;if(!/cycles \/ 10 s/.test(info.lfoLabel))bad.push('felirat: '+info.lfoLabel);
   cb.checked=false;cb.onchange();if('lp' in o)bad.push('kikapcsolás után maradt lp');cb.checked=true;cb.onchange();}}
 // 3) continuous motions: attach with Loop on → lp=1; frame at 0 == frame at dur
 const idx=t=>LIB.motion.findIndex(x=>x.mo===t);
 const B=makeLayer('shape',{name:'Mozgó',p:{kind:0,size:.15}});st.layers=[B];R.selId=B.id;commit();renderAll();
 for(const t of ['float','spin','pulse','orbit','shake'])attachMo(idx(t),B.id);
 let L=st.layers[0];if(L.mo.some(m=>m.lp!==1))bad.push('mozgáson nincs alapból Körbeér');
 const P={float:['period',3],pulse:['period',1.3],orbit:['period',4.4],shake:['rate',11.7],spin:['speed',47]};
 for(const m of L.mo){const [k,v]=P[m.t];m.p[k].v=v;}commit();
 const ev0=moEval(st.layers[0],0),ev1=moEval(st.layers[0],10);info.mo=[ev0,ev1];
 for(const k of ['dx','dy','sc'])if(!near(ev0[k],ev1[k]))bad.push('mozgás varrat '+k+': '+ev0[k]+' / '+ev1[k]);
 if(!near(((ev1.rot-ev0.rot)%360+360)%360%360,0,1e-6)&&!near(((ev1.rot-ev0.rot)%360+360)%360,360,1e-6))bad.push('forgás nem egész fordulat: '+(ev1.rot-ev0.rot));
 // each one alone (no cancelling between motions)
 for(const m of L.mo){const one={...L,mo:[m]};const a=moEval(one,0),b=moEval(one,10);if(!near(a.dx,b.dx)||!near(a.dy,b.dy)||!near(a.sc,b.sc))bad.push('varrat: '+m.t);}
 // without Körbeér the seam is real (test is meaningful)
 {const m=L.mo.find(x=>x.t==='float');delete m.lp;const one={...L,mo:[m]};if(near(moEval(one,0).dy,moEval(one,10).dy,1e-4))bad.push('teszt hibás: Lebegés varrat nélkül is egyezik');m.lp=1;}
 // Loop off: motion runs its own tempo
 st.loop=false;{const m=L.mo.find(x=>x.t==='float');const one={...L,mo:[m]};if(!near(moEval(one,1.1).dy,Math.sin(2*Math.PI*(1.1/3+m.p.phase.v))*m.p.amp.v))bad.push('Loop nélkül is igazít (mozgás)');}st.loop=true;
 // 4) Mozgás tab switch + label
 R.moSel[L.id]=L.mo[0].id;setITab('motion');renderInsp();
 const sw=document.querySelector('#insp .moloop wa-switch'),lab=document.getElementById('moLoopInfo');info.moLabel=lab&&lab.textContent;
 if(!sw||!sw.checked)bad.push('nincs Körbeér kapcsoló a Mozgás fülön');
 if(!lab||!/3 loops \/ 10 s/.test(lab.textContent))bad.push('mozgásfelirat: '+info.moLabel);
 if(sw){sw.checked=false;sw.dispatchEvent(new Event('change'));if('lp' in st.layers[0].mo[0])bad.push('mozgás kikapcsolva is lp');renderInsp();const s2=document.querySelector('#insp .moloop wa-switch');s2.checked=true;s2.dispatchEvent(new Event('change'));}
 // 5) save → open keeps the flags
 st.layers[0].n.x.a=.3;st.layers[0].n.x.f=.37;st.layers[0].n.x.lp=1;commit();loadProject(JSON.parse(projectJSON()));
 L=st.layers[0];if(!L.n.x.lp||L.mo.some(m=>m.lp!==1))bad.push('mentés után elveszett: '+JSON.stringify([L.n.x.lp,L.mo.map(m=>m.lp)]));
 // 6) old project: no flag, nothing written, same motion
 const old={type:'shape',name:'régi',vis:true,blend:'normal',clip:false,n:{x:{v:.5,a:.2,f:.37,w:0}},fx:[],mo:[{id:'Mold',t:'float',on:true,p:{amt:{v:1},amp:{v:.1},period:{v:3},ang:{v:90},phase:{v:0}}}]};
 const O=normalize(old);if('lp' in O.mo[0]||'lp' in O.n.x)bad.push('régi projekt: lp íródott');
 if(!near(moEval(O,1.7).dy,Math.sin(2*Math.PI*1.7/3)*.1))bad.push('régi projekt mozgása eltér');
 // 7) Jelenetsor: the scene's own length
 R.seqPlay=true;R.seqLen=5;if(!near(loopLen(),5))bad.push('jelenet hossza: '+loopLen());if(!near(ev(n,d,0),ev(n,d,5)))bad.push('jelenetben varrat');R.seqPlay=false;R.seqLen=0;
 }catch(e){bad.push('ERR '+e.message+' '+(e.stack||'').slice(0,300));}
 R.seqPlay=false;
 return {bad,info};})()
