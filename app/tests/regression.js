(()=>{const out={bad:[],ui:[]};
for(const k of Object.keys(EFFECTS)){if(EFFECTS[k].points||['obj3d','sdfscene','gyroid'].includes(k))continue;const L=makeLayer(k);getProg(L);const e=progError(L);if(e)out.bad.push(k+': '+e.slice(0,300));}
try{for(const k of ['bento','mtext','projector','skygrad','sun','clouds','terrain','haze']){const L=makeLayer(k);st.layers=[L];R.selId=L.id;renderAll();timingSection(L);}
 const g=makeRecipe(RECIPES.find(r=>r.n==='Alsó harmad'));st.layers=[g];R.selId=g.id;renderAll();
 openLook(document.body);out.ui.push('look ok: '+document.querySelectorAll('select').length);
 for(const c of CATS.map(c=>c[0])){R.cat=c;buildShelf();}out.ui.push('shelves ok');
 const L=makeLayer('mtext');L.tm={in:0,inAt:0,inDur:.8,out:0,outAt:9,outDur:.8,ease:0,fps:12};st.layers=[L];renderScene(st.layers,R.main,1.23,'#000');out.ui.push('fps ok '+postT(1.23,12));
 st.look.fps=8;renderScene(st.layers,R.main,1.23,'#000');st.look.fps=0;
 const j=projectJSON();loadProject(JSON.parse(j));out.ui.push('save/load ok');
}catch(e){out.ui.push('ERR '+e.message+' '+e.stack.slice(0,400));}
return out;})()
