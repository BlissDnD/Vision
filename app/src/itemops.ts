import { R } from './runtime';
import { $ } from './dom';
import { cloneItem, findItem, makeGroup, st } from './state';
import { RECIPES } from './recipes';
import { LIB } from './library';
import { normCam } from './render';
import { renderLayers } from './layers';
import { SECOPEN } from './controls';
import { commit, renderAll } from './history';
import { toast } from './modals';
import { EFFECTS, fxFits, fxHostNote } from './effects/index';

export function insertItem(obj,refId){
  const r=refId?findItem(refId):(R.selId?findItem(R.selId):null);
  if(!r)st.layers.push(obj);
  else if(r.it.type==='group'&&obj.type!=='group'&&r.it.open)r.it.children.push(obj);
  else if(obj.type==='group'&&r.parent){const pr=findItem(r.parent.id);pr.list.splice(pr.i+1,0,obj);}
  else r.list.splice(r.i+1,0,obj);
  R.selId=obj.id;}
const hostTarget=refId=>refId?findItem(refId):(R.selId?findItem(R.selId):null);
export function addFromLib(c,i,refId){const li=LIB[c][i];const it=li.make();
  if(EFFECTS[it.type]&&EFFECTS[it.type].host){const r=hostTarget(refId);if(r&&fxFits(it.type,r.it)){attachFx(c,i,r.it.id);return;}toast(`${it.name}: ${fxHostNote(it.type)}. Húzd egy ilyen rétegre, vagy jelöld ki, és kattints újra.`);return;}
  insertItem(it,refId);const R=it.recipe&&RECIPES.find(r=>r.n===it.recipe)||(li.cam?li:null);if(R&&R.cam){st.cam=normCam(R.cam);if(R.dur)st.dur=R.dur;}commit();renderAll();toast(R&&R.cam?`Hozzáadva: ${it.name} · a kamera bekapcsolva`:`Hozzáadva: ${it.name}`);if(it.type==='image')$('#fileImg').click();}
export function attachFx(c,i,targetId){const r=findItem(targetId);if(!r)return;const f=LIB[c][i].make();if(!fxFits(f.type,r.it)){toast(`${f.name} nem került rá: ${fxHostNote(f.type)}.`);return;}r.it.fx.push(f);R.selId=r.it.id;SECOPEN.fx=true;commit();renderAll();toast(`${f.name} → ${r.it.name}`);}
export function removeItem(id){const r=findItem(id);if(!r)return;r.list.splice(r.i,1);const nx=r.list[Math.min(r.i,r.list.length-1)]||r.parent;R.selId=nx?nx.id:((st.layers[st.layers.length-1]||{}).id||null);}
export function delSel(){if(!R.selId)return;removeItem(R.selId);commit();renderAll();}
export function dupSel(){const r=R.selId&&findItem(R.selId);if(!r)return;const c=cloneItem(r.it);c.name=r.it.name+' másolat';r.list.splice(r.i+1,0,c);R.selId=c.id;commit();renderAll();}
export function moveSel(d){const r=R.selId&&findItem(R.selId);if(!r)return;const j=r.i+d;if(j<0||j>=r.list.length)return;r.list.splice(r.i,1);r.list.splice(j,0,r.it);commit();renderLayers();}
export function groupSel(){const r=R.selId&&findItem(R.selId);if(!r)return;if(r.it.type==='group'||r.parent){toast('Csoportot nem lehet csoportba tenni.');return;}
  const g=makeGroup('Csoport',[r.it],{open:true});r.list.splice(r.i,1,g);R.selId=g.id;commit();renderAll();}
export function ungroup(G){const r=findItem(G.id);if(!r)return;r.list.splice(r.i,1,...G.children);R.selId=G.children.length?G.children[G.children.length-1].id:null;commit();renderAll();}
export function moveItemTo(id,refId,into){if(id===refId)return;const a=findItem(id);const b=findItem(refId);if(!a||!b)return;
  if(a.it.type==='group'&&(into||b.parent))return;
  a.list.splice(a.i,1);const b2=findItem(refId);
  if(into&&b2.it.type==='group'){b2.it.children.push(a.it);b2.it.open=true;}else b2.list.splice(b2.i+1,0,a.it);
  commit();renderLayers();}
$('#grpBtn').onclick=groupSel;$('#dupBtn').onclick=dupSel;$('#upBtn').onclick=()=>moveSel(1);$('#downBtn').onclick=()=>moveSel(-1);$('#delBtn').onclick=delSel;
