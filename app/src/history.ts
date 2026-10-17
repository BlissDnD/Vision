import { R } from './runtime';
import { $ } from './dom';
import { migrateProject, PROJECT_VER } from './migrate';
import { resetFeedback } from './transport';
import { assets, findItem, normLook, normalize, st, walk } from './state';
import { loadAsset } from './text';
import { normCam, resizeMain } from './render';
import { renderLayers } from './layers';
import { renderInsp } from './inspector';
import { markDirty } from './loop';
import { EXP, applyExp, updLookLbl } from './popovers';

R.hist=[];R.hi=-1;
export const snapshot=()=>JSON.stringify({layers:st.layers,bg:st.bg,size:st.size,look:st.look,cam:st.cam,dur:st.dur,loop:st.loop,bpm:st.bpm,bpmOff:st.bpmOff});
export function commit(){markDirty();const s=snapshot();if(R.hist[R.hi]!==s){R.hist.splice(R.hi+1);R.hist.push(s);if(R.hist.length>100)R.hist.shift();R.hi=R.hist.length-1;}updUndo();scheduleSave();}
export function restore(s){const o=JSON.parse(s);st.layers=o.layers;st.cam=normCam(o.cam);st.bg=o.bg;st.size=o.size;st.look=normLook(o.look);updLookLbl();setTL(o);if(!findItem(R.selId))R.selId=(st.layers[st.layers.length-1]||{}).id||null;resizeMain();renderAll();}
export function undo(){if(R.hi>0){R.hi--;restore(R.hist[R.hi]);updUndo();scheduleSave();}}
export function redo(){if(R.hi<R.hist.length-1){R.hi++;restore(R.hist[R.hi]);updUndo();scheduleSave();}}
export function updUndo(){$('#undoBtn').disabled=R.hi<=0;$('#redoBtn').disabled=R.hi>=R.hist.length-1;}
$('#undoBtn').onclick=undo;$('#redoBtn').onclick=redo;
export function usedAssets(){const o={};walk(st.layers,l=>{if(l.asset&&assets[l.asset])o[l.asset]=assets[l.asset];});return o;}
export const stateJSON=()=>({...JSON.parse(snapshot()),exp:{...EXP}});
export const projectJSON=()=>JSON.stringify({app:'vel',v:PROJECT_VER,state:stateJSON(),assets:usedAssets()});
R.saveT=undefined;export function scheduleSave(){clearTimeout(R.saveT);R.saveT=setTimeout(()=>{try{localStorage.setItem('latomas2.auto',projectJSON());}catch(_){try{localStorage.setItem('latomas2.auto',JSON.stringify({app:'vel',v:PROJECT_VER,state:stateJSON(),assets:{}}));}catch(__){}}},700);}
/** Apply a project object (file, autosave). Returns the migration report. */
export function applyProject(obj){const m=migrateProject(obj);
  Object.assign(assets,m.assets);for(const id in m.assets)loadAsset(id);
  st.layers=m.state.layers.map(normalize);st.bg=m.state.bg||st.bg;st.size=m.state.size||st.size;st.look=normLook(m.state.look);st.cam=normCam(m.state.cam);updLookLbl();setTL(m.state);applyExp(m.state.exp);
  R.selId=(st.layers[st.layers.length-1]||{}).id||null;R.time=0;return m;}
export function loadProject(obj){const m=applyProject(obj);resetFeedback();resizeMain();renderAll();commit();
  R.lastLoad=m;return m;}
export function loadMsg(){const m=R.lastLoad;if(!m)return 'Betöltve.';const old=m.from<3?` (régi, v${m.from} formátum, átalakítva)`:'';
  return m.dropped.length?`Betöltve${old}. Nem ismert elem kimaradt: ${m.dropped.slice(0,4).join(', ')}${m.dropped.length>4?' …':''}`:`Betöltve${old}.`;}
export function renderAll(){renderLayers();renderInsp();}
export function setTL(o){o=o||{};st.dur=o.dur>0?o.dur:10;st.loop=o.loop!==false;st.bpm=o.bpm>0?o.bpm:120;st.bpmOff=o.bpmOff||0;}
