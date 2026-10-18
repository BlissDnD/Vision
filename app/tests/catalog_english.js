// English display copy must cover every built-in item without changing its persisted identity.
(()=>{const bad=[],info={};
 const expected={recipes:[56,'8bcaed2d'],gen:[25,'8e303f64'],shapes:[23,'fdc7e4bb'],'3d':[34,'e25c3bdf'],fx:[31,'6ca36c9e'],motion:[57,'8f7a4bd0'],particles:[15,'2cc5829a'],world:[47,'c1821a0d'],media:[12,'bb432ac9']};
 const hash=s=>{let h=2166136261;for(const c of s){h^=c.charCodeAt(0);h=Math.imul(h,16777619)}return (h>>>0).toString(16)};
 for(const [cat,[count,digest]] of Object.entries(expected)){
  const ids=LIB[cat].map((it,i)=>it.head||it.own?null:catId(cat,i)).filter(Boolean);
  if(ids.length!==count||hash([...ids].sort().join('|'))!==digest)bad.push(cat+': legacy IDs changed');
  for(let i=0;i<LIB[cat].length;i++){const it=LIB[cat][i];if(it.head||it.own)continue;
   if(!CATALOG_EN[catId(cat,i)]||!catalogLabel(cat,i).trim())bad.push(cat+': missing English label for '+it.name);
  }
 }
 const idx=catalogIndex();if(new Set(idx.map(x=>x.id)).size!==idx.length)bad.push('duplicate catalog IDs');
 const english=catSearch('ocean planet').slice(0,5).map(([cat,i])=>catalogLabel(cat,i));
 const hungarian=catSearch('óceánbolygó').slice(0,5).map(([cat,i])=>catalogLabel(cat,i));
 if(!english.some(x=>/Ocean planet/.test(x)))bad.push('English search misses ocean planet');
 if(!hungarian.some(x=>/Ocean planet/.test(x)))bad.push('legacy Hungarian search broken');
 buildShelf();if(!document.querySelector('#items .item span')?.textContent||document.querySelector('#items .item span')?.textContent==='Liquid Glass · fénykép')bad.push('Library shows legacy label');
 if(!libById('world:jegvilag~')||!libById('motion:bento-atrendezodes~'))bad.push('old duplicate ID alias missing');
 info.items=idx.length;info.english=english;info.hungarian=hungarian;return{bad,info};})()
