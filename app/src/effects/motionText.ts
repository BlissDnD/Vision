import { S, SEL, COL } from './helpers';
import { EASE_NAMES } from '../palettes';

/** motion */
import type { EffectDef } from '../types';
export const motionText:Record<string,EffectDef>={
mtext:{kind:'text',name:'Animált szöveg',desc:'Kinetikus tipográfia betűnként vagy szavanként: elmosásból élesedés, emelkedés, maszkolt felcsúszás, rugós pattanás, méret- és fókuszpop, kemény vágás, oldalról maszkolt beúszás. Boil (kézi remegés), megnyúlás mozgás közben és ütemre lüktetés bármelyik mozdulathoz.',
 main:['anim','unit','order','start','dur','stagger','ease','fill'],
 params:[SEL('anim','Mozdulat',['Elmosásból élesedés','Emelkedés','Felcsúszás maszkolva','Pattanás','Gépelés','Szétszóródás','Hullám','Méret- és fókuszpop','Kemény vágás','Rugós ugrás','Beúszás oldalról (maszk)','Kibontás középről (maszk)'],0),SEL('unit','Egység',['Betű','Szó','Sor'],0),SEL('order','Sorrend',['Balról','Jobbról','Középről','Véletlen'],0),
  S('start','Kezdés (mp)',0,30,.3),S('dur','Időtartam (mp)',.05,4,.9),S('stagger','Késleltetés egységenként (0 = egyben)',0,.5,.06),S('outAt','Kilépés (mp, 0 = nincs)',0,60,0),SEL('ease','Görbe',EASE_NAMES,0),
  S('amount','Erősség',0,2,1),SEL('fill','Kitöltés',['Egyszínű','Színátmenet','Paletta'],1),COL('color1','Szín 1','#a3a3ab'),COL('color2','Szín 2','#f2a07b'),S('angle','Átmenet szöge °',-180,180,0),
  SEL('shimmer','Fényhatás',['Nincs','Fényes sáv','Kiolvasás'],0),S('shimspeed','Fényhatás tempója',.1,3,1),
  S('boil','Boil (kézi remegés)',0,1,0),S('boilfps','Boil ütem (kocka/mp)',4,24,10,1),S('stretch','Megnyúlás mozgás közben',0,1,0),S('pulse','Lüktetés (köss rá ütem-jelet)',0,1,0)],
 code:`vec4 fx(){
  vec2 p=P(); float ia=uImgSize.x/max(uImgSize.y,1.0); vec2 uv=TXUV(p,ia); float hb=max(uAux2.w,1.0); float nL=max(1.0,uAux2.x); float bhN=max(uAux2.z,1e-4);
  if(uv.x<-0.25||uv.x>1.25||uv.y<-0.5||uv.y>1.5) return vec4(0.0);
  int A=int(p_anim+0.5); bool whole=p_stagger<0.0001&&A!=10&&A!=11;
  // line table (last aux row): variable line heights from per-line size / spacing
  float AH=2.0*nL+1.0, vy=1.0-uv.y, li=0.0, tT=0.0, tB=1.0;
  for(int i=0;i<24;i++){ if(float(i)>=nL) break; vec4 q=texelFetch(uAux,ivec2(i,int(2.0*nL)),0);
    float a=(q.r*65280.0+q.g*255.0)/65535.0, b=(q.b*65280.0+q.a*255.0)/65535.0; if(i==0||vy>=a){ li=float(i); tT=a; tB=b; } }
  float yTop=1.0-tT, yBot=1.0-tB, yc=(yTop+yBot)*0.5;
  vec4 ax=texture(uAux,vec2(clamp(uv.x,0.0,1.0),(2.0*li+0.5)/AH)); vec4 bx=texture(uAux,vec2(clamp(uv.x,0.0,1.0),(2.0*li+1.5)/AH));
  bool gap=ax.r>0.995||uv.x<0.0||uv.x>1.0; if(gap&&!whole) return vec4(0.0);
  float ci=floor(ax.r*255.0+0.5); float cx=(floor(ax.g*255.0+0.5)*256.0+floor(ax.b*255.0+0.5))/65535.0; float wi=floor(ax.a*255.0+0.5);
  float lft=(floor(bx.r*255.0+0.5)*256.0+floor(bx.g*255.0+0.5))/65535.0; float rgt=(floor(bx.b*255.0+0.5)*256.0+floor(bx.a*255.0+0.5))/65535.0;
  float idx=p_unit<0.5?ci:(p_unit<1.5?wi:li); float N=max(1.0,p_unit<0.5?uAuxInfo.x:(p_unit<1.5?uAuxInfo.y:nL));
  if(whole){idx=0.0; cx=0.5; lft=0.0; rgt=1.0; yTop=1.0; yBot=0.0; yc=0.5;}
  float k=p_order<0.5?idx:(p_order<1.5?(N-1.0-idx):(p_order<2.5?abs(idx-(N-1.0)*0.5):hash(vec2(idx,7.3))*N));
  float tt=uTime; float x=clamp((tt-p_start-k*p_stagger)/max(p_dur,0.01),0.0,1.0); float e=easeF(x,p_ease);
  float vel=(easeF(min(x+0.04,1.0),p_ease)-e)/0.04;
  if(p_outAt>0.0){float xo=clamp((tt-p_outAt-k*p_stagger)/max(p_dur,0.01),0.0,1.0); if(xo>0.0){vel=-(easeF(min(xo+0.04,1.0),p_ease)-easeF(xo,p_ease))/0.04;} e*=1.0-easeF(xo,p_ease); x*=1.0-step(1.0,xo);}
  float u=1.0-e; float alpha=1.0, d=0.0, dx=0.0, scx=1.0, scy=1.0, blur=0.0; float am=p_amount; bool clipX=false; float wipe=2.0;
  if(A==0){alpha=clamp(e,0.0,1.0); blur=max(u,0.0)*0.06*am; d=u*0.06*am;}
  else if(A==1){alpha=clamp(e*1.4,0.0,1.0); d=u*0.45*am; scy=1.0+clamp(vel*0.1*p_stretch,-0.3,0.6);}
  else if(A==2){d=u*0.95; scy=1.0+clamp(vel*0.1*p_stretch,-0.3,0.6);}
  else if(A==3){scx=scy=max(e,0.001); alpha=clamp(e*3.0,0.0,1.0);}
  else if(A==4){alpha=step(0.001,x)*step(0.001,e);}
  else if(A==5){d=(hash(vec2(idx,1.7))-0.5)*u*1.6*am; blur=max(u,0.0)*0.04*am; alpha=clamp(e,0.0,1.0);}
  else if(A==6){d=sin(tt*3.0-idx*0.45)*0.08*am; alpha=clamp(e,0.0,1.0);}
  else if(A==7){scx=scy=max(1.0+u*0.7*am,0.001); blur=abs(u)*0.05*am; alpha=clamp(x*2.5,0.0,1.0);}
  else if(A==8){alpha=step(0.0001,x); float k2=clamp(x*5.0,0.0,1.0); scx=scy=1.0+(1.0-k2)*0.07*am;}
  else if(A==9){d=u*0.55*am; alpha=clamp(x*4.0,0.0,1.0); float st2=clamp(vel*0.12*max(p_stretch,0.35),-0.35,0.7); scy=1.0+st2; scx=1.0-st2*0.35;}
  else if(A==10){dx=u*(rgt-lft)*1.08*am; clipX=true; scx=1.0+clamp(vel*0.08*p_stretch,-0.3,0.5);}
  else {clipX=true; wipe=(rgt-lft)*0.5*max(e,0.0)*1.02; scx=scy=0.9+0.1*clamp(e,0.0,1.0);}
  if(A!=9&&A!=10&&p_stretch>0.0&&(A==0||A==5||A==7)){scy*=1.0+clamp(abs(vel)*0.08*p_stretch,0.0,0.5);}
  float pl=1.0+p_pulse*0.18; scx*=pl; scy*=pl; d/=hb; blur/=hb;
  vec2 s=uv; s.y+=d; s.x+=dx;
  if(p_boil>0.0){float tb=floor(tt*p_boilfps); d=(hash(vec2(idx,tb))-0.5)*0.035*p_boil; s.y+=d; s.x+=(hash(vec2(idx+3.1,tb))-0.5)*0.008*p_boil;
    s+=(vec2(noise(uv*vec2(34.0*ia,34.0)+tb*7.3),noise(uv*vec2(34.0*ia,34.0)+11.0+tb*5.1))-0.5)*0.022*p_boil*vec2(1.0/ia,1.0);}
  s.x=cx+(s.x-cx)/scx; s.y=yc+(s.y-yc)/scy;
  float a=0.0;
  if(blur>0.0005){for(int i=0;i<12;i++){float an=float(i)*2.39996; float rr=sqrt((float(i)+0.5)/12.0)*blur; a+=texture(uImage,s+vec2(cos(an)/ia,sin(an))*rr).a;} a/=12.0;}
  else a=texture(uImage,s).a;
  a*=step(yBot,s.y)*step(s.y,yTop)*step(0.0,s.x)*step(s.x,1.0)*alpha;
  if(clipX) a*=step(lft-0.0005,s.x)*step(s.x,rgt+0.0005)*step(abs(uv.x-cx),wipe);
  vec2 gd=vec2(cos(radians(p_angle)),sin(radians(p_angle))); float gt=dot(uv-0.5,gd*vec2(1.0,1.0/ia))+0.5;
  vec3 col=p_fill<0.5?p_color1:(p_fill<1.5?mix(p_color1,p_color2,clamp(gt,0.0,1.0)):pal(gt*0.8+uTime*0.03));
  if(p_shimmer>0.5){float band=fract(uTime*p_shimspeed*0.25)*1.6-0.3; float dd=uv.x-band;
    if(p_shimmer<1.5) col+=vec3(1.0)*(1.0-smoothstep(0.0,0.08,abs(dd)))*0.8; else col=mix(col,col*0.45+vec3(0.28),smoothstep(0.02,-0.02,dd));}
  return vec4(col*a,a);}`},
reveal:{kind:'fx',name:'Átmenet',usesPal:true,desc:'Időzített átmenet az alatta lévő teljes képre: átúszás, elmosásos zoom, folyékony feltárás, kör-maszk, fényvillanás, glitch, csíkok. Be, ki, vagy be és ki.',
 main:['mode','dir','at','dur','outAt','ease'],
 params:[SEL('mode','Átmenet',['Átúszás','Elmosásos zoom','Folyékony feltárás','Kör-maszk','Fényvillanás','Glitch-vágás','Csíkok','Forma-morph (kör → doboz → kép)','Átrepülés (zoom-through)','Betolás rugóval','Átlós seprés','Panelek nyílása'],0),SEL('dir','Irány',['Be','Ki','Be és ki'],0),
  S('at','Kezdés (mp)',0,60,0),S('dur','Időtartam (mp)',.05,5,1.2),S('outAt','Kilépés (mp)',0,60,8),SEL('ease','Görbe',EASE_NAMES,3),S('soft','Lágyság',0,1,.3)],
 code:`vec4 fx(){
  float tt=uTime; float xi=clamp((tt-p_at)/max(p_dur,0.01),0.0,1.0); float xo=clamp((tt-p_outAt)/max(p_dur,0.01),0.0,1.0);
  float e=p_dir<0.5?easeF(xi,p_ease):(p_dir<1.5?1.0-easeF(xi,p_ease):easeF(xi,p_ease)*(1.0-easeF(xo,p_ease)));
  float eo=e; e=clamp(e,0.0,1.0); int M=int(p_mode+0.5); vec4 c=vec4(0.0);
  if(M==0) c=IN(vUv)*e;
  else if(M==1){float z=1.0+(1.0-e)*0.6; vec4 acc=vec4(0.0); for(int i=0;i<10;i++){float k=1.0+(1.0-e)*0.05*float(i); acc+=IN(0.5+(vUv-0.5)/(z*k));} c=acc/10.0*e;}
  else if(M==2){float n=fbm(vUv*vec2(3.0*uRes.x/uRes.y,3.0)+3.1); float th=e*1.3-0.15; float w=0.02+p_soft*0.12; float m=1.0-smoothstep(th-w,th+w,n);
    float ed=exp(-abs(n-th)*30.0)*(1.0-e); c=IN(vUv+vec2(ed*0.03,ed*0.02))*m+vec4(pal(0.1)*ed*0.6,0.0);}
  else if(M==3){vec2 q=(vUv-0.5)*ASP(); float rr=e*1.2; float m=1.0-smoothstep(rr-0.02-p_soft*0.1,rr,length(q)); c=IN(vUv)*m;}
  else if(M==4){float lk=1.0-abs(e*2.0-1.0); c=IN(vUv)*smoothstep(0.3,0.7,e)+vec4(pal(0.1+vUv.x*0.2)*lk*(0.6+0.8*vUv.x),lk);}
  else if(M==5){float row=floor(vUv.y*24.0); float r=hash(vec2(row,floor(tt*20.0))); float m=step(r,e); float off=(1.0-e)*(hash(vec2(row,3.0))-0.5)*0.3; c=IN(vec2(fract(vUv.x+off),vUv.y))*m;}
  else if(M==6){float cl=floor(vUv.x*12.0); float lc=clamp(e*1.6-cl/12.0*0.6,0.0,1.0); c=IN(vUv)*step(1.0-vUv.y,lc);}
  else if(M==7){vec2 q=toQ(vUv)*uScale; vec2 as=ASP(); float g1=smoothstep(0.0,0.45,e), g2=smoothstep(0.35,1.0,e);
    vec2 hs=mix(vec2(0.06*e/0.45+0.001),vec2(0.24*as.x,0.3),g1); hs=mix(hs,as*0.5+0.03,g2); float rr=min(hs.x,hs.y)*(1.0-g2*0.92)*(1.0-g1*0.6+g1*0.6);
    rr=min(rr,min(hs.x,hs.y)); vec2 d2=abs(q)-hs+rr; float sd=length(max(d2,0.0))+min(max(d2.x,d2.y),0.0)-rr; float aa=fwidth(sd)+p_soft*0.03;
    float m=1.0-smoothstep(-aa,aa,sd); float rim=exp(-abs(sd)*90.0)*(1.0-g2)*step(0.001,e); c=IN(vUv)*m+vec4(pal(0.15)*rim*0.6,rim*0.6);}
  else if(M==8){float z=max(0.2,mix(5.0,1.0,eo)); vec4 acc=vec4(0.0); float bl=(1.0-clamp(e,0.0,1.0))*0.12;
    for(int i=0;i<10;i++){float k=1.0+bl*float(i)/9.0; acc+=IN(0.5+(vUv-0.5)/(z*k));} c=acc/10.0*smoothstep(0.0,0.35,e);}
  else if(M==9){float sh=(1.0-eo)*1.05; float v=abs(easeF(min(xi+0.03,1.0),p_ease)-easeF(xi,p_ease))/0.03; vec4 acc=vec4(0.0);
    for(int i=0;i<8;i++){vec2 uv=vUv+vec2(sh+min(v,4.0)*0.0035*float(i)*(1.0+p_soft*2.0),0.0); acc+=IN(uv)*step(0.0,uv.x)*step(uv.x,1.0);} c=acc/8.0;}
  else if(M==10){float dg=(vUv.x*uRes.x/uRes.y+vUv.y)/(uRes.x/uRes.y+1.0); float th=e*1.25-0.12; float w=0.01+p_soft*0.08;
    float m=1.0-smoothstep(th-w,th+w,dg); float ln=exp(-abs(dg-th)*120.0)*step(0.001,e)*step(e,0.999); c=IN(vUv)*m+vec4(pal(0.1)*ln,ln);}
  else {float pn=floor(vUv.x*3.0); float ee=clamp(e*1.5-pn*0.25,0.0,1.0); float yc=0.5; float hh=ee*0.5; float m=step(abs(vUv.y-yc),hh);
    float ed=exp(-abs(abs(vUv.y-yc)-hh)*200.0)*step(0.001,ee)*step(ee,0.999); c=IN(vUv)*m+vec4(vec3(1.0)*ed*0.5,ed*0.5);}
  return c;}`}
};
