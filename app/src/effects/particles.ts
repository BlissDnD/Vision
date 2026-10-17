import { S, SEL } from './helpers';

/** particles (drawn as GL points, see drawPoints) */
import type { EffectDef } from '../types';
export const particles:Record<string,EffectDef>={
particles:{kind:'gen',name:'Részecskék',points:true,desc:'Bármely kép vagy az alatta lévő rétegek pixeleiből 65–262 ezer részecske lesz. A fényességből mélység, a jelekre (kick, ütem) szétszóródás, áramlás, hullám.',
 main:['source','density','size','depth','explode','swirl','hidesrc'],
 params:[SEL('source','Forrás',['Alatta lévő kép','Saját kép'],0),SEL('density','Sűrűség',['65 ezer','147 ezer','262 ezer'],0),S('size','Pontméret',.5,8,2),S('thresh','Küszöb (sötét pontok elhagyása)',0,1,.06),
  S('depth','Mélység a fényességből',0,1.5,.35),S('explode','Szétszóródás',0,2,0),S('swirl','Áramlás',0,2,.25),S('wave','Hullám',0,2,0),S('jitter','Remegés',0,1,0),
  S('tilt','Dőlés °',-90,90,0),S('turn','Fordulat °',-180,180,0),S('spin','Forgás',-1,1,0),S('speed','Tempó',0,3,1),SEL('color','Szín',['Eredeti','Paletta'],0),S('bright','Fényerő',0,3,1),
  SEL('hidesrc','Forrás elrejtése',['Nem','Igen'],1),SEL('pblend','Pontok keverése',['Fény (összeadó)','Normál'],0)],code:''},
sdfscene:{kind:'3d',name:'3D jelenet',desc:'Szerkeszthető 3D: legfeljebb 8 alapforma (gömb, doboz, tórusz, henger, kapszula, oktaéder), amelyeket hozzáadsz, kivonsz vagy metszel, és agyagszerűen összeolvasztasz.',
 main:['material','env','rough','metal','floor'],
 params:[SEL('material','Anyag',['Paletta','Agyag','Króm','Irizáló','Normál-színek'],1),SEL('env','Környezet',['Stúdió','Naplemente','Kozmikus','Neon'],0),S('rough','Érdesség',0,1,.5),S('metal','Fémesség',0,1,0),
  S('floor','Árnyék a talajon',0,1,.6),S('glow','Peremfény',0,3,.4),SEL('aa','Élsimítás',['Gyors','4× (lassabb)'],0),S('spin','Forgás',-2,2,.15),S('rx','Dőlés °',-180,180,15),S('ry','Fordulat °',-180,180,0)],code:''}
};
