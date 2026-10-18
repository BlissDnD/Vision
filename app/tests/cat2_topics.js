// CAT-01 themes: every theme has entries, one entry can be in several themes, theme chip lists them on the shelf,
// a shelf button clears the theme, searching hides the theme row.
(()=>{const bad=[],info={};
 info.sizes={};for(const [k] of TOPICS){const n=topicItems(k).length;info.sizes[k]=n;if(!n)bad.push('empty theme '+k);}
 const ids=TOPICS.map(([k])=>new Set(topicItems(k).map(([c,i])=>c+':'+i)));let multi=0;const all=new Set(ids.flatMap(s=>[...s]));for(const x of all)if(ids.filter(s=>s.has(x)).length>1)multi++;info.multi=multi;if(!multi)bad.push('no entry in several themes');
 R.libQ='';$('#libSearch').value='';buildCats();buildShelf();
 const b=[...document.querySelectorAll('#topics button')].find(x=>x.textContent==='Folyadék');if(!b)bad.push('no theme chips');else{b.click();
   const shown=document.querySelectorAll('#items .item').length;info.shown=shown;if(shown!==topicItems('fluid').length)bad.push('theme did not list its items');
   const names=[...document.querySelectorAll('#items .item span')].map(x=>x.textContent);if(!names.some(n=>/tinta/i.test(n)))bad.push('Áramló tinta not in Folyadék');}
 document.querySelector('#cats button').click();if(R.libTopic)bad.push('shelf click kept theme');
 const inp=$('#libSearch');inp.value='kör';inp.dispatchEvent(new Event('input'));if(!$('#topics').hidden)bad.push('themes visible while searching');inp.value='';inp.dispatchEvent(new Event('input'));
 return {bad,info};})()
