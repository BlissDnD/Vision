// M7b · Felhő + Lufi: a Felhő önálló, puha tárgy (lefordul, látszik, átlátszó háttér körülötte), alak/sűrűség/gomolygás hat;
// a Lufi Megjelenés ugyanabból az alakból felfújt, fényes testet csinál (csak Felhőn hat, máshol nem kerül rá);
// a Jelenetfény és a csillanás-húzás hat rá; ugrás = ugyanaz a kép; álló lufi időben nem változik; mentés → újranyitás.
(()=>{const bad=[],info={};st.layers=[];const light0=st.light;st.light=normLight(null);
 const C=makeLayer('cloud3d');st.layers=[C];R.selId=C.id;commit();renderInsp();
 const px=t=>{const out=renderScene(st.layers,R.main,t,'#000000');present(R.main,out.t,null,cv.width,cv.height,t);const w=cv.width,h=cv.height,b=new Uint8Array(w*h*4);gl.readPixels(0,0,w,h,gl.RGBA,gl.UNSIGNED_BYTE,b);return b;};
 const diff=(a,b)=>{let s=0;for(let i=0;i<a.length;i+=4)s+=Math.abs(a[i]-b[i])+Math.abs(a[i+1]-b[i+1])+Math.abs(a[i+2]-b[i+2]);return s/(a.length/4*3);};
 const cover=b=>{let n=0;for(let i=0;i<b.length;i+=4)if(b[i]+b[i+1]+b[i+2]>45)n++;return n/(b.length/4);};
 const redness=b=>{let s=0,n=0;for(let i=0;i<b.length;i+=4)if(b[i]+b[i+1]+b[i+2]>45){s+=b[i]-(b[i+1]+b[i+2])/2;n++;}return n?s/n:0;};
 const a=px(1);if(progError(C))bad.push('Felhő shader: '+String(progError(C)).slice(0,300));
 info.cover=+cover(a).toFixed(3);if(!(info.cover>.05&&info.cover<.6))bad.push('a felhő nem önálló tárgy (lefedettség '+info.cover+')');
 const corner=a[0]+a[1]+a[2];if(corner>0)bad.push('a sarok nem üres');
 // alak, sűrűség, gomolygás
 C.p.shape.v=2;const tw=px(1);info.shape=+diff(a,tw).toFixed(2);if(info.shape<1)bad.push('az alak nem hat');C.p.shape.v=0;
 C.p.dens.v=.3;const th=px(1);info.dens=[+cover(th).toFixed(3),info.cover];if(!(diff(a,th)>.5))bad.push('a sűrűség nem hat');C.p.dens.v=1.2;
 const m1=px(3);info.billow=+diff(a,m1).toFixed(2);if(info.billow<.2)bad.push('a gomolygás nem mozog');
 C.p.billow.v=0;const s1=px(1),s2=px(3);if(diff(s1,s2)>0)bad.push('gomolygás ki: mégis mozog');C.p.billow.v=1;
 // ugrás: ugyanaz a kép
 const j1=px(2.5);px(.4);px(6);const j2=px(2.5);if(diff(j1,j2)>0)bad.push('ugrás: nem ismételhető');
 // Lufi csak Felhőre kerül
 const T=makeLayer('text');st.layers=[T,C];const iL=LIB.fx.findIndex(x=>x.make().type==='balloon');if(iL<0)bad.push('nincs Lufi a Megjelenések között');
 attachFx('fx',iL,T.id);if(T.fx.length)bad.push('a Lufi szövegre is rákerült');
 if(fxFits('balloon',T)||!fxFits('balloon',C)||!fxFits('blur',T))bad.push('célkompatibilitás');
 attachFx('fx',iL,C.id);const B=C.fx[0];if(!B||B.type!=='balloon')bad.push('a Lufi nem került a Felhőre');st.layers=[C];
 if(B){C.p.billow.v=0;B.vis=false;const cl=px(1);B.vis=true;B.p.infl.v=1;const bl=px(1);info.balloon=[+diff(cl,bl).toFixed(2),+redness(cl).toFixed(1),+redness(bl).toFixed(1),+cover(bl).toFixed(3)];
  if(progError(C))bad.push('Lufi shader');
  if(!(redness(bl)>redness(cl)+25))bad.push('a lufi nem a saját színét kapta');
  if(!(cover(bl)>info.cover*.6&&cover(bl)<info.cover*1.8))bad.push('a lufi nem ugyanabból az alakból van');
  B.p.infl.v=0;const z=px(1);if(diff(z,cl)>.5)bad.push('Felfújtság 0: nem a felhő');B.p.infl.v=1;
  B.vis=false;const off=px(1);if(diff(off,cl)>.5)bad.push('kikapcsolt Lufi is hat');B.vis=true;
  const b1=px(1),b2=px(4);if(diff(b1,b2)>0)bad.push('álló lufi: időben változik');
  B.p.gloss.v=0;const mat=px(1);info.gloss=+diff(mat,b1).toFixed(2);if(info.gloss<.3)bad.push('a fényesség nem hat');B.p.gloss.v=.75;
  // Jelenetfény + csillanás-húzás a lufin
  st.light.p.az.v=60;const l1=px(1);info.light=+diff(l1,b1).toFixed(2);if(info.light<.5)bad.push('a Jelenetfény nem hat a lufira');st.light.p.az.v=-39.81;
  const {W,H}=outSize(),P={x:-.1,y:.08},X=Math.round((P.x/(W/H)+.5)*cv.width),Y=Math.round((P.y+.5)*cv.height);
  const lum=()=>{px(1);const q=new Uint8Array(4);gl.readPixels(X,Y,1,1,gl.RGBA,gl.UNSIGNED_BYTE,q);return q[0]+q[1]+q[2];};
  st.light.p.az.v=140;st.light.p.el.v=-5;const g0=lum();glint3(C,P);const g1=lum();info.glint=[g0,g1];if(!(g1>g0+30))bad.push('csillanás-húzás a lufin');
  st.light.p.az.v=-39.81;st.light.p.el.v=45.58;}
 R.selId=C.id;renderInsp();const tx=document.querySelector('#insp').textContent;if(!tx.includes('Jelenetfény'))bad.push('nincs Jelenetfény szekció');if(!tx.includes('Lufi'))bad.push('a Lufi nem látszik a láncban');
 // mentés → újranyitás, könyvtár
 setKey(B.p.infl,0,0);setKey(B.p.infl,2,1);commit();const snap=snapshot();const r0=px(1.3);loadProject(JSON.parse(projectJSON()));
 if(snapshot()!==snap)bad.push('újranyitás: állapot');const r1=px(1.3);if(diff(r0,r1)>0)bad.push('újranyitás: más kép');
 for(const n of ['Felhő','Lufi-felhő']){const it=LIB['3d'].find(x=>x.name===n);if(!it)bad.push('nincs könyvtári elem: '+n);else{st.layers=[it.make()];px(1);if(progError(st.layers[0]))bad.push('könyvtár shader: '+n);}}
 if(gl.getError())bad.push('GL hiba');
 st.layers=[];st.light=light0;commit();
 return {bad,info};})()
