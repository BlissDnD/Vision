import { R } from './runtime';
import { $ } from './dom';
import { cv } from './gl';
import { st } from './state';
import { animKinds, curV, ev, hasK, keyState, keyVal } from './evaluation';
import { loadLabel, sceneLoad } from './cost';
import { present, resizeMain } from './render';
import { frameAt, renderAt, sceneHasState } from './sim';
import { fmt, paintBadge, setFill } from './controls';
import { updGizmo } from './stage';
import { fmtT, resetFeedback } from './transport';
import { AUD, audioRestart, sigVal } from './signals';
import { tlHeadEl, tlxTick } from './timeline';
import { autoQuality } from './adaptive';
import { overrun } from './time';
import { updLineHandles } from './textlines';
import { updSpineGrips } from './spinegrips';
import { updPath } from './animate';

R.snapping=false;R.dirty=3;R.refine=false;R.editT=0;export const markDirty=()=>{R.dirty=Math.max(R.dirty,2);R.refine=true;R.editT=performance.now();};
document.addEventListener('input',markDirty,true);document.addEventListener('change',markDirty,true);document.addEventListener('pointerup',markDirty,true);document.addEventListener('keyup',markDirty,true);
export function frame(now){
  const dt=Math.min(.1,(now-R.last)/1000);R.last=now;
  if(R.playing&&!R.snapping){if(AUD.srcs.length&&AUD.ctx)R.time=AUD.t0+(AUD.ctx.currentTime-AUD.c0)*R.speed;else R.time+=dt*R.speed;
    if(st.loop&&st.dur>0&&R.time>=st.dur){R.time=R.time%st.dur;resetFeedback();audioRestart();}}
  const need=R.playing||R.dirty>0||R.drag||R.rec||!!R.moAud;if(!R.snapping&&need){resizeMain();const fr=frameAt(R.time);const items=R.audition&&!R.seqPlay?[...fr.items,R.audition]:fr.items;const out=renderAt(items,R.main,fr.t,st.bg,false);present(R.main,out.t,null,cv.width,cv.height,R.time);if(R.dirty>0)R.dirty--;}
  else if(!R.snapping&&!R.playing&&R.refine&&!R.drag&&now-R.editT>200){R.refine=false;const fr=frameAt(R.time);const items=R.audition&&!R.seqPlay?[...fr.items,R.audition]:fr.items;
    if(sceneHasState(items)){resizeMain();R.main.simT=null;const out=renderAt(items,R.main,fr.t,st.bg,true);present(R.main,out.t,null,cv.width,cv.height,R.time);}}
  autoQuality(dt,need);
  {const ov=overrun(R.time);$('#timeOut').textContent=fmtT(R.time);tlHeadEl.style.left=(Math.min(1,st.dur>0?R.time/st.dur:0)*100)+'%';
   const oe=$('#tlOver');if(oe){const on=ov>0.05;if(oe.hidden===on)oe.hidden=!on;if(on){const s='+'+ov.toFixed(1).replace('.',',')+' mp';if(oe.textContent!==s)oe.textContent=s;}$('#tl').classList.toggle('over',on);}}
  if(R.popEl)for(const c of R.popEl.querySelectorAll('.sigchip'))c.style.setProperty('--lv',Math.min(1,Math.max(0,sigVal(c.dataset.sig,R.time))).toFixed(3));
  for(const c of R.liveCtl){if(c.kbtn){const ks=keyState(c.obj);if(c.kbtn.dataset.k!==ks){c.kbtn.dataset.k=ks;c.box.classList.toggle('keyed',!!ks);}if(c.ab)paintBadge(c.ab,animKinds(c.obj));if(ks&&!c.busy&&c.obj._pv==null&&document.activeElement!==c.val){const kv=keyVal(c.obj.k,R.time);if(Math.abs(+c.rng.value-kv)>1e-9){c.rng.value=kv;setFill(c.rng);c.val.value=fmt(kv,c.d);}}}
    if(c.obj.a||c.obj.s||hasK(c.obj)){c.mod.hidden=false;const v=ev(c.obj,c.d,R.time);c.mod.style.left=Math.min(100,Math.max(0,(v-c.d.min)/(c.d.max-c.d.min)*100))+'%';}else c.mod.hidden=true;}
  for(const f of R.liveFields){if(f.kbtn){const ks=keyState(f.obj);if(f.kbtn.dataset.k!==ks)f.kbtn.dataset.k=ks;}if(f.ab)paintBadge(f.ab,animKinds(f.obj));if(document.activeElement!==f.inp){const s=fmt(curV(f.obj),f.d);if(f.inp.value!==s)f.inp.value=s;}}
  for(const k of R.liveKed)k.tick();
  if(R.tlxOpen)tlxTick();
  updGizmo(R.time);updPath(R.time);updLineHandles(R.time);updSpineGrips(R.time);if(R.updCords)R.updCords(R.time);if(R.updMoArrow)R.updMoArrow(R.time);if(R.updMoRy)R.updMoRy(R.time);if(R.updScenes)R.updScenes();if(R.updTap)R.updTap(R.time);
  if(need||!R.playing){R.fpsAcc+=dt;R.fpsN++;}if(now-R.fpsT>600){const fps=Math.round(R.fpsN/R.fpsAcc),ld=sceneLoad(),hud=$('#hud');const cap=R.aqCap?Math.round(R.aqCap):0;const col=fps>=50||(cap&&fps>=cap*.9)?'#30d158':fps>=28?'#ffd60a':'#ff453a';
    hud.innerHTML=R.playing?`<i style="background:${col}"></i>${fps}${cap?' / '+cap:''} fps · ${loadLabel(ld)} · ${cv.width}×${cv.height}${st.qMode==='auto'?' · auto':''}`:`<i style="background:var(--fg3)"></i>Szünet · ${loadLabel(ld)} · ${cv.width}×${cv.height}`;
    hud.title=`${cap?`A böngésző ${cap} képkocka/mp-re korlátozza a lejátszást (pl. Chrome Energiatakarékos mód vagy macOS Alacsony fogyasztású mód akkumulátoron). Ilyenkor a felbontást nem csökkentem tovább.\n`:''}Becsült terhelés: ${ld.toFixed(1)} egység.\nHa akad: Vászon → Előnézet 50%, kevesebb 3D réteg, kapcsold ki a 4× élsimítást.\nAz exportot ez nem érinti: a kép és a videó képkockánként, teljes minőségben renderelődik.`;R.fpsAcc=0;R.fpsN=0;R.fpsT=now;}
  requestAnimationFrame(frame);}
