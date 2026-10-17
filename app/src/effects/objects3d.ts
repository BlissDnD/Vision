import { COL, S, SEL } from './helpers';

/** 3D */
import type { EffectDef } from '../types';
export const objects3d:Record<string,EffectDef>={
surface3d:{kind:'3d',name:'Gerincfelület',mesh:true,desc:'Valódi 3D felület egy szerkeszthető gerincgörbéből: széles, vékony, ívelt lap lekerekített éllel, fényes lakk/fém anyaggal, stúdiófénnyel, tükröző padlóval és a padlóba simulással. Háromszöghálóként renderelődik (gyors, élsimított), a kamera animálható; a 3D forgatás eszközzel (O) körbejárható.',
 main:['arch','width','thick','color','rough','metal','coat','refl'],
 groups:[{t:'Fő beállítások',keys:['arch','width','thick','color','rough','metal','coat','refl','expo'],open:true},{t:'Forma',keys:['taper','bend','lean','leanEnd','twist','fillet']},{t:'Anyag',keys:['tint','silver','dot','dotS']},{t:'Fény',keys:['stripPos','stripSize','stripI','backI','sky']},{t:'Padló és háttér',keys:['floor','bg','blur','ao']},{t:'Kamera',keys:['ry','rx','dist','fov','tx','ty','tz']}],
 spine:[[-6.4,4.4,0.6],[-4.2,3.0,-0.5],[-2.6,1.2,-1.4],[-1.0,0.14,-2.0],[0.7,0.7,-2.6],[2.4,1.9,-2.2],[3.9,3.1,-1.2],[5.0,4.4,0.6],[5.8,5.8,3.0]],
 params:[S('arch','Ív',0.4,1.6,1),S('width','Szélesség',2,12,7),S('thick','Vastagság',0.02,0.6,0.09),COL('color','Szín','#8e0c14'),S('rough','Érdesség',0.02,0.8,0.18),S('metal','Fémesség',0,1,0.85),S('coat','Lakkréteg',0,1,0.35),S('refl','Padlóreflexió',0,1.6,0.9),S('expo','Expozíció (réteg)',0.1,2,0.72),
  S('taper','Elvékonyodás',-0.9,0.9,0),S('bend','Keresztirányú hajlítás',-0.5,0.5,0.12),S('lean','Lelógás eleje',-2.5,2.5,0.9),S('leanEnd','Lelógás vége',-2.5,2.5,-1.2),S('twist','Csavarodás',-3,3,0),S('fillet','Padlóba simulás',0,1.2,0.35),
  S('tint','Vörös tükröződés',0,1,0.92),S('silver','Ezüst perem',0,1,0.9),S('dot','Pontminta',0,1,0.8),S('dotS','Pontsűrűség (m)',0.01,0.15,0.035),
  S('stripPos','Fénycsík helye',-6,6,0.6),S('stripSize','Fénycsík mérete',0.2,2.5,1),S('stripI','Fénycsík ereje',0,8,2.5),S('backI','Hátsó fény',0,4,0.8),S('sky','Stúdió fényereje',0.3,2,0.95),
  SEL('floor','Padló',['Nincs','Tükröző padló'],1),SEL('bg','Háttér',['Átlátszó','Stúdió'],1),S('blur','Tükör elmosása',0,4,1),S('ao','Kontaktárnyék',0,2,1),
  S('ry','Kamera: körbe (°)',-180,180,-11),S('rx','Kamera: magasság (°)',-80,80,-6),S('dist','Kamera: távolság',2,30,8.4),S('fov','Látószög (°)',15,100,62),S('tx','Cél X',-10,10,1),S('ty','Cél Y',-2,8,1.35),S('tz','Cél Z',-12,6,-3)],
 code:`vec4 fx(){return vec4(0.0);}`},
obj3d:{kind:'3d',name:'3D objektum',desc:'Fizikai alapú (PBR) 3D test: környezeti fény, lágy árnyék, ambient occlusion, felületi textúra. A 3D forgatás eszközzel (O) húzva forgathatod.',
 main:['shape','material','env','rough','metal','detail','floor','glow'],
 params:[SEL('shape','Forma',['Gömb','Tórusz','Kocka','Oktaéder','Merkaba','Giroid gömb','Tóruszcsomó','Dodekaéder','Ikozaéder','Metagömbök'],0),
  SEL('material','Anyag',['Irizáló','Plazma','Bolygó','Hologram','Króm','Láva','Üveg','Normál-színek','Toon','Agyag','Gyöngyház','Bársony'],0),
  SEL('env','Környezet',['Stúdió','Naplemente','Kozmikus','Neon'],0),S('rough','Érdesség',0,1,.4),S('metal','Fémesség',0,1,0),S('detail','Felületi textúra',0,1,.15),S('floor','Árnyék a talajon',0,1,0),S('glow','Peremfény',0,3,.6),
  SEL('aa','Élsimítás',['Gyors','4× (lassabb)'],0),
  S('displace','Torzítás',0,1,.15),S('spin','Forgás',-2,2,.3),S('rx','Dőlés °',-180,180,20),S('ry','Fordulat °',-180,180,0),S('twist','Csavarás',-3,3,0),S('ring','Gyűrű',0,1,0),S('speed','Anyag tempója',0,3,.5),SEL('sceneL','Jelenetfény hat rá',['Nem','Igen'],1)],
 code:`uniform vec3 uLDir; uniform vec3 uLEnv; uniform vec3 uLCol; uniform float uLSoftK; uniform float uLSize; uniform float uLWrap;   // scene light (render.ts lightU)
mat3 gM;
mat3 rX(float a){float c=cos(a),s=sin(a);return mat3(1.0,0.0,0.0,0.0,c,s,0.0,-s,c);}
mat3 rY(float a){float c=cos(a),s=sin(a);return mat3(c,0.0,-s,0.0,1.0,0.0,s,0.0,c);}
float tet(vec3 p,float s){return (max(max(-p.x-p.y-p.z,p.x+p.y-p.z),max(-p.x+p.y+p.z,p.x-p.y+p.z))-s)*0.57735;}
float smin(float a,float b,float k){float h=clamp(0.5+0.5*(b-a)/k,0.0,1.0);return mix(b,a,h)-k*h*(1.0-h);}
float body(vec3 q){
  float t=uTime*p_speed; float d;
  if(p_shape<0.5) d=length(q)-0.75;
  else if(p_shape<1.5){vec2 tq=vec2(length(q.xz)-0.58,q.y);d=length(tq)-0.22;}
  else if(p_shape<2.5){vec3 b=abs(q)-vec3(0.5);d=length(max(b,0.0))+min(max(b.x,max(b.y,b.z)),0.0)-0.08;}
  else if(p_shape<3.5){d=(abs(q.x)+abs(q.y)+abs(q.z)-0.9)*0.57735;}
  else if(p_shape<4.5){d=min(tet(q,0.5),tet(-q,0.5));}
  else if(p_shape<5.5){d=max(length(q)-0.8,(abs(dot(sin(q*7.0),cos(q.zxy*7.0)))/7.0-0.025)*0.8);}
  else if(p_shape<6.5){float rr=length(q.xz);float an=atan(q.z,q.x);vec2 qq=vec2(rr-0.5,q.y);float dk=1e9;for(int k=0;k<2;k++){float aa=(an+TAU*float(k))*1.5;dk=min(dk,length(qq-vec2(cos(aa),sin(aa))*0.22));}d=(dk-0.1)*0.8;}
  else if(p_shape<7.5){vec3 ab=abs(q);d=max(max(dot(ab.yz,vec2(0.5257,0.8507)),dot(ab.xy,vec2(0.5257,0.8507))),dot(ab.xz,vec2(0.8507,0.5257)))-0.62;}
  else if(p_shape<8.5){vec3 ab=abs(q);d=max(max(dot(ab,vec3(0.57735)),dot(ab.yz,vec2(0.356822,0.934172))),max(dot(ab.xy,vec2(0.356822,0.934172)),dot(ab.xz,vec2(0.934172,0.356822))))-0.66;}
  else {d=1e9;for(int i=0;i<6;i++){float fi=float(i);vec3 c=vec3(sin(t*0.7+fi*1.3),sin(t*0.9+fi*2.1),cos(t*0.6+fi*1.7))*0.45;d=smin(d,length(q-c)-0.28,0.3);}}
  d+=sin(q.x*6.0+t)*sin(q.y*6.0+t*1.1)*sin(q.z*6.0+t*0.9)*p_displace*0.12;
  return d;}
vec2 map(vec3 p){
  vec3 q=gM*p; q.xz=rot(q.y*p_twist)*q.xz;
  vec2 r=vec2(body(q),0.0);
  if(p_ring>0.01){vec3 rq=rX(0.35)*(gM*p);float rr=length(rq.xz);float dr=max(abs(rr-1.2)-0.32,abs(rq.y)-0.004);if(dr<r.x)r=vec2(dr,1.0);}
  return r;}
vec3 calcN(vec3 p){vec2 e=vec2(0.0015,-0.0015);return normalize(e.xyy*map(p+e.xyy).x+e.yyx*map(p+e.yyx).x+e.yxy*map(p+e.yxy).x+e.xxx*map(p+e.xxx).x);}
float h1(float n){return fract(sin(n)*43758.5453);}
float n3(vec3 x){vec3 i=floor(x),f=fract(x);f=f*f*(3.0-2.0*f);float n=i.x+i.y*57.0+i.z*113.0;
  return mix(mix(mix(h1(n),h1(n+1.0),f.x),mix(h1(n+57.0),h1(n+58.0),f.x),f.y),mix(mix(h1(n+113.0),h1(n+114.0),f.x),mix(h1(n+170.0),h1(n+171.0),f.x),f.y),f.z);}
float fbm3(vec3 p){return n3(p)*0.6+n3(p*2.1+3.1)*0.3+n3(p*4.3+7.7)*0.1;}
vec3 envMap(vec3 d,float rough){
  float sharp=mix(70.0,2.5,rough); float y=d.y; vec3 col; int e=int(p_env+0.5);
  if(e==0){col=mix(vec3(0.015),vec3(0.11),smoothstep(-0.6,1.0,y));
    col+=vec3(1.0,0.98,0.95)*(uLCol/vec3(1.0,0.97,0.92))*2.4*pow(max(dot(d,uLEnv),0.0),mix(70.0,2.5,mix(rough,1.0,uLSize*0.6)));
    col+=vec3(0.85,0.92,1.0)*1.3*pow(max(dot(d,normalize(vec3(0.75,0.25,-0.45))),0.0),sharp*0.7);
    col+=vec3(0.9)*0.5*smoothstep(0.55,1.0,y);}
  else if(e==1){col=mix(vec3(0.95,0.45,0.22),vec3(0.12,0.16,0.38),smoothstep(-0.1,0.7,y))*mix(0.2,1.0,smoothstep(-0.6,0.05,y));
    col+=vec3(1.0,0.72,0.42)*3.0*pow(max(dot(d,normalize(vec3(-0.5,0.12,0.8))),0.0),sharp*2.0);}
  else if(e==2){col=pal(y*0.3+0.5+atan(d.z,d.x)*0.08)*mix(0.06,0.55,smoothstep(-1.0,1.0,y));
    col+=pal(0.1)*2.2*pow(max(dot(d,normalize(vec3(0.5,0.6,0.6))),0.0),sharp);}
  else {float az=atan(d.z,d.x); float band=smoothstep(-0.35,0.2,y)*(1.0-smoothstep(0.5,0.9,y)); float w=0.08+rough*0.6;
    col=vec3(0.012)+vec3(1.0,0.22,0.6)*2.4*exp(-pow((az-1.2)/w,2.0))*band+vec3(0.2,0.75,1.0)*2.4*exp(-pow((az+1.9)/w,2.0))*band+vec3(0.6,0.4,1.0)*0.6*smoothstep(0.7,1.0,y);}
  return col;}
float softShadow(vec3 ro,vec3 rd){float res=1.0,tt=0.02;for(int i=0;i<32;i++){float hh=map(ro+rd*tt).x;res=min(res,uLSoftK*hh/tt);tt+=clamp(hh,0.02,0.25);if(res<0.004||tt>5.0)break;}return clamp(res,0.0,1.0);}
float calcAO(vec3 pos,vec3 n){float occ=0.0,sca=1.0;for(int i=0;i<5;i++){float hh=0.02+0.11*float(i);float d=map(pos+n*hh).x;occ+=(hh-d)*sca;sca*=0.9;}return clamp(1.0-2.5*occ,0.0,1.0);}
vec3 shadePBR(vec3 n,vec3 rd,vec3 alb,float rough,float metal,float ao,float sh){
  vec3 v=-rd; float nv=max(dot(n,v),0.0); vec3 F0=mix(vec3(0.04),alb,metal);
  vec3 F=F0+(1.0-F0)*pow(1.0-nv,5.0)*(1.0-rough*0.7);
  vec3 spec=envMap(reflect(rd,n),rough)*F;
  vec3 irr=envMap(n,1.0)*0.9+0.03;
  vec3 diff=alb*irr*(1.0-metal);
  vec3 L=uLDir; vec3 H=normalize(L+v); float nl=max((dot(n,L)+uLWrap)/(1.0+uLWrap),0.0); float nh=max(dot(n,H),0.0);
  float a2=pow(max(mix(rough,1.0,uLSize),0.05),4.0); float dd=nh*nh*(a2-1.0)+1.0; float D=a2/(PI*dd*dd);
  vec3 key=(alb*(1.0-metal)*0.6+F*D*0.25)*nl*mix(sh,1.0,uLWrap*0.6)*uLCol*1.6;
  return (diff+spec)*mix(0.35,1.0,ao)*mix(0.55,1.0,sh)+key;}
vec4 render(vec2 p){
  float t=uTime*p_speed;
  vec3 ro=vec3(0.0,0.0,3.5); vec3 rd=normalize(vec3(p,-1.8));
  float tt=0.0; float md=1e9; vec2 hit=vec2(0.0,-1.0);
  for(int i=0;i<110;i++){vec3 pos=ro+rd*tt; vec2 m=map(pos); md=min(md,m.x); if(m.x<0.0007*(1.0+tt)){hit=vec2(tt,m.y);break;} tt+=m.x*0.75; if(tt>9.0) break;}
  vec3 L=uLDir;
  if(hit.y<-0.5){
    vec4 res=vec4(0.0);
    if(p_floor>0.001&&rd.y<0.0){float tf=(-1.0-ro.y)/rd.y; vec3 fp=ro+rd*tf; float sh=softShadow(fp+vec3(0.0,0.002,0.0),L); float ao=clamp(map(fp).x*1.2,0.0,1.0);
      res.a=clamp((1.0-min(sh,0.25+0.75*ao))*p_floor*exp(-length(fp.xz)*0.35),0.0,1.0);}
    float halo=exp(-max(md,0.0)*14.0)*p_glow*0.5; res.rgb+=pal(0.6)*halo; res.a=max(res.a,clamp(halo,0.0,1.0));
    return res;}
  vec3 pos=ro+rd*hit.x; vec3 n=calcN(pos); vec3 lq=gM*pos; vec3 v=-rd;
  float fres=pow(1.0-max(dot(n,v),0.0),3.0);
  float rough=clamp(p_rough,0.02,1.0); float metal=p_metal; vec3 alb=vec3(0.8); vec3 emit=vec3(0.0); float a=1.0;
  if(p_detail>0.001){vec3 q=lq*10.0; float e=0.01;
    vec3 g=vec3(fbm3(q+vec3(e,0.0,0.0))-fbm3(q-vec3(e,0.0,0.0)),fbm3(q+vec3(0.0,e,0.0))-fbm3(q-vec3(0.0,e,0.0)),fbm3(q+vec3(0.0,0.0,e))-fbm3(q-vec3(0.0,0.0,e)))/(2.0*e);
    vec3 gw=transpose(gM)*g; n=normalize(n-p_detail*0.12*(gw-n*dot(gw,n))); rough=clamp(rough+(fbm3(q*0.5)-0.5)*p_detail*0.4,0.02,1.0);}
  float diffK=max(dot(n,L),0.0); float specK=pow(max(dot(n,normalize(L+v)),0.0),48.0);
  int mt=int(p_material+0.5);
  if(hit.y>0.5){float r=length((rX(0.35)*lq).xz); alb=pal(0.1+r*0.6)*(0.45+0.55*sin(r*70.0)); rough=0.6; metal=0.0; a=0.85*clamp(p_ring*1.5,0.0,1.0);}
  else if(mt==0){alb=pal(fres*0.9+n.y*0.3+t*0.05); metal=max(metal,0.75); rough=rough*0.6;}
  else if(mt==1){float vv=sin(lq.x*4.0+t)+sin(lq.y*5.0-t*1.3)+sin(lq.z*3.0+t*0.7)+sin(length(lq)*8.0-t*2.0); alb=pal(vv*0.15+t*0.05); emit=alb*0.35;}
  else if(mt==2){float f=fbm(lq.xy*2.2+lq.z*1.3)*0.6+fbm(lq.yz*2.0+3.1)*0.4; float land=smoothstep(0.48,0.53,f);
    alb=mix(pal(0.6)*0.3,pal(0.12+f*0.6)*0.85,land); rough=mix(0.18,0.85,land);
    float cl=smoothstep(0.55,0.75,fbm(lq.xz*3.0+vec2(t*0.1,0.0)+lq.y)); alb=mix(alb,vec3(0.95),cl*0.7); rough=mix(rough,1.0,cl); emit=pal(0.6)*fres*0.5;}
  else if(mt==3){float ln=smoothstep(0.85,1.0,sin(lq.y*70.0+t*4.0)*0.5+0.5); vec3 col=pal(0.55+lq.y*0.3)*(fres*1.6+ln*0.7+0.08); a=clamp(fres*1.2+ln*0.6+0.12,0.0,1.0); return vec4(col*a,a);}
  else if(mt==4){alb=mix(vec3(0.95),pal(0.5),0.3); metal=1.0; rough=rough*0.5;}
  else if(mt==5){float f=fbm(lq.xy*3.0+lq.z*2.0+t*0.1); float hot=smoothstep(0.5,0.68,f); alb=vec3(0.06,0.05,0.05); rough=0.9; metal=0.0; emit=pal(0.04+hot*0.12)*3.0*hot;}
  else if(mt==6){float nv=max(dot(n,v),0.0); vec3 Fg=vec3(0.04)+0.96*pow(1.0-nv,5.0); vec3 rf=refract(rd,n,0.7);
    vec3 col=envMap(rf,rough)*mix(vec3(1.0),pal(0.5),0.4)*0.8+envMap(reflect(rd,n),rough)*Fg*1.3; a=clamp(0.3+fres*1.1,0.0,1.0); return vec4(col*max(a,0.5),a);}
  else if(mt==7){return vec4((n*0.5+0.5)*(0.65+0.35*diffK)+specK*0.3,1.0);}
  else if(mt==8){float lv=floor(diffK*3.0+0.5)/3.0; vec3 col=pal(0.15+lv*0.5)*(0.25+lv)+step(0.97,specK)*0.8; col*=1.0-step(0.6,fres)*0.85; return vec4(col,1.0);}
  else if(mt==9){alb=mix(vec3(0.82,0.79,0.75),pal(0.5),0.35); rough=max(rough,0.7); metal=0.0;}
  else if(mt==10){alb=mix(vec3(0.93,0.92,0.95),pal(fres*0.7+n.y*0.2+t*0.03),0.45); rough=min(rough,0.3); metal=0.0; emit=pal(fres*0.8)*fres*0.25;}
  else {alb=pal(0.3+n.y*0.1)*0.55; rough=0.95; metal=0.0; emit=pal(0.35)*pow(1.0-max(dot(n,v),0.0),2.0)*0.8;}
  float ao=calcAO(pos,n); float sh=softShadow(pos+n*0.003,L);
  vec3 col=shadePBR(n,rd,alb,rough,metal,ao,sh)+emit+pal(0.6)*fres*p_glow*0.25;
  return vec4(col*a,a);}
vec4 fx(){
  vec2 p=P();
  gM=rX(p_rx*PI/180.0)*rY(p_ry*PI/180.0+uTime*p_spin);
  if(p_aa<0.5) return render(p);
  vec2 px=vec2(1.0/(uRes.y*uScale));
  return (render(p+px*vec2(-0.25,-0.25))+render(p+px*vec2(0.25,-0.25))+render(p+px*vec2(-0.25,0.25))+render(p+px*vec2(0.25,0.25)))*0.25;
}`},
gyroid:{kind:'3d',name:'Giroid-barlang',desc:'Végtelen 3D járat izzó membránfalakkal — beljebb repülsz.',main:['speed','scale','glow'],
 params:[S('speed','Sebesség',0,3,.4),S('scale','Sűrűség',.5,6,2.2),S('thick','Falvastagság',0,3,.6),S('roll','Gördülés',-3,3,1),S('glow','Fény',.2,4,1.2)],
 code:`vec4 fx(){
  vec2 p=P(); float t=uTime*p_speed;
  vec3 ro=vec3(0.0,0.0,t*2.0); vec3 rd=normalize(vec3(p,1.1)); rd.xy=rot(t*0.1*p_roll)*rd.xy;
  float tt=0.1; vec3 col=vec3(0.0);
  for(int i=0;i<70;i++){vec3 q=ro+rd*tt; float s=p_scale; float g=abs(dot(sin(q*s),cos(q.zxy*s)))/s-p_thick*0.05; float d=abs(g)+0.003;
    col+=pal(q.z*0.04+tt*0.03)*0.006/d*exp(-tt*0.12); tt+=d*0.8; if(tt>25.0) break;}
  return vec4(1.0-exp(-col*p_glow),1.0);
}`}
};
