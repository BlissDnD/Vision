// P2 · Közös útvonal: görbe a pontokon át, ívhossz szerinti egyenletes mintavétel, rajz-egyszerűsítés, kitöltés-háromszögelés;
// az Útvonal réteg minden kinézete renderel, a Kirajzolás/szaggatás/kitöltés hat; a Mozgás „Útvonalon” a réteget a vonalra
// teszi (és követi az útvonal mozgatását), a Részecske Forrás az útvonal mentén bocsát ki; mentés→újranyitás megőrzi.
(()=>{const bad=[],info={};st.layers=[];st.cues=[];st.bg='#000000';
 const px=(t=1)=>{const out=renderScene(st.layers,R.main,t,st.bg);present(R.main,out.t,null,cv.width,cv.height,1);const w=cv.width,h=cv.height,b=new Uint8Array(w*h*4);gl.readPixels(0,0,w,h,gl.RGBA,gl.UNSIGNED_BYTE,b);return b;};
 const lit=b=>{let n=0;for(let i=0;i<b.length;i+=4)if(b[i]+b[i+1]+b[i+2]>60)n++;return n;};
 // pure model
 const P=[[-.5,0],[0,.3],[.5,0]],C=curve(P,false,true,20);
 if(!P.every(p=>C.some(c=>Math.hypot(c[0]-p[0],c[1]-p[1])<1e-6)))bad.push('a görbe nem megy át a pontokon');
 const Q=resample(C,21),d=Q.slice(1).map((q,i)=>Math.hypot(q[0]-Q[i][0],q[1]-Q[i][1]));info.spacing=[+Math.min(...d).toFixed(4),+Math.max(...d).toFixed(4)];
 if(Math.max(...d)/Math.min(...d)>1.08)bad.push('a mintavétel nem egyenletes ívhossz szerint');
 const raw=[];for(let i=0;i<=200;i++){const x=-.5+i/200;raw.push([x,Math.sin(x*6)*.2+(i%2?.001:-.001)]);}const sp=simplify(raw,.006);info.simplify=[raw.length,sp.length];
 if(!(sp.length>=4&&sp.length<=30))bad.push('a rajz-egyszerűsítés pontszáma rossz: '+sp.length);
 const sq=[[0,0],[1,0],[1,1],[.5,.4],[0,1]];const tri=earClip(sq);if(tri.length!==9)bad.push('a kitöltés háromszögelése rossz ('+tri.length/3+')');
 // layer
 const L=makeLayer('pathshape',{pal:1});st.layers=[L];commit();
 const a0=px(1);info.err=gl.getError();info.pathErr=R.pathErr||null;const n0=lit(a0);info.base=n0;if(info.err||info.pathErr)bad.push('GL/shader hiba: '+(info.pathErr||info.err));if(n0<500)bad.push('az útvonal alig látszik ('+n0+')');
 info.looks=[];for(let k=0;k<5;k++){L.p.look.v=k;const n=lit(px(1));info.looks.push(n);if(n<300)bad.push('Kinézet '+k+' nem látszik');}L.p.look.v=1;
 L.p.trimE.v=.5;const nt=lit(px(1));info.trim=[n0,nt];if(!(nt<n0*.7&&nt>n0*.3))bad.push('a Kirajzolás vége nem felezi a vonalat');L.p.trimE.v=1;
 L.p.look.v=0;L.p.dash.v=1;const nd=lit(px(1));L.p.dash.v=0;const nl=lit(px(1));info.dash=[nl,nd];if(!(nd<nl*.8))bad.push('a szaggatás nem hat');
 L.p.closed.v=1;L.p.fill.v=1;const nf=lit(px(1));info.fill=nf;if(!(nf>nl*3))bad.push('a zárt kitöltés nem tölt ki');L.p.closed.v=0;L.p.fill.v=0;L.p.look.v=1;
 L.p.wave.v=.05;if(lit(px(1))<300)bad.push('hullámzással eltűnik');const w1=px(1),w2=px(1.5);let dw=0;for(let i=0;i<w1.length;i+=4)dw+=Math.abs(w1[i]-w2[i]);if(dw<1000)bad.push('a hullámzás nem mozog');L.p.wave.v=0;
 const k0=insertPt(L,[0,0]);if(L.pts.length!==5||k0<1||k0>3)bad.push('pont beszúrása rossz helyre ('+k0+')');L.pts.splice(k0,1);
 // motion along the path
 const B=makeLayer('shape',{pal:5,p:{kind:0,size:.05}});const m=makeMo('path',{period:4});m.path=L.id;B.mo=[m];st.layers=[L,B];
 const W=pathAt(L.id,1,.25),pB=placeAt(B,1);info.onPath=[+(pB[0]-W.x).toFixed(4),+(pB[1]-W.y).toFixed(4)];if(Math.hypot(pB[0]-W.x,pB[1]-W.y)>1e-3)bad.push('Útvonalon: a réteg nincs a vonalon');
 m.p.orient.v=1;const pr=placeAt(B,1);if(Math.abs(pr[3]+W.ang*180/Math.PI)>.5)bad.push('Irányba fordul: rossz szög');
 setKey(L.n.x,0,0);L.n.x.k=[];L.n.x.v=.2;const W2=pathAt(L.id,1,.25),pB2=placeAt(B,1);if(Math.abs(W2.x-W.x-.2)>1e-3||Math.hypot(pB2[0]-W2.x,pB2[1]-W2.y)>1e-3)bad.push('az útvonal mozgatását nem követi');L.n.x.v=0;
 m.p.loop.v=2;const e1=placeAt(B,9);const end=pathAt(L.id,9,1);if(Math.hypot(e1[0]-end.x,e1[1]-end.y)>1e-3)bad.push('Egyszer: nem áll meg a végén');m.p.loop.v=0;
 // emitter on the path
 const E=makeLayer('emitter',{pal:1,p:{shape:6,speed:0,grav:0,turb:0,rate:1500,size:4}});st.layers=[E];const e0=lit(px(2));E.path=L.id;st.layers=[L,E];L.vis=false;const eP=lit(px(2));info.emit=[e0,eP];
 if(e0>5)bad.push('útvonal nélkül is kibocsát');if(eP<300)bad.push('az útvonal mentén nem bocsát ki');L.vis=true;
 // save → reopen
 st.layers=[L,B,E];L.pts=[[-.4,-.1],[0,.2],[.4,-.1]];commit();const snap=snapshot();loadProject(JSON.parse(projectJSON()));if(snapshot()!==snap)bad.push('újranyitás: eltérés');
 const L2=st.layers[0],B2=st.layers[1],E2=st.layers[2];if(!L2||L2.pts.length!==3||!B2.mo||B2.mo[0].path!==L2.id||E2.path!==L2.id)bad.push('újranyitás: pontok/hivatkozások elvesztek');
 const lib=LIB.shapes.filter(x=>!x.head&&x.make().type==='pathshape');info.lib=lib.length;for(const e of lib){st.layers=[e.make()];if(lit(px(2))<100)bad.push('könyvtári elem üres: '+e.name);}
 st.layers=[];commit();
 return {bad,info};})()
