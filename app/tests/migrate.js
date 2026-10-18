// M1 · régi projektek megnyitása: v8 / v12 fájlok, ismeretlen elem jelentése, mentés→újranyitás.
(()=>{const bad=[],info={};const FX=/*FIXTURES*/;
 const count=ls=>ls.reduce((n,l)=>n+1+(l.children?count(l.children):0)+(l.fx?l.fx.length:0),0);
 for(const name in FX){const o=FX[name];if(!o?.state?.layers)continue;let m;
   try{m=loadProject(JSON.parse(JSON.stringify(o)));}catch(e){bad.push(name+': '+e.message);continue;}
   const want=count(o.state.layers),got=count(st.layers);
   const out=renderScene(st.layers,R.main,1.5,st.bg);present(R.main,out.t,null,cv.width,cv.height,1.5);const err=gl.getError();
   const saved=JSON.parse(projectJSON());let round='ok';try{const s1=snapshot();loadProject(saved);if(snapshot()!==s1)round='eltér';}catch(e){round=e.message;}
   info[name]={from:m.from,layers:got+'/'+want,loop:st.loop,dur:st.dur,gl:err,saved:saved.app+' v'+saved.v,round,msg:loadMsg()};
   if(got!==want)bad.push(name+': rétegszám '+got+'/'+want);if(err)bad.push(name+': GL hiba '+err);if(round!=='ok')bad.push(name+': újranyitás '+round);
   if(o.state.loop===false&&st.loop!==false)bad.push(name+': loop állapot elveszett');}
 // unknown layer types are reported, nested groups flattened (not dropped)
 const g=makeGroup('külső',[makeLayer('plasma')]);const inner={...makeGroup('belső',[makeLayer('fire')]),type:'group'};g.children.push(inner);
 const weird={app:'latomas',v:2,state:{layers:[makeLayer('plasma'),{id:'x1',type:'nincsilyen',name:'Jövőbeli',n:{},p:{},fx:[]},g],bg:'#000',size:'1080x1080',dur:6}};
 const m=loadProject(weird);info.weird={dropped:m.dropped,layers:st.layers.length,groupKids:st.layers[1]&&st.layers[1].children.length,msg:loadMsg()};
 if(m.dropped.length!==1)bad.push('ismeretlen elem nincs jelentve');if(!(st.layers[1]&&st.layers[1].children.length===2))bad.push('beágyazott csoport tartalma elveszett');
 if(st.loop!==true)bad.push('hiányzó loop mező alapértéke');
 return {bad,info};})()
