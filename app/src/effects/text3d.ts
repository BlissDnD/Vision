import { S, SEL, COL } from './helpers';

/** T6 · Szöveg 3D: live (editable) text on a sphere / cylinder, extruded 3D text, text along a P2 path.
 * The text is the layer's own L.text (textTex), so it stays editable; nothing is baked. */
import type { EffectDef } from '../types';
const RAY = `
mat3 rY(float a){float c=cos(a),s=sin(a);return mat3(c,0.0,-s,0.0,1.0,0.0,s,0.0,c);}
mat3 rX(float a){float c=cos(a),s=sin(a);return mat3(1.0,0.0,0.0,0.0,c,s,0.0,-s,c);}`;
export const text3d:Record<string,EffectDef>={
textwrap:{kind:'text',name:'Szöveg testen',usesText:true,noPal:true,desc:'Élő, átírható szöveg egy forgó gömb vagy henger felületén (a túloldali betűk halványan átlátszanak). A szöveget a felső szövegsávban vagy a Tartalom fülön írod át.',
 main:['shape','rep','size','spin','tilt','c1'],
 groups:[{t:'Fő beállítások',keys:['shape','rep','size','spin','tilt','c1'],open:true},{t:'Test',keys:['body','bodyc','radius','height','vpos','back','gloss'],open:false},{t:'Nézet',keys:['ry','persp']}],
 params:[SEL('shape','Test',['Gömb','Henger','Szalaggyűrű'],1),S('rep','Ismétlés körben',1,8,2,1),S('size','Betűméret',.2,3,1),S('spin','Forgás (°/mp)',-180,180,30),S('tilt','Dőlés °',-60,60,12),COL('c1','Betűszín','#f4efe6'),
  SEL('body','Test',['Átlátszó (csak betűk)','Tömör'],0),COL('bodyc','Test színe','#1b2a5e'),S('radius','Sugár',.05,.6,.3),S('height','Magasság (henger)',.05,1.2,.5),S('vpos','Szöveg helye (fel/le)',-1,1,0),S('back','Túloldal láthatósága',0,1,.35),S('gloss','Csillanás',0,1,.5),
  S('ry','Kezdő fordulat °',-180,180,0),S('persp','Perspektíva',0,1,.5)],
 code:`${RAY}
vec2 hitS(vec3 ro,vec3 rd,float r){float b=dot(ro,rd);vec3 pp=ro-b*rd;float h=r*r-dot(pp,pp);if(h<0.0)return vec2(-1.0);h=sqrt(h);return vec2(-b-h,-b+h);}
vec2 hitC(vec3 ro,vec3 rd,float r,float hh){float a=dot(rd.xz,rd.xz);if(a<1e-8)return vec2(-1.0);float tc=-dot(ro.xz,rd.xz)/a;vec2 pp=ro.xz+rd.xz*tc;float h=(r*r-dot(pp,pp))/a;if(h<0.0)return vec2(-1.0);h=sqrt(h);
  return vec2(tc-h,tc+h);}
float hgt(){int s=int(p_shape+0.5);return s==0?3.14159*p_radius:(s==1?p_height:p_height*0.35);}
vec4 surf(vec3 p,bool front,vec3 n,vec3 rd){
  int s=int(p_shape+0.5);float u=atan(p.z,p.x)/6.28318+0.5;float v=s==0?asin(clamp(p.y/p_radius,-1.0,1.0))/3.14159+0.5:p.y/hgt()+0.5;
  if(s>0&&abs(p.y)>hgt()*0.5)return vec4(0.0);
  float ia=uImgSize.x/max(uImgSize.y,1.0);float rep=max(1.0,floor(p_rep+0.5));
  float tw=6.28318*p_radius/rep,th=tw/ia*p_size;float vh=th/hgt();
  vec2 uv=vec2(fract(-u*rep),(v-0.5-p_vpos*0.35)/max(vh,1e-4)+0.5);
  float a=(uv.y>0.0&&uv.y<1.0)?texture(uImage,uv).a:0.0;
  vec3 L=normalize(vec3(-0.4,0.6,0.8));float df=0.35+0.65*max(dot(n,L),0.0);float sp=pow(max(dot(reflect(-L,n),-rd),0.0),40.0)*p_gloss;
  vec3 tc=p_c1*(front?df:0.55)+vec3(sp)*a;
  if(p_body>0.5&&front){vec3 bc=p_bodyc*df+vec3(sp)*0.8;return vec4(mix(bc,tc,a),1.0);}
  float al=a*(front?1.0:p_back);return vec4(tc*al,al);}
vec4 fx(){vec2 q=P();
  float fz=mix(40.0,2.2,p_persp);vec3 ro=vec3(0.0,0.0,fz),rd=normalize(vec3(q,-fz));
  mat3 M=rX(radians(p_tilt))*rY(radians(p_ry+p_spin*uTime));ro=M*ro;rd=M*rd;
  int s=int(p_shape+0.5);vec2 t=s==0?hitS(ro,rd,p_radius):hitC(ro,rd,p_radius,hgt());if(t.y<0.0)return vec4(0.0);
  vec3 pf=ro+rd*t.x,pb=ro+rd*t.y;
  vec3 nf=s==0?normalize(pf):normalize(vec3(pf.x,0.0,pf.z)),nb=s==0?-normalize(pb):-normalize(vec3(pb.x,0.0,pb.z));
  vec4 F=surf(pf,true,nf,rd);if(p_body>0.5&&F.a>0.99)return F;
  vec4 B=surf(pb,false,nb,rd);return F+B*(1.0-F.a);}`},
textextrude:{kind:'text',name:'Kihúzott 3D szöveg',usesText:true,noPal:true,desc:'Élő, átírható szöveg valódi mélységgel (kihúzva): forgatható, a homlok- és oldalfal külön színű, fénnyel árnyalt.',
 main:['depth','ry','rx','spin','c1','c2'],
 groups:[{t:'Fő beállítások',keys:['depth','ry','rx','spin','c1','c2'],open:true},{t:'Fény és nézet',keys:['light','gloss','persp','size']}],
 params:[S('depth','Mélység',0,.6,.12),S('ry','Fordulat °',-80,80,-25),S('rx','Dőlés °',-60,60,12),S('spin','Billegés (°)',0,40,0),COL('c1','Homlokszín','#ffd36b'),COL('c2','Oldalszín','#a2461f'),
  S('light','Fény iránya °',-180,180,-40),S('gloss','Csillanás',0,1,.4),S('persp','Perspektíva',0,1,.5),S('size','Méret',.1,1.5,.5)],
 code:`${RAY}
float ia(){return uImgSize.x/max(uImgSize.y,1.0);}
vec2 tuv(vec2 xy){float h=p_size,w=h*ia();return vec2(xy.x/w+0.5,0.5+xy.y/h);}
float al(vec2 xy){vec2 uv=tuv(xy);if(uv.x<0.0||uv.x>1.0||uv.y<0.0||uv.y>1.0)return 0.0;return texture(uImage,uv).a;}
vec4 fx(){vec2 q=P();float fz=mix(40.0,2.4,p_persp);vec3 ro=vec3(0.0,0.0,fz),rd=normalize(vec3(q,-fz));
  float wob=p_spin*sin(uTime*1.3);mat3 M=rX(radians(p_rx))*rY(radians(p_ry+wob));ro=M*ro;rd=M*rd;
  float hw=p_size*ia()*0.5+0.01,hh=p_size*0.5+0.01,hd=max(p_depth*0.5,0.002);
  vec3 b=vec3(hw,hh,hd);vec3 inv=1.0/(rd+vec3(1e-6));vec3 t0=(-b-ro)*inv,t1=(b-ro)*inv;vec3 tn=min(t0,t1),tf=max(t0,t1);
  float ta=max(max(tn.x,tn.y),tn.z),tb=min(min(tf.x,tf.y),tf.z);if(ta>tb||tb<0.0)return vec4(0.0);
  const int N=64;float dt=(tb-ta)/float(N);float th=-1.0;bool face=false;
  for(int i=0;i<=N;i++){float tt=ta+dt*float(i);vec3 p=ro+rd*tt;if(al(p.xy)>0.5){th=tt;face=(i==0)&&(abs(abs(p.z)-hd)<hd*0.2||tn.z>=max(tn.x,tn.y));break;}}
  if(th<0.0)return vec4(0.0);
  float lo=th-dt,hi=th;for(int k=0;k<5;k++){float m=(lo+hi)*0.5;if(al((ro+rd*m).xy)>0.5)hi=m;else lo=m;}
  vec3 p=ro+rd*hi;vec3 n;vec3 col;
  if(face){n=vec3(0.0,0.0,sign(p.z));col=p_c1;}
  else{float e=0.004;vec2 g=vec2(al(p.xy+vec2(e,0.0))-al(p.xy-vec2(e,0.0)),al(p.xy+vec2(0.0,e))-al(p.xy-vec2(0.0,e)));n=normalize(vec3(-g,0.0)+vec3(0.0,0.0,1e-4));col=p_c2;}
  vec3 L=normalize(vec3(cos(radians(p_light))*0.7,0.6,0.7+sin(radians(p_light))*0.2));L=M*L;
  float df=0.3+0.7*max(dot(n,L),0.0);float sp=pow(max(dot(reflect(-L,n),-rd),0.0),30.0)*p_gloss;
  return vec4(col*df+vec3(sp),1.0);}`},
textpath:{kind:'text',name:'Szöveg útvonalon',usesText:true,noPal:true,desc:'Élő, átírható szöveg egy Útvonal réteg mentén (2D Formák → Útvonal). Az Eltolással a betűk végigúsznak rajta; ha nincs útvonal kiválasztva, egy saját ívet használ.',
 main:['size','offset','speed','spacing','c1'],
 params:[S('size','Betűméret',.02,.4,.09),S('offset','Eltolás az úton',-1,1,0),S('speed','Úszás (út/mp)',-1,1,0),S('spacing','Betűköz',.5,2.5,1),COL('c1','Betűszín','#f4efe6'),SEL('loop','A végén',['Elfogy','Körbe ér'],1),SEL('upright','Betűk állása',['Az úttal fordul','Egyenesen áll'],0),S('lift','Távolság az úttól',-.2,.2,0)],code:''},
};
