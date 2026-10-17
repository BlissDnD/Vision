(()=>{const out={bad:[],thumbErr:[],rec:[]};
for(const k of ['skygrad','sun','clouds','terrain','haze','bento','projector','mtext','shape','reveal']){const L=makeLayer(k);getProg(L);const e=progError(L);if(e)out.bad.push(k+': '+e.slice(0,500));}
for(const c of ['world','motion']){LIB[c].forEach((it,i)=>{if(it.head)return;try{renderThumb(c,i);}catch(e){out.thumbErr.push(c+i+' '+e.message);} });}
const ctx=mkCtx(320,180);
RECIPES.filter(R=>R.cat).forEach(R=>{try{const g=makeRecipe(R);const o=renderScene([g],ctx,3,'#000');const px=new Float32Array(4);gl.bindFramebuffer(gl.FRAMEBUFFER,o.f);gl.readPixels(160,90,1,1,gl.RGBA,gl.FLOAT,px);out.rec.push(R.n+' '+[...px].map(x=>x.toFixed(2)).join(','));}catch(e){out.rec.push(R.n+' ERR '+e.message)}});
return out;})()
