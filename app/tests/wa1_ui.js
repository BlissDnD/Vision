// WA1 · Web Awesome base and shared controls: the components are defined without any network call, the library shelf
// row is icon-first with tooltips, the ◇ animate menu is the same everywhere, the waveform and rhythm are icon groups,
// Seamless loop is a wa-switch, and an old project still opens unchanged.
(()=>{const bad=[],info={};setPlay(false);R.time=0;st.layers=[];st.links=[];commit();
 const done=async()=>{
 try{
 // 1) the Web Awesome custom elements are registered (no kit, no sprite fetch)
 await waReady();
 info.wa=WA_TAGS.filter(t=>!!customElements.get(t));
 if(info.wa.length!==WA_TAGS.length)bad.push('not every Web Awesome element is defined: '+JSON.stringify(info.wa));
 const theme=getComputedStyle(document.documentElement);
 info.tokens={panel:theme.getPropertyValue('--vel-panel').trim(),fx:theme.getPropertyValue('--vel-cat-fx').trim(),
   waSurface:theme.getPropertyValue('--wa-color-surface-default').trim()};
 if(info.tokens.panel!=='#1c1c21')bad.push('the Vel theme tokens are missing: '+JSON.stringify(info.tokens));
 if(!info.tokens.waSurface)bad.push('the Web Awesome surface is not mapped to the Vel theme');

 // 2) library shelf row: an icon and a tooltip per category, tinted with the category colour
 buildCats();buildShelf();
 const cats=[...document.querySelectorAll('#cats .vel-ib')];
 info.cats=cats.length;
 if(cats.length!==CATS.length)bad.push('not every shelf is an icon button: '+cats.length+'/'+CATS.length);
 const noIcon=cats.filter(b=>!b.querySelector('svg')).length;
 if(noIcon)bad.push(noIcon+' shelf buttons have no icon');
 const tips=cats.map(b=>document.querySelector(`wa-tooltip[for="${b.id}"]`)).filter(Boolean);
 info.tips=tips.length;
 if(tips.length!==cats.length)bad.push('not every shelf button has a tooltip: '+tips.length);
 if(tips.some(t=>t.textContent.trim().length<8))bad.push('a shelf tooltip is not a sentence');
 const fxb=cats.find(b=>/Appearances/.test(b.textContent));
 if(!fxb||fxb.style.getPropertyValue('--vel-cc')!=='var(--vel-cat-fx)')bad.push('the Appearances shelf is not tinted with the effect colour');
 // clicking still switches shelf
 fxb.click();if(R.cat!=='fx')bad.push('the shelf button no longer switches category');

 // 3) a slider row: the ◇ menu is there with the four standard items, and Wave opens the wave pane
 const L=makeLayer('shape',{p:{kind:0,size:.15}});st.layers=[L];R.selId=L.id;commit();renderAll();setITab('content');renderInsp();
 const ctl=document.querySelector('#insp .ctl');
 const dd=ctl&&ctl.querySelector('.vel-animmenu');
 if(!dd)bad.push('the ◇ animate menu is missing from the slider row');
 else{const keys=[...dd.querySelectorAll('wa-dropdown-item')].map(i=>i.dataset.key);
   info.menu=keys;
   if(keys.join(',')!=='wave,loop,keys,link')bad.push('the animate menu items differ: '+keys.join(','));
   dd.querySelector('wa-dropdown-item[data-key=wave]').click();
   const pane=ctl.querySelector('.lfo');
   if(!pane)bad.push('Wave did not open the wave pane');
   else{
     // 4) the waveform is an icon group with four options; picking one writes obj.w
     const seg=pane.querySelector('.vel-seg');
     const opts=seg?[...seg.querySelectorAll('button')]:[];
     info.waves=opts.length;
     if(opts.length!==WAVES.length)bad.push('the waveform is not an icon group: '+opts.length);
     if(opts.some(b=>!b.querySelector('svg')))bad.push('a waveform option has no icon');
     opts[3].click();
     const p0=R.liveCtl[0]&&R.liveCtl[0].obj;
     if(!p0||p0.w!==3)bad.push('the waveform click did not set the value: '+(p0&&p0.w));
     if(opts[3].getAttribute('aria-checked')!=='true')bad.push('the chosen waveform is not marked');
     // 5) Seamless loop is a wa-switch and writes lp
     const sw=pane.querySelector('wa-switch');
     if(!sw)bad.push('Seamless loop is not a wa-switch');
     else{sw.checked=true;sw.dispatchEvent(new Event('change'));
       if(!p0.lp)bad.push('the Seamless loop switch did not set lp');}
   }}

 // 6) the Mozgás card: rhythm presets as an icon group, Seamless loop as a switch
 const mi=LIB.motion.findIndex(x=>x.mo==='float');attachMo(mi,st.layers[0].id);
 const M=(st.layers[0].mo||[])[0];
 if(!M)bad.push('the float motion could not be attached');
 R.moSel[st.layers[0].id]=M&&M.id;setITab('motion');renderInsp();
 const mp=document.querySelector('#insp .ipane[data-tab=motion]');
 const ry=mp.querySelector('.rychipw .vel-seg');
 const ryb=ry?[...ry.querySelectorAll("button")]:[];
 info.ry=ryb.length;
 if(ryb.length!==RY_PRE.length)bad.push('the rhythm presets are not an icon group: '+ryb.length);
 if(ryb.some(b=>!b.querySelector('svg')))bad.push('a rhythm preset has no icon');
 ryb[1].click();
 if(!M||!M.ry||M.ry.k!==1)bad.push('the rhythm preset click did not apply: '+JSON.stringify(M.ry&&M.ry.k));
 renderInsp();
 const mloop=document.querySelector('#insp .moloop wa-switch');
 if(!mloop)bad.push('the motion Seamless loop is not a wa-switch');
 // 7) nothing truncates: every shared row label can wrap
 const rows=[...document.querySelectorAll('#insp .vel-row-lab')];
 info.rows=rows.length;
 const clipped=rows.filter(e=>getComputedStyle(e).textOverflow==='ellipsis'&&e.scrollWidth>e.clientWidth+1).length;
 if(clipped)bad.push(clipped+' shared row labels are truncated');

 // 8) an old project (v1, no WA fields) still opens and keeps its ids
 const old={v:1,dur:6,layers:[{id:'old1',type:'blob',name:'Old blob',p:{}}]};
 loadProject(JSON.parse(JSON.stringify(old)));
 info.open={n:st.layers.length,id:st.layers[0]&&st.layers[0].id};
 if(st.layers.length!==1||st.layers[0].id!=='old1')bad.push('the old project did not open unchanged: '+JSON.stringify(info.open));
 }catch(e){bad.push('exception: '+(e&&e.message||e));}
 return {bad,info};};
 return done();})()
