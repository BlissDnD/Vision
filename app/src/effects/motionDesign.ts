import { S, SEL, COL, BENTO_NAMES, BENTO_ANIMS } from './helpers';
import { EASE_NAMES } from '../palettes';

/** motion design */
import type { EffectDef } from '../types';
export const motionDesign:Record<string,EffectDef>={
bento:{kind:'shape',name:'Bento-rács',usesPal:true,desc:'Lekerekített dobozok kész rács-elrendezésben, amelyek rugóval kinyílnak, becsúsznak, felpattannak, és egyik elrendezésből a másikba rendeződnek át. Maszkként is működik: a fölötte lévő rétegnél kapcsold be a „Vágás az alatta lévő rétegbe” opciót, és a szöveg a dobozokon belül úszik be.',
 main:['layout','anim','order','start','dur','stagger','ease','fill'],
 params:[SEL('layout','Elrendezés',BENTO_NAMES,2),SEL('anim','Belépés',BENTO_ANIMS,1),SEL('order','Sorrend',['Sorban','Középről','Véletlen','Egyszerre','Méret szerint'],0),
  S('start','Kezdés (mp)',0,30,.2),S('dur','Időtartam (mp)',.05,3,.9),S('stagger','Késleltetés dobozonként',0,.6,.09),SEL('ease','Görbe',EASE_NAMES,5),
  SEL('layout2','Átrendeződés erre',['Nincs',...BENTO_NAMES],0),S('morphAt','Átrendeződés ideje (mp)',0,60,3),S('morphDur','Átrendeződés hossza (mp)',.1,3,1),S('outAt','Bezáródás (mp, 0 = nincs)',0,60,0),
  SEL('fill','Kitöltés',['Szín','Üveg','Paletta','Csak körvonal'],0),COL('color','Szín','#17171d'),COL('color2','Kiemelés színe','#f2a07b'),S('accent','Kiemelt doboz (0 = nincs)',0,9,0,1),
  S('bw','Szélesség',.2,3.4,1.5),S('bh','Magasság',.05,1.9,.84),S('gap','Hézag',0,.12,.024),S('round','Lekerekítés',0,.2,.03),
  S('outline','Körvonal',0,.012,.0015),S('shadow','Árnyék',0,1,.5),S('glass','Üveg elmosása',0,1,.6),S('sheen','Fényél',0,1,.35)],
 code:`uniform vec4 uBR[9]; uniform vec4 uBS[9]; uniform float uBN;
float sdRB(vec2 p,vec2 b,float r){vec2 q=abs(p)-b+r;return length(max(q,0.0))+min(max(q.x,q.y),0.0)-r;}
vec4 fx(){
  vec2 p=P(); float aa=max(fwidth(p.x),1e-4)*0.9; int F=int(p_fill+0.5);
  vec3 gl=vec3(0.0); bool glDone=false;
  float sh=0.0;
  for(int i=0;i<9;i++){if(float(i)>=uBN) break; vec4 R=uBR[i]; float al=uBS[i].x; if(al<0.001||R.z<1e-4||R.w<1e-4) continue;
    float r=min(p_round,min(R.z,R.w)); float ds=sdRB(p-R.xy+vec2(0.0,0.018),R.zw,r); sh=max(sh,(1.0-smoothstep(-0.03,0.07,ds))*al);}
  vec3 col=vec3(0.0); float A=sh*0.42*p_shadow;
  for(int i=0;i<9;i++){if(float(i)>=uBN) break; vec4 R=uBR[i]; float al=uBS[i].x; if(al<0.001||R.z<1e-4||R.w<1e-4) continue;
    float r=min(p_round,min(R.z,R.w)); float d=sdRB(p-R.xy,R.zw,r);
    if(d>p_outline+aa*2.0) continue;
    float m=1.0-smoothstep(-aa,aa,d); float idx=float(i); bool acc=abs(p_accent-(idx+1.0))<0.5;
    vec3 c; float fa=1.0;
    if(F==0) c=acc?p_color2:p_color;
    else if(F==1){if(!glDone){vec4 b=vec4(0.0); float rr=0.004+p_glass*0.035; for(int k=0;k<16;k++){float an=float(k)*2.39996; float rk=sqrt((float(k)+0.5)/16.0)*rr; b+=IN(vUv+vec2(cos(an)*uRes.y/uRes.x,sin(an))*rk);} gl=unp(b/16.0); glDone=true;}
      c=gl*0.82+0.07; c+=vec3(1.0)*0.05*smoothstep(-R.w,R.w,p.y-R.y); if(acc) c=mix(c,p_color2,0.55);}
    else if(F==2) c=pal(idx*0.11+(p.y-R.y)*0.25+(p.x-R.x)*0.1);
    else {c=acc?p_color2:vec3(1.0); fa=0.0;}
    float rim=1.0-smoothstep(0.0,0.012,-d); float top=smoothstep(-R.w*0.6,R.w,p.y-R.y); c+=vec3(1.0)*rim*top*p_sheen*0.22*fa;
    float ol=p_outline>0.0?1.0-smoothstep(p_outline*0.5-aa,p_outline*0.5+aa,abs(d)):0.0;
    vec3 olc=F==3?c:mix(c,vec3(1.0),0.4);
    float a=m*fa*al; float ao=ol*al*(F==3?1.0:0.55);
    vec3 bc=c*a*(1.0-ao)+olc*ao; float ba=a+ao*(1.0-a);
    col=bc+col*(1.0-ba); A=ba+A*(1.0-ba);}
  return vec4(col,A);}`},
projector:{kind:'fx',name:'Vetítő',usesPal:true,desc:'Analóg filmvetítés az alatta lévő képre: por és karcok szaggatott tempóban, fényszivárgás (light leak), vibráló expozíció, filmkocka-ugrálás, kameralebegés, színszél és szemcse. A Képkocka-ütem adja a mozis darabosságot.',
 main:['dust','leak','flicker','weave','shake','tone'],
 params:[S('dust','Por és karcok',0,1,.5),S('leak','Fényszivárgás',0,1,.35),S('flicker','Vibrálás',0,1,.3),S('weave','Filmkocka-ugrálás',0,1,.3),S('shake','Kameralebegés',0,1,.25),
  SEL('tone','Tónus',['Eredeti','Szépia','Fekete-fehér','Fakó szín'],0),S('chroma','Színszél',0,1,.25),S('grain','Szemcse',0,1,.35),S('vig','Vignetta',0,1,.45),S('fps','Képkocka-ütem (kocka/mp)',4,30,12,1)],
 code:`vec4 fx(){
  float fid=floor(uTime*p_fps); float tb=fid/p_fps; vec2 asp=ASP(); vec2 uv=vUv;
  vec2 sh=(vec2(noise(vec2(tb*0.9,1.7)),noise(vec2(tb*0.9,8.3)))-0.5)*0.035*p_shake;
  float ro=(noise(vec2(tb*0.6,4.1))-0.5)*0.02*p_shake;
  vec2 wv=vec2(hash(vec2(fid,2.3))-0.5,hash(vec2(fid,5.9))-0.5)*vec2(0.003,0.009)*p_weave;
  vec2 q=(uv-0.5)*asp; q=rot(ro)*q; q*=1.0-0.04*p_shake-0.012*p_weave; uv=q/asp+0.5+sh+wv;
  vec2 cd=(uv-0.5)*p_chroma*0.012;
  vec4 c=IN(uv),cr=IN(uv+cd),cb=IN(uv-cd);
  vec3 col=vec3(unp(cr).r,unp(c).g,unp(cb).b); float A=max(c.a,max(cr.a,cb.a));
  int T=int(p_tone+0.5); float l=luma(col);
  if(T==1) col=mix(col,vec3(l)*vec3(1.08,0.92,0.7),0.85); else if(T==2) col=vec3(l); else if(T==3) col=mix(vec3(l),col,0.6)*vec3(1.03,1.0,0.93)+0.035;
  col*=1.0+(hash(vec2(fid,7.7))-0.5)*0.3*p_flicker+(noise(vec2(uTime*7.0,1.0))-0.5)*0.08*p_flicker;
  if(p_leak>0.001){float seg=floor(tb*0.5); float env=0.25+0.75*smoothstep(0.25,0.75,noise(vec2(tb*0.45,13.0)));
    vec2 lp=vec2(hash(vec2(seg,1.0))>0.5?-0.1:1.1,mix(0.1,0.9,hash(vec2(seg,2.0))))+vec2(0.0,sin(tb*0.7)*0.15);
    float dd=length((vUv-lp)*vec2(asp.x*0.6,1.0)); float lk=exp(-dd*dd*3.0)*env;
    col+=pal(0.05+hash(vec2(seg,3.0))*0.2)*lk*p_leak*1.4+vec3(1.0,0.55,0.25)*exp(-dd*6.0)*env*p_leak*0.4; A=max(A,clamp(lk*p_leak,0.0,1.0));}
  if(p_dust>0.001){vec2 g=vUv*asp; float dd=0.0;
    for(int i=0;i<3;i++){float fi=float(i); vec2 gg=g*(18.0+fi*22.0)+fid*vec2(3.1,7.7); vec2 cell=floor(gg); vec2 f=fract(gg)-0.5; float hh=hash(cell+fi*9.1);
      if(hh>1.0-0.012*p_dust){vec2 o=(vec2(hash(cell+1.3),hash(cell+4.1))-0.5)*0.6; float r=0.05+0.15*hash(cell+8.8); dd=max(dd,1.0-smoothstep(r*0.6,r,length((f-o)*vec2(1.0,0.6+hash(cell)*1.4))));}}
    col=mix(col,hash(vec2(fid,11.0))>0.3?vec3(0.03):vec3(0.95),dd*0.85);
    for(int k=0;k<3;k++){float fk=float(k); float life=floor(tb*1.5+fk*0.37); if(hash(vec2(life,fk+20.0))>0.35*p_dust+0.1) continue;
      float xs=hash(vec2(life,fk+30.0))+(hash(vec2(fid,fk))-0.5)*0.004; float w=0.0006+0.0012*hash(vec2(life,fk+40.0));
      float y0=hash(vec2(life,fk+50.0))*0.5,y1=y0+0.4+0.6*hash(vec2(life,fk+60.0));
      float ln=(1.0-smoothstep(w*0.5,w,abs(vUv.x-xs)))*step(y0,vUv.y)*step(vUv.y,y1)*(0.5+0.5*noise(vec2(vUv.y*40.0,life)));
      col=mix(col,vec3(0.92),ln*0.7*p_dust);}}
  col+=(hash(floor(vUv*uRes)+fid*13.7)-0.5)*0.22*p_grain;
  vec2 vq=vUv-0.5; col*=1.0-p_vig*dot(vq,vq)*2.4;
  return vec4(max(col,0.0)*A,A);}`}
};
