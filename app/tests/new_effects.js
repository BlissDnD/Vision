(()=>{const ks=['skygrad','sun','clouds','terrain','haze','bento','projector','shape'];const bad=[];
for(const k of ks){const L=makeLayer(k);if(k==='shape')L.p.kind.v=13;getProg(L);const e=progError(L);if(e)bad.push(k+': '+e.slice(0,600));}
return bad;})()
