import { S, SEL, COL } from './helpers';

/** worlds */
import type { EffectDef } from '../types';
export const worlds:Record<string,EffectDef>={
planet:{kind:'gen',name:'Bolygó',usesPal:true,desc:'Bolygó-stúdió: hét bolygótípus, valódi légköri derengés, forgó felhők, éjszakai városfények, gyűrű árnyékkal. A Mag (seed) mellett a kockával új bolygót dobsz.',
 main:['ptype','seed','radius','sunang','atmo','clouds','ring'],
 params:[SEL('ptype','Típus',['Sziklás','Óceán','Gázóriás','Jég','Láva','Sivatag','Erdő'],1),S('seed','Mag',0,999,7,1),S('radius','Méret',.05,.8,.3),S('sunang','Nap iránya °',-180,180,35),S('sunh','Nap magassága',-1,1,.15),
  S('atmo','Légkör',0,2,1),COL('atmocol','Légkör színe','#5aa8ff'),S('clouds','Felhőzet',0,1,.5),S('cloudspeed','Felhők szele',0,3,.6),S('lights','Városfények',0,2,0),S('ring','Gyűrű',0,1,0),S('ringtilt','Gyűrű dőlése °',5,80,18),
  S('spin','Forgás',-2,2,.2),S('tilt','Tengelyferdeség °',-60,60,15),S('craters','Kráterek / viharok',0,1,.5),S('detail','Domborzat léptéke',.3,3,1),S('tint','Palettás színezés',0,1,0),
  SEL('part','Réteg',['Teljes bolygó','Csak felszín','Csak felhőhéj','Csak légkör','Csak gyűrű – hátsó fele','Csak gyűrű – első fele'],0)],
 lib:`float wh(float n){return fract(sin(n)*43758.5453);}
float wn3(vec3 x){vec3 i=floor(x),f=fract(x);f=f*f*(3.0-2.0*f);float n=i.x+i.y*57.0+i.z*113.0;
 return mix(mix(mix(wh(n),wh(n+1.0),f.x),mix(wh(n+57.0),wh(n+58.0),f.x),f.y),mix(mix(wh(n+113.0),wh(n+114.0),f.x),mix(wh(n+170.0),wh(n+171.0),f.x),f.y),f.z);}
float wfbm(vec3 p){float v=0.0,a=0.5;for(int i=0;i<6;i++){v+=a*wn3(p);p=p*2.03+vec3(1.7,9.2,3.1);a*=0.5;}return v;}
mat3 wrY(float a){float c=cos(a),s=sin(a);return mat3(c,0.0,-s,0.0,1.0,0.0,s,0.0,c);}
mat3 wrZ(float a){float c=cos(a),s=sin(a);return mat3(c,s,0.0,-s,c,0.0,0.0,0.0,1.0);}`,
 code:`vec4 fx(){
  vec2 p=P(); float R=p_radius; float r=length(p); float px=1.5/(uRes.y*uScale);
  float sa=radians(p_sunang), se=p_sunh*1.2;
  vec3 Ld=normalize(vec3(cos(sa)*cos(se),sin(se),sin(sa)*cos(se)));
  vec3 so=vec3(wh(p_seed*1.31+0.5)*60.0,wh(p_seed*2.17+1.0)*60.0,wh(p_seed*0.73+2.0)*60.0);
  vec3 acol=p_atmocol; float t=uTime; int ty=int(p_ptype+0.5); int PT=int(p_part+0.5);
  vec3 col=vec3(0.0); float A=0.0;
  float rt=radians(p_ringtilt); vec3 rn=normalize(vec3(0.0,cos(rt),sin(rt)));
  float rz=-(rn.x*p.x+rn.y*p.y)/rn.z; vec3 rp=vec3(p,rz); float rd=length(rp)/max(R,0.001);
  float ringM=0.0; vec3 ringC=vec3(0.0);
  if(p_ring>0.001&&rd>1.25&&rd<2.4){
    float band=0.55+0.45*sin(rd*38.0+wn3(vec3(rd*20.0,0.0,0.0))*3.0); band*=smoothstep(1.25,1.4,rd)*(1.0-smoothstep(2.1,2.4,rd)); band*=0.6+0.4*wn3(vec3(rd*80.0,1.0,2.0));
    vec3 w=rp/R; float along=dot(w,Ld); float perp=length(w-Ld*along); float shd=(along<0.0&&perp<1.0)?0.12:1.0;
    float lit=0.35+0.65*abs(dot(rn,Ld)); ringC=mix(vec3(0.85,0.78,0.65),pal(rd*0.3),p_tint*0.8)*lit*shd; ringM=clamp(band*p_ring,0.0,1.0);}
  if((PT==0||PT==4)&&ringM>0.0&&rz<=0.0){col=ringC*ringM; A=ringM;}
  if(r<R+px){
    float edge=1.0-smoothstep(R-px,R+px,r);
    vec2 pp=p/R; vec3 n=vec3(pp,sqrt(max(0.0,1.0-dot(pp,pp))));
    vec3 q=wrY(t*p_spin*0.15)*wrZ(radians(p_tilt))*n;
    float ndl=dot(n,Ld); float day=smoothstep(-0.08,0.2,ndl); float diff=max(ndl,0.0);
    float h=wfbm(q*2.2*p_detail+so);
    vec3 surf=vec3(0.5); float land=1.0; float spec=0.0; vec3 emit=vec3(0.0);
    if(ty==0){surf=mix(vec3(0.22,0.2,0.19),vec3(0.62,0.57,0.5),smoothstep(0.3,0.7,h)); float cr=wfbm(q*9.0+so*1.7); surf*=0.75+0.5*smoothstep(0.45,0.6,cr)-0.35*smoothstep(0.62,0.7,cr)*p_craters;}
    else if(ty==1){float lv=0.52; land=smoothstep(lv,lv+0.02,h); vec3 sea=mix(vec3(0.01,0.05,0.18),vec3(0.03,0.22,0.4),smoothstep(0.3,lv,h));
      vec3 gr=mix(vec3(0.12,0.3,0.1),vec3(0.45,0.38,0.22),smoothstep(lv+0.05,0.75,h)); gr=mix(gr,vec3(0.95),smoothstep(0.8,0.85,abs(q.y)+h*0.2));
      surf=mix(sea,gr,land); spec=(1.0-land)*pow(max(dot(reflect(-Ld,n),vec3(0.0,0.0,1.0)),0.0),40.0)*0.8;}
    else if(ty==2){float lat=q.y; float bands=lat*7.0+wfbm(vec3(q.x*1.5,lat*10.0,q.z*1.5)+so)*2.2;
      surf=mix(vec3(0.75,0.6,0.42),vec3(0.95,0.88,0.75),0.5+0.5*sin(bands*3.0)); surf=mix(surf,vec3(0.6,0.35,0.22),smoothstep(0.55,0.75,wn3(vec3(bands*2.0,0.0,1.0)+so)));
      vec2 sp=vec2(atan(q.z,q.x),lat)-vec2(1.0,-0.25); float storm=exp(-dot(sp*vec2(1.5,5.0),sp*vec2(1.5,5.0))*8.0); surf=mix(surf,vec3(0.75,0.3,0.18),storm*0.8*p_craters);}
    else if(ty==3){surf=mix(vec3(0.62,0.75,0.88),vec3(0.95,0.97,1.0),smoothstep(0.35,0.7,h)); float ck=abs(wfbm(q*6.0+so)-0.5); surf*=1.0-(1.0-smoothstep(0.0,0.02,ck))*0.35;
      spec=0.25*pow(max(dot(reflect(-Ld,n),vec3(0.0,0.0,1.0)),0.0),20.0);}
    else if(ty==4){surf=mix(vec3(0.06,0.04,0.04),vec3(0.2,0.12,0.1),h); float ck=abs(wfbm(q*5.0+so)-0.5); float hot=1.0-smoothstep(0.0,0.035,ck);
      emit=vec3(1.0,0.35,0.05)*hot*2.2+vec3(1.0,0.5,0.1)*smoothstep(0.62,0.72,h)*1.2;}
    else if(ty==5){float du=sin((q.x+q.z)*40.0+wfbm(q*3.0+so)*6.0)*0.5+0.5; surf=mix(vec3(0.62,0.38,0.2),vec3(0.86,0.62,0.38),smoothstep(0.3,0.7,h)*0.7+du*0.3);}
    else {land=smoothstep(0.45,0.47,h); surf=mix(vec3(0.02,0.08,0.15),mix(vec3(0.05,0.22,0.08),vec3(0.2,0.35,0.12),wfbm(q*8.0+so)),land);}
    surf=mix(surf,surf*pal(h*0.6+0.1)*1.6,p_tint);
    float cl=0.0; if(p_clouds>0.001){vec3 cq=wrY(t*p_spin*0.2+t*p_cloudspeed*0.05)*wrZ(radians(p_tilt))*n; cl=smoothstep(1.0-p_clouds*0.9,1.15-p_clouds*0.7,wfbm(cq*3.0+so+vec3(5.0)))*p_clouds;}
    if(PT==1) cl=0.0;
    vec3 lit=surf*(0.015+diff*1.15)+spec*day; vec3 cloudc=vec3(0.95)*(0.02+diff*1.1);
    lit=mix(lit,cloudc,cl);
    float night=1.0-smoothstep(-0.15,0.05,ndl);
    float city=step(0.86,wh(dot(floor(q*140.0),vec3(1.0,57.0,113.0))))*land*(1.0-cl)*smoothstep(0.4,0.7,wfbm(q*4.0+so*0.5));
    lit+=vec3(1.0,0.7,0.35)*city*night*p_lights*1.5;
    lit+=emit*(0.4+0.6*night);
    float fr=pow(1.0-n.z,2.5);
    vec3 atm=acol*fr*p_atmo*(0.15+1.2*smoothstep(-0.25,0.6,ndl))+vec3(1.0,0.45,0.2)*exp(-abs(ndl)*10.0)*p_atmo*0.35*smoothstep(-0.2,0.6,fr+0.3);
    if(PT==0) lit+=atm;
    if(PT==2){col=cloudc*cl*edge; A=cl*edge;}
    else if(PT==3){float ga=clamp(max(atm.r,max(atm.g,atm.b)),0.0,1.0)*edge; col=atm*edge; A=ga;}
    else if(PT==4){col*=1.0-edge; A*=1.0-edge;}
    else if(PT!=5){col=mix(col,lit,edge); A=max(A,edge);}}
  if((PT==0||PT==3)&&r>R*0.97){float hgt=max(r-R,0.0)/(R*0.07*max(p_atmo,0.05)); float g=exp(-hgt*hgt*0.5)*p_atmo; vec3 dir=normalize(vec3(p/max(r,1e-4),0.15));
    g*=smoothstep(-0.4,0.7,dot(dir,Ld))*step(R-px,r); col+=acol*g*0.9; A=max(A,clamp(g,0.0,1.0));}
  if((PT==0||PT==5)&&ringM>0.0&&rz>0.0){col=col*(1.0-ringM)+ringC*ringM; A=ringM+A*(1.0-ringM);}
  return vec4(col,A);}`},
sky:{kind:'gen',name:'Égbolt',noPal:true,desc:'Égbolt-stúdió (Bliss): napszak szerinti égszín, felhőtípusok saját randomizálóval, dombos táj, pára és fénysugarak.',
 main:['ctype','seed','sunh','cover','hills'],
 params:[SEL('ctype','Felhők',['Gomoly','Fátyol','Réteg','Vihar'],0),S('seed','Mag',0,999,3,1),S('sunh','Napszak (nap magassága)',-.3,1,.55),S('sunx','Nap vízszintesen',-1,1,.35),S('cover','Borítottság',0,1,.45),
  S('cscale','Felhők mérete',.3,3,1),S('wind','Szél',0,2,.3),S('hills','Dombok',0,1,1),S('hillh','Horizont',-.5,.2,-.18),COL('grass','Fű színe','#3f8f2a'),S('haze','Pára',0,1,.35),S('rays','Fénysugarak',0,1,.3)],
 lib:`vec3 skyCol(float y,float sh){vec3 zd=vec3(0.12,0.36,0.82),hd=vec3(0.62,0.8,0.97),zs=vec3(0.14,0.18,0.42),hs=vec3(1.0,0.56,0.32),zn=vec3(0.01,0.015,0.04),hn=vec3(0.04,0.05,0.1);
 float day=smoothstep(0.05,0.45,sh); float night=1.0-smoothstep(-0.2,0.02,sh);
 vec3 z=mix(mix(zs,zd,day),zn,night),hz=mix(mix(hs,hd,day),hn,night); return mix(hz,z,pow(clamp(y,0.0,1.0),0.6));}
float cloudD(vec2 uv){vec2 so=vec2(p_seed*0.173,p_seed*0.311);
 if(p_ctype<0.5){float b=fbm(uv*1.2+so); float d2=fbm(uv*3.5+so+b); return smoothstep(1.0-p_cover-0.05,1.0-p_cover+0.3,b*0.65+d2*0.45);}
 if(p_ctype<1.5){vec2 s2=uv*vec2(0.35,3.0); float b=fbm(s2+so+fbm(uv*2.0)*0.8); return smoothstep(1.0-p_cover,1.25-p_cover,b)*0.55;}
 if(p_ctype<2.5){float b=fbm(uv*0.6+so); return smoothstep(0.55-p_cover*0.6,0.9-p_cover*0.5,b)*0.9;}
 float b=fbm(uv*0.9+so); float d2=fbm(uv*2.8+so+b*1.5); return smoothstep(0.75-p_cover*0.8,1.0-p_cover*0.6,b*0.6+d2*0.5);}`,
 code:`vec4 fx(){
  vec2 p=P(); float t=uTime; float sh=p_sunh; float hz=p_hillh; float y01=(p.y-hz)/(0.55-hz);
  vec3 col=skyCol(y01,sh);
  vec2 sp=vec2(p_sunx*0.75,hz+0.05+sh*0.55); float sd=length(p-sp);
  vec3 sunC=mix(vec3(1.0,0.55,0.25),vec3(1.0,0.97,0.9),smoothstep(0.0,0.4,sh));
  col+=sunC*(1.0-smoothstep(0.022,0.026,sd))*3.0*step(-0.1,sh);
  col+=sunC*(exp(-sd*7.0)*0.45+exp(-sd*25.0)*0.6)*smoothstep(-0.25,0.05,sh);
  float yy=max(p.y-hz,0.02); vec2 cuv=vec2(p.x/(yy*1.6+0.25),1.0/(yy*1.6+0.25))*0.6*p_cscale; cuv.x+=t*p_wind*0.05; cuv.y+=t*p_wind*0.01;
  float d=cloudD(cuv); vec2 tos=normalize(sp-p+vec2(1e-4)); float dl=cloudD(cuv+tos*0.06); float lightC=clamp(0.55+(d-dl)*3.0,0.0,1.0);
  float day=smoothstep(0.05,0.45,sh); float night=1.0-smoothstep(-0.2,0.02,sh);
  vec3 litc=mix(vec3(1.0,0.62,0.42),vec3(1.0),day)*mix(1.0,0.08,night); vec3 shc=skyCol(0.0,sh)*mix(0.55,0.85,day)*mix(1.0,0.5,night);
  if(p_ctype>2.5){litc*=0.55;shc*=0.35;}
  vec3 cc=mix(shc,litc,lightC); cc+=sunC*exp(-sd*6.0)*0.6*d*(1.0-d);
  col=mix(col,cc,d*smoothstep(0.0,0.12,p.y-hz)*step(hz,p.y));
  float ang=atan(p.y-sp.y,p.x-sp.x); float ry=pow(noise(vec2(ang*9.0+p_seed,t*0.05)),3.0)*exp(-sd*1.8)*p_rays*day*(1.0-d*0.6); col+=sunC*ry*0.6;
  if(p_hills>0.001){float hx=p.x;
    float h1=hz+0.06*sin(hx*1.9+p_seed)+0.035*sin(hx*4.3+1.3+p_seed*0.7)+0.012*fbm(vec2(hx*6.0,p_seed));
    float h2=hz+0.02+0.05*sin(hx*1.3+2.0+p_seed*1.3)+0.02*sin(hx*3.7);
    vec3 g=p_grass; vec3 hazeC=skyCol(0.0,sh); float lightK=mix(0.35,1.0,smoothstep(-0.1,0.3,sh))*mix(1.0,0.15,night);
    if(p.y<h2){vec3 c2=mix(g*0.7,hazeC,0.55)*lightK; col=mix(col,c2,p_hills);}
    if(p.y<h1){float depth=clamp((h1-p.y)/0.6,0.0,1.0); float tex=fbm(vec2(p.x*60.0,p.y*140.0))*0.25+fbm(vec2(p.x*7.0,p.y*12.0)+p_seed)*0.25;
      vec3 c1=g*(0.55+0.35*(1.0-depth)+tex)*mix(vec3(1.0),vec3(1.0,0.75,0.55),1.0-day)*lightK; c1=mix(c1,hazeC,p_haze*0.4*(1.0-depth)); col=mix(col,c1,p_hills);}}
  col=mix(col,skyCol(0.0,sh)*1.05,p_haze*exp(-abs(p.y-hz)*14.0)*0.6);
  return vec4(col,1.0);}`},
space:{kind:'gen',name:'Űr',usesPal:true,desc:'Csillagközi tájkép alapja: valós színű csillagok több mélységben, Tejút porsávokkal, csillagköd, diffrakciós tüskés fényes csillagok.',
 main:['seed','stars','mw','dust','nebula','bright'],
 params:[S('seed','Mag',0,999,11,1),S('stars','Csillagok',0,2,1),S('mw','Tejút',0,2,1),S('mwtilt','Tejút dőlése °',-90,90,25),S('dust','Porsávok',0,1.5,.8),S('nebula','Köd',0,2,.6),S('bright','Fényes csillagok',0,1,.5),S('twinkle','Pislákolás',0,1,.3),S('drift','Sodródás',0,1,.1)],
 lib:`vec3 starCol(float h){return mix(mix(vec3(1.0,0.62,0.42),vec3(1.0,0.95,0.9),smoothstep(0.0,0.5,h)),vec3(0.65,0.78,1.0),smoothstep(0.5,1.0,h));}
float starL(vec2 p,float sc,float dens,float sd,out vec3 c){vec2 g=p*sc; vec2 id=floor(g); vec2 f=fract(g)-0.5; float h=hash(id+sd); float h2=hash(id+sd+7.1);
 vec2 o=vec2(hash(id+sd+3.3),hash(id+sd+5.7))-0.5; float d=length(f-o*0.7); c=starCol(h2); return step(1.0-dens,h)*(1.0-smoothstep(0.0,0.08+0.12*h2,d))*(0.3+0.7*h2);}`,
 code:`vec4 fx(){
  vec2 p=P()+vec2(uTime*p_drift*0.01,0.0); float sd=p_seed*0.137;
  vec2 q=rot(radians(p_mwtilt))*p;
  float bw=0.16+0.07*fbm(q*2.0+sd); float band=exp(-pow(q.y/bw,2.0));
  float neb=fbm(q*vec2(1.5,4.0)+sd); float core=exp(-pow(q.x*0.6,2.0));
  vec3 mwc=mix(vec3(0.55,0.6,0.85),vec3(1.0,0.82,0.6),core*band)*band*(0.25+0.55*neb)*p_mw;
  float dl=smoothstep(0.42,0.68,fbm(q*vec2(3.0,9.0)+sd+fbm(q*5.0)));
  mwc*=1.0-dl*p_dust*0.85*band;
  vec3 col=mwc*0.6;
  vec2 w=p*1.3+sd; vec2 wq=vec2(fbm(w),fbm(w+5.2)); float nf=fbm(w+wq*2.5); float mask=smoothstep(0.45,0.85,fbm(p*0.8+sd+3.0));
  col+=pal(nf*0.7+wq.x*0.3)*pow(nf,2.2)*mask*p_nebula*1.4;
  col*=1.0-smoothstep(0.55,0.8,fbm(p*3.0+sd+9.0))*0.6*p_dust*mask;
  vec3 sc; float st; float dens=0.08*p_stars*(1.0+band*2.0*p_mw);
  st=starL(p,90.0,dens,sd,sc); col+=sc*st*(1.0-p_twinkle*0.5+p_twinkle*0.5*sin(uTime*3.0+hash(floor(p*90.0))*30.0));
  st=starL(p,40.0,dens*0.5,sd+1.0,sc); col+=sc*st*1.4;
  st=starL(p,180.0,dens*1.5,sd+2.0,sc); col+=sc*st*0.6;
  vec2 g=p*6.0; vec2 id=floor(g);
  for(int j=-1;j<=1;j++)for(int i=-1;i<=1;i++){vec2 cid=id+vec2(float(i),float(j)); float h=hash(cid+sd+11.0);
    if(h>1.0-0.12*p_bright){vec2 c=cid+0.5+(vec2(hash(cid+sd+12.0),hash(cid+sd+13.0))-0.5)*0.6; vec2 d=g-c; float r=length(d);
      float br=exp(-r*30.0)*2.0+exp(-r*8.0)*0.25+(exp(-abs(d.x)*90.0)*exp(-abs(d.y)*5.0)+exp(-abs(d.y)*90.0)*exp(-abs(d.x)*5.0))*0.5; col+=starCol(hash(cid+sd+14.0))*br*p_bright;}}
  return vec4(col,1.0);}`},
bokeh:{kind:'gen',name:'Bokeh',desc:'Életlen fénykorongok sötét háttéren — mozi- és termékfilm-hangulat.',main:['count','size','soft','bright'],
 params:[S('count','Darabszám',3,60,24,1),S('size','Méret',.2,3,1),S('soft','Lágyság',0,1,.6),S('bright','Fényerő',0,3,1),S('speed','Sodródás',0,3,.4)],
 code:`vec4 fx(){vec2 p=P(); vec3 col=vec3(0.0); float t=uTime*p_speed; float asp=uRes.x/uRes.y;
  for(int i=0;i<60;i++){if(float(i)>=p_count) break; float fi=float(i);
    vec2 c=vec2((hash(vec2(fi,1.0))-0.5)*asp*1.1,hash(vec2(fi,2.0))-0.5)+vec2(sin(t*0.2+fi*1.7),cos(t*0.17+fi*2.3))*0.04;
    float r=p_size*(0.03+0.07*hash(vec2(fi,3.0))); float d=length(p-c);
    float a=(1.0-smoothstep(r*(1.0-p_soft*0.9),r,d))*(0.2+0.8*hash(vec2(fi,4.0)));
    a*=0.75+0.25*smoothstep(r*0.7,r,d)*(1.0-p_soft);
    col+=pal(hash(vec2(fi,5.0))*0.4+0.05)*a*0.45*p_bright;}
  return vec4(col,1.0);}`}
};
