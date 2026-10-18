// T1 · 3D Terep: renderel GL-hiba nélkül, a seed determinisztikus (ugyanaz = ugyanaz, más = más), mind a hat típus
// fordul és eltér, a vízszint látszik, a jelenetfény iránya mozgatja az árnyékot, seek = ugyanaz a kép, mentés→újranyitás.
(()=>{const bad=[],info={};st.layers=[];
 const L=makeLayer('terrain3d');L.p.qual.v=0;st.layers=[L];commit();
 const px=(t=1)=>{const out=renderScene(st.layers,R.main,t,st.bg);present(R.main,out.t,null,cv.width,cv.height,1);const w=cv.width,h=cv.height,b=new Uint8Array(w*h*4);gl.readPixels(0,0,w,h,gl.RGBA,gl.UNSIGNED_BYTE,b);return b;};
 const diff=(a,b)=>{let s=0;for(let i=0;i<a.length;i+=4)s+=Math.abs(a[i]-b[i])+Math.abs(a[i+1]-b[i+1])+Math.abs(a[i+2]-b[i+2]);return s/(a.length/4*3);};
 const a=px();info.err=gl.getError();info.terrErr=R.terrErr||null;info.tris=R.terrTris;
 if(info.err||info.terrErr)bad.push('GL/shader hiba: '+(info.terrErr||info.err));if(!(R.terrTris>20000))bad.push('kevés háromszög');
 let green=0,sky=0;for(let i=0;i<a.length;i+=4){if(a[i+1]>a[i]+8&&a[i+1]>a[i+2])green++;if(a[i+2]>a[i]+20&&a[i+2]>140)sky++;}
 info.greenPx=+(green/(a.length/4)).toFixed(3);info.skyPx=+(sky/(a.length/4)).toFixed(3);
 if(info.greenPx<0.05)bad.push('alig van növényzet (zöld) a Mérsékelt hegyvidéken');if(info.skyPx<0.03)bad.push('nincs égbolt');
 const a2=px();info.sameSeed=+diff(a,a2).toFixed(3);if(info.sameSeed>0.01)bad.push('ugyanaz a seed más képet ad');
 L.p.seed.v=8;const b=px();info.otherSeed=+diff(a,b).toFixed(2);if(info.otherSeed<2)bad.push('más seed alig más');L.p.seed.v=7;
 const shots=[];for(let k=0;k<6;k++){L.p.ttype.v=k;shots.push(px());if(gl.getError()||R.terrErr)bad.push('típus '+k+' hiba');}
 info.typeDiff=[];for(let k=1;k<6;k++){const d=diff(shots[0],shots[k]);info.typeDiff.push(+d.toFixed(1));if(d<2)bad.push('típus '+k+' alig tér el a Hegytől');}
 L.p.ttype.v=2;L.p.water.v=0;const w0=px();L.p.water.v=.35;const w1=px();
 let blue0=0,blue1=0;for(let i=0;i<w0.length;i+=4){if(w0[i+2]>w0[i]+25)blue0++;if(w1[i+2]>w1[i]+25)blue1++;}
 info.water=[blue0,blue1];if(!(blue1>blue0*1.3+500))bad.push('a vízszint nem hoz létre vizet');
 L.p.ttype.v=0;L.p.water.v=.22;st.light.on=true;st.light.p.az.v=-60;st.light.p.el.v=25;const s0=px();st.light.p.az.v=90;const s1=px();
 info.lightDiff=+diff(s0,s1).toFixed(2);if(info.lightDiff<3)bad.push("a jelenetfény iránya nem hat");st.light.p.az.v=-39.81;st.light.p.el.v=45.58;
 L.p.relief.v=0;setKey(L.p.relief,0,0);setKey(L.p.relief,2,1.4);const k1=px(1),k1b=(px(1.7),px(1));info.seek=+diff(k1,k1b).toFixed(3);if(info.seek>0.01)bad.push('seek után más kép');
 info.reliefAnim=+diff(px(0),px(2)).toFixed(2);if(info.reliefAnim<2)bad.push('a Domborzat nem animálható');
 commit();const snap=snapshot();loadProject(JSON.parse(projectJSON()));if(snapshot()!==snap)bad.push('újranyitás: eltérés');
 const L2=st.layers[0];if(!L2||L2.type!=='terrain3d'||L2.p.relief.k.length!==2)bad.push('újranyitás: réteg/kulcsok');
 st.layers=[];commit();
 return {bad,info};})()
