(()=>{const out=[];try{
const L=makeLayer('shape',{p:{kind:2,size:.2}});st.layers=[L];R.selId=L.id;
R.time=0;setKey(L.n.x,0,-1);R.time=1;setKey(L.n.x,1,0.5);L.n.x.k[0].e=6;
out.push('v0.5='+ev(L.n.x,BASEK.x,.5).toFixed(3)+' v1='+ev(L.n.x,BASEK.x,1)+' v2='+ev(L.n.x,BASEK.x,2));
L.n.x.k[0].e=13;L.n.x.k[0].bz=[.3,1.4,.5,1];out.push('bez .5='+ev(L.n.x,BASEK.x,.5).toFixed(3));
L.n.x.k[0].e=12;out.push('spr .5='+ev(L.n.x,BASEK.x,.5).toFixed(3));
setKey(L.p.size,0,.1);setKey(L.p.size,1.5,.4);
renderAll();out.push('insp ok, keyed ctl:'+document.querySelectorAll('.ctl.keyed').length+' tl keys:'+document.querySelectorAll('.tl-key').length);
document.querySelector('.ctl.keyed .vel-animmenu wa-dropdown-item[data-key=keys]').click();out.push('ked:'+document.querySelectorAll('.ked').length+' keys drawn:'+document.querySelectorAll('.kg-key').length);
document.querySelector('.ked select').value='13';document.querySelector('.ked select').dispatchEvent(new Event('change'));out.push('bez pad:'+document.querySelectorAll('.bez').length);
const sec=[...document.querySelectorAll('.kcurves .chip')];out.push('pos chips:'+sec.length);if(sec[0])sec[0].click();out.push('ked2:'+document.querySelectorAll('.ked').length);
const j=JSON.parse(projectJSON());loadProject(j);const L2=st.layers[0];out.push('reload keys:'+L2.n.x.k.length+','+L2.p.size.k.length);
const c=cloneItem(L2);out.push('clone keys:'+c.n.x.k.length);
document.dispatchEvent(new KeyboardEvent('keydown',{key:'k'}));out.push('K:'+L2.n.y.k?.length);
renderScene(st.layers,R.main,.7,'#000');out.push('render ok');
}catch(e){out.push('ERR '+e.message+' '+e.stack.slice(0,500));}return out;})()
