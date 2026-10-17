import { S } from './helpers';

/** media */
import type { EffectDef } from '../types';
export const media:Record<string,EffectDef>={
text:{kind:'text',name:'Szöveg',desc:'Felirat palettás csillogással és ragyogással. Több sor is lehet (Enter), balra, középre vagy jobbra zárva.',main:['tint','glow'],
 params:[S('tint','Színezés',0,1,.7),S('glow','Ragyogás',0,3,1),S('spread','Színterjedés',0,3,.6),S('shimmer','Csillogás',0,4,1)],
 code:`vec4 fx(){vec2 p=P(); float ia=uImgSize.x/max(uImgSize.y,1.0); vec2 uv=TXUV(p,ia);
  float inb=step(0.0,uv.x)*step(uv.x,1.0)*step(0.0,uv.y)*step(uv.y,1.0);
  float a=texture(uImage,clamp(uv,0.0,1.0)).a*inb; float g=0.0;
  for(int i=0;i<12;i++){float an=float(i)*2.39996; vec2 off=vec2(cos(an),sin(an))*(0.01+0.02*float(i)/12.0)*vec2(1.0/ia,1.0)*1.5; g+=texture(uImage,clamp(uv+off,0.0,1.0)).a;}
  g=g/12.0*p_glow; vec3 rgb=mix(vec3(1.0),pal(uv.x*p_spread+uTime*p_shimmer*0.2),p_tint);
  float A=clamp(max(a,g*0.8),0.0,1.0); return vec4((rgb+rgb*g*0.6)*A,A);}`},
image:{kind:'image',name:'Kép',desc:'Saját kép rétegként — fotó, logó, textúra.',noPal:true,main:['bright','sat'],
 params:[S('bright','Fényerő',0,3,1),S('sat','Telítettség',0,3,1)],
 code:`vec4 fx(){vec2 p=P(); float ia=uImgSize.x/max(uImgSize.y,1.0); vec2 uv=vec2(p.x/ia,p.y)+0.5;
  float inb=step(0.0,uv.x)*step(uv.x,1.0)*step(0.0,uv.y)*step(uv.y,1.0);
  vec4 c=texture(uImage,clamp(uv,0.0,1.0)); vec3 rgb=mix(vec3(luma(c.rgb)),c.rgb,p_sat)*p_bright; float A=c.a*inb; return vec4(rgb*A,A);}`},
custom:{kind:'gen',name:'Saját GLSL',desc:'Saját shader élőben. IN(uv) az alatta lévő kép, így szűrőt is írhatsz.',main:['a','b','c','d'],
 params:[S('a','p_a',0,1,.5),S('b','p_b',0,1,.5),S('c','p_c',0,1,.5),S('d','p_d',0,1,.5)],code:''}
};
