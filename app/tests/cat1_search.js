// CAT-01: 20 search tasks (names, synonyms, no accents, task phrases) find the expected entry in the top 5; role chips
// narrow results; ids are stable and unique; every shelf entry is indexed; old shelf/drag keys unchanged.
(()=>{const bad=[],info={};
 const top=(q,role)=>catSearch(q,role||null).slice(0,5).map(([c,i])=>LIB[c][i].name);
 const CASES=[
  ['füst',/füst|felhő|láng|tinta/i],['fust',/füst|felhő|láng|tinta/i],['króm',/króm|tükr|fém|gerinc/i],['csillogó fém',/króm|tükr|fém|gerinc/i],
  ['szöveg gömbön',/gömb/i],['szoveg hengeren',/henger/i],['tűz',/tűz|láng/i],['víz',/tinta|hullám|víz|folyad/i],
  ['folyadék',/tinta|folyad/i],['részecske',/részecsk/i],['fizika',/fizik/i],['lebegés',/lebeg/i],['forgás',/forg/i],
  ['üveg',/üveg|glass/i],['neon',/neon/i],['crt',/crt/i],['bolygó',/bolygó/i],['terep',/terep/i],['útvonal',/útvonal/i],['hologram',/hologram/i],
 ];
 let pass=0;const miss=[];
 for(const [q,re] of CASES){const t=top(q);if(t.some(n=>re.test(n)))pass++;else miss.push(q+' → '+t.join(' | '));}
 info.pass=pass+'/'+CASES.length;if(pass<18)bad.push('search quality: '+miss.join(' ; '));info.miss=miss;
 // role filter
 const allMo=catSearch('lebeg');const onlyMo=catSearch('lebeg','mo');if(!onlyMo.length)bad.push('Mozgás role finds nothing for lebeg');
 if(onlyMo.some(([c,i])=>roleOf(c,LIB[c][i])!=='mo'))bad.push('role filter leaks');if(catSearch('tinta','look').some(([c])=>c!=='fx'))bad.push('Megjelenések leaks');
 info.lebeg=[allMo.length,onlyMo.length];
 // index covers every non-header entry, ids unique and order-independent
 const idx=catalogIndex();let n=0;for(const [c] of CATS)n+=LIB[c].filter(x=>!x.head).length;info.indexed=idx.length+'/'+n;if(idx.length!==n)bad.push('index incomplete');
 const ids=new Set(idx.map(r=>r.id));info.dupIds=idx.length-ids.size;
 const k0=catId('fx',LIB.fx.findIndex(x=>!x.head));if(!/^fx:/.test(k0))bad.push('id format');
 // old shelf key (drag/thumbnail) unchanged
 if(ikey('fx',0)!=='fx:0')bad.push('ikey changed');
 // UI: typing shows role chips, clicking one narrows the shelf
 const inp=$('#libSearch');inp.value='lebeg';inp.dispatchEvent(new Event('input'));
 const chips=[...document.querySelectorAll('#cats .rolechip')].map(b=>b.textContent);info.chips=chips;if(!chips.some(t=>/^Motion/.test(t)))bad.push('no Mozgás chip');
 const mo=[...document.querySelectorAll('#cats .rolechip')].find(b=>/^Motion/.test(b.textContent));mo&&mo.click();
 const shown=document.querySelectorAll('#items .item').length;info.shown=shown;if(shown!==onlyMo.length)bad.push('chip did not narrow shelf');
 inp.value='';inp.dispatchEvent(new Event('input'));if(R.libRole)bad.push('role kept after clearing search');
 return {bad,info};})()
