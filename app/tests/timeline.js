(()=>{const out=[];try{
const g=makeRecipe(RECIPES.find(r=>r.n==='Kulcskockás repülés'));g.open=true;st.layers=[g];R.selId=g.children[1].id;renderAll();setTlx(true);
out.push('rows:'+document.querySelectorAll('.tlx-row').length+' keys:'+document.querySelectorAll('.tlx-key').length+' segs:'+document.querySelectorAll('.tlx-seg').length);
const L=g.children[1];moveKeys(L,1.2,1.5,false);out.push('moved: '+L.n.x.k.map(k=>k.t)+' r:'+L.n.r.k.map(k=>k.t));
moveKeys(L,1.5,2.0,true);out.push('copied: '+L.n.x.k.map(k=>k.t));
out.push('copy '+copyKeys(L,0.2)+' n='+R.keyClip.length);R.time=5;out.push('paste '+pasteKeys(L,5)+' x:'+L.n.x.k.map(k=>k.t));
const T=g.children[2];out.push('segs mtext '+JSON.stringify(layerSegs(T).map(s=>[s.a.toFixed(2),s.b.toFixed(2)])));
renderTracks();out.push('rerender ok');
}catch(e){out.push('ERR '+e.message+e.stack.slice(0,300));}return out;})()
