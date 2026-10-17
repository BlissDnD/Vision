// M7 · Részecske Megjelenés (pdisp): a szöveg jelzésre pontokra esik szét és visszaáll; új szövegekkel a következő
// szó áll össze; tisztán időfüggvény (ugrás/ismétlés azonos), ismétlődő mód, mentés→újranyitás, könyvtári elem.
(()=>{const bad=[],info={};st.layers=[];const cues0=st.cues;st.cues=[{id:'Ca',t:1,label:''},{id:'Cb',t:4,label:''}];
 const T=makeLayer('text',{text:{str:'SZÉT',font:'Unbounded',weight:'700'}});T.n.s.v=.3;const F=makeLayer('pdisp');F.alts=['ÚJ'];T.fx=[F];st.layers=[T];commit();
 const px=t=>{const out=renderScene(st.layers,R.main,t,'#000000');present(R.main,out.t,null,cv.width,cv.height,t);const w=cv.width,h=cv.height,b=new Uint8Array(w*h*4);gl.readPixels(0,0,w,h,gl.RGBA,gl.UNSIGNED_BYTE,b);return b;};
 const diff=(a,b)=>{let s=0;for(let i=0;i<a.length;i+=4)s+=Math.abs(a[i]-b[i])+Math.abs(a[i+1]-b[i+1])+Math.abs(a[i+2]-b[i+2]);return s/(a.length/4*3);};
 const plain=(str,t=.5)=>{F.vis=false;const o=T.text.str;T.text.str=str;const b=px(t);T.text.str=o;F.vis=true;return b;};
 const pS=plain('SZÉT'),pU=plain('ÚJ',3.6),a=px(.5),sc=px(1.6),back=px(3.6);
 info.restVsText=+diff(a,pS).toFixed(2);info.scatter=+diff(sc,a).toFixed(2);info.backVsNew=+diff(back,pU).toFixed(2);info.backVsOld=+diff(back,pS).toFixed(2);
 if(info.scatter<info.restVsText*2||info.scatter<1)bad.push('nem esik szét');
 if(!(info.backVsNew<info.backVsOld)||info.backVsNew>.5)bad.push('nem az új szöveg állt össze');
 if(altText(T,.5)!==null||altText(T,1.6)!=='ÚJ'||altText(T,4.7)!=='SZÉT')bad.push('szövegsorrend: '+[altText(T,.5),altText(T,1.6),altText(T,4.7)]);
 const e1=pdEnv(F,1.25),e2=pdEnv(F,3.9);info.env=[+e1.toFixed(2),+e2.toFixed(2)];if(!(e1>.3&&e2<.01))bad.push('burkoló');
 const s1=px(1.7);px(3.3);px(.2);const s2=px(1.7);if(diff(s1,s2)>0)bad.push('ugrás: nem ismételhető');
 F.p.trig.v=2;F.p.every.v=3;info.rep=pdEvents(F,7.2);if(info.rep.join()!=='1,4,7')bad.push('ismétlődés: '+info.rep);
 F.p.trig.v=0;F.p.amount.v=0;const m0=px(5);F.p.amount.v=1.5;const m1=px(5);if(diff(m0,m1)<1)bad.push('kézi szétesés nem hat');F.p.trig.v=1;F.p.amount.v=0;
 const snap=snapshot();loadProject(JSON.parse(projectJSON()));if(snapshot()!==snap||!(st.layers[0].fx[0].alts&&st.layers[0].fx[0].alts[0]==='ÚJ'))bad.push('újranyitás');
 const it=LIB.particles.find(x=>/felirat/.test(x.name));if(!it)bad.push('nincs könyvtári elem');else{st.layers=[it.make()];px(2);}
 if(gl.getError())bad.push('GL hiba');
 st.layers=[];st.cues=cues0||[];commit();
 return {bad,info};})()
