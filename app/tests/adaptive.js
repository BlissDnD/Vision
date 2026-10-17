(()=>{const out=[];st.qMode='auto';R.snapping=false;const step=(fps)=>{for(let i=0;i<Math.ceil(1.2*fps)+1;i++)autoQuality(1/fps,true);};
// capped at 30: first drop, no gain -> cap detected, drop undone
R.aqF=1;R.aqCap=0;R.aqPrev=null;step(30);const f1=R.aqF;step(30);out.push('after 2 windows aqF='+R.aqF.toFixed(2)+' cap='+Math.round(R.aqCap)+' (first drop '+f1.toFixed(2)+')');
for(let k=0;k<6;k++)step(30);out.push('stable aqF='+R.aqF.toFixed(2));
// real GPU limit: fps improves after drop -> keeps lowering
R.aqF=1;R.aqCap=0;R.aqPrev=null;step(20);step(26);step(32);out.push('gpu-bound aqF='+R.aqF.toFixed(2)+' cap='+R.aqCap);
// cap lifted (plugged in): fps 60 -> cap cleared
R.aqCap=30;step(60);out.push('lifted cap='+R.aqCap);
return out;})()
