import { R } from './runtime';
import { EFFECTS } from './effects/index';
import { gl, mkCtx, mkTarget } from './gl';
import { makeLayer, walk } from './state';
import { LIB } from './library';
import { textCache } from './text';
import { present, renderScene } from './render';

export const TW=192,TH=120;R.thumbCtx=null;R.thumbOut=null;export const thumbCache={};
export function renderThumb(c0,i){return thumbOf(LIB[c0][i].make());}
/** Thumbnail canvas of any item (a fresh copy: its text cache is dropped afterwards). Appearances get a backdrop to act on. */
export function thumbOf(it){
  if(!R.thumbCtx){R.thumbCtx=mkCtx(TW,TH);R.thumbCtx.noCam=true;R.thumbOut=mkTarget(TW,TH,gl.RGBA8,gl.UNSIGNED_BYTE);}const ik=it.type==='group'?'':EFFECTS[it.type].kind;const host=it.type!=='group'&&EFFECTS[it.type].host;const items=host?[makeLayer(host[0],{p:{billow:0},fx:[[it.type,{}]]})]:(ik==='fx'||it.type==='particles')?[makeLayer('sacred',{pal:1,p:{width:1.4}}),makeLayer('shape',{pal:5,p:{kind:4,sides:5,size:.32}}),it]:[it];
  const thT=it.type==='reveal'?it.p.at.v+it.p.dur.v*.5:3;
  if(JSON.stringify(it).includes('"feedback"'))for(let k=0;k<16;k++)renderScene(items,R.thumbCtx,2.2+k*.05,'#06050b');
  if(JSON.stringify(it).includes('"fluid'))for(let k=0;k<90;k++)renderScene(items,R.thumbCtx,thT-1.5+k/60,'#06050b');   // F1: let the field develop
  const out=renderScene(items,R.thumbCtx,thT,'#06050b');present(R.thumbCtx,out.t,R.thumbOut.f,TW,TH,thT);
  const buf=new Uint8Array(TW*TH*4);gl.readPixels(0,0,TW,TH,gl.RGBA,gl.UNSIGNED_BYTE,buf);
  const c=document.createElement('canvas');c.width=TW;c.height=TH;const x=c.getContext('2d');const id=x.createImageData(TW,TH);
  for(let y=0;y<TH;y++)id.data.set(buf.subarray((TH-1-y)*TW*4,(TH-y)*TW*4),y*TW*4);x.putImageData(id,0,0);
  walk([it],L=>textCache.delete(L.id));return c;}
