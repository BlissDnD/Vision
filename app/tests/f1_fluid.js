// F1 · Folyadékmező: az Áramló tinta GL-hiba nélkül renderel és idővel változik, ugrás után ugyanaz a kép (seek = újraszimulálás),
// a három minőség fordul, a Folyadékos torzítás csak a saját rétegét mozdítja el, a Feltárás maszkol, bélyegkép van, mentés→újranyitás.
(()=>{const bad=[],info={};st.layers=[];
 const px=t=>{const out=renderAt(st.layers,R.main,t,st.bg,true);present(R.main,out.t,null,cv.width,cv.height,t);const w=cv.width,h=cv.height,b=new Uint8Array(w*h*4);gl.readPixels(0,0,w,h,gl.RGBA,gl.UNSIGNED_BYTE,b);return b;};
 const W=()=>cv.width,Hh=()=>cv.height;
 const diff=(a,b,x0=0,x1=1)=>{const w=W();let s=0,n=0;for(let i=0;i<a.length;i+=4){const x=(i/4)%w/w;if(x<x0||x>=x1)continue;s+=Math.abs(a[i]-b[i])+Math.abs(a[i+1]-b[i+1])+Math.abs(a[i+2]-b[i+2]);n++;}return s/(n*3);};
 const lit=a=>{let n=0;for(let i=0;i<a.length;i+=4)if(a[i]+a[i+1]+a[i+2]>60)n++;return n/(a.length/4);};
 // 1) source: renders, has ink, changes over time
 const L=makeLayer('fluid');st.layers=[L];commit();R.main.simT=null;
 const a1=px(1),a2=px(2.5);info.err=gl.getError();if(info.err)bad.push('GL-hiba: '+info.err);
 info.lit=[+lit(a1).toFixed(3),+lit(a2).toFixed(3)];if(info.lit[1]<0.03)bad.push('alig van tinta a vásznon');
 info.timeDiff=+diff(a1,a2).toFixed(2);if(info.timeDiff<1)bad.push('az idővel nem változik');
 // 2) seek: the same request sequence gives the same pixels; jumping back = re-simulation from the same start
 const b2=px(2.5);info.seekBack=+diff(a2,b2).toFixed(3);if(info.seekBack>0.01)bad.push('visszaugrás után más kép');
 R.main.simT=null;const c5=px(5);px(6.2);const c5b=px(5);info.seek5=+diff(c5,c5b).toFixed(3);if(info.seek5>0.01)bad.push('ugrás (t=5) után más kép');
 // curl actually matters (the solver is live, not a static blob)
 L.p.curl.v=3;R.main.simT=null;const cu=px(2.5);info.curlDiff=+diff(a2,cu).toFixed(2);if(info.curlDiff<0.5)bad.push('az Örvénylés nem hat');L.p.curl.v=1;
 for(const q of [0,2]){L.p.qual.v=q;R.main.simT=null;const x=px(1.5);if(gl.getError())bad.push('minőség '+q+': GL-hiba');if(lit(x)<0.02)bad.push('minőség '+q+': üres');}L.p.qual.v=1;
 // 3) appearance: only its own layer moves
 const A=makeLayer('shape',{pal:5,x:-.35,p:{kind:2,size:.32,round:.1}}),B=makeLayer('shape',{pal:3,x:.62,p:{kind:0,size:.14}});
 const F=makeLayer('fluidfx',{p:{amount:0,count:6,spread:.5,force:2}});A.fx.push(F);st.layers=[A,B];commit();
 R.main.simT=null;const d0=px(2);F.p.amount.v=3;R.main.simT=null;const d1=px(2);
 info.warpLeft=+diff(d0,d1,0,.55).toFixed(2);info.warpRight=+diff(d0,d1,.72,1).toFixed(3);
 if(info.warpLeft<0.5)bad.push('a torzítás nem mozdítja el a réteget');if(info.warpRight>0.05)bad.push('a torzítás a másik rétegre is hat');
 F.p.mode.v=1;R.main.simT=null;const m1=px(2);info.reveal=[+lit(d1).toFixed(3),+lit(m1).toFixed(3)];if(!(info.reveal[1]<info.reveal[0]*0.9))bad.push('a Feltárás nem maszkol');
 info.revealRight=+diff(d1,m1,.72,1).toFixed(3);if(info.revealRight>0.05)bad.push('a Feltárás a másik rétegre is hat');
 // 4) thumbnail shows ink
 const th=thumbOf(makeLayer('fluid',{pal:1}));const tb=th.getContext('2d').getImageData(0,0,th.width,th.height).data;info.thumbLit=+lit(tb).toFixed(3);if(info.thumbLit<0.03)bad.push('üres bélyegkép');
 // 5) save → reopen
 st.layers=[L,A,B];setKey(L.p.force,0,.5);setKey(L.p.force,3,2);commit();const snap=snapshot();loadProject(JSON.parse(projectJSON()));if(snapshot()!==snap)bad.push('újranyitás: eltérés');
 const L2=st.layers[0],A2=st.layers[1];if(!L2||L2.type!=='fluid'||L2.p.force.k.length!==2)bad.push('újranyitás: tinta réteg/kulcsok');if(!A2||!A2.fx[0]||A2.fx[0].type!=='fluidfx'||A2.fx[0].p.mode.v!==1)bad.push('újranyitás: torzítás');
 R.main.simT=null;px(1);if(gl.getError())bad.push('újranyitás után GL-hiba');
 st.layers=[];commit();R.main.simT=null;
 return {bad,info};})()
