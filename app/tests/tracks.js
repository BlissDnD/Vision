(()=>{const out=[];try{
const g=makeRecipe(RECIPES.find(r=>r.n==='Kulcskockás repülés'));g.open=true;st.layers=[g];R.selId=g.children[1].id;renderAll();setTlx(true);
zoomView(.5,1);out.push('view '+viewAB().map(x=>x.toFixed(2))+' keys vis:'+document.querySelectorAll('.tlx-key').length+' ticks:'+document.querySelectorAll('.tlx-tick').length);
setView(0,st.dur);const L=g.children[1];R.tlxSels=[{id:L.id,t:.2},{id:L.id,t:1.2}];
const order=[...R.tlxSels].sort((a,b)=>b.t-a.t);for(const s of order)moveKeys(L,s.t,s.t+.5,false);out.push('x '+L.n.x.k.map(k=>k.t));
R.tlxSels=[{id:L.id,t:.7},{id:L.id,t:1.7}];out.push('copy '+copyKeys(L,0)+' n='+R.keyClip.length);R.time=6;out.push('paste '+pasteKeys(L,6)+' '+L.n.x.k.map(k=>k.t));
R.tlxSels=[{id:L.id,t:6},{id:L.id,t:7}];out.push('del '+deleteSelKeys()+' '+L.n.x.k.map(k=>k.t));
renderTracks();out.push('ok');}catch(e){out.push('ERR '+e.message+e.stack.slice(0,300));}return out;})()
