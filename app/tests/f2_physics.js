// F2 · Fizikai test: gravitációval esik és a vászon alján megáll, két test ütközik és visszapattan, „Semmivel” átmegy,
// rögzített test nem mozdul és megtartja a ráeső testet, két doboz egymáson áll, ugrás = ugyanaz a helyzet,
// kiesés jelzése + Visszahozás, a renderelt képen is ott van, Kulcsokká alakítás, mentés→újranyitás.
(()=>{const bad=[],info={};st.layers=[];st.size='1920x1080';physReset();
 const r3=x=>Math.round(x*1000)/1000;
 const circ=(x,y,o)=>{const L=makeLayer('shape',{pal:5,x,y,p:{kind:0,size:.1}});L.mo=[makeMo('phys',o)];return L;};
 const pos=(L,t)=>{const P=physAt(L,t);return [ev(L.n.x,BASEK.x,t)+P.dx,ev(L.n.y,BASEK.y,t)+P.dy,P];};
 // 1) gravity: falls and rests on the bottom wall
 const A=circ(0,.3,{grav:1,bounce:.2});st.layers=[A];commit();
 const y2=pos(A,2.5)[1],y3=pos(A,3)[1];info.rest=[r3(y2),r3(y3)];if(Math.abs(y3-(-.4))>.02)bad.push('nem a vászon alján áll meg: '+r3(y3));if(Math.abs(y3-y2)>.01)bad.push('nem nyugszik meg');
 if(!(pos(A,.3)[1]<.29))bad.push('nem esik');
 // without gravity it stays (default off)
 const Z=circ(.5,.2,{});st.layers=[Z];commit();if(Math.abs(pos(Z,2)[1]-.2)>1e-6)bad.push('gravitáció alapból nem nulla');
 // 2) two bodies collide and bounce back, never overlap
 const B=circ(-.4,0,{push:1,pang:0,bounce:.6}),C=circ(.4,0,{push:1,pang:180,bounce:.6});st.layers=[B,C];commit();
 let minD=9;for(let t=0;t<1.5;t+=1/30){const d=Math.hypot(pos(B,t)[0]-pos(C,t)[0],pos(B,t)[1]-pos(C,t)[1]);minD=Math.min(minD,d);}
 info.minDist=r3(minD);if(minD<.18)bad.push('a testek egymásba csúsznak');
 info.bx=[r3(pos(B,.3)[0]),r3(pos(B,1)[0])];if(!(pos(B,1)[0]<pos(B,.3)[0]-.1))bad.push('nem pattan vissza');
 // 3) Ütközés: Semmivel → they pass through each other
 B.mo[0].p.coll.v=2;commit();info.ghostX=r3(pos(B,1)[0]);if(!(pos(B,1)[0]>.2))bad.push('a Semmivel test nem megy át');B.mo[0].p.coll.v=0;
 // group filter: Csak a csoportjával + different groups → pass through
 B.mo[0].p.coll.v=1;C.mo[0].p.group.v=2;commit();if(!(pos(B,1)[0]>.2))bad.push('a Csoport-szűrés nem hat');B.mo[0].p.coll.v=0;C.mo[0].p.group.v=1;
 // 4) fixed box holds a falling circle; fixed body does not move
 const F=makeLayer('shape',{pal:3,x:0,y:-.2,p:{kind:2,size:.1,round:0}});F.mo=[makeMo('phys',{fixed:1})];const D=circ(.02,.3,{grav:1,bounce:0});st.layers=[F,D];commit();
 const dy=pos(D,3)[1];info.onBox=r3(dy);if(Math.abs(dy-(-.2+.1+.1))>.03)bad.push('a rögzített dobozon nem áll meg: '+r3(dy));
 const fp=physAt(F,3);if(Math.abs(fp.dx)+Math.abs(fp.dy)>1e-9)bad.push('a rögzített test elmozdult');
 // 5) two boxes stacked stay stacked
 const G=makeLayer('shape',{pal:4,x:0,y:-.3,p:{kind:2,size:.08,round:0}}),H=makeLayer('shape',{pal:6,x:.03,y:0,p:{kind:2,size:.08,round:0}});
 G.mo=[makeMo('phys',{grav:1,bounce:0})];H.mo=[makeMo('phys',{grav:1,bounce:0})];st.layers=[G,H];commit();
 const g4=pos(G,4),h4=pos(H,4);info.stack=[r3(g4[1]),r3(h4[1]),r3(h4[2].rot)];
 if(Math.abs(g4[1]-(-.42))>.02||Math.abs(h4[1]-(-.26))>.03||Math.abs(h4[2].rot)>8)bad.push('a dobozok nem állnak egymáson');
 // 6) seek: same t = same pose, independent of the order of requests
 const s3=JSON.stringify(physAt(H,3)),s1=(physAt(H,1),physAt(H,.2),JSON.stringify(physAt(H,3)));physReset();const s3b=JSON.stringify(physAt(H,3));
 if(s3!==s1||s3!==s3b)bad.push('ugrás után más helyzet');
 // 7) falls out through Átengedi → reported; Visszahozás = walls back on
 const O=circ(0,0,{push:2,pang:-90,walls:1});st.layers=[O];commit();info.out=r3(physOut(O,3));if(!(physOut(O,3)>0))bad.push('a kiesés nincs jelezve');
 O.mo[0].p.walls.v=0;commit();if(physOut(O,3)>=0)bad.push('Visszahozás után is kint');
 // 8) rendered image: the fallen circle is at the bottom, not at its start
 st.layers=[A];commit();const out=renderAt(st.layers,R.main,3,st.bg,true);present(R.main,out.t,null,cv.width,cv.height,3);
 const w=cv.width,hh=cv.height,b=new Uint8Array(w*hh*4);gl.readPixels(0,0,w,hh,gl.RGBA,gl.UNSIGNED_BYTE,b);
 const lum=(u,v)=>{const i=(Math.floor(v*hh)*w+Math.floor(u*w))*4;return b[i]+b[i+1]+b[i+2];};
 info.px=[lum(.5,.1),lum(.5,.8)];if(!(lum(.5,.1)>lum(.5,.8)+60))bad.push('a képen nem a vászon alján van');
 // 9) Kulcsokká alakítás bakes the fall into keys
 const K=circ(0,.3,{grav:1});st.layers=[K];commit();const n=bakeMo(K,K.mo[0]);info.baked=n;if(!(n>2)||K.mo.length)bad.push('Kulcsokká alakítás nem működik');
 if(Math.abs(ev(K.n.y,BASEK.y,3)-(-.4))>.03)bad.push('a kulcsok nem a fizikai pályát követik');
 // 10) save → reopen
 st.layers=[G,H];commit();const snap=snapshot();loadProject(JSON.parse(projectJSON()));if(snapshot()!==snap)bad.push('újranyitás: eltérés');
 const H2=st.layers[1];if(!H2||!H2.mo||H2.mo[0].t!=='phys')bad.push('újranyitás: mozgás');else if(Math.abs(pos(H2,4)[1]-h4[1])>1e-9)bad.push('újranyitás után más helyzet');
 st.layers=[];commit();physReset();
 return {bad,info};})()
