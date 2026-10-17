import { EFFECTS } from './effects/index';

export function pathObj(L,path){let lfo=false;if(path.startsWith('a:')){lfo=true;path=path.slice(2);}const [g,k]=path.split('.');return {o:L&&L[g]&&L[g][k],lfo,k,g};}
export function macroTargets(G,m){return m.t.map(([id,path,a,b])=>{const L=G.children.find(c=>c.id===id);const po=pathObj(L,path);return {L,...po,a,b};}).filter(x=>x.o);}
export function macroRead(G,m){const t=macroTargets(G,m)[0];if(!t)return 0;const v=t.lfo?t.o.a:t.o.v;return Math.min(1,Math.max(0,(v-t.a)/(t.b-t.a)));}
export function macroApply(G,m,v){m.v=v;for(const t of macroTargets(G,m)){let x=t.a+(t.b-t.a)*v;const pd=t.g==='p'?EFFECTS[t.L.type].params.find(p=>p.k===t.k):null;if(pd&&pd.step>=1)x=Math.round(x);if(t.lfo)t.o.a=x;else t.o.v=x;}}
