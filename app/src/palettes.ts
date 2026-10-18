import { TAU } from './dom';

export const PALS=[
 {n:'Spektrum',   a:[.5,.5,.5],b:[.5,.5,.5],c:[1,1,1],d:[0,.33,.67]},
 {n:'Napkorona',  a:[.5,.5,.5],b:[.5,.5,.5],c:[1,1,1],d:[0,.1,.2]},
 {n:'Rózsakvarc', a:[.5,.5,.5],b:[.5,.5,.5],c:[1,1,1],d:[.3,.2,.2]},
 {n:'Citrus',     a:[.5,.5,.5],b:[.5,.5,.5],c:[1,1,.5],d:[.8,.9,.3]},
 {n:'Borostyán',  a:[.5,.5,.5],b:[.5,.5,.5],c:[1,.7,.4],d:[0,.15,.2]},
 {n:'Ultraviola', a:[.5,.5,.5],b:[.5,.5,.5],c:[2,1,0],d:[.5,.2,.25]},
 {n:'Korall-jáde',a:[.8,.5,.4],b:[.2,.4,.2],c:[2,1,1],d:[0,.25,.25]},
 {n:'Mély űr',    a:[.15,.1,.3],b:[.35,.3,.45],c:[1,1,1],d:[.55,.65,.8]},
 {n:'Aranyfény',  a:[.55,.42,.25],b:[.45,.35,.2],c:[1,1,1],d:[0,.08,.18]},
 {n:'Jégkék',     a:[.45,.6,.75],b:[.35,.35,.3],c:[1,1,1],d:[.6,.65,.7]},
 {n:'Teal és narancs',a:[.525,.5,.375],b:[.425,.05,.125],c:[1,1,1],d:[.5,.5,0]},
 {n:'Éjfél-arany', a:[.5,.415,.275],b:[.45,.335,.075],c:[1,1,1],d:[.5,.5,.5]},
 {n:'Ibolya alkony',a:[.565,.35,.425],b:[.385,.25,.125],c:[1,1,1],d:[.5,.5,.5]},
 {n:'Holografikus',a:[.78,.76,.82],b:[.22,.22,.18],c:[1,1,1],d:[0,.15,.35]},
 {n:'Mélytenger',  a:[.1,.3,.4],b:[.1,.25,.3],c:[1,1,1],d:[.5,.5,.5]},
 {n:'Parázs',      a:[.45,.18,.08],b:[.45,.18,.08],c:[1,1,1],d:[.5,.5,.5]},
 {n:'Ezüst',       a:[.5,.52,.56],b:[.45,.45,.44],c:[1,1,1],d:[.5,.5,.5]},
 {n:'Pasztell köd',a:[.8,.75,.82],b:[.15,.15,.15],c:[1,1,1],d:[0,.33,.67]},
];
export const PAL_ORDER=[10,11,12,13,14,15,16,17,0,1,2,3,4,5,6,7,8,9];
export const ff=n=>{const s=String(n);return /[.e]/.test(s)?s:s+'.0'};
export const v3=a=>`vec3(${a.map(ff).join(',')})`;
export function palJS(i,t){const p=PALS[i]||PALS[0];return [0,1,2].map(k=>Math.min(1,Math.max(0,p.a[k]+p.b[k]*Math.cos(TAU*(p.c[k]*t+p.d[k])))));}
export function palCSS(i){const st=[];for(let k=0;k<=8;k++){const c=palJS(i,k/8).map(x=>Math.round(x*255));st.push(`rgb(${c})`);}return `conic-gradient(${st.join(',')})`;}
export const EASE_NAMES=['Lágy','Erős','Rugós (régi)','Ki-be','Lineáris','Rugó – finom','Rugó – pattanós','Visszalendülés','Gumi (elastic)','Pattogás','Expo ki-be','Lépcsős'];
export function hexRGB(hx){const n=parseInt(String(hx).slice(1,7),16)||0;return[(n>>16&255)/255,(n>>8&255)/255,(n&255)/255];}
