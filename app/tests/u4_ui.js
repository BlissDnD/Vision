// U4 · Tömörebb jobb panel: egysoros csúszkák, leírás alul, Details a Main controls alatt, animációs paraméterek a Mozgás fülön
// (a fő vezérlők mindkét helyen, együtt frissülnek), rétegeffekt-ikonsor + ikonrács, felső szövegsáv.
(()=>{const bad=[],info={};setPlay(false);R.time=0;st.layers=[];st.links=[];commit();
 try{
 const M=makeLayer('mtext');st.layers=[M];R.selId=M.id;renderInsp();
 // 1) panel order and size
 setITab('content');const pane=document.querySelector('#insp .ipane[data-tab=content]');const kids=[...pane.children];
 const iMain=kids.findIndex(e=>e.querySelector&&e.querySelector('summary')&&/Main controls/.test(e.querySelector('summary').textContent));
 const iDet=kids.findIndex(e=>e.querySelector&&e.querySelector('summary')&&/Details/.test(e.querySelector('summary').textContent));
 const iDesc=kids.findIndex(e=>e.classList&&e.classList.contains('desc'));
 info.order={iMain,iDet,iDesc,n:kids.length};
 if(!(iMain>=0&&iDet===iMain+1))bad.push('a Details nem közvetlenül a Main controls alatt: '+JSON.stringify(info.order));
 if(iDesc!==kids.length-1)bad.push('a leírás nem alul van');
 info.h={content:Math.round(pane.getBoundingClientRect().height)};
 const c1=pane.querySelector('.ctl:not(.big)');const ch=c1&&c1.getBoundingClientRect().height;info.ctlH=ch&&Math.round(ch);
 if(!(ch&&ch<=24))bad.push('a csúszka nem egysoros: '+ch);
 if(!(info.h.content<700))bad.push('a Tartalom fül túl magas: '+info.h.content+' (előtte 1015)');
 // 2) motion params on the Mozgás tab; main ones in both places and synced
 const mainTxt=pane.querySelector('details').textContent;
 if(/Delay per unit/.test(mainTxt))bad.push('a lépcsőzés még a Main controlsban van');
 setITab('motion');const mp=document.querySelector('#insp .ipane[data-tab=motion]');info.h.motion=Math.round(mp.getBoundingClientRect().height);
 if(!/Text motion/.test(mp.textContent)||!/Delay per unit/.test(mp.textContent))bad.push('a szövegmozgás nincs a Mozgás fülön');
 info.h.motion2=Math.round(mp.getBoundingClientRect().height);const durs=R.liveCtl.filter(c=>c.obj===M.p.dur);if(durs.length!==2)bad.push('az Időtartam nem két helyen van: '+durs.length);
 else{const r=durs[1].rng;r.value='2.5';r.dispatchEvent(new Event('input'));if(Math.abs(+durs[0].rng.value-2.5)>.01||durs[0].val.value!=='2.50')bad.push('a két Időtartam nem frissül együtt: '+durs[0].val.value);}
 const anims=R.liveSel.filter(c=>c.obj===M.p.anim);if(anims.length!==2)bad.push('a Gesture nem két helyen van: '+anims.length);
 const sels=[...document.querySelectorAll('#insp select[aria-label="Gesture"]')];if(sels.length===2){sels[1].value='3';sels[1].dispatchEvent(new Event('change'));if(sels[0].value!=='3'||Math.round(M.p.anim.v)!==3)bad.push('a két Gesture nem szinkron');}
 // generator: speed stays a main control and also appears under Mozgás
 const P=makeLayer('plasma');st.layers=[P];R.selId=P.id;renderInsp();if(R.liveCtl.filter(c=>c.obj===P.p.speed).length!==2)bad.push('Plazma sebesség nem két helyen');
 // 3) effect icon row, add grid, drag reorder, open settings
 P.fx=[makeLayer('blur'),makeLayer('glow')];commit();renderInsp();setITab('fx');
 const ics=[...document.querySelectorAll('#insp .ipane[data-tab=fx] .fxrow .fxic:not(.add)')];info.icons=ics.map(b=>b.getAttribute('aria-label'));
 if(ics.length!==2||!ics[0].querySelector('svg'))bad.push('ikonsor: '+info.icons);
 document.querySelector('#insp .ipane[data-tab=fx] .fxic.add').click();const grid=document.querySelector('#insp .ipane[data-tab=fx] .fxgrid');if(!grid||grid.hidden||grid.querySelectorAll('.fxg').length<20)bad.push('ikonrács');
 const bal=[...grid.querySelectorAll('.fxg')].find(b=>/Balloon/.test(b.textContent));if(!bal||!bal.disabled)bad.push('a Balloon nem tiltott Plazmán');
 [...grid.querySelectorAll('.fxg')].find(b=>/Kaleidoscope/.test(b.textContent)).click();if(P.fx.length!==3||P.fx[2].type!=='kaleido')bad.push('hozzáadás a rácsból');
 const dt=new DataTransfer();const ic=()=>[...document.querySelectorAll('#insp .ipane[data-tab=fx] .fxrow .fxic:not(.add)')];
 ic()[2].dispatchEvent(new DragEvent('dragstart',{dataTransfer:dt}));ic()[0].dispatchEvent(new DragEvent('drop',{dataTransfer:dt,cancelable:true}));
 info.order2=P.fx.map(f=>f.type);if(info.order2.join()!=='kaleido,blur,glow')bad.push('húzásos átrendezés: '+info.order2);
 undo();if(st.layers[0].fx.map(f=>f.type).join()!=='blur,glow,kaleido')bad.push('undo átrendezés: '+st.layers[0].fx.map(f=>f.type));
 // 4) text toolbar
 const T=makeLayer('mtext',{text:{str:'Hello',font:'Syne',weight:'400'}});st.layers=[T];R.selId=T.id;commit();renderInsp();
 const tb=document.querySelector('#textbar');if(!tb||tb.hidden)bad.push('nincs szövegsáv szöveg kijelölésekor');
 else{tb.querySelector('[aria-label="Bold"]').click();if(T.text.weight!=='700')bad.push('B: '+T.text.weight);
  document.querySelector('#textbar [aria-label="Center alignment"]');document.querySelector('#textbar [aria-label="Right alignment"]').click();if(T.text.align!=='right')bad.push('igazítás');
  const f=document.querySelector('#textbar select');f.value='Fraunces';f.dispatchEvent(new Event('change'));if(T.text.font!=='Fraunces')bad.push('betűtípus');
  const c=document.querySelector('#textbar .cwb');c.click();const hx=document.querySelector('.cpick .cp-hex');hx.value='#ff0000';hx.dispatchEvent(new Event('change'));closePicker();if(T.p.color1.v!=='#ff0000'||Math.round(T.p.fill.v)!==0)bad.push('szín');
  undo();if(T.text.font!=='Fraunces'&&st.layers[0].text.font!=='Fraunces')bad.push('undo szín után a betű');}
 // 5) strength ring on the effect icons
 {const P2=makeLayer('plasma',{fx:[['blur',{}]]});P2.fx[0].n.opacity.v=.25;st.layers=[P2];R.selId=P2.id;commit();renderInsp();const ic=document.querySelector('#insp .ipane[data-tab=fx] .fxrow .fxic:not(.add)');
  if(!ic||Math.abs(parseFloat(ic.style.getPropertyValue('--s'))-.25)>1e-6)bad.push('erősség-gyűrű: '+(ic&&ic.style.getPropertyValue('--s')));
  if(getComputedStyle(ic,'::after').content==='none')bad.push('nincs gyűrű');}
 // 6) double click on a text: in-place editing, ⌘Enter keeps, Esc cancels, one undo step
 {const X=makeLayer('text',{text:{str:'Régi',font:'Cinzel',weight:'700',track:.1}});st.layers=[makeLayer('plasma'),X];R.selId=null;commit();renderInsp();
  const r=cv.getBoundingClientRect();document.querySelector('#wrap').dispatchEvent(new MouseEvent('dblclick',{bubbles:true,clientX:r.left+r.width/2,clientY:r.top+r.height/2}));
  const ta=document.querySelector('#wrap textarea.tedit');info.dbl={sel:R.selId===X.id,ed:!!ta};
  if(!ta||R.selId!==X.id)bad.push('dupla kattintás nem nyit szerkesztőt: '+JSON.stringify(info.dbl));
  else{ta.value='Új\nsor';ta.dispatchEvent(new Event('input'));if(X.text.str!=='Új\nsor')bad.push('élő átírás');
   ta.dispatchEvent(new KeyboardEvent('keydown',{key:'Enter',metaKey:true,bubbles:true}));if(document.querySelector('#wrap textarea.tedit'))bad.push('⌘Enter nem zár');
   undo();if(st.layers[1].text.str!=='Régi')bad.push('undo a helyben szerkesztés után: '+st.layers[1].text.str);
   const X2=st.layers[1];editTextInPlace(X2);const t2=document.querySelector('#wrap textarea.tedit');t2.value='Eldobva';t2.dispatchEvent(new Event('input'));
   t2.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true}));if(X2.text.str!=='Régi')bad.push('Esc nem állította vissza');}}
 const Q=makeLayer('plasma');st.layers=[Q];R.selId=Q.id;renderInsp();if(!document.querySelector('#textbar').hidden)bad.push('a szövegsáv nem tűnik el');
 R.selId=null;renderInsp();
 }catch(e){bad.push('ERR '+e.message+' '+(e.stack||'').slice(0,300));}
 return {bad,info};})()
