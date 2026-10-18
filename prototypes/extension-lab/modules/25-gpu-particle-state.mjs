/** Standalone extension prototype. No Vel state, registry or main-file imports. */
import { GPUComputationRenderer } from "three/addons/misc/GPUComputationRenderer.js";
import { seeded, bounded } from "../core.mjs";
export function create(renderer, { size = 32, seed = 1 } = {}) {
  bounded(size, 4, 256, "size");
  const gpu = new GPUComputationRenderer(size, size, renderer),
    texture = gpu.createTexture(),
    rng = seeded(seed);
  for (let i = 0; i < texture.image.data.length; i += 4) {
    texture.image.data.set([rng() * 2 - 1, rng() * 2 - 1, 0, 1], i);
  }
  const variable = gpu.addVariable(
    "texturePosition",
    "uniform float dt; void main(){ vec2 uv=gl_FragCoord.xy/resolution.xy; vec4 p=texture2D(texturePosition,uv); p.xy+=vec2(-p.y,p.x)*dt; gl_FragColor=p; }",
    texture,
  );
  gpu.setVariableDependencies(variable, [variable]);
  variable.material.uniforms.dt = { value: 1 / 60 };
  const error = gpu.init();
  if (error) {
    gpu.dispose();
    throw new Error(error);
  }
  return {
    step(dt = 1 / 60) {
      variable.material.uniforms.dt.value = dt;
      gpu.compute();
    },
    texture: () => gpu.getCurrentRenderTarget(variable).texture,
    dispose: () => gpu.dispose(),
  };
}
export const requirements =
  "WebGLRenderer with floating-point render target support; stateful fixed-step updates";
