// U5 Szín: OKLCH mixing keeps colour in the middle, contrast/readable, shared picker (live input, one undo step),
// own gradient replaces the palette in the shader and survives save/reopen, old projects stay untouched,
// Színek summary lists palette + colour-changing Megjelenés, colour drop on a layer, action bar add/use/remove.
(()=>{const bad=[],info={};setPlay(false);st.layers=[];R.selId=null;commit();
 try{
  // colour math
  const mid=mixColor(hexToRgb('#ff0000'),hexToRgb('#00ff00'),.5,0),midR=mixColor(hexToRgb('#ff0000'),hexToRgb('#00ff00'),.5,1);
  info.chroma=[+toOklch(mid)[1].toFixed(3),+toOklch(midR)[1].toFixed(3)];if(!(toOklch(mid)[1]>toOklch(midR)[1]*1.05))bad.push('OKLCH middle not more saturated than RGB');
  const cr=contrast(hexToRgb('#000000'),hexToRgb('#ffffff'));if(Math.abs(cr-21)>.1)bad.push('contrast black/white '+cr);
  const fix=readableOn(hexToRgb('#202020'),hexToRgb('#000000'));if(contrast(fix,[0,0,0])<4.5)bad.push('readableOn failed');
  if(harmony(hexToRgb('#3366ff'),'triad').length!==5)bad.push('harmony size');
  // picker: live input, one undo step
  const L=makeLayer('shape',{name:'K'});st.layers=[L];R.selId=L.id;commit();renderInsp();
  const ck=paramsOf(L).find(d=>d.type==='color');info.colorParam=ck&&ck.k;
  if(ck){const well=[...document.querySelectorAll('#insp .cwb')].find(b=>b.getAttribute('aria-label')===ck.l);if(!well)bad.push('no colour well in inspector');
    else{const h0=R.hist.length;well.click();if(!pickerOpen())bad.push('picker did not open');
      const P=document.querySelector('.cpick');const hx=P.querySelector('.cp-hex');hx.value='#12ab34';hx.dispatchEvent(new Event('change'));
      if(L.p[ck.k].v!=='#12ab34')bad.push('picker input not live: '+L.p[ck.k].v);closePicker();info.undoSteps=R.hist.length-h0;if(R.hist.length-h0!==1)bad.push('picker undo steps '+(R.hist.length-h0));}}
  // own gradient in the shader
  const G=makeLayer('gradient');st.layers=[G];R.selId=G.id;commit();
  const px=()=>{const out=renderScene(st.layers,R.main,1,st.bg);present(R.main,out.t,null,cv.width,cv.height,1);const b=new Uint8Array(4);gl.readPixels(cv.width>>1,cv.height>>1,1,1,gl.RGBA,gl.UNSIGNED_BYTE,b);return [...b];};
  const a=px();const old=JSON.parse(projectJSON());if(old.state.layers[0].grad)bad.push('grad written without user action');
  G.grad={s:[[0,'#00ff00'],[1,'#00ff00']],m:0};commit();const b=px();info.px=[a,b];
  if(gl.getError())bad.push('GL error with gradient');if(!(b[1]>200&&b[0]<60&&b[2]<60))bad.push('gradient not used by pal(): '+b);
  const P2=JSON.parse(projectJSON());loadProject(P2);if(!st.layers[0].grad||st.layers[0].grad.s[0][1]!=='#00ff00')bad.push('gradient lost on reopen');
  // palette picker: ✎ own gradient swatch + editor bar
  R.selId=st.layers[0].id;R.itab='look';renderInsp();info.gbar=!!document.querySelector('#insp .gbar');
  // colour summary
  const T=makeLayer('mtext',{name:'Cím'});T.p.color1.v='#111111';if(T.p.fill)T.p.fill.v=0;st.bg='#000000';
  st.layers=[T];R.selId=T.id;T.fx=[makeLayer('grade')];commit();renderInsp();
  const sum=document.querySelector('#insp .csum');info.sum=sum?[...sum.querySelectorAll('.csum-row')].map(r=>r.textContent.trim()):null;
  if(!sum)bad.push('no Színek summary');else if(!info.sum.some(t=>/Appearance/.test(t)))bad.push('colour Megjelenés not listed');
  const fixBtn=sum&&[...sum.querySelectorAll('button')].find(b=>b.textContent==='Make readable');if(!fixBtn)bad.push('no contrast warning');else{fixBtn.click();info.fixed=T.p.color1.v;if(contrast(hexToRgb(T.p.color1.v),[0,0,0])<4.4)bad.push('Make readable did not fix');}
  // colour drop on a layer
  const S=makeLayer('shape');st.layers=[S];commit();applyColorTo(S,'#ff8800');const ck2=paramsOf(S).find(d=>d.type==='color');
  if(ck2?S.p[ck2.k].v!=='#ff8800':!S.grad)bad.push('applyColorTo did nothing');
  // action bar
  try{localStorage.removeItem('vel.abar');}catch(_){}renderBar();const fxi=LIB.fx.findIndex(x=>!x.head&&x.name);
  addToBar({t:'lib',id:catId('fx',fxi),name:LIB.fx[fxi].name});addToBar({t:'col',id:'#00aaff',name:'#00aaff'});
  const btns=document.querySelectorAll('#abar .abtn');info.abar=btns.length;if(btns.length!==2)bad.push('action bar items '+btns.length);
  R.selId=S.id;const n0=(S.fx||[]).length;btns[0].click();info.fxAdded=(findItem(S.id).it.fx||[]).length-n0;if(info.fxAdded<1)bad.push('action bar click did not apply Megjelenés');
  btns[1].dispatchEvent(new MouseEvent('contextmenu',{bubbles:true}));if(document.querySelectorAll('#abar .abtn').length!==1)bad.push('right click did not remove');
  if(!libById(catId('fx',fxi)))bad.push('libById failed');
  try{localStorage.removeItem('vel.abar');}catch(_){}renderBar();
 }catch(e){bad.push('exception: '+(e&&e.stack||e));}
 st.layers=[];st.bg='#000000';commit();
 return {bad,info};})()
