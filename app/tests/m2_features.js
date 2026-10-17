(()=>{const out={bad:[],rec:[],ui:[]};
for(const k of ['planet','reveal','mtext','text']){const L=makeLayer(k);getProg(L);const e=progError(L);if(e)out.bad.push(k+': '+e.slice(0,500));}
const ctx=mkCtx(320,180);
for(const n of ['Bolygó rétegekből','Kulcskockás repülés','Alsó harmad']){try{renderScene([makeRecipe(RECIPES.find(r=>r.n===n))],ctx,2,'#000');out.rec.push(n+' ok');}catch(e){out.rec.push(n+' ERR '+e.message);}}
try{for(const c of ['3d','motion','world']){R.cat=c;buildShelf();}out.ui.push('shelves ok');
const L=makeLayer('sdfscene');st.layers=[L];R.selId=L.id;renderAll();out.ui.push('tip:'+document.querySelectorAll('.tipbox').length+' hint:'+document.querySelectorAll('.hint3d').length);
const T=makeLayer('mtext',{text:{str:'Első sor\nmásodik sor',align:'left'}});st.layers=[T];R.selId=T.id;renderAll();out.ui.push('ta:'+document.querySelectorAll('textarea.txt').length);
const tt=textTex(T);out.ui.push('geo '+tt.geo.map(x=>x.toFixed(3))+' info '+tt.info);
}catch(e){out.ui.push('ERR '+e.message+e.stack.slice(0,300));}
return out;})()
