// M6 · Jelenetfény a 3D tárgyakon (obj3d, sdfscene): alapértéken bitre a régi kép, az irány/lágyság/melegség hat,
// rétegenként és globálisan kikapcsolható, csillanás-húzás a pont alá teszi a csúcsfényt, mentés→újranyitás megőrzi.
(()=>{const bad=[],info={};st.layers=[];st.light=normLight(null);
 const L=makeLayer('obj3d');L.p.floor.v=.8;st.layers=[L];R.selId=L.id;commit();renderInsp();
 const px=()=>{const out=renderScene(st.layers,R.main,1,st.bg);present(R.main,out.t,null,cv.width,cv.height,1);const w=cv.width,h=cv.height,b=new Uint8Array(w*h*4);gl.readPixels(0,0,w,h,gl.RGBA,gl.UNSIGNED_BYTE,b);return b;};
 const diff=(a,b)=>{let s=0;for(let i=0;i<a.length;i+=4)s+=Math.abs(a[i]-b[i])+Math.abs(a[i+1]-b[i+1])+Math.abs(a[i+2]-b[i+2]);return s/(a.length/4*3);};
 const rb=b=>{let s=0,n=0;for(let i=0;i<b.length;i+=4)if(b[i]+b[i+1]+b[i+2]>60){s+=b[i]-b[i+2];n++;}return n?s/n:0;};
 const a=px();st.light.on=false;const off=px();info.defVsOff=+diff(a,off).toFixed(3);if(info.defVsOff>0)bad.push('alapérték nem azonos a régi fénnyel');st.light.on=true;
 st.light.p.az.v=60;const b=px();info.az=+diff(a,b).toFixed(2);if(info.az<.5)bad.push('az irány nem hat');
 L.p.sceneL.v=0;const c=px();if(diff(c,a)>0)bad.push('rétegenként kikapcsolva is hat');L.p.sceneL.v=1;st.light.p.az.v=-39.81;
 st.light.p.soft.v=1;const d=px();info.soft=+diff(a,d).toFixed(2);if(info.soft<.05)bad.push('a lágyság nem hat');st.light.p.soft.v=.5;
 st.light.p.warm.v=1;const w1=px();st.light.p.warm.v=-1;const w0=px();info.warm=[+rb(w0).toFixed(1),+rb(w1).toFixed(1)];if(!(rb(w1)>rb(w0)+2))bad.push('melegség nem melegít');st.light.p.warm.v=0;
 const g0=lightFromGlint(0,0,.4,0,0);if(Math.abs(g0.az)>.1||Math.abs(g0.el)>.1)bad.push('középre kattintás: szemből');
 const g1=lightFromGlint(0,0,.4,-.15,.15);info.g1=g1;if(!(g1.az<-10&&g1.el>10))bad.push('bal-fent kattintás irány');
 // csillanás-húzás valódi renderen: a pont fényesebb lesz, mint ellentétes fénynél
 L.p.material.v=4;const {W,H}=outSize(),P={x:-.12,y:.12},X=Math.round((P.x/(W/H)+.5)*cv.width),Y=Math.round((P.y+.5)*cv.height);
 const lum=()=>{const out=renderScene(st.layers,R.main,1,st.bg);present(R.main,out.t,null,cv.width,cv.height,1);const q=new Uint8Array(4);gl.readPixels(X,Y,1,1,gl.RGBA,gl.UNSIGNED_BYTE,q);return q[0]+q[1]+q[2];};
 st.light.p.az.v=140;st.light.p.el.v=-5;const l0=lum();glint3(L,P);const l1=lum();info.glint=[l0,l1,st.light.p.az.v,st.light.p.el.v];if(!(l1>l0+30))bad.push('csillanás-húzás: nem lett fényesebb');
 const S=makeLayer('sdfscene');st.layers=[S];st.light.p.az.v=50;const s1=px();st.light.p.az.v=-39.81;st.light.p.el.v=45.58;const s0=px();info.sdf=+diff(s0,s1).toFixed(2);if(info.sdf<.3)bad.push('3D jelenetre nem hat');
 if(gl.getError())bad.push('GL hiba');
 st.layers=[L];R.selId=L.id;renderInsp();if(!document.querySelector('#insp').textContent.includes('Jelenetfény'))bad.push('nincs Jelenetfény szekció');
 setKey(st.light.p.az,0,-30);setKey(st.light.p.az,2,40);commit();const snap=snapshot();loadProject(JSON.parse(projectJSON()));
 if(snapshot()!==snap||!(st.light.p.az.k&&st.light.p.az.k.length===2))bad.push('újranyitás: fény');
 const old=JSON.parse(projectJSON());delete old.state.light;loadProject(old);if(!st.light||!st.light.on||st.light.p.az.v!==-39.81)bad.push('régi projekt: alapfény');
 st.layers=[];st.light=normLight(null);commit();
 return {bad,info};})()
