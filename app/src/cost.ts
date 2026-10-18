import { cv, progError } from './gl';
import { st } from './state';

export const COST={unwoven:3,surface3d:3,terrain3d:4,windflame:3,liquidglass:5,cloud3d:4,balloon:2,inksketch:1,hologram:1,pdisp:2,gradient:1,plasma:1,liquid:1,moire:1,tunnel:1,hyper:1,grid:1,lava:1,flare:1,text:1,image:1,shape:1,sacred:2,nebula:2,aurora:2,kali:2,julia:2,blackhole:2,galaxy:2,waves:2,cells:2,fire:2,custom:2,gyroid:4,obj3d:5,
 planet:2,sky:2,space:2,bokeh:1,skygrad:1,sun:1,clouds:2,terrain:2,haze:1,bento:2,projector:2,mtext:1,reveal:1,particles:3,emitter:3,pathshape:1,textwrap:2,textextrude:4,textpath:1,sdfscene:6,blur:2,glow:2,radial:2,blob:3,lens:1,kaleido:1,feedback:1,fluid:3,fluidfx:3,swirl:1,warp:1,ripple:1,edge:1,mirror:1,polar:1,chroma:1,psycolor:1,grade:1,glitch:1,film:1,crt:1,castlight:2,texture:1,ascii:1,halftone:1,pixelart:1};
export function itemError(it){if(it.type==='group')return it.children.some(itemError)||(it.fx||[]).some(itemError);return !!progError(it)||(it.fx||[]).some(itemError);}
export function itemCost(it){const fx=(it.fx||[]).reduce((s,f)=>s+(f.vis?COST[f.type]||1:0),0);
  if(it.type==='group')return 1+fx+it.children.reduce((s,c)=>s+(c.vis?itemCost(c):0),0);
  let c=COST[it.type]||1;if(it.type==='custom'&&it.cw>0)c=it.cw;if(it.type==='obj3d'){if(it.p.shape.v>8.5)c+=2;if(it.p.floor.v>0)c+=1;if(it.p.aa.v>.5)c*=4;}if(it.type==='sdfscene'&&it.p.aa.v>.5)c*=4;if(it.type==='particles')c+=Math.round(it.p.density.v)*2;return c+fx;}
export function sceneLoad(){const px=(cv.width*cv.height)/(960*540);return (st.layers.reduce((s,it)=>s+(it.vis?itemCost(it):0),0)+(st.look.p.bloom.v>0||st.look.p.hal.v>0?2:1))*px;}
export const loadLabel=l=>l<10?'Light':l<22?'Medium':l<40?'Heavy':'Very heavy';
