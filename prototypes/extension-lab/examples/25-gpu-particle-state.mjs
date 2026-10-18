/** Explicit replay of GPU particle positions, including backward seek. */
import * as T from "three";
import * as m from "../modules/25-gpu-particle-state.mjs";
export async function run(host) {
  const size = 32;
  let state = m.create(host.renderer, { size, seed: 7 }),
    tick = 0;
  const geometry = new T.BufferGeometry(),
    uv = [];
  for (let y = 0; y < size; y++)
    for (let x = 0; x < size; x++) uv.push((x + 0.5) / size, (y + 0.5) / size);
  geometry.setAttribute(
    "position",
    new T.Float32BufferAttribute(new Float32Array(size * size * 3), 3),
  );
  geometry.setAttribute("aUv", new T.Float32BufferAttribute(uv, 2));
  const material = new T.ShaderMaterial({
    uniforms: { state: { value: state.texture() } },
    vertexShader:
      "uniform sampler2D state;attribute vec2 aUv;void main(){vec3 p=texture2D(state,aUv).xyz;gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.);gl_PointSize=4.;}",
    fragmentShader:
      "void main(){if(distance(gl_PointCoord,vec2(.5))>.5)discard;gl_FragColor=vec4(.5,1.,.8,1.);}",
  });
  const object = new T.Points(geometry, material);
  object.frustumCulled = false;
  return {
    object,
    seek(t) {
      const target = Math.floor(t * 60);
      if (target < tick) {
        state.dispose();
        state = m.create(host.renderer, { size, seed: 7 });
        tick = 0;
      }
      while (tick < target) {
        state.step();
        tick++;
      }
      material.uniforms.state.value = state.texture();
    },
    dispose: () => state.dispose(),
  };
}
