import { R } from './runtime';
import { thumbPrune } from './thumbstore';
import { EFFECTS } from './effects/index';
import { getProg } from './gl';
import { assets, normLook, normalize, st } from './state';
import { RECIPES, makeRecipe } from './recipes';
import { loadAsset } from './text';
import { normCam, resizeMain } from './render';
import { buildCats, buildShelf } from './shelf';
import { applyProject, commit, renderAll } from './history';
import { toast } from './modals';
import { setPlay } from './transport';
import { setTlx } from './timeline';
import { frame } from './loop';
import { updLookLbl } from './popovers';

(function boot(){
  let ok=false;
  let a=null;try{a=localStorage.getItem('latomas2.auto');}catch(_){}
  try{if(a){const m=applyProject(JSON.parse(a));ok=st.layers.length>0;if(m.dropped.length)setTimeout(()=>toast('Az automatikus mentésből kimaradt: '+m.dropped.join(', ')),1500);}}catch(e){console.warn('autosave',e);}
  if(!ok)st.layers=[makeRecipe(RECIPES[0])];
  R.selId=(st.layers[st.layers.length-1]||{}).id||null;
  resizeMain();renderAll();commit();buildCats();buildShelf();setPlay(true);updLookLbl();setTlx(R.tlxOpen);
  requestAnimationFrame(t=>{R.last=t;frame(t);});
  const keys=Object.keys(EFFECTS).filter(k=>k!=='custom'&&!EFFECTS[k].points&&EFFECTS[k].code);let ki=0;
  const idle:any=window.requestIdleCallback||((f)=>setTimeout(()=>f({timeRemaining:()=>8}),120));
  const warm=dl=>{while(ki<keys.length&&dl.timeRemaining()>6){try{getProg({type:keys[ki]});}catch(_){}ki++;}if(ki<keys.length)idle(warm);};
  setTimeout(()=>idle(warm),2500);
  setTimeout(()=>idle(()=>thumbPrune()),8000);
})();
