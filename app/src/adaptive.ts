import { R } from './runtime';
import { cv } from './gl';
import { st } from './state';
import { outSize, resizeMain } from './render';

R.aqF=1;R.aqAcc=0;R.aqN=0;R.aqT=0;R.aqCap=0;R.aqPrev=null;
/** Adaptive preview resolution. Lowers the resolution when frames are slow, raises it when there is headroom.
 *  Frame-rate caps (Chrome Energy Saver, Safari Low Power Mode, 30 Hz displays) are detected: if a resolution
 *  drop brings no fps gain, the drop is undone and the measured rate is treated as the ceiling instead of 60. */
export function autoQuality(dt,rendered){
  if(st.qMode!=='auto'||R.snapping||!rendered)return;
  R.aqAcc+=dt;R.aqN++;R.aqT+=dt;if(R.aqT<1.2)return;
  const fps=R.aqN/R.aqAcc;R.aqAcc=0;R.aqN=0;R.aqT=0;
  if(R.aqCap&&fps>R.aqCap*1.15)R.aqCap=0;
  const lo=R.aqCap?R.aqCap*.88:45,hi=R.aqCap?R.aqCap*.96:57;
  if(R.aqPrev&&fps<R.aqPrev.fps*1.1){R.aqCap=Math.max(R.aqPrev.fps,fps);R.aqF=R.aqPrev.f;R.aqPrev=null;}
  else{const f0=R.aqF;if(fps<lo)R.aqF=Math.max(.35,R.aqF*(fps<lo*.55?.75:.88));else if(fps>hi)R.aqF=Math.min(1,R.aqF*1.08);R.aqPrev=R.aqF<f0?{f:f0,fps}:null;}
  const r=cv.getBoundingClientRect();const {W}=outSize();const disp=Math.max(64,r.width*Math.min(window.devicePixelRatio||1,2));
  let q=Math.min(1,disp/W)*R.aqF;q=Math.max(.15,Math.round(q*20)/20);
  if(Math.abs(q-st.q)>=.05){st.q=q;resizeMain();}}
