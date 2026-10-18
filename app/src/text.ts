import { ASCII_ATLAS, PLACEHOLDER, gl, texFromCanvas } from './gl';
import { assets, imgTex } from './state';
import { blobState } from './blob';
import { markDirty } from './loop';
import { WIND_NOISE_ID, WIND_NOISE } from './referenceAssets';
import { altText } from './partfx';
import { lottieMediaFor } from './lottie';

export const textCache=new Map(),fontReq=new Set();
export function textLines(T,x,fsz){const raw=String(T.str||' ').split(/\r?\n|\\n/);const wrap=+T.wrap||0;const out=[];
  for(const ln of raw){if(!wrap){out.push(ln);continue;}const words=ln.split(/(\s+)/);let cur='';
    for(const w of words){if((cur+w).trim().length>wrap&&cur.trim()){out.push(cur.trimEnd());cur=w.trimStart();}else cur+=w;}out.push(cur);}
  return out.slice(0,24).map(s=>s.length?s:' ');}
/* Per-line typography (M4): T.lines[i] = {size?, dx?, gap?, weight?, font?, italic?}; size = × base size, dx = indent and
 * gap = extra space before the line, both in em of the base size. Without per-line values the layout is the old one. */
export const lineSpec=(T,i)=>(T.lines&&T.lines[i])||{};
export function textTex(L,alt=null){const T0=alt==null?L.text:{...L.text,str:alt},k=JSON.stringify(T0),ck=alt==null?L.id:L.id+'#alt';let e=textCache.get(ck);if(e&&e.k===k)return e;
  const T=T0,fsz=200,fstr=`${T.weight} ${fsz}px "${T.font}", Georgia, serif`;
  const c=document.createElement('canvas');let x=c.getContext('2d');
  const lines=textLines(T,x,fsz),n=lines.length,lh=+T.lh||1.15,align=T.align||'center';
  const LS=lines.map((_,i)=>{const q=lineSpec(T,i),sz=Math.min(6,Math.max(.1,+q.size||1)),fs=fsz*sz;
    return {sz,fs,dx:(+q.dx||0)*fsz,gap:i>0?(+q.gap||0)*fsz:0,f:`${q.italic?'italic ':''}${q.weight||T.weight} ${fs}px "${q.font||T.font}", Georgia, serif`};});
  for(const q of LS)if(!fontReq.has(q.f)&&document.fonts){fontReq.add(q.f);document.fonts.load(q.f,T.str||'A').then(()=>{for(const v of textCache.values())if(v.fs&&v.fs.includes(q.f))v.k='';markDirty();}).catch(()=>{});}
  const setF=i=>{x.font=LS[i].f;try{x.letterSpacing=(T.track*LS[i].fs)+'px';}catch(_){}};
  const widths=lines.map((s,i)=>{setF(i);return x.measureText(s).width;});
  const hs=LS.map(q=>n>1?q.fs*lh:q.fs*1.5),pad=n>1?fsz*.35:0;
  const tops=[];let acc=pad;LS.forEach((q,i)=>{acc+=q.gap;tops.push(acc);acc+=hs[i];});
  const Wneed=Math.max(8,...widths.map((w,i)=>w+2*Math.abs(LS[i].dx)));
  c.width=Math.min(4096,Math.max(8,Math.ceil(Wneed+fsz*.5)));c.height=Math.min(4096,Math.max(8,Math.round(acc+pad)));
  x=c.getContext('2d');
  const lefts=widths.map((w,i)=>Math.max(0,(align==='left'?fsz*.25:align==='right'?c.width-fsz*.25-w:c.width/2+(T.track*LS[i].fs)/2-w/2)+LS[i].dx));
  x.fillStyle='#fff';x.textAlign='left';x.textBaseline='middle';lines.forEach((s,i)=>{setF(i);x.fillText(s,lefts[i],tops[i]+hs[i]/2+LS[i].fs*.04);});
  let aux=null,info=null;const anchor=align==='left'?1:align==='right'?2:0;
  const geo=[n,pad/c.height,(hs[0]||1)/c.height,c.height/(fsz*1.5)];
  if(L.type==='mtext'){const cw=c.width,AH=2*n+1,data=new Uint8Array(cw*4*AH);for(let r=0;r<n;r++)for(let i=0;i<cw;i++)data[(r*2*cw+i)*4]=255;
    // last row = line table: texel i holds line i's top and bottom (16-bit fractions of the canvas height, from the top)
    for(let i=0;i<n;i++){const o=(2*n*cw+i)*4,t16=Math.round(tops[i]/c.height*65535),b16=Math.round((tops[i]+hs[i])/c.height*65535);data[o]=t16>>8;data[o+1]=t16&255;data[o+2]=b16>>8;data[o+3]=b16&255;}
    let ci=0,word=0,prevSpace=true;
    lines.forEach((s,li)=>{setF(li);const chars=[...s];let acc='',pw=0;const left=lefts[li],o1=li*2*cw*4,o2=o1+cw*4;prevSpace=true;
      chars.forEach(ch=>{acc+=ch;const nw=x.measureText(acc).width;const sp=/\s/.test(ch);if(!sp&&prevSpace&&ci>0)word++;prevSpace=sp;
        if(!sp&&ci<254){const a=left+pw,b=left+nw,cx16=Math.max(0,Math.min(65535,Math.round(((a+b)/2)/cw*65535)));
          const l16=Math.max(0,Math.min(65535,Math.round(a/cw*65535))),r16=Math.max(0,Math.min(65535,Math.round(b/cw*65535)));
          for(let col=Math.max(0,Math.floor(a));col<Math.min(cw,Math.ceil(b));col++){data[o1+col*4]=ci;data[o1+col*4+1]=cx16>>8;data[o1+col*4+2]=cx16&255;data[o1+col*4+3]=Math.min(255,word);
            data[o2+col*4]=l16>>8;data[o2+col*4+1]=l16&255;data[o2+col*4+2]=r16>>8;data[o2+col*4+3]=r16&255;}}
        if(!sp)ci++;pw=nw;});});
    aux=auxTex(data,cw,e&&e.aux,AH);info=[Math.max(1,ci),word+1,anchor,0];}
  else info=[0,0,anchor,0];
  const layout=lines.map((s,i)=>({str:s,top:tops[i],h:hs[i],left:lefts[i],w:widths[i]}));
  e={k,tex:texFromCanvas(c,e&&e.tex),w:c.width,h:c.height,f:fstr,fs:LS.map(q=>q.f),aux,info,geo,layout,fsz,a0:anchor===1?0:anchor===2?1:.5};textCache.set(ck,e);return e;}
export function auxTex(data,w,old,hgt=1){const t=old||gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,t);gl.pixelStorei(gl.UNPACK_ALIGNMENT,1);
  gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA8,w,hgt,0,gl.RGBA,gl.UNSIGNED_BYTE,data);gl.pixelStorei(gl.UNPACK_ALIGNMENT,4);
  gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.NEAREST);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);return t;}
export function mediaFor(L,t=null,ctx=null){if(L.type==='text'||L.type==='mtext'){const a=t==null?null:altText(L,t);return textTex(L,a);}if(L.type==='ascii')return ASCII_ATLAS;if(L.type==='blob'){const B=blobState.get(L.id);return B&&B.ovTex?{tex:B.ovTex,w:B.ow,h:B.oh}:null;}if(L.type==='lottie')return lottieMediaFor(L,t??0,ctx||{w:512,h:512});if(L.type==='image'){if(L.asset)loadAsset(L.asset);return (L.asset&&imgTex.get(L.asset))||PLACEHOLDER;}if(L.type==='custom'&&L.asset)return imgTex.get(L.asset)||null;if(L.type==='windflame'){if(!assets[WIND_NOISE_ID])assets[WIND_NOISE_ID]=WIND_NOISE;loadAsset(WIND_NOISE_ID);return imgTex.get(WIND_NOISE_ID)||null;}return null;}
const loadingAssets=new Set<string>();
export function loadAsset(id){if(imgTex.has(id)||loadingAssets.has(id)||!assets[id])return;loadingAssets.add(id);const im=new Image();im.onload=()=>{imgTex.set(id,{tex:texFromCanvas(im),w:im.naturalWidth,h:im.naturalHeight});loadingAssets.delete(id);markDirty();};im.onerror=()=>loadingAssets.delete(id);im.src=assets[id];}
