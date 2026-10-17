import { S, SEL } from './helpers';

/** generators */
import type { EffectDef } from '../types';
export const generators:Record<string,EffectDef>={
plasma:{kind:'gen',name:'Plazma',desc:'Hullámzó, lágy színmező.',main:['speed','warp','bands'],
 params:[S('speed','Sebesség',0,4,1),S('zoom','Nagyítás',.3,6,1.5),S('warp','Örvénylés',0,2,.6),S('bands','Sávok',.2,4,1.2)],
 code:`vec4 fx(){vec2 p=P()*p_zoom; float t=uTime*p_speed;
  float v=sin(p.x*3.0+t)+sin(p.y*3.0+t*1.3)+sin((p.x+p.y)*2.0+t*0.7)+sin(length(p*4.0)-t*2.0);
  v+=p_warp*fbm(p*2.0+t*0.2)*3.0; return vec4(pal(v*0.12*p_bands+t*0.05),1.0);}`},
fire:{kind:'gen',name:'Tűz',desc:'Lobogó lángnyelvek alulról felfelé. A Palettás színezés a kiválasztott színekre hangolja.',main:['height','intensity','speed','tint'],
 params:[S('height','Magasság',.1,1.5,.75),S('intensity','Erő',0,2,1.1),S('speed','Sebesség',0,3,1),S('tint','Palettás színezés',0,1,0),S('width','Szélesség',.05,2,.55),S('turb','Turbulencia',.3,3,1)],
 code:`vec4 fx(){
  vec2 p=P(); float t=uTime*p_speed; vec2 q=vec2(p.x,p.y+0.45);
  float n=fbm(vec2(q.x*3.0*p_turb,q.y*2.2*p_turb-t*2.0))+0.5*fbm(vec2(q.x*6.0*p_turb+3.0,q.y*4.0*p_turb-t*3.5));
  float hgt=max(p_height,0.05); float yy=clamp(q.y/hgt,0.0,1.0);
  float body=1.0-smoothstep(0.0,p_width*(1.0-yy*0.7)+0.001,abs(q.x+(n-0.75)*0.25*q.y));
  float heat=clamp((1.0-q.y/hgt)*n*1.3,0.0,1.5)*body*smoothstep(-0.12,0.02,q.y);
  heat=pow(heat,1.4)*p_intensity;
  vec3 fc=vec3(heat*1.6,pow(heat,2.0)*1.1,pow(heat,4.0));
  vec3 col=mix(fc,pal(heat*0.6)*heat*1.4,p_tint);
  return vec4(col,clamp(heat*1.5,0.0,1.0));
}`},
aurora:{kind:'gen',name:'Sarki fény',desc:'Hullámzó fényfüggönyök éjszakai égbolton.',main:['height','glow','speed'],
 params:[S('speed','Sebesség',0,3,.6),S('height','Magasság',0,1,.5),S('spread','Rétegtávolság',0,2,1),S('glow','Fény',0,3,1.2),S('stars','Csillagok',0,2,.8)],
 code:`vec4 fx(){
  vec2 p=P(); float t=uTime*p_speed; vec3 col=vec3(0.0);
  for(int i=0;i<3;i++){float fi=float(i); float x=p.x*1.2+fi*1.7;
    float y0=0.1*sin(x*1.5+t*0.3+fi)+0.15*fbm(vec2(x*1.2+t*0.1,fi))-0.1+fi*0.08*p_spread;
    float d=p.y-y0; float cur=exp(-max(d,0.0)*(6.0-p_height*4.5))*smoothstep(-0.02,0.03,d);
    float rays=0.6+0.4*fbm(vec2(x*12.0+t*0.5,fi*3.0));
    col+=pal(0.35+fi*0.12+d*0.5)*cur*rays*0.7;}
  col*=p_glow;
  vec2 sp=P()*80.0; float h=hash(floor(sp)); col+=step(0.985,h)*(1.0-smoothstep(0.0,0.3,length(fract(sp)-0.5)))*p_stars*(0.6+0.4*sin(uTime*2.0+h*40.0));
  return vec4(col,1.0);
}`},
nebula:{kind:'gen',name:'Csillagköd',desc:'Örvénylő ködfelhő pislákoló csillagokkal.',main:['warp','bright','stars'],
 params:[S('speed','Sebesség',0,3,.5),S('zoom','Nagyítás',.3,6,1.8),S('warp','Örvénylés',0,8,3),S('bright','Fényesség',0,3,1.1),S('stars','Csillagok',0,2,1)],
 code:`vec4 fx(){vec2 p=P()*p_zoom; float t=uTime*p_speed*0.1;
  vec2 q=vec2(fbm(p+t),fbm(p+vec2(5.2,1.3)-t));
  vec2 r=vec2(fbm(p+4.0*q+vec2(1.7,9.2)+t*0.5),fbm(p+4.0*q+vec2(8.3,2.8)));
  float f=fbm(p+p_warp*r);
  vec3 col=pal(f*0.8+length(q)*0.4)*pow(f,1.5)*p_bright*2.0;
  vec2 sp=P()*70.0; float h=hash(floor(sp)); col+=step(0.975,h)*(1.0-smoothstep(0.0,0.25*h,length(fract(sp)-0.5)))*(0.6+0.4*sin(uTime*3.0+h*60.0))*p_stars;
  return vec4(col,1.0);}`},
liquid:{kind:'gen',name:'Folyékony márvány',desc:'Önmagába tekeredő, olajszerű áramlás.',main:['speed','warp','bands'],
 params:[S('speed','Sebesség',0,4,1),S('zoom','Nagyítás',.5,8,3),S('warp','Torzítás',0,3,1),S('bands','Sávok',.2,4,1)],
 code:`vec4 fx(){vec2 p=P()*p_zoom; float t=uTime*p_speed*0.15;
  for(int i=1;i<8;i++){float fi=float(i); p+=p_warp*0.6/fi*vec2(sin(fi*p.y+t+0.3*fi),cos(fi*p.x+t+0.5*fi));}
  return vec4(pal((sin(p.x+p.y)*0.5+0.5)*p_bands*0.5+t*0.2),1.0);}`},
tunnel:{kind:'gen',name:'Féreglyuk',desc:'Végtelen téridő-alagút csavarodó gyűrűkkel.',main:['speed','twist','glow'],
 params:[S('speed','Sebesség',0,4,.6),S('twist','Csavarás',-4,4,1),S('rings','Gyűrűk',1,30,8),S('segments','Szegmensek',1,24,8,1),S('glow','Fény',0,3,1.2)],
 code:`vec4 fx(){vec2 p=P(); float r=length(p); float a=atan(p.y,p.x); float t=uTime*p_speed;
  float z=0.35/(r+0.002); float w=z+t; float ang=a/TAU+p_twist*z*0.05+t*0.02;
  float rl=abs(fract(w*p_rings*0.25)-0.5); float sl=abs(fract(ang*p_segments)-0.5);
  float ln=(1.0-smoothstep(0.0,0.08,rl))+(1.0-smoothstep(0.0,0.06,sl))*0.7;
  float n=fbm(vec2(ang*6.0,w*1.5));
  vec3 col=pal(w*0.06+n*0.4)*(ln*p_glow+n*n*1.2); col*=clamp(r*2.2,0.0,1.0);
  col+=pal(t*0.05+0.5)*exp(-r*7.0)*p_glow*1.2; return vec4(col,1.0);}`},
sacred:{kind:'gen',name:'Szent geometria',desc:'Életvirág, egymásba forduló háromszögek, pulzáló körök.',main:['speed','radius','glow'],
 params:[S('speed','Sebesség',0,3,.4),S('radius','Sugár',.05,.6,.22),S('sides','Sokszög oldalai',3,12,6,1),S('layers','Körkoszorúk',1,2,2,1),S('width','Vonalvastagság',.1,3,.6),S('glow','Fény',0,3,1)],
 lib:`float poly(vec2 p,float n,float r){float a=atan(p.y,p.x);float s=TAU/n;float b=mod(a+s*0.5,s)-s*0.5;return length(p)*cos(b)-r*cos(s*0.5);}`,
 code:`vec4 fx(){vec2 p=P(); float t=uTime*p_speed; float R=p_radius; float r=length(p);
  float d=abs(r-R); d=min(d,abs(r-R*2.0)); d=min(d,abs(r-R*0.5));
  for(int i=0;i<6;i++){float a=float(i)*TAU/6.0+t*0.1; d=min(d,abs(length(p-vec2(cos(a),sin(a))*R)-R));}
  if(p_layers>1.5){for(int i=0;i<6;i++){float a=float(i)*TAU/6.0+TAU/12.0-t*0.07; d=min(d,abs(length(p-vec2(cos(a),sin(a))*R*1.732)-R));}}
  d=min(d,abs(poly(rot(t*0.2)*p,3.0,R))); d=min(d,abs(poly(rot(-t*0.2+PI)*p,3.0,R))); d=min(d,abs(poly(rot(t*0.05)*p,p_sides,R*2.0)));
  float w=p_width*0.004; float line=1.0-smoothstep(w*0.3,w,d);
  float pulse=0.5+0.5*sin(r*20.0-t*3.0);
  vec3 col=pal(r*0.6-t*0.1)*(line+exp(-d*18.0)*0.5*p_glow)+pal(r*0.6+0.3)*exp(-d*80.0)*pulse*0.4*p_glow;
  return vec4(col,1.0);}`},
kali:{kind:'gen',name:'Fraktálvirág',desc:'Kaleidoszkopikus fraktál mélyülő indákkal.',main:['speed','morph','glow'],
 params:[S('speed','Sebesség',0,2,.3),S('zoom','Nagyítás',.2,4,1.2),S('morph','Alak',.2,1.2,.75),S('iter','Mélység',3,14,10,1),S('sharp','Élesség',1,12,4),S('spin','Csavar',-3.14,3.14,0),S('glow','Fény',0,3,1)],
 code:`vec4 fx(){vec2 z=P()*p_zoom; float t=uTime*p_speed; vec3 col=vec3(0.0);
  vec2 c=vec2(p_morph+0.12*sin(t*0.31),0.55+0.1*cos(t*0.23));
  for(int i=0;i<14;i++){if(float(i)>=p_iter) break; z=abs(z)/max(dot(z,z),0.0001)-c; z=rot(t*0.05+p_spin)*z; float l=length(z); col+=pal(float(i)*0.07+l*0.08+t*0.04)*exp(-l*p_sharp);}
  return vec4(col*p_glow*0.35,1.0);}`},
julia:{kind:'gen',name:'Julia-portál',desc:'Folyton átalakuló Julia-halmaz.',main:['speed','radius','bands'],
 params:[S('speed','Sebesség',0,3,.4),S('radius','Paraméter',.5,1,.7885),S('iter','Iteráció',20,160,100,1),S('bands','Színsávok',.2,6,1.5),S('core','Mag fénye',0,3,1)],
 code:`vec4 fx(){vec2 z=P()*1.3; float t=uTime*p_speed*0.25; vec2 c=p_radius*vec2(cos(t),sin(t*1.1));
  float it=0.0; float m=0.0;
  for(int i=0;i<160;i++){if(float(i)>=p_iter) break; z=vec2(z.x*z.x-z.y*z.y,2.0*z.x*z.y)+c; m=dot(z,z); if(m>64.0) break; it+=1.0;}
  float sm=it-log2(max(log2(max(m,1.0001)),0.0001))+4.0; float inside=step(p_iter-0.5,it);
  return vec4(pal(sm*0.02*p_bands+t*0.3)*(1.0-inside)+inside*pal(0.9)*0.15*p_core,1.0);}`},
moire:{kind:'gen',name:'Interferencia',desc:'Mozgó hullámforrások moaré-mintázata.',main:['speed','freq','sharp'],
 params:[S('speed','Sebesség',0,3,.6),S('sep','Forrástávolság',0,1,.25),S('freq','Frekvencia',1,40,10),S('sharp','Kontraszt',.1,4,.8)],
 code:`vec4 fx(){vec2 p=P(); float t=uTime*p_speed;
  vec2 c1=vec2(cos(t*0.3),sin(t*0.4))*p_sep; vec2 c2=vec2(cos(t*0.23+2.0),sin(t*0.37+1.0))*p_sep; float f=p_freq*TAU;
  float v=(sin(length(p-c1)*f)+sin(length(p-c2)*f)+sin(length(p)*f*0.5-t*2.0))/3.0;
  return vec4(pal(v*0.4+t*0.05)*pow(abs(v),p_sharp)*1.4,1.0);}`},
hyper:{kind:'gen',name:'Hipertér',desc:'Fénysebességű csillagcsíkok.',main:['speed','count','streak'],
 params:[S('speed','Sebesség',0,4,1),S('count','Sűrűség',10,200,60,1),S('streak','Csíkhossz',0,3,1),S('glow','Fény',0,3,1.3)],
 code:`vec4 fx(){vec2 p=P(); float t=uTime*p_speed; float r=length(p); float a=atan(p.y,p.x)/TAU+0.5; vec3 col=vec3(0.0);
  for(int L=0;L<3;L++){float fl=float(L); float n=floor(p_count*(1.0+fl*0.7)); float aa=a*n+fl*0.37; float id=floor(aa); float h=hash(vec2(id,fl*7.1));
    float z=fract(h*13.7+t*(0.25+h*0.5)); float pos=z*z*1.6; float len=p_streak*0.4*z*z+0.01;
    float fa=abs(fract(aa)-0.5)/n*TAU*r; float wl=1.0-smoothstep(0.0,0.004+0.004*z,fa);
    float seg=step(pos-len,r)*step(r,pos)*((r-pos+len)/len); col+=pal(h*0.5+fl*0.15)*wl*seg*(0.4+z);}
  col*=p_glow; col+=pal(0.6)*exp(-r*5.0)*0.5*p_glow; return vec4(col,1.0);}`},
grid:{kind:'gen',name:'Hologramrács',desc:'Végtelen sci-fi rácsmező csíkos nappal.',main:['speed','horizon','sun'],
 params:[S('speed','Sebesség',0,4,1),S('horizon','Horizont',-.5,.8,.05),S('density','Rácssűrűség',.2,4,1),S('sun','Nap',0,2,1),S('glow','Fény',0,3,1.2)],
 code:`vec4 fx(){vec2 p=P(); float t=uTime*p_speed; float hz=p_horizon;
  vec3 col=pal(0.65)*exp(-abs(p.y-hz)*6.0)*0.5;
  vec2 sc=p-vec2(0.0,hz+0.18); float sun=1.0-smoothstep(0.27,0.28,length(sc));
  float gap=sc.y<0.0?step(fract(sc.y*20.0+t*0.3),clamp(-sc.y*3.0,0.0,0.7)):0.0;
  col+=mix(pal(0.05),pal(0.35),clamp(sc.y*2.0+0.5,0.0,1.0))*sun*(1.0-gap)*p_sun;
  float y=max(hz-p.y,0.001); float z=0.25/y; vec2 g=vec2(p.x*z,z+t*2.0)*p_density;
  vec2 gl=abs(fract(g)-0.5)/max(fwidth(g),vec2(0.0001)); float ln=1.0-min(min(gl.x,gl.y),1.0);
  float fog=exp(-z*0.12)*step(p.y,hz); col+=(pal(0.8)*ln*1.5*p_glow+pal(0.75)*0.08)*fog; return vec4(col,1.0);}`},
blackhole:{kind:'gen',name:'Eseményhorizont',desc:'Fekete lyuk akkréciós koronggal és fényelhajlással.',main:['size','lens','tilt','glow'],
 params:[S('speed','Sebesség',0,3,.5),S('size','Méret',.2,3,1.2),S('lens','Lencsehatás',0,3,1),S('tilt','Dőlés',.05,1,.25),S('glow','Fény',0,3,1.2)],
 code:`vec4 fx(){vec2 p=P(); float r=length(p); float t=uTime*p_speed; float rs=p_size*0.12;
  vec2 bp=p-p*(rs*rs*p_lens*2.0/max(dot(p,p),0.0001)); float n=fbm(bp*2.5+vec2(t*0.02,0.0)); vec3 bg=pal(n*0.8+0.2)*n*n*0.7;
  vec2 sp=bp*60.0; float h=hash(floor(sp)); bg+=step(0.985,h)*(1.0-smoothstep(0.0,0.3,length(fract(sp)-0.5)))*1.2;
  vec2 dp=vec2(p.x,p.y/max(p_tilt,0.05)); float dr=length(dp);
  float disk=smoothstep(rs*1.4,rs*1.8,dr)*(1.0-smoothstep(rs*2.6,rs*4.5,dr));
  vec2 rp=rot(t*0.5/(dr*2.0+0.15))*dp; float sw=fbm(rp*10.0); float dop=1.0+0.7*(dp.x/max(dr,0.001));
  vec3 dcol=pal(0.08+dr*0.6)*disk*(0.4+sw*1.4)*dop*p_glow;
  float shadow=smoothstep(rs*0.95,rs*1.05,r); vec3 col=bg*shadow; col+=dcol*(1.0-step(0.0,p.y)*(1.0-shadow));
  col+=pal(0.1)*exp(-abs(r-rs*1.05)/(rs*0.04))*p_glow*0.8;
  col+=pal(0.12)*exp(-abs(r-rs*1.3)/(rs*0.12))*smoothstep(-rs*0.2,rs*0.6,p.y)*0.6*p_glow;
  return vec4(col,1.0);}`},
gradient:{kind:'gen',name:'Színátmenet',desc:'Lassan vándorló háttérszín a palettából.',main:['mode','span','speed'],
 params:[SEL('mode','Típus',['Lineáris','Sugaras'],1),S('span','Terjedelem',0,3,.8),S('speed','Sebesség',0,3,.2)],
 code:`vec4 fx(){vec2 p=P(); float t=uTime*p_speed; float f=p_mode<0.5?p.x*0.5+0.5:length(p); return vec4(pal(f*p_span+t*0.05),1.0);}`},
galaxy:{kind:'gen',name:'Galaxis',desc:'Spirálkarú galaxis differenciális forgással és csillagporral (a three.js galaxis-generátor ihlette).',main:['branches','twist','density','core'],
 params:[S('branches','Karok',2,8,3,1),S('twist','Csavarodás',-3,3,1.2),S('density','Sűrűség',0,3,1),S('core','Mag fénye',0,3,1),S('speed','Forgás',0,2,.25),S('radius','Kiterjedés',.2,2,.8)],
 code:`vec4 fx(){vec2 p=P(); float t=uTime*p_speed; float R=max(p_radius,0.05); float r0=length(p)/R;
  vec2 q=rot(-t*0.3/(r0+0.3))*p/R; float a=atan(q.y,q.x); float rr=length(q);
  float ph=a*floor(p_branches)+log(rr+0.02)*p_twist*3.0;
  float armd=pow(0.5+0.5*cos(ph+fbm(q*4.0)*1.5),3.0); float fall=exp(-rr*2.2); float core=exp(-rr*12.0)*p_core;
  vec2 sp=q*90.0; float h=hash(floor(sp)); float st=step(1.0-0.06*p_density*(armd*fall*3.0+0.05),h)*(1.0-smoothstep(0.0,0.35,length(fract(sp)-0.5)));
  vec3 col=pal(rr*0.6+0.1)*(armd*fall*1.6*p_density+core*1.5)+mix(pal(0.05),pal(0.55),clamp(rr,0.0,1.0))*st*1.5+vec3(1.0)*core*0.6;
  return vec4(col,1.0);}`},
waves:{kind:'gen',name:'Részecskehullám',desc:'Perspektivikus pontmező, amely tengerként hullámzik (a three.js points/waves példa ihlette).',main:['amp','density','speed','dot'],
 params:[S('amp','Hullámzás',0,3,1),S('density','Sűrűség',.3,3,1),S('speed','Sebesség',0,3,1),S('dot','Pontméret',.1,1.5,.6),S('freq','Hullámhossz',.2,4,1.2),S('height','Kameramagasság',.3,3,1.2),S('glow','Fény',0,3,1.2)],
 code:`float hfun(vec2 x,float t){return (sin(x.x*p_freq+t)+sin(x.y*p_freq*0.8+t*1.3))*0.25*p_amp;}
vec4 fx(){vec2 p=P(); float t=uTime*p_speed; vec3 ro=vec3(0.0,p_height,0.0); vec3 rd=normalize(vec3(p.x,p.y-0.25,1.0));
  if(rd.y>-0.002) return vec4(0.0);
  float tt=-ro.y/rd.y; vec3 w=ro+rd*tt;
  for(int k=0;k<2;k++){tt=(hfun(w.xz,t)-ro.y)/rd.y; w=ro+rd*tt;}
  float sp=0.25/max(p_density,0.05); vec2 g=(floor(w.xz/sp)+0.5)*sp; float d=length(w.xz-g)/sp;
  float dv=1.0-smoothstep(p_dot*0.25,p_dot*0.25+0.06,d); float fog=exp(-tt*0.08);
  float A=clamp(dv*fog,0.0,1.0); return vec4(pal(hfun(g,t)*0.8+0.4)*A*p_glow,A);}`},
lava:{kind:'gen',name:'Lávalámpa',desc:'Lassan összeolvadó, lebegő metaball-cseppek, átlátszó háttérrel.',main:['count','size','speed','soft'],
 params:[S('count','Cseppek',2,12,7,1),S('size','Méret',.05,.4,.18),S('speed','Sebesség',0,3,1),S('soft','Lágyság',0,1,.4),S('glow','Peremfény',0,3,1)],
 code:`vec4 fx(){vec2 p=P(); float t=uTime*p_speed; float f=0.0;
  for(int i=0;i<12;i++){if(float(i)>=p_count) break; float fi=float(i);
    vec2 c=vec2(sin(fi*1.7+t*0.3*(0.5+hash(vec2(fi,1.0))))*0.6,sin(t*0.25*(0.4+hash(vec2(fi,2.0)))+fi*2.3)*0.42);
    float r=p_size*(0.6+0.8*hash(vec2(fi,3.0))); f+=r*r/max(dot(p-c,p-c),0.0001);}
  float iso=smoothstep(1.0-p_soft,1.0+p_soft*0.2+0.001,f); float rim=exp(-abs(f-1.0)*6.0)*p_glow;
  return vec4(pal(f*0.15+t*0.03)*iso+pal(0.1)*rim*0.6,clamp(iso+rim*0.5,0.0,1.0));}`},
cells:{kind:'gen',name:'Sejtszövet',desc:'Élő Voronoi-sejtek izzó határokkal — organikus sci-fi textúra.',main:['zoom','speed','glow','fill'],
 params:[S('zoom','Sejtméret',1,14,5),S('speed','Sebesség',0,3,.8),S('glow','Határfény',0,3,1.2),S('fill','Sejtkitöltés',0,2,.8),S('width','Határvastagság',.1,4,1),S('variety','Színváltozatosság',0,2,.6)],
 code:`vec2 h2(vec2 p){return fract(sin(vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3))))*43758.5453);}
vec4 fx(){vec2 p=P()*p_zoom; float t=uTime*p_speed; vec2 i=floor(p),f=fract(p); float d1=8.0,d2=8.0; vec2 id1=vec2(0.0);
  for(int y=-1;y<=1;y++)for(int x=-1;x<=1;x++){vec2 g=vec2(float(x),float(y)); vec2 o=0.5+0.5*sin(t+TAU*h2(i+g)); vec2 r=g+o-f; float d=dot(r,r);
    if(d<d1){d2=d1;d1=d;id1=i+g;}else if(d<d2){d2=d;}}
  d1=sqrt(d1); d2=sqrt(d2); float edge=d2-d1; float e=1.0-smoothstep(0.0,0.05*p_width,edge);
  vec3 col=pal(h2(id1).x*p_variety+t*0.05)*(0.3+0.7*(1.0-d1))*p_fill+pal(0.6+edge)*e*p_glow+pal(0.6)*exp(-edge*10.0)*0.3*p_glow;
  return vec4(col,1.0);}`},
flare:{kind:'gen',name:'Lencsefény',desc:'Fényforrás sugarakkal, anamorf csíkkal és szellemképekkel. Húzd a fényforrást oda, ahová szeretnéd.',main:['size','rays','streak','ghosts'],
 params:[S('size','Fényerő',.2,3,1),S('rays','Sugarak',0,16,6,1),S('streak','Anamorf csík',0,2,1),S('ghosts','Szellemképek',0,3,1),S('ring','Halo',0,2,.6),S('flicker','Vibrálás',0,1,.3)],
 code:`vec4 fx(){vec2 p=P(); float sz=max(p_size,0.05); float r=length(p); float a=atan(p.y,p.x);
  float fl=1.0+p_flicker*(noise(vec2(uTime*8.0,0.0))-0.5);
  float core=(exp(-r*22.0/sz)*1.6+exp(-r*5.0/sz)*0.35)*fl;
  float rays=pow(abs(cos(a*max(floor(p_rays),1.0)*0.5)),60.0)*exp(-r*3.5/sz)*step(0.5,p_rays)*fl;
  float streak=exp(-abs(p.y)*90.0/sz)*exp(-abs(p.x)*1.6/sz)*p_streak;
  float ring=exp(-abs(r-0.32*sz)*45.0/sz)*0.25*p_ring;
  vec3 col=vec3(1.0,0.96,0.9)*core+pal(0.1)*rays*0.8+pal(0.6)*streak+pal(0.35)*ring;
  vec2 ctr=toQ(vec2(0.5));
  for(int i=0;i<6;i++){float fi=float(i); vec2 gp=ctr*(0.35+fi*0.32)*1.6; float gr=sz*(0.03+0.05*hash(vec2(fi,4.0))); col+=pal(0.15+fi*0.13)*(1.0-smoothstep(gr*0.6,gr,length(p-gp)))*0.18*p_ghosts;}
  return vec4(col,clamp(max(max(col.r,col.g),col.b),0.0,1.0));}`}
};
