import { S, SEL } from './helpers';

/** particles (drawn as GL points, see drawPoints) */
import type { EffectDef } from '../types';
export const particles:Record<string,EffectDef>={
pdisp:{kind:'fx',name:'Részecskékre bontás',points:true,desc:'Ráhúzható Megjelenés: a réteg (szöveg, forma, kép) pontokra esik szét, majd visszaáll. Jelzésre (J), ismétlődve vagy kézzel. Szövegnél megadhatsz új szövegeket: az összeálláskor a következő szó jön, a felirat közben szerkeszthető marad.',
 main:['trig','spread','out','hold','back','every','amount'],
 params:[SEL('trig','Szétesés',['Kézi (csúszka)','Jelzésekre','Ismétlődve'],1),S('spread','Szórás',0,3,1.2),S('out','Szétesés ideje (mp)',.05,3,.5),S('hold','Szétszórva marad (mp)',0,5,.3),S('back','Összeállás ideje (mp)',.1,4,1.1),
  S('every','Ismétlődés (mp)',.3,10,3),S('amount','Szétesés (kézi)',0,2,0),S('turb','Örvény szétszóráskor',0,2,.5),
  SEL('density','Sűrűség',['65 ezer','147 ezer','262 ezer'],1),S('size','Pontméret',.5,8,1.6),S('depth','Mélység a fényességből',0,1.5,.1),S('swirl','Áramlás nyugalomban',0,2,0),
  S('wave','Hullám',0,2,0),S('jitter','Remegés',0,1,0),S('speed','Tempó',0,3,1),SEL('color','Szín',['Eredeti','Paletta'],0),S('bright','Fényerő',0,3,1),SEL('pblend','Pontok keverése',['Fény (összeadó)','Normál'],1)],code:''},
particles:{kind:'gen',name:'Részecskék',points:true,desc:'Bármely kép vagy az alatta lévő rétegek pixeleiből 65–262 ezer részecske lesz. A fényességből mélység, a jelekre (kick, ütem) szétszóródás, áramlás, hullám.',
 main:['source','density','size','depth','explode','swirl','hidesrc'],
 params:[SEL('source','Forrás',['Alatta lévő kép','Saját kép'],0),SEL('density','Sűrűség',['65 ezer','147 ezer','262 ezer'],0),S('size','Pontméret',.5,8,2),S('thresh','Küszöb (sötét pontok elhagyása)',0,1,.06),
  S('depth','Mélység a fényességből',0,1.5,.35),S('explode','Szétszóródás',0,2,0),S('swirl','Áramlás',0,2,.25),S('wave','Hullám',0,2,0),S('jitter','Remegés',0,1,0),
  S('tilt','Dőlés °',-90,90,0),S('turn','Fordulat °',-180,180,0),S('spin','Forgás',-1,1,0),S('speed','Tempó',0,3,1),SEL('color','Szín',['Eredeti','Paletta'],0),S('bright','Fényerő',0,3,1),
  SEL('hidesrc','Forrás elrejtése',['Nem','Igen'],1),SEL('pblend','Pontok keverése',['Fény (összeadó)','Normál'],0)],code:''},
sdfscene:{kind:'3d',name:'3D jelenet',desc:'Szerkeszthető 3D: legfeljebb 8 alapforma (gömb, doboz, tórusz, henger, kapszula, oktaéder), amelyeket hozzáadsz, kivonsz vagy metszel, és agyagszerűen összeolvasztasz.',
 main:['material','env','rough','metal','reflM','floor','floorM'],
 params:[SEL('material','Anyag',['Paletta','Agyag','Króm','Irizáló','Normál-színek'],1),SEL('env','Környezet',['Stúdió','Naplemente','Kozmikus','Neon'],0),S('rough','Érdesség',0,1,.5),S('metal','Fémesség',0,1,0),
  S('floor','Árnyék a talajon',0,1,.6),SEL('reflM','Tükröződés',['Környezet','Valódi (jelenet)'],0),SEL('floorM','Padló',['Árnyék','Tükör'],0),S('mirror','Padlótükör ereje',0,1,.6),S('glow','Peremfény',0,3,.4),SEL('aa','Élsimítás',['Gyors','4× (lassabb)'],0),S('spin','Forgás',-2,2,.15),S('rx','Dőlés °',-180,180,15),S('ry','Fordulat °',-180,180,0),SEL('sceneL','Jelenetfény hat rá',['Nem','Igen'],1)],code:''}
};
