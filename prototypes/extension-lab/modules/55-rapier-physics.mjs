/** Standalone extension prototype. No Vel state, registry or main-file imports. */
import RAPIER from "@dimforge/rapier3d-compat";
import { fixedReplay } from "../core.mjs";
let ready;
export async function createSimulation() {
  ready ??= RAPIER.init();
  await ready;
  return fixedReplay(() => {
    const world = new RAPIER.World({ x: 0, y: -9.81, z: 0 });
    world.createCollider(
      RAPIER.ColliderDesc.cuboid(5, 0.1, 5).setTranslation(0, -0.1, 0),
    );
    const body = world.createRigidBody(
      RAPIER.RigidBodyDesc.dynamic().setTranslation(0, 2, 0),
    );
    world.createCollider(
      RAPIER.ColliderDesc.ball(0.25).setRestitution(0.4),
      body,
    );
    return {
      world,
      body,
      step(dt) {
        world.timestep = dt;
        world.step();
      },
      dispose: () => world.free(),
    };
  });
}
