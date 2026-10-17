// M5 · Eljátszás simítással: zajos mozdulat → kevés, sima kulcskocka; csak a felvétel idősávja cserélődik; utólagos simítás.
(()=>{const bad=[],info={};st.layers=[];
 const L=makeLayer('plasma');st.layers=[L];setKey(L.n.x,5,.9);setKey(L.n.x,.2,-.5);
 let seed=7;const rnd=()=>{seed=(seed*16807)%2147483647;return seed/2147483647-.5;};
 const S=[];for(let i=0;i<=120;i++){const t=1+i/60,a=(t-1)*Math.PI;S.push({t,x:.4*Math.cos(a)+rnd()*.02,y:.4*Math.sin(a)+rnd()*.02});}
 const n0=smoothTake(S,0).length,n5=smoothTake(S,.5).length,n1=smoothTake(S,1).length;info.keys={raw:S.length,s0:n0,s50:n5,s100:n1};
 if(!(n5<S.length/3&&n5>=4))bad.push('simítás után a kulcsok száma: '+n5);if(!(n1<=n5&&n5<=n0))bad.push('a simítás nem ritkít monoton');
 const n=applyTake(L,S,.5);
 // the keyed path follows the clean gesture
 let err=0;for(let i=0;i<=40;i++){const t=1.05+i/40*1.9,a=(t-1)*Math.PI;err=Math.max(err,Math.hypot(ev(L.n.x,BASEK.x,t)-.4*Math.cos(a),ev(L.n.y,BASEK.y,t)-.4*Math.sin(a)));}
 info.maxErr=+err.toFixed(4);if(err>.05)bad.push('a kulcsolt pálya eltér a mozdulattól: '+err.toFixed(3));
 info.outside=L.n.x.k.filter(k=>k.t<1||k.t>3).map(k=>k.t);if(!info.outside.includes(5)||!info.outside.includes(.2))bad.push('a felvételen kívüli kulcs elveszett');
 // re-smoothing the same take replaces only its own keys
 const before=L.n.x.k.length;applyTake(L,S,1);info.resmooth={before,after:L.n.x.k.length};if(!(L.n.x.k.length<before)||!L.n.x.k.some(k=>k.t===5))bad.push('utólagos simítás');
 // live preview override is transient and never saved
 Object.defineProperty(L.n.x,'_pv',{value:.123,configurable:true,writable:true,enumerable:false});if(ev(L.n.x,BASEK.x,2)!==.123)bad.push('élő előnézet');
 if(projectJSON().includes('_pv'))bad.push('_pv bekerült a fájlba');delete L.n.x._pv;
 setPerform(true);info.ui={pressed:$('#perfBtn').getAttribute('aria-pressed'),slider:!$('#perfSmooth').hidden};setPerform(false);
 if(info.ui.pressed!=='true'||!info.ui.slider)bad.push('Eljátszás gomb');
 st.layers=[];commit();
 return {bad,info};})()
