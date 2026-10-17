// M6 · Gerincfelület vásznon szerkesztése: a gerincpont a kamerán át vetítve az egér alá kerül,
// Shifttel a magasság marad, üres húzás a kamera célját mozgatja, görgő a távolságot, a 2D gizmó rejtett,
// az inspectorban „Gerinc” szekció van (új pont / törlés / alapgerinc), mentés→újranyitás megőrzi.
(()=>{const bad=[],info={};st.layers=[];
 const L=makeLayer('surface3d');st.layers=[L];R.selId=L.id;commit();renderInsp();
 const D=EFFECTS.surface3d,{W,H}=outSize(),C=camOf(L,R.time,D,W/H),arch=L.p.arch.v;
 const wr=document.querySelector('#wrap').getBoundingClientRect(),i=4,s0=[...L.spine[i]];
 const p0=projectPt(C,[s0[0],s0[1]*arch,s0[2]]);if(!p0)bad.push('a pont nem vetíthető');
 const cx=wr.left+p0.x+40,cy=wr.top+p0.y-30;dragSpinePt(L,i,s0,cx,cy,false);
 const s1=L.spine[i],p1=projectPt(camOf(L,R.time,D,W/H),[s1[0],s1[1]*arch,s1[2]]);
 info.err=[+(p1.x-p0.x-40).toFixed(2),+(p1.y-p0.y+30).toFixed(2)];if(Math.abs(p1.x-p0.x-40)>1.5||Math.abs(p1.y-p0.y+30)>1.5)bad.push('a pont nem az egér alatt: '+info.err);
 L.spine[i]=[...s0];dragSpinePt(L,i,s0,cx,cy,true);if(L.spine[i][1]!==s0[1])bad.push('Shift: a magasság változott');if(L.spine[i][0]===s0[0]&&L.spine[i][2]===s0[2])bad.push('Shift: nem mozdult');
 const tx0=L.p.tx.v,ty0=L.p.ty.v;panDrag(L,panStart(L),.1,.05);info.pan=[+(L.p.tx.v-tx0).toFixed(3),+(L.p.ty.v-ty0).toFixed(3)];if(Math.abs(L.p.tx.v-tx0)<.05||Math.abs(L.p.ty.v-ty0)<.02)bad.push('pásztázás nem hat');
 const d0=L.p.dist.v;wheelDist(L,100);if(!(L.p.dist.v>d0))bad.push('görgő: távolság');
 updGizmo(R.time);if(!document.querySelector('#gizmo').hidden)bad.push('a 2D gizmó látszik');
 R.gizmoOn=true;updSpineGrips(R.time);const gr=document.querySelectorAll('.sgrip:not([hidden])').length;info.grips=gr;if(gr<5)bad.push('kevés fogó: '+gr);
 const txt=document.querySelector('#insp').textContent;if(!txt.includes('Gerinc'))bad.push('nincs Gerinc szekció');if(txt.includes('Elhelyezés'))bad.push('Elhelyezés látszik');
 const n0=L.spine.length,btn=t=>[...document.querySelectorAll('#insp button')].find(b=>b.textContent===t);
 btn('Új pont utána').click();if(st.layers[0].spine.length!==n0+1)bad.push('új pont');
 renderInsp();btn('Pont törlése').click();if(st.layers[0].spine.length!==n0)bad.push('pont törlése');
 const snap=snapshot();loadProject(JSON.parse(projectJSON()));if(snapshot()!==snap)bad.push('újranyitás');
 st.layers=[];commit();
 return {bad,info};})()
