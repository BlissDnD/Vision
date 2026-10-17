import { R } from './runtime';
import { TAU } from './dom';
import { palJS } from './palettes';
import { BASEK, BLOB_PD } from './effects/index';
import { freeTarget, gl, mkTarget, texFromCanvas } from './gl';
import { ev } from './evaluation';
import { copyTo } from './render';

export const blobState=new Map();R.smallT=null;
/** Forget tracking history of a render context (seek, loop wrap, export start), like feedback history. */
export function resetBlobs(ctx){for(const B of blobState.values())if(B.ctx===ctx){B.tracks=[];B.next=1;B.prev=null;B.stepped=false;}}
/* deterministic per-tick noise instead of Math.random(): same t -> same jitter/flicker/scramble */
const tickN=t=>Math.floor(t*60+1e-6);
export function getSmall(w,hh){if(!R.smallT||R.smallT.w!==w||R.smallT.h!==hh){freeTarget(R.smallT);R.smallT=mkTarget(w,hh,gl.RGBA8,gl.UNSIGNED_BYTE);}return R.smallT;}
export const hash1=x=>{const s=Math.sin(x*127.1)*43758.5453;return s-Math.floor(s);};
export const BLOB_FONTS=['"SF Mono",Menlo,Consolas,monospace','-apple-system,"Segoe UI",system-ui,sans-serif','Orbitron,sans-serif','"Major Mono Display",monospace'];
export function blobPrep(L,ctx,t,inTex){
  let B=blobState.get(L.id);
  if(!B){B={tracks:[],next:1,prev:null,ov:document.createElement('canvas'),mk:document.createElement('canvas'),ovTex:null,mkTex:null};blobState.set(L.id,B);}
  B.last=performance.now();B.ctx=ctx;
  const P=k=>ev(L.p[k],BLOB_PD[k],t);const W=ctx.w,H=ctx.h;
  // shared clock: tracking state only advances on sim ticks; a compose-only frame (paused, exact export) redraws it
  if(ctx.advance===false&&B.stepped){drawBlobOverlay(L,B,W,H,t,P);return B;}
  B.stepped=true;
  const src=Math.round(L.p.source.v);const count=Math.max(1,Math.round(P('count')));
  if(src===4){const sp=P('wander');B.tracks=[];
    for(let i=0;i<count;i++){const s1=hash1(i*7.13+1),s2=hash1(i*3.71+2),k=sp*(0.2+s1);
      B.tracks.push({id:i+1,x:.5+.42*Math.sin(t*k*.7+s1*20)*Math.cos(t*k*.31+s2*9),y:.5+.4*Math.sin(t*k*.53+s2*17),w:.04+.05*s1,h:.04+.05*s2,v:1});}
  }else{
    const gw=Math.max(16,Math.round(P('res'))),gh=Math.max(8,Math.round(gw*H/W)),N=gw*gh;
    const sm=getSmall(gw,gh);copyTo(inTex,sm);
    if(!B.buf||B.buf.length!==N*4)B.buf=new Uint8Array(N*4);const buf=B.buf;
    gl.readPixels(0,0,gw,gh,gl.RGBA,gl.UNSIGNED_BYTE,buf);
    if(!B.v||B.v.length!==N){B.v=new Float32Array(N);B.lab=new Int32Array(N);B.prev=null;}
    const v=B.v,lum=new Float32Array(N),prev=B.prev;
    for(let i=0;i<N;i++){const r=buf[i*4]/255,g=buf[i*4+1]/255,b=buf[i*4+2]/255,l=.299*r+.587*g+.114*b;lum[i]=l;
      v[i]=src===0?l:src===1?(buf[i*4+3]>10?1-l:0):src===2?(prev?Math.min(1,Math.abs(l-prev[i])*6):0):(Math.max(r,g,b)-Math.min(r,g,b));}
    B.prev=lum;const th=P('thresh');let dets;
    if(Math.round(L.p.detect.v)===1){const cand=[];
      for(let y=1;y<gh-1;y++)for(let x=1;x<gw-1;x++){const i=y*gw+x,c=v[i];if(c<th)continue;
        if(c>=v[i-1]&&c>=v[i+1]&&c>=v[i-gw]&&c>=v[i+gw]&&c>=v[i-gw-1]&&c>=v[i-gw+1]&&c>=v[i+gw-1]&&c>=v[i+gw+1])cand.push([x,y,c]);}
      cand.sort((a,b)=>b[2]-a[2]);const sp=P('spacing'),acc=[];
      for(const c of cand){if(acc.length>=count)break;if(acc.every(a=>(a[0]-c[0])**2+(a[1]-c[1])**2>=sp*sp))acc.push(c);}
      dets=acc.map(([x,y,c])=>({x:(x+.5)/gw,y:1-(y+.5)/gh,w:0,h:0,v:c}));
    }else{const lab=B.lab;lab.fill(0);let nl=0;const comps=[],stack=[];const minA=P('minarea');
      for(let i=0;i<N;i++){if(lab[i]||v[i]<th)continue;nl++;let x0=1e9,x1=-1,y0=1e9,y1=-1,sx=0,sy=0,cnt=0,pk=0;stack.length=0;stack.push(i);lab[i]=nl;
        while(stack.length){const j=stack.pop();const x=j%gw,y=(j/gw)|0;cnt++;sx+=x;sy+=y;if(x<x0)x0=x;if(x>x1)x1=x;if(y<y0)y0=y;if(y>y1)y1=y;if(v[j]>pk)pk=v[j];
          if(x>0&&!lab[j-1]&&v[j-1]>=th){lab[j-1]=nl;stack.push(j-1);}if(x<gw-1&&!lab[j+1]&&v[j+1]>=th){lab[j+1]=nl;stack.push(j+1);}
          if(y>0&&!lab[j-gw]&&v[j-gw]>=th){lab[j-gw]=nl;stack.push(j-gw);}if(y<gh-1&&!lab[j+gw]&&v[j+gw]>=th){lab[j+gw]=nl;stack.push(j+gw);}}
        if(cnt>=minA)comps.push({x:(sx/cnt+.5)/gw,y:1-(sy/cnt+.5)/gh,w:(x1-x0+1)/gw,h:(y1-y0+1)/gh,v:pk*Math.sqrt(cnt)});}
      comps.sort((a,b)=>b.v-a.v);dets=comps.slice(0,count);}
    const k=1-Math.min(.98,Math.max(0,P('smooth'))),persist=Math.round(P('persist'));
    for(const tr of B.tracks)tr.hit=false;
    for(const d of dets){let best=null,bd=.15*.15;for(const tr of B.tracks){if(tr.hit)continue;const dd=(tr.x-d.x)**2+(tr.y-d.y)**2;if(dd<bd){bd=dd;best=tr;}}
      if(best){best.x+=(d.x-best.x)*k;best.y+=(d.y-best.y)*k;best.w+=(d.w-best.w)*k;best.h+=(d.h-best.h)*k;best.v=d.v;best.hit=true;best.miss=0;}
      else B.tracks.push({...d,id:B.next++,hit:true,miss:0});}
    B.tracks=B.tracks.filter(tr=>tr.hit||(++tr.miss)<=persist);
  }
  drawBlobOverlay(L,B,W,H,t,P);return B;}
export const rnd=(a,b,c)=>hash1(a*12.9898+b*78.233+c*37.719);
export function blobLabel(L,mode,b){const tr=b.tr,f=n=>n.toFixed(3),id=String(tr.id).padStart(3,'0');
  switch(mode){case 1:return '#'+id;case 2:return `x ${f(tr.x)}  y ${f(1-tr.y)}`;case 3:return `${Math.round(tr.x*1000)}, ${Math.round(tr.y*1000)}`;
    case 4:return `${Math.round(b.bw)}×${Math.round(b.bh)}`;case 5:return '0x'+((tr.id*2654435761)>>>0).toString(16).toUpperCase().slice(0,6);
    case 6:return String(L.btext||'').replace(/\{id\}/g,id).replace(/\{x\}/g,f(tr.x)).replace(/\{y\}/g,f(1-tr.y)).replace(/\{w\}/g,String(Math.round(b.bw))).replace(/\{h\}/g,String(Math.round(b.bh))).replace(/\{v\}/g,(tr.v||0).toFixed(2)).replace(/\\n/g,'\n');
    default:return `#${id}\n${f(tr.x)}, ${f(1-tr.y)}`;}}
export function scrambleTxt(s,p,seed=0){const C='01ABCDEF#$%&*<>/=+';return [...s].map((c,i)=>c!=='\n'&&c!==' '&&rnd(seed,i,4)<p*.5?C[(rnd(seed,i,5)*C.length)|0]:c).join('');}
export function drawBlobOverlay(L,B,W,H,t,P){
  const os=Math.min(1,1600/W),cw=Math.max(2,Math.round(W*os)),ch=Math.max(2,Math.round(H*os)),mw=Math.max(2,cw>>1),mh=Math.max(2,ch>>1);
  if(B.ov.width!==cw||B.ov.height!==ch){B.ov.width=cw;B.ov.height=ch;}if(B.mk.width!==mw||B.mk.height!==mh){B.mk.width=mw;B.mk.height=mh;}
  const g=B.ov.getContext('2d'),m=B.mk.getContext('2d');g.setTransform(1,0,0,1,0,0);g.clearRect(0,0,cw,ch);m.setTransform(1,0,0,1,0,0);m.clearRect(0,0,mw,mh);m.setTransform(mw/cw,0,0,mh/ch,0,0);m.fillStyle='#fff';
  const u=ch/540,style=Math.round(L.p.style.v),cm=Math.round(L.p.colormode.v),link=Math.round(L.p.link.v),lab=Math.round(L.p.label.v),hue=ev(L.n.hue,BASEK.hue,t);
  const colFor=(tr,i)=>{if(cm===0)return L.p.color.v;const c=palJS(L.pal,cm===1?((tr.id*.618)%1)+hue:t*.15+i*.07+hue);return `rgb(${c.map(x=>Math.round(x*255))})`;};
  const tk=tickN(t),sizemode=Math.round(L.p.sizemode.v),fixed=P('box')*ch,mul=P('sizemul'),jit=P('jitter'),flick=P('flicker');
  const boxes=B.tracks.map((tr,i)=>{let bw,bh;if(sizemode===0&&tr.w>0){bw=tr.w*cw*mul;bh=tr.h*ch*mul;}else{bw=bh=fixed;}bw=Math.max(bw,4*u);bh=Math.max(bh,4*u);
    let x=tr.x*cw,y=tr.y*ch;if(jit>0){x+=(rnd(tk,tr.id,1)-.5)*jit*14*u;y+=(rnd(tk,tr.id,2)-.5)*jit*14*u;}
    return {tr,i,x,y,bw,bh,col:colFor(tr,i),on:!(flick>0&&rnd(tk,tr.id,3)<flick*.5)};});
  const lw=Math.max(.5,P('width')*u);g.lineWidth=lw;g.lineCap='round';g.lineJoin='round';const dash=Math.round(L.p.dash.v)?[6*u,4*u]:[];g.setLineDash(dash);
  if(link>0&&boxes.length>1){const la=P('linkalpha'),curve=P('curve');
    const line=(a,b,al)=>{g.globalAlpha=Math.max(0,Math.min(1,la*al));g.strokeStyle=a.col;g.beginPath();g.moveTo(a.x,a.y);
      if(curve){const mx=(a.x+b.x)/2,my=(a.y+b.y)/2,dx=b.x-a.x,dy=b.y-a.y;g.quadraticCurveTo(mx-dy*curve*.5,my+dx*curve*.5,b.x,b.y);}else g.lineTo(b.x,b.y);g.stroke();};
    if(link===1){const s=[...boxes].sort((a,b)=>a.tr.id-b.tr.id);for(let i=1;i<s.length;i++)line(s[i-1],s[i],1);}
    else if(link===2){const kk=Math.round(P('nearest'));for(const a of boxes){const ns=boxes.filter(b=>b!==a).sort((p,q)=>((p.x-a.x)**2+(p.y-a.y)**2)-((q.x-a.x)**2+(q.y-a.y)**2)).slice(0,kk);for(const b of ns)line(a,b,1);}}
    else if(link===3){const md=P('linkdist')*ch;for(let i=0;i<boxes.length;i++)for(let j=i+1;j<boxes.length;j++){const d=Math.hypot(boxes[i].x-boxes[j].x,boxes[i].y-boxes[j].y);if(d<md)line(boxes[i],boxes[j],1-d/md);}}
    else if(link===4){const c={x:boxes.reduce((s,b)=>s+b.x,0)/boxes.length,y:boxes.reduce((s,b)=>s+b.y,0)/boxes.length};for(const a of boxes)line(a,c,1);}
    g.globalAlpha=1;}
  if(Math.round(L.p.guides.v)){g.save();g.globalAlpha=.28;g.setLineDash([2*u,4*u]);for(const b of boxes){g.strokeStyle=b.col;g.beginPath();g.moveTo(0,b.y);g.lineTo(cw,b.y);g.moveTo(b.x,0);g.lineTo(b.x,ch);g.stroke();}g.restore();g.setLineDash(dash);}
  const fill=P('fill'),fsz=Math.max(3,P('fsize')*u),tag=Math.round(L.p.tag.v),scr=P('scramble');
  g.font=`500 ${fsz}px ${BLOB_FONTS[Math.round(L.p.font.v)]||BLOB_FONTS[0]}`;g.textBaseline='bottom';
  for(const b of boxes){if(!b.on)continue;const {x,y,bw,bh,col}=b,x0=x-bw/2,y0=y-bh/2,rad=Math.max(bw,bh)/2;
    if(style===2){m.beginPath();m.arc(x,y,rad,0,TAU);m.fill();}else m.fillRect(x0,y0,bw,bh);
    g.strokeStyle=col;g.fillStyle=col;
    if(fill>0){g.globalAlpha=fill*.6;if(style===2){g.beginPath();g.arc(x,y,rad,0,TAU);g.fill();}else g.fillRect(x0,y0,bw,bh);g.globalAlpha=1;}
    g.beginPath();
    if(style===0)g.rect(x0,y0,bw,bh);
    else if(style===1){const l=Math.min(bw,bh)*.28;g.moveTo(x0,y0+l);g.lineTo(x0,y0);g.lineTo(x0+l,y0);g.moveTo(x0+bw-l,y0);g.lineTo(x0+bw,y0);g.lineTo(x0+bw,y0+l);
      g.moveTo(x0+bw,y0+bh-l);g.lineTo(x0+bw,y0+bh);g.lineTo(x0+bw-l,y0+bh);g.moveTo(x0+l,y0+bh);g.lineTo(x0,y0+bh);g.lineTo(x0,y0+bh-l);}
    else if(style===2)g.arc(x,y,rad,0,TAU);
    else if(style===3){g.moveTo(x-rad*1.4,y);g.lineTo(x-rad*.35,y);g.moveTo(x+rad*.35,y);g.lineTo(x+rad*1.4,y);g.moveTo(x,y-rad*1.4);g.lineTo(x,y-rad*.35);g.moveTo(x,y+rad*.35);g.lineTo(x,y+rad*1.4);g.moveTo(x+rad*.6,y);g.arc(x,y,rad*.6,0,TAU);}
    else if(style===4){g.arc(x,y,Math.max(2*u,lw*1.6),0,TAU);g.fill();}
    else if(style===5){g.moveTo(x,y-bh/2);g.lineTo(x+bw/2,y);g.lineTo(x,y+bh/2);g.lineTo(x-bw/2,y);g.closePath();}
    if(style<4||style===5)g.stroke();
    if(lab>0){let txt=blobLabel(L,lab,b);if(scr>0)txt=scrambleTxt(txt,scr,tk*131+b.tr.id);const lx=(style===2||style===3)?x+rad*.75:x0;let ty=(style===2||style===3)?y-rad*.75:y0-3*u;
      for(const ln of txt.split('\n').reverse()){if(tag){const tw=g.measureText(ln).width;g.fillStyle=col;g.fillRect(lx-u,ty-fsz-u,tw+4*u,fsz+3*u);g.fillStyle='#000';g.fillText(ln,lx+u,ty+u);ty-=fsz+5*u;}
        else{g.fillStyle=col;g.fillText(ln,lx,ty);ty-=fsz*1.15;}}}}
  B.ovTex=texFromCanvas(B.ov,B.ovTex);B.mkTex=texFromCanvas(B.mk,B.mkTex);B.ow=cw;B.oh=ch;}
// the main preview keeps its tracking while paused (shared clock); other contexts (thumbs, resized-away) are collected
export function gcBlobs(){const now=performance.now();for(const [id,B] of blobState)if(B.ctx!==R.main&&now-B.last>4000){if(B.ovTex)gl.deleteTexture(B.ovTex);if(B.mkTex)gl.deleteTexture(B.mkTex);blobState.delete(id);}}
setInterval(gcBlobs,5000);
