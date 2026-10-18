// English effect copy is display-only and cannot change parameter IDs, values, or saved projects.
(()=>{const bad=[],info={};let params=0,options=0;
 for(const [type,d] of Object.entries(EFFECTS)){
  const c=EFFECT_EN[type];if(!c?.name||!c?.description)bad.push(type+': missing English name/description');
  for(const p of d.params){const q=c?.params[p.k];if(!q?.label)bad.push(type+'.'+p.k+': missing label');
   if(p.opts){if(!q?.options||q.options.length!==p.opts.length)bad.push(type+'.'+p.k+': option mismatch');options+=p.opts.length;}
   const translated=effectParam(type,p);if(translated.k!==p.k||translated.def!==p.def)bad.push(type+'.'+p.k+': model changed');params++;
  }
 }
 const before=projectJSON();const layer=makeLayer('fire');st.layers.push(layer);R.selId=layer.id;renderInsp();
 if(!document.querySelector('#insp')?.textContent?.includes('Height'))bad.push('Inspector parameter not English');
 if(layer.p.height.v!==EFFECTS.fire.params.find(x=>x.k==='height').def)bad.push('opening Inspector changed value');
 st.layers.pop();R.selId=null;if(projectJSON()!==before)bad.push('localization changed project');
 info.types=Object.keys(EFFECT_EN).length;info.params=params;info.options=options;return{bad,info};})()
