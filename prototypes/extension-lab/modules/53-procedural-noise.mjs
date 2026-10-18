/** Ashima simplex noise adapter with an original fBm composition. */
import { simplex3GLSL } from "../vendor/ashima-simplex3.mjs";
export const noiseGLSL =
  simplex3GLSL +
  `
float labNoise(vec2 p){return .5+.5*snoise(vec3(p,0.));}
float labFbm(vec2 p){float n=0.,a=.5;for(int i=0;i<5;i++){n+=a*labNoise(p);p=p*2.03+vec2(7.1,3.7);a*=.5;}return n;}`;
export const requirements =
  "MIT source and license kept in vendor/; use with the existing shader header after checking helper name collisions";
