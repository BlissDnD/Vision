import { R } from './runtime';
import { $ } from './dom';
import { EFFECTS } from './effects/index';
import { assets, findItem, normLook, normalize, st, walk } from './state';
import { loadAsset } from './text';
import { normCam, resizeMain } from './render';
import { renderLayers } from './layers';
import { renderInsp } from './inspector';
import { markDirty } from './loop';
import { updLookLbl } from './popovers';

R.hist=[];R.hi=-1;
export const snapshot=()=>JSON.stringify({layers:st.layers,bg:st.bg,size:st.size,look:st.look,cam:st.cam,dur:st.dur,loop:st.loop,bpm:st.bpm,bpmOff:st.bpmOff});
export function commit(){markDirty();const s=snapshot();if(R.hist[R.hi]!==s){R.hist.splice(R.hi+1);R.hist.push(s);if(R.hist.length>100)R.hist.shift();R.hi=R.hist.length-1;}updUndo();scheduleSave();}
export function restore(s){const o=JSON.parse(s);st.layers=o.layers;st.cam=normCam(o.cam);st.bg=o.bg;st.size=o.size;st.look=normLook(o.look);updLookLbl();setTL(o);if(!findItem(R.selId))R.selId=(st.layers[st.layers.length-1]||{}).id||null;resizeMain();renderAll();}
export function undo(){if(R.hi>0){R.hi--;restore(R.hist[R.hi]);updUndo();scheduleSave();}}
export function redo(){if(R.hi<R.hist.length-1){R.hi++;restore(R.hist[R.hi]);updUndo();scheduleSave();}}
export function updUndo(){$('#undoBtn').disabled=R.hi<=0;$('#redoBtn').disabled=R.hi>=R.hist.length-1;}
$('#undoBtn').onclick=undo;$('#redoBtn').onclick=redo;
export function usedAssets(){const o={};walk(st.layers,l=>{if(l.asset&&assets[l.asset])o[l.asset]=assets[l.asset];});return o;}
export const projectJSON=()=>JSON.stringify({app:'latomas',v:2,state:JSON.parse(snapshot()),assets:usedAssets()});
R.saveT=undefined;export function scheduleSave(){clearTimeout(R.saveT);R.saveT=setTimeout(()=>{try{localStorage.setItem('latomas2.auto',projectJSON());}catch(_){try{localStorage.setItem('latomas2.auto',JSON.stringify({app:'latomas',v:2,state:JSON.parse(snapshot()),assets:{}}));}catch(__){}}},700);}
export function loadProject(obj){if(!obj||!obj.state||!Array.isArray(obj.state.layers))throw new Error('Ez nem Látomás projekt.');
  Object.assign(assets,obj.assets||{});for(const id in (obj.assets||{}))loadAsset(id);
  st.layers=obj.state.layers.filter(l=>l.type==='group'||EFFECTS[l.type]).map(normalize);st.bg=obj.state.bg||st.bg;st.size=obj.state.size||st.size;st.look=normLook(obj.state.look);st.cam=normCam(obj.state.cam);updLookLbl();setTL(obj.state);
  R.selId=(st.layers[st.layers.length-1]||{}).id||null;resizeMain();renderAll();commit();}
export function renderAll(){renderLayers();renderInsp();}
export function setTL(o){o=o||{};st.dur=o.dur>0?o.dur:10;st.loop=o.loop!==false;st.bpm=o.bpm>0?o.bpm:120;st.bpmOff=o.bpmOff||0;}
