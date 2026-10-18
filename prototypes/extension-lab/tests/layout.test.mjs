import { test } from "node:test";
import assert from "node:assert/strict";
import { travel, frame, normalize, wrap } from "../layouts/state.mjs";
import { buildRibbonGeometry } from "../layouts/vendor/unwoven-original.mjs";
test("intro travel is continuous and reversible independently of frame order", () => {
  assert.equal(travel(0.35, 95), 0);
  assert.ok(Math.abs(travel(2.75 - 1e-7, 95) - travel(2.75, 95)) < 0.001);
  const a = frame(5, {});
  frame(20, {});
  assert.deepEqual(frame(5, {}), a);
  assert.equal(travel(5, -95), -travel(5, 95));
});
test("invalid imported options are bounded and stripped", () => {
  const o = normalize({
    threads: 1e6,
    speed: NaN,
    unknown: "bad",
    background: "url(x)",
  });
  assert.equal(o.threads, 96);
  assert.equal(o.speed, 95);
  assert.equal(o.background, "#ffffff");
  assert.ok(!("unknown" in o));
  assert.deepEqual(normalize(JSON.parse(JSON.stringify(o))), o);
});
test("original ribbon topology preserves independent threads", () => {
  const g = buildRibbonGeometry(339, 452, 26, 20);
  assert.equal(g.attributes.position.count, 26 * 42);
  assert.equal(g.index.count, 26 * 20 * 6);
  assert.equal(g.attributes.aThread.getX(42), 1);
  assert.equal(wrap(-10, 100), 90);
  g.dispose();
});
