import { R } from './runtime';
import { $, h } from './dom';
import { cv, gl } from './gl';
import { st } from './state';
import { outSize, present, resizeMain } from './render';
import { resetSim } from './sim';
import { audioIndex, sceneT } from './time';
import { setPlay } from './transport';
import { AUD, exportAudioBuffer } from './signals';
import { EXP, dimsFor, renderMB } from './popovers';
import { closeModal, openMedia, openModal, toast } from './modals';

R.DL=null;try{window.claude&&window.claude.use&&window.claude.use('downloads').then(d=>{R.DL=d;}).catch(()=>{});}catch(_){}
export async function saveFile(name,data){
  if(R.DL){try{await R.DL.save({filename:name,data});toast('Mentve: '+name);}catch(e){if(e&&e.code==='declined')return;if(e&&e.code==='rate_limited'){toast('Egy mentési ablak már nyitva van.');return;}toast('A mentés itt nem érhető el. Kattints jobb gombbal a képre vagy videóra.');}return;}
  const blob=data instanceof Blob?data:new Blob([data]);const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;document.body.appendChild(a);a.click();a.remove();}
export async function withScale(q,fn){
  if(R.snapping)return;const {W,H}=outSize();const maxS=Math.min(gl.getParameter(gl.MAX_TEXTURE_SIZE),gl.getParameter(gl.MAX_RENDERBUFFER_SIZE),gl.getParameter(gl.MAX_VIEWPORT_DIMS)[0]);
  if(Math.round(W*q)>maxS||Math.round(H*q)>maxS){toast(`Ez a videókártya legfeljebb ${maxS} px-es képet tud renderelni.`);return;}
  R.snapping=true;const prevQ=st.q;
  try{st.q=q;resizeMain();gl.getError();await fn();}
  catch(e){toast(e&&e.message?e.message:'A renderelés nem sikerült.');if(!$('#modal').hidden&&$('#dlg').dataset.busy)closeModal();}
  finally{st.q=prevQ;resizeMain();R.snapping=false;}}
export function glOOM(){const e=gl.getError();return e===gl.OUT_OF_MEMORY||e===gl.CONTEXT_LOST_WEBGL;}
export async function snapPNG(mode){const d=dimsFor(mode||'1');
  if(mode==='4k')toast('4K kép renderelése…');
  await withScale(d.q,async()=>{
    resetSim(R.main);
    const out=renderMB(R.main,R.time,EXP.fps,EXP.mb,EXP.sh);present(R.main,out.t,null,cv.width,cv.height,R.time);
    if(glOOM())throw new Error('Elfogyott a videómemória ehhez a mérethez. Próbáld kisebb felbontással, vagy zárj be más lapokat.');
    const blob=await new Promise<Blob|null>(r=>cv.toBlob(r,'image/png'));if(!blob)throw new Error('A kép nem jött létre.');
    openMedia('img',URL.createObjectURL(blob),`latomas-${cv.width}x${cv.height}-${Date.now()}.png`,`${cv.width} × ${cv.height} PNG`,blob);});}
export function loadMuxer(){if(window.Mp4Muxer)return Promise.resolve(window.Mp4Muxer);return new Promise((res,rej)=>{const sc=document.createElement('script');sc.src='https://cdn.jsdelivr.net/npm/mp4-muxer@5.2.2/build/mp4-muxer.js';
  sc.onload=()=>window.Mp4Muxer?res(window.Mp4Muxer):rej(new Error('Az MP4-csomagoló nem töltődött be.'));sc.onerror=()=>rej(new Error('Az MP4-csomagoló nem töltődött be. Ellenőrizd az internetkapcsolatot.'));document.head.appendChild(sc);});}
export async function renderVideo(mode,fps,dur){
  if(!window.VideoEncoder){toast('Ez a böngésző nem tud MP4-et kódolni.');return;}
  let M;try{M=await loadMuxer();}catch(e){toast(e.message);return;}
  const d=dimsFor(mode);let cancel=false;const useTl=dur==='tl';const D=useTl?st.dur:+dur;
  const bar=h('i');const stat=h('p',null,'Előkészítés…');
  openModal(h('h2',null,'Videó renderelése'),h('p',null,`${d.w} × ${d.h} · ${fps} fps · ${D} mp${(AUD.buf||AUD.stems.length)?' · hanggal':''}${EXP.mb?` · mozgási elmosás ${EXP.mb}×, ${EXP.sh}°`:''}. Minden képkocka külön renderelődik, ezért lassabb gépen is hibátlan lesz.`),h('div',{class:'prog'},bar),stat,
    h('div',{class:'bar2'},h('button',{class:'btn',onclick:()=>{cancel=true;}},'Megszakítás')));$('#dlg').dataset.busy='1';R.onModalClose=()=>{cancel=true;delete $('#dlg').dataset.busy;};
  await withScale(d.q,async()=>{
    const w=cv.width,hh=cv.height;const br=Math.round(Math.min(80e6,Math.max(8e6,w*hh*fps*0.1)));
    let cfg=null;for(const codec of ['avc1.640033','avc1.640034','avc1.4d0033','avc1.42e033']){const c={codec,width:w,height:hh,bitrate:br,framerate:fps};try{const r=await VideoEncoder.isConfigSupported(c);if(r&&r.supported){cfg=c;break;}}catch(_){}}
    if(!cfg)throw new Error(`Ezt a felbontást (${w}×${hh}) a böngésző videókódolója nem támogatja. Próbáld a teljes méretet 4K helyett.`);
    let abuf=null,acfg=null;
    if((AUD.buf||AUD.stems.length)&&window.AudioEncoder){if(R.speed!==1)toast('A hang csak 1× tempónál kerül a videóba.');else{abuf=await exportAudioBuffer();if(abuf){for(const [cc,mc] of [['mp4a.40.2','aac'],['opus','opus']]){const sr=cc==='opus'?48000:abuf.sampleRate;const c={codec:cc,sampleRate:sr,numberOfChannels:Math.min(2,abuf.numberOfChannels),bitrate:192000};try{const r=await AudioEncoder.isConfigSupported(c);if(r&&r.supported){acfg=c;acfg.mux=mc;break;}}catch(_){}}
      if(acfg&&acfg.sampleRate!==abuf.sampleRate){const oc=new OfflineAudioContext(abuf.numberOfChannels,Math.ceil(abuf.duration*acfg.sampleRate),acfg.sampleRate);const bs=oc.createBufferSource();bs.buffer=abuf;bs.connect(oc.destination);bs.start();abuf=await oc.startRendering();}
      if(!acfg)toast('Ez a böngésző nem tud hangot kódolni, a videó hang nélkül készül.');}}}
    const muxer=new M.Muxer({target:new M.ArrayBufferTarget(),video:{codec:'avc',width:w,height:hh,frameRate:fps},...(acfg?{audio:{codec:acfg.mux,numberOfChannels:acfg.numberOfChannels,sampleRate:acfg.sampleRate}}:{}),fastStart:'in-memory'});
    let encErr=null;const enc=new VideoEncoder({output:(ch,meta)=>muxer.addVideoChunk(ch,meta),error:e=>{encErr=e;}});enc.configure(cfg);
    const N=Math.round(D*fps),t0=EXP.from==='head'?R.time:0;
    resetSim(R.main);
    for(let i=0;i<N;i++){
      if(cancel||encErr)break;const t=sceneT(t0+i/fps*R.speed);
      const out=renderMB(R.main,t,fps,EXP.mb,EXP.sh);present(R.main,out.t,null,w,hh,t);
      if(i===0&&glOOM())throw new Error('Elfogyott a videómemória ehhez a mérethez. Próbáld kisebb felbontással.');
      const fr=new VideoFrame(cv,{timestamp:Math.round(i*1e6/fps),duration:Math.round(1e6/fps)});enc.encode(fr,{keyFrame:i%(fps*2)===0});fr.close();
      while(enc.encodeQueueSize>3)await new Promise(r=>setTimeout(r,4));
      if(i%2===0||i===N-1){bar.style.width=((i+1)/N*100).toFixed(1)+'%';stat.textContent=`${i+1} / ${N} képkocka`;await new Promise(r=>setTimeout(r,0));}}
    if(cancel){try{enc.close();}catch(_){}const open=!!$('#dlg').dataset.busy;delete $('#dlg').dataset.busy;if(open)closeModal();toast('Videórenderelés megszakítva.');return;}
    stat.textContent='Kódolás befejezése…';await enc.flush();enc.close();if(encErr)throw encErr;
    if(acfg&&abuf&&!cancel){stat.textContent='Hang kódolása…';const aenc=new AudioEncoder({output:(c,m)=>muxer.addAudioChunk(c,m),error:e=>{encErr=e;}});aenc.configure({codec:acfg.codec,sampleRate:acfg.sampleRate,numberOfChannels:acfg.numberOfChannels,bitrate:acfg.bitrate});
      const sr=abuf.sampleRate,ch=acfg.numberOfChannels,len=abuf.length,chs=[...Array(ch)].map((_,j)=>abuf.getChannelData(Math.min(j,abuf.numberOfChannels-1)));
      const total=Math.round(D*sr),CH=4096;
      for(let pos=0;pos<total;pos+=CH){const n=Math.min(CH,total-pos),data=new Float32Array(n*ch);
        for(let j=0;j<ch;j++){const src=chs[j];for(let k=0;k<n;k++){const idx=audioIndex(sceneT(t0+(pos+k)/sr),sr,len);data[j*n+k]=idx>=0?src[idx]:0;}}
        const ad=new AudioData({format:'f32-planar',sampleRate:sr,numberOfFrames:n,numberOfChannels:ch,timestamp:Math.round(pos/sr*1e6),data});aenc.encode(ad);ad.close();if(cancel)break;
        if(aenc.encodeQueueSize>8)await new Promise(r=>setTimeout(r,2));}
      await aenc.flush();aenc.close();if(encErr)throw encErr;}
    if(cancel){const open=!!$('#dlg').dataset.busy;delete $('#dlg').dataset.busy;if(open)closeModal();toast('Videórenderelés megszakítva.');return;}R.onModalClose=null;
    muxer.finalize();const blob=new Blob([muxer.target.buffer],{type:'video/mp4'});delete $('#dlg').dataset.busy;
    openMedia('video',URL.createObjectURL(blob),`latomas-${w}x${hh}-${fps}fps.mp4`,`${w} × ${hh} · ${fps} fps · MP4`,blob);});
  R.onModalClose=null;delete $('#dlg').dataset.busy;}
R.rec=null;
export function startRec(dur){
  if(R.rec){R.rec.stop();return;}
  if(!cv.captureStream||!window.MediaRecorder){toast('Ez a böngésző nem tud videót rögzíteni.');return;}
  const mime=['video/mp4;codecs=avc1','video/webm;codecs=vp9','video/webm;codecs=vp8','video/webm','video/mp4'].find(m=>MediaRecorder.isTypeSupported&&MediaRecorder.isTypeSupported(m))||'';
  try{const stream=cv.captureStream(60);R.rec=new MediaRecorder(stream,mime?{mimeType:mime,videoBitsPerSecond:20e6}:{});const chunks=[];
    R.rec.ondataavailable=e=>e.data.size&&chunks.push(e.data);
    R.rec.onstop=()=>{const type=R.rec.mimeType||mime||'video/webm';const blob=new Blob(chunks,{type});R.rec=null;$('#recBtn').classList.remove('on');
      const ext=type.includes('mp4')?'mp4':'webm';openMedia('video',URL.createObjectURL(blob),`latomas-${Date.now()}.${ext}`,`${cv.width} × ${cv.height} ${ext.toUpperCase()}`,blob);};
    R.rec.start(250);$('#recBtn').classList.add('on');setPlay(true);toast(`Felvétel: ${dur} mp. A piros gombbal korábban is leállíthatod.`);
    const t0=performance.now();const tick=()=>{if(!R.rec)return;if((performance.now()-t0)/1000>=dur){R.rec.stop();return;}requestAnimationFrame(tick);};tick();
  }catch(e){R.rec=null;toast('A felvétel nem indult el: '+e.message);}}
$('#recBtn').onclick=()=>R.rec?R.rec.stop():startRec(10);
