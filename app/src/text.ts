import { ASCII_ATLAS, PLACEHOLDER, gl, texFromCanvas } from './gl';
import { assets, imgTex } from './state';
import { blobState } from './blob';
import { markDirty } from './loop';

export const textCache=new Map(),fontReq=new Set();
export function textLines(T,x,fsz){const raw=String(T.str||' ').split(/\r?\n|\\n/);const wrap=+T.wrap||0;const out=[];
  for(const ln of raw){if(!wrap){out.push(ln);continue;}const words=ln.split(/(\s+)/);let cur='';
    for(const w of words){if((cur+w).trim().length>wrap&&cur.trim()){out.push(cur.trimEnd());cur=w.trimStart();}else cur+=w;}out.push(cur);}
  return out.slice(0,24).map(s=>s.length?s:' ');}
export function textTex(L){const k=JSON.stringify(L.text);let e=textCache.get(L.id);if(e&&e.k===k)return e;
  const T=L.text,fsz=200,fstr=`${T.weight} ${fsz}px "${T.font}", Georgia, serif`;
  if(!fontReq.has(fstr)&&document.fonts){fontReq.add(fstr);document.fonts.load(fstr,T.str||'A').then(()=>{for(const v of textCache.values())if(v.f===fstr)v.k='';markDirty();}).catch(()=>{});}
  const c=document.createElement('canvas');let x=c.getContext('2d');const setF=()=>{x.font=fstr;try{x.letterSpacing=(T.track*fsz)+'px';}catch(_){}};setF();
  const lines=textLines(T,x,fsz),n=lines.length,lh=+T.lh||1.15,align=T.align||'center';
  const widths=lines.map(s=>x.measureText(s).width),Wmax=Math.max(8,...widths);
  const bh=n>1?fsz*lh:fsz*1.5;c.width=Math.min(4096,Math.max(8,Math.ceil(Wmax+fsz*.5)));c.height=Math.min(4096,Math.round(n>1?fsz*.35*2+n*bh:fsz*1.5));
  x=c.getContext('2d');setF();const m0=(c.height-n*bh)/2;
  const lefts=widths.map(w=>align==='left'?fsz*.25:align==='right'?c.width-fsz*.25-w:c.width/2+(T.track*fsz)/2-w/2);
  x.fillStyle='#fff';x.textAlign='left';x.textBaseline='middle';lines.forEach((s,i)=>x.fillText(s,lefts[i],m0+(i+.5)*bh+fsz*.04));
  let aux=null,info=null;const anchor=align==='left'?1:align==='right'?2:0;
  const geo=[n,m0/c.height,bh/c.height,c.height/(fsz*1.5)];
  if(L.type==='mtext'){const cw=c.width,data=new Uint8Array(cw*8*n);for(let r=0;r<n;r++)for(let i=0;i<cw;i++)data[(r*2*cw+i)*4]=255;
    let ci=0,word=0,prevSpace=true;
    lines.forEach((s,li)=>{const chars=[...s];let acc='',pw=0;const left=lefts[li],o1=li*2*cw*4,o2=o1+cw*4;prevSpace=true;
      chars.forEach(ch=>{acc+=ch;const nw=x.measureText(acc).width;const sp=/\s/.test(ch);if(!sp&&prevSpace&&ci>0)word++;prevSpace=sp;
        if(!sp&&ci<254){const a=left+pw,b=left+nw,cx16=Math.max(0,Math.min(65535,Math.round(((a+b)/2)/cw*65535)));
          const l16=Math.max(0,Math.min(65535,Math.round(a/cw*65535))),r16=Math.max(0,Math.min(65535,Math.round(b/cw*65535)));
          for(let col=Math.max(0,Math.floor(a));col<Math.min(cw,Math.ceil(b));col++){data[o1+col*4]=ci;data[o1+col*4+1]=cx16>>8;data[o1+col*4+2]=cx16&255;data[o1+col*4+3]=Math.min(255,word);
            data[o2+col*4]=l16>>8;data[o2+col*4+1]=l16&255;data[o2+col*4+2]=r16>>8;data[o2+col*4+3]=r16&255;}}
        if(!sp)ci++;pw=nw;});});
    aux=auxTex(data,cw,e&&e.aux,2*n);info=[Math.max(1,ci),word+1,anchor,0];}
  else info=[0,0,anchor,0];
  e={k,tex:texFromCanvas(c,e&&e.tex),w:c.width,h:c.height,f:fstr,aux,info,geo};textCache.set(L.id,e);return e;}
export function auxTex(data,w,old,hgt=1){const t=old||gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,t);gl.pixelStorei(gl.UNPACK_ALIGNMENT,1);
  gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA8,w,hgt,0,gl.RGBA,gl.UNSIGNED_BYTE,data);gl.pixelStorei(gl.UNPACK_ALIGNMENT,4);
  gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.NEAREST);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);return t;}
export function mediaFor(L){if(L.type==='text'||L.type==='mtext')return textTex(L);if(L.type==='ascii')return ASCII_ATLAS;if(L.type==='blob'){const B=blobState.get(L.id);return B&&B.ovTex?{tex:B.ovTex,w:B.ow,h:B.oh}:null;}if(L.type==='image')return (L.asset&&imgTex.get(L.asset))||PLACEHOLDER;return null;}
export function loadAsset(id){if(imgTex.has(id)||!assets[id])return;const im=new Image();im.onload=()=>{imgTex.set(id,{tex:texFromCanvas(im),w:im.naturalWidth,h:im.naturalHeight});markDirty();};im.src=assets[id];}
