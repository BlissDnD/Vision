// M10 korai: Magazinrács re-arranges per aspect and title length, keeps frames inside the canvas, arrives staggered,
// survives save/reopen; Szövött galéria renders without GL error, is a pure function of time (seek twice = same
// pixels), cards drift, its images travel in the project file. Old image layers keep no frame (fw = 0).
(async()=>{const bad=[],info={};setPlay(false);st.layers=[];R.selId=null;const size0=st.size;commit();
 try{
  const ri=LIB.recipes.findIndex(x=>x.name==='Magazinrács'),gi=LIB.recipes.findIndex(x=>x.name==='Szövött galéria');if(ri<0||gi<0)bad.push('recipes missing');
  const G=LIB.recipes[ri].make();st.layers=[G];commit();
  const imgs=()=>G.children.filter(k=>k.role==='img');
  const inside=A=>imgs().every(L=>Math.abs(L.n.x.v)+L.p.fw.v/2<=A/2+1e-3&&Math.abs(L.n.y.v)+L.p.fh.v/2<=.5+1e-3);
  const res={};for(const [sz,lbl] of ASPECTS){st.size=sz;relayout(G);const [w,h]=sz.split('x').map(Number);res[lbl]=imgs().map(L=>[+L.n.x.v.toFixed(2),+L.p.fw.v.toFixed(2),+L.p.fh.v.toFixed(2)]);if(!inside(w/h))bad.push('frame outside canvas at '+lbl);}
  info.layout=res;if(JSON.stringify(res['16:9'])===JSON.stringify(res['9:16']))bad.push('aspect change did not re-arrange');
  const T=G.children.find(k=>k.role==='title');st.size='1080x1350';relayout(G);const s0=T.n.s.v;T.text.str='EGY NAGYON HOSSZÚ CÍM, AMI NEM FÉRNE KI';relayout(G);info.titleS=[s0,T.n.s.v];if(!(T.n.s.v<s0))bad.push('long title did not shrink');
  G.layout.comp=3;relayout(G);if(imgs()[0].n.x.v===res['4:5'][0][0]&&imgs()[0].p.fw.v===res['4:5'][0][1])bad.push('composition change had no effect');
  const ins=imgs().map(L=>L.tm&&L.tm.inAt);info.arrive=ins;if(!(ins[0]<ins[1]&&ins[1]<ins[2]))bad.push('no staggered arrival');
  const out=renderScene(st.layers,R.main,1,st.bg);if(gl.getError())bad.push('GL error magazine');
  const P=JSON.parse(projectJSON());loadProject(P);const G2=st.layers[0];if(!G2.layout||G2.children.filter(k=>k.role==='img').length!==3)bad.push('layout lost on reopen');
  if(!P.assets.LAYPH1)bad.push('placeholder image not embedded');
  // old image layer: no frame
  const oldImg=makeLayer('image');if(oldImg.p.fw.v!==0)bad.push('old image got a frame');
  // Szövött galéria
  st.size='1920x1080';resizeMain();const U=LIB.recipes[gi].make();st.layers=[U];commit();
  await new Promise(r=>setTimeout(r,300));
  const px=t=>{const o=renderScene(st.layers,R.main,t,st.bg);present(R.main,o.t,null,cv.width,cv.height,t);const w=cv.width,h=cv.height,b=new Uint8Array(w*h*4);gl.readPixels(0,0,w,h,gl.RGBA,gl.UNSIGNED_BYTE,b);let s=0,lit=0;for(let i=0;i<b.length;i+=16){s+=b[i]*7+b[i+1]*3+b[i+2];if(b[i]+b[i+1]+b[i+2]>60)lit++;}return {s,lit};};
  const a=px(2),b2=px(5),a2=px(2);info.unw=[a,b2,a2,R.unwovenErr||null];if(R.unwovenErr)bad.push('unwoven shader: '+R.unwovenErr);if(gl.getError())bad.push('GL error unwoven');
  if(a.lit<500)bad.push('gallery draws almost nothing');if(a.s!==a2.s)bad.push('not seekable (t=2 twice differs)');if(a.s===b2.s)bad.push('cards do not move');
  const c0=cardsAt(U,0,1920,1080).cards[0].x,c1=cardsAt(U,1,1920,1080).cards[0].x;if(c0===c1)bad.push('cardsAt static');
  const P3=JSON.parse(projectJSON());info.galAssets=U.imgs.filter(id=>P3.assets[id]).length;if(info.galAssets!==U.imgs.length)bad.push('gallery images not embedded');
 }catch(e){bad.push('exception: '+(e&&e.stack||e));}
 st.size=size0;resizeMain();st.layers=[];commit();
 return {bad,info};})()
