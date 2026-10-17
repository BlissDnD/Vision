import { R } from './runtime';
import { $ } from './dom';
import { cv } from './gl';
import { st } from './state';
import { curV, ev, hasK, keyState, keyVal } from './evaluation';
import { loadLabel, sceneLoad } from './cost';
import { present, renderScene, resizeMain } from './render';
import { fmt, setFill } from './controls';
import { updGizmo } from './stage';
import { fmtT, resetFeedback } from './transport';
import { AUD, audioRestart, sigVal } from './signals';
import { tlHeadEl, tlxTick } from './timeline';
import { autoQuality } from './adaptive';

R.snapping=false;R.dirty=3;export const markDirty=()=>{R.dirty=Math.max(R.dirty,2);};
document.addEventListener('input',markDirty,true);document.addEventListener('change',markDirty,true);document.addEventListener('pointerup',markDirty,true);document.addEventListener('keyup',markDirty,true);
export function frame(now){
  const dt=Math.min(.1,(now-R.last)/1000);R.last=now;
  if(R.playing&&!R.snapping){if(AUD.srcs.length&&AUD.ctx)R.time=AUD.t0+(AUD.ctx.currentTime-AUD.c0)*R.speed;else R.time+=dt*R.speed;
    if(st.loop&&st.dur>0&&R.time>=st.dur){R.time=R.time%st.dur;resetFeedback();audioRestart();}}
  const need=R.playing||R.dirty>0||R.drag||R.rec;if(!R.snapping&&need){resizeMain();const items=R.audition?[...st.layers,R.audition]:st.layers;const out=renderScene(items,R.main,R.time,st.bg);present(R.main,out.t,null,cv.width,cv.height,R.time);if(R.dirty>0)R.dirty--;}
  autoQuality(dt,need);
  $('#timeOut').textContent=fmtT(R.time);tlHeadEl.style.left=(Math.min(1,st.dur>0?R.time/st.dur:0)*100)+'%';
  if(R.popEl)for(const c of R.popEl.querySelectorAll('.sigchip'))c.style.setProperty('--lv',Math.min(1,Math.max(0,sigVal(c.dataset.sig,R.time))).toFixed(3));
  for(const c of R.liveCtl){if(c.kbtn){const ks=keyState(c.obj);if(c.kbtn.dataset.k!==ks)c.kbtn.dataset.k=ks;if(ks&&document.activeElement!==c.rng&&document.activeElement!==c.val){const kv=keyVal(c.obj.k,R.time);if(Math.abs(+c.rng.value-kv)>1e-9){c.rng.value=kv;setFill(c.rng);c.val.value=fmt(kv,c.d);}}}
    if(c.obj.a||c.obj.s||hasK(c.obj)){c.mod.hidden=false;const v=ev(c.obj,c.d,R.time);c.mod.style.left=Math.min(100,Math.max(0,(v-c.d.min)/(c.d.max-c.d.min)*100))+'%';}else c.mod.hidden=true;}
  for(const f of R.liveFields){if(f.kbtn){const ks=keyState(f.obj);if(f.kbtn.dataset.k!==ks)f.kbtn.dataset.k=ks;}if(document.activeElement!==f.inp){const s=fmt(curV(f.obj),f.d);if(f.inp.value!==s)f.inp.value=s;}}
  for(const k of R.liveKed)k.tick();
  if(R.tlxOpen)tlxTick();
  updGizmo(R.time);
  if(need||!R.playing){R.fpsAcc+=dt;R.fpsN++;}if(now-R.fpsT>600){const fps=Math.round(R.fpsN/R.fpsAcc),ld=sceneLoad(),hud=$('#hud');const cap=R.aqCap?Math.round(R.aqCap):0;const col=fps>=50||(cap&&fps>=cap*.9)?'#30d158':fps>=28?'#ffd60a':'#ff453a';
    hud.innerHTML=R.playing?`<i style="background:${col}"></i>${fps}${cap?' / '+cap:''} fps · ${loadLabel(ld)} · ${cv.width}×${cv.height}${st.qMode==='auto'?' · auto':''}`:`<i style="background:var(--fg3)"></i>Szünet · ${loadLabel(ld)} · ${cv.width}×${cv.height}`;
    hud.title=`${cap?`A böngésző ${cap} képkocka/mp-re korlátozza a lejátszást (pl. Chrome Energiatakarékos mód vagy macOS Alacsony fogyasztású mód akkumulátoron). Ilyenkor a felbontást nem csökkentem tovább.\n`:''}Becsült terhelés: ${ld.toFixed(1)} egység.\nHa akad: Vászon → Előnézet 50%, kevesebb 3D réteg, kapcsold ki a 4× élsimítást.\nAz exportot ez nem érinti: a kép és a videó képkockánként, teljes minőségben renderelődik.`;R.fpsAcc=0;R.fpsN=0;R.fpsT=now;}
  requestAnimationFrame(frame);}
