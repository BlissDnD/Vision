// M2 · Közös alap / Változat / Kapcsolat: helyi módosítás, Átadás, mentés→újranyitás, leválasztás, kapcsolat-kiértékelés.
(()=>{const bad=[],info={};
 const title=V=>V.children.find(c=>c.type==='mtext').text.str, bg=V=>V.children.find(c=>c.type==='plasma');
 st.layers=[];st.bases={};st.links=[];
 const G=makeGroup('Poszt 1',[makeLayer('plasma',{s:.8}),makeLayer('mtext',{text:{str:'CÍM'}})]);st.layers.push(G);commit();
 const baseId=makeBase(G.id);if(!baseId)bad.push('makeBase');
 const id2=newVariant(G.id),id3=newVariant(id2);commit();
 const V1=findItem(G.id).it,V2=findItem(id2).it,V3=findItem(id3).it;
 info.names=[V1.name,V2.name,V3.name];if(!(isVariant(V1)&&isVariant(V2)&&isVariant(V3)))bad.push('nem mind változat');
 if(diffCount(V1)||diffCount(V2)||diffCount(V3))bad.push('friss változatnak van helyi eltérése');

 // 1) a title edited in one variant changes only there
 V2.children.find(c=>c.type==='mtext').text.str='MÁSIK CÍM';commit();
 info.afterEdit=[title(V1),title(V2),title(V3)];info.diff2=localDiff(V2).values.map(e=>e.path.join('.'));
 if(title(V1)!=='CÍM'||title(V3)!=='CÍM'||title(V2)!=='MÁSIK CÍM')bad.push('a cím nem csak egy változatban változott');
 if(diffCount(V2)!==1)bad.push('helyi eltérés száma: '+diffCount(V2));

 // 2) „Átadás” to the base: shared style reaches everyone, V2 keeps its own title
 bg(V1).pal=5;const n=transfer(V1.id,'base');commit();
 info.toBase={sent:n,pal:[bg(V1).pal,bg(V2).pal,bg(V3).pal],titles:[title(V1),title(V2),title(V3)],diff1:diffCount(V1)};
 if(bg(V2).pal!==5||bg(V3).pal!==5)bad.push('az alapra adott szín nem ért el mindenkihez');
 if(title(V2)!=='MÁSIK CÍM')bad.push('az alapra adás felülírta a helyi címet');
 if(diffCount(V1)!==0)bad.push('a forrásnál maradt eltérés az alapra adás után');

 // 3) „Átadás” to chosen variants, only the title child
 const tb=V2.children.find(c=>c.type==='mtext').bid;transfer(V2.id,[V3.id],tb);commit();
 info.toVariant=[title(V1),title(V2),title(V3)];
 if(title(V3)!=='MÁSIK CÍM'||title(V1)!=='CÍM')bad.push('kijelölt változatnak adás');

 // 4) local removal survives a later base change
 V3.children=V3.children.filter(c=>c.type!=='plasma');commit();
 bg(V1).n.s.v=.5;transfer(V1.id,'base');commit();
 info.removed={v3kids:V3.children.length,v2s:bg(V2).n.s.v,removed:localDiff(V3).removed.length};
 if(V3.children.length!==1||bg(V2).n.s.v!==.5)bad.push('helyi törlés / alapváltozás');

 // 5) Kapcsolat: plasma scale drives the title x (set mode), saved, never leaks into the file
 const src=bg(V1),dst=V1.children.find(c=>c.type==='mtext');
 addLink({id:src.id,g:'n',k:'s'},{id:dst.id,g:'n',k:'x'},'set',1);commit();
 const sd=paramDef(src,'n','s'),xd=paramDef(dst,'n','x');
 const want=xd.min+((src.n.s.v-sd.min)/(sd.max-sd.min))*(xd.max-xd.min),got=ev(dst.n.x,xd,1);
 info.link={want:+want.toFixed(4),got:+got.toFixed(4),others:+ev(V2.children.find(c=>c.type==='mtext').n.x,xd,1).toFixed(4)};
 if(Math.abs(want-got)>1e-6)bad.push('kapcsolat-kiértékelés');
 if(projectJSON().includes('_lk'))bad.push('a kapcsolat-horog bekerült a fájlba');

 // 6) save → reopen: identical, variants and link still work
 const s1=snapshot(),saved=JSON.parse(projectJSON());loadProject(saved);
 const W1=findItem(G.id).it,W3=findItem(id3).it;
 info.reopen={v:saved.v,same:snapshot()===s1,variant:isVariant(W1)&&isVariant(W3),d3:diffCount(W3),link:+ev(W1.children.find(c=>c.type==='mtext').n.x,xd,1).toFixed(4)};
 if(snapshot()!==s1)bad.push('újranyitás után eltér');if(!info.reopen.variant)bad.push('újranyitás után nem változat');
 if(Math.abs(info.reopen.link-want)>1e-4)bad.push('újranyitás után a kapcsolat nem hat');

 // 7) render + undo + detach
 const out=renderScene(st.layers,R.main,1,st.bg);present(R.main,out.t,null,cv.width,cv.height,1);if(gl.getError())bad.push('GL hiba');
 const before=snapshot();findItem(id2).it.name='x';commit();undo();if(snapshot()!==before)bad.push('visszavonás');
 detach(id3);commit();info.detach={v3:isVariant(findItem(id3).it),bases:Object.keys(st.bases).length};
 if(info.detach.v3||info.detach.bases!==1)bad.push('leválasztás');
 for(const id of [G.id,id2])detach(id);commit();if(Object.keys(st.bases).length)bad.push('árva közös alap maradt');
 // old project: no bases/links
 loadProject({app:'vel',v:3,state:{layers:[makeLayer('plasma')],dur:5}});if(!st.bases||Object.keys(st.bases).length||st.links.length)bad.push('v3 fájl alapértékei');
 st.layers=[];commit();
 return {bad,info};})()
