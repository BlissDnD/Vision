import { PALS, v3 } from './palettes';

export const VS=`#version 300 es
out vec2 vUv;
void main(){vec2 p=vec2(gl_VertexID==1?3.0:-1.0,gl_VertexID==2?3.0:-1.0);vUv=p*0.5+0.5;gl_Position=vec4(p,0.0,1.0);}`;
export const HEAD=`#version 300 es
precision highp float;
in vec2 vUv; out vec4 o;
uniform vec2 uRes; uniform float uTime; uniform vec2 uOff; uniform float uScale; uniform float uRot; uniform float uPal; uniform float uHue; uniform float uPass;
uniform sampler2D uInput; uniform sampler2D uPrev; uniform sampler2D uImage; uniform vec2 uImgSize; uniform sampler2D uAux; uniform vec4 uAuxInfo; uniform vec4 uAux2;
#define PI 3.14159265359
#define TAU 6.28318530718
mat2 rot(float a){float c=cos(a),s=sin(a);return mat2(c,-s,s,c);}
float hash(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.0-2.0*f);return mix(mix(hash(i),hash(i+vec2(1.0,0.0)),f.x),mix(hash(i+vec2(0.0,1.0)),hash(i+vec2(1.0,1.0)),f.x),f.y);}
float fbm(vec2 p){float v=0.0,a=0.5;mat2 m=mat2(1.6,1.2,-1.2,1.6);for(int i=0;i<5;i++){v+=a*noise(p);p=m*p;a*=0.5;}return v;}
uniform vec3 uPA; uniform vec3 uPB; uniform vec3 uPC; uniform vec3 uPD;
uniform vec3 uG[16]; uniform float uGOn;
vec3 pal(float t){if(uGOn>0.5){float x=1.0-abs(fract((t+uHue)*0.5)*2.0-1.0);float f=x*15.0;int i=int(min(floor(f),14.0));return mix(uG[i],uG[i+1],f-float(i));}return clamp(uPA+uPB*cos(TAU*(uPC*t+uPD+uHue)),0.0,1.0);}
vec2 ASP(){return vec2(uRes.x/uRes.y,1.0);}
vec2 TXUV(vec2 p,float ia){float hb=max(uAux2.w,1.0); float a0=uAuxInfo.z>1.5?1.0:(uAuxInfo.z>0.5?0.0:0.5); return vec2(p.x/(ia*hb)+a0,p.y/hb+0.5);}
vec2 P(){vec2 q=(vUv-0.5)*ASP()-uOff;return rot(-uRot)*q/uScale;}
vec2 toQ(vec2 uv){vec2 q=(uv-0.5)*ASP()-uOff;return rot(-uRot)*q/uScale;}
vec2 toUV(vec2 q){q=rot(uRot)*(q*uScale);return (q+uOff)/ASP()+0.5;}
vec4 IN(vec2 uv){return texture(uInput,uv);}
vec2 mfr(vec2 x){return 1.0-abs(1.0-2.0*fract(x*0.5));}
float luma(vec3 c){return dot(c,vec3(0.299,0.587,0.114));}
vec3 unp(vec4 c){return c.a>0.0001?c.rgb/c.a:vec3(0.0);}
vec3 hueShift(vec3 c,float h){vec3 k=vec3(0.57735);float a=h*TAU;float ca=cos(a);return c*ca+cross(k,c)*sin(a)+k*dot(k,c)*(1.0-ca);}
float easeSpring(float x,float z,float w){if(x>=1.0) return 1.0; float wd=w*sqrt(1.0-z*z); return 1.0-exp(-z*w*x)*(cos(wd*x)+(z*w/wd)*sin(wd*x));}
float easeBounce(float x){float n=7.5625,d=2.75; if(x<1.0/d) return n*x*x; if(x<2.0/d){x-=1.5/d;return n*x*x+0.75;} if(x<2.5/d){x-=2.25/d;return n*x*x+0.9375;} x-=2.625/d;return n*x*x+0.984375;}
float easeF(float x,float k){x=clamp(x,0.0,1.0);
  if(k<0.5) return 1.0-pow(1.0-x,3.0);
  if(k<1.5) return x>=1.0?1.0:1.0-pow(2.0,-10.0*x);
  if(k<2.5) return x>=1.0?1.0:1.0-exp(-6.0*x)*cos(9.0*x);
  if(k<3.5) return x<0.5?4.0*x*x*x:1.0-pow(-2.0*x+2.0,3.0)/2.0;
  if(k<4.5) return x;
  if(k<5.5) return easeSpring(x,0.55,10.0);
  if(k<6.5) return easeSpring(x,0.32,14.0);
  if(k<7.5){float c1=1.70158,c3=c1+1.0; return 1.0+c3*pow(x-1.0,3.0)+c1*pow(x-1.0,2.0);}
  if(k<8.5) return (x<=0.0)?0.0:(x>=1.0?1.0:pow(2.0,-10.0*x)*sin((x*10.0-0.75)*2.0943951)+1.0);
  if(k<9.5) return easeBounce(x);
  if(k<10.5) return x<=0.0?0.0:(x>=1.0?1.0:(x<0.5?pow(2.0,20.0*x-10.0)/2.0:(2.0-pow(2.0,-20.0*x+10.0))/2.0));
  return min(1.0,floor(x*6.0)/5.0);}
`;
export const HEAD_LINES=HEAD.split('\n').length;
