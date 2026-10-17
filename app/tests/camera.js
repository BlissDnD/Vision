(()=>{const out=[];try{
openCam(document.body);out.push('pop sliders:'+document.querySelectorAll('.popover .ctl').length);
st.cam.on=true;setKey(st.cam.n.x,0,-.3);setKey(st.cam.n.x,2,.3);renderTimeline();setTlx(true);out.push('cam row:'+document.querySelectorAll('.tlx-name.cam').length+' keys:'+document.querySelectorAll('.tlx-key').length);
const j=JSON.parse(projectJSON());st.cam=mkCam();loadProject(j);out.push('cam after load on='+st.cam.on+' keys='+st.cam.n.x.k.length);
undo();out.push('undo ok');
const L=makeLayer('shape');L.n.z.v=2;st.layers=[L];R.selId=L.id;renderAll();out.push('z field:'+[...document.querySelectorAll('.scrub b')].map(b=>b.textContent).join(','));
renderScene(st.layers,R.main,1,'#000');st.cam.on=false;renderScene(st.layers,R.main,1,'#000');out.push('render ok');
}catch(e){out.push('ERR '+e.message+e.stack.slice(0,300));}return out;})()
