/* SDF version of the same ribbon, for the measured mesh-vs-SDF comparison (M6, step 2).
 * Same technique as Vel's own SDF branch (fragment-shader raymarching), but with a new primitive Vel does not have:
 * a sheet swept along the spine, sampled as NS−1 segments with interpolated frames, rounded cross-section, cross bend.
 * Floor contact is a TRUE smooth union (polynomial smin with k = fillet), the floor mirror is one extra marched bounce.
 * Lighting: the same studio env (cube texture, roughness → lod) so the comparison is about geometry/cost, not taste. */
import * as THREE from 'three';
import { frameAt, makeCurve, widthAt } from './ribbon.js';

export const NS = 48;
const FS = `precision highp float;
uniform vec4 uP[${NS}]; uniform vec4 uW[${NS}]; uniform vec4 uB[${NS}]; // pos+halfThick, width axis+W, thickness axis+x0
uniform mat4 uInvVP; uniform vec3 uCam; uniform samplerCube uEnv; uniform vec3 uRed; uniform float uK, uBend, uRough, uMetal, uRefl, uExpo;
varying vec2 vUv;
float smin(float a, float b, float k){ float h = max(k - abs(a - b), 0.0) / max(k, 1e-5); return min(a, b) - h * h * k * 0.25; }
float sheet(vec3 p){ float d = 1e9;
  for (int i = 0; i < ${NS - 1}; i++){
    vec3 a = uP[i].xyz, b = uP[i + 1].xyz, ab = b - a; float h = clamp(dot(p - a, ab) / dot(ab, ab), 0.0, 1.0);
    vec3 c = a + ab * h, w = normalize(mix(uW[i].xyz, uW[i + 1].xyz, h)), bn = normalize(mix(uB[i].xyz, uB[i + 1].xyz, h));
    float W = mix(uW[i].w, uW[i + 1].w, h), x0 = mix(uB[i].w, uB[i + 1].w, h), th = uP[i].w;
    vec3 q = p - c; float u = dot(q, w), f = clamp((u - x0) / W, 0.0, 1.0), v = dot(q, bn) - uBend * W * f * f;
    float along = length(q - w * u - bn * dot(q, bn));
    vec2 e = vec2(abs(u - (x0 + W * 0.5)) - W * 0.5 + th, abs(v));            // rounded edge radius = half thickness
    float d2 = length(max(e, 0.0)) + min(max(e.x, e.y), 0.0) - th;
    d = min(d, length(vec2(max(d2, 0.0), along)) + min(d2, 0.0)); }
  return d; }
float map(vec3 p){ return smin(sheet(p), p.y, uK); }
vec3 nrm(vec3 p){ vec2 e = vec2(0.002, -0.002);
  return normalize(e.xyy * map(p + e.xyy) + e.yyx * map(p + e.yyx) + e.yxy * map(p + e.yxy) + e.xxx * map(p + e.xxx)); }
float march(vec3 ro, vec3 rd, int N, float far){ float t = 0.02;
  for (int i = 0; i < 128; i++){ if (i >= N) break; float d = map(ro + rd * t); if (d < 0.0015 * t) return t; t += d; if (t > far) break; }
  return -1.0; }
vec3 env(vec3 d, float r){ return textureLod(uEnv, d, r * 7.0).rgb; }
vec3 shade(vec3 p, vec3 rd, vec3 n){
  bool fl = p.y < 0.01 && n.y > 0.995;                                         // pure floor (not the blend region)
  vec3 v = -rd, R = reflect(rd, n); float ct = max(dot(n, v), 0.0);
  float rough = fl ? 0.35 : uRough, metal = fl ? 0.3 : uMetal;
  vec3 F0 = mix(vec3(0.04), uRed, metal), F = F0 + (1.0 - F0) * pow(1.0 - ct, 5.0);
  vec3 dif = uRed * (1.0 - metal) * env(n, 1.0), spec = env(R, rough) * F;
  return dif + spec; }
void main(){
  vec4 h = uInvVP * vec4(vUv * 2.0 - 1.0, 1.0, 1.0); vec3 rd = normalize(h.xyz / h.w - uCam), ro = uCam;
  float t = march(ro, rd, 110, 120.0); vec3 col;
  if (t < 0.0) col = textureLod(uEnv, rd, 0.0).rgb;
  else { vec3 p = ro + rd * t, n = nrm(p); col = shade(p, rd, n);
    if (p.y < 0.02 && uRefl > 0.0){                                               // floor mirror: one marched bounce
      vec3 R = reflect(rd, n); float t2 = march(p + n * 0.01, R, 64, 40.0);
      vec3 rc = t2 < 0.0 ? textureLod(uEnv, R, 2.0).rgb : shade(p + n * 0.01 + R * t2, R, nrm(p + n * 0.01 + R * t2));
      float fr = 0.04 + 0.96 * pow(1.0 - max(dot(n, -rd), 0.0), 5.0); col += rc * uRefl * (fr * 0.3 + uRed * 1.1); } }
  gl_FragColor = vec4(col, 1.0); }`;

export function makeSdfScene(P, envTex) {
  const U = { uP: { value: Array.from({ length: NS }, () => new THREE.Vector4()) }, uW: { value: Array.from({ length: NS }, () => new THREE.Vector4()) }, uB: { value: Array.from({ length: NS }, () => new THREE.Vector4()) },
    uInvVP: { value: new THREE.Matrix4() }, uCam: { value: new THREE.Vector3() }, uEnv: { value: envTex }, uRed: { value: new THREE.Color(P.red) },
    uK: { value: P.fillet }, uBend: { value: P.bend }, uRough: { value: P.rough }, uMetal: { value: P.metal }, uRefl: { value: P.refl }, uExpo: { value: 1 } };
  const m = new THREE.ShaderMaterial({ uniforms: U, vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }', fragmentShader: FS, depthTest: false, depthWrite: false });
  const s = new THREE.Scene(), q = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), m); q.frustumCulled = false; s.add(q);
  const cam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  return { scene: s, cam, U, mat: m };
}
/** Spine frames → uniforms (same frames as the mesh, so both renders show the same form). */
export function updSdf(S, P, camera, envTex) {
  const curve = makeCurve(P); let prev = null;
  for (let i = 0; i < NS; i++) { const s = i / (NS - 1), F = frameAt(curve, P, s, prev); prev = F.w; const W = widthAt(P, s);
    S.U.uP.value[i].set(F.p.x, F.p.y, F.p.z, P.thick / 2); S.U.uW.value[i].set(F.w.x, F.w.y, F.w.z, W); S.U.uB.value[i].set(F.b.x, F.b.y, F.b.z, -P.center * W); }
  camera.updateMatrixWorld(); S.U.uInvVP.value.multiplyMatrices(camera.matrixWorld, camera.projectionMatrixInverse); S.U.uCam.value.copy(camera.position);
  Object.assign(S.U, {}); S.U.uK.value = Math.max(0.001, P.fillet); S.U.uBend.value = P.bend; S.U.uRough.value = P.rough; S.U.uMetal.value = P.metal; S.U.uRefl.value = P.refl; S.U.uRed.value.set(P.red);
  if (envTex) S.U.uEnv.value = envTex;
}
