// P1 · Presetek kívülről + saját shader: könyvtártár (ki/be), beillesztés → építés → undo, kimaradt elemek listája,
// vezérlők (makrók), saját shader elnevezett csúszkái (animálódnak, mentés → megnyitás után is), érthető GLSL-hiba, polc, projektfájl.
(async()=>{const bad=[],info={};setPlay(false);R.time=0;st.layers=[];st.scenes=[];st.links=[];commit();
 try{
 // 1) store: put → export → delete → import gives it back; other kinds are kept (generic store)
 const n0=ULIB.length;const it0=await ulibPut({id:ulibId(),kind:'preset',cat:'world',name:'Teszt-táj',created:Date.now(),data:{item:makeLayer('plasma',{name:'P'})},thumb:null});
 await ulibPut({id:'Ux-other',kind:'palette',cat:'x',name:'Más fajta',created:1,data:{cols:['#fff']}});
 const file=ulibExport();await ulibDel(it0.id);await ulibDel('Ux-other');if(ulibGet(it0.id))bad.push('törlés');
 const added=await ulibImport(file);info.store={ok:R.ulibOk,added,n:ULIB.length-n0};
 if(added!==2||!ulibGet(it0.id)||ulibGet(it0.id).name!=='Teszt-táj'||!ulibGet('Ux-other'))bad.push('ki/be: '+JSON.stringify(info.store));
 if(await ulibImport(file)!==0)bad.push('az újraimport nem írhat felül / duplázhat');
 try{await ulibImport('{"x":1}');bad.push('hibás könyvtárfájl elfogadva');}catch(e){info.badLib=e.message;}
 // 2) shelf: own item on its shelf with the mark, built-ins unchanged; other kinds not shown
 R.cat='world';buildCats();buildShelf();const own=LIB.world.filter(x=>x.own);info.shelf=own.map(x=>x.name);
 if(own.length!==1||!document.querySelector('#items .item.own'))bad.push('saját polcelem: '+info.shelf);
 if(!document.querySelector('#items .item.own .ftag.own'))bad.push('nincs „saját” jel');
 if(!libSearch('teszt-taj').some(([c,i])=>LIB[c][i].own===it0.id))bad.push('keresés nem találja a saját elemet');
 // 3) paste: fenced JSON with an unknown effect, an unknown param, a bad macro target; a macro moves params
 const sp={name:'Kapu',dur:6,layers:[{type:'plasma',name:'Mező',p:{speed:.5,nincs:3}},{type:'nemletezik',name:'X'},{type:'shape',name:'Kör',p:{kind:0,size:.2}}],
  macros:[{l:'Energia',v:.5,t:[[0,'p.speed',.2,2],[2,'n.s',.5,1.5],[0,'p.rossz',0,1]]},{l:'Lüktetés',t:[[2,'a:p.size',0,.2]]}]};
 const r=checkPreset('Itt a preset:\n```json\n'+JSON.stringify(sp)+'\n```');info.paste={drop:r.dropped,macros:r.macros,cost:r.cost&&+r.cost.w.toFixed(2)};
 for(const w of ['nemletezik','nincs','p.rossz'])if(!r.dropped.some(d=>d.includes(w)))bad.push('kimaradtak listájából hiányzik: '+w);
 if(r.macros!==2)bad.push('vezérlők száma: '+r.macros);
 const g=r.items[0];const pl=g.children[0];
 if(Math.abs(pl.p.speed.v-1.1)>1e-6)bad.push('a vezérlő v=0.5 nem állította a sebességet: '+pl.p.speed.v);
 macroApply(g,g.macros[0],1);if(Math.abs(pl.p.speed.v-2)>1e-6||Math.abs(g.children[1].n.s.v-1.5)>1e-6)bad.push('makró 1-en: '+pl.p.speed.v);
 macroApply(g,g.macros[1],1);if(Math.abs(g.children[1].p.size.a-.2)>1e-6)bad.push('LFO-makró');
 if(!(r.cost&&r.cost.w>0))bad.push('nincs gépigény-mérés');
 const before=st.layers.length;insertPreset(r);if(st.layers.length!==before+1)bad.push('beillesztés');
 R.selId=g.id;renderInsp();if(!document.querySelector('#insp')||!/Controls/.test(document.querySelector('#insp').textContent))bad.push('a Vezérlők nem látszanak');
 undo();if(st.layers.length!==before)bad.push('undo a beillesztés után: '+st.layers.length);redo();undo();
 // 4) custom shader with named sliders: compiles, renders, animates, survives save → reopen
 const code='vec4 fx(){vec2 p=P(); float d=exp(-length(p)*3.0)*p_glow; return vec4(p_tint*d,1.0);}';
 const r2=checkPreset(JSON.stringify({name:'Izzás',layers:[{type:'custom',name:'Izzó',code,sliders:[{k:'glow',l:'Ragyogás',min:0,max:3,def:1},{k:'tint',l:'Szín',color:true,def:'#ff2000'},{k:'1rossz',l:'x'}],
  p:{glow:{k:[{t:0,v:0,e:4},{t:2,v:3}]}}}]}));
 const C=r2.items[0];info.custom={type:C.type,cp:(C.cp||[]).map(c=>c.k),errors:r2.errors,cw:C.cw,drop:r2.dropped};
 if(C.type!=='custom'||(C.cp||[]).length!==2)bad.push('saját shader réteg: '+JSON.stringify(info.custom));
 if(r2.errors.length)bad.push('a jó shader hibát ad: '+JSON.stringify(r2.errors));
 if(!r2.dropped.some(d=>d.includes('1rossz')))bad.push('hibás csúszka nincs jelentve');
 if(!(C.cw>=1))bad.push('nincs saját gépigény-súly');
 if(paramsOf(C).map(d=>d.k).join()!=='glow,tint')bad.push('paramsOf: '+paramsOf(C).map(d=>d.k));
 const pl2=paramList(C).find(q=>q.path==='p.glow');if(!pl2||pl2.label!=='Ragyogás')bad.push('idővonal-paraméter neve: '+(pl2&&pl2.label));
 st.layers=[C];commit();
 const px=t=>{const out=renderScene(st.layers,R.main,t,'#000');present(R.main,out.t,null,cv.width,cv.height,t);const b=new Uint8Array(4);gl.bindFramebuffer(gl.FRAMEBUFFER,null);gl.readPixels(cv.width>>1,cv.height>>1,1,1,gl.RGBA,gl.UNSIGNED_BYTE,b);return [...b];};
 const a0=px(0),a2=px(2);info.px={a0,a2};if(!(a2[0]>a0[0]+60&&a2[1]<a2[0]*.5))bad.push('a csúszka nem animál / nem hat a színre: '+JSON.stringify(info.px));
 R.selId=C.id;renderInsp();if(!document.querySelector('#insp .cpgrid'))bad.push('nincs csúszka-szerkesztő');
 if(!/Ragyogás/.test(document.querySelector('#insp').textContent))bad.push('az elnevezett csúszka nem látszik');
 const pj=projectJSON();loadProject(JSON.parse(pj));const C2=st.layers[0];
 if(!C2||C2.type!=='custom'||(C2.cp||[]).length!==2||!C2.p.glow.k||C2.p.glow.k.length!==2||progError(C2))bad.push('mentés → megnyitás után: '+JSON.stringify(C2&&{cp:C2.cp,k:C2.p.glow.k,e:progError(C2)}));
 const b2=px(2);if(Math.abs(b2[0]-a2[0])>3)bad.push('megnyitás után más kép: '+b2+' vs '+a2);
 // 5) bad GLSL → readable error with a line number, ready for ChatGPT
 const r3=checkPreset(JSON.stringify({layers:[{type:'custom',name:'Hibás',code:'vec4 fx(){\n  vec2 p=P();\n  return vec3(1.0);\n}'}]}),{noCost:true});
 info.err=r3.errors[0]&&r3.errors[0].err.slice(0,160);if(!r3.errors.length||!/sorban/.test(r3.errors[0].err))bad.push('hibaüzenet: '+info.err);
 if(!/3\. sorban/.test(r3.errors[0]&&r3.errors[0].err||''))bad.push('a hiba sora nem a kód sora: '+info.err);
 if(!/Fix it/.test(errText(r3)))bad.push('errText');
 try{checkPreset('nem json');bad.push('nem JSON elfogadva');}catch(e){info.notJson=e.message;}
 // 6) save as preset → shelf → insert from shelf → the project file carries it → reopening restores a deleted library item
 const x=await saveAsPreset(C2,'Izzó shader','gen');if(!x||x.kind!=='shader'||!x.thumb)bad.push('mentés presetként: '+JSON.stringify(x&&{k:x.kind,t:!!x.thumb}));
 R.cat='gen';buildShelf();const gi=LIB.gen.findIndex(e=>e.own===x.id);if(gi<0)bad.push('nincs a Források polcon');
 st.layers=[];commit();addFromLib('gen',gi,null);const ins=st.layers[0];if(!ins||ins.ulib!==x.id||(ins.cp||[]).length!==2)bad.push('polcról beszúrás: '+JSON.stringify(ins&&{u:ins.ulib,cp:ins.cp}));
 const pj2=JSON.parse(projectJSON());if(!(pj2.ulib||[]).some(u=>u.id===x.id))bad.push('a projektfájl nem viszi a könyvtárelemet');
 await ulibDel(x.id);loadProject(pj2);await new Promise(r=>setTimeout(r,50));if(!ulibGet(x.id))bad.push('megnyitáskor nem került vissza a könyvtárba');
 // 7) old project: no ulib field, custom layer without sliders keeps p_a … p_d
 const m=migrateProject({app:'vel',v:4,state:{layers:[{id:'o1',type:'custom',name:'Régi',vis:true,blend:'normal',clip:false,n:{},p:{},fx:[],code:'vec4 fx(){return vec4(p_a,p_b,p_c,1.0)*p_d;}'}]}});
 if(!Array.isArray(m.ulib)||m.ulib.length)bad.push('régi projekt ulib alapérték');
 loadProject({app:'vel',v:4,state:m.state});const O=st.layers[0];getProg(O);if(progError(O)||paramsOf(O).length!==4)bad.push('régi saját GLSL: '+progError(O));
 // 8) the instructions
 const cp=chatText();info.prompt=cp.length;for(const w of ['SHADER CONTRACT','vec4 fx()','"macros"','p_<k>','custom [gen]','float fbm(vec2 p)'])if(!cp.includes(w))bad.push('ChatGPT-utasításból hiányzik: '+w);
 if(descPrompt('x',8).includes('custom [gen]'))bad.push('a Claude-leírás ne kínáljon saját shadert');
 projModal();if(!/Prompt for ChatGPT/.test(document.querySelector('#dlg').textContent))bad.push('Projekt menü gomb');closeModal();
 pasteModal();if(!document.querySelector('#dlg textarea.dropzone'))bad.push('beillesztő ablak');closeModal();
 // A full Vel project mistakenly pasted into the preset dialog must offer a project-open action.
 const projectBefore=projectJSON();pasteModal(projectBefore);await new Promise(r=>setTimeout(r,40));
 const openProject=[...document.querySelectorAll('#dlg button')].find(b=>b.textContent.includes('Open project'));
 if(!openProject||openProject.disabled||document.querySelector('#dlg').textContent.includes('nincs rétegleírás'))bad.push('projektfájl a presetablakban');
 if(openProject){openProject.click();if(!st.layers.length||st.layers[0].type!=='custom')bad.push('projekt megnyitása a presetablakból');}
 }catch(e){bad.push('ERR '+e.message+' '+(e.stack||'').slice(0,300));}
 return {bad,info};})()
