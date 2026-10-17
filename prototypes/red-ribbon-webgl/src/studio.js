/* Bright studio: white cyclorama sky with a strong warm back light (the "tunnel opening"), long overhead light
 * strips, and a matching low-res copy of all of it (+ a red floor) that is prefiltered into the PBR environment.
 * Everything that lights the ribbon is real scene content: the strips are visible, reflected by the floor
 * reflector, and baked into the env map again whenever they move (≈ a few ms). */
import * as THREE from 'three';

const skyVS = `varying vec3 vDir; void main(){ vDir = normalize((modelMatrix*vec4(position,1.)).xyz - cameraPosition*0.); gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.); }`;
const skyFS = `uniform vec3 uBack; uniform float uBackI, uSky; varying vec3 vDir;
void main(){ vec3 d = normalize(vDir);
  float c = max(dot(d, uBack), 0.);
  vec3 col = vec3(0.93, 0.925, 0.92) * uSky;                       // soft white studio
  col *= mix(0.82, 1.0, smoothstep(-0.05, 0.5, d.y));               // slightly darker low walls
  col += vec3(1.0, 0.93, 0.86) * uBackI * (pow(c, 90.) * 3.0 + pow(c, 14.) * 0.55); // hot core + halo
  gl_FragColor = vec4(col, 1.); }`;

export function makeSky(P) {
  const m = new THREE.ShaderMaterial({ vertexShader: skyVS, fragmentShader: skyFS, side: THREE.BackSide, depthWrite: false,
    uniforms: { uBack: { value: new THREE.Vector3(0.05, 0.03, -1).normalize() }, uBackI: { value: P.backI }, uSky: { value: P.sky } } });
  const s = new THREE.Mesh(new THREE.SphereGeometry(120, 48, 24), m); s.renderOrder = -1; s.frustumCulled = false;
  return s;
}

/** Light strips: three overhead bars into the depth, one side bar (floor streak on the right), two horizontal bars behind the camera. */
export function makeStrips(P) {
  const g = new THREE.Group(); g.name = 'strips';
  const mat = new THREE.MeshBasicMaterial({ color: new THREE.Color(1, 0.98, 0.96).multiplyScalar(P.stripI) });
  for (let i = 0; i < 6; i++) g.add(new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), mat));
  layoutStrips(g, P); return g;
}
export function layoutStrips(g, P) {
  const sz = P.stripSize, x = P.stripPos;
  const bars = [[x - 2.6, 7.5, -13], [x, 8.2, -13], [x + 2.6, 7.5, -13]]; // ends behind the frame edge, so the floor shows no stubs
  g.children.forEach((m, i) => {
    if (i < 3) { m.position.set(...bars[i]); m.scale.set(0.35 * sz, 0.06, 22 * sz); }
    else if (i === 3) { m.position.set(x + 9, 1.6, -8); m.scale.set(0.06, 0.25 * sz, 26 * sz); }
    else { m.position.set(x * 0.5, i === 4 ? 1.3 : 3.8, 11); m.scale.set(34 * sz, 0.22 * sz, 0.06); } // behind the camera: streaks on faces toward us
  });
  g.children[0].material.color.setRGB(1, 0.98, 0.96).multiplyScalar(P.stripI);
}

export function makeBackLight(P) {
  const m = new THREE.Mesh(new THREE.CircleGeometry(1, 48), new THREE.MeshBasicMaterial({ color: new THREE.Color(1, 0.95, 0.88).multiplyScalar(P.backI * 6) }));
  m.position.set(1.0, 1.1, -40); m.scale.set(9, 3.6, 1); return m;
}

/* The red floor as the env sees it: glossy lacquer with bright reflected streaks and a light pool under the back light.
 * Undersides of the ribbon mirror this, which is where their long pink highlights come from. */
export function envFloorMat(P) {
  return new THREE.ShaderMaterial({ uniforms: { uRed: { value: new THREE.Color(P.red) }, uI: { value: P.stripI / 2.5 } },
    vertexShader: 'varying vec3 vW; void main(){ vec4 w = modelMatrix*vec4(position,1.); vW = w.xyz; gl_Position = projectionMatrix*viewMatrix*w; }',
    fragmentShader: `uniform vec3 uRed; uniform float uI; varying vec3 vW;
      void main(){ float st = 0.;
        for (int i = 0; i < 7; i++) { float fi = float(i), zi = 6.0 - fi * 3.4, wi = 0.35 + fi * 0.12;   // long bands across the floor
          st += exp(-pow((vW.z - zi) / wi, 2.)) * (0.6 + 0.4 * sin(vW.x * 0.21 + fi * 1.7)); }
        float pool = exp(-length((vW.xz - vec2(1.0, -12.0)) * vec2(0.14, 0.08)));
        vec3 c = uRed * 0.35 + vec3(1.0, 0.5, 0.5) * (st * 4.0 * uI + pool * 2.0);
        gl_FragColor = vec4(c, 1.); }` });
}

/** Environment = sky + strips + back light + red floor, prefiltered (PMREM). Rebuilt when the lights change. */
export class Env {
  constructor(renderer, P) {
    this.pm = new THREE.PMREMGenerator(renderer); this.scene = new THREE.Scene();
    this.sky = makeSky(P); this.strips = makeStrips(P); this.back = makeBackLight(P);
    this.floor = new THREE.Mesh(new THREE.PlaneGeometry(400, 400), envFloorMat(P));
    this.floor.rotation.x = -Math.PI / 2; this.floor.position.y = -1.6; // PMREM renders from the origin: a floor at y = 0 would be edge-on and vanish
    this.scene.add(this.sky, this.strips, this.back, this.floor); this.rt = null; this.ms = 0;
  }
  update(P) {
    const t0 = performance.now();
    layoutStrips(this.strips, P);
    this.sky.material.uniforms.uBackI.value = P.backI; this.sky.material.uniforms.uSky.value = P.sky;
    this.back.material.color.setRGB(1, 0.95, 0.88).multiplyScalar(P.backI * 6);
    this.floor.material.uniforms.uRed.value.set(P.red); this.floor.material.uniforms.uI.value = P.stripI / 2.5;
    const rt = this.pm.fromScene(this.scene, 0, 0.1, 400);
    if (this.rt) this.rt.dispose(); this.rt = rt; this.ms = performance.now() - t0;
    return rt.texture;
  }
}
