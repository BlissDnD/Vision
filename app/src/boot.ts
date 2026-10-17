import { R } from './runtime';
import { thumbPrune } from './thumbstore';
import { EFFECTS } from './effects/index';
import { getProg } from './gl';
import { assets, normLook, normalize, st } from './state';
import { RECIPES, makeRecipe } from './recipes';
import { loadAsset } from './text';
import { normCam, resizeMain } from './render';
import { buildCats, buildShelf } from './shelf';
import { commit, renderAll, setTL } from './history';
import { setPlay } from './transport';
import { setTlx } from './timeline';
import { frame } from './loop';
import { updLookLbl } from './popovers';

(function boot(){
  let ok=false;
  try{const a=localStorage.getItem('latomas2.auto');if(a){const o=JSON.parse(a);Object.assign(assets,o.assets||{});for(const id in assets)loadAsset(id);
    st.layers=(o.state.layers||[]).filter(l=>l.type==='group'||EFFECTS[l.type]).map(normalize);st.bg=o.state.bg||st.bg;st.size=o.state.size||st.size;st.look=normLook(o.state.look);st.cam=normCam(o.state.cam);setTL(o.state);ok=st.layers.length>0;}}catch(_){}
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
