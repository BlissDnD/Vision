import { R } from './runtime';
import { $, h } from './dom';
import { st } from './state';
import { ctlSlider, ctlSwitch } from './controls';
import { commit } from './history';
import { fmtT, resetFeedback } from './transport';
import { renderTimeline } from './timeline';
import { markDirty } from './loop';
import { openPop } from './popovers';
import { toast } from './modals';

export const AUD:any={buf:null,name:'',rate:100,sig:{},stems:[],vol:.9,mute:false,srcs:[],ctx:null,gain:null,t0:0,c0:0};export const TAPS=[];
export const SIG_BASE=[['a:level','Level'],['a:kick','Kick'],['a:snare','Snare'],['a:hihat','Hihat'],['a:bass','Bass'],['a:mid','Mid'],['a:high','High']];
export const SIG_BEAT=[['b:beat','Ütem'],['b:half','Half beat'],['b:bar','Ütem /4'],['b:phase','Beat phase']];
export function sigList(){return [...SIG_BASE,...AUD.stems.flatMap((s,i)=>[[`s${i}:level`,`${s.name} · szint`],[`s${i}:hit`,`${s.name} · hit`]]),...SIG_BEAT];}
export function sigLabel(k){const x=sigList().find(s=>s[0]===k);return x?x[1]:k;}
export function arrAt(a,t){if(!a||!a.length)return 0;const x=t*AUD.rate;if(x<=0)return a[0];const i=Math.floor(x);if(i>=a.length-1)return i>=a.length?0:a[a.length-1];const f=x-i;return a[i]*(1-f)+a[i+1]*f;}
export function sigVal(k,t){
  if(k[0]==='b'){const b=(t-(st.bpmOff||0))*(st.bpm||120)/60,fr=((b%1)+1)%1;
    if(k==='b:beat')return Math.exp(-fr*5);if(k==='b:phase')return fr;if(k==='b:half'){const f2=(((b*2)%1)+1)%1;return Math.exp(-f2*5);}
    if(k==='b:bar'){const fb=(((b/4)%1)+1)%1;return Math.exp(-fb*6);}return 0;}
  if(k[0]==='a')return arrAt(AUD.sig[k.slice(2)],t);
  if(k[0]==='s'){const m=/^s(\d+):(\w+)/.exec(k);if(!m)return 0;const S=AUD.stems[+m[1]];return S?arrAt(S.sig[m[2]],t):0;}
  return 0;}
export async function bandEnv(buf,filt){const sr=buf.sampleRate;const oc=new OfflineAudioContext(1,buf.length,sr);const s=oc.createBufferSource();s.buffer=buf;let node:AudioNode=s;
  for(const f of filt){const bq=oc.createBiquadFilter();bq.type=f[0];bq.frequency.value=f[1];if(f[2])bq.Q.value=f[2];node.connect(bq);node=bq;}
  node.connect(oc.destination);s.start();const r=await oc.startRendering();const d=r.getChannelData(0);
  const win=Math.max(1,Math.floor(sr/AUD.rate)),N=Math.ceil(d.length/win),env=new Float32Array(N);
  for(let i=0;i<N;i++){let a=0;const o=i*win,e=Math.min(d.length,o+win);for(let j=o;j<e;j++)a+=d[j]*d[j];env[i]=Math.sqrt(a/Math.max(1,e-o));}return env;}
export function pct(a,q){const c=Float32Array.from(a).sort();return c[Math.min(c.length-1,Math.floor(c.length*q))]||1e-6;}
export function smoothEnv(env){const n=pct(env,.98)||1e-6,o=new Float32Array(env.length);let y=0;for(let i=0;i<env.length;i++){const x=Math.min(1.3,env[i]/n);y+=(x-y)*(x>y?.55:.12);o[i]=y;}return o;}
export function pulseEnv(env,decay){const N=env.length,fl=new Float32Array(N);let avg=0;for(let i=0;i<N;i++){avg+=(env[i]-avg)*.08;fl[i]=Math.max(0,env[i]-avg*1.15);}
  const n=pct(fl,.985)||1e-6,o=new Float32Array(N);let y=0;for(let i=0;i<N;i++){const x=Math.min(1.2,fl[i]/n);y=Math.max(x>.25?x:0,y*decay);o[i]=y;}return o;}
export function estimateBpm(p){const N=p.length;if(N<400)return null;let best=-1,bl=50;
  for(let lag=33;lag<=86;lag++){let s=0;for(let i=0;i+lag<N;i++)s+=p[i]*p[i+lag];s/=N-lag;if(s>best){best=s;bl=lag;}}
  let bpm=6000/bl;while(bpm<85)bpm*=2;while(bpm>175)bpm/=2;const per=6000/bpm;let bo=0,bs=-1;
  for(let o=0;o<per;o++){let s=0;for(let k=o;k<N;k+=per)s+=p[Math.round(k)]||0;if(s>bs){bs=s;bo=o;}}
  return {bpm:Math.round(bpm*10)/10,off:bo/AUD.rate};}
export function ensureAC(){if(!AUD.ctx){AUD.ctx=new (window.AudioContext||window.webkitAudioContext)();AUD.gain=AUD.ctx.createGain();AUD.gain.connect(AUD.ctx.destination);}if(AUD.ctx.state==='suspended')AUD.ctx.resume();}
export function audioStop(){for(const s of AUD.srcs){try{s.stop();}catch(_){}}AUD.srcs=[];}
export function audioRestart(){audioStop();if(!AUD.ctx||!R.playing||R.snapping)return;const bufs=AUD.buf?[AUD.buf]:AUD.stems.map(s=>s.buf);if(!bufs.length)return;
  AUD.gain.gain.value=AUD.mute?0:AUD.vol;AUD.t0=R.time;AUD.c0=AUD.ctx.currentTime;
  AUD.srcs=bufs.map(b=>{const s=AUD.ctx.createBufferSource();s.buffer=b;s.playbackRate.value=R.speed;s.connect(AUD.gain);const off=st.loop?R.time%Math.max(.01,b.duration):R.time;if(off<b.duration)s.start(0,Math.max(0,off));return s;});}
const readURL=(f:Blob)=>new Promise<string>((ok,no)=>{const r=new FileReader();r.onload=()=>ok(String(r.result));r.onerror=()=>no(r.error);r.readAsDataURL(f);});
/** Decode + analyse one audio file. fresh = a new import (sets length/BPM, commits); otherwise a project reopen (state already holds them). */
async function addAudio(ab:ArrayBuffer,name:string,url:string,stem:boolean,fresh:boolean){
  ensureAC();const buf=await AUD.ctx.decodeAudioData(ab);if(fresh)toast('Analyzing audio…');
  if(stem){const lv=await bandEnv(buf,[]);AUD.stems.push({name:name.replace(/\.[^.]+$/,'').slice(0,18),file:name,url,buf,sig:{level:smoothEnv(lv),hit:pulseEnv(lv,.85)}});
    if(fresh&&!AUD.buf){st.dur=Math.round(Math.max(...AUD.stems.map(s=>s.buf.duration))*10)/10;}}
  else{const F={level:[],kick:[['lowpass',110]],bass:[['lowpass',250],['highpass',50]],snare:[['bandpass',1800,.7]],hihat:[['highpass',7500]],mid:[['bandpass',1000,.6]],high:[['highpass',4000]]};
    const raw:any={};for(const k in F)raw[k]=await bandEnv(buf,F[k]);
    AUD.buf=buf;AUD.name=name;AUD.url=url;AUD.sig=<any>{level:smoothEnv(raw.level),bass:smoothEnv(raw.bass),mid:smoothEnv(raw.mid),high:smoothEnv(raw.high),kick:pulseEnv(raw.kick,.84),snare:pulseEnv(raw.snare,.85),hihat:pulseEnv(raw.hihat,.75)};
    if(fresh){const b=estimateBpm(AUD.sig.kick);if(b){st.bpm=b.bpm;st.bpmOff=b.off;}st.dur=Math.round(buf.duration*10)/10;st.loop=true;}}}
export async function loadAudioFile(f,stem){
  try{const url=await readURL(f);await addAudio(await f.arrayBuffer(),f.name,url,stem,true);
    R.time=0;resetFeedback();audioRestart();commit();renderTimeline();toast(stem?`Stem loaded: ${f.name}`:`Audio loaded · ${st.bpm} BPM`);
  }catch(e){toast('Could not open the audio file: '+(e&&e.message||e));}}
export function audioClear(){audioStop();AUD.buf=null;AUD.name='';AUD.url='';AUD.sig={};AUD.stems=[];}
/** STAB: the audio travels in the project file as the original file (data URL, encoded once at import, not per save). */
R.audioExport=()=>{const o:any={};if(AUD.buf&&AUD.url)o.main={name:AUD.name,url:AUD.url};const st2=AUD.stems.filter(s=>s.url).map(s=>({name:s.file||s.name,url:s.url}));if(st2.length)o.stems=st2;return o.main||o.stems?o:null;};
/** Project open/switch: drop the previous audio, then decode the embedded one in the background (no commit, state is already loaded). */
R.audioApply=(a:any)=>{audioClear();R.audioReady=null;if(!a)return;const tok=R.audioTok=(R.audioTok||0)+1;
  const one=async(x:any,stem:boolean)=>{if(!x||typeof x.url!=='string'||!x.url.startsWith('data:'))return;const ab=await (await fetch(x.url)).arrayBuffer();if(tok!==R.audioTok)return;await addAudio(ab,String(x.name||'hang'),x.url,stem,false);};
  R.audioReady=(async()=>{try{await one(a.main,false);for(const s of Array.isArray(a.stems)?a.stems:[])await one(s,true);if(tok!==R.audioTok)return;audioRestart();renderTimeline();markDirty();}
    catch(e){toast('Could not restore the project’s audio: '+(e&&e.message||e));}})();};
export async function exportAudioBuffer(){if(AUD.buf)return AUD.buf;if(!AUD.stems.length)return null;const sr=AUD.stems[0].buf.sampleRate;const len=Math.max(...AUD.stems.map(s=>s.buf.length));
  const oc=new OfflineAudioContext(2,len,sr);for(const s of AUD.stems){const b=oc.createBufferSource();b.buffer=s.buf;b.connect(oc.destination);b.start();}return oc.startRendering();}
export function openAudio(anchor){
  const fileIn=h('input',{type:'file',accept:'audio/*',hidden:true});fileIn.onchange=()=>{const f=fileIn.files[0];if(f)loadAudioFile(f,false).then(()=>openAudio(anchor));};
  const stemIn=h('input',{type:'file',accept:'audio/*',multiple:true,hidden:true});stemIn.onchange=async()=>{for(const f of stemIn.files)await loadAudioFile(f,true);openAudio(anchor);};
  const has=!!(AUD.buf||AUD.stems.length);
  const info=h('p',{class:'small'},has?(AUD.buf?`${AUD.name} · ${fmtT(AUD.buf.duration)} · ${st.bpm} BPM`:`${AUD.stems.length} stem · ${st.bpm} BPM`):'Load an MP3 or WAV. The app splits it into bands (kick, snare, hihat, bass…), detects the tempo and fits the timeline to the track length. It is most accurate if you load separate stems from Ableton.');
  const bpmIn=h('input',{class:'val',value:st.bpm,'aria-label':'Tempo (BPM)'});bpmIn.onchange=()=>{const v=parseFloat(String(bpmIn.value).replace(',','.'));if(isFinite(v)&&v>20&&v<400){st.bpm=v;commit();renderTimeline();}bpmIn.value=st.bpm;};
  const tap=h('button',{class:'btn',onclick:()=>{const now=performance.now();if(TAPS.length&&now-TAPS.at(-1)>2000)TAPS.length=0;TAPS.push(now);while(TAPS.length>6)TAPS.shift();
    if(TAPS.length>=3){const iv=(TAPS.at(-1)-TAPS[0])/(TAPS.length-1);st.bpm=Math.round(60000/iv*10)/10;st.bpmOff=R.time%(60/st.bpm);bpmIn.value=st.bpm;commit();renderTimeline();}}},'Tap');
  const vol={get v(){return AUD.vol;},set v(x){AUD.vol=x;if(AUD.gain)AUD.gain.gain.value=AUD.mute?0:x;}};
  const chips=h('div',{class:'sigs'},...sigList().map(([k,l])=>{const c=h('button',{class:'sigchip',draggable:'true','data-sig':k,title:'Drag onto a slider'},l,h('i'));
    c.ondragstart=e=>{e.dataTransfer.setData('text/x-latomas-sig',k);e.dataTransfer.effectAllowed='link';};return c;}));
  openPop(anchor,'wide',h('div',{class:'pl'},'Audio and signals'),h('div',{class:'pc'},info,
    h('div',{class:'btnrow'},h('button',{class:'btn accent',onclick:()=>fileIn.click()},AUD.buf?'Another audio file…':'Audio file…'),h('button',{class:'btn',onclick:()=>stemIn.click()},'Stem-ek…'),
      has?h('button',{class:'btn',onclick:()=>{audioClear();renderTimeline();openAudio(anchor);markDirty();commit();}},'Remove'):null,fileIn,stemIn),
    has?ctlSlider(vol,{k:'vol',l:'Level',min:0,max:1},{noAnim:true}):null,
    has?ctlSwitch('Mute',AUD.mute,v=>{AUD.mute=v;if(AUD.gain)AUD.gain.gain.value=v?0:AUD.vol;}):null,
    h('div',{class:'row2'},h('span',null,'Tempo (BPM)'),h('div',{class:'btnrow'},bpmIn,tap)),
    h('div',{class:'pl',style:'padding:6px 0 0'},'Signals · drag onto any slider'),chips,
    h('p',{class:'small'},'Beat signals also work without audio at the given tempo. You can also pick a signal from the wave icon of any slider.')));}
$('#audBtn').onclick=e=>openAudio(e.currentTarget);
