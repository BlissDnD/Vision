
"use strict";
export const $=s=>document.querySelector(s);
export const TAU=Math.PI*2;
export function h(tag,attrs?,...kids){const e=document.createElement(tag);if(attrs)for(const k in attrs){const v=attrs[k];if(v==null||v===false)continue;if(k==='class')e.className=v;else if(k==='html')e.innerHTML=v;else if(k.startsWith('on'))e[k]=v;else if(k==='style')e.style.cssText=v;else e.setAttribute(k,v===true?'':v);}
  for(const c of kids.flat()){if(c==null||c===false)continue;e.appendChild(typeof c==='string'?document.createTextNode(c):c);}return e;}
