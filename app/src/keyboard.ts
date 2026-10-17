import { R } from './runtime';
import { $ } from './dom';
import { sel } from './state';
import { KEY_EPS, curV, delKey, hasK, keyIdx, seekTo, setKey } from './evaluation';
import { delSel, dupSel, groupSel, moveSel } from './itemops';
import { renderLayers } from './layers';
import { renderInsp } from './inspector';
import { commit, redo, undo } from './history';
import { setTool, toggleFS } from './stage';
import { fmtT, resetFeedback, setPlay } from './transport';
import { audioRestart } from './signals';
import { copyKeys, deleteSelKeys, layerKeyTimes, pasteKeys, renderTracks, trackRows } from './timeline';
import { markDirty } from './loop';
import { closePop } from './popovers';
import { runRandom } from './random';
import { closeModal, toast } from './modals';

document.addEventListener('keydown',e=>{
  if(!$('#modal').hidden){if(e.key==='Escape')closeModal();return;}
  if(e.key==='Escape'){closePop();if(R.tlxSels.length){R.tlxSels=[];renderTracks();}return;}
  const tg=(e.target as HTMLElement).tagName;if(tg==='INPUT'||tg==='TEXTAREA'||tg==='SELECT')return;
  const mod=e.ctrlKey||e.metaKey;const k=e.key.toLowerCase();
  if(mod&&k==='z'){e.preventDefault();e.shiftKey?redo():undo();return;}
  if(mod&&k==='y'){e.preventDefault();redo();return;}
  if(mod&&k==='d'){e.preventDefault();dupSel();return;}
  if(mod&&k==='g'){e.preventDefault();groupSel();return;}
  if(mod&&k==='c'){const L=sel();if((R.tlxSels.length||L)&&copyKeys(L,R.time)){e.preventDefault();toast(`${R.keyClip.length} kulcskocka másolva`);}return;}
  if(mod&&k==='v'){const L=sel();if(L&&R.keyClip){e.preventDefault();const n=pasteKeys(L,R.time);if(n){commit();renderInsp();toast(`${n} kulcskocka beillesztve @ ${fmtT(R.time)}`);}}return;}
  if(mod&&k==='a'&&R.tlxOpen){e.preventDefault();R.tlxSels=[];const L=sel();for(const r of trackRows())if(!L||r.L.id===L.id)for(const t of layerKeyTimes(r.L).keys())R.tlxSels.push({id:r.L.id,t});renderTracks();toast(`${R.tlxSels.length} kulcskocka-időpont kijelölve`);return;}
  if(mod)return;
  if(e.key===' '){e.preventDefault();setPlay(!R.playing);}
  else if(k==='v')setTool('move');else if(k==='o')setTool('orbit');else if(k==='r')runRandom(true);
  else if(k==='g')$('#gizmoBtn').click();else if(k==='f')toggleFS();
  else if(k==='h'){const L=sel();if(L){L.vis=!L.vis;commit();renderLayers();}}
  else if(e.key==='Delete'||e.key==='Backspace'){e.preventDefault();if(R.tlxSels.length){const n=deleteSelKeys();commit();renderInsp();toast(`${n} kulcskocka törölve`);}else delSel();}
  else if(e.key===']')moveSel(1);else if(e.key==='[')moveSel(-1);
  else if(e.key==='Home'){R.time=0;resetFeedback();audioRestart();}
  else if(k==='k'){const L=sel();if(L){const on=keyIdx(L.n.x,R.time)>=0;for(const q of ['x','y','s','r']){const i=keyIdx(L.n[q],R.time);if(on){if(i>=0)delKey(L.n[q],i);}else setKey(L.n[q],R.time,curV(L.n[q]));}commit();renderInsp();toast(on?'Elhelyezés-kulcskocka törölve':`Elhelyezés-kulcskocka @ ${fmtT(R.time)}`);}}
  else if(e.key===','||e.key==='.'){const L=sel();if(L){const ts=[];for(const o of [L.n,L.p||{}])for(const q in o)if(hasK(o[q]))o[q].k.forEach(x=>ts.push(x.t));ts.sort((a,b)=>a-b);
    const nx=e.key==='.'?ts.find(x=>x>R.time+KEY_EPS):[...ts].reverse().find(x=>x<R.time-KEY_EPS);if(nx!=null)seekTo(nx);}}
  markDirty();
});
