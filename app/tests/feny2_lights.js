// FÉNY2 · több fény, aktív fény, fényformák, valódi tükrözés/törés, padlótükör (obj3d / sdfscene):
// további fény hozzáadása/kikapcsolása/törlése hat és visszaáll; a forma a krómon látszik; a csillanás-húzás az aktív fényt
// mozgatja; Valódi tükröződés és Tükör padló hat; régi projekt (more nélkül) betölt; mentés → újranyitás; undo.
(()=>{const bad=[],info={};const light0=st.light,look0=st.look,size0=st.size;st.light=normLight(null);st.look=mkLook('Nyers');st.layers=[];
 const px=t=>{const out=renderScene(st.layers,R.main,t,'#000000');present(R.main,out.t,null,cv.width,cv.height,t);const w=cv.width,h=cv.height,b=new Uint8Array(w*h*4);gl.readPixels(0,0,w,h,gl.RGBA,gl.UNSIGNED_BYTE,b);return b;};
 const diff=(a,b)=>{let s=0;for(let i=0;i<a.length;i+=4)s+=Math.abs(a[i]-b[i])+Math.abs(a[i+1]-b[i+1])+Math.abs(a[i+2]-b[i+2]);return s/(a.length/4*3);};
 const lower=b=>{const W=cv.width,H=cv.height;let s=0;for(let y=0;y<H*0.3;y++)for(let x=0;x<W;x++){const i=(y*W+x)*4;s+=b[i]+b[i+1]+b[i+2];}return s/(W*H*0.3);};
 if(!Array.isArray(st.light.more)||st.light.more.length)bad.push('normLight: üres more lista kell');
 const C=makeLayer('obj3d',{p:{shape:0,material:4,rough:.3,rx:25,ry:35,spin:0,displace:0}});st.layers=[C];R.selId=C.id;commit();
 const base=px(1);if(progError(C))bad.push('obj3d shader: '+String(progError(C)).slice(0,300));
 // további fény
 const x1=addLight();if(!x1||st.light.more.length!==1||R.lightSel!==1)bad.push('+ Fény: nem jött létre aktív fényként');
 const l1=px(1);info.extra=+diff(base,l1).toFixed(2);if(info.extra<0.1)bad.push('a további fény nem hat');
 x1.on=false;if(diff(px(1),base)>0)bad.push('kikapcsolt további fény is hat');x1.on=true;
 const sh0=px(1);x1.p.shape.v=2;const sh2=px(1);info.shape=+diff(sh0,sh2).toFixed(2);if(info.shape<0.05)bad.push('a fény formája nem látszik a krómon');x1.p.shape.v=1;
 // aktív fény: a csillanás-húzás az aktívat mozgatja
 const mAz=st.light.p.az.v,mEl=st.light.p.el.v;glint3(C,{x:.15,y:.1});
 if(st.light.p.az.v!==mAz||st.light.p.el.v!==mEl)bad.push('csillanás-húzás: a fő fény mozdult, nem az aktív');if(x1.p.az.v===180-39.81&&x1.p.el.v===20)bad.push('csillanás-húzás: az aktív fény nem mozdult');
 R.lightSel=0;const xAz=x1.p.az.v;glint3(C,{x:-.1,y:.12});if(x1.p.az.v!==xAz)bad.push('fő fény aktív: mégis a további mozdult');st.light.p.az.v=mAz;st.light.p.el.v=mEl;
 // fő fény formája
 const f0=px(1);st.light.p.shape.v=1;if(diff(f0,px(1))<0.05)bad.push('a fő fény formája nem hat');st.light.p.shape.v=0;
 // panel: csipek, aktív jelölés, legfeljebb 3 további fény
 R.lightSel=1;renderInsp();let chips=[...document.querySelectorAll('#insp .lchip')];info.chips=chips.length;
 if(chips.length!==2)bad.push('csipek száma');if(!chips[1]||chips[1].getAttribute('aria-pressed')!=='true')bad.push('az aktív fény nincs jelölve');
 const sn=snapshot();renderInsp();if(snapshot()!==sn)bad.push('az inspector megnyitáskor módosít');
 addLight();addLight();if(addLight()!==null||st.light.more.length!==3)bad.push('legfeljebb 3 további fény');renderInsp();
 if([...document.querySelectorAll('#insp button')].some(b=>b.textContent==='+ Fény'))bad.push('3 további fénynél is van + Fény');
 removeLight(3);removeLight(2);if(st.light.more.length!==1)bad.push('fény törlése');commit();
 // undo
 const before=snapshot();addLight();commit();undo();if(snapshot()!==before)bad.push('undo: + Fény nem vonódott vissza');
 // valódi tükröződés (önmagát tükröző tóruszcsomó)
 const K=makeLayer('obj3d',{p:{shape:6,material:4,rough:.3,rx:30,spin:0,displace:0}});st.layers=[K];const k0=px(1);K.p.reflM.v=1;const k1=px(1);if(progError(K))bad.push('tükröződés shader');
 info.refl=+diff(k0,k1).toFixed(2);if(info.refl<0.05)bad.push('Valódi tükröződés nem hat');K.p.reflM.v=0;
 // padlótükör: ugyanazzal a kamerával a tükör ereje hat, lent megjelenik a tükörkép
 K.p.floorM.v=1;K.p.mirror.v=0;const m0=px(1);K.p.mirror.v=1;const m1=px(1);info.mirror=[+lower(m0).toFixed(1),+lower(m1).toFixed(1)];
 if(!(lower(m1)>lower(m0)+0.5))bad.push('a padlótükör nem mutat tükörképet');K.p.floorM.v=0;if(diff(px(1),k0)>0)bad.push('Padló: Árnyék visszaállítva más kép');
 // üveg valódi töréssel
 const G=makeLayer('obj3d',{p:{shape:3,material:6,env:3,rx:20,spin:0,displace:0}});st.layers=[G];const g0=px(1);G.p.reflM.v=1;const g1=px(1);info.glass=+diff(g0,g1).toFixed(2);if(info.glass<0.05)bad.push('üveg: a valódi törés nem hat');
 // 3D jelenet
 const S=makeLayer('sdfscene',{p:{material:2,spin:0}});st.layers=[S];const s0=px(1);S.p.reflM.v=1;S.p.floorM.v=1;const s1=px(1);if(progError(S))bad.push('sdfscene shader: '+String(progError(S)).slice(0,300));if(diff(s0,s1)<0.05)bad.push('3D jelenet: tükröződés/padló nem hat');
 // mentés → újranyitás; régi projekt (more nélkül)
 st.layers=[C];R.selId=C.id;commit();const snap=snapshot();const r0=px(1.2);const J=JSON.parse(projectJSON());loadProject(J);
 if(snapshot()!==snap)bad.push('újranyitás: állapot');if(st.light.more.length!==1)bad.push('újranyitás: a további fény elveszett');if(diff(r0,px(1.2))>0)bad.push('újranyitás: más kép');
 delete J.state.light.more;delete J.state.light.p.shape;loadProject(J);if(!Array.isArray(st.light.more)||st.light.more.length||st.light.p.shape.v!==0)bad.push('régi projekt: alapértékek');
 for(const n of ['Tükrös tóruszcsomó','Üvegkristály tükörpadlón']){const it=LIB['3d'].find(x=>x.name===n);if(!it)bad.push('nincs könyvtári elem: '+n);else{st.layers=[it.make()];px(1);if(progError(st.layers[0]))bad.push('könyvtár shader: '+n);}}
 if(gl.getError())bad.push('GL hiba');
 st.layers=[];st.light=light0;st.look=look0;R.lightSel=0;commit();
 return {bad,info};})()
