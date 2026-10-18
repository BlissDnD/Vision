// E1 · Részecske Forrás: renderel hibamentesen, determinisztikus (seek), a Mennyiség/Gravitáció/Szél/Padló hat,
// löket és jelzés időzít, az Előmelegítés kikapcsolva üresből indul, a mozgatott emitter csóvát húz, a kép alakjából
// is kibocsát, minden Kinézet fordul, mentés→újranyitás megőrzi.
(()=>{const bad=[],info={};st.layers=[];st.cues=[];st.bg='#000000';
 const L=makeLayer('emitter',{pal:1});st.layers=[L];commit();
 const px=(t=1)=>{const out=renderScene(st.layers,R.main,t,st.bg);present(R.main,out.t,null,cv.width,cv.height,1);const w=cv.width,h=cv.height,b=new Uint8Array(w*h*4);gl.readPixels(0,0,w,h,gl.RGBA,gl.UNSIGNED_BYTE,b);return b;};
 const st2=b=>{const w=cv.width;let n=0,sx=0,sy=0,x0=1e9,x1=-1,y0=1e9;for(let i=0;i<b.length;i+=4){if(b[i]+b[i+1]+b[i+2]>60){const p=i/4,x=p%w,y=(p/w)|0;n++;sx+=x;sy+=y;if(x<x0)x0=x;if(x>x1)x1=x;if(y<y0)y0=y;}}
   return {n,cx:n?sx/n/w:0,cy:n?sy/n/cv.height:0,wx:n?(x1-x0)/w:0,ymin:n?y0/cv.height:1};};
 const diff=(a,b)=>{let s=0;for(let i=0;i<a.length;i+=4)s+=Math.abs(a[i]-b[i])+Math.abs(a[i+1]-b[i+1])+Math.abs(a[i+2]-b[i+2]);return s/(a.length/4*3);};
 const a=px(2);info.err=gl.getError();info.emErr=R.emErr||null;const s0=st2(a);info.base=s0;info.N=R.emN;
 if(info.err||info.emErr)bad.push('GL/shader hiba: '+(info.emErr||info.err));if(s0.n<150)bad.push('alig látszik részecske ('+s0.n+')');
 px(3.3);const a2=px(2);info.seek=+diff(a,a2).toFixed(3);if(info.seek>0.01)bad.push('seek után más kép');
 if(diff(px(2),px(2.4))<0.05)bad.push('nem mozog az időben');
 L.p.rate.v=0;const r0=st2(px(2)).n;L.p.rate.v=1200;const r1=st2(px(2)).n;L.p.rate.v=300;info.rate=[r0,s0.n,r1];
 if(r0>5)bad.push('Mennyiség 0 mellett is van részecske');if(!(r1>s0.n*1.5))bad.push('a Mennyiség nem növeli a részecskéket');
 L.p.grav.v=0;L.p.spread.v=20;const g0=st2(px(2));L.p.grav.v=3;const g1=st2(px(2));info.grav=[+g0.cy.toFixed(3),+g1.cy.toFixed(3)];
 if(!(g1.cy<g0.cy-0.05))bad.push('a gravitáció nem húzza le a részecskéket');
 L.p.grav.v=0;L.p.wind.v=2;const w1=st2(px(2));info.wind=[+g0.cx.toFixed(3),+w1.cx.toFixed(3)];if(!(w1.cx>g0.cx+0.04))bad.push('a szél nem sodorja jobbra');L.p.wind.v=0;
 L.p.grav.v=3;L.p.floor.v=1;L.p.fy.v=-.2;L.p.turb.v=0;const f1=st2(px(2.5));info.floor={ymin:+f1.ymin.toFixed(3),n:f1.n};
 if(f1.ymin<0.3-0.03)bad.push('a padló alá esnek ('+f1.ymin.toFixed(3)+')');if(f1.n<50)bad.push('padlóval eltűnnek a részecskék');
 L.p.floor.v=0;L.p.grav.v=.6;L.p.turb.v=.2;L.p.spread.v=30;
 L.p.mode.v=1;L.p.every.v=1.5;L.p.life.v=.5;L.p.lifevar.v=0;const b1=st2(px(1.6)).n,b2=st2(px(2.6)).n;info.burst=[b1,b2];
 if(b1<100)bad.push('a löket nem bocsát ki');if(b2>5)bad.push('löket után is maradnak (élettartamon túl)');
 L.p.mode.v=2;st.cues=[{t:1}];const c1=st2(px(.9)).n,c2=st2(px(1.2)).n;info.cue=[c1,c2];if(c1>5)bad.push('jelzés előtt is van');if(c2<100)bad.push('a jelzés nem indít löketet');
 st.cues=[];L.p.mode.v=0;L.p.life.v=2.5;L.p.lifevar.v=.4;
 L.p.warm.v=1;const pw0=st2(px(.1)).n;L.p.warm.v=0;const pw1=st2(px(.1)).n;info.prewarm=[pw0,pw1];if(!(pw0*3<pw1))bad.push('az Előmelegítés kikapcsolása nem üresből indít');
 L.p.spread.v=10;L.p.speed.v=.05;L.p.grav.v=0;L.p.turb.v=0;const tr0=st2(px(2)).wx;setKey(L.n.x,0,-.6);setKey(L.n.x,2,.6);const tr1=st2(px(2)).wx;info.trail=[+tr0.toFixed(3),+tr1.toFixed(3)];
 if(!(tr1>tr0+0.25))bad.push('a mozgatott emitter nem húz csóvát');L.n.x.k=[];L.n.x.v=0;L.p.speed.v=.6;L.p.grav.v=.6;L.p.spread.v=30;
 const T=makeLayer('text',{pal:8});st.layers=[T,L];L.p.shape.v=5;L.p.speed.v=0;L.p.grav.v=0;L.p.turb.v=0;L.p.rate.v=2000;const sh1=st2(px(2));
 st.layers=[L];const sh0=st2(px(2)).n;info.shape5=[sh1.n,sh0];if(sh1.n<200)bad.push('a kép alakjából nem bocsát ki');if(sh0>5)bad.push('üres kép alakjából is kibocsát');
 st.layers=[L];L.p.shape.v=0;L.p.rate.v=300;L.p.speed.v=.6;L.p.grav.v=.6;
 info.looks=[];for(let k=0;k<7;k++){L.p.look.v=k;const n=st2(px(2)).n;info.looks.push(n);if(gl.getError()||R.emErr)bad.push('Kinézet '+k+' hiba');if(n<30)bad.push('Kinézet '+k+' nem látszik');}L.p.look.v=0;
 for(let k=0;k<5;k++){L.p.shape.v=k;if(st2(px(2)).n<50)bad.push('Alak '+k+' nem látszik');}L.p.shape.v=0;
 setKey(L.p.rate,0,100);setKey(L.p.rate,3,900);commit();const snap=snapshot();loadProject(JSON.parse(projectJSON()));if(snapshot()!==snap)bad.push('újranyitás: eltérés');
 const L2=st.layers[0];if(!L2||L2.type!=='emitter'||L2.p.rate.k.length!==2)bad.push('újranyitás: réteg/kulcsok');
 const lib=LIB.particles.filter(x=>!x.head&&x.make().type==='emitter');info.lib=lib.length;
 for(const e of lib){st.layers=[makeLayer('text'),e.make()];if(st.layers[1].p.shape.v!==5)st.layers=[st.layers[1]];const n=Math.max(...[1,2,3].map(t=>st2(px(t)).n));if(n<30)bad.push('könyvtári elem üres: '+e.name+' ('+n+')');}
 st.layers=[];commit();
 return {bad,info};})()
