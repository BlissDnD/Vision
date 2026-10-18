import test from "node:test";
import assert from "node:assert/strict";
import { seeded, fixedReplay } from "../core.mjs";
const load = (id) => import(`../modules/${id}.mjs`);
test("seeded sequences repeat", () => {
  const a = seeded(7),
    b = seeded(7);
  assert.deepEqual(
    Array.from({ length: 20 }, a),
    Array.from({ length: 20 }, b),
  );
});
test("fixed replay rebuilds backward and preserves sample", () => {
  const replay = fixedReplay(() => ({
    x: 0,
    step(dt) {
      this.x += dt;
    },
  }));
  const first = replay.seek(2).x;
  replay.seek(0.5);
  assert.equal(replay.seek(2).x, first);
  assert.throws(() => replay.seek(Infinity));
});
for (const id of [
  "01-csg",
  "02-subdivide",
  "03-decal",
  "04-extrude",
  "05-curve-flow",
  "06-metaballs",
  "07-surface-scatter",
  "14-custom-material",
  "15-planar-reflection",
  "22-ik-chain",
  "34-instanced-copies",
  "35-batched-objects",
  "46-path-tube",
  "47-tapered-line",
  "48-glass-material",
  "51-water-surface",
  "52-seeded-city",
])
  test(`${id}: builds finite geometry`, async () => {
    const m = await load(id),
      object = m.create();
    let count = 0;
    object.traverse((o) => {
      const p = o.geometry?.attributes?.position;
      if (p) {
        count += p.count;
        for (const value of p.array) assert.ok(Number.isFinite(value));
      }
    });
    assert.ok(count > 0);
    object.userData.seek?.(0.5);
    const { disposeObject } = await import("../core.mjs");
    object.userData.disposeExtra?.();
    disposeObject(object);
  });
test("hole triangulation preserves area", async () => {
  const { create } = await load("12-triangulate");
  const { vertices: v, indices } = create();
  let area = 0;
  for (let i = 0; i < indices.length; i += 3) {
    const [a, b, c] = indices
      .slice(i, i + 3)
      .map((j) => [v[2 * j], v[2 * j + 1]]);
    area +=
      Math.abs((b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])) /
      2;
  }
  assert.ok(Math.abs(area - 8) < 1e-6);
});
test("polygon difference is real geometry", async () => {
  const m = await load("11-polygon-boolean");
  assert.equal(m.create().length, 1);
  assert.throws(() => m.combine([], []));
});
test("surface scattering is repeatable", async () => {
  const { SphereGeometry, Mesh } = await import("three"),
    m = await load("07-surface-scatter");
  const geo = new SphereGeometry(1),
    mesh = new Mesh(geo);
  assert.deepEqual(m.sampleSurface(mesh, 10, 7), m.sampleSurface(mesh, 10, 7));
  geo.dispose();
});
test("Voronoi cells cover the box", async () => {
  const { cells } = await load("13-voronoi");
  const result = cells({ count: 16, seed: 3 });
  let area = 0;
  for (const { polygon: p } of result) {
    let sum = 0;
    for (let i = 0; i < p.length - 1; i++)
      sum += p[i][0] * p[i + 1][1] - p[i + 1][0] * p[i][1];
    area += Math.abs(sum) / 2;
  }
  assert.ok(Math.abs(area - 1) < 1e-8);
  assert.deepEqual(result, cells({ count: 16, seed: 3 }));
});
test("font outline retains text and paths", async () => {
  const m = await load("09-font-outlines");
  const o = m.create();
  assert.equal(o.text, "AAA");
  assert.ok(o.commands.length > 3);
});
test("paper path smoothing returns handles", async () => {
  const m = await load("10-vector-paths");
  const o = m.create();
  assert.equal(o.length, 4);
  assert.ok(o.some((s) => s.out.some((v) => v !== 0)));
});
test("perceptual gradient endpoints", async () => {
  const m = await load("19-perceptual-gradient");
  const g = m.gradient(["#ff0000", "#0000ff"]);
  assert.equal(g[0], "#ff0000");
  assert.equal(g.at(-1), "#0000ff");
});
test("palette contrast checks", async () => {
  const m = await load("20-palette-scales");
  assert.ok(m.contrast("#ffffff", "#000000") > 20);
  assert.equal(m.scale(["red", "blue"], { steps: 5 }).length, 5);
});
test("easing endpoints", async () => {
  const m = await load("26-bezier-easing");
  const f = m.curve();
  assert.equal(f(0), 0);
  assert.equal(f(1), 1);
});
test("tween backward sampling", async () => {
  const m = await load("27-tween-sampling");
  assert.equal(m.sample({ x: 0 }, { x: 10 }, 1).x, 10);
  assert.equal(m.sample({ x: 0 }, { x: 10 }, 0.5).x, 5);
  assert.equal(m.sample({ x: 0 }, { x: 10 }, 0).x, 0);
});
test("waveform peaks retain transients", async () => {
  const m = await load("28-waveform");
  assert.deepEqual(m.peakEnvelope(new Float32Array([0, 1, -0.8, 0]), 2), [
    1,
    Math.fround(0.8),
  ]);
});
test("audio analysis detects nonzero RMS", async () => {
  const m = await load("29-audio-features");
  const f = m.create();
  assert.equal(f.length, 2);
  assert.ok(f.every((x) => x.rms > 0.3));
});
test("Cannon falls, collides and rewinds", async () => {
  const m = await load("24-rigid-bodies"),
    sim = m.createSimulation();
  assert.ok(sim.seek(0.5).body.position.y < 2);
  const y = sim.seek(2).body.position.y;
  assert.ok(y > 0.15 && y < 0.4);
  sim.seek(0.2);
  assert.equal(sim.seek(2).body.position.y, y);
  sim.dispose();
});
test("BVH ray hits front surface", async () => {
  const m = await load("31-bvh-picking");
  assert.ok(Math.abs(m.create().distance - 2) < 0.01);
});
test("fit curve preserves original timing", async () => {
  const m = await load("58-fit-motion-path");
  const o = m.create();
  assert.ok(o.curves.length);
  assert.equal(o.raw.length, 32);
  assert.equal(o.start, 0);
  assert.equal(o.end, 31 / 30);
});
test("animation mixer supports backward seek", async () => {
  const { Object3D, AnimationClip, NumberKeyframeTrack } =
      await import("three"),
    m = await load("61-model-animation");
  const object = new Object3D(),
    p = m.animate(
      object,
      new AnimationClip("test", 1, [
        new NumberKeyframeTrack(".position[x]", [0, 1], [0, 10]),
      ]),
    );
  p.seek(1);
  assert.equal(object.position.x, 10);
  p.seek(0.25);
  assert.equal(object.position.x, 2.5);
  p.dispose();
});
test("LUT parses its identity fixture", async () => {
  const m = await load("18-lut-import"),
    lut = m.parseLUT(m.sampleIdentity());
  assert.ok(lut.texture3D);
  lut.texture3D.dispose();
});
test("Rapier falls and deterministic rewind", async () => {
  const m = await load("55-rapier-physics"),
    sim = await m.createSimulation();
  const y = sim.seek(1).body.translation().y;
  assert.ok(y < 2 && y > 0);
  sim.seek(0.2);
  assert.equal(sim.seek(1).body.translation().y, y);
  sim.dispose();
});
test("portable assets reject unsupported files and oversized input", async () => {
  const { validateFiles } = await import("../shared/assets.mjs");
  assert.throws(() => validateFiles([{ size: 1, type: "image/svg+xml" }]));
  assert.throws(() =>
    validateFiles([{ size: 100, type: "image/png" }], { maxBytes: 10 }),
  );
});
test("Nebula fixed-step produces particles and repeats after rewind", async () => {
  const m = await load("23-nebula-particles"),
    sim = m.createSimulation({ seed: 42 });
  const snapshot = (seconds) =>
    sim
      .seek(seconds)
      .system.emitters.flatMap((e) =>
        e.particles.map((p) => [p.position.x, p.position.y, p.position.z]),
      );
  const first = snapshot(0.8);
  assert.ok(first.length > 0);
  snapshot(0.2);
  assert.deepEqual(snapshot(0.8), first);
  sim.dispose();
});
test("Quarks emits particles in an attached scene", async () => {
  const m = await load("49-quarks-emitter"),
    { Scene } = await import("three");
  const fx = m.create(),
    scene = new Scene();
  scene.add(fx.object, fx.emitter);
  scene.updateMatrixWorld(true);
  for (let i = 0; i < 60; i++) fx.step(1 / 60);
  assert.ok(fx.system.particleNum > 0);
  fx.dispose();
});
test("GLB optimization and loader preserve scene content", async () => {
  const { Document, WebIO } = await import("@gltf-transform/core");
  const document = new Document(),
    buffer = document.createBuffer();
  const position = document
    .createAccessor()
    .setType("VEC3")
    .setArray(new Float32Array([0, 0, 0, 1, 0, 0, 0, 1, 0]))
    .setBuffer(buffer);
  const primitive = document
      .createPrimitive()
      .setAttribute("POSITION", position),
    mesh = document.createMesh("triangle").addPrimitive(primitive),
    node = document.createNode("test").setMesh(mesh);
  document.createScene().addChild(node);
  const input = await new WebIO().writeBinary(document);
  const optimizer = await load("32-gltf-optimize"),
    loader = await load("62-gltf-import");
  const output = await optimizer.optimize(input);
  const result = await loader.parseGLB(
    output.buffer.slice(
      output.byteOffset,
      output.byteOffset + output.byteLength,
    ),
  );
  let found = false;
  result.scene.traverse((o) => {
    if (o.isMesh) {
      found = true;
      assert.equal(o.geometry.attributes.position.count, 3);
    }
  });
  assert.ok(found);
  const { disposeObject } = await import("../core.mjs");
  disposeObject(result.scene);
});
test("meshoptimizer reduces sphere triangle count within error budget", async () => {
  const { SphereGeometry } = await import("three"),
    m = await load("33-mesh-simplify"),
    g = new SphereGeometry(1, 16, 12);
  const result = await m.simplify(g.index.array, g.attributes.position.array, {
    ratio: 0.5,
    error: 0.1,
  });
  assert.ok(result.indices.length < g.index.count);
  assert.equal(result.indices.length % 3, 0);
  assert.ok(result.error <= 0.1);
  g.dispose();
});
test("GLB rejects invalid headers without loading", async () => {
  const m = await load("62-gltf-import");
  await assert.rejects(() => m.parseGLB(new ArrayBuffer(4)), /GLB/);
});
test("repeated city layouts retain seed identity", async () => {
  const m = await load("52-seeded-city");
  assert.deepEqual(m.layout({ seed: 9 }), m.layout({ seed: 9 }));
  assert.notDeepEqual(m.layout({ seed: 9 }), m.layout({ seed: 10 }));
});
test("frame samplers stay immutable", async () => {
  const m = await load("27-tween-sampling"),
    source = { x: 2 };
  m.sample(source, { x: 9 }, 0.4);
  assert.deepEqual(source, { x: 2 });
});
