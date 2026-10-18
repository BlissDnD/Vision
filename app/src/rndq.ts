/** Q1: Random quality filter. Renders a generated scene small, measures "ugliness" symptoms (dark, muddy, flat, noisy,
 * cluttered, no focus, garish, hard cut, pixelated) into a 0–100 score with Hungarian reasons, and finds the one effect
 * that causes noise/pixelation/cuts (measure again without it) so only that effect is weakened or removed. */
import { R } from './runtime';
import { gl, mkCtx, mkTarget, freeCtx } from './gl';
import { present, renderScene } from './render';
import { resetSim } from './sim';
import { st, walk } from './state';
import { EFFECTS } from './effects/index';

const clamp01=x=>x<0?0:x>1?1:x;
const ramp=(x,a,b)=>clamp01((x-a)/(b-a));

/** Raw image statistics of an RGBA8 buffer (any row order). */
export function measureImg(buf:Uint8Array,W:number,H:number){
  const N=W*H,L=new Float32Array(N);for(let i=0,j=0;i<N;i++,j+=4)L[i]=(.2126*buf[j]+.7152*buf[j+1]+.0722*buf[j+2])/255;
  // coarse grid (≈96 wide) for colour / layout measures
  const gw=Math.min(96,W),gh=Math.max(1,Math.round(gw*H/W)),G=gw*gh,gr=new Float32Array(G),gg=new Float32Array(G),gb=new Float32Array(G),gc=new Float32Array(G);
  for(let y=0;y<H;y++){const cy=Math.min(gh-1,(y*gh/H)|0);for(let x=0;x<W;x++){const c=cy*gw+Math.min(gw-1,(x*gw/W)|0),j=(y*W+x)*4;gr[c]+=buf[j];gg[c]+=buf[j+1];gb[c]+=buf[j+2];gc[c]++;}}
  const gL=new Float32Array(G);for(let c=0;c<G;c++){const n=gc[c]*255||1;gr[c]/=n;gg[c]/=n;gb[c]/=n;gL[c]=.2126*gr[c]+.7152*gg[c]+.0722*gb[c];}
  let mean=0,bright=0;for(let c=0;c<G;c++){mean+=gL[c];if(gL[c]>.96)bright++;}mean/=G;bright/=G;
  let v=0;for(let c=0;c<G;c++)v+=(gL[c]-mean)**2;const std=Math.sqrt(v/G);
  const srt=Array.from(gL).sort((a,b)=>a-b),p5=srt[(G*.05)|0],p95=srt[Math.min(G-1,(G*.95)|0)];
  // colourfulness (Hasler–Süsstrunk, 0–255 units), muddy (dull warm midtones), garish (competing strong hues)
  let mrg=0,myb=0,srg=0,syb=0,mud=0,lit=0,strong=0;const bins=new Float32Array(12);
  for(let c=0;c<G;c++){const r=gr[c],g=gg[c],b=gb[c],rg=(r-g)*255,yb=(.5*(r+g)-b)*255;mrg+=rg;myb+=yb;srg+=rg*rg;syb+=yb*yb;
    const mx=Math.max(r,g,b),mn=Math.min(r,g,b),s=mx>0?(mx-mn)/mx:0;if(mx<.06)continue;lit++;
    let hh=0;if(mx>mn){hh=mx===r?((g-b)/(mx-mn))%6:mx===g?(b-r)/(mx-mn)+2:(r-g)/(mx-mn)+4;hh*=60;if(hh<0)hh+=360;}
    if(hh>=18&&hh<=85&&s>=.18&&s<=.8&&mx<=.55)mud++;
    if(s>.45&&mx>.35){strong++;bins[Math.min(11,(hh/30)|0)]++;}}
  mrg/=G;myb/=G;const colorful=Math.sqrt(Math.max(0,srg/G-mrg*mrg)+Math.max(0,syb/G-myb*myb))+.3*Math.hypot(mrg,myb);
  let hues=0;for(let i=0;i<12;i++){const on=bins[i]/G>.035,prev=bins[(i+11)%12]/G>.035;if(on&&!prev)hues++;}if(hues===0&&bins.every(b=>b/G>.035))hues=1;
  // structure on the grid: edge density and focus (one region standing out)
  let edges=0;for(let y=0;y<gh-1;y++)for(let x=0;x<gw-1;x++){const c=y*gw+x;if(Math.abs(gL[c+1]-gL[c])+Math.abs(gL[c+gw]-gL[c])>.12)edges++;}edges/=Math.max(1,(gw-1)*(gh-1));
  const RX=12,RY=8,inter:number[]=[];for(let ry=0;ry<RY;ry++)for(let rx=0;rx<RX;rx++){let s=0,s2=0,n=0;for(let y=(ry*gh/RY)|0;y<(((ry+1)*gh/RY)|0);y++)for(let x=(rx*gw/RX)|0;x<(((rx+1)*gw/RX)|0);x++){const l=gL[y*gw+x];s+=l;s2+=l*l;n++;}
    const m=s/(n||1);inter.push(Math.sqrt(Math.max(0,s2/(n||1)-m*m))+Math.abs(m-mean)+.004);}
  const si=[...inter].sort((a,b)=>b-a),tot=si.reduce((a,b)=>a+b,0),top=Math.ceil(si.length*.15);let ts=0;for(let i=0;i<top;i++)ts+=si[i];const focus=ts/(tot||1);
  // full-res speckle: isolated dots, i.e. pixels brighter (or darker) than all 4 neighbours by a clear margin, in luma or
  // in one colour channel (RGB dots). Thin lines are not isolated along their direction, so they do not count.
  const iso=(c:number,l:number,r:number,u:number,d:number)=>(c-Math.max(l,r,u,d)>.06)||(Math.min(l,r,u,d)-c>.06);
  let speck=0;for(let y=1;y<H-1;y++)for(let x=1;x<W-1;x++){const i=y*W+x;let hit=iso(L[i],L[i-1],L[i+1],L[i-W],L[i+W]);
    if(!hit){const j=i*4;for(let k=0;k<3&&!hit;k++)hit=iso(buf[j+k]/255,buf[j+k-4]/255,buf[j+k+4]/255,buf[j+k-W*4]/255,buf[j+k+W*4]/255);}if(hit)speck++;}
  speck/=Math.max(1,(W-2)*(H-2));
  // a run must sit on one exact line: per sample the sharpest 1-px step near b stays within ±1 px (a curved rim drifts)
  const cutRun=(along:number,across:number,at:(a:number,b:number)=>number)=>{let best=0;const m=Math.max(3,Math.round(across*.02)),q=Math.max(2,Math.round(across*.004)),win=4*q;
    const stepAt=(a:number,b:number)=>{const s=at(a,b+q)-at(a,b-q);return s>.07?1:s<-.07?-1:0;};
    const straight=(a0:number,a1:number,b:number)=>{const pos:number[]=[];for(let a=a0;a<a1;a+=2){let bm=b,dm=-1;for(let c=b-win;c<=b+win;c++){const d=Math.abs(at(a,c+1)-at(a,c));if(d>dm){dm=d;bm=c;}}pos.push(dm>.03?bm:-99);}
      const cnt=new Map<number,number>();for(const p of pos)cnt.set(p,(cnt.get(p)||0)+1);let mode=-99,mc=0;for(const [p,c] of cnt)if(p!==-99&&c>mc){mc=c;mode=p;}
      let ok=0;for(const p of pos)if(Math.abs(p-mode)<=1)ok++;return ok>=pos.length*.85;};
    for(let b=m+win;b<across-m-win-1;b++){let run=0,sg=0,a0=0;
      const close=(a1:number)=>{if(run<along*.12||run<=best||!sg)return;if(straight(a0,a1,b))best=run;};
      for(let a=0;a<along;a++){const sn=stepAt(a,b);if(sn&&sn===sg)run++;else{close(a);run=sn?1:0;sg=sn;a0=a;}}close(along);}
    return best/along;};
  const cutH=cutRun(W,H,(x,y)=>L[y*W+x]),cutV=cutRun(H,W,(y,x)=>L[y*W+x]);
  // pixelation: gradient energy concentrated on one phase of a short (also fractional) period, in both directions
  const PS:number[]=[];for(let P=3;P<=16.01;P+=.25)PS.push(P);const NB=8;
  const per=(horiz:boolean)=>{const tot=new Float64Array(PS.length*NB),cb=new Float64Array(PS.length*NB);let all=0,n=0;const len=horiz?W:H;
    for(let p=1;p<len;p++)for(let k=0;k<PS.length;k++){const P=PS[k];cb[k*NB+(((p%P)/P*NB)|0)]++;}
    for(let y=1;y<H;y+=horiz?2:1)for(let x=1;x<W;x+=horiz?1:2){n++;const i=y*W+x,d=horiz?Math.abs(L[i]-L[i-1]):Math.abs(L[i]-L[i-W]);if(d<.04)continue;all+=d;const p=horiz?x:y;
      for(let k=0;k<PS.length;k++){const P=PS[k];tot[k*NB+(((p%P)/P*NB)|0)]+=d;}}
    if(all<n*.002)return 1;const per1=all/(len-1);let best=1;
    for(let k=0;k<PS.length;k++)for(let b=0;b<NB;b++){const c=cb[k*NB+b];if(c<(len-1)*.06)continue;const pk=tot[k*NB+b]/c/per1;if(pk>best)best=pk;}return best;};
  const blocky=Math.min(per(true),per(false));
  return {mean,bright,std,p5,p95,colorful,mud:mud/G,lit:lit/G,strong:strong/G,hues,edges,focus,speck,cut:Math.max(cutH,cutV),blocky};
}

/** Symptom list: add a row to recognise a new kind of ugliness. p(stats) → 0..1, w = weight in the 0–100 score. */
export const SYMPTOMS:{k:string,name:string,w:number,p:(s:any)=>number,fixable?:boolean}[]=[
  {k:'dark',name:'túl sötét',w:.7,p:s=>ramp(.06-s.mean,0,.04)*ramp(.08-s.p95,-.04,.06)},
  {k:'burnt',name:'beégett',w:.5,p:s=>ramp(s.bright,.3,.6)},
  {k:'mud',name:'sáros',w:.55,p:s=>ramp(s.mud,.45,.75)*ramp(40-s.colorful,0,22)},
  {k:'flat',name:'lapos',w:.45,p:s=>ramp(.07-s.std,0,.05)*ramp(.25-(s.p95-s.p5),0,.15)},
  {k:'noise',name:'zajos',w:.7,p:s=>ramp(s.speck,.02,.06),fixable:true},
  {k:'clutter',name:'zsúfolt',w:.4,p:s=>ramp(s.edges,.3,.55)},
  {k:'nofocus',name:'nincs fókusz',w:.25,p:s=>ramp(.3-s.focus,0,.08)},
  {k:'garish',name:'túl tarka',w:.45,p:s=>ramp(s.hues,3,5)*ramp(s.strong,.12,.3)},
  {k:'cut',name:'kemény vágás',w:.6,p:s=>ramp(s.cut,.18,.35),fixable:true},
  {k:'pixel',name:'pixeles',w:.6,p:s=>ramp(s.blocky,1.5,2.3),fixable:true},
];
export const qThreshold=(strict:number)=>40+40*clamp01(strict);
/** Score from per-symptom penalties: 100 − Σ w·p·100. `sym` lists the noticeable ones, worst first. */
export function scoreSym(ps:Record<string,number>,strict=.5){let sc=100;const sym:any[]=[];
  for(const S of SYMPTOMS){const p=ps[S.k]||0;sc-=S.w*p*100;if(S.w*p>=.12)sym.push({k:S.k,name:S.name,p,w:S.w});}
  sym.sort((a,b)=>b.w*b.p-a.w*a.p);sc=Math.max(0,Math.round(sc));return {score:sc,sym,pass:sc>=qThreshold(strict),ps};}
export function judgeStats(stats:any[],strict=.5){const ps:any={};for(const S of SYMPTOMS){const v=stats.map(S.p);ps[S.k]=S.k==='cut'?Math.max(...v):v.reduce((a,b)=>a+b,0)/v.length;}return scoreSym(ps,strict);}

/** Render `items` with `look` at a few times on a private context and return the RGBA buffers. */
export const QW=()=>{const w=Math.min(640,R.main?R.main.w:640);return [w,Math.max(2,Math.round(w*(R.main?R.main.h/R.main.w:9/16)))];};
export function capture(items:any[],look:any,bg:string,times=[1.2,3.4]){
  const [w,h]=QW();if(!R.qCtx||R.qCtx.w!==w||R.qCtx.h!==h){if(R.qCtx){freeCtx(R.qCtx);gl.deleteFramebuffer(R.qOut.f);gl.deleteTexture(R.qOut.t);}R.qCtx=mkCtx(w,h);R.qCtx.noCam=true;R.qOut=mkTarget(w,h,gl.RGBA8,gl.UNSIGNED_BYTE);}
  const ctx=R.qCtx,save=st.look;st.look=look;const out:Uint8Array[]=[];
  try{resetSim(ctx);for(const x of ctx.hist.values())x.used=false;
    let fb=false;walk(items,L=>{if(L.type==='feedback'||(L.fx||[]).some(f=>f.type==='feedback'))fb=true;});
    for(const t of times){if(fb)for(let k=0;k<8;k++)renderScene(items,ctx,t-.4+k*.05,bg);
      const o=renderScene(items,ctx,t,bg);present(ctx,o.t,R.qOut.f,w,h,t);const b=new Uint8Array(w*h*4);gl.readPixels(0,0,w,h,gl.RGBA,gl.UNSIGNED_BYTE,b);out.push(b);}}
  finally{st.look=save;}
  return {bufs:out,w,h};}
export function judgeScene(items:any[],look:any,bg:string,strict=.5){const c=capture(items,look,bg);return judgeStats(c.bufs.map(b=>measureImg(b,c.w,c.h)),strict);}

/** Effects that can alone make a frame noisy, blocky or cut. */
export const SUSPECTS=new Set(['film','texture','glitch','chroma','ascii','halftone','pixelart','feedback','projector','crt','vhs','edge','mirror','kaleido']);
const FIXK=['noise','pixel','cut'];
/** Distortions that ghost when half-transparent: these are removed, not weakened. */
const NOWEAK=new Set(['mirror','kaleido','feedback']);
/** If the failure is noise / pixelation / a hard cut, find the effect causing it and weaken (opacity) or remove only that.
 * Mutates `group` / `look`. Returns {q, msgs} or null when no single culprit explains it. */
export function fixCulprit(group:any,look:any,bg:string,q:any,strict=.5){
  const bad=q.sym.filter(s=>FIXK.includes(s.k)).map(s=>s.k);if(!bad.length)return null;
  const cands:any[]=[];walk([group],(L,list)=>{if(L!==group&&SUSPECTS.has(L.type)&&L.vis!==false)cands.push({L,list});});
  const lp=look&&look.p;if(lp&&lp.grain&&lp.grain.v>.15)cands.push({look:'grain'});if(lp&&lp.chroma&&lp.chroma.v>.2)cands.push({look:'chroma'});
  const better=(r)=>bad.every(k=>(r.ps[k]||0)<Math.max(.3,(q.ps[k]||0)-.4));
  for(const c of cands){
    if(c.look){const k=c.look,v0=lp[k].v;lp[k].v=0;const r=judgeScene([group],look,bg,strict);if(better(r)){lp[k].v=v0*.3;const r2=judgeScene([group],look,bg,strict);
        if(better(r2))return {q:r2,msgs:[`a Kinézet ${k==='grain'?'szemcséje':'színcsúszása'} ${bad.map(nameOf).join(', ')} volt, gyengítettem`]};lp[k].v=0;return {q:r,msgs:[`a Kinézet ${k==='grain'?'szemcséjét':'színcsúszását'} kivettem (${bad.map(nameOf).join(', ')})`]};}
      lp[k].v=v0;continue;}
    const L=c.L;L.vis=false;const r=judgeScene([group],look,bg,strict);L.vis=true;if(!better(r))continue;
    const nm=EFFECTS[L.type]?.name||L.type,o0=L.n.opacity.v,warp=NOWEAK.has(L.type);let r2:any=null;if(!warp){L.n.opacity.v=o0*.35;r2=judgeScene([group],look,bg,strict);}
    if(r2&&better(r2))return {q:r2,msgs:[`a(z) ${nm} ${bad.map(nameOf).join(', ')} volt, gyengítettem`],fixed:L.type};
    L.n.opacity.v=o0;c.list.splice(c.list.indexOf(L),1);return {q:r,msgs:[`a(z) ${nm} ${bad.map(nameOf).join(', ')} volt, kivettem`],fixed:L.type};}
  return null;}
const nameOf=k=>(SYMPTOMS.find(s=>s.k===k)||{name:k}).name;
