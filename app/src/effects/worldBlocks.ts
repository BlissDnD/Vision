import { S, SEL, COL, SKYLIB, CLOUDLIB } from './helpers';

/** world building blocks */
import type { EffectDef } from '../types';
export const worldBlocks:Record<string,EffectDef>={
skygrad:{kind:'gen',name:'Égszín',noPal:true,desc:'Napszak szerinti égbolt-színátmenet: zenit, horizont, alkony, éjszaka. A Nap, a Felhőréteg, a Talaj és a Pára ugyanazt a Napszak és Horizont értéket használja, így egy makróval együtt mozognak.',
 main:['sunh','sunx','hz','glow'],
 params:[S('sunh','Napszak (nap magassága)',-.3,1,.55),S('sunx','Nap vízszintesen',-1,1,.35),S('hz','Horizont',-.6,.4,-.18),S('glow','Napközeli derengés',0,2,.8),S('sat','Telítettség',0,2,1)],
 lib:SKYLIB,
 code:`vec4 fx(){vec2 p=P(); float y01=(p.y-p_hz)/(0.55-p_hz); vec3 col=skyCol(y01,p_sunh);
  vec2 sp=sunPos(); float sd=length(p-sp); vec3 sc=sunTint(p_sunh);
  col+=sc*exp(-sd*2.2)*0.35*p_glow*smoothstep(-0.3,0.1,p_sunh)*(1.0-smoothstep(0.3,1.0,p_sunh)*0.6);
  if(p.y<p_hz) col=mix(col,skyCol(0.0,p_sunh)*0.8,clamp((p_hz-p.y)*3.0,0.0,1.0)*0.4);
  col=mix(vec3(luma(col)),col,p_sat); return vec4(max(col,0.0),1.0);}`},
sun:{kind:'gen',name:'Nap',noPal:true,desc:'Fénygömb koronával. A Napszak és a Horizont ugyanaz, mint az Égszínnél, így együtt mozognak. Tedd fölé a Lencsefényt vagy a Fénysugarakat.',
 main:['sunh','sunx','size','corona','rays'],
 params:[S('sunh','Napszak',-.3,1,.55),S('sunx','Vízszintesen',-1,1,.35),S('hz','Horizont',-.6,.4,-.18),S('size','Korong mérete',.005,.15,.026),S('corona','Korona',0,3,1),S('bright','Fényerő',0,3,1),
  SEL('cmode','Szín',['Napszakból','Saját'],0),COL('color','Saját szín','#fff1d6'),SEL('horizon','Horizont mögé bukik',['Nem','Igen'],1),S('rays','Sugarak',0,1,.35),S('seed','Sugarak mintája',0,999,3,1)],
 lib:SKYLIB,
 code:`vec4 fx(){vec2 p=P(); vec2 sp=sunPos(); float sd=length(p-sp); vec3 sc=p_cmode<0.5?sunTint(p_sunh):p_color;
  float aa=max(fwidth(sd),1e-4); float disc=1.0-smoothstep(p_size-aa,p_size+aa,sd);
  float vis=p_horizon>0.5?smoothstep(p_hz-0.004,p_hz+0.004,p.y):1.0;
  float day=p_cmode<0.5?smoothstep(-0.25,0.05,p_sunh):1.0;
  vec3 col=sc*disc*3.0*vis+sc*(exp(-sd*0.9/max(p_size,0.003))*0.8+exp(-sd*7.0)*0.35)*p_corona*day*mix(1.0,vis,0.6);
  float ang=atan(p.y-sp.y,p.x-sp.x); col+=sc*pow(noise(vec2(ang*9.0+p_seed,uTime*0.05)),3.0)*exp(-sd*1.8)*p_rays*0.6*day*mix(1.0,vis,0.5);
  col*=p_bright; return vec4(col,clamp(max(max(col.r,col.g),col.b),0.0,1.0));}`},
clouds:{kind:'gen',name:'Felhőréteg',noPal:true,desc:'Gomoly-, fátyol-, réteg- vagy viharfelhők a nap irányából megvilágítva. Perspektivikusan a horizont fölé, vagy laposan bárhová. A Mag melletti kockával új felhőket dobsz.',
 main:['ctype','seed','cover','persp','cscale'],
 params:[SEL('ctype','Felhők',['Gomoly','Fátyol','Réteg','Vihar'],0),S('seed','Mag',0,999,42,1),S('cover','Borítottság',0,1,.58),SEL('persp','Nézet',['Perspektivikus','Lapos'],0),S('cscale','Felhők mérete',.3,3,1),
  S('sunh','Napszak',-.3,1,.55),S('sunx','Nap vízszintesen',-1,1,.35),S('hz','Horizont',-.6,.4,-.18),S('wind','Szél',0,2,.3),S('bright','Fényesség',0,2,1),S('soft','Puhaság',0,1,.1)],
 lib:SKYLIB+'\n'+CLOUDLIB,
 code:`vec4 fx(){vec2 p=P(); float t=uTime; float sh=p_sunh; float hz=p_hz; vec2 sp=sunPos(); float sd=length(p-sp);
  vec2 cuv; float fade=1.0;
  if(p_persp<0.5){if(p.y<hz) return vec4(0.0); float yy=max(p.y-hz,0.02); cuv=vec2(p.x/(yy*1.6+0.25),1.0/(yy*1.6+0.25))*0.6*p_cscale; fade=smoothstep(0.0,0.12,p.y-hz);}
  else cuv=p*1.4/max(p_cscale,0.05);
  cuv.x+=t*p_wind*0.05; cuv.y+=t*p_wind*0.01;
  float d=cloudD(cuv); if(d<0.002) return vec4(0.0);
  vec2 tos=normalize(sp-p+vec2(1e-4)); float dl=cloudD(cuv+tos*0.06); float lightC=clamp(0.55+(d-dl)*3.0,0.0,1.0);
  float day=smoothstep(0.05,0.45,sh); float night=1.0-smoothstep(-0.2,0.02,sh);
  vec3 litc=mix(vec3(1.0,0.62,0.42),vec3(1.0),day)*mix(1.0,0.08,night); vec3 shc=skyCol(0.0,sh)*mix(0.55,0.85,day)*mix(1.0,0.5,night);
  if(p_ctype>2.5){litc*=0.55;shc*=0.35;}
  vec3 cc=mix(shc,litc,lightC)*p_bright; cc+=sunTint(sh)*exp(-sd*6.0)*0.6*d*(1.0-d);
  if(p_ctype>2.5) cc=mix(vec3(luma(cc))*vec3(0.92,0.96,1.05),cc,0.3);
  float a=clamp(d*fade,0.0,1.0); return vec4(cc*a,a);}`},
terrain:{kind:'gen',name:'Talaj',noPal:true,desc:'Füves, száraz, homokos, sziklás vagy havas felület perspektívával. Tedd egy Dombvonal-alakzat fölé, és kapcsold be a vágást: a talaj csak a domb formájában látszik.',
 main:['ttype','color','sunh','detail'],
 params:[SEL('ttype','Felület',['Fű','Száraz fű','Homok','Szikla','Hó'],0),COL('color','Szín','#3f8f2a'),S('sunh','Napszak',-.3,1,.55),S('hz','Horizont',-.6,.4,-.18),S('detail','Részletesség',0,2,1),S('shade','Domborzat',0,1,.5),S('seed','Mag',0,999,3,1),S('wind','Szél a fűben',0,2,.3)],
 code:`vec4 fx(){vec2 p=P(); float sh=p_sunh; float near=clamp((p_hz+0.2-p.y)/0.8,0.0,1.0); float zz=1.0/max(p_hz+0.3-p.y,0.03);
  vec2 tq=vec2(p.x*zz,zz)*0.6+vec2(p_seed*0.37,p_seed*0.11); int T=int(p_ttype+0.5); vec3 base=p_color;
  float sway=sin(p.y*30.0+uTime*1.7)*0.003*p_wind;
  float fine=fbm(vec2((p.x+sway)*60.0,p.y*140.0)+p_seed); float large=fbm(tq*0.8); float tex;
  if(T==0) tex=fine*0.25+fbm(vec2(p.x*7.0,p.y*12.0)+p_seed)*0.25;
  else if(T==1){base=mix(base,vec3(0.62,0.52,0.28),0.7); tex=fine*0.45+large*0.3;}
  else if(T==2){base=mix(base,vec3(0.86,0.7,0.48),0.85); float du=sin(tq.x*6.0+large*5.0)*0.5+0.5; tex=du*0.25+large*0.2+fine*0.08;}
  else if(T==3){base=mix(base,vec3(0.42,0.4,0.38),0.85); float cr=fbm(tq*2.5); tex=large*0.4+cr*0.4-smoothstep(0.58,0.72,cr)*0.18;}
  else {base=mix(base,vec3(0.92,0.95,1.0),0.9); tex=large*0.15+fine*0.06;}
  float day=smoothstep(0.05,0.45,sh); float night=1.0-smoothstep(-0.2,0.02,sh);
  float lightK=mix(0.35,1.0,smoothstep(-0.1,0.3,sh))*mix(1.0,0.15,night);
  vec3 col=base*(0.62+0.3*(1.0-near)-0.15*near+(tex-0.25)*p_detail-p_shade*0.5*(large-0.5))*mix(vec3(1.0),vec3(1.0,0.75,0.55),1.0-day)*lightK;
  return vec4(max(col,0.0),1.0);}`},
haze:{kind:'fx',name:'Pára',noPal:true,desc:'Légköri pára a horizont körül, és talajköd. Tedd a táj rétegei közé: ami alatta van, az távolabbinak látszik.',
 main:['amount','hz','spread','low'],
 params:[S('amount','Erősség',0,1,.4),S('hz','Horizont',-.6,.4,-.18),S('spread','Kiterjedés',.02,1,.15),S('low','Talajköd',0,1,0),S('sunh','Napszak',-.3,1,.55),S('sunx','Nap vízszintesen',-1,1,.35),
  SEL('cmode','Szín',['Égszínből','Saját'],0),COL('color','Saját szín','#c9d6e6')],
 lib:SKYLIB,
 code:`vec4 fx(){vec4 s=IN(vUv); vec2 p=toQ(vUv); vec3 fc=p_color;
  if(p_cmode<0.5){fc=skyCol(0.0,p_sunh)*1.05; fc+=sunTint(p_sunh)*exp(-length(p-sunPos())*2.5)*0.3*smoothstep(-0.2,0.1,p_sunh);}
  float k=exp(-abs(p.y-p_hz)/max(p_spread,0.01))*p_amount; k+=p_low*smoothstep(p_hz,p_hz-0.45,p.y)*0.85;
  k=clamp(k,0.0,1.0); vec3 c=mix(unp(s),fc,k); float A=max(s.a,k); return vec4(c*A,A);}`}
};
