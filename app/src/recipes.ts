import { R } from './runtime';
import { makeGroup, makeLayer, assets } from './state';
import { GLASS_PHOTO_ID, GLASS_PHOTO } from './referenceAssets';
import { macroRead } from './macros';
import { CATALOG_EN } from './catalogcopy';
/** English display name of a recipe; R.n stays the persisted identity. */
const recipeLabel=(n)=>CATALOG_EN['recipes:'+n.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')]||n;

export const PLA={ptype:1,seed:7,radius:.3,ring:.8,ringtilt:16,sunang:35,clouds:.55,lights:.6,atmocol:'#6fb2ff'};
export const RECIPES=[
 {n:'Liquid Glass · fénykép',desc:'The CodePen reference glass lens over a full photo. Drag the Appearance onto the base image to use it with any photo of your own.',layers:[
   ['image',{name:'Background photo · replaceable',asset:GLASS_PHOTO_ID,s:1.25,fx:[['liquidglass',{p:{size:1,blur:1,quality:1}}]]}]],
  macros:[]},
 {n:'Láng · szélben',desc:'A flame source drawn with texture and a restrained glow; every element is editable on its own.',layers:[
   ['windflame',{name:'Wind-blown flame',fx:[['glow',{p:{amount:.35,radius:1.2,thresh:.25}}]]}]],
  macros:[{l:'Speed',t:[[0,'p.speed',0,3]]},{l:'Width',t:[[0,'p.width',.2,2]]}]},
 {n:'Portál',desc:'A twisting spacetime tunnel inside a circular mask, with sacred geometry and a lens effect.',layers:[
   ['shape',{name:'Portal mask',maskOnly:true,p:{kind:0,size:.34,soft:.05}}],
   ['tunnel',{name:'Tunnel',clip:true,pal:12,p:{twist:1.4,glow:1.4}}],
   ['sacred',{name:'Geometry',clip:true,blend:'screen',opacity:.45,key:.8,pal:11,spin:5}],
   ['shape',{name:'Rim light',blend:'screen',pal:11,p:{kind:1,size:.34,thick:.01,soft:.05,fill:1},fx:[['glow',{p:{amount:1.6,radius:2.5,thresh:0}}]]}],
   ['lens',{name:'Spacetime curvature',p:{mass:.6,ripple:.5,hole:0,ring:.3}}]],
  macros:[{l:'Size',t:[[0,'p.size',.08,.6],[3,'p.size',.08,.6],[4,'p.mass',.2,1.3]]},{l:'Energy',t:[[1,'p.glow',.3,3],[3,'n.opacity',.2,1]]},{l:'Vortex',t:[[1,'p.twist',-3,4]]},{l:'Speed',t:[[1,'p.speed',0,2],[2,'p.speed',0,1.2]]}]},
 {n:'Lélek',desc:'A pulsing, golden light core with an aura and an echoing halo.',layers:[
   ['shape',{name:'Soul core',maskOnly:true,p:{kind:0,size:.2,soft:.6}}],
   ['plasma',{name:'Inner light',clip:true,pal:8,p:{zoom:3,warp:1}}],
   ['moire',{name:'Vibration',clip:true,blend:'screen',opacity:.4,pal:8}],
   ['shape',{name:'Aura',blend:'screen',opacity:.55,pal:8,s:{v:1,a:.03,f:.25},p:{kind:0,size:.42,soft:.9,fill:1}}],
   ['feedback',{name:'Halo',p:{decay:.9,zoom:-.8,rot:.3,drift:.5}}],
   ['glow',{name:'Glow',p:{amount:1.2,thresh:.2,radius:2}}]],
  macros:[{l:'Size',t:[[0,'p.size',.06,.45],[3,'p.size',.15,.85]]},{l:'Light',t:[[5,'p.amount',0,2.5],[3,'n.opacity',.1,1]]},{l:'Pulse',t:[[3,'a:n.s',0,.12]]},{l:'Flow',t:[[1,'p.speed',0,3]]}]},
 {n:'Tűz',desc:'Roaring flames with heat shimmer and glow.',layers:[
   ['fire',{name:'Flames',pal:1}],
   ['ripple',{name:'Heat shimmer',p:{mode:1,amount:.25,freq:1.5,speed:2}}],
   ['glow',{name:'Ember glow',p:{amount:.8,thresh:.3}}],
   ['film',{name:'Film',p:{grain:.3,scan:0,vig:.6}}]],
  macros:[{l:'Height',t:[[0,'p.height',.2,1.4]]},{l:'Intensity',t:[[0,'p.intensity',.2,2]]},{l:'Speed',t:[[0,'p.speed',.2,3]]},{l:'Heat shimmer',t:[[1,'p.amount',0,1.2]]}]},
 {n:'Plazmamandala',desc:'Flowing plasma folded into a kaleidoscope.',layers:[
   ['plasma',{name:'Plasma',pal:12}],
   ['kaleido',{name:'Kaleidoscope',p:{segments:6,spin:.2,shift:.2}}],
   ['glow',{name:'Glow',p:{amount:.8}}],
   ['psycolor',{name:'Color cycle',pal:13,opacity:.35}]],
  macros:[{l:'Flow',t:[[0,'p.speed',0,3]]},{l:'Bands',t:[[0,'p.bands',.3,4]]},{l:'Symmetry',t:[[1,'p.segments',2,16]]},{l:'Light',t:[[2,'p.amount',0,2.5]]}]},
 {n:'Fekete lyuk',desc:'An event horizon with an accretion disk and light bending.',layers:[
   ['blackhole',{name:'Black hole',pal:1,p:{size:1.4,tilt:.22}}],
   ['chroma',{name:'Aberration',p:{amount:.8}}],
   ['glow',{name:'Glow',p:{amount:.9,thresh:.45,radius:2}}],
   ['film',{name:'Film',p:{grain:.35}}]],
  macros:[{l:'Size',t:[[0,'p.size',.4,2.5]]},{l:'Lens',t:[[0,'p.lens',0,2.5]]},{l:'Tilt',t:[[0,'p.tilt',.08,.8]]},{l:'Glow',t:[[2,'p.amount',0,2.5]]}]},
 {n:'Mandala-sodródás',desc:'Liquid marble mirrored, with echoing trails.',layers:[
   ['liquid',{name:'Marble',pal:12,p:{zoom:2.4}}],
   ['kaleido',{name:'Petals',p:{segments:12,spin:.15,shift:.25}}],
   ['feedback',{name:'Echo',p:{decay:.9,zoom:1.6,rot:.8,drift:1.5}}],
   ['grade',{name:'Colors',p:{sat:1.3,contrast:1.15}}]],
  macros:[{l:'Petals',t:[[1,'p.segments',3,24]]},{l:'Echo',t:[[2,'p.decay',.5,.97]]},{l:'Flow',t:[[0,'p.speed',0,3]]},{l:'Color',t:[[0,'n.hue',-.5,.5]]}]},
 {n:'Sarki fény',desc:'A rippling curtain of light under a starry sky.',layers:[
   ['gradient',{name:'Night',pal:7,r:90,p:{span:.3,mode:0}}],
   ['aurora',{name:'Light curtain',blend:'screen',pal:6}],
   ['glow',{name:'Glow',p:{amount:.7,thresh:.25}}]],
  macros:[{l:'Height',t:[[1,'p.height',0,1]]},{l:'Light',t:[[1,'p.glow',.2,2.5]]},{l:'Speed',t:[[1,'p.speed',0,2.5]]}]},
 {n:'Kristály',desc:'An iridescent octahedron with rainbow refraction.',layers:[
   ['gradient',{name:'Background',pal:7,p:{span:.5}}],
   ['obj3d',{name:'Crystal',pal:13,p:{shape:3,material:0,floor:.6,spin:.35,rx:15,glow:1.2}}],
   ['chroma',{name:'Refraction',p:{amount:1.2}}],
   ['glow',{name:'Glow',p:{amount:1,thresh:.4}}]],
  macros:[{l:'Size',t:[[1,'n.s',.4,1.6]]},{l:'Rotation',t:[[1,'p.spin',0,1.5]]},{l:'Rainbow',t:[[2,'p.amount',0,3]]},{l:'Distortion',t:[[1,'p.displace',0,1]]}]},
 {n:'Merkaba',desc:'A holographic star tetrahedron on a sacred-geometry background.',layers:[
   ['sacred',{name:'Geometry',pal:9,opacity:.4,p:{radius:.3}}],
   ['obj3d',{name:'Merkaba',pal:9,p:{shape:4,material:3,spin:.4,rx:10,glow:1.4}}],
   ['glow',{name:'Glow',p:{amount:1.1,thresh:.25}}]],
  macros:[{l:'Size',t:[[1,'n.s',.4,1.6]]},{l:'Rotation',t:[[1,'p.spin',0,1.5]]},{l:'Geometry',t:[[0,'n.opacity',0,1]]},{l:'Light',t:[[2,'p.amount',0,2.5]]}]},
 {n:'Hipertér-ugrás',desc:'Star streaks, a gyroid passage and swirling space.',layers:[
   ['hyper',{name:'Star streaks',pal:3,p:{count:80}}],
   ['gyroid',{name:'Passage',blend:'add',opacity:.55,pal:12}],
   ['swirl',{name:'Vortex',p:{amount:1,radius:.6,speed:.6}}],
   ['chroma',{name:'Aberration',p:{amount:1.4}}]],
  macros:[{l:'Speed',t:[[0,'p.speed',0,4],[1,'p.speed',0,2]]},{l:'Vortex',t:[[2,'p.amount',-4,4]]},{l:'Passage',t:[[1,'n.opacity',0,1]]}]},
 {n:'Neon horizont',desc:'A retro-futuristic grid field above fog.',layers:[
   ['nebula',{name:'Fog',pal:7}],
   ['grid',{name:'Grid',blend:'screen',key:.6,pal:5}],
   ['glitch',{name:'Glitch',p:{amount:.3,rate:.6}}],
   ['glow',{name:'Glow',p:{amount:.7,thresh:.4}}]],
  macros:[{l:'Speed',t:[[1,'p.speed',0,4]]},{l:'Horizon',t:[[1,'p.horizon',-.4,.6]]},{l:'Glitch',t:[[2,'p.amount',0,1.5]]}]},
 {n:'Blob-követés',desc:'Floating lava blobs in black and white, with tracking frames, labels and an inverted interior.',layers:[
   ['lava',{name:'Drops',pal:9,p:{count:9,size:.16,speed:.8}}],
   ['grade',{name:'Black and white',p:{sat:0,contrast:1.3}}],
   ['blob',{name:'Tracking',p:{source:0,detect:0,thresh:.5,count:12,sizemode:0,sizemul:1.15,style:0,label:7,link:2,inside:1}}],
   ['film',{name:'Film',p:{grain:.4,scan:.2}}]],
  macros:[{l:'Count',t:[[2,'p.count',1,30]]},{l:'Threshold',t:[[2,'p.thresh',.1,.95]]},{l:'Lines',t:[[2,'p.linkalpha',0,1]]},{l:'Jitter',t:[[2,'p.jitter',0,1]]}]},
 {n:'Csillagtérkép',desc:'A rotating galaxy whose brightest stars are followed by crosshairs and a network.',layers:[
   ['galaxy',{name:'Galaxy',pal:9}],
   ['blob',{name:'Star tracking',p:{source:0,detect:1,style:3,count:24,spacing:8,thresh:.45,link:3,linkdist:.35,label:2,fsize:9,color:'#9fe8ff',box:.045}}]],
  macros:[{l:'Points',t:[[1,'p.count',4,60]]},{l:'Network',t:[[1,'p.linkdist',.05,.8]]},{l:'Threshold',t:[[1,'p.thresh',.1,.9]]},{l:'Rotation',t:[[0,'p.speed',0,1.5]]}]},
 {n:'Galaxis',desc:'A spiral galaxy in front of a nebula.',layers:[
   ['nebula',{name:'Fog',pal:7,p:{bright:.25,stars:.6}}],
   ['galaxy',{name:'Galaxy',blend:'screen',pal:12}],
   ['glow',{name:'Glow',p:{amount:.8,thresh:.3}}]],
  macros:[{l:'Arms',t:[[1,'p.branches',2,8]]},{l:'Twist',t:[[1,'p.twist',-2,3]]},{l:'Rotation',t:[[1,'p.speed',0,1.5]]},{l:'Core',t:[[1,'p.core',0,3]]}]},
 {n:'Részecskehullám',desc:'An endless rippling field of points in the night.',layers:[
   ['gradient',{name:'Sky',pal:7,r:90,p:{span:.2,mode:0}}],
   ['waves',{name:'Points',blend:'add',pal:14}],
   ['glow',{name:'Glow',p:{amount:.9,thresh:.2}}],
   ['film',{name:'Film',p:{grain:.3,scan:0}}]],
  macros:[{l:'Waves',t:[[1,'p.amp',0,3]]},{l:'Density',t:[[1,'p.density',.3,3]]},{l:'Speed',t:[[1,'p.speed',0,3]]},{l:'Light',t:[[2,'p.amount',0,2.5]]}]},
 {n:'Lávalámpa',desc:'Warm-colored blobs slowly merging.',layers:[
   ['gradient',{name:'Background',pal:2,p:{span:.4}}],
   ['lava',{name:'Lava',pal:15}],
   ['glow',{name:'Glow',p:{amount:.8,thresh:.35}}],
   ['grade',{name:'Colors',p:{sat:1.2}}]],
  macros:[{l:'Drops',t:[[1,'p.count',3,12]]},{l:'Size',t:[[1,'p.size',.05,.35]]},{l:'Flow',t:[[1,'p.speed',0,3]]},{l:'Softness',t:[[1,'p.soft',0,.9]]}]},
 {n:'Metagömbök',desc:'Iridescent spheres melting into each other, after the three.js marching cubes example.',layers:[
   ['gradient',{name:'Background',pal:7,p:{span:.5}}],
   ['obj3d',{name:'Metaballs',pal:13,p:{shape:9,material:10,floor:.5,glow:1.2,spin:.2}}],
   ['glow',{name:'Glow',p:{amount:.9,thresh:.4}}]],
  macros:[{l:'Size',t:[[1,'n.s',.4,1.6]]},{l:'Tempo',t:[[1,'p.speed',0,2]]},{l:'Light',t:[[1,'p.glow',0,3]]},{l:'Distortion',t:[[1,'p.displace',0,1]]}]},
 {n:'Tóruszcsomó',desc:'The classic three.js torus knot in polished chrome, under studio light with a shadow.',layers:[
   ['gradient',{name:'Background',pal:7,p:{span:.4}}],
   ['obj3d',{name:'Torus knot',pal:0,p:{shape:6,material:4,rough:.2,floor:.6,rx:30,spin:.4}}],
   ['glow',{name:'Glow',p:{amount:.6,thresh:.5}}]],
  macros:[{l:'Size',t:[[1,'n.s',.4,1.6]]},{l:'Rotation',t:[[1,'p.spin',0,1.5]]},{l:'Twisting',t:[[1,'p.twist',-2,2]]},{l:'Light',t:[[1,'p.glow',0,3]]}]},
 {n:'ASCII-látomás',desc:'A wormhole built from characters, in matrix green.',layers:[
   ['tunnel',{name:'Tunnel',pal:0}],
   ['ascii',{name:'ASCII',p:{mode:2,size:10}}],
   ['film',{name:'Film',p:{grain:.2,scan:.4}}]],
  macros:[{l:'Character size',t:[[1,'p.size',5,24]]},{l:'Contrast',t:[[1,'p.contrast',.5,2.5]]},{l:'Speed',t:[[0,'p.speed',0,2]]}]},
 {n:'Lencsefény',desc:'A strong light source with rays and ghosts in front of a nebula.',layers:[
   ['nebula',{name:'Fog',pal:7,p:{bright:.5}}],
   ['flare',{name:'Light source',blend:'add',pal:1,x:.45,y:.25}],
   ['chroma',{name:'Aberration',p:{amount:.6}}]],
  macros:[{l:'Brightness',t:[[1,'p.size',.3,2.5]]},{l:'Rays',t:[[1,'p.rays',0,12]]},{l:'Ghosts',t:[[1,'p.ghosts',0,2]]}]},
 {n:'Féltónus-pop',desc:'Liquid marble in printed halftone dots.',layers:[
   ['liquid',{name:'Marble',pal:3}],
   ['halftone',{name:'Halftone',p:{mode:0,size:10}}]],
  macros:[{l:'Dot size',t:[[1,'p.size',4,30]]},{l:'Angle',t:[[1,'p.angle',-1.5,1.5]]},{l:'Flow',t:[[0,'p.speed',0,3]]}]},
 {n:'Sejtszövet',desc:'Living, glowing Voronoi cells.',layers:[
   ['cells',{name:'Cells',pal:6}],
   ['glow',{name:'Glow',p:{amount:.7,thresh:.3}}]],
  macros:[{l:'Cell size',t:[[0,'p.zoom',1,12]]},{l:'Speed',t:[[0,'p.speed',0,3]]},{l:'Edge glow',t:[[0,'p.glow',0,3]]}]},
 {n:'Pixelvilág',desc:'A fractal flower as retro pixel art, with dithering.',layers:[
   ['kali',{name:'Fractal',pal:5}],
   ['pixelart',{name:'Pixel art',p:{size:6,levels:5,dither:.6}}]],
  macros:[{l:'Pixel size',t:[[1,'p.size',1,24]]},{l:'Color levels',t:[[1,'p.levels',2,12]]},{l:'Dithering',t:[[1,'p.dither',0,1]]}]},
 {n:'Stúdió-szobor',desc:'A clay merkaba in studio light with a soft shadow, in a modern product-photo mood.',layers:[
   ['gradient',{name:'Background',pal:16,p:{span:.35,mode:1}}],
   ['obj3d',{name:'Sculpture',pal:12,p:{shape:4,material:9,rough:.8,detail:.35,floor:.8,rx:15,spin:.25}}]],
  macros:[{l:'Size',t:[[1,'n.s',.4,1.6]]},{l:'Rotation',t:[[1,'p.spin',0,1.2]]},{l:'Texture',t:[[1,'p.detail',0,1]]},{l:'Shadow',t:[[1,'p.floor',0,1]]}]},
 {n:'Gyöngy',desc:'A pearlescent sphere in neon light with a fine surface texture.',layers:[
   ['gradient',{name:'Background',pal:14,p:{span:.3}}],
   ['obj3d',{name:'Pearl',pal:17,p:{shape:0,material:10,env:3,rough:.25,detail:.2,floor:.5,glow:.4}}],
   ['texture',{name:'Grain',p:{mode:4,amount:.15}}]],
  macros:[{l:'Size',t:[[1,'n.s',.4,1.6]]},{l:'Roughness',t:[[1,'p.rough',0,1]]},{l:'Distortion',t:[[1,'p.displace',0,1]]}]},
 {n:'Szaturnusz napnyugtakor',cat:'world',desc:'A ringed gas giant lit from the side, in front of a starry sky.',layers:[
   ['space',{name:'Sky',pal:7,p:{mw:.6,nebula:.2,seed:42}}],
   ['planet',{name:'Gas giant',p:{ptype:2,seed:21,radius:.27,ring:.9,ringtilt:14,sunang:150,sunh:.1,atmocol:'#ffb070',clouds:0}}]],
  macros:[{l:'Size',t:[[1,'p.radius',.1,.5]]},{l:'Ring',t:[[1,'p.ring',0,1]]},{l:'Sun direction',t:[[1,'p.sunang',-180,180]]},{l:'Atmosphere',t:[[1,'p.atmo',0,2]]}]},
 {n:'Óceánbolygó holddal',cat:'world',desc:'A cloudy ocean world and a cratered moon.',layers:[
   ['space',{name:'Sky',pal:14,p:{mw:1,seed:8}}],
   ['planet',{name:'Ocean planet',x:-.25,p:{ptype:1,seed:7,radius:.33,sunang:30,lights:.8}}],
   ['planet',{name:'Moon',x:.62,y:.25,p:{ptype:0,seed:3,radius:.06,atmo:0,clouds:0,craters:1,sunang:30}}]],
  macros:[{l:'Size',t:[[1,'p.radius',.12,.55]]},{l:'Cloud cover',t:[[1,'p.clouds',0,1]]},{l:'Sun direction',t:[[1,'p.sunang',-180,180],[2,'p.sunang',-180,180]]},{l:'City lights',t:[[1,'p.lights',0,2]]}]},
 {n:'Jégvilág',cat:'world',desc:'A bluish ice planet in cold fog.',layers:[
   ['space',{name:'Fog',pal:9,p:{nebula:1,mw:.4,seed:17}}],
   ['planet',{name:'Ice world',p:{ptype:3,seed:5,atmocol:'#bfe6ff',clouds:.3,radius:.32}}]],
  macros:[{l:'Size',t:[[1,'p.radius',.12,.55]]},{l:'Fog',t:[[0,'p.nebula',0,2]]},{l:'Sun direction',t:[[1,'p.sunang',-180,180]]}]},
 {n:'Lávabolygó',cat:'world',desc:'A world covered in glowing cracks, in red fog.',layers:[
   ['space',{name:'Fog',pal:15,p:{nebula:1.2,mw:.2,seed:66}}],
   ['planet',{name:'Lava planet',p:{ptype:4,seed:13,atmo:.6,atmocol:'#ff6a2a',clouds:0,sunang:150,radius:.3}}],
   ['glow',{name:'Glow',p:{amount:.8,thresh:.4}}]],
  macros:[{l:'Size',t:[[1,'p.radius',.12,.55]]},{l:'Ember glow',t:[[2,'p.amount',0,2.5]]},{l:'Sun direction',t:[[1,'p.sunang',-180,180]]}]},
 {n:'Csillagközi tájkép',cat:'world',desc:'A giant planet on the horizon, a distant moon and a light source under the Milky Way.',layers:[
   ['space',{name:'Milky Way',pal:12,p:{mw:1.3,mwtilt:-15,seed:5}}],
   ['planet',{name:'Horizon planet',y:-.95,p:{ptype:2,seed:40,radius:.8,sunang:90,sunh:.5,clouds:0,atmocol:'#8fb8ff'}}],
   ['planet',{name:'Moon',x:.55,y:.2,p:{ptype:3,seed:2,radius:.05,atmo:.3,clouds:0}}],
   ['flare',{name:'Star',blend:'add',pal:1,x:-.6,y:.3,p:{size:.6,ghosts:.6}}]],
  macros:[{l:'Milky Way',t:[[0,'p.mw',0,2]]},{l:'Planet size',t:[[1,'p.radius',.4,1.2]]},{l:'Light',t:[[3,'p.size',.2,1.5]]}]},
 {n:'Cinematic cím',cat:'motion',desc:'A title that sharpens letter by letter, with a warm gradient, over a bokeh background with a light orb.',layers:[
   ['bokeh',{name:'Bokeh',pal:15,p:{count:22,bright:.7}}],
   ['shape',{name:'Light orb',blend:'screen',opacity:.45,pal:15,y:.03,p:{kind:0,size:.28,soft:1,fill:1}}],
   ['mtext',{name:'Title',s:.24}],
   ['mtext',{name:'Kicker',y:.27,s:.06,text:{str:'New chapter',font:'Instrument Sans',weight:'600',track:.02},p:{anim:1,fill:0,color1:'#f3eee9',start:0,stagger:.03}}]],
  macros:[{l:'Start',t:[[2,'p.start',0,3]]},{l:'Tempo',t:[[2,'p.dur',2,.2]]},{l:'Delay',t:[[2,'p.stagger',0,.2]]},{l:'Bokeh',t:[[0,'p.bright',0,2]]}]},
 {n:'Kiolvasó felirat',cat:'motion',desc:'Light, restrained text with a readout sweeping across it.',layers:[
   ['gradient',{name:'Background',pal:16,hue:.5,p:{span:.05,speed:0}}],
   ['mtext',{name:'Caption',s:.11,text:{str:'Motion is born from a raw idea…',font:'Instrument Sans',weight:'600',track:-.01},p:{amount:.4,fill:0,color1:'#26221f',shimmer:2,shimspeed:.6}}]],
  macros:[{l:'Readout tempo',t:[[1,'p.shimspeed',.1,2]]},{l:'Size',t:[[1,'n.s',.05,.25]]}]},
 {n:'Belépő világ',cat:'motion',desc:'A planet entering with a blur zoom, then a sliding-up title.',layers:[
   ['space',{name:'Sky',pal:7,p:{mw:.8,seed:4}}],
   ['planet',{name:'Planet',p:{ptype:1,seed:77,radius:.28,sunang:40}}],
   ['reveal',{name:'Entrance',p:{mode:1,dur:1.6,ease:1}}],
   ['mtext',{name:'Title',y:-.36,s:.09,text:{str:'NEW WORLD',font:'Unbounded',weight:'700',track:.12},p:{anim:2,start:1.2,stagger:.05,fill:0,color1:'#ffffff',ease:1}}]],
  macros:[{l:'Transition length',t:[[2,'p.dur',.3,4]]},{l:'Title start',t:[[3,'p.start',0,4]]},{l:'Planet size',t:[[1,'p.radius',.12,.5]]}]},
 {n:'Részecske-lélek',cat:'motion',desc:'A caption that breaks apart into floating particles.',layers:[
   ['text',{name:'Text',s:.24,pal:11,text:{str:'SOUL',font:'Cinzel',weight:'700',track:.2}}],
   ['particles',{name:'Particles',pal:11,p:{swirl:.5,depth:.3,size:2.2,color:1,density:1}}],
   ['glow',{name:'Glow',p:{amount:.9,thresh:.15}}]],
  macros:[{l:'Flow',t:[[1,'p.swirl',0,2]]},{l:'Scatter',t:[[1,'p.explode',0,1.5]]},{l:'Point size',t:[[1,'p.size',.8,5]]},{l:'Light',t:[[2,'p.amount',0,2.5]]}]},
 {n:'Ütemre robbanó mag',cat:'motion',desc:'An orb of particles that bursts apart on every beat. Load music with the Audio button.',layers:[
   ['shape',{name:'Core',pal:13,p:{kind:0,size:.22,soft:.4,fill:1}}],
   ['particles',{name:'Particles',pal:13,p:{explode:{v:.02,s:'b:beat',sa:.12},swirl:.3,size:1.6,color:1,hidesrc:0,thresh:.15}}],
   ['glow',{name:'Glow',p:{amount:1,thresh:.15}}]],
  macros:[{l:'Size',t:[[0,'p.size',.08,.4]]},{l:'Flow',t:[[1,'p.swirl',0,2]]},{l:'Light',t:[[2,'p.amount',0,2.5]]}]},
 {n:'SDF-szobor',desc:'An editable 3D scene: a melted sphere and torus with a hollowed cavity, in clay. Open it and shape the objects.',layers:[
   ['gradient',{name:'Background',pal:16,p:{span:.35,mode:1}}],
   ['sdfscene',{name:'Sculpture',pal:12}]],
  macros:[{l:'Size',t:[[1,'n.s',.4,1.6]]},{l:'Rotation',t:[[1,'p.spin',0,1]]},{l:'Roughness',t:[[1,'p.rough',0,1]]},{l:'Shadow',t:[[1,'p.floor',0,1]]}]},
 {n:'Kristálytorony',desc:'Octahedra fused onto each other in iridescent material, under cosmic light.',layers:[
   ['space',{name:'Sky',pal:12,p:{mw:.6,nebula:.8}}],
   ['sdfscene',{name:'Tower',pal:13,p:{material:3,env:2,rough:.2,floor:0,spin:.3},prims:[{t:5,op:0,x:0,y:.35,z:0,sx:.35,sy:.35,sz:.35,rx:0,ry:0,k:.12,c:.2},{t:5,op:0,x:0,y:-.15,z:0,sx:.5,sy:.5,sz:.5,rx:0,ry:45,k:.15,c:.5},{t:3,op:0,x:0,y:-.6,z:0,sx:.18,sy:.25,sz:.18,rx:0,ry:0,k:.2,c:.8}]}]],
  macros:[{l:'Size',t:[[1,'n.s',.4,1.6]]},{l:'Rotation',t:[[1,'p.spin',0,1]]},{l:'Fog',t:[[0,'p.nebula',0,2]]}]},
 {n:'Bliss-dombok',cat:'world',desc:'Sky color, sun, cumulus clouds and two hill lines with grassy ground and atmospheric haze between them. The Time of day macro moves every piece together.',layers:[
   ['skygrad',{name:'Sky color',p:{sunh:.7,sunx:.35,glow:.6}}],
   ['sun',{name:'Sun',blend:'screen',p:{sunh:.7,sunx:.35}}],
   ['clouds',{name:'Clouds',p:{ctype:0,cover:.58,sunh:.7,sunx:.35,seed:42}}],
   ['shape',{name:'Distant hill line',maskOnly:true,y:-.13,p:{kind:13,size:.07,sides:5,inner:.62,round:0}}],
   ['terrain',{name:'Distant ground',clip:true,p:{sunh:.7,color:'#5a9a45',detail:.5,shade:.3}}],
   ['haze',{name:'Haze',p:{amount:.3,sunh:.7,sunx:.35,spread:.07}}],
   ['shape',{name:'Near hill line',maskOnly:true,y:-.24,p:{kind:13,size:.14,sides:6,inner:.21,round:0}}],
   ['terrain',{name:'Near ground',clip:true,p:{sunh:.7,color:'#3f8f2a'}}]],
  macros:[{l:'Time of day',t:[[0,'p.sunh',-.2,1],[1,'p.sunh',-.2,1],[2,'p.sunh',-.2,1],[4,'p.sunh',-.2,1],[5,'p.sunh',-.2,1],[7,'p.sunh',-.2,1]]},
   {l:'Sun position',t:[[0,'p.sunx',-1,1],[1,'p.sunx',-1,1],[2,'p.sunx',-1,1],[5,'p.sunx',-1,1]]},
   {l:'Clouds',t:[[2,'p.cover',0,1]]},{l:'Wind',t:[[2,'p.wind',0,2],[4,'p.wind',0,2],[7,'p.wind',0,2]]},
   {l:'Hills',t:[[3,'p.size',.02,.18],[6,'p.size',.04,.3]]},{l:'Haze',t:[[5,'p.amount',0,1]]}]},
 {n:'Arany naplemente',cat:'world',desc:'A low sun with veil clouds, light rays and lens flare over dry grassy hills. The Time of day macro aligns the rays and the flare with the sun too.',layers:[
   ['skygrad',{name:'Sky color',p:{sunh:.06,sunx:.15,glow:1.4}}],
   ['sun',{name:'Sun',blend:'screen',p:{sunh:.06,sunx:.15,corona:1.6,size:.03}}],
   ['clouds',{name:'Veil clouds',p:{ctype:1,cover:.55,sunh:.06,sunx:.15,seed:8}}],
   ['radial',{name:'Light rays',x:.1125,y:-.097,p:{amount:.9,length:1.4,thresh:.45}}],
   ['shape',{name:'Distant hill line',maskOnly:true,y:-.15,p:{kind:13,size:.06,sides:5,inner:.5,round:0}}],
   ['terrain',{name:'Distant ground',clip:true,p:{ttype:1,color:'#3a4a22',sunh:.06,detail:.6}}],
   ['haze',{name:'Haze',p:{amount:.5,sunh:.06,sunx:.15,spread:.08}}],
   ['shape',{name:'Near hill line',maskOnly:true,y:-.27,p:{kind:13,size:.12,sides:6,inner:.4,round:0}}],
   ['terrain',{name:'Near ground',clip:true,p:{ttype:1,color:'#2a3a18',sunh:.06}}],
   ['flare',{name:'Lens flare',blend:'add',pal:1,x:.1125,y:-.097,p:{size:.5,rays:0,ghosts:.5,streak:.6,ring:.3}}]],
  macros:[{l:'Time of day',t:[[0,'p.sunh',-.2,.5],[1,'p.sunh',-.2,.5],[2,'p.sunh',-.2,.5],[5,'p.sunh',-.2,.5],[6,'p.sunh',-.2,.5],[8,'p.sunh',-.2,.5],[3,'n.y',-.24,.145],[9,'n.y',-.24,.145]]},
   {l:'Rays',t:[[3,'p.amount',0,2]]},{l:'Clouds',t:[[2,'p.cover',0,1]]},{l:'Lens flare',t:[[9,'n.opacity',0,1]]}]},
 {n:'Viharos ég',cat:'world',desc:'Dark storm clouds and fast layered clouds over rocky mountains, with gray haze.',layers:[
   ['skygrad',{name:'Sky color',p:{sunh:.3,sunx:-.3,sat:.3,glow:.3}}],
   ['clouds',{name:'Storm clouds',p:{ctype:3,cover:.66,sunh:.3,sunx:-.3,seed:21,wind:.8,bright:.85}}],
   ['clouds',{name:'Layered clouds',opacity:.6,p:{ctype:2,cover:.35,sunh:.3,sunx:-.3,seed:5,wind:1.2,bright:.6}}],
   ['shape',{name:'Mountain line',maskOnly:true,y:-.14,p:{kind:13,size:.09,sides:8,inner:.44,round:.6}}],
   ['terrain',{name:'Rock',clip:true,p:{ttype:3,color:'#3d4540',sunh:.3}}],
   ['haze',{name:'Haze',p:{amount:.55,cmode:1,color:'#7d8790',spread:.1,low:.15}}],
   ['shape',{name:'Near hill line',maskOnly:true,y:-.27,p:{kind:13,size:.1,sides:5,inner:.7,round:0}}],
   ['terrain',{name:'Near ground',clip:true,p:{ttype:0,color:'#2c3a2a',sunh:.3}}],
   ['grade',{name:'Colors',p:{sat:.8,contrast:1.15}}]],
  macros:[{l:'Storm',t:[[1,'p.cover',.4,1],[2,'p.cover',0,.8]]},{l:'Wind',t:[[1,'p.wind',0,2.5],[2,'p.wind',0,3]]},{l:'Haze',t:[[5,'p.amount',0,1]]},
   {l:'Time of day',t:[[0,'p.sunh',-.2,.8],[1,'p.sunh',-.2,.8],[2,'p.sunh',-.2,.8],[4,'p.sunh',-.2,.8],[7,'p.sunh',-.2,.8]]}]},
 {n:'Éjszakai égbolt',cat:'world',desc:'The Milky Way, the moon and moonlit veil clouds over dark hill silhouettes.',layers:[
   ['skygrad',{name:'Sky color',p:{sunh:-.25,glow:0}}],
   ['space',{name:'Stars',blend:'screen',opacity:.9,pal:14,p:{mw:.9,nebula:.15,dust:.8,bright:.35,seed:12,mwtilt:35}}],
   ['planet',{name:'Moon',x:.55,y:.28,p:{ptype:0,seed:3,radius:.045,atmo:0,clouds:0,craters:1,sunang:20}}],
   ['clouds',{name:'Veil clouds',p:{ctype:1,cover:.3,sunh:-.25,seed:4,bright:1.4}}],
   ['shape',{name:'Distant hill line',maskOnly:true,y:-.16,p:{kind:13,size:.09,sides:5,inner:.3,round:0}}],
   ['terrain',{name:'Distant ground',clip:true,p:{color:'#1c2a1e',sunh:-.25}}],
   ['haze',{name:'Haze',p:{amount:.3,sunh:-.25,spread:.09,cmode:1,color:'#1b2440'}}],
   ['shape',{name:'Near hill line',maskOnly:true,y:-.28,p:{kind:13,size:.12,sides:6,inner:.8,round:0}}],
   ['terrain',{name:'Near ground',clip:true,p:{color:'#121a14',sunh:-.25}}]],
  macros:[{l:'Stars',t:[[1,'n.opacity',0,1]]},{l:'Milky Way',t:[[1,'p.mw',0,2]]},{l:'Moon size',t:[[2,'p.radius',.02,.12]]},{l:'Clouds',t:[[3,'p.cover',0,1]]}]},
 {n:'Sivatag délben',cat:'world',desc:'Sand dunes in blinding sunlight, with hot haze on the horizon.',layers:[
   ['skygrad',{name:'Sky color',p:{sunh:.85,sunx:-.2,sat:.85}}],
   ['sun',{name:'Sun',blend:'screen',p:{sunh:.85,sunx:-.2,size:.022}}],
   ['clouds',{name:'Veil clouds',p:{ctype:1,cover:.25,sunh:.85,sunx:-.2,seed:31}}],
   ['shape',{name:'Distant dunes',maskOnly:true,y:-.13,p:{kind:13,size:.09,sides:4,inner:.8,round:.3}}],
   ['terrain',{name:'Distant sand',clip:true,p:{ttype:2,color:'#b98552',sunh:.85,detail:.8,shade:.8}}],
   ['haze',{name:'Heat haze',p:{amount:.3,spread:.05,sunh:.85,sunx:-.2,cmode:1,color:'#e9d6b8'}}],
   ['shape',{name:'Near dunes',maskOnly:true,y:-.27,p:{kind:13,size:.16,sides:5,inner:.33,round:.3}}],
   ['terrain',{name:'Near sand',clip:true,p:{ttype:2,color:'#d9a061',sunh:.85,shade:.8}}]],
  macros:[{l:'Time of day',t:[[0,'p.sunh',-.2,1],[1,'p.sunh',-.2,1],[2,'p.sunh',-.2,1],[4,'p.sunh',-.2,1],[7,'p.sunh',-.2,1]]},{l:'Dunes',t:[[3,'p.size',.02,.15],[6,'p.size',.04,.25]]},{l:'Heat haze',t:[[5,'p.amount',0,1]]}]},
 {n:'Havas csúcsok',cat:'world',desc:'Sharp snowy peaks with layered clouds and a hazy valley.',layers:[
   ['skygrad',{name:'Sky color',p:{sunh:.5,sunx:.5}}],
   ['sun',{name:'Sun',blend:'screen',p:{sunh:.5,sunx:.5}}],
   ['clouds',{name:'Layered clouds',p:{ctype:2,cover:.35,sunh:.5,sunx:.5,seed:9}}],
   ['shape',{name:'Peaks',maskOnly:true,y:-.02,p:{kind:13,size:.22,sides:7,inner:.5,round:.85}}],
   ['terrain',{name:'Snow',clip:true,p:{ttype:4,sunh:.5,shade:.8,detail:1.2}}],
   ['haze',{name:'Haze',p:{amount:.5,spread:.12,sunh:.5,sunx:.5}}],
   ['shape',{name:'Near ridge',maskOnly:true,y:-.22,p:{kind:13,size:.16,sides:5,inner:.13,round:.7}}],
   ['terrain',{name:'Rock',clip:true,p:{ttype:3,color:'#5a6a70',sunh:.5}}]],
  macros:[{l:'Time of day',t:[[0,'p.sunh',-.2,1],[1,'p.sunh',-.2,1],[2,'p.sunh',-.2,1],[4,'p.sunh',-.2,1],[5,'p.sunh',-.2,1],[7,'p.sunh',-.2,1]]},{l:'Peaks',t:[[3,'p.size',.05,.35]]},{l:'Haze',t:[[5,'p.amount',0,1]]},{l:'Clouds',t:[[2,'p.cover',0,1]]}]},
 {n:'Bento-bemutató',cat:'motion',desc:'A glass Bento grid with boxes popping up on springs, a title sliding up masked inside the big box, and spring captions below.',layers:[
   ['gradient',{name:'Background',pal:7,p:{span:.25}}],
   ['bokeh',{name:'Lights',pal:15,opacity:.55,p:{count:18,bright:.6}}],
   ['bento',{name:'Bento grid',p:{layout:2,anim:1,fill:1,start:.2,stagger:.1,ease:5,sheen:.4}}],
   ['mtext',{name:'Title',y:.18,s:.085,text:{str:'Motion that breathes',font:'Bricolage Grotesque',weight:'800',track:-.01},p:{anim:2,start:.7,stagger:.03,ease:5,fill:0,color1:'#f4f1ee'}}],
   ['mtext',{name:'Label 1',x:-.5,y:-.25,s:.045,text:{str:'01 · Spring',font:'Instrument Sans',weight:'600',track:.02},p:{anim:9,start:.95,stagger:.02,ease:6,fill:0,color1:'#d9d4cf'}}],
   ['mtext',{name:'Label 2',x:0,y:-.25,s:.045,text:{str:'02 · Ritmus',font:'Instrument Sans',weight:'600',track:.02},p:{anim:9,start:1.05,stagger:.02,ease:6,fill:0,color1:'#d9d4cf'}}],
   ['mtext',{name:'Label 3',x:.5,y:-.25,s:.045,text:{str:'03 · Light',font:'Instrument Sans',weight:'600',track:.02},p:{anim:9,start:1.15,stagger:.02,ease:6,fill:0,color1:'#d9d4cf'}}]],
  macros:[{l:'Tempo',t:[[2,'p.dur',2,.3]]},{l:'Delay',t:[[2,'p.stagger',0,.3]]},{l:'Rounding',t:[[2,'p.round',0,.12]]},{l:'Gap',t:[[2,'p.gap',0,.08]]}]},
 {n:'Bento-átrendeződés',cat:'motion',desc:'A palette mosaic that opens from the center, then springs into three columns.',layers:[
   ['gradient',{name:'Background',pal:7,p:{span:.2}}],
   ['bento',{name:'Bento grid',pal:12,p:{layout:5,layout2:4,morphAt:2.2,morphDur:1.2,fill:2,anim:0,order:1,round:.05,ease:5,shadow:.7,sheen:.5}}]],
  macros:[{l:'Rearrangement time',t:[[1,'p.morphAt',.5,6]]},{l:'Rounding',t:[[1,'p.round',0,.12]]},{l:'Gap',t:[[1,'p.gap',0,.08]]},{l:'Tempo',t:[[1,'p.dur',2,.3],[1,'p.morphDur',2.5,.3]]}]},
 {n:'Szerkesztői címlap (soronként)',cat:'motion',desc:'Canvas-filling typography in mixed sizes (inspired by image 4): every line has its own size, indent and spacing and slides in masked line by line. Adjust the lines on the canvas with the handles at their start. The text can be rewritten.',layers:[
   ['gradient',{name:'Background',pal:17,p:{span:.5,speed:0,mode:1}}],
   ['mtext',{name:'Cover',x:-.62,s:.22,text:{str:'TIME\nis not a line,\nbut a\nWAVE.',font:'Bricolage Grotesque',weight:'800',track:-.02,align:'left',lh:1.02,
     lines:[{size:1.5},{size:.62,dx:.35,weight:'400',italic:true,gap:.05},{size:.62,dx:.35,weight:'400'},{size:1.75,gap:.08}]},
     p:{anim:2,unit:2,order:0,start:.3,dur:.7,stagger:.35,ease:5,fill:0,color1:'#141216'}}]]},
 {n:'The End (vintage)',cat:'motion',desc:'Newsreel closing shot: the caption pops in with a size and focus pop, jitters hand-drawn at 12 fps, with sepia projector dust, scratches and light leaks.',layers:[
   ['gradient',{name:'Paper',pal:17,p:{span:.35,speed:0,mode:1}}],
   ['mtext',{name:'The End',s:.2,tm:{in:0,inAt:0,inDur:.8,out:0,outAt:9,outDur:.8,ease:0,fps:12},text:{str:'The End',font:'Bodoni Moda',weight:'500',track:.02},p:{anim:7,stagger:0,start:.6,dur:.45,ease:6,fill:0,color1:'#16130f',boil:.55,boilfps:10}}],
   ['mtext',{name:'Subtitle',y:-.2,s:.035,tm:{in:0,inAt:0,inDur:.8,out:0,outAt:9,outDur:.8,ease:0,fps:12},text:{str:'VEL STUDIO · MMXXVI',font:'Instrument Sans',weight:'600',track:.25},p:{anim:8,stagger:0,start:1.6,fill:0,color1:'#2a2622',boil:.4,boilfps:10}}],
   ['projector',{name:'Projector',p:{tone:1,dust:.7,leak:.45,flicker:.45,weave:.5,shake:.35,grain:.45,vig:.6,fps:12}}]],
  macros:[{l:'Dust and scratches',t:[[3,'p.dust',0,1]]},{l:'Light leak',t:[[3,'p.leak',0,1]]},{l:'Hand jitter',t:[[1,'p.boil',0,1],[2,'p.boil',0,1]]},{l:'Flicker',t:[[3,'p.flicker',0,1]]}]},
 {n:'Rugós cím',cat:'motion',desc:'A title that springs in letter by letter and stretches while moving, with an underline unfolding from the left.',layers:[
   ['gradient',{name:'Background',pal:12,p:{span:.3}}],
   ['bento',{name:'Underline',y:-.12,p:{layout:8,anim:4,fill:0,color:'#f2a07b',bw:.7,bh:.012,round:.006,gap:0,start:.9,ease:6,shadow:0,outline:0,sheen:0}}],
   ['mtext',{name:'Title',s:.16,y:.02,text:{str:'Pattanj be!',font:'Bricolage Grotesque',weight:'800',track:-.01},p:{anim:9,stagger:.045,ease:6,stretch:.7,start:.2}}]],
  macros:[{l:'Stretch',t:[[2,'p.stretch',0,1]]},{l:'Delay',t:[[2,'p.stagger',0,.15]]},{l:'Start',t:[[2,'p.start',0,3],[1,'p.start',.7,3.7]]}]},
 {n:'Alsó harmad',cat:'motion',desc:'Name caption (lower third): the accent bar and panel unfold from the left, the name slides up masked, the role slides in from the side, then everything closes.',layers:[
   ['gradient',{name:'Background',pal:14,p:{span:.3}}],
   ['bokeh',{name:'Lights',pal:15,opacity:.6,p:{count:20,bright:.7}}],
   ['bento',{name:'Panel',x:-.38,y:-.3,p:{layout:9,anim:4,accent:1,fill:0,color:'#101014',color2:'#f2a07b',bw:.95,bh:.17,round:.012,gap:.012,start:.3,stagger:.12,ease:5,outAt:6,shadow:.6}}],
   ['mtext',{name:'Name',clip:true,x:-.77,y:-.278,s:.05,text:{str:'Jane Doe',font:'Instrument Sans',weight:'700',track:.01,align:'left'},p:{anim:2,start:.75,stagger:.025,ease:5,outAt:5.8,fill:0,color1:'#f4f1ee'}}],
   ['mtext',{name:'Role',clip:true,x:-.77,y:-.335,s:.028,text:{str:'director · Budapest',font:'Instrument Sans',weight:'600',track:.08,align:'left'},p:{anim:10,start:1,stagger:.015,ease:5,outAt:5.8,fill:0,color1:'#f2a07b'}}]],
  macros:[{l:'Appearance',t:[[2,'p.start',0,3],[3,'p.start',.45,3.45],[4,'p.start',.7,3.7]]},{l:'Exit',t:[[2,'p.outAt',2,10],[3,'p.outAt',1.8,9.8],[4,'p.outAt',1.8,9.8]]},{l:'Rounding',t:[[2,'p.round',0,.06]]}]},
 {n:'Bolygó rétegekből',cat:'world',desc:'A ringed ocean planet taken apart: back ring, surface, a separately rotating cloud shell, atmosphere and front ring. Every layer can be adjusted, colored and given effects on its own.',layers:[
   ['space',{name:'Sky',pal:14,p:{mw:.8,seed:23,nebula:.3}}],
   ['planet',{name:'Ring (back)',p:{...PLA,part:4}}],
   ['planet',{name:'Surface',p:{...PLA,part:1}}],
   ['planet',{name:'Cloud shell',p:{...PLA,part:2,cloudspeed:1.4}}],
   ['planet',{name:'Atmosphere',blend:'screen',p:{...PLA,part:3,atmo:1.3}}],
   ['planet',{name:'Ring (front)',p:{...PLA,part:5}}]],
  macros:[{l:'Sun direction',t:[1,2,3,4,5].map(i=>[i,'p.sunang',-180,180])},{l:'Size',t:[1,2,3,4,5].map(i=>[i,'p.radius',.1,.5])},
   {l:'Clouds',t:[[3,'n.opacity',0,1],[3,'p.clouds',.1,1]]},{l:'Atmosphere',t:[[4,'p.atmo',0,2]]},{l:'Ring',t:[[1,'p.ring',0,1],[5,'p.ring',0,1]]}]},
 {n:'Kulcskockás repülés',cat:'motion',desc:'A card that springs in and spins, stops, then steps aside from the caption: keyframes on position, angle and size, with custom curves. Open the Card layer and edit the curves in the Placement section.',layers:[
   ['gradient',{name:'Background',pal:12,p:{span:.3}}],
   ['shape',{name:'Card',pal:15,x:{v:0,k:[{t:.2,v:-1.4,e:6},{t:1.2,v:0,e:5},{t:3,v:0,e:13,bz:[.65,0,.35,1]},{t:3.9,v:-.42}]},
     r:{v:0,k:[{t:.2,v:-28,e:6},{t:1.2,v:0,e:5},{t:3,v:0,e:5},{t:3.9,v:-6}]},s:{v:1,k:[{t:3,v:1,e:5},{t:3.9,v:.78}]},p:{kind:2,size:.22,aspect:1.35,round:.22,fill:1}}],
   ['mtext',{name:'Caption',x:.42,s:.09,text:{str:'Keyframes\nwith spring',font:'Bricolage Grotesque',weight:'800',track:-.01,align:'center',lh:1.05},p:{anim:9,unit:2,start:3.4,stagger:.18,ease:6,stretch:.6,fill:0,color1:'#f4f1ee'}}]],
  macros:[{l:'Caption start',t:[[2,'p.start',1,6]]},{l:'Rounding',t:[[1,'p.round',0,1]]}]},
 {n:'Parallax-repülés',cat:'motion',dur:8,cam:{on:true,n:{x:{v:0,k:[{t:0,v:-.35,e:10},{t:8,v:.35}]},zoom:{v:1,k:[{t:0,v:1,e:3},{t:8,v:1.25}]},focus:{v:0},ap:{v:1.1},f:{v:2.5},roll:{v:0,k:[{t:0,v:-2,e:3},{t:8,v:2}]}}},
  desc:'A 2.5D camera flight: layers sit at different depths, the camera drifts sideways and zooms in. Distant layers move more slowly, and layers far from the focal plane blur. Edit the camera with the Camera button and in the Tracks panel.',layers:[
   ['space',{name:'Stars',pal:14,z:7,s:3,p:{mw:1,nebula:.5,seed:5}}],
   ['planet',{name:'Planet',z:3.5,x:.9,y:.25,p:{ptype:2,seed:21,radius:.3,ring:.85,clouds:0,sunang:140,atmocol:'#ffcf9a'}}],
   ['clouds',{name:'Fog',z:1.4,s:1.6,opacity:.55,p:{persp:1,ctype:1,cover:.45,sunh:-.1,bright:.5,seed:12}}],
   ['mtext',{name:'Title',z:0,s:.14,text:{str:'DEPTH',font:'Unbounded',weight:'700',track:.18},p:{anim:7,stagger:0,start:.6,dur:.6,ease:6,fill:0,color1:'#f4f1ee'}}],
   ['bokeh',{name:'Foreground lights',blend:'screen',z:-1.1,s:1.4,pal:15,opacity:.8,p:{count:14,size:1.6,bright:.9}}]],
  macros:[{l:'Foreground',t:[[4,'n.opacity',0,1]]},{l:'Fog',t:[[2,'n.opacity',0,1]]}]}
];
export function makeRecipe(R){if(R.n==='Liquid Glass · fénykép'){assets[GLASS_PHOTO_ID]=GLASS_PHOTO;}const kids=R.layers.map(([t,o])=>makeLayer(t,o));const g=makeGroup(recipeLabel(R.n),kids,{});g.recipe=R.n;
  g.macros=(R.macros||[]).map(m=>{const mm={l:m.l,t:m.t.map(([i,path,a,b])=>[kids[i].id,path,a,b]),v:0};mm.v=macroRead(g,mm);return mm;});return g;}
