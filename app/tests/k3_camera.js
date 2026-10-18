// K3 · Kamera: Célpontok módban a cél a kép közepére kerül, célváltáskor lágyan átúszik, a mozgó célt késéssel követi,
// Élesség a célon a mélységélességet a célra állítja; Útvonalon a kamera az útvonal pontján áll; a kézikamera determinisztikusan
// remeg; régi projekt (mód nélkül) változatlan; mentés→újranyitás megőrzi.
(()=>{const bad=[],info={};st.layers=[];st.cam=normCam(null);
 const A=makeLayer('shape',{pal:5,x:.4,y:.1,p:{kind:0,size:.1}}),B=makeLayer('shape',{pal:3,x:-.5,y:-.2,p:{kind:0,size:.1}});A.n.z.v=0;B.n.z.v=1.5;st.layers=[A,B];
 const scr=(L,t)=>{R.CAMON=true;const p=placeAt(L,t);R.CAMON=false;return p;};
 st.cam.on=true;st.cam.mode=1;st.cam.shots=[{t:0,id:A.id},{t:2,id:B.id}];st.cam.n.lag.v=0;st.cam.n.trans.v=1;R.camFrame=1;
 const a1=scr(A,1);info.A1=[+a1[0].toFixed(4),+a1[1].toFixed(4)];if(Math.hypot(a1[0],a1[1])>1e-3)bad.push('Célpontok: az A cél nincs középen');
 R.camFrame++;const b4=scr(B,4);if(Math.hypot(b4[0],b4[1])>1e-3)bad.push('célváltás után B nincs középen');
 R.camFrame++;const m=scr(A,2.5),mB=scr(B,2.5);info.mid=[+m[0].toFixed(3),+mB[0].toFixed(3)];if(!(Math.abs(m[0])>.05&&Math.abs(mB[0])>.05))bad.push('célváltás nem átúszás (ugrik)');
 R.camFrame++;const pre=scr(A,1.99);if(Math.hypot(pre[0],pre[1])>1e-3)bad.push('célváltás előtt már mozdul');
 // follow a moving target with lag
 setKey(A.n.x,0,0);setKey(A.n.x,1,.6);st.cam.shots=[{t:0,id:A.id}];st.cam.n.lag.v=0;R.camFrame++;const f0=scr(A,.5);st.cam.n.lag.v=.4;R.camFrame++;const f1=scr(A,.5);info.follow=[+f0[0].toFixed(3),+f1[0].toFixed(3)];
 if(Math.abs(f0[0])>1e-3)bad.push('késés nélkül nem középen');if(!(f1[0]>.02))bad.push('a követés késése nem késlelteti a kamerát');A.n.x.k=[];A.n.x.v=.4;st.cam.n.lag.v=0;
 // focus on target
 st.cam.n.ap.v=1;st.cam.focusT=true;st.cam.shots=[{t:0,id:B.id}];R.CAMON=true;R.camFrame++;const cb=camXf(B,1),ca=camXf(A,1);R.CAMON=false;info.blur=[+cb.blur.toFixed(3),+ca.blur.toFixed(3)];
 if(cb.blur>.01)bad.push('Élesség a célon: a cél elmosódott');if(!(ca.blur>.1))bad.push('Élesség a célon: a másik réteg éles maradt');delete st.cam.focusT;st.cam.n.ap.v=0;
 // path mode
 const Pth=makeLayer('pathshape');st.layers=[Pth,A,B];st.cam.mode=2;st.cam.path=Pth.id;st.cam.n.pper.v=4;R.camFrame++;const q=pathAt(Pth.id,1,.25);R.CAMON=true;const cx=camXf(A,1);R.CAMON=false;
 info.path=[+(cx.cx-q.x).toFixed(4),+(cx.cy-q.y).toFixed(4)];if(Math.hypot(cx.cx-q.x,cx.cy-q.y)>1e-3)bad.push('Útvonalon: a kamera nincs az útvonal pontján');
 // shake
 st.cam.mode=0;delete st.cam.path;st.cam.n.shake.v=.8;R.CAMON=true;R.camFrame++;const s1=camXf(A,1.3);R.camFrame++;const s2=camXf(A,1.3);R.camFrame++;const s3=camXf(A,2.1);R.CAMON=false;
 if(Math.abs(s1.cx-s2.cx)>1e-9)bad.push('a kézikamera nem determinisztikus');if(Math.abs(s1.cx-s3.cx)<1e-4)bad.push('a kézikamera nem remeg');st.cam.n.shake.v=0;
 // render works, save/reopen
 st.cam.mode=1;st.cam.shots=[{t:0,id:A.id},{t:2,id:B.id}];st.cam.focusT=true;const out=renderScene(st.layers,R.main,2.5,st.bg);present(R.main,out.t,null,cv.width,cv.height,1);if(gl.getError())bad.push('GL hiba');
 commit();const snap=snapshot();loadProject(JSON.parse(projectJSON()));if(snapshot()!==snap)bad.push('újranyitás: eltérés');
 if(st.cam.mode!==1||!st.cam.shots||st.cam.shots.length!==2||!st.cam.focusT)bad.push('újranyitás: kameramód/célpontok elvesztek');
 const old=normCam({on:true,n:{x:{v:.2}}});if('mode' in old||'shots' in old||'path' in old)bad.push('régi kamera új mezőket kapott');
 st.layers=[];st.cam=normCam(null);commit();
 return {bad,info};})()
