// Lottie first slice: local vector import, separate media time/Loop, deterministic seek, project/autosave, unsafe input.
(async()=>{const bad=[],info={};setPlay(false);R.time=0;st.layers=[];st.scenes=[];st.links=[];st.size='640x480';st.q=1;st.look=mkLook('Nyers');resizeMain();
 const shape={ty:'el',d:1,s:{a:0,k:[70,70],ix:2},p:{a:0,k:[0,0],ix:3},nm:'Ellipse Path',mn:'ADBE Vector Shape - Ellipse',hd:false};
 const fill={ty:'fl',c:{a:0,k:[1,.12,.08,1],ix:4},o:{a:0,k:100,ix:5},r:1,bm:0,nm:'Red',mn:'ADBE Vector Graphic - Fill',hd:false};
 const tr={ty:'tr',p:{a:0,k:[0,0],ix:2},a:{a:0,k:[0,0],ix:1},s:{a:0,k:[100,100],ix:3},r:{a:0,k:0,ix:6},o:{a:0,k:100,ix:7},sk:{a:0,k:0,ix:4},sa:{a:0,k:0,ix:5},nm:'Transform'};
 const root={v:'5.12.0',fr:30,ip:0,op:60,w:200,h:200,layers:[{ddd:0,ind:1,ty:1,sw:70,sh:70,sc:'#ff2222',nm:'Moving square',sr:1,ks:{o:{a:0,k:100},r:{a:0,k:0},p:{a:1,k:[{t:0,s:[40,100,0],e:[160,100,0],i:{x:1,y:1},o:{x:0,y:0}},{t:60,s:[160,100,0]}]},a:{a:0,k:[35,35,0]},s:{a:0,k:[100,100,100]}},ip:0,op:60,st:0,bm:0}]};
 const source=JSON.stringify(root),file=new File([source],'circle.json',{type:'application/json'});
 try{
  const sc=document.createElement('canvas');sc.width=200;sc.height=200;
  const solid={...root,layers:[{ddd:0,ind:1,ty:1,sw:200,sh:200,sc:'#ff0000',nm:'Solid',sr:1,ks:{o:{a:0,k:100},r:{a:0,k:0},p:{a:0,k:[100,100,0]},a:{a:0,k:[100,100,0]},s:{a:0,k:[100,100,100]}},ip:0,op:60,st:0,bm:0}]};
  const sp=createLottiePlayer(sc,solid);await new Promise(r=>setTimeout(r,100));sp.goToAndStop(1,true);info.solid={loaded:sp.isLoaded,frame:sp.renderer?.renderedFrame,alpha:sc.getContext('2d').getImageData(100,100,1,1).data[3],width:sc.width};sp.destroy();
  const vc=document.createElement('canvas');vc.width=200;vc.height=200;const vector={...root,layers:[{...root.layers[0],ty:4,ks:{...root.layers[0].ks,p:{a:0,k:[100,100,0]},a:{a:0,k:[0,0,0]}},shapes:[{ty:'gr',it:[shape,fill,tr],nm:'Ellipse',np:2,cix:2,bm:0,ix:1,mn:'ADBE Vector Group',hd:false}]}]};
  const vp=createLottiePlayer(vc,vector);await new Promise(r=>setTimeout(r,100));vp.goToAndStop(1,true);info.vector={loaded:vp.isLoaded,alpha:vc.getContext('2d').getImageData(100,100,1,1).data[3]};vp.destroy();if(info.vector.alpha===0)bad.push('vector shape did not render');
  const valid=parseVectorLottie(source);if(valid.meta.duration!==2)bad.push('meta duration');
  for(const x of [{...root,layers:[{ty:5}]},{...root,layers:[{ty:2}]},{...root,assets:[{id:'pre',layers:[{ty:5}]}]},{...root,layers:[{ty:4,x:'alert(1)'}]},{...root,segments:[{time:1}]}]){
    try{parseVectorLottie(JSON.stringify(x));bad.push('unsafe Lottie accepted');}catch(_){}
  }
  chooseLottieFile();const libLink=document.querySelector('#dlg a[href="https://lottiefiles.com/free-animations"]');
  if(!libLink||libLink.getAttribute('rel')!=='noopener noreferrer')bad.push('official library link missing');closeModal();
  await importLottieFile(file);const dlg=document.querySelector('#dlg');
  if(!dlg.textContent.includes('Vektoranimáció importálása')||!dlg.querySelector('canvas'))bad.push('import preview missing');
  await new Promise(r=>setTimeout(r,100));const preview=dlg.querySelector('canvas');const ppx=preview.getContext('2d').getImageData(0,0,preview.width,preview.height).data;info.previewAlpha=ppx.filter((_,i)=>i%4===3&&ppx[i]>0).length;
  const add=[...dlg.querySelectorAll('button')].find(x=>x.textContent.includes('Hozzáadás'));if(!add)bad.push('add button missing');else add.click();
  let L=st.layers[0];if(!L||L.type!=='lottie'||!vectorAssets[L.asset])bad.push('layer or asset missing');
  undo();if(st.layers.some(x=>x.type==='lottie'))bad.push('undo import');redo();if(!st.layers.some(x=>x.type==='lottie'))bad.push('redo import');L=st.layers.find(x=>x.type==='lottie');
  info.layer={asset:L.asset,meta:lottieMeta(L.asset)?.meta};info.media0=lottieMediaFor(L,.1,{w:640,h:480});await new Promise(r=>setTimeout(r,100));info.media1=lottieMediaFor(L,.1,{w:640,h:480});info.media0={w:info.media0.w,h:info.media0.h,blank:info.media0.tex===BLANK};info.media1={w:info.media1.w,h:info.media1.h,blank:info.media1.tex===BLANK};
  if(L.media.start!==0||L.media.speed!==1||!L.media.loop)bad.push('media timing defaults');
  const draw=async(t)=>{renderScene(st.layers,R.main,t,'#000000');await new Promise(r=>setTimeout(r,80));const out=renderScene(st.layers,R.main,t,'#000000');present(R.main,out.t,null,cv.width,cv.height,t);
    const b=new Uint8Array(cv.width*cv.height*4);gl.readPixels(0,0,cv.width,cv.height,gl.RGBA,gl.UNSIGNED_BYTE,b);return b;};
  const delta=(a,b)=>{let v=0;for(let i=0;i<a.length;i+=4)v+=Math.abs(a[i]-b[i])+Math.abs(a[i+1]-b[i+1])+Math.abs(a[i+2]-b[i+2]);return v/(a.length/4);};
  const a=await draw(.1),b=await draw(1.1),a2=await draw(.1);info.motion=[+delta(a,b).toFixed(2),+delta(a,a2).toFixed(3)];
  if(info.motion[0]<.3)bad.push('animation did not move');if(info.motion[1]>.02)bad.push('seek differs');
  L.media.start=.5;const before=await draw(.1);info.before=+delta(before,a).toFixed(2);if(info.before<.3)bad.push('visible before start');
  L.media.start=0;L.media.loop=true;const loop=await draw(2.1);if(delta(a,loop)>.1)bad.push('media loop differs');
  L.media.loop=false;const end=await draw(2.1);if(delta(a,end)<.3)bad.push('media loop not separate');
  const seg=layerSegs(L).find(x=>x.cls==='lottie');if(!seg||!seg.f.some(x=>x[0]==='media'))bad.push('timeline media segment');
  const hi=lottieMediaFor(L,.5,{w:3840,h:2160});info.highRes=[hi.w,hi.h];if(hi.h<1500)bad.push('4K media canvas too small');
  R.tlxOpen=true;renderTimeline();if(!document.querySelector('.tlx-clip.lottie'))bad.push('Sávok media clip missing');
  const pj=projectJSON(),o=JSON.parse(pj);if(!o.vectorAssets[L.asset])bad.push('project lacks vector');
  const saved=await saveAuto(pj),roundtrip=await readAuto();info.auto={saved,roundtrip:roundtrip?.length,expected:pj.length};if(!saved||roundtrip!==pj)bad.push('durable autosave');
  loadProject(o);if(st.layers[0]?.type!=='lottie'||!vectorAssets[st.layers[0].asset]||st.layers[0].media.loop!==false)bad.push('reopen layer/media');
  const again=await draw(.1);if(delta(again,a)>.1)bad.push('reopen changed frame');
  const old=migrateProject({app:'vel',v:4,state:{layers:[]}});if(Object.keys(old.vectorAssets).length)bad.push('old project vector default');
  const missing=migrateProject({...o,vectorAssets:{}});if(!missing.missingMedia.includes(L.name))bad.push('missing vector asset was not reported');
  const count=st.layers.length;try{parseVectorLottie(JSON.stringify({...root,assets:[{id:'x',p:'remote.png'}]}));bad.push('external image accepted');}catch(_){}
  if(st.layers.length!==count)bad.push('invalid input changed project');
  const dt=new DataTransfer();dt.items.add(file);window.dispatchEvent(new DragEvent('drop',{bubbles:true,cancelable:true,dataTransfer:dt}));await new Promise(r=>setTimeout(r,80));
  if(!document.querySelector('#dlg')?.textContent.includes('Vektoranimáció importálása'))bad.push('JSON drop opened preset instead of Lottie');closeModal();
  info.glError=gl.getError();if(info.glError)bad.push('GL error '+info.glError);
 }catch(e){bad.push('ERR '+e.message+' '+(e.stack||'').slice(0,350));}
 return {bad,info};})()
