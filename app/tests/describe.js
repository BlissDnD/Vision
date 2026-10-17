(()=>{const out=[];try{
out.push('prompt bytes '+new Blob([descPrompt('Holdkelte a város fölött, rugós cím',8)]).size);
const sp={name:'Teszt',dur:8,baseRecipe:'Éjszakai égbolt',cam:{x:{k:[{t:0,v:-.2,e:3},{t:8,v:.2}]},zoom:1.1,ap:.8},layers:[
 {type:'bento',p:{layout:9,anim:4,start:.5},x:-.3,y:-.3},
 {type:'mtext',name:'Cím',s:.14,y:.1,text:{str:'Holdkelte',font:'Fraunces',weight:'700'},p:{anim:9,ease:6,stagger:.05,start:1},tm:{in:1,inAt:0,inDur:.5,fps:12}},
 {type:'shape',x:{k:[{t:0,v:-1,e:6},{t:1,v:0}]},p:{kind:2,size:.1,color:'#ff0000',fill:0}},
 {type:'nonexistent'},{type:'projector',p:{tone:1,dust:5}}]};
const r=buildFromSpec(sp);out.push('items '+r.items.length+' kids '+r.items[1].children.length+' cam '+!!r.cam+' dur '+r.dur);
const sh=r.items[1].children[2];out.push('shape x keys '+(sh.n.x.k||[]).length+' dust clamp '+r.items[1].children[3].p.dust.v);
st.layers=r.items;st.cam=r.cam;renderScene(st.layers,R.main,2,'#000');out.push('render ok');
descModal();out.push('modal ok '+!!document.querySelector('#descText'));closeModal();
}catch(e){out.push('ERR '+e.message+e.stack.slice(0,300));}return out;})()
