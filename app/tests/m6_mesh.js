// M6 · mesh-alapú 3D réteg (Gerincfelület): renderel GL-hiba nélkül, a forma paraméterei a geometriát változtatják,
// a geometria gyorsítótárazott, a kamera animálható, mentés→újranyitás megőrzi a gerincet.
(()=>{const bad=[],info={};st.layers=[];
 const L=makeLayer('surface3d');st.layers=[L];commit();
 const px=()=>{const out=renderScene(st.layers,R.main,1,st.bg);present(R.main,out.t,null,cv.width,cv.height,1);const w=cv.width,h=cv.height,b=new Uint8Array(w*h*4);gl.readPixels(0,0,w,h,gl.RGBA,gl.UNSIGNED_BYTE,b);return b;};
 const diff=(a,b)=>{let s=0;for(let i=0;i<a.length;i+=4)s+=Math.abs(a[i]-b[i])+Math.abs(a[i+1]-b[i+1])+Math.abs(a[i+2]-b[i+2]);return s/(a.length/4*3);};
 const a=px();info.err=gl.getError();info.meshErr=R.meshErr||null;info.tris=R.meshTris;
 if(info.err||info.meshErr)bad.push('GL/shader hiba: '+(info.meshErr||info.err));if(!(R.meshTris>10000))bad.push('kevés háromszög');
 let lit=0;for(let i=0;i<a.length;i+=4)if(a[i]>a[i+1]+30)lit++;info.redPx=lit;if(lit<a.length/4*0.05)bad.push('alig van vörös pixel');
 const M1=meshFor(L,1,EFFECTS.surface3d),M2=meshFor(L,1,EFFECTS.surface3d);if(M1.key!==M2.key)bad.push('gyorsítótár');
 L.p.width.v=10;const b=px();info.widthDiff=+diff(a,b).toFixed(2);if(info.widthDiff<1)bad.push('a szélesség nem hat');
 L.p.width.v=7;setKey(L.p.ry,0,-30);setKey(L.p.ry,2,20);const c0=camOf(L,0,EFFECTS.surface3d,16/9).eye,c2=camOf(L,2,EFFECTS.surface3d,16/9).eye;
 info.cam=[c0.map(v=>+v.toFixed(2)),c2.map(v=>+v.toFixed(2))];if(Math.abs(c0[0]-c2[0])<.5)bad.push('a kamera nem animálható');
 L.p.floor.v=0;L.p.bg.v=0;px();if(gl.getError())bad.push('padló/háttér nélkül GL hiba');L.p.floor.v=1;L.p.bg.v=1;
 L.spine[3][1]=-.6;commit();const s1=snapshot();loadProject(JSON.parse(projectJSON()));
 if(snapshot()!==s1||st.layers[0].spine[3][1]!==-.6)bad.push('újranyitás: gerinc');
 st.layers=[];commit();
 return {bad,info};})()
