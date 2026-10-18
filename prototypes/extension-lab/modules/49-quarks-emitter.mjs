/** Standalone extension prototype. No Vel state, registry or main-file imports. */
import {
  ParticleSystem,
  BatchedRenderer,
  PointEmitter,
  ConstantValue,
  ConstantColor,
  RenderMode,
} from "three.quarks";
import { MeshBasicMaterial, Vector4 } from "three";
export function create() {
  const material = new MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
  });
  const system = new ParticleSystem({
    duration: 2,
    looping: true,
    startLife: new ConstantValue(1.5),
    startSpeed: new ConstantValue(1),
    startSize: new ConstantValue(0.06),
    startColor: new ConstantColor(new Vector4(0.5, 1, 0.8, 1)),
    emissionOverTime: new ConstantValue(25),
    shape: new PointEmitter(),
    material,
    renderMode: RenderMode.BillBoard,
  });
  const renderer = new BatchedRenderer();
  renderer.addSystem(system);
  return {
    system,
    object: renderer,
    emitter: system.emitter,
    step: (dt) => renderer.update(dt),
    dispose() {
      renderer.deleteSystem?.(system);
      system.dispose?.();
      material.dispose();
    },
  };
}
export const requirements =
  "Forward simulation only: random seeding and deterministic rewind are NOT implemented for Quarks in this prototype";
