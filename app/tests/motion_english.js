// Motion display copy covers persisted types and parameters without changing model data.
(()=>{const bad=[], info={types:0,params:0};
 for(const [type,d] of Object.entries(MO)){
  info.types++;if(!MOTION_EN[type]?.name||!MOTION_EN[type]?.desc)bad.push(type+': missing copy');
  for(const p of d.params){const q=motionParam(type,p);info.params++;if(q.k!==p.k||q.def!==p.def)bad.push(type+'.'+p.k+': model changed');if(!MOTION_EN[type]?.params[p.k])bad.push(type+'.'+p.k+': missing label');if(p.opts&&q.opts.length!==p.opts.length)bad.push(type+'.'+p.k+': options changed');}
 }
 const before=projectJSON(),L=makeLayer('fire');st.layers.push(L);R.selId=L.id;const m=makeMo('orbit');L.mo=[m];renderInsp();
 if(!document.querySelector('#insp')?.textContent?.includes('Orbit'))bad.push('English motion name missing from Inspector');
 if(m.p.dir.v!==MO.orbit.params.find(p=>p.k==='dir').def)bad.push('Inspector changed motion value');
 st.layers.pop();R.selId=null;if(projectJSON()!==before)bad.push('display copy changed project');
 return {bad,info};})()
