import { R } from './runtime';
import { $ } from './dom';
import { SVG_PAUSE, SVG_PLAY } from './effects/index';
import { resetSim } from './sim';
import { fmt, setFill } from './controls';
import { AUD, audioRestart, audioStop, ensureAC } from './signals';
import { markDirty } from './loop';

R.playing=true;R.time=0;R.speed=1;R.last=performance.now();R.fpsAcc=0;R.fpsN=0;R.fpsT=0;
export function setPlay(p){R.playing=p;$('#playBtn').innerHTML=p?SVG_PAUSE:SVG_PLAY;if(p){if(AUD.buf||AUD.stems.length)ensureAC();audioRestart();}else audioStop();}
$('#playBtn').onclick=()=>setPlay(!R.playing);
$('#rewBtn').onclick=()=>{R.time=0;resetFeedback();markDirty();audioRestart();};
export function resetFeedback(){if(!R.main)return;resetSim(R.main);R.refine=true;}
export const fmtT=t=>{const m=Math.floor(t/60),s=t%60;return m+':'+s.toFixed(1).padStart(4,'0');};
export function syncCtl(){for(const c of R.liveCtl){if(document.activeElement!==c.rng&&document.activeElement!==c.val&&+c.rng.value!==c.obj.v){c.rng.value=c.obj.v;setFill(c.rng);c.val.value=fmt(c.obj.v,c.d);}}}
