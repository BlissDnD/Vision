import { S, SEL, COL } from './helpers';

/** shapes */
import type { EffectDef } from '../types';
export const shapes:Record<string,EffectDef>={
shape:{kind:'shape',name:'Alakzat',desc:'Vektoros forma. Maszkként is működik: a fölé tett rétegnél kapcsold be a „Vágás az alatta lévő rétegbe” opciót.',
 main:['kind','size','soft','fill','color'],
 params:[SEL('kind','Forma',['Kör','Gyűrű','Téglalap','Sokszög','Csillag','Félhold','Vesica','Szív','Virág','Spirál','Szem','Kereszt','Végtelen','Dombvonal'],0),S('size','Méret',.02,1.5,.3),S('soft','Lágyság',0,1,0),
  SEL('fill','Kitöltés',['Szín','Paletta','Szivárvány'],1),COL('color','Szín','#ffffff'),
  S('aspect','Arány',.2,5,1),S('round','Lekerekítés',0,1,.15),S('sides','Oldalak / csúcsok',3,12,6,1),S('inner','Belső arány',0,1,.45),S('thick','Gyűrű vastagsága',.002,.4,.04),S('outline','Körvonal',0,.1,0),S('speed','Színmozgás',0,3,.3)],
 lib:`float sdStar(vec2 p,float r,float n,float m){float an=PI/n;float en=PI/m;vec2 acs=vec2(cos(an),sin(an));vec2 ecs=vec2(cos(en),sin(en));
  float bn=mod(atan(p.x,p.y),2.0*an)-an;p=length(p)*vec2(cos(bn),abs(sin(bn)));p-=r*acs;p+=ecs*clamp(-dot(p,ecs),0.0,r*acs.y/ecs.y);return length(p)*sign(p.x);}
float sdMoon(vec2 p,float d,float ra,float rb){p.y=abs(p.y);float a=(ra*ra-rb*rb+d*d)/(2.0*d);float b=sqrt(max(ra*ra-a*a,0.0));
  if(d*(p.x*b-p.y*a)>d*d*max(b-p.y,0.0)) return length(p-vec2(a,b));return max(length(p)-ra,-(length(p-vec2(d,0.0))-rb));}
float sdPolyN(vec2 p,float n,float r){float a=atan(p.x,p.y);float s=TAU/n;float b=mod(a+s*0.5,s)-s*0.5;return length(p)*cos(b)-r*cos(s*0.5);}
float dot2(vec2 v){return dot(v,v);}
float sdHeart(vec2 p){p.x=abs(p.x);if(p.y+p.x>1.0) return sqrt(dot2(p-vec2(0.25,0.75)))-sqrt(2.0)/4.0;return sqrt(min(dot2(p-vec2(0.0,1.0)),dot2(p-0.5*max(p.x+p.y,0.0))))*sign(p.x-p.y);}
float sdCross(vec2 p,vec2 b){p=abs(p);p=(p.y>p.x)?p.yx:p.xy;vec2 q=p-b;float k=max(q.y,q.x);vec2 w=(k>0.0)?q:vec2(b.y-p.x,-k);return sign(k)*length(max(w,0.0));}`,
 code:`vec4 fx(){
  vec2 p=P(); p.x/=max(p_aspect,0.01); float r=p_size; float d;
  if(p_kind<0.5) d=length(p)-r;
  else if(p_kind<1.5) d=abs(length(p)-r)-p_thick;
  else if(p_kind<2.5){vec2 b=vec2(r); float rr=p_round*r; vec2 q=abs(p)-b+rr; d=length(max(q,0.0))+min(max(q.x,q.y),0.0)-rr;}
  else if(p_kind<3.5) d=sdPolyN(p,floor(p_sides),r);
  else if(p_kind<4.5) d=sdStar(p,r,floor(p_sides),mix(2.0,floor(p_sides),p_inner));
  else if(p_kind<5.5) d=sdMoon(p,r*(0.15+p_inner*0.9),r,r*0.92);
  else if(p_kind<6.5){float o=r*(0.2+p_inner*0.6); d=max(length(p-vec2(o,0.0))-r,length(p+vec2(o,0.0))-r);}
  else if(p_kind<7.5){float hs=r*1.9; d=sdHeart(p/hs+vec2(0.0,0.5))*hs;}
  else if(p_kind<8.5){float an=atan(p.y,p.x); d=(length(p)-r*(1.0+p_inner*0.4*cos(floor(p_sides)*an)))*0.7;}
  else if(p_kind<9.5){float rr=length(p); float an=atan(p.y,p.x); float bb=r/(2.0+p_inner*6.0); float sd=abs(mod(rr-bb*an/TAU+bb*0.5,bb)-bb*0.5)-p_thick*0.5; d=max(sd,rr-r);}
  else if(p_kind<10.5){float o=r*0.55; float dv=max(length(p-vec2(0.0,o))-r,length(p+vec2(0.0,o))-r); d=min(abs(dv)-p_thick*0.6,max(length(p)-r*0.33,-(length(p)-r*0.12)));}
  else if(p_kind<11.5) d=sdCross(p,vec2(r,r*(0.12+p_inner*0.4)));
  else if(p_kind<12.5){float a2=r*r*1.44; float x2=p.x*p.x,y2=p.y*p.y; float f=(x2+y2)*(x2+y2)-a2*(x2-y2); vec2 gr=vec2(4.0*p.x*(x2+y2)-2.0*a2*p.x,4.0*p.y*(x2+y2)+2.0*a2*p.y); d=abs(f)/max(length(gr),0.0001)-p_thick*0.6;}
  else {float sd=p_inner*37.0; float fq=floor(p_sides)/6.0; float hx=p.x;
    float sm=0.55*sin(hx*1.8*fq+sd)+0.3*sin(hx*4.3*fq+1.3+sd*0.7)+0.15*(fbm(vec2(hx*6.0*fq,sd))-0.5)*2.0;
    float pk=0.6*(1.0-abs(sin(hx*1.6*fq+sd)))+0.35*(1.0-abs(sin(hx*3.9*fq+sd*1.3)))+0.2*fbm(vec2(hx*9.0*fq,sd))-0.55;
    d=(p.y-r*mix(sm,pk*1.6,p_round))*0.8;}
  if(p_outline>0.0) d=abs(d)-p_outline;
  float aa=max(fwidth(d),0.0001);
  float a=1.0-smoothstep(-p_soft*r*0.6,aa+p_soft*r*0.6,d);
  float t=uTime*p_speed; vec3 c;
  if(p_fill<0.5) c=p_color;
  else if(p_fill<1.5) c=pal(length(p)/max(r,0.01)*0.6-t*0.1);
  else c=pal(atan(p.y,p.x)/TAU+t*0.1);
  return vec4(c*a,a);
}`}
};
