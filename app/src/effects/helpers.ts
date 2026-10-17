import { EASE_NAMES } from '../palettes';

import type { ParamDef } from '../types';
export const S=(k:string,l:string,min:number,max:number,def:number,step?:number):ParamDef=>({k,l,min,max,def,step});
export const SEL=(k:string,l:string,opts:any[],def:number):ParamDef=>({k,l,type:'sel',opts,def,min:0,max:opts.length-1});
export const COL=(k:string,l:string,def:string):ParamDef=>({k,l,type:'color',def});
/* ----- shared sky library (Égszín, Nap, Felhőréteg, Talaj, Pára) ----- */
export const SKYLIB=`vec3 skyCol(float y,float sh){vec3 zd=vec3(0.12,0.36,0.82),hd=vec3(0.62,0.8,0.97),zs=vec3(0.14,0.18,0.42),hs=vec3(1.0,0.56,0.32),zn=vec3(0.01,0.015,0.04),hn=vec3(0.04,0.05,0.1);
 float day=smoothstep(0.05,0.45,sh); float night=1.0-smoothstep(-0.2,0.02,sh);
 vec3 z=mix(mix(zs,zd,day),zn,night),hz=mix(mix(hs,hd,day),hn,night); return mix(hz,z,pow(clamp(y,0.0,1.0),0.6));}
vec3 sunTint(float sh){return mix(vec3(1.0,0.55,0.25),vec3(1.0,0.97,0.9),smoothstep(0.0,0.4,sh));}
vec2 sunPos(){return vec2(p_sunx*0.75,p_hz+0.05+p_sunh*0.55);}`;
export const CLOUDLIB=`float cloudD(vec2 uv){vec2 so=vec2(p_seed*0.173,p_seed*0.311); float sf=1.0+p_soft*2.0;
 if(p_ctype<0.5){float b=fbm(uv*1.2+so); float d2=fbm(uv*3.5+so+b); return smoothstep(1.0-p_cover-0.05*sf,1.0-p_cover+0.3*sf,b*0.65+d2*0.45);}
 if(p_ctype<1.5){vec2 s2=uv*vec2(0.35,3.0); float b=fbm(s2+so+fbm(uv*2.0)*0.8); return smoothstep(1.0-p_cover,1.0-p_cover+0.25*sf,b)*0.55;}
 if(p_ctype<2.5){float b=fbm(uv*0.6+so); return smoothstep(0.55-p_cover*0.6,0.55-p_cover*0.6+0.35*sf,b)*0.9;}
 float b=fbm(uv*0.9+so); float d2=fbm(uv*2.8+so+b*1.5); return smoothstep(0.75-p_cover*0.8,0.75-p_cover*0.8+0.25*sf,b*0.6+d2*0.5);}`;
/* ----- Bento layouts: [x,y,w,h] in 0..1 of the bento area, y down ----- */
export const BENTO:[string,number[][]][]=[
 ['2 × 2',[[0,0,.5,.5],[.5,0,.5,.5],[0,.5,.5,.5],[.5,.5,.5,.5]]],
 ['Hős + 2',[[0,0,.62,1],[.62,0,.38,.5],[.62,.5,.38,.5]]],
 ['Hős + 3',[[0,0,1,.58],[0,.58,1/3,.42],[1/3,.58,1/3,.42],[2/3,.58,1/3,.42]]],
 ['3 oszlop',[[0,0,1/3,1],[1/3,0,1/3,1],[2/3,0,1/3,1]]],
 ['Oldalsáv + 2',[[0,0,.3,1],[.3,0,.7,.55],[.3,.55,.7,.45]]],
 ['Mozaik (5)',[[0,0,.5,.6],[.5,0,.25,.6],[.75,0,.25,.35],[.75,.35,.25,.65],[0,.6,.75,.4]]],
 ['Mozaik (7)',[[0,0,.4,.5],[.4,0,.3,.5],[.7,0,.3,.3],[.7,.3,.3,.7],[0,.5,.2,.5],[.2,.5,.2,.5],[.4,.5,.3,.5]]],
 ['Kártyasor (4)',[[0,0,.25,1],[.25,0,.25,1],[.5,0,.25,1],[.75,0,.25,1]]],
 ['Egy doboz',[[0,0,1,1]]],
 ['Sáv + címke',[[0,0,.035,1],[.055,0,.945,1]]],
 ['3 × 3',[[0,0,1/3,1/3],[1/3,0,1/3,1/3],[2/3,0,1/3,1/3],[0,1/3,1/3,1/3],[1/3,1/3,1/3,1/3],[2/3,1/3,1/3,1/3],[0,2/3,1/3,1/3],[1/3,2/3,1/3,1/3],[2/3,2/3,1/3,1/3]]],
];
export const BENTO_NAMES=BENTO.map(b=>b[0]);
export const BENTO_ANIMS=['Kinyílás','Felpattanás','Becsúszás alulról','Becsúszás balról','Kibontás balról','Kibontás alulról','Átúszás','Nincs'];
