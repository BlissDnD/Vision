import { R } from './runtime';
import { $ } from './dom';
import { BASEK, EFFECTS, kindOf, pdefOf } from './effects/index';
import { cv } from './gl';
import { findItem, sel, st } from './state';
import { curV, ev, setVal } from './evaluation';
import { textCache } from './text';
import { camApply, outSize } from './render';
import { addFromLib } from './itemops';
import { commit } from './history';
import { syncCtl } from './transport';
import { renderTimeline } from './timeline';
import { markDirty } from './loop';
import { toast } from './modals';
import { glintDrag, isSurf, panDrag, panStart, wheelDist } from './spinegrips';
import { glint3, usesLight } from './lightui';

export const wrap=$('#wrap');
export function fitCanvas(){markDirty();const r=wrap.getBoundingClientRect();const {W,H}=outSize();const pad=40;const s=Math.max(.01,Math.min((r.width-pad)/W,(r.height-pad)/H));cv.style.width=W*s+'px';cv.style.height=H*s+'px';}
new ResizeObserver(fitCanvas).observe(wrap);
R.tool='move';R.gizmoOn=true;
export function setTool(t){R.tool=t;document.querySelectorAll<HTMLElement>('[data-tool]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.tool===t)));
  if(t==='orbit'){const L=sel();if(!L||(L.type!=='obj3d'&&L.type!=='sdfscene'&&L.type!=='surface3d'&&L.type!=='cloud3d'))toast('Válassz ki egy 3D objektumot vagy 3D jelenetet, majd húzd a vásznon a forgatáshoz.');}}
document.querySelectorAll<HTMLElement>('[data-tool]').forEach(b=>b.onclick=()=>setTool(b.dataset.tool));
$('#gizmoBtn').onclick=()=>{R.gizmoOn=!R.gizmoOn;$('#gizmoBtn').setAttribute('aria-pressed',String(R.gizmoOn));};
$('#fsBtn').onclick=toggleFS;
export function toggleFS(){const el=$('.stage');try{if(document.fullscreenElement)document.exitFullscreen();else el.requestFullscreen().catch(()=>toast('A teljes képernyő itt nem érhető el.'));}catch(_){toast('A teljes képernyő itt nem érhető el.');}}
export function toAsp(e){const r=cv.getBoundingClientRect();const {W,H}=outSize();return {x:((e.clientX-r.left)/r.width-.5)*(W/H),y:.5-(e.clientY-r.top)/r.height};}
R.drag=null;
wrap.addEventListener('pointerdown',e=>{if(e.button!==0||R.seqPlay||e.target.closest('.hudbar,.hud,.tl,.tlx,.kmenu,.scn,.textbar'))return;const L=sel();if(!L)return;wrap.setPointerCapture(e.pointerId);
  const hnd=e.target.dataset&&e.target.dataset.h;const is3=L.type==='obj3d'||L.type==='sdfscene'||L.type==='surface3d'||L.type==='cloud3d';const mode=hnd||(R.tool==='orbit'&&is3?'orbit':isSurf(L)?(R.glint?'glint':'pan'):(R.glint&&usesLight(L)&&!hnd?'glint3':'move'));
  R.drag={mode,p0:toAsp(e),c0:[e.clientX,e.clientY],x:curV(L.n.x),y:curV(L.n.y),s:curV(L.n.s),rx:L.p&&L.p.rx?curV(L.p.rx):0,ry:L.p&&L.p.ry?curV(L.p.ry):0,m:1};
  {if(st.cam.on&&L.type!=='group'&&kindOf(L)!=='fx'){const sv=R.CAMON;R.CAMON=true;const r=camApply(L,R.time,R.drag.x,R.drag.y,1,0);R.CAMON=sv;R.drag.m=Math.max(.01,r[2]);R.drag.scx=r[0];R.drag.scy=r[1];}}
  if(mode==='pan')R.drag.cam=panStart(L);
  if(mode==='glint3'){glint3(L,R.drag.p0);syncCtl();}
  if(mode==='glint'){R.drag.gok=glintDrag(L,e.clientX,e.clientY);syncCtl();}
  if(L.type==='sdfscene'&&mode!=='orbit'&&L.prims&&L.prims[L.psel]){const o=L.prims[L.psel];R.drag.prim=true;R.drag.o={...o};const [ax,ay]=sdfAngles(L,R.time);R.drag.vz=m3y(-ay,m3x(-ax,[o.x,o.y,o.z]))[2];}});
wrap.addEventListener('pointermove',e=>{if(!R.drag)return;markDirty();const L=sel();if(!L)return;const p=toAsp(e);const cx=R.drag.scx??R.drag.x,cy=R.drag.scy??R.drag.y;
  if(R.drag.mode==='glint3'){glint3(L,p);syncCtl();return;}
  if(R.drag.prim){primDrag(L,R.drag,p,e);return;}
  if(R.drag.mode==='glint'){if(glintDrag(L,e.clientX,e.clientY))R.drag.gok=true;syncCtl();return;}
  if(R.drag.mode==='pan'){panDrag(L,R.drag.cam,p.x-R.drag.p0.x,p.y-R.drag.p0.y);syncCtl();return;}
  if(R.drag.mode==='move'){setVal(L.n.x,R.drag.x+(p.x-R.drag.p0.x)/R.drag.m);setVal(L.n.y,R.drag.y+(p.y-R.drag.p0.y)/R.drag.m);}
  else if(R.drag.mode==='s'){const d0=Math.hypot(R.drag.p0.x-cx,R.drag.p0.y-cy)||.01;setVal(L.n.s,Math.max(.02,R.drag.s*Math.hypot(p.x-cx,p.y-cy)/d0));}
  else if(R.drag.mode==='r'){let r=90-Math.atan2(p.y-cy,p.x-cx)*180/Math.PI;r=((r+180)%360+360)%360-180;if(e.shiftKey)r=Math.round(r/15)*15;setVal(L.n.r,r);}
  else if(R.drag.mode==='orbit'){setVal(L.p.ry,((R.drag.ry+(e.clientX-R.drag.c0[0])*.5+180)%360+360)%360-180);setVal(L.p.rx,Math.max(-180,Math.min(180,R.drag.rx+(e.clientY-R.drag.c0[1])*.5)));syncCtl();}});
export const endDrag=()=>{if(R.drag){if(R.drag.mode==='glint'&&!R.drag.gok)toast('Ide a mennyezeti fénycsík nem tud csillanást tenni (ez a rész lefelé vagy oldalra néz). Próbáld a felület egy felfelé forduló részén.');R.drag=null;commit();renderTimeline();}};wrap.addEventListener('pointerup',endDrag);wrap.addEventListener('pointercancel',endDrag);
R.wheelT=undefined;wrap.addEventListener('wheel',e=>{if((e.target as HTMLElement).closest('.tlx,.hudbar,.tl,.textbar'))return;const L=sel();if(!L)return;e.preventDefault();markDirty();if(isSurf(L)){wheelDist(L,e.deltaY);syncCtl();clearTimeout(R.wheelT);R.wheelT=setTimeout(commit,300);return;}setVal(L.n.s,Math.max(.02,Math.min(20,curV(L.n.s)*Math.exp(-e.deltaY*.0012))));clearTimeout(R.wheelT);R.wheelT=setTimeout(commit,300);},{passive:false});
wrap.addEventListener('dragover',e=>{if([...e.dataTransfer.types].includes('text/x-latomas-lib')){e.preventDefault();$('#dropHint').hidden=false;}});
wrap.addEventListener('dragleave',e=>{if(!wrap.contains(e.relatedTarget))$('#dropHint').hidden=true;});
wrap.addEventListener('drop',e=>{e.preventDefault();$('#dropHint').hidden=true;const lib=e.dataTransfer.getData('text/x-latomas-lib');if(!lib)return;const [c,i]=lib.split(':');
  const r=R.selId&&findItem(R.selId);addFromLib(c,+i,r&&!r.parent?r.it.id:null);
  const L=sel();if(L&&L.type!=='group'&&EFFECTS[L.type].kind!=='fx'){const p=toAsp(e);L.n.x.v=p.x;L.n.y.v=p.y;commit();}});
export const m3x=(a,v)=>{const c=Math.cos(a),s=Math.sin(a);return [v[0],c*v[1]-s*v[2],s*v[1]+c*v[2]];};
export const m3y=(a,v)=>{const c=Math.cos(a),s=Math.sin(a);return [c*v[0]+s*v[2],v[1],-s*v[0]+c*v[2]];};
export const PD=(L,k)=>pdefOf(L,k);
export function sdfAngles(L,t){return [ev(L.p.rx,PD(L,'rx'),t)*Math.PI/180,ev(L.p.ry,PD(L,'ry'),t)*Math.PI/180+t*ev(L.p.spin,PD(L,'spin'),t)];}
export function sdfProj(L,t){if(L.type!=='sdfscene'||!L.prims)return null;const o=L.prims[L.psel];if(!o)return null;const [ax,ay]=sdfAngles(L,t);const v=m3y(-ay,m3x(-ax,[o.x,o.y,o.z]));
  const k=1.8/Math.max(.3,3.5-v[2]),s=Math.max(.01,ev(L.n.s,BASEK.s,t));return {x:ev(L.n.x,BASEK.x,t)+v[0]*k*s,y:ev(L.n.y,BASEK.y,t)+v[1]*k*s,r:Math.max(o.sx,o.sy,o.sz)*k*s*.9,rot:o.ry};}
export function primDrag(L,drag,p,e){const o=L.prims[L.psel];if(!o)return;markDirty();const s=Math.max(.01,ev(L.n.s,BASEK.s,R.time));
  if(drag.mode==='move'){const [ax,ay]=sdfAngles(L,R.time);const k=(3.5-drag.vz)/1.8/s;const q=m3x(ax,m3y(ay,[(p.x-drag.p0.x)*k,(p.y-drag.p0.y)*k,0]));o.x=drag.o.x+q[0];o.y=drag.o.y+q[1];o.z=drag.o.z+q[2];}
  else if(drag.mode==='s'){const c=sdfProj(L,R.time);const d0=Math.hypot(drag.p0.x-c.x,drag.p0.y-c.y)||.01,f=Math.max(.05,Math.hypot(p.x-c.x,p.y-c.y)/d0);o.sx=drag.o.sx*f;o.sy=drag.o.sy*f;o.sz=drag.o.sz*f;}
  else if(drag.mode==='r'){const c=sdfProj(L,R.time);let r=90-Math.atan2(p.y-c.y,p.x-c.x)*180/Math.PI;r=((r+180)%360+360)%360-180;if(e.shiftKey)r=Math.round(r/15)*15;o.ry=r;}
  syncCtl();}
export function gizmoRadius(L,t){const s=ev(L.n.s,BASEK.s,t);if(L.type==='shape')return L.p.size.v*s*Math.max(1,L.p.aspect.v);if(L.type==='obj3d')return .39*s;if(L.type==='text'||L.type==='mtext'){const m=textCache.get(L.id);return m?.5*s*Math.min(4,m.w/m.h):.5*s;}if(L.type==='image')return .55*s;return .3*s;}
export function updGizmo(t){const g=$('#gizmo');const L=sel();if(!L||R.seqPlay||!R.gizmoOn||!L.vis||R.tool==='orbit'||isSurf(L)){g.hidden=true;return;}g.hidden=false;
  const cr=cv.getBoundingClientRect(),wr=wrap.getBoundingClientRect();const {W,H}=outSize();
  let x=ev(L.n.x,BASEK.x,t),y=ev(L.n.y,BASEK.y,t),rr=(ev(L.n.r,BASEK.r,t)+L.n.spin.v*t),rw=gizmoRadius(L,t);
  const SPj=sdfProj(L,t);if(SPj){x=SPj.x;y=SPj.y;rw=SPj.r;rr=SPj.rot;}
  if(st.cam.on&&L.type!=='group'&&kindOf(L)!=='fx'){const sv=R.CAMON;R.CAMON=true;const r=camApply(L,t,x,y,1,rr);R.CAMON=sv;x=r[0];y=r[1];rw*=r[2];rr=r[3];}
  const px=cr.left-wr.left+(x/(W/H)+.5)*cr.width,py=cr.top-wr.top+(.5-y)*cr.height;
  const rad=Math.max(14,rw*cr.height);const arm=rad+26;
  g.style.transform=`translate(${px}px,${py}px)`;
  const ring=g.querySelector('.ring');ring.style.width=ring.style.height=rad*2+'px';
  const a=rr*Math.PI/180;const hr=g.querySelector('.h.r');hr.style.left=Math.sin(a)*arm+'px';hr.style.top=-Math.cos(a)*arm+'px';
  const stem=g.querySelector('.stem');stem.style.height=arm+'px';stem.style.left='-.75px';stem.style.top=-arm+'px';stem.style.transform=`rotate(${rr}deg)`;
  const hs=g.querySelector('.h.s');hs.style.left=rad*.7071+'px';hs.style.top=rad*.7071+'px';}
