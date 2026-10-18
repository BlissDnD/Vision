import { tasteExport, tasteMerge } from './taste';
import { R } from './runtime';
import { $ } from './dom';
import { migrateProject, PROJECT_VER } from './migrate';
import { attachLinks, gcBases } from './variants';
import { ev } from './evaluation';
import { resetFeedback } from './transport';
import { assets, findItem, normLight, normLook, normalize, st, walk } from './state';
import { loadAsset } from './text';
import { normCam, resizeMain } from './render';
import { renderLayers } from './layers';
import { renderInsp } from './inspector';
import { markDirty } from './loop';
import { EXP, applyExp, updLookLbl } from './popovers';
import { ulibMerge, ulibUsed } from './userlib';

R.hist=[];R.hi=-1;
export const snapshot=()=>JSON.stringify({layers:st.layers,bg:st.bg,size:st.size,look:st.look,light:st.light,cam:st.cam,dur:R.seqPlay?R.seqDurSave:st.dur,scenes:st.scenes,loop:st.loop,bpm:st.bpm,bpmOff:st.bpmOff,bases:st.bases,links:st.links,cues:st.cues});
export function commit(){gcBases();attachLinks(ev);markDirty();const s=snapshot();if(R.hist[R.hi]!==s){R.hist.splice(R.hi+1);R.hist.push(s);if(R.hist.length>100)R.hist.shift();R.hi=R.hist.length-1;}updUndo();scheduleSave();}
export function restore(s){const o=JSON.parse(s);if(R.seqExit)R.seqExit();st.layers=o.layers;st.cam=normCam(o.cam);st.bg=o.bg;st.size=o.size;st.look=normLook(o.look);st.light=normLight(o.light);updLookLbl();setTL(o);setShared(o);setScenes(o);if(!findItem(R.selId))R.selId=(st.layers[st.layers.length-1]||{}).id||null;resizeMain();renderAll();}
export function undo(){if(R.hi>0){R.hi--;restore(R.hist[R.hi]);updUndo();scheduleSave();}}
export function redo(){if(R.hi<R.hist.length-1){R.hi++;restore(R.hist[R.hi]);updUndo();scheduleSave();}}
export function updUndo(){$('#undoBtn').disabled=R.hi<=0;$('#redoBtn').disabled=R.hi>=R.hist.length-1;}
$('#undoBtn').onclick=undo;$('#redoBtn').onclick=redo;
export function usedAssets(){const o={};walk(st.layers,l=>{if(l.asset&&assets[l.asset])o[l.asset]=assets[l.asset];});return o;}
export const stateJSON=()=>({...JSON.parse(snapshot()),exp:{...EXP}});
export const projectJSON=()=>{const o:any={app:'vel',v:PROJECT_VER,state:stateJSON(),assets:usedAssets(),ulib:ulibUsed()};const tt=tasteExport();if(tt)o.taste=tt;return JSON.stringify(o);};
R.saveT=undefined;export function scheduleSave(){clearTimeout(R.saveT);R.saveT=setTimeout(()=>{try{localStorage.setItem('latomas2.auto',projectJSON());}catch(_){try{localStorage.setItem('latomas2.auto',JSON.stringify({app:'vel',v:PROJECT_VER,state:stateJSON(),assets:{}}));}catch(__){}}},700);}
/** Apply a project object (file, autosave). Returns the migration report. */
export function applyProject(obj){const m=migrateProject(obj);if(m.ulib.length)ulibMerge(m.ulib);if(obj&&obj.taste)tasteMerge(obj.taste);
  Object.assign(assets,m.assets);for(const id in m.assets)loadAsset(id);
  st.layers=m.state.layers.map(normalize);st.bg=m.state.bg||st.bg;st.size=m.state.size||st.size;st.look=normLook(m.state.look);st.light=normLight(m.state.light);st.cam=normCam(m.state.cam);updLookLbl();if(R.seqExit)R.seqExit();setTL(m.state);setShared(m.state);setScenes(m.state);applyExp(m.state.exp);
  R.selId=(st.layers[st.layers.length-1]||{}).id||null;R.time=0;return m;}
export function loadProject(obj){const m=applyProject(obj);resetFeedback();resizeMain();renderAll();commit();
  R.lastLoad=m;return m;}
export function loadMsg(){const m=R.lastLoad;if(!m)return 'Betöltve.';const old=m.from<3?` (régi, v${m.from} formátum, átalakítva)`:'';
  return m.dropped.length?`Betöltve${old}. Nem ismert elem kimaradt: ${m.dropped.slice(0,4).join(', ')}${m.dropped.length>4?' …':''}`:`Betöltve${old}.`;}
export function renderAll(){renderLayers();renderInsp();}
/** bases + links (v4). Missing in older files = none. */
export function setShared(o){o=o||{};st.bases={};for(const id in (o.bases||{})){const b=o.bases[id];if(b&&Array.isArray(b.children))st.bases[id]={id,name:b.name||'Közös alap',children:b.children.map(normalize)};}
  st.links=Array.isArray(o.links)?o.links.filter(l=>l&&l.from&&l.to):[];attachLinks(ev);
  st.cues=Array.isArray(o.cues)?o.cues.filter(c=>c&&isFinite(c.t)).map(c=>({id:c.id||'C'+Math.random().toString(36).slice(2,8),t:+c.t,label:c.label||''})):[];}
/** S1 scenes (saved compositions in order, each with its incoming transition). Missing in older files = none. */
export function setScenes(o){const src=o&&Array.isArray(o.scenes)?o.scenes:[];
  st.scenes=src.filter(s=>s&&Array.isArray(s.layers)).map((s,i)=>({id:s.id||'S'+Math.random().toString(36).slice(2,9),name:s.name||`Jelenet ${i+1}`,dur:s.dur>0?+s.dur:5,layers:s.layers.map(normalize),
    trans:{dur:s.trans&&s.trans.dur>=0?+s.trans.dur:1,ease:s.trans&&isFinite(s.trans.ease)?+s.trans.ease:3,pairs:(s.trans&&s.trans.pairs&&typeof s.trans.pairs==='object')?s.trans.pairs:{}}}));
  if(R.renderStrip)R.renderStrip();}
export function setTL(o){o=o||{};st.dur=o.dur>0?o.dur:10;st.loop=o.loop!==false;st.bpm=o.bpm>0?o.bpm:120;st.bpmOff=o.bpmOff||0;}
