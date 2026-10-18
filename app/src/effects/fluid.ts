import { S, SEL } from './helpers';
import type { EffectDef } from '../types';

/** F1 · Folyadékmező: Áramló tinta (source) + Folyadékos torzítás (appearance). Solver: src/fluid.ts (binds uDye / uVel). */
const EMIT = [S('count', 'Források száma', 1, 6, 3, 1), S('spread', 'Szórás', 0, 1, .45), S('force', 'Erő', 0, 3, 1), S('size', 'Folt mérete', .2, 3, 1),
  S('curl', 'Örvénylés', 0, 3, 1), S('fade', 'Lecsengés', 0, 1, .3), S('tempo', 'Tempó', 0, 3, 1), S('wind', 'Szél', 0, 2, .2), S('dir', 'Szél iránya °', -180, 180, 0),
  S('pulse', 'Lüktetés', 0, 1, 0), S('seed', 'Seed', 0, 99, 7, 1), SEL('qual', 'Minőség', ['Gyors', 'Normál', 'Finom'], 1)];
const LIB = `uniform sampler2D uDye; uniform sampler2D uVel;`;
export const fluidEffects: Record<string, EffectDef> = {
  fluid: { kind: 'gen', name: 'Áramló tinta', fluid: true, main: ['curl', 'force', 'fade'],
    desc: 'Valódi folyadékszimuláció: vándorló források színes tintát fújnak, ami örvénylik és lecseng. A réteget lejátszás közben húzva belefújsz. Ugrás és export ugyanazt a képet adja. Minta: three-fluid-fx (MIT).',
    params: [...EMIT, S('bright', 'Fényerő', 0, 3, 1)], lib: LIB,
    code: `vec4 fx(){vec4 d=texture(uDye,vUv); vec3 c=1.0-exp(-d.rgb*1.6*p_bright); float a=clamp(max(c.r,max(c.g,c.b))*1.3,0.0,1.0); return vec4(min(c,vec3(a)),a);}` },
  fluidfx: { kind: 'fx', name: 'Folyadékos torzítás', fluid: true, main: ['amount', 'mode', 'curl'],
    desc: 'Folyadék áramlik át a rétegen, és elmozdítja a képét (csak ezét a rétegét). Feltárás módban a réteg csak ott látszik, ahol a tinta jár.',
    params: [S('amount', 'Torzítás', 0, 3, 1), SEL('mode', 'Mód', ['Torzítás', 'Feltárás'], 0), S('edge', 'Perem fény', 0, 2, 0), ...EMIT], lib: LIB,
    code: `vec4 fx(){vec2 v=texture(uVel,vUv).xy; vec4 c=IN(clamp(vUv-v*p_amount*0.06/ASP(),0.0,1.0));
  if(p_mode>0.5){float d=texture(uDye,vUv).a; float m=smoothstep(0.05,0.6,d); float e=m*(1.0-m)*4.0*p_edge; c=c*m+vec4(pal(0.3+d*0.2)*e*c.a,0.0);}
  return c;}` },
};
