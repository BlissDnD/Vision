// K1 · Kapcsolat-zsinór: ⇢ pont, csak értelmes célok kiemelve, választókártya előnézettel, Nap→Ég, Kövesse, mini-kártya, undo, mentés.
(()=>{const bad=[],info={};setPlay(false);R.time=1;
 st.layers=[];st.links=[];st.bases={};
 const sky=makeLayer('skygrad'),sun=makeLayer('sun',{blend:'screen'}),box=makeLayer('shape',{name:'Doboz'}),txt=makeLayer('text',{name:'Felirat'});
 st.layers=[sky,sun,box,txt];R.selId=sun.id;commit();renderAll();
 const P=(L,k)=>ev(L.p[k],EFFECTS[L.type].params.find(d=>d.k===k),R.time);
 // 1) options: Nap → Ég offers the sun link first; a full-frame sky cannot "follow"
 const o=linkOptions(sun,sky);info.sunSky=o.map(x=>x.kind);
 if(o[0].kind!=='sunsky'||o.some(x=>x.kind==='follow'))bad.push('Nap→Ég opciók: '+info.sunSky);
 if(!linkOptions(box,txt).some(x=>x.kind==='follow'))bad.push('Doboz→Felirat: nincs Kövesse');
 if(linkOptions(sky,sun).some(x=>x.kind==='sunsky'))bad.push('Ég→Nap fordítva is Napfény');
 // 2) gesture: the ⇢ point, highlighted targets, release on the sky chip → card; the cord alone changes nothing
 updGizmo(R.time);updCords(R.time);
 const dot=document.querySelector('#gizmo .h.k');if(!dot||dot.hidden)bad.push('⇢ pont nem látszik');
 const before=projectJSON();
 const r0=dot.getBoundingClientRect();const pe=(t,x,y)=>new PointerEvent(t,{bubbles:true,clientX:x,clientY:y,button:0,pointerId:1});
 dot.dispatchEvent(pe('pointerdown',r0.left+5,r0.top+5));
 const chip=document.querySelector('.kchip[data-id="'+sky.id+'"]');info.rings=document.querySelectorAll('.kring').length;info.rows=document.querySelectorAll('#ltree .lr.kc-ok').length;
 if(!chip)bad.push('Ég nincs kiemelve célként');if(info.rings<2)bad.push('elhelyezhető célok gyűrűje hiányzik: '+info.rings);
 if(document.querySelector('.kchip[data-id="'+sun.id+'"],.kring[data-id="'+sun.id+'"]'))bad.push('a forrás maga is cél');
 // cancel on empty canvas: nothing changes
 const wr=document.querySelector('#wrap').getBoundingClientRect();
 dot.onpointerup(pe('pointerup',wr.left+8,wr.bottom-60));if(document.querySelector('.kcard'))bad.push('üresre engedve kártya nyílt');
 if(projectJSON()!==before)bad.push('a zsinór húzása módosította a projektet');
 dot.dispatchEvent(pe('pointerdown',r0.left+5,r0.top+5));
 const c2=document.querySelector('.kchip[data-id="'+sky.id+'"]').getBoundingClientRect();const cx=c2.left+c2.width/2,cy=c2.top+c2.height/2;
 dot.onpointermove(pe('pointermove',cx,cy));if(!document.querySelector('.kchip.hot'))bad.push('cél fölött nincs erős kiemelés');
 dot.onpointerup(pe('pointerup',cx,cy));
 const card=document.querySelector('.kcard');if(!card)bad.push('nincs választókártya');
 else{const opt=card.querySelector('.kopt[data-kind=sunsky]');info.label=opt&&opt.querySelector('b').textContent;
  if(!opt||!/Sunlight/.test(info.label))bad.push('Napfény opció: '+info.label);
  // preview on hover: the sky reacts, but nothing is committed; leaving drops it
  const h0=P(sky,'sunh');sun.n.y.v=-.4;opt.onmouseenter();const hp=P(sky,'sunh');opt.onmouseleave();const h1=P(sky,'sunh');
  info.preview=[h0,hp,h1].map(v=>+v.toFixed(3));if(!(Math.abs(hp-h0)>.05&&Math.abs(h1-h0)<1e-9))bad.push('előnézet: '+info.preview);
  if(st.links.length)bad.push('előnézet után kapcsolat maradt');
  sun.n.y.v=0;opt.onclick();}
 if(st.links.length!==1||st.links[0].kind!=='sunsky')bad.push('Napfény kapcsolat nem jött létre');
 // 3) moving the sun changes the sky (height and horizontal glow position)
 const hA=P(sky,'sunh'),xA=P(sky,'sunx');sun.n.y.v=-.35;sun.n.x.v=-.4;const hB=P(sky,'sunh'),xB=P(sky,'sunx');info.sky=[hA,hB,xA,xB].map(v=>+v.toFixed(3));
 if(!(hB<hA-.3&&xB<xA-.3))bad.push('a Nap mozgatása nem hat az Égre: '+info.sky);
 renderScene(st.layers,R.main,R.time,'#000');sun.n.y.v=0;sun.n.x.v=0;commit();
 // 4) Kövesse: the text follows the box, with a delay
 R.selId=box.id;const fl=applyOpt(box,txt,linkOptions(box,txt).find(x=>x.kind==='follow'));commit();
 const tx0=ev(txt.n.x,BASEK.x,R.time);box.n.x.v+=.3;const tx1=ev(txt.n.x,BASEK.x,R.time);info.follow=[tx0,tx1].map(v=>+v.toFixed(3));
 if(Math.abs(tx1-tx0-.3)>1e-6)bad.push('Kövesse: '+info.follow);
 box.n.x.k=[{t:0,v:0},{t:2,v:1}]; info.lag=+(ev(txt.n.x,BASEK.x,1)-curV(txt.n.x)).toFixed(3);if(Math.abs(info.lag-(keyVal(box.n.x.k,.75)-fl.rx))>2e-3)bad.push('késés nem 0,25 mp: '+info.lag);
 box.n.x.k=null;box.n.x.v=0;commit();
 // 5) only the selected element's cords; layer badge opens the mini-card
 R.selId=sun.id;renderAll();updGizmo(R.time);updCords(R.time);info.cordsSun=document.querySelectorAll('.kcord-svg path.kcord:not(.live)').length;
 R.selId=box.id;updCords(R.time);info.cordsBox=document.querySelectorAll('.kcord-svg path.kcord:not(.live)').length;
 if(info.cordsSun!==1||info.cordsBox!==1)bad.push('saját zsinórok: '+info.cordsSun+'/'+info.cordsBox);
 const b=[...document.querySelectorAll('#ltree .lr')].find(l=>l.dataset.id===sky.id).querySelector('.bdg.lnk');
 if(!b)bad.push('Ég során nincs ⇢ jelvény');else{b.click();const k=document.querySelector('.kcard .klink');if(!k)bad.push('mini-kártya nem nyílt');
  else{info.mini=k.querySelector('b').textContent;const cb=k.querySelector('input[type=checkbox]');cb.checked=false;cb.onchange();if(st.links[0].on)bad.push('ki/be nem hat');}}
 closeCard();st.links[0].on=true;commit();
 // 6) undo / redo, save → reopen, inspector list
 const n0=st.links.length;undo();const n1=st.links.length;redo();info.undo=[n0,n1,st.links.length];if(!(n1===n0-1||n1===n0)||st.links.length!==n0)bad.push('undo/redo: '+info.undo);
 const j=JSON.parse(projectJSON());loadProject(j);const sky2=st.layers.find(l=>l.type==='skygrad'),sun2=st.layers.find(l=>l.type==='sun');
 const hC=P(sky2,'sunh');sun2.n.y.v=-.35;const hD=P(sky2,'sunh');info.reload=[st.links.map(l=>l.kind||'param').join(),+hC.toFixed(3),+hD.toFixed(3)];
 if(st.links.length!==2||!(hD<hC-.3))bad.push('újranyitás után: '+info.reload);
 R.selId=sky2.id;renderInsp();setITab('motion');const lst=[...document.querySelectorAll('#insp .linkrow')].map(r=>r.textContent);info.insp=lst;
 if(!lst.some(t=>/fénye/.test(t)))bad.push('Kapcsolatok lista: '+lst);
 // old parameter links still listed and working
 addLink({id:sun2.id,g:'p',k:'bright'},{id:sky2.id,g:'p',k:'glow'},'add',1);commit();renderInsp();if(document.querySelectorAll('#insp .linkrow').length!==2)bad.push('régi paraméter-kapcsolat nincs a listában');
 st.layers=[];st.links=[];commit();
 return {bad,info};})()
