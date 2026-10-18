import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  normalizeText,
  prepareIndex,
  search,
  groupFamilies,
  suggestedCompatibility,
} from "./catalog-model.mjs";
const snapshot = JSON.parse(
    readFileSync(new URL("../data/current-library.json", import.meta.url)),
  ),
  index = prepareIndex(snapshot.records);
test("snapshot retains every source shelf row and unique proposed identity", () => {
  assert.equal(snapshot.sourceRowCount, 259);
  assert.equal(
    snapshot.records.reduce((n, r) => n + r.sourceRows.length, 0),
    259,
  );
  assert.equal(
    new Set(snapshot.records.map((r) => r.proposedId)).size,
    snapshot.records.length,
  );
});
test("accent and punctuation normalization", () =>
  assert.equal(normalizeText("ÁRVÍZ – Űr!"), "arviz ur"));
test("exact name comes before related entries", () =>
  assert.equal(search(index, "Liquid Glass")[0].title, "Liquid Glass"));
test("English alias finds compatible content, independently of title language", () =>
  assert.ok(search(index, "fog").some((r) => r.type === "haze")));
test("task phrase can discover existing atmosphere-related content", () =>
  assert.ok(search(index, "háttérbe simulás").some((r) => r.type === "haze")));
test("roles separate recipe and element with same subject", () => {
  assert.ok(search(index, "bolygó", { role: "recipe" }).length);
  assert.ok(search(index, "bolygó", { role: "element" }).length);
  assert.ok(
    search(index, "bolygó", { role: "element" }).every(
      (e) => e.role === "element",
    ),
  );
});
test("unbuilt idea never appears as available content by default", () => {
  const row = {
    ...snapshot.records[0],
    proposedId: "idea",
    title: "Még nincs funkció",
    availability: "idea",
  };
  const i = prepareIndex([row]);
  assert.equal(search(i, "").length, 0);
  assert.equal(search(i, "", { showUnavailable: true }).length, 1);
});
test("different topics reference same identity, no duplicate record", () => {
  const e = { ...snapshot.records[0], topics: ["space", "studio"] };
  const i = prepareIndex([e]);
  assert.equal(
    search(i, "", { topics: ["space"] })[0],
    search(i, "", { topics: ["studio"] })[0],
  );
});
test("planet presets share family and retain variants", () => {
  const planets = snapshot.records.filter((r) => r.type === "planet");
  assert.ok(planets.length >= 7);
  const f = groupFamilies(planets);
  assert.equal(f.length, 1);
  assert.equal(f[0].variants.length, planets.length);
});
test("compatibility is not silently inferred from empty restrictions", () => {
  const e = snapshot.records.find((r) => r.type === "glow");
  assert.equal(suggestedCompatibility(e, { type: "text" }).ok, null);
  assert.equal(suggestedCompatibility(e, null).ok, false);
});
test("balloon rejects unsupported target with reason", () => {
  const e = snapshot.records.find((r) => r.type === "balloon");
  assert.equal(suggestedCompatibility(e, { type: "text" }).ok, false);
  assert.equal(suggestedCompatibility(e, { type: "cloud3d" }).ok, null);
});
test("search never mutates snapshot or writes project state", () => {
  const before = JSON.stringify(snapshot);
  search(index, "bolygó");
  groupFamilies(snapshot.records);
  assert.equal(JSON.stringify(snapshot), before);
});
test("unknown query and empty filtered result remain empty", () => {
  assert.deepEqual(search(index, "nemletezo8723"), []);
  assert.deepEqual(search(index, "", { topics: ["nonexistent"] }), []);
});
