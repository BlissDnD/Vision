// Poly Haven curated catalog: shelf -> search -> one-click image layer -> offline project and undo.
(async()=>{const bad=[],info={};setPlay(false);st.layers=[];R.selId=null;commit();
 const realFetch=window.fetch;
 try{
  const item=LIB.media.find(x=>x.polyhaven);if(!item)bad.push('Poly Haven card missing');
  R.cat='media';buildCats();buildShelf();
  const card=[...document.querySelectorAll('#items .item')].find(x=>x.textContent.includes('Poly Haven'));
  if(!card)bad.push('shelf card missing');else card.click();
  const dlg=document.querySelector('#dlg');const search=dlg?.querySelector('input[type="search"]');
  if(!search||!dlg.textContent.includes('CC0'))bad.push('catalog dialog missing');
  if(search){search.value='marvany';search.dispatchEvent(new Event('input',{bubbles:true}));}
  const choices=[...dlg.querySelectorAll('button')].filter(x=>x.querySelector('img'));
  info.search=choices.map(x=>x.textContent.trim());
  if(choices.length!==1||!choices[0].textContent.includes('Márvány'))bad.push('catalog search');
  const sample=document.createElement('canvas');sample.width=32;sample.height=32;
  const cx=sample.getContext('2d');cx.fillStyle='#a83242';cx.fillRect(0,0,32,32);
  const blob=await new Promise(resolve=>sample.toBlob(resolve,'image/jpeg',.9));
  window.fetch=async url=>{if(url!==polyHavenImageURL('marble_01'))throw new Error('wrong source URL');return new Response(blob,{headers:{'content-type':'image/jpeg','content-length':String(blob.size)}});};
  if(choices[0])choices[0].click();for(let i=0;i<40&&!st.layers.some(x=>x.type==='image'&&x.asset);i++)await new Promise(r=>setTimeout(r,100));
  const layer=st.layers[0];info.layer={name:layer?.name,source:layer?.source,asset:!!assets[layer?.asset]};
  if(layer?.type!=='image'||layer?.source?.id!=='marble_01'||!assets[layer?.asset])bad.push('image not imported');
  const saved=JSON.parse(projectJSON());if(!saved.assets[layer.asset]||!saved.state.layers[0].source)bad.push('offline project lacks source/image');
  undo();if(st.layers.length)bad.push('undo import');redo();if(st.layers.length!==1)bad.push('redo import');
  loadProject(saved);if(st.layers[0]?.source?.provider!=='Poly Haven'||!assets[st.layers[0].asset])bad.push('saved project did not reopen');
  try{await addPolyHavenTexture('not-in-catalog');bad.push('unknown id accepted');}catch(_){}
  window.fetch=async()=>new Response('bad',{headers:{'content-type':'text/html'}});
  const before=st.layers.length;try{await addPolyHavenTexture('marble_01');bad.push('non-image accepted');}catch(_){}
  if(st.layers.length!==before)bad.push('failed request changed scene');
 }catch(e){bad.push('ERR '+e.message+' '+(e.stack||'').slice(0,250));}
 finally{window.fetch=realFetch;closeModal();}
 return {bad,info};})()
