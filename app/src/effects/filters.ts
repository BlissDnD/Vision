import { S, SEL, COL } from './helpers';

/** filters (input & output premultiplied) */
import type { EffectDef } from '../types';
export const filters:Record<string,EffectDef>={
blur:{kind:'fx',name:'Elmosás',desc:'Lágy Gauss-elmosás. Alakzatra húzva puha szélű maszkot kapsz.',passes:2,main:['radius'],
 params:[S('radius','Erősség',0,10,2)],
 code:`vec4 fx(){vec2 dir=uPass<0.5?vec2(1.0/uRes.x,0.0):vec2(0.0,1.0/uRes.y); float r=p_radius*uRes.y*0.004;
  vec4 acc=vec4(0.0); float ws=0.0;
  for(int i=-12;i<=12;i++){float x=float(i)/12.0; float w=exp(-x*x*4.0); acc+=IN(vUv+dir*x*r*3.0)*w; ws+=w;}
  return acc/ws;}`},
glow:{kind:'fx',name:'Ragyogás',desc:'Puha, kétlépcsős Gauss-ragyogás: a fényes részek szétsugároznak.',passes:2,main:['amount','radius','thresh'],
 params:[S('amount','Erősség',0,3,1),S('radius','Sugár',.2,4,1.5),S('thresh','Küszöb',0,1,.35)],
 code:`vec4 fx(){vec2 dir=uPass<0.5?vec2(1.0/uRes.x,0.0):vec2(0.0,1.0/uRes.y); float r=p_radius*uRes.y*0.006;
  vec4 acc=vec4(0.0); float ws=0.0;
  for(int i=-12;i<=12;i++){float x=float(i)/12.0; float w=exp(-x*x*3.0); vec4 sm=IN(vUv+dir*x*r*3.0);
    if(uPass<0.5) sm*=smoothstep(p_thresh,p_thresh+0.25,luma(unp(sm))); acc+=sm*w; ws+=w;}
  acc/=ws;
  if(uPass<0.5) return acc;
  vec4 c=texture(uPrev,vUv); vec3 g=acc.rgb*p_amount*2.0; return vec4(c.rgb+g,clamp(c.a+luma(g),0.0,1.0));}`},
lens:{kind:'fx',name:'Téridő-görbület',desc:'Gravitációs lencse és téridő-hullámok a réteg középpontja körül. Húzd oda, ahol hajlítani akarsz.',usesPal:true,main:['mass','ripple','hole'],
 params:[S('mass','Tömeg',0,3,1),S('ripple','Gravitációs hullám',0,3,.6),S('hole','Fekete mag',0,1.5,.8),S('ring','Gyűrűfény',0,3,.8),S('waves','Hullámsűrűség',0,4,1),S('speed','Sebesség',0,4,1)],
 code:`vec4 fx(){vec2 q=toQ(vUv); float r2=max(dot(q,q),0.000001); float r=sqrt(r2); float m=p_mass*p_mass*0.04; float re=sqrt(m);
  vec2 src=q-q*(m/r2); float t=uTime*p_speed; src+=q/r*sin(r*p_waves*25.0-t*3.0)*p_ripple*0.01*exp(-r*1.5);
  vec4 c=IN(toUV(src))*smoothstep(re*p_hole*0.9,re*p_hole*1.1+0.0001,r);
  float ring=exp(-abs(r-re)*60.0)*p_ring; return vec4(c.rgb+pal(0.1+t*0.05)*ring,clamp(c.a+ring,0.0,1.0));}`},
kaleido:{kind:'fx',name:'Kaleidoszkóp',desc:'Tükrös szeletekre bontja az alatta lévő képet.',main:['segments','spin','zoom'],
 params:[S('segments','Szeletek',1,24,8,1),S('spin','Pörgés',-3,3,.3),S('zoom','Nagyítás',.2,3,1),S('angle','Szög',-3.14,3.14,0),S('shift','Mintavételi eltolás',-1,1,.15)],
 code:`vec4 fx(){vec2 q=toQ(vUv); float r=length(q); float a=atan(q.y,q.x)+uTime*p_spin*0.2; float s=TAU/max(p_segments,1.0); a=mod(a,s); a=abs(a-s*0.5);
  q=rot(p_angle)*(vec2(cos(a),sin(a))*r*p_zoom); q.x+=p_shift; return IN(mfr(toUV(q)));}`},
feedback:{kind:'fx',name:'Visszhang',desc:'Feedback-hurok: az előző képkocka nagyítva, forgatva visszaíródik — végtelen csóvák.',feedback:true,main:['decay','zoom','rot'],
 params:[S('decay','Lecsengés',0,1,.92,.005),S('zoom','Zoom',-5,5,1.2),S('rot','Forgás',-5,5,.6),S('drift','Színvándorlás',-5,5,1),S('wobble','Remegés',0,3,.3),SEL('mode','Mód',['Fényes','Keverés'],0)],
 code:`vec4 fx(){vec4 c=IN(vUv); vec2 q=toQ(vUv); q=rot(p_rot*0.02)*q/(1.0+p_zoom*0.01);
  vec2 pv=toUV(q)+vec2(fbm(vUv*3.0+uTime*0.2)-0.5,fbm(vUv*3.0+7.0-uTime*0.2)-0.5)*p_wobble*0.01;
  vec4 pr=texture(uPrev,pv); pr=vec4(hueShift(pr.rgb,p_drift*0.01),pr.a)*p_decay;
  return p_mode<0.5?max(c,pr):mix(c,pr,p_decay);}`},
swirl:{kind:'fx',name:'Örvény',desc:'Spirálba csavarja a képet a középpont körül.',main:['amount','radius','speed'],
 params:[S('amount','Erősség',-6,6,1.5),S('radius','Hatósugár',.05,2,.5),S('speed','Pörgés',-3,3,.4)],
 code:`vec4 fx(){vec2 q=toQ(vUv); float r=length(q); float k=exp(-r/max(p_radius,0.01)); q=rot(p_amount*k*3.0+uTime*p_speed*k)*q; return IN(mfr(toUV(q)));}`},
warp:{kind:'fx',name:'Organikus torzítás',desc:'Zajjal hullámoztatja a képet. Maszkra húzva élő, lélegző széleket ad.',main:['amount','scale','speed'],
 params:[S('amount','Erősség',0,3,.6),S('scale','Lépték',.2,5,1.2),S('speed','Sebesség',0,3,.4)],
 code:`vec4 fx(){vec2 q=toQ(vUv); float t=uTime*p_speed; vec2 n=vec2(fbm(q*p_scale*3.0+t),fbm(q*p_scale*3.0+vec2(5.2,1.3)-t))-0.5; return IN(toUV(q+n*p_amount*0.12));}`},
ripple:{kind:'fx',name:'Hullámzás',desc:'Koncentrikus vagy vízszerű hullámtorzítás.',main:['amount','freq','mode'],
 params:[SEL('mode','Típus',['Sugaras','Vízfelszín'],0),S('amount','Erősség',0,4,1),S('freq','Frekvencia',.2,4,1),S('speed','Sebesség',0,4,1)],
 code:`vec4 fx(){vec2 q=toQ(vUv); float r=length(q)+0.00001; float t=uTime*p_speed;
  vec2 dq=p_mode<0.5?(q/r)*sin(r*p_freq*20.0-t*3.0)*p_amount*0.02:vec2(sin(q.y*p_freq*10.0+t*2.0),sin(q.x*p_freq*10.0+t*1.7))*p_amount*0.02;
  return IN(mfr(toUV(q+dq)));}`},
radial:{kind:'fx',name:'Fénysugarak',desc:'Isteni sugarak: a fények a középpontból sugároznak ki.',main:['amount','length','thresh'],
 params:[S('amount','Erősség',0,3,1),S('length','Hossz',0,3,1.2),S('thresh','Küszöb',0,1,.3)],
 code:`vec4 fx(){vec4 c=IN(vUv); vec2 ctr=toUV(vec2(0.0)); vec2 d=(vUv-ctr)*p_length*0.5; vec4 acc=vec4(0.0); float w=1.0;
  for(int i=0;i<32;i++){vec4 s=IN(vUv-d*float(i)/32.0); acc+=s*w*smoothstep(p_thresh,p_thresh+0.2,luma(unp(s))); w*=0.95;}
  acc=acc/14.0*p_amount; return vec4(c.rgb+acc.rgb,clamp(c.a+acc.a,0.0,1.0));}`},
edge:{kind:'fx',name:'Neon körvonal',desc:'Izzó vonalat rajzol a formák szélére. Alakzatokon és szövegen különösen szép.',usesPal:true,main:['amount','width','only'],
 params:[S('amount','Erősség',0,4,1.5),S('width','Vastagság',.5,6,1.5),S('only','Csak a vonal',0,1,0),S('speed','Színmozgás',0,3,.5)],
 code:`float edgeV(vec2 uv){vec4 c=IN(uv); return c.a*0.6+luma(c.rgb)*0.4;}
vec4 fx(){vec2 px=p_width/uRes; float gx=edgeV(vUv+vec2(px.x,0.0))-edgeV(vUv-vec2(px.x,0.0)); float gy=edgeV(vUv+vec2(0.0,px.y))-edgeV(vUv-vec2(0.0,px.y));
  float e=clamp(length(vec2(gx,gy))*2.0,0.0,1.0); vec4 c=IN(vUv)*(1.0-p_only);
  vec3 ec=pal(vUv.x*0.5+vUv.y*0.5+uTime*p_speed*0.1)*e*p_amount; return vec4(c.rgb+ec,clamp(max(c.a,e),0.0,1.0));}`},
mirror:{kind:'fx',name:'Tükör',desc:'Szimmetria: félbe, négybe vagy nyolcba tükrözve.',main:['mode'],
 params:[SEL('mode','Szimmetria',['Bal-jobb','Fent-lent','Négyes','Nyolcas'],2)],
 code:`vec4 fx(){vec2 q=toQ(vUv); if(p_mode<0.5) q.x=abs(q.x); else if(p_mode<1.5) q.y=abs(q.y); else if(p_mode<2.5) q=abs(q); else {q=abs(q); if(q.y>q.x) q=q.yx;} return IN(mfr(toUV(q)));}`},
polar:{kind:'fx',name:'Poláris tér',desc:'Az alsó képet körbe vagy alagútba hajlítja.',main:['mode','repeat','speed'],
 params:[SEL('mode','Típus',['Körbe','Alagút'],1),S('zoom','Nagyítás',.2,4,1),S('repeat','Ismétlés',1,8,2,1),S('speed','Sebesség',-3,3,.5),S('spin','Pörgés',-3,3,0)],
 code:`vec4 fx(){vec2 q=toQ(vUv); float r=length(q); float a=atan(q.y,q.x)/TAU+0.5;
  vec2 uv=p_mode<0.5?vec2(a*p_repeat+uTime*p_spin*0.05,r*p_zoom-uTime*p_speed*0.1):vec2(a*p_repeat+uTime*p_spin*0.05,0.5/max(r,0.001)*p_zoom*0.2+uTime*p_speed*0.2);
  return IN(mfr(uv));}`},
chroma:{kind:'fx',name:'Kromatikus aberráció',desc:'Szétcsúsztatott RGB-csatornák.',main:['amount','wobble'],
 params:[S('amount','Erősség',0,4,1),S('wobble','Lüktetés',0,1,.3),SEL('radial','Irány',['Vízszintes','Sugaras'],1)],
 code:`vec4 fx(){vec2 q=toQ(vUv); vec2 d=(p_radial>0.5?q*length(q):vec2(0.5,0.0))*p_amount*0.02*(1.0+p_wobble*sin(uTime*3.0));
  vec4 A=IN(toUV(q+d)),B=IN(vUv),C=IN(toUV(q-d)); return vec4(A.r,B.g,C.b,max(max(A.a,B.a),C.a));}`},
psycolor:{kind:'fx',name:'Pszichedelikus színezés',desc:'A fényerőt végigfuttatja a palettán.',usesPal:true,main:['amount','cycles','speed'],
 params:[S('amount','Erősség',0,1,.8),S('cycles','Ciklusok',.2,6,2),S('speed','Sebesség',-4,4,1)],
 code:`vec4 fx(){vec4 c=IN(vUv); vec3 u=unp(c); float l=luma(u); vec3 m=pal(l*p_cycles+uTime*p_speed*0.1)*smoothstep(0.0,0.08,l); return vec4(mix(u,m,p_amount)*c.a,c.a);}`},
grade:{kind:'fx',name:'Színkorrekció',desc:'Árnyalat, telítettség, kontraszt, fényerő.',main:['sat','contrast','bright'],
 params:[S('sat','Telítettség',0,3,1.2),S('contrast','Kontraszt',0,3,1.1),S('bright','Fényerő',0,3,1),S('hshift','Árnyalat',-.5,.5,0),S('invert','Invertálás',0,1,0)],
 code:`vec4 fx(){vec4 s=IN(vUv); vec3 c=hueShift(unp(s),p_hshift); c=mix(vec3(luma(c)),c,p_sat); c=(c-0.5)*p_contrast+0.5; c*=p_bright; c=mix(c,1.0-c,p_invert); return vec4(max(c,0.0)*s.a,s.a);}`},
glitch:{kind:'fx',name:'Glitch',desc:'Sávos elcsúszás, RGB-szakadás, pixelesítés.',main:['amount','rate','pixel'],
 params:[S('amount','Erősség',0,3,.6),S('rate','Gyakoriság',0,4,1),S('pixel','Pixelméret',0,64,0,1),S('blocks','Sávméret',.2,4,1)],
 code:`vec4 fx(){vec2 uv=vUv; float t=floor(uTime*p_rate*8.0); float row=floor(uv.y*p_blocks*20.0);
  if(hash(vec2(row,t))>1.0-p_amount*0.3) uv.x+=(hash(vec2(t,row))-0.5)*0.2*p_amount;
  if(p_pixel>=1.0){vec2 ps=vec2(p_pixel)/uRes; uv=floor(uv/ps)*ps+ps*0.5;}
  float sh=p_amount*0.01*(hash(vec2(t,3.0))-0.5)*4.0; vec4 A=IN(fract(uv+vec2(sh,0.0))),B=IN(fract(uv)),C=IN(fract(uv-vec2(sh,0.0)));
  return vec4(A.r,B.g,C.b,max(max(A.a,B.a),C.a));}`},
film:{kind:'fx',name:'Film és szemcse',desc:'Filmszemcse, képsorok, vignetta.',main:['grain','vig','scan'],
 params:[S('grain','Szemcse',0,2,.5),S('vig','Vignetta',0,2,.8),S('scan','Képsorok',0,1,.3)],
 code:`vec4 fx(){vec4 s=IN(vUv); vec3 c=s.rgb; c+=(hash(floor(vUv*uRes)+fract(uTime*7.0)*100.0)-0.5)*p_grain*0.25*s.a;
  c*=1.0-p_scan*0.35*(0.5+0.5*sin(vUv.y*uRes.y*1.5)); vec2 q=vUv-0.5; c*=1.0-p_vig*dot(q,q)*2.2; return vec4(max(c,0.0),s.a);}`},
texture:{kind:'fx',name:'Textúra',desc:'Anyagszerűség a képen: papír, vászon, por és karcok, kőzet vagy finom zaj. Ettől lesz a kép tapintható.',main:['mode','amount','scale'],
 params:[SEL('mode','Anyag',['Papír','Vászon','Por és karcok','Kőzet','Finom zaj'],0),S('amount','Erősség',0,1,.35),S('scale','Lépték',.3,4,1),S('anim','Mozgás',0,1,0)],
 code:`vec4 fx(){vec4 c=IN(vUv); vec3 u=unp(c); vec2 q=(vUv-0.5)*ASP()*p_scale; float tm=floor(uTime*12.0*p_anim); float tx=0.5;
  if(p_mode<0.5) tx=fbm(q*40.0)*0.6+fbm(q*vec2(220.0,40.0))*0.4;
  else if(p_mode<1.5){vec2 w=q*180.0; tx=0.5+0.25*(sin(w.x)*sin(w.y*0.5+sin(w.x*0.5)))+(fbm(q*30.0)-0.5)*0.4;}
  else if(p_mode<2.5){float dd=step(0.996,hash(floor(q*300.0)+tm)); float sc=step(0.9985,hash(vec2(floor(q.x*900.0+tm*13.0),tm)))*fbm(vec2(q.y*3.0,tm)); tx=0.5+dd*0.5-sc*0.6+(fbm(q*60.0+tm)-0.5)*0.2;}
  else if(p_mode<3.5) tx=fbm(q*8.0+fbm(q*16.0)*2.0);
  else tx=hash(floor(vUv*uRes)+tm*7.13);
  vec3 r=u*(1.0+(tx-0.5)*2.0*p_amount); return vec4(max(r,0.0)*c.a,c.a);}`},
blob:{kind:'fx',name:'Blob-követés',blob:true,usesPal:true,desc:'Megkeresi és követi a fényes, sötét, mozgó vagy színes foltokat az alatta lévő képen, és HUD-jelölőkkel, vonalakkal, feliratokkal rajzolja meg őket. Rétegre húzva csak azt az egy réteget követi.',
 groups:[{t:'Követés',open:true,keys:['source','detect','thresh','count','spacing','minarea','res','smooth','persist','wander']},
  {t:'Jelölők',open:true,keys:['style','color','colormode','sizemode','box','sizemul','width','fill','dash','guides','jitter','flicker']},
  {t:'Összekötés',open:true,keys:['link','nearest','linkdist','curve','linkalpha']},
  {t:'Feliratok',open:false,text:true,keys:['label','fsize','font','tag','scramble']},
  {t:'Hatás a dobozokon belül',open:false,keys:['inside','inamt','pix']}],
 params:[SEL('source','Mit kövessen',['Fényesség','Sötétség','Mozgás','Színesség','Véletlen pontok'],0),SEL('detect','Észlelés',['Foltok','Csúcspontok'],1),
  S('thresh','Küszöb',0,1,.55),S('count','Darabszám',1,60,14,1),S('spacing','Pontok távolsága',1,30,6,1),S('minarea','Min. foltméret',1,200,4,1),S('res','Észlelési felbontás',48,256,128,16),
  S('smooth','Simítás',0,.98,.6),S('persist','Kitartás (képkocka)',0,60,8,1),S('wander','Véletlen mozgás',0,3,1),
  SEL('style','Jelölő',['Keret','Sarkok','Kör','Célkereszt','Pont','Rombusz','Nincs'],0),COL('color','Szín','#ffffff'),SEL('colormode','Színezés',['Egyszínű','Paletta','Színváltó'],0),
  SEL('sizemode','Méret',['Folt szerint','Fix'],1),S('box','Dobozméret',.01,.5,.07),S('sizemul','Méretszorzó',.5,3,1.2),S('width','Vonalvastagság',.5,6,1.5),S('fill','Kitöltés',0,1,0),
  SEL('dash','Vonal',['Folytonos','Szaggatott'],0),SEL('guides','Vezetővonalak',['Ki','Be'],0),S('jitter','Remegés',0,1,0),S('flicker','Villogás',0,1,0),
  SEL('link','Összekötés',['Nincs','Lánc','Legközelebbi','Hálózat','Középpontba'],2),S('nearest','Szomszédok száma',1,5,1,1),S('linkdist','Hálózat távolsága',.05,1,.3),S('curve','Görbület',-1,1,0),S('linkalpha','Vonalak erőssége',0,1,.6),
  SEL('label','Felirat',['Nincs','Azonosító','Koordináták','Pixel','Méret','Hex','Saját sablon','ID + koordináta'],7),S('fsize','Betűméret',4,40,11),SEL('font','Betűtípus',['Mono','Sans','Orbitron','Major Mono'],0),SEL('tag','Stílus',['Szöveg','Címke'],0),S('scramble','Karakterkeverés',0,1,0),
  SEL('inside','Hatás',['Nincs','Invertálás','Pixelesítés','Hőkamera','Színfordítás','Fekete-fehér','Kiemelés','Elmosás'],0),S('inamt','Erősség',0,1,1),S('pix','Pixel / elmosás mérete',2,40,10)],
 code:`vec3 thermal(float x){return clamp(vec3(-0.5+3.0*x,-1.5+3.0*x,1.0-abs(x*3.0-1.0)+max(0.0,x*3.0-2.5)*2.0),0.0,1.0);}
vec4 fx(){vec4 c=IN(vUv); vec3 u=unp(c); float m=texture(uPrev,vUv).a*p_inamt; vec3 e=u;
  if(p_inside<0.5) e=u;
  else if(p_inside<1.5) e=1.0-u;
  else if(p_inside<2.5){vec2 ps=vec2(max(p_pix,1.0))/uRes; e=unp(IN(floor(vUv/ps)*ps+ps*0.5));}
  else if(p_inside<3.5) e=thermal(luma(u));
  else if(p_inside<4.5) e=hueShift(u,0.5);
  else if(p_inside<5.5) e=vec3(step(0.5,luma(u)));
  else if(p_inside<6.5) e=u*1.8+0.08;
  else {vec4 acc=vec4(0.0); for(int i=-2;i<=2;i++){for(int j=-2;j<=2;j++){acc+=IN(vUv+vec2(float(i),float(j))*p_pix*0.6/uRes);}} e=unp(acc/25.0);}
  float ca=max(c.a,m*step(0.5,p_inside)); vec3 base=mix(u,e,m)*ca; vec4 ov=texture(uImage,vUv);
  return vec4(ov.rgb*ov.a+base*(1.0-ov.a),ov.a+ca*(1.0-ov.a));}`},
ascii:{kind:'fx',name:'ASCII',desc:'Karakterekből rakja ki az alatta lévő képet (a three.js AsciiEffect ihlette).',usesPal:true,main:['size','mode','contrast'],
 params:[S('size','Karakterméret',4,40,10),SEL('mode','Szín',['Eredeti','Paletta','Mátrix-zöld','Fehér'],0),S('contrast','Kontraszt',.5,3,1.2),SEL('invert','Irány',['Normál','Fordított'],0),S('bg','Háttérkép',0,1,0)],
 code:`vec4 fx(){float cs=max(p_size,2.0)*uRes.y/540.0; vec2 cell=vec2(cs*0.667,cs); vec2 px=vUv*uRes; vec2 ci=floor(px/cell);
  vec4 s=IN((ci+0.5)*cell/uRes); vec3 u=unp(s); float l=clamp((luma(u)*s.a-0.5)*p_contrast+0.5,0.0,1.0); if(p_invert>0.5) l=1.0-l;
  float idx=floor(min(l,0.999)*10.0); vec2 f=fract(px/cell); float g=texture(uImage,vec2((idx+f.x)/10.0,f.y)).a;
  vec3 col=p_mode<0.5?u:(p_mode<1.5?pal(l*0.8+uTime*0.02):(p_mode<2.5?vec3(0.35,1.0,0.5):vec3(1.0)));
  return vec4(col*g+u*s.a*p_bg*(1.0-g),clamp(g+s.a*p_bg*(1.0-g),0.0,1.0));}`},
halftone:{kind:'fx',name:'Féltónus',desc:'Nyomdai raszterpöttyök — színes, RGB vagy újságpapír stílusban.',main:['size','mode','angle'],
 params:[S('size','Raszterméret',3,40,9),SEL('mode','Stílus',['Színes pöttyök','RGB-raszter','Újságpapír'],0),S('angle','Szög',-3.14,3.14,.4),S('scale','Pöttyméret',.5,2,1)],
 code:`vec4 fx(){float cs=max(p_size,1.0)*uRes.y/540.0; vec3 res=vec3(0.0); float A=0.0;
  for(int k=0;k<3;k++){float ang=p_angle+float(k)*0.2618*step(0.5,p_mode)*step(p_mode,1.5);
    vec2 pr=rot(ang)*(vUv*uRes); vec2 cc=(floor(pr/cs)+0.5)*cs; vec4 sc=IN((rot(-ang)*cc)/uRes); vec3 u=unp(sc);
    float v=p_mode>0.5&&p_mode<1.5?(k==0?u.r:(k==1?u.g:u.b)):luma(u); v*=sc.a;
    float rr=sqrt(clamp(v,0.0,1.0))*cs*0.62*p_scale; float cov=1.0-smoothstep(rr-0.8,rr+0.8,length(pr-cc));
    if(p_mode<0.5){res=u*cov;A=cov;break;}
    else if(p_mode<1.5){if(k==0)res.r=cov;else if(k==1)res.g=cov;else res.b=cov;A=max(A,cov);}
    else {res=vec3(1.0-cov);A=1.0;break;}}
  return vec4(res,A);}`},
pixelart:{kind:'fx',name:'Pixel art',desc:'Retró pixelgrafika színszint-csökkentéssel és Bayer-ditheringgel.',usesPal:true,main:['size','levels','dither'],
 params:[S('size','Pixelméret',1,32,6,1),S('levels','Színszintek',2,16,5,1),S('dither','Dithering',0,1,.6),SEL('mode','Színek',['Eredeti','Paletta'],0)],
 code:`vec4 fx(){float ps=max(p_size,1.0)*uRes.y/540.0; vec2 cell=floor(vUv*uRes/ps); vec4 s=IN((cell+0.5)*ps/uRes); vec3 u=unp(s);
  const float BY[16]=float[16](0.0,8.0,2.0,10.0,12.0,4.0,14.0,6.0,3.0,11.0,1.0,9.0,15.0,7.0,13.0,5.0);
  int bi=int(mod(cell.x,4.0))+int(mod(cell.y,4.0))*4; float th=((BY[bi]+0.5)/16.0-0.5)*p_dither; float lv=max(p_levels,2.0)-1.0;
  vec3 q=floor(u*lv+0.5+th)/lv; if(p_mode>0.5){float l=floor(luma(u)*lv+0.5+th)/lv; q=pal(l*0.8);}
  return vec4(clamp(q,0.0,1.0)*s.a,s.a);}`}
};
