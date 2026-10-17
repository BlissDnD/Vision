// M4 · soronkénti tipográfia: méret/behúzás/térköz soronként, változó sormagasság a sor-animációban, mentés, visszaállás.
(()=>{const bad=[],info={};st.layers=[];
 const T0={str:'ELSŐ\nmásodik sor\nHARMADIK',font:'Bricolage Grotesque',weight:'800',track:0,lh:1.15};
 const L=makeLayer('mtext',{text:{...T0},p:{unit:2,anim:2,start:.2,dur:.6,stagger:.3}});st.layers=[L];R.selId=L.id;commit();
 const plain=textTex(L);const pl={w:plain.w,h:plain.h,lines:plain.layout.map(x=>Math.round(x.h))};
 // 1) per-line size / indent / gap change the layout
 L.text.lines=[{size:2},{dx:1,gap:.5},{italic:true,weight:'400'}];const big=textTex(L);
 info.plain=pl;info.big={w:big.w,h:big.h,lines:big.layout.map(x=>Math.round(x.h)),lefts:big.layout.map(x=>Math.round(x.left))};
 if(!(big.layout[0].h>plain.layout[0].h*1.9))bad.push('az 1. sor mérete nem nőtt');
 if(!(big.layout[1].top-big.layout[0].top-big.layout[0].h>=.5*200-1))bad.push('a 2. sor előtti térköz hiányzik');
 if(!(big.layout[1].left>plain.layout[1].left+150))bad.push('a 2. sor behúzása hiányzik');
 // 2) line table in the aux texture matches the layout (variable heights → correct line index in the shader)
 if(big.layout.length!==3||!big.aux)bad.push('aux/sortábla');
 // 3) render through the line-unit animation without GL errors, at several times
 for(const t of [0,.4,.9,2]){const out=renderScene(st.layers,R.main,t,st.bg);present(R.main,out.t,null,cv.width,cv.height,t);}
 if(gl.getError())bad.push('GL hiba a változó sormagasságnál');
 // 4) save → reopen keeps the per-line values; clearing them gives back the exact old layout
 const saved=JSON.parse(projectJSON());loadProject(saved);const L2=st.layers[0];
 info.saved=L2.text.lines;if(!L2.text.lines||L2.text.lines[0].size!==2)bad.push('újranyitás után elveszett');
 L2.text.lines=[{size:1,dx:0},{}];tidyLines(L2.text);if(L2.text.lines)bad.push('üres soronkénti adat bent maradt');
 const back=textTex(L2);if(back.w!==plain.w||back.h!==plain.h)bad.push('soronkénti adat nélkül nem a régi elrendezés');
 // 5) inspector shows one row per line, handles exist
 R.selId=L2.id;renderInsp();info.rows=document.querySelectorAll('#insp .lrow').length;if(info.rows!==3)bad.push('Sorok szekció sorai: '+info.rows);
 updLineHandles(1);info.grips=document.querySelectorAll('.lgrips .lgrip').length;if(info.grips<3)bad.push('sor-fogantyúk');
 st.layers=[];commit();
 return {bad,info};})()
