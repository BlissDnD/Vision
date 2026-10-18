/** Standalone extension prototype. No Vel state, registry or main-file imports. */
import {
  EffectComposer,
  RenderPass,
  EffectPass,
  BloomEffect,
} from "postprocessing";
export function createPipeline(
  renderer,
  scene,
  camera,
  { intensity = 0.6 } = {},
) {
  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  const bloom = new BloomEffect({ intensity, luminanceThreshold: 0.7 });
  composer.addPass(new EffectPass(camera, bloom));
  return {
    render: (dt) => composer.render(dt),
    resize: (w, h) => composer.setSize(w, h),
    dispose: () => composer.dispose(),
  };
}
export const requirements =
  "Separate Three.js scene pipeline; this does not register a Vel appearance";
