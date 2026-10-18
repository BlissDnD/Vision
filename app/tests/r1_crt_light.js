// R1 · CRT-képernyő + Színes vetett fény: fordul; a fény a betűk mögött a megadott irányba esik, a túloldal és a
// vászon sarka üres marad (nincs színes téglalap); CRT ugyanazon t-n azonos (ugrás után is), a széle átlátszó;
// mentés→újranyitás; könyvtári elemek; renderidő (SwiftShader, csak tájékoztató).
(()=>{const bad=[],info={};const L0=st.layers;st.layers=[];
 const LP=st.look.p,saved={};for(const k of ['bloom','hal','grain','vig','chroma','fade','sharpen'])if(LP[k]){saved[k]=LP[k].v;LP[k].v=0;}
 for(const k of ['crt','castlight']){const L=makeLayer(k);getProg(L);const e=progError(L);if(e)bad.push(k+': '+e.slice(0,600));}
 const T=makeLayer('text',{text:{str:'VEL',font:'Unbounded',weight:'700'}});T.n.s.v=.35;const F=makeLayer('castlight');T.fx=[F];st.layers=[T];commit();
 const w=cv.width,h=cv.height;
 const px=t=>{const out=renderScene(st.layers,R.main,t,'#000000');present(R.main,out.t,null,w,h,t);const b=new Uint8Array(w*h*4);gl.readPixels(0,0,w,h,gl.RGBA,gl.UNSIGNED_BYTE,b);return b;};
 const at=(b,x,y)=>{const i=(y*w+x)*4;return b[i]+b[i+1]+b[i+2];};
 const diff=(a,b)=>{let s=0;for(let i=0;i<a.length;i+=4)s+=Math.abs(a[i]-b[i])+Math.abs(a[i+1]-b[i+1])+Math.abs(a[i+2]-b[i+2]);return s/(a.length/4*3);};
 F.vis=false;const plain=px(.5);F.vis=true;
 let x0=w,x1=0,y0=h,y1=0;for(let y=0;y<h;y++)for(let x=0;x<w;x++)if(at(plain,x,y)>60){x0=Math.min(x0,x);x1=Math.max(x1,x);y0=Math.min(y0,y);y1=Math.max(y1,y);}
 info.box=[x0,x1,y0,y1,w,h];if(x1<=x0)bad.push('nincs szöveg a képen');
 const lit=px(.5);const d=Math.round(h*.03);
 info.beyond=at(lit,Math.min(w-1,x1+d),Math.max(0,y0-d));info.opposite=at(lit,Math.max(0,x0-d),Math.min(h-1,y1+d));info.corner=at(lit,2,h-3);
 if(info.beyond<40)bad.push('nincs fény a réteg keretén túl a megadott irányban: '+info.beyond);
 if(info.opposite>15)bad.push('fény a túloldalon: '+info.opposite);
 if(info.corner>15)bad.push('nem üres a sarok (téglalap?): '+info.corner);
 F.p.angle.v=135;const flip=px(.5);info.flipOpp=at(flip,Math.max(0,x0-d),Math.min(h-1,y1+d));if(info.flipOpp<40)bad.push('irányváltás nem hat');F.p.angle.v=315;
 F.p.len.v=.5;const long=px(.5);info.longFar=at(long,Math.min(w-1,x1+Math.round(w*.12)),Math.max(0,y0-Math.round(w*.12)));F.p.len.v=.18;
 T.n.x.v=.2;const moved=px(.5);T.n.x.v=0;if(diff(moved,lit)<.5)bad.push('a fény nem mozdul a szöveggel');
 // CRT on the same text
 const C=makeLayer('crt');T.fx=[C];
 const c1=px(1.3);px(4.1);px(.2);const c2=px(1.3);if(diff(c1,c2)>0)bad.push('CRT: ugrás után más a kép');
 const c3=px(1.33);info.crtFrames=+diff(c1,c3).toFixed(3);
 info.crtCorner=at(c1,1,1);if(info.crtCorner>8)bad.push('CRT sarok nem üres: '+info.crtCorner);
 C.vis=false;const plainC=px(1.3);C.vis=true;info.crtVsPlain=+diff(c1,plainC).toFixed(2);if(info.crtVsPlain<.3)bad.push('CRT nem látszik');
 // group + both effects, save → reopen
 T.fx=[F,C];const G=makeGroup('Csop',[T]);G.fx=[makeLayer('crt')];st.layers=[G];commit();px(.7);
 const snap=snapshot();loadProject(JSON.parse(projectJSON()));if(snapshot()!==snap)bad.push('újranyitás');
 for(const k of ['crt','castlight'])if(!LIB.fx.find(x=>x.name===EFFECTS[k].name))bad.push('nincs könyvtári elem: '+k);
 // timing (SwiftShader, informative)
 const T2=makeLayer('text',{text:{str:'VEL',font:'Unbounded',weight:'700'}});T2.fx=[makeLayer('castlight')];st.layers=[T2];
 const tm=(n)=>{const s=performance.now();for(let i=0;i<n;i++)px(.5+i*.01);return +((performance.now()-s)/n).toFixed(1);};
 info.msLight=tm(3);T2.fx=[makeLayer('crt')];info.msCrt=tm(3);T2.fx=[];info.msPlain=tm(3);
 if(gl.getError())bad.push('GL hiba');
 for(const k in saved)LP[k].v=saved[k];st.layers=L0;commit();
 return bad.length?bad:['OK '+JSON.stringify(info)];})()
