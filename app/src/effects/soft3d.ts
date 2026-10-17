import { COL, S, SEL } from './helpers';

/** M7b · Puha tárgyak: Felhő (Forrás) + Lufi (Megjelenés). One shape for both: a cluster of blobs (positions from cloud.ts)
 * smooth-unioned and noise-displaced. The cloud is a soft, lit density shell; Lufi ("host" effect, no pass of its own)
 * inflates the same shape into a glossy rubber body. The blend between the two is continuous (Felfújtság). */
import type { EffectDef } from '../types';
export const soft3d:Record<string,EffectDef>={
cloud3d:{kind:'3d',name:'Felhő',desc:'Önálló, puha, megvilágított felhő (nem égbolt): mozgatható, méretezhető, forgatható (O). Alak, sűrűség, puhaság, részletesség, gomolygás és látványbeli szél. A Jelenetfény hat rá. Húzd rá a Lufi Megjelenést: felfújt, fényes gumitest lesz ugyanabból az alakból.',
 main:['shape','dens','soft','detail','billow','wind','color','seed'],
 groups:[{t:'Fő beállítások',keys:['shape','dens','soft','detail','billow','bspeed','wind','seed'],open:true},{t:'Szín és fény',keys:['color','shade','glow']},{t:'Nézet',keys:['rx','ry']}],
 params:[SEL('shape','Alak',['Gomoly','Lapos','Tornyos'],0),S('dens','Sűrűség',.2,3,1.6),S('soft','Puhaság',.02,.4,.08),S('detail','Részletesség',0,1,.6),
  SEL('billow','Gomolygás',['Ki (álló)','Be'],1),S('bspeed','Gomolygás tempója',0,2,.35),S('wind','Szél (látvány)',-1,1,0),S('seed','Változat',0,20,3,1),
  COL('color','Szín (fényes oldal)','#ffffff'),COL('shade','Árnyékszín','#6c7c9c'),S('glow','Ezüst perem',0,2,.8),
  S('rx','Dőlés °',-180,180,0),S('ry','Fordulat °',-180,180,0),SEL('sceneL','Jelenetfény hat rá',['Nem','Igen'],1)],
 code:`uniform vec3 uLDir; uniform vec3 uLEnv; uniform vec3 uLCol; uniform float uLSoftK; uniform float uLSize; uniform float uLWrap;   // scene light (render.ts lightU)
uniform vec4 uBl[10]; uniform float uBn; uniform vec4 uBnd;   // blobs xyz,r · bounding sphere (cloud.ts)
uniform float uBI; uniform vec3 uBC; uniform float uBG; uniform float uBS;   // Lufi: inflation, colour, gloss, glint strength
mat3 gM; float gT;
mat3 rX(float a){float c=cos(a),s=sin(a);return mat3(1.0,0.0,0.0,0.0,c,s,0.0,-s,c);}
mat3 rY(float a){float c=cos(a),s=sin(a);return mat3(c,0.0,-s,0.0,1.0,0.0,s,0.0,c);}
float smin(float a,float b,float k){float h=clamp(0.5+0.5*(b-a)/k,0.0,1.0);return mix(b,a,h)-k*h*(1.0-h);}
float h1(float n){return fract(sin(n)*43758.5453);}
float n3(vec3 x){vec3 i=floor(x),f=fract(x);f=f*f*(3.0-2.0*f);float n=i.x+i.y*57.0+i.z*113.0;
  return mix(mix(mix(h1(n),h1(n+1.0),f.x),mix(h1(n+57.0),h1(n+58.0),f.x),f.y),mix(mix(h1(n+113.0),h1(n+114.0),f.x),mix(h1(n+170.0),h1(n+171.0),f.x),f.y),f.z);}
float fbm3(vec3 p){return n3(p)*0.55+n3(p*2.03+3.1)*0.28+n3(p*4.1+7.7)*0.17;}
/* the shared shape: inflation k (0 cloud … 1 balloon) widens the blend, grows the blobs and irons out the detail */
float shape(vec3 w,float k){
  vec3 p=gM*w; p.x-=p_wind*0.22*(p.y-uBnd.y+0.6)*(1.0-k*0.8);
  float d=1e9; float sk=mix(0.2,0.1,k);
  for(int i=0;i<10;i++){if(float(i)>=uBn)break; vec4 b=uBl[i]; vec3 c=b.xyz+vec3(0.0,sin(gT*0.8+float(i)*1.7)*0.025,0.0)*(1.0-k);
    d=smin(d,length(p-c)-b.w*(1.0+0.1*k),sk);}
  float amp=p_detail*0.2*(1.0-k)*(1.0-k);
  if(amp>0.001){vec3 q=p*2.4+vec3(-gT*(0.25+p_wind*1.2),gT*0.18,gT*0.07); d+=(fbm3(q)-0.5)*amp*2.6+(n3(q*2.7-gT*0.3)-0.5)*amp*0.9+(0.5-abs(n3(q*6.1+gT*0.2)-0.5)*2.0)*amp*0.35;}
  return d;}
vec2 sphHit(vec3 ro,vec3 rd){vec3 oc=ro-uBnd.xyz; float b=dot(oc,rd); float c=dot(oc,oc)-uBnd.w*uBnd.w; float h=b*b-c; if(h<0.0) return vec2(-1.0); h=sqrt(h); return vec2(max(b*-1.0-h,0.0),-b+h);}
vec4 cloud(vec3 ro,vec3 rd,float k){
  vec2 bb=sphHit(ro,rd); if(bb.y<0.0) return vec4(0.0);
  float soft=mix(p_soft,0.02,k); vec3 L=uLDir; float tt=bb.x; vec3 col=vec3(0.0); float A=0.0;
  float sun=max(dot(rd,L),0.0);
  for(int i=0;i<72;i++){ if(tt>bb.y||A>0.985) break;
    vec3 pos=ro+rd*tt; float f=shape(pos,k);
    if(f>soft){tt+=max((f-soft)*0.8,0.02); continue;}
    float den=smoothstep(soft*0.6,-soft,f)*p_dens*(1.0+k*6.0);
    float st=0.03+soft*0.12;
    if(den>0.001){
      float fl=shape(pos+L*0.16,k);
      float lit=clamp(0.45+(fl-f)/0.16*0.9,0.0,1.0)*exp(-max(-f,0.0)*3.0);
      float amb=0.4+0.6*clamp((pos.y-uBnd.y)/uBnd.w+0.45,0.0,1.0);
      lit=lit*lit*(3.0-2.0*lit); vec3 c=mix(p_shade*amb,p_color*uLCol*0.92,lit)+p_color*uLCol*p_glow*pow(sun,5.0)*(1.0-smoothstep(0.0,0.6,den))*1.4;
      float a=1.0-exp(-den*st*16.0); col+=(1.0-A)*a*c; A+=(1.0-A)*a;}
    tt+=st;}
  return vec4(col,A);}
vec3 studio(vec3 d,float rough){vec3 col=mix(vec3(0.02),vec3(0.13),smoothstep(-0.6,1.0,d.y));
  col+=vec3(1.0,0.98,0.95)*(uLCol/vec3(1.0,0.97,0.92))*2.6*pow(max(dot(d,uLEnv),0.0),mix(90.0,3.0,mix(rough,1.0,uLSize*0.6)));
  col+=vec3(0.85,0.92,1.0)*0.9*pow(max(dot(d,normalize(vec3(0.75,0.25,-0.45))),0.0),mix(50.0,2.5,rough));
  col+=vec3(0.95)*0.6*smoothstep(0.6,1.0,d.y); return col;}
vec4 balloon(vec3 ro,vec3 rd,float k,float px){
  vec2 bb=sphHit(ro,rd); if(bb.y<0.0) return vec4(0.0);
  float tt=bb.x; float md=1e9; float mt=tt; bool hit=false;
  for(int i=0;i<90;i++){float d=shape(ro+rd*tt,k); if(d<md){md=d;mt=tt;} if(d<0.0006*(1.0+tt)){hit=true;mt=tt;break;} tt+=d*0.8; if(tt>bb.y) break;}
  float a=hit?1.0:1.0-smoothstep(0.0,px*mt*1.5,md); if(a<=0.0) return vec4(0.0);
  vec3 pos=ro+rd*mt; vec2 e=vec2(0.0015,-0.0015);
  vec3 n=normalize(e.xyy*shape(pos+e.xyy,k)+e.yyx*shape(pos+e.yyx,k)+e.yxy*shape(pos+e.yxy,k)+e.xxx*shape(pos+e.xxx,k));
  vec3 v=-rd; vec3 L=uLDir; float nv=max(dot(n,v),0.0); float rough=mix(0.55,0.06,uBG);
  float ao=clamp(0.4+shape(pos+n*0.12,k)/0.12*0.6,0.0,1.0);
  float nl=max((dot(n,L)+uLWrap)/(1.0+uLWrap),0.0);
  vec3 H=normalize(L+v); float nh=max(dot(n,H),0.0); float a2=pow(max(mix(rough,1.0,uLSize),0.04),4.0); float dd=nh*nh*(a2-1.0)+1.0; float D=a2/(PI*dd*dd);
  float F=0.045+0.955*pow(1.0-nv,5.0);
  vec3 alb=uBC;
  vec3 diff=alb*(uLCol*nl*0.85+studio(n,1.0)*0.45+0.04)*mix(0.5,1.0,ao);
  vec3 sss=alb*alb*pow(1.0-nv,2.0)*0.35+alb*pow(max(dot(rd,L),0.0),3.0)*pow(1.0-nv,1.5)*0.6;   // thin latex: light comes through at the rim
  vec3 spec=studio(reflect(rd,n),rough)*F*mix(0.4,1.4,uBG)*ao+uLCol*min(D,60.0)*0.05*nl*uBS*(0.3+0.7*uBG);
  return vec4((diff+sss+spec)*a,a);}
vec4 fx(){
  vec2 p=P(); gT=p_billow>0.5?uTime*p_bspeed:0.0;
  gM=rX(p_rx*PI/180.0)*rY(p_ry*PI/180.0);
  vec3 ro=vec3(0.0,0.0,3.5); vec3 rd=normalize(vec3(p,-1.8)); float px=1.0/(uRes.y*uScale);
  float k=uBI; float w=smoothstep(0.3,0.6,k);
  vec4 c=vec4(0.0),b=vec4(0.0);
  if(w<1.0) c=cloud(ro,rd,k);
  if(w>0.0) b=balloon(ro,rd,k,px);
  return mix(c,b,w);
}`},
balloon:{kind:'fx',name:'Lufi',host:['cloud3d'],desc:'Ráhúzható Megjelenés a Felhőre: a „Felfújtság” csúszkával a felhő felfújt, fényes, gumiszerű testté válik, ugyanabból az alakból. A Jelenetfény csillanása rajta; a gomolygást kikapcsolva álló lufi. (Szövegre és 2D formára később, a Térbeliséggel.)',
 main:['infl','color','gloss','shine'],
 params:[S('infl','Felfújtság',0,1,.85),COL('color','Szín','#ee3b5c'),S('gloss','Fényesség',0,1,.75),S('shine','Csillanás ereje',0,3,1.2)],
 code:`vec4 fx(){return IN(vUv);}`}
};
