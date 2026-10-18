// U3 · bal oszlop (könyvtár a rétegek fölött, húzható elválasztó), rétegjelvények, könyvtárkártya „mire húzható”, egységes tooltip, gyorsbillentyű-panel.
(()=>{const bad=[],info={};
 st.layers=[];st.bases={};st.links=[];renderAll();
 // 1) layout: the library sits above the layers in the left column, the stage takes the full height
 const side=document.querySelector('#side'),shelf=document.querySelector('#shelf'),split=document.querySelector('#split'),lay=document.querySelector('.layers');
 if(!side||shelf.parentElement!==side||lay.parentElement!==side||shelf.nextElementSibling!==split||split.nextElementSibling!==lay)bad.push('bal oszlop szerkezete');
 const sr=shelf.getBoundingClientRect(),lr=lay.getBoundingClientRect(),stg=document.querySelector('.stage').getBoundingClientRect();
 info.rects={shelf:[sr.left|0,sr.top|0,sr.height|0],layers:[lr.left|0,lr.top|0,lr.height|0],stage:[stg.left|0,stg.height|0],win:innerHeight};
 if(!(sr.bottom<=lr.top+1&&Math.abs(sr.left-lr.left)<2))bad.push('a könyvtár nincs a rétegek fölött');
 if(!(stg.left>sr.right))bad.push('a vászon nem a bal oszlop mellett van');
 if(!(stg.height>innerHeight-80))bad.push('a vászon nem kapta meg a teljes magasságot: '+stg.height);
 // 2) splitter: fraction, clamp, persistence
 const p1=setShelfFrac(30);const h30=shelf.getBoundingClientRect().height/side.getBoundingClientRect().height;
 if(Math.abs(h30-.3)>.03)bad.push('elválasztó 30%: '+h30.toFixed(3));
 if(split.getAttribute('aria-valuenow')!=='30')bad.push('elválasztó értéke');
 setShelfFrac(1);if(shelf.getBoundingClientRect().height<118)bad.push('könyvtár túl kicsire húzható');
 setShelfFrac(99);if(lay.getBoundingClientRect().height<105)bad.push('rétegek túl kicsire húzhatók: '+lay.getBoundingClientRect().height);
 split.dispatchEvent(new MouseEvent('dblclick'));if(Math.abs(shelfFrac()-52)>.5)bad.push('dupla kattintás nem állít vissza');
 // 3) badges: plain layer none; keyed / waved, Megjelenés, Kapcsolat, Változat each show theirs
 const A=makeLayer('shape'),B=makeLayer('shape'),C=makeLayer('plasma');A.name='Sima';B.name='Animált';C.name='Effektes';
 B.n.x.k=[{t:0,v:0},{t:1,v:.5}];C.p[Object.keys(C.p)[0]].a=.3;C.fx.push(LIB.fx.find(x=>x.name==='Elmosás'||x.make).make());
 const G=makeGroup('Poszt',[makeLayer('mtext')]);st.layers=[A,B,C,G];commit();makeBase(G.id);
 addLink({id:A.id,g:'n',k:'x'},{id:B.id,g:'n',k:'y'});commit();renderLayers();
 const before=projectJSON();
 const bdg=name=>{const li=[...document.querySelectorAll('#ltree .lr')].find(l=>l.querySelector('.ln').textContent.trim().startsWith(name));return li?[...li.querySelectorAll('.bdg')].map(b=>b.className.split(' ')[1]+':'+b.textContent):null;};
 info.badges={Sima:bdg('Sima'),Animált:bdg('Animált'),Effektes:bdg('Effektes'),Poszt:bdg('Poszt')};
 if(info.badges.Sima.join()!=='lnk:⇢')bad.push('Sima jelvényei: '+info.badges.Sima);
 if(!(info.badges['Animált'].includes('anim:◆')&&info.badges['Animált'].includes('lnk:⇢')))bad.push('Animált jelvényei: '+info.badges['Animált']);
 if(!(info.badges.Effektes.includes('anim:◆')&&info.badges.Effektes.includes('fxb:✦')))bad.push('Effektes jelvényei: '+info.badges.Effektes);
 if(!info.badges.Poszt.includes('var:⧉'))bad.push('Változat jelvény: '+info.badges.Poszt);
 const tipB=[...document.querySelectorAll('#ltree .bdg.anim')].map(b=>b.getAttribute('title')||b.dataset.tip);info.animTips=tipB;if(!tipB.some(t=>/keyframes/.test(t))||!tipB.some(t=>/wave/.test(t)))bad.push('◆ magyarázat hiányzik');
 renderAll();if(projectJSON()!==before)bad.push('a jelvények/panel módosították a projektet');
 // 4) library cards say where they can go
 R.cat='fx';R.libQ='';buildShelf();
 const card=n=>[...document.querySelectorAll('#items .item')].find(b=>b.querySelector('span').textContent===n);
 const lb=card('Balloon');info.lufiTag=lb&&lb.querySelector('.ftag')?.textContent;
 if(!lb||!lb.querySelector('.ftag.only')||!/restricted/.test(info.lufiTag))bad.push('Lufi kártya: '+info.lufiTag);
 const bl=card('Blur');if(!bl||!bl.querySelector('.ftag')||bl.querySelector('.ftag.only'))bad.push('Elmosás kártya címke');
 R.cat='shapes';buildShelf();if(document.querySelector('#items .ftag'))bad.push('forma kártyán felesleges címke');
 R.cat='recipes';buildShelf();
 // 5) tooltip: native title becomes our tip, "(V)" a key cap; accessible name kept
 const mv=document.querySelector('[data-tool=move]');const t0=mv.getAttribute('title')||mv.dataset.tip;adoptTitle(mv);
 if(mv.getAttribute('title')||mv.dataset.tip!==t0||!mv.getAttribute('aria-label'))bad.push('tooltip átvétel');
 const nodes=tipNodes('Mozgatás és méretezés (V)');if(!(nodes.length===2&&nodes[1].tagName==='KBD'&&nodes[1].textContent==='V'))bad.push('tooltip billentyű');
 mv.dispatchEvent(new PointerEvent('pointerover',{bubbles:true}));
 // 6) shortcut panel: button and "?" toggle it
 setKeyHelp(false);document.querySelector('#keysBtn').click();if(document.querySelector('#keyHelp').hidden)bad.push('súgópanel nem nyílik');
 document.dispatchEvent(new KeyboardEvent('keydown',{key:'?'}));if(!document.querySelector('#keyHelp').hidden)bad.push('? nem zárja');
 info.keys=document.querySelectorAll('#keyHelp dt').length;if(info.keys<15)bad.push('kevés gyorsbillentyű: '+info.keys);
 st.layers=[];st.bases={};st.links=[];commit();
 return {bad,info};})()
