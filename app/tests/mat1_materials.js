// MAT1 · 3D anyag-interfész: a Rajzolt toll és a Hologram host-Megjelenés a 3D objektumon, 3D jeleneten és Gerincfelületen
// lefordul és hat; máshová nem kerül; a satírozás a sötét oldalon sűrűbb; papír háttér ki/be; Erősség fokozatos;
// a Hologram áttetsző, a pereme világosabb, a Gerincfelület stúdiója eltűnik alóla; levétel után ugyanaz a kép;
// élő vonal ki = álló kép; mentés → újranyitás; könyvtári elemek.
(()=>{const bad=[],info={};st.layers=[];const light0=st.light,look0=st.look;st.light=normLight(null);st.look=mkLook('Nyers');   // no grain: pixels compare cleanly
 const px=t=>{const out=renderScene(st.layers,R.main,t,'#000000');present(R.main,out.t,null,cv.width,cv.height,t);const w=cv.width,h=cv.height,b=new Uint8Array(w*h*4);gl.readPixels(0,0,w,h,gl.RGBA,gl.UNSIGNED_BYTE,b);return b;};
 const diff=(a,b)=>{let s=0;for(let i=0;i<a.length;i+=4)s+=Math.abs(a[i]-b[i])+Math.abs(a[i+1]-b[i+1])+Math.abs(a[i+2]-b[i+2]);return s/(a.length/4*3);};
 const W=cv.width,H=cv.height,at=(b,x,y)=>{const i=(Math.round(y)*W+Math.round(x))*4;return [b[i],b[i+1],b[i+2]];},lum=c=>c[0]+c[1]+c[2];
 const patch=(b,cx,cy,r)=>{let n=0,dk=0,s=0;for(let y=cy-r;y<=cy+r;y++)for(let x=cx-r;x<=cx+r;x++){const l=lum(at(b,x,y));s+=l;n++;if(l<330)dk++;}return {ink:dk/n,mean:s/n};};
 const iS=LIB.fx.findIndex(x=>x.make().type==='inksketch'),iH=LIB.fx.findIndex(x=>x.make().type==='hologram');
 if(iS<0||iH<0)bad.push('nincs Rajzolt toll / Hologram a Megjelenések között');
 // célkompatibilitás
 const T=makeLayer('text'),O=makeLayer('obj3d',{p:{shape:0,spin:0,rx:0,ry:0,displace:0}});st.layers=[T,O];
 attachFx('fx',iS,T.id);if(T.fx.length)bad.push('a Rajzolt toll szövegre is rákerült');
 for(const t of ['inksketch','hologram'])if(!fxFits(t,O)||!fxFits(t,makeLayer('sdfscene'))||!fxFits(t,makeLayer('surface3d'))||fxFits(t,T)||fxFits(t,makeLayer('cloud3d')))bad.push('célkompatibilitás: '+t);
 st.layers=[O];const plain=px(1);
 attachFx('fx',iS,O.id);const S=O.fx[0];if(!S||S.type!=='inksketch')bad.push('a Rajzolt toll nem került a 3D objektumra');
 if(S){const sk=px(1);if(progError(O))bad.push('obj3d shader: '+String(progError(O)).slice(0,300));
  info.sketchDiff=+diff(plain,sk).toFixed(1);if(info.sketchDiff<10)bad.push('a Rajzolt toll alig hat');
  const corner=at(sk,8,H/2);info.corner=corner;if(lum(corner)<300)bad.push('papír háttér: a sarok nem papírszínű');
  // a gömb: a fény balról-fentről-elölről jön → bal felső oldal világos, jobb alsó sötét → több tinta
  const cx=W/2,cy=H/2,r=Math.round(H*0.2),q=Math.round(H*0.035);
  const lit=patch(sk,cx-r,cy+r*0.9,q),dark=patch(sk,cx+r,cy-r*0.9,q);info.tone=[+lit.ink.toFixed(2),+dark.ink.toFixed(2)];
  if(!(dark.ink>lit.ink+0.1))bad.push('a satírozás nem követi a fényt');
  // a Jelenetfény elforgatása a tintát is elviszi
  st.light.p.az.v=120;const sk2=px(1);if(diff(sk,sk2)<1)bad.push('a Jelenetfény nem hat a satírozásra');st.light.p.az.v=-39.81;
  S.p.paperbg.v=0;const np=px(1);if(lum(at(np,8,H/2))>30)bad.push('papír háttér ki: a sarok nem átlátszó');S.p.paperbg.v=1;
  S.p.density.v=50;const dn=px(1);if(diff(sk,dn)<2)bad.push('a sűrűség nem hat');S.p.density.v=22;
  S.p.ink.v='#c0182a';const red=px(1);{const c=patch(red,cx+r,cy-r*0.9,q).mean,c0=patch(sk,cx+r,cy-r*0.9,q).mean;const pr=at(red,cx+r,cy-r*0.9);info.red=pr;if(diff(sk,red)<1)bad.push('a tollszín nem hat');}S.p.ink.v='#1d1f2a';
  // élő vonal: ki → álló kép; be → a vonalak újrarajzolódnak
  const a1=px(1),a2=px(1.6);if(diff(a1,a2)>0)bad.push('élő vonal ki: mégis változik');
  S.p.boil.v=8;const b1=px(1),b2=px(1.6);if(diff(b1,b2)<0.5)bad.push('élő vonal be: nem rajzolódik újra');S.p.boil.v=0;
  // Erősség: 0 = eredeti, fél = átmenet
  S.n.opacity.v=0;const s0=px(1);if(diff(s0,plain)>0.5)bad.push('Erősség 0: nem az eredeti kép');
  S.n.opacity.v=.5;const s5=px(1);info.half=[+diff(s5,plain).toFixed(1),+diff(s5,sk).toFixed(1)];if(!(diff(s5,plain)>2&&diff(s5,sk)>2))bad.push('Erősség 0,5: nincs átmenet');S.n.opacity.v=1;
  S.vis=false;const off=px(1);if(diff(off,plain)>0)bad.push('kikapcsolt Rajzolt toll is hat');S.vis=true;
  // az inspector megnyitása nem ír a projektbe
  R.selId=O.id;const sn0=snapshot();renderInsp();if(snapshot()!==sn0)bad.push('az inspector megnyitáskor módosít');
  if(!document.querySelector('#insp').textContent.includes('Rajzolt toll'))bad.push('a Rajzolt toll nem látszik a láncban');
  // mentés → újranyitás
  setKey(S.n.opacity,0,0);setKey(S.n.opacity,2,1);commit();const snap=snapshot();const r0=px(1.3);loadProject(JSON.parse(projectJSON()));
  if(snapshot()!==snap)bad.push('újranyitás: állapot');if(diff(r0,px(1.3))>0)bad.push('újranyitás: más kép');
  const O2=st.layers[0];O2.fx=[];const back=px(1);if(diff(back,plain)>0)bad.push('levétel után nem az eredeti kép');}
 // Hologram a 3D objektumon: áttetsző, világos perem, cián
 {const O3=makeLayer('obj3d',{p:{shape:0,spin:0,rx:0,ry:0}});st.layers=[O3];attachFx('fx',iH,O3.id);const Hf=O3.fx[0];Hf.p.flick.v=0;Hf.p.glitch.v=0;
  const ho=px(1);if(progError(O3))bad.push('hologram shader: '+String(progError(O3)).slice(0,300));
  const c=at(ho,W/2,H/2),e=at(ho,W/2+H*0.37,H/2);info.holo={center:c,rim:e};
  if(!(lum(e)>lum(c)+40))bad.push('Hologram: a perem nem világosabb a közepénél');if(!(c[2]>c[0]+10))bad.push('Hologram: nem a saját színét kapta');
  if(lum(c)>500)bad.push('Hologram: a közepe nem áttetsző');
  Hf.p.glitch.v=1;let moved=false;for(let k=0;k<40&&!moved;k++){const t=1+k/12;Hf.p.glitch.v=0;const g0=px(t);Hf.p.glitch.v=1;if(diff(g0,px(t))>0.3)moved=true;}if(!moved)bad.push('Hologram: az elcsúszás nem hat');}
 // Gerincfelület: mindkét anyag lefordul, a stúdió és a tükörpadló eltűnik alóla
 {const G=makeLayer('surface3d');st.layers=[G];const SP=[W/2,H*0.88],g0=px(1);const cg=lum(at(g0,...SP));attachFx('fx',iH,G.id);const g1=px(1);
  if(R.meshErr)bad.push('Gerincfelület shader: '+String(R.meshErr).slice(0,300));info.mesh=[cg,lum(at(g1,...SP)),+diff(g0,g1).toFixed(1)];
  if(!(cg>60&&lum(at(g1,...SP))<20))bad.push('Gerincfelület + Hologram: a stúdióháttér nem tűnt el');if(diff(g0,g1)<5)bad.push('a Hologram nem hat a Gerincfelületre');
  G.fx=[];attachFx('fx',iS,G.id);const g2=px(1);info.paperMesh=at(g2,...SP);if(lum(at(g2,...SP))<300)bad.push('Gerincfelület + Rajzolt toll: nincs papír');if(diff(g2,g1)<5)bad.push('a Rajzolt toll nem hat a Gerincfelületre');
  G.fx=[];const g3=px(1);if(diff(g3,g0)>0)bad.push('Gerincfelület: levétel után más kép');}
 // 3D jelenet + könyvtár
 for(const n of ['Rajzolt tóruszcsomó','Rajzolt hóember','Hologram-fej','Hologram-szalag']){const it=LIB['3d'].find(x=>x.name===n);if(!it){bad.push('nincs könyvtári elem: '+n);continue;}
  st.layers=[it.make()];const b=px(1);if(progError(st.layers[0])||R.meshErr)bad.push('könyvtár shader: '+n);if(diff(b,new Uint8Array(b.length))<3)bad.push('üres kép: '+n);}
 if(gl.getError())bad.push('GL hiba');
 st.layers=[];st.light=light0;st.look=look0;commit();
 return {bad,info};})()
