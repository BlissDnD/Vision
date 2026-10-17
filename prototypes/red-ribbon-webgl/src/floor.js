/* Red lacquer floor: a planar Reflector (real mirrored render of the scene) with a custom shader that
 *  - blurs the reflection (glossiness) with a 16-tap spiral (rotated per pixel), wider with distance from the camera,
 *  - weights it with a clear-coat Fresnel term (strong at grazing angles, like the reference),
 *  - darkens the base where the ribbon comes close (analytic contact occlusion from 64 surface samples),
 *  - keeps a soft warm light pool towards the back light. */
import * as THREE from 'three';
import { Reflector } from 'three/examples/jsm/objects/Reflector.js';

const VS = `uniform mat4 textureMatrix; varying vec4 vUv; varying vec3 vW;
void main(){ vUv = textureMatrix * vec4(position, 1.0); vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz;
  gl_Position = projectionMatrix * viewMatrix * w; }`;

const FS = `uniform vec3 color; uniform sampler2D tDiffuse; uniform vec3 uRed; uniform float uRefl, uBlur, uAOk, uPool;
uniform vec4 uAO[64]; varying vec4 vUv; varying vec3 vW;
#include <common>
void main(){
  vec2 uv = vUv.xy / vUv.w;
  vec3 V = normalize(cameraPosition - vW);
  float F = 0.04 + 0.96 * pow(1.0 - max(V.y, 0.0), 5.0);
  float dist = length(vW - cameraPosition);
  float rad = uBlur * (0.004 + 0.0025 * dist);
  vec3 refl = vec3(0.0);
  float rot = 6.2831853 * fract(52.9829189 * fract(dot(gl_FragCoord.xy, vec2(0.06711056, 0.00583715)))); // per-pixel spiral rotation: no visible taps
  for (int i = 0; i < 16; i++) { float fi = float(i) + 0.5; float r = sqrt(fi / 16.0) * rad; float a = fi * 2.39996 + rot;
    refl += min(texture2D(tDiffuse, uv + r * vec2(cos(a), sin(a))).rgb, vec3(12.0)); }
  refl /= 16.0;
  float occ = 0.0;
  for (int i = 0; i < 64; i++) { vec4 s = uAO[i]; vec2 d = vW.xz - s.xz; float r = s.w + s.y * 0.6;
    occ += exp(-dot(d, d) / (r * r)) * exp(-max(s.y, 0.0) * 1.6) * 0.35; }
  occ = clamp(occ * uAOk, 0.0, 0.85);
  float pool = exp(-abs(vW.x - 0.9) * 0.28) * smoothstep(2.0, -14.0, vW.z) * uPool;   // warm light pool toward the back
  vec3 base = uRed * (0.22 + 0.5 * pool) * (1.0 - occ);
  // lacquer: reflection = mostly untinted clear coat (Fresnel) + a red-tinted metallic part
  vec3 col = base + refl * uRefl * (F * 0.3 + uRed * 1.1);
  gl_FragColor = vec4(col, 1.0);
}`;

export function makeFloor(P, w, h) {
  const shader = { name: 'RedFloor', vertexShader: VS, fragmentShader: FS,
    uniforms: { color: { value: null }, tDiffuse: { value: null }, textureMatrix: { value: null },
      uRed: { value: new THREE.Color(P.red) }, uRefl: { value: P.refl }, uBlur: { value: P.blur }, uAOk: { value: P.ao }, uPool: { value: 1 },
      uAO: { value: Array.from({ length: 64 }, () => new THREE.Vector4(0, 99, 0, 0.01)) } } };
  const f = new Reflector(new THREE.PlaneGeometry(240, 240), { shader, textureWidth: w, textureHeight: h, clipBias: 0.002, multisample: 4 });
  f.rotation.x = -Math.PI / 2;
  return f;
}

export function setContacts(floor, c) { const a = floor.material.uniforms.uAO.value; for (let i = 0; i < 64; i++) a[i].set(c[i * 4], c[i * 4 + 1], c[i * 4 + 2], c[i * 4 + 3]); }
