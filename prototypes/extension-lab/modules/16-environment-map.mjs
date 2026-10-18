/** Standalone extension prototype. No Vel state, registry or main-file imports. */
import { PMREMGenerator } from "three";
export function prepareEnvironment(renderer, texture) {
  const gen = new PMREMGenerator(renderer);
  try {
    gen.compileEquirectangularShader();
    const target = gen.fromEquirectangular(texture);
    return { texture: target.texture, dispose: () => target.dispose() };
  } finally {
    gen.dispose();
  }
}
export function applyEnvironment(scene, prepared) {
  const previous = scene.environment;
  scene.environment = prepared.texture;
  return () => {
    if (scene.environment === prepared.texture) scene.environment = previous;
  };
}
export const requirements =
  "WebGLRenderer + decoded HDR texture; caller owns source texture";
