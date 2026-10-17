// M3 · könyvtár és rétegek: kattintás alatti találatlista, könyvtári keresés, kategóriák, effektlánc-átrendezés.
(()=>{const bad=[],info={};
 st.layers=[];st.bases={};st.links=[];
 // 1) hits under a point: full-screen source below, small shape on top in the centre, a group as one unit
 const bg=makeLayer('plasma'),dot=makeLayer('shape',{s:.12,p:{kind:0,size:.5,fill:1}});
 const g=makeGroup('Csoport',[makeLayer('shape',{x:-.6,s:.1,p:{kind:0,size:.5,fill:1}})]);
 st.layers.push(bg,g,dot);commit();
 const names=hs=>hs.map(x=>x.it.name);
 const c=hitsAt(.5,.5),corner=hitsAt(.02,.04),left=hitsAt(.5-.6/(16/9),.5);
 info.center=names(c);info.corner=names(corner);info.left=names(left);
 if(c[0]&&c[0].it!==dot)bad.push('legfelül nem a középső forma');if(!c.some(x=>x.it===bg))bad.push('az alatta lévő háttér hiányzik');
 if(corner.some(x=>x.it===dot))bad.push('a sarokban is eltalálta a kis formát');if(!corner.some(x=>x.it===bg))bad.push('sarok: háttér hiányzik');
 if(!left.some(x=>x.it===g))bad.push('csukott csoport nem egységként jön');
 g.open=true;const leftOpen=hitsAt(.5-.6/(16/9),.5);info.leftOpen=names(leftOpen);
 if(!leftOpen.some(x=>x.it===g.children[0]))bad.push('nyitott csoportnál nem a gyerek jön');
 if(!c.every(x=>x.prev&&x.prev.width>0))bad.push('előnézet hiányzik');
 // 2) library: plan categories, accent-insensitive search across shelves
 info.cats=CATS.map(x=>x[1]);
 for(const want of ['Receptek','Források','2D Formák','3D Formák','Megjelenések','Mozgás','Részecskék'])if(!info.cats.includes(want))bad.push('kategória hiányzik: '+want);
 const f=libSearch('FELHO');info.search=f.slice(0,4).map(([cat,i])=>LIB[cat][i].name);
 if(!f.length||!f.every(([cat,i])=>!LIB[cat][i].head))bad.push('keresés');if(libSearch('   ').length)bad.push('üres keresés');
 // 3) effect chain: numbered, reorder with ▼
 const L=makeLayer('plasma');L.fx=[LIB.fx.find(x=>x.make).make(),LIB.fx.filter(x=>x.make)[1].make()];st.layers=[L];R.selId=L.id;commit();renderInsp();
 const before=L.fx.map(x=>x.type);const dn=[...document.querySelectorAll('#insp .fxi button')].find(b=>b.getAttribute('aria-label')==='Hátrébb a láncban');
 if(dn)dn.click();info.fx={before,after:L.fx.map(x=>x.type)};
 if(!dn||info.fx.after[0]!==before[1])bad.push('effektlánc átrendezés');
 st.layers=[];commit();
 return {bad,info};})()
