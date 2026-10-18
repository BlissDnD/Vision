/* MAT1 · 3D material interface (GLSL side). One block shared by every 3D render path: the SDF raymarchers
 * (obj3d, sdfscene) and the triangle mesh (surface3d). A host appearance (Rajzolt toll / Hologram) sets uMt and the
 * uM* uniforms (material3d.ts matU); the host calls matHit on a surface hit, matMiss on a missed ray, matWarp on the ray.
 * Rajzolt toll: own WebGL2 take on the R3F Sketch Material idea (MIT; principle only): object-space triplanar
 * hatching in tone levels, paper tooth, ink skips, wobbly contour, "boiling" redraw. */
export const MAT_GLSL = `
uniform float uMt, uMs, uMsc; uniform vec4 uMa, uMb; uniform vec3 uMc1, uMc2;   // type (0 none, 1 sketch, 2 hologram), strength, host scale, params, colours
vec4 gMat = vec4(0.0);
float mh2(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float mn2(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(mh2(i), mh2(i + vec2(1.0, 0.0)), f.x), mix(mh2(i + vec2(0.0, 1.0)), mh2(i + vec2(1.0, 1.0)), f.x), f.y); }
float mBoil(){ return uMa.w > 0.0 ? floor(uTime * uMa.w) : 0.0; }   // "Élő vonal": the strokes are redrawn uMa.w times a second
/* one family of parallel hand strokes on plane coords q (1 stroke per unit): angle a, half width hw, aa = one pixel in stroke units */
float mStroke(vec2 q, float a, float hw, float aa, float seed){
  vec2 d = vec2(cos(a), sin(a)); float s = dot(q, d), u = dot(q, vec2(-d.y, d.x));
  u += (mn2(vec2(s * 0.3, u * 0.15 + seed)) - 0.5) * 0.5;                      // the hand wanders along the stroke
  float row = floor(u), f = abs(fract(u) - 0.5);
  float hw2 = hw * (1.0 - 0.3 * mn2(vec2(s * 1.3, row * 2.7 + seed)));          // uneven pressure
  float c = 1.0 - smoothstep(hw2 - aa, hw2 + aa, f);
  c *= smoothstep(0.12, 0.3, mn2(vec2(s * 0.9 + seed, row * 3.1)));             // the ballpoint skips now and then
  return mix(c, 2.0 * hw2 * 0.8, smoothstep(0.25, 0.6, aa));                    // far away: average grey instead of aliasing
}
/* tone levels: light → one sparse family, mid → cross hatch, dark → dense third family, near black → filled */
float mHatch(vec2 q, float dark, float aa, float seed){
  float w = uMa.y, a0 = uMb.w; dark += (mn2(q * 0.35 + seed) - 0.5) * 0.18;
  float k1 = smoothstep(0.1, 0.32, dark), k2 = smoothstep(0.38, 0.6, dark), k3 = smoothstep(0.62, 0.85, dark);
  float ink = mStroke(q, a0 + 0.785, w * (0.35 + 0.65 * k1), aa, seed) * k1;
  ink = max(ink, mStroke(q, a0 - 0.6, w * (0.35 + 0.65 * k2), aa, seed + 5.0) * k2);
  ink = max(ink, mStroke(q * 1.7, a0 + 0.12, w * (0.4 + 0.6 * k3), aa * 1.7, seed + 9.0) * k3);
  return max(ink, smoothstep(0.86, 1.02, dark) * 0.85);
}
float mTri(vec3 lq, vec3 ln, float dark, float pw){
  vec3 w = pow(abs(ln), vec3(4.0)); w /= w.x + w.y + w.z + 1e-5;
  float sc = uMa.x * uMsc, aa = pw * sc, sd = mBoil() * 7.13;
  return w.x * mHatch(lq.zy * sc, dark, aa, sd) + w.y * mHatch(lq.xz * sc, dark, aa, sd + 3.0) + w.z * mHatch(lq.xy * sc, dark, aa, sd + 6.0);
}
float mTooth(){ return smoothstep(0.2, 0.5, mn2(gl_FragCoord.xy * 0.6) * 0.6 + mn2(gl_FragCoord.xy * 0.17) * 0.4); }   // paper fibres
/* surface hit. lit: shaded brightness 0..1; nv = dot(n, v); lq/ln: object-space position/normal; pw: world size of one pixel;
   base: the host's own shaded colour ("Eredeti szín"); yW: height for the hologram scan lines */
vec4 matHit(float lit, float nv, vec3 lq, vec3 ln, float pw, vec3 base, float yW){
  if (uMt < 1.5) {
    float ink = mTri(lq, ln, 1.0 - clamp(lit * 0.9, 0.0, 1.0), pw);
    float cw = uMb.x; if (cw > 0.0) { float wob = (mn2(lq.xy * 3.0 + lq.z * 2.0 + mBoil() * 3.1) - 0.5) * 0.08;
      ink = max(ink, (1.0 - smoothstep(cw * 0.05, cw * 0.09, nv + wob)) * 0.95); }
    ink = clamp(ink * uMa.z * mix(0.7, 1.0, mTooth()), 0.0, 1.0);
    return vec4(mix(mix(uMc2, base, uMb.z), uMc1, ink), 1.0);
  }
  float t = uTime, fr = pow(1.0 - clamp(nv, 0.0, 1.0), uMa.y);
  float ln2 = smoothstep(0.5, 1.0, sin(yW * uMa.z * 6.2832 - t * uMa.w * 6.0) * 0.5 + 0.5);
  float b = exp(-pow((fract(yW * 0.3 - t * uMa.w * 0.3) - 0.5) * 12.0, 2.0)) * uMb.z;
  float fl = 1.0 - uMb.x * (step(0.8, mh2(vec2(floor(t * 18.0), 3.0))) * 0.6 + 0.12 * (sin(t * 47.0) * 0.5 + 0.5));
  float a = clamp(uMa.x * (0.1 + fr * 1.2 + ln2 * 0.3 + b * 0.8), 0.0, 1.0) * fl;
  vec3 col = (uMc1 * (0.15 + fr * 1.5 + ln2 * 0.45 + b * 1.1) + vec3(fr * fr * 0.45)) * fl * uMa.x;
  return vec4(col, a);
}
/* missed ray (SDF hosts). md: closest approach; fsh: floor shadow 0..1 at floor point fq; pw: pixel world size */
vec4 matMiss(float md, float fsh, vec2 fq, float pw){
  if (uMt < 1.5) {
    float ink = 0.0;
    if (fsh > 0.002) { float sc = uMa.x * uMsc; ink = mHatch(fq * sc, fsh * 0.9, pw * sc * 2.0, mBoil() * 7.13 + 11.0) * smoothstep(0.0, 0.15, fsh); }
    float cw = uMb.x; if (cw > 0.0) { float wob = (mn2(gl_FragCoord.xy * 0.04 + mBoil() * 3.1) - 0.5) * 0.8;
      ink = max(ink, 1.0 - smoothstep(cw * 0.5, cw, md / pw + wob)); }
    ink = clamp(ink * uMa.z * mix(0.7, 1.0, mTooth()), 0.0, 1.0);
    return uMb.y > 0.5 ? vec4(mix(uMc2, uMc1, ink), 1.0) : vec4(uMc1 * ink, ink);
  }
  float g = exp(-max(md, 0.0) * 12.0) * 0.4 * uMa.x;
  return vec4(uMc1 * g, g * 0.6);
}
/* hologram glitch: now and then horizontal bands of the image slip sideways (screen coords) */
vec2 matWarp(vec2 p){
  if (uMt < 1.5 || uMb.y <= 0.0) return p;
  float t = floor(uTime * 12.0), on = step(0.86, mh2(vec2(t, 7.0)));
  return p + vec2((mh2(vec2(floor(p.y * 18.0), t)) - 0.5) * 0.12 * uMb.y * on, 0.0);
}
vec4 MX(vec4 o){ return uMt > 0.5 ? mix(o, gMat, uMs) : o; }   // the appearance's strength blends it over the host's own look
`;
