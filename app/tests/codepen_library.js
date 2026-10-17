(async()=>{const bad=[],info={};try{
 const gi=LIB.gen.findIndex(x=>x.make().type==='windflame'),fi=LIB.fx.findIndex(x=>x.make().type==='liquidglass');
 if(gi<0||fi<0)bad.push('könyvtári elemek hiányoznak');
 const flame=LIB.gen[gi].make(),fx=LIB.fx[fi].make();st.layers=[flame];
 const draw=t=>{const out=renderScene(st.layers,R.main,t,'#000');present(R.main,out.t,null,cv.width,cv.height,t);const b=new Uint8Array(4);gl.readPixels(cv.width>>1,cv.height>>1,1,1,gl.RGBA,gl.UNSIGNED_BYTE,b);return [...b];};
 draw(1);await new Promise(r=>setTimeout(r,150));const f1=draw(1),f2=draw(2);info.flame=[f1,f2];if(progError(flame))bad.push('láng GLSL: '+progError(flame));
 if(!imgTex.has(WIND_NOISE_ID))bad.push('láng textúra hiányzik');
 const rec=makeRecipe(RECIPES.find(r=>r.n==='Liquid Glass · fénykép'));st.layers=[rec];draw(0);await new Promise(r=>setTimeout(r,150));draw(0);
 const photo=rec.children[0];if(!photo||photo.type!=='image'||!photo.fx.some(x=>x.type==='liquidglass'))bad.push('üveg recept szerkezete');
 if(!imgTex.has(GLASS_PHOTO_ID))bad.push('fotó nem töltődött be');if(progError(photo)||progError(photo.fx[0]))bad.push('üveg GLSL: '+(progError(photo)||progError(photo.fx[0])));
 const js=projectJSON();loadProject(JSON.parse(js));const next=st.layers[0]?.children?.[0];if(!next||next.fx?.[0]?.type!=='liquidglass')bad.push('mentés után eltűnt az üveg');
 st.layers=[makeLayer('shape')];attachFx('fx',fi,st.layers[0].id);if(st.layers[0].fx[0]?.type!=='liquidglass')bad.push('rétegre húzás');
 }catch(e){bad.push('ERR '+e.message+' '+(e.stack||'').slice(0,300));}return {bad,info};})()
