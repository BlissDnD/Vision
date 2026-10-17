// M1 lezárás: export-beállítás a projektben, blob-követés a közös órán, mozgási elmosás.
(()=>{const bad=[],info={};
 const saveQ=st.q;st.q=.25;resizeMain();
 const grab=()=>{const w=cv.width,h=cv.height,b=new Uint8Array(w*h*4);gl.readPixels(0,0,w,h,gl.RGBA,gl.UNSIGNED_BYTE,b);return b;};
 const px=(items,t,exact=true)=>{const out=renderAt(items,R.main,t,st.bg,exact);present(R.main,out.t,null,cv.width,cv.height,t);return grab();};
 const mb=(items,t,n,sh=180)=>{st.layers=items;const out=renderMB(R.main,t,30,n,sh);present(R.main,out.t||out,null,cv.width,cv.height,t);return grab();};
 const diff=(a,b)=>{let s=0;for(let i=0;i<a.length;i+=4)s+=Math.abs(a[i]-b[i])+Math.abs(a[i+1]-b[i+1])+Math.abs(a[i+2]-b[i+2]);return s/(a.length/4*3);};
 const look=st.look;st.look=mkLook('Nyers');R.playing=false;R.snapping=true;st.dur=10;st.loop=false;

 // 1) export length / start / fps are saved with the project and restored on reopen; old files get defaults
 Object.assign(EXP,{dur:15,from:'head',fps:60,mb:16,sh:270});
 const saved=JSON.parse(projectJSON());info.savedExp=saved.state.exp;
 Object.assign(EXP,EXP_DEF);loadProject(saved);info.reopenedExp={...EXP};
 if(EXP.dur!==15||EXP.from!=='head'||EXP.fps!==60||EXP.mb!==16||EXP.sh!==270)bad.push('export-beállítás nem jött vissza a projektből');
 loadProject({app:'latomas',v:2,state:{layers:[],dur:6}});if(EXP.dur!=='tl'||EXP.from!=='0')bad.push('régi projektnél nem az alapérték lett az export');
 applyExp({dur:-3,from:'x',fps:7});if(EXP.dur!=='tl'||EXP.fps!==30)bad.push('hibás export-érték átment');

 // 2) blob tracking is on the shared clock: seek repeat, fps independence, paused stability
 const blobItems=()=>[makeLayer('plasma',{s:.6,fx:[['blob',{p:{smooth:.85,jitter:.6,flicker:.3,scramble:.5,label:0}}]]})];
 const items=blobItems();if(!sceneHasState(items))bad.push('a blob-réteg nem számít állapottartónak');
 const T=2.5; // < WARM, so seek pre-roll and export from 0 cover the same ticks
 resetSim(R.main);for(let i=0;i<=T*30;i++)renderAt(items,R.main,i/30,st.bg,true);const e30=px(items,T,true);
 resetSim(R.main);for(let i=0;i<=T*24;i++)renderAt(items,R.main,i/24,st.bg,true);const e24=px(items,T,true);
 resetSim(R.main);const sA=px(items,T,true);resetSim(R.main);const sB=px(items,T,true);
 const p1=px(items,T,true),p2=px(items,T,true);
 info.blob={seekRepeat:+diff(sA,sB).toFixed(4),export30_vs_export24:+diff(e30,e24).toFixed(4),export_vs_seek:+diff(e30,sA).toFixed(4),pausedStable:+diff(p1,p2).toFixed(4),
   tracks:[...blobState.values()].filter(B=>B.ctx===R.main).map(B=>B.tracks.length)};
 if(info.blob.seekRepeat>0)bad.push('blob: ugrás nem determinisztikus');
 if(info.blob.export30_vs_export24>0)bad.push('blob: függ az export fps-től');
 if(info.blob.export_vs_seek>0)bad.push('blob: ugrás ≠ export');
 if(info.blob.pausedStable>0)bad.push('blob: szünetben tovább lép / remeg');
 if(!info.blob.tracks.some(n=>n>0))bad.push('blob: nem talált foltot (a teszt üres)');

 // 3) motion blur: static content unchanged, moving content blurred, repeat-stable, monotonic sub-frames with feedback
 const txt=[makeLayer('mtext',{text:{str:'ÁLLÓ'},p:{start:.2,dur:.6}})];
 const sNo=mb(txt,8,0),sMb=mb(txt,8,8);info.mb={staticDiff:+diff(sNo,sMb).toFixed(3)};
 const mov=[makeLayer('shape',{s:.35,x:{v:0,a:.5,f:3}})];
 const mNo=mb(mov,4,0),mMb=mb(mov,4,16,360),mMb2=mb(mov,4,16,360);
 info.mb.movingDiff=+diff(mNo,mMb).toFixed(3);info.mb.repeat=+diff(mMb,mMb2).toFixed(4);
 if(info.mb.staticDiff>0.5)bad.push('MB: álló tartalom megváltozott');
 if(info.mb.movingDiff<0.2)bad.push('MB: mozgó tartalom nem mosódott el');
 if(info.mb.repeat>0)bad.push('MB: ismételt render eltér');
 const fbItems=[makeLayer('plasma',{s:.5}),makeLayer('feedback',{p:{decay:.9}})];
 const seq=()=>{st.layers=fbItems;resetSim(R.main);let resets=0,last=-1;for(let i=0;i<=45;i++){const out=renderMB(R.main,i/30,30,8,270);if(R.main.simT!=null&&R.main.simT<last-1e-9)resets++;last=R.main.simT;}
   present(R.main,renderMB(R.main,1.5,30,8,270).t,null,cv.width,cv.height,1.5);return {px:grab(),resets};};
 const q1=seq(),q2=seq();info.mb.fbRepeat=+diff(q1.px,q2.px).toFixed(4);info.mb.fbBackwards=q1.resets;
 if(info.mb.fbRepeat>0)bad.push('MB + Visszhang: export nem ismételhető');
 if(q1.resets)bad.push('MB részképek visszafelé léptették az órát');

 // 4) Loop button explains itself
 st.loop=false;renderTimeline();const tOff=$('#loopBtn').title;st.loop=true;renderTimeline();const tOn=$('#loopBtn').title;info.loopTitle={off:tOff,on:tOn};
 if(!/ki/.test(tOff)||!/be/.test(tOn)||tOff===tOn)bad.push('a Loop gomb nem mondja meg az állapotát');

 st.layers=[];st.look=look;st.q=saveQ;resizeMain();R.snapping=false;
 return {bad,info};})()
