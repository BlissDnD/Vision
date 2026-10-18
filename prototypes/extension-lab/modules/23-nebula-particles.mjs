/** Standalone extension prototype. No Vel state, registry or main-file imports. */
import System, {
  Emitter,
  Rate,
  Span,
  Life,
  Position,
  PointZone,
  Mass,
  Radius,
  RadialVelocity,
  Vector3D,
} from "three-nebula";
import { fixedReplay } from "../core.mjs";
export function createSimulation({ seed = 1 } = {}) {
  return fixedReplay(() => {
    const system = new System();
    if (typeof system.setSeed !== "function")
      throw new Error("Installed Nebula lacks deterministic seed API");
    system.setSeed(seed);
    const emitter = new Emitter();
    emitter.setRate(new Rate(new Span(2, 3), new Span(0.1, 0.2)));
    emitter.addInitializers([
      new Mass(1),
      new Radius(0.03),
      new Life(1, 2),
      new Position(new PointZone(0, 0, 0)),
      new RadialVelocity(1, new Vector3D(0, 1, 0), 30),
    ]);
    system.addEmitter(emitter);
    emitter.emit();
    return {
      system,
      step: (dt) => system.update(dt),
      dispose: () => system.destroy?.(),
    };
  });
}
export const requirements =
  "Simulation only; attach a Nebula renderer for visual output";
