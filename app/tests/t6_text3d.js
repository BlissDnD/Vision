// T6 · Szöveg 3D: a hengeren/gömbön futó, a kihúzott és az útvonalas szöveg renderel, a szöveg átírása megváltoztatja a képet
// (élő szöveg), a forgás időben halad és seek-determinisztikus, a kihúzás mélysége hat, a betűk az útvonalon állnak és úsznak,
// mentés→újranyitás megőrzi.
(()=>{const bad=[],info={};st.layers=[];st.bg='#000000';st.cam=normCam(null);
 const px=(t=1)=>{const out=renderScene(st.layers,R.main,t,st.bg);present(R.main,out.t,null,cv.width,cv.height,1);const w=cv.width,h=cv.height,b=new Uint8Array(w*h*4);gl.readPixels(0,0,w,h,gl.RGBA,gl.UNSIGNED_BYTE,b);return b;};
 const lit=b=>{let n=0;for(let i=0;i<b.length;i+=4)if(b[i]+b[i+1]+b[i+2]>60)n++;return n;};
 const diff=(a,b)=>{let s=0;for(let i=0;i<a.length;i+=4)s+=Math.abs(a[i]-b[i])+Math.abs(a[i+1]-b[i+1])+Math.abs(a[i+2]-b[i+2]);return s/(a.length/4*3);};
 const W=makeLayer('textwrap');st.layers=[W];
 for(const k of ['textwrap','textextrude']){const L=makeLayer(k);getProg(L);const e=progError(L);if(e)bad.push(k+' shader: '+e.slice(0,200));}
 const a=px(1);info.wrap=lit(a);if(info.wrap<400)bad.push('Szöveg hengeren alig látszik ('+info.wrap+')');
 if(diff(a,px(2))<.3)bad.push('a henger nem forog');px(3);if(diff(a,px(1))>.01)bad.push('seek után más kép');
 W.text.str='X';const ax=px(1);info.edit=+diff(a,ax).toFixed(2);if(diff(a,ax)<.3)bad.push('a szöveg átírása nem látszik');W.text.str='VEL · ÉLŐ SZÖVEG · ';
 W.p.shape.v=0;const s0=lit(px(1));W.p.body.v=1;const s1=lit(px(1));info.sphere=[s0,s1];if(s0<300)bad.push('gömbön alig látszik');if(!(s1>s0*1.5))bad.push('a Tömör test nem tölt ki');
 W.p.shape.v=2;W.p.body.v=0;if(lit(px(1))<200)bad.push('szalaggyűrű alig látszik');W.p.shape.v=1;
 W.p.back.v=0;const b0=lit(px(1));W.p.back.v=1;const b1=lit(px(1));info.back=[b0,b1];if(!(b1>b0))bad.push('a túloldal láthatósága nem hat');
 const X=makeLayer('textextrude',{text:{str:'VEL'}});st.layers=[X];X.p.depth.v=0;X.p.ry.v=-35;const e0=px(1);X.p.depth.v=.3;const e1=px(1);info.extrude=[lit(e0),lit(e1)];
 if(lit(e0)<300)bad.push('kihúzott szöveg alig látszik');if(!(lit(e1)>lit(e0)*1.1))bad.push('a mélység nem növeli az oldalfalat');
 // side colour visible when deep and turned
 let side=0;const c2=hexRGB(X.p.c2.v).map(v=>v*255);for(let i=0;i<e1.length;i+=4){if(e1[i]>20&&Math.abs(e1[i+1]/Math.max(e1[i],1)-c2[1]/c2[0])<.15&&e1[i]<200)side++;}info.side=side;if(side<50)bad.push('nem látszik az oldalfal színe');
 const T=makeLayer('textpath',{text:{str:'ABC DEF'}});st.layers=[T];const g0=glyphsAt(T,0);info.glyphs=g0.length;if(g0.length!==6)bad.push('betűszám az úton: '+g0.length);
 if(lit(px(0))<100)bad.push('útvonalas szöveg nem látszik');
 const Pth=makeLayer('pathshape');T.path=Pth.id;st.layers=[Pth,T];const g1=glyphsAt(T,0);const q=sampleArc(pathWorld(Pth,0).poly,pathWorld(Pth,0).A,.5);
 const dmin=Math.min(...g1.map(g=>Math.hypot(g.x-q.x,g.y-q.y)));info.onPath=+dmin.toFixed(3);if(!(dmin<.1))bad.push('a betűk nincsenek az útvonalon');
 T.p.speed.v=.2;const g2=glyphsAt(T,1);if(Math.hypot(g2[0].x-g1[0].x,g2[0].y-g1[0].y)<.01)bad.push('az Úszás nem mozgatja a betűket');
 T.p.upright.v=1;if(glyphsAt(T,1).some(g=>g.ang!==0))bad.push('Egyenesen áll: mégis fordul');
 st.layers=[W,X,Pth,T];commit();const snap=snapshot();loadProject(JSON.parse(projectJSON()));if(snapshot()!==snap)bad.push('újranyitás: eltérés');
 const T2=st.layers[3];if(!T2||T2.type!=='textpath'||T2.path!==st.layers[2].id||T2.text.str!=='ABC DEF')bad.push('újranyitás: szöveg/útvonal elveszett');
 const lib=LIB.media.filter(x=>!x.head&&!x.polyhaven&&!x.lottie).map(x=>x.make()).filter(L=>['textwrap','textextrude','textpath'].includes(L.type));info.lib=lib.length;
 for(const L of lib){st.layers=[L];if(lit(px(1))<100)bad.push('könyvtári elem üres: '+L.name);}
 st.layers=[];commit();
 return {bad,info};})()
