// STAB-01 mini: nothing is lost on save/reopen — scene-only images, the same image stored once, embedded audio
// (restored on reopen, dropped on project switch), modal close = export cancel hook, orphan Kapcsolat cleanup.
(async()=>{const bad=[],info={};setPlay(false);st.layers=[];st.scenes=[];st.links=[];R.selId=null;commit();
 try{
  // 1) image used only in a saved scene survives save -> new project -> reopen
  const c=document.createElement('canvas');c.width=c.height=8;const g=c.getContext('2d');g.fillStyle='#f00';g.fillRect(0,0,8,8);
  const data=c.toDataURL('image/png');assets.IMGSCENE=data;
  const img=makeLayer('image',{name:'Jelenetkép',asset:'IMGSCENE'});
  st.scenes=[{id:'S1',name:'A',dur:3,layers:[img],trans:{dur:1,ease:3,pairs:{}}}];st.layers=[makeLayer('gradient')];commit();
  const P1=JSON.parse(projectJSON());if(!P1.assets||!P1.assets.IMGSCENE)bad.push('scene-only image missing from project file');
  // 2) same picture twice -> one stored copy
  if(sameAsset(data)!=='IMGSCENE')bad.push('identical image not recognised');
  const twin=makeLayer('image',{asset:sameAsset(data)});st.layers.push(twin);commit();
  info.assetCount=Object.keys(JSON.parse(projectJSON()).assets).length;if(info.assetCount!==1)bad.push('identical image stored twice');
  // 3) audio: generate 1 s WAV, import, save, switch to an empty project, reopen
  const sr=8000,n=sr,buf=new ArrayBuffer(44+n*2),v=new DataView(buf);const w=(o,s)=>{for(let i=0;i<s.length;i++)v.setUint8(o+i,s.charCodeAt(i));};
  w(0,'RIFF');v.setUint32(4,36+n*2,true);w(8,'WAVE');w(12,'fmt ');v.setUint32(16,16,true);v.setUint16(20,1,true);v.setUint16(22,1,true);v.setUint32(24,sr,true);v.setUint32(28,sr*2,true);v.setUint16(32,2,true);v.setUint16(34,16,true);w(36,'data');v.setUint32(40,n*2,true);
  for(let i=0;i<n;i++)v.setInt16(44+i*2,Math.sin(i/sr*2*Math.PI*220)*12000*(i%2000<200?1:.2),true);
  await loadAudioFile(new File([buf],'teszt.wav',{type:'audio/wav'}),false);
  if(!AUD.buf)bad.push('audio import failed');
  const P2=JSON.parse(projectJSON());info.audio=!!(P2.audio&&P2.audio.main);if(!info.audio)bad.push('audio missing from project file');
  loadProject({app:'vel',v:4,state:{layers:[]},assets:{}});if(AUD.buf||AUD.stems.length)bad.push('previous audio stuck after project switch');
  loadProject(P2);await R.audioReady;
  if(!AUD.buf||AUD.name!=='teszt.wav')bad.push('audio not restored on reopen');
  if(!AUD.sig||!AUD.sig.kick||!AUD.sig.kick.length)bad.push('audio signals not rebuilt');
  if(!P2.assets.IMGSCENE||!(st.scenes[0]&&st.scenes[0].layers[0].asset==='IMGSCENE'))bad.push('scene image not reopened');
  // 4) closing the modal any way runs the owner's hook once (video export cancel)
  let hits=0;openModal(h('p',null,'x'));R.onModalClose=()=>{hits++;};
  window.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true}));document.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true}));
  if(!$('#modal').hidden)closeModal();closeModal();info.hookHits=hits;if(hits!==1)bad.push('close hook ran '+hits+'×');
  // 5) orphan Kapcsolat (both ends gone) is dropped; a link with one live end stays
  const A=makeLayer('gradient');st.layers=[A];st.scenes=[];
  st.links=[{id:'K1',from:{id:'NOPE1'},to:{id:'NOPE2'},amt:1,on:true},{id:'K2',from:{id:A.id},to:{id:'NOPE3'},amt:1,on:true}];commit();
  info.links=st.links.map(l=>l.id);if(st.links.some(l=>l.id==='K1'))bad.push('orphan link kept');if(!st.links.some(l=>l.id==='K2'))bad.push('half-live link removed');
  const P3=JSON.parse(projectJSON());P3.state.links.push({id:'K9',from:{id:'X'},to:{id:'Y'},amt:1,on:true});loadProject(P3);
  if(st.links.some(l=>l.id==='K9'))bad.push('orphan link survives load');
 }catch(e){bad.push('exception: '+(e&&e.message||e));}
 audioClear&&audioClear();st.layers=[];st.scenes=[];st.links=[];commit();
 return {bad,info};})()
