/** Standalone extension prototype. No Vel state, registry or main-file imports. */
import * as CANNON from "cannon-es";
import { fixedReplay } from "../core.mjs";
export function createSimulation() {
  return fixedReplay(() => {
    const world = new CANNON.World({ gravity: new CANNON.Vec3(0, -9.81, 0) });
    const ground = new CANNON.Body({ mass: 0, shape: new CANNON.Plane() });
    ground.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
    const body = new CANNON.Body({
      mass: 1,
      shape: new CANNON.Sphere(0.25),
      position: new CANNON.Vec3(0, 2, 0),
    });
    world.addBody(ground);
    world.addBody(body);
    return {
      body,
      world,
      step: (dt) => world.step(dt),
      dispose() {
        for (const b of [...world.bodies]) world.removeBody(b);
      },
    };
  });
}
