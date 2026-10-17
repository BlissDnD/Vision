// M1 · közös idő: Loop nélküli továbbfutás, végállapot megtartása, rögzített lépésű állapot (feedback), export = ugrás.
(()=>{const bad=[],info={};
 const saveQ=st.q;st.q=.25;resizeMain();
 const px=(items,t,exact=true)=>{const out=renderAt(items,R.main,t,st.bg,exact);present(R.main,out.t,null,cv.width,cv.height,t);
   const w=cv.width,h=cv.height,b=new Uint8Array(w*h*4);gl.readPixels(0,0,w,h,gl.RGBA,gl.UNSIGNED_BYTE,b);return b;};
 const diff=(a,b)=>{let s=0;for(let i=0;i<a.length;i+=4)s+=Math.abs(a[i]-b[i])+Math.abs(a[i+1]-b[i+1])+Math.abs(a[i+2]-b[i+2]);return s/(a.length/4*3);};
 const look=st.look;st.look=mkLook('Nyers');               // no grain/post noise, so pixels compare cleanly
 R.playing=false;R.snapping=true;                          // drive the clock by hand

 // 1) generator keeps running past the range end, timed text holds its end state
 st.dur=10;st.loop=false;
 const gen=makeLayer('plasma');const txt=makeLayer('mtext',{text:{str:'VÉGÁLLAPOT'},p:{start:.3,dur:.9}});
 const a10=px([txt],10),a12=px([txt],12),g10=px([gen],10),g12=px([gen],12);
 info.textHoldDiff=+diff(a10,a12).toFixed(3);info.genMoveDiff=+diff(g10,g12).toFixed(3);
 if(info.textHoldDiff>0.01)bad.push('időzített szöveg nem tartja a végállapotot a tartomány után');
 if(info.genMoveDiff<0.5)bad.push('a generátor megállt a tartomány végén');

 // 2) the playback clock: Loop off runs on, Loop on wraps
 const run=(t0,secs)=>{R.time=t0;R.playing=true;R.snapping=false;R.last=0;let now=0;const steps=Math.round(secs/0.1);
   st.layers=[gen];for(let i=0;i<steps;i++){now+=100;frame(now);}R.playing=false;R.snapping=true;return R.time;};
 st.loop=false;const tOff=run(9.5,1.5);st.loop=true;const tOn=run(9.5,1.5);st.loop=false;
 info.clockLoopOff=+tOff.toFixed(2);info.clockLoopOn=+tOn.toFixed(2);
 if(!(tOff>10.9))bad.push('Loop nélkül megállt/visszaugrott az óra: '+tOff);
 if(!(tOn<1.2))bad.push('Loop mellett nem ugrott vissza: '+tOn);
 R.time=12;frame(1e6);info.overrunBadge=!$('#tlOver').hidden&&$('#tlOver').textContent;
 if(!info.overrunBadge)bad.push('nincs továbbfutás-jelzés az idővonalon');
 if(overrun(12)!==2||overrun(9)!==0)bad.push('overrun()');
 st.loop=true;if(sceneT(23)!==3||sceneT(-1)!==9)bad.push('sceneT wrap');st.loop=false;if(sceneT(23)!==23)bad.push('sceneT no-loop');
 if(audioIndex(2,100,150)!==-1||audioIndex(1,100,150)!==100)bad.push('audioIndex');

 // 3) stateful layer (feedback) – export sequence vs seek vs uneven preview frames
 const fb=makeLayer('feedback',{p:{decay:.9}});const items=[makeLayer('plasma',{s:.5}),fb];
 const T=4;
 resetSim(R.main);for(let i=0;i<=T*30;i++)renderAt(items,R.main,i/30,st.bg,true);const exp30=px(items,T,true);
 resetSim(R.main);for(let i=0;i<=T*24;i++)renderAt(items,R.main,i/24,st.bg,true);const exp24=px(items,T,true);
 resetSim(R.main);const seekA=px(items,T,true);resetSim(R.main);const seekB=px(items,T,true);
 resetSim(R.main);let tt=0,k=0;while(tt<T-1e-9){tt=Math.min(T,tt+(k++%3===0?.033:.007));renderAt(items,R.main,tt,st.bg,false);}const prev=px(items,T,false);
 info.fb={seekRepeat:+diff(seekA,seekB).toFixed(4),export30_vs_seek:+diff(exp30,seekA).toFixed(3),export30_vs_export24:+diff(exp30,exp24).toFixed(3),preview_vs_export:+diff(prev,exp30).toFixed(3)};
 if(info.fb.seekRepeat>0)bad.push('ugrás nem determinisztikus');
 if(info.fb.export30_vs_export24>0.5)bad.push('feedback függ az export fps-től');
 if(info.fb.export30_vs_seek>1.5)bad.push('ugrás ≠ export (feedback)');
 // paused frame re-render must not advance state
 const p1=px(items,T,true),p2=px(items,T,true);info.fb.pausedStable=+diff(p1,p2).toFixed(4);if(info.fb.pausedStable>0)bad.push('szünetben a feedback tovább lép');

 st.look=look;st.q=saveQ;resizeMain();R.snapping=false;
 return {bad,info};})()
