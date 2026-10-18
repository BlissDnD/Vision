/** Declarative snapshot only. Bundles registries in a temporary Node process; never boots Vel UI. */
import { mkdtemp, rm, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
const here = dirname(fileURLToPath(import.meta.url)),
  root = resolve(here, "../../.."),
  target = resolve(here, "../data/current-library.json");
const { build } = await import(
  pathToFileURL(join(root, "app/node_modules/esbuild/lib/main.js"))
);
const dir = await mkdtemp(join(tmpdir(), "vel-handoff-"));
let raw;
try {
  const file = join(dir, "snapshot.cjs");
  await build({
    stdin: {
      contents: `import {EFFECTS} from './app/src/effects/index';import {LIB,CATS} from './app/src/library';import {RECIPES} from './app/src/recipes';import {MO} from './app/src/motion'; const shelves=Object.fromEntries(Object.entries(LIB).map(([cat,list])=>[cat,list.flatMap((entry,index)=>{if(entry.head)return [];const L=entry.make();return [{title:entry.name,legacyIndex:index,type:L.type,motion:entry.mo,params:L.p,fx:L.fx?.map(f=>f.type),special:entry.polyhaven?'polyhaven':entry.lottie?'lottie':null}];})])); console.log(JSON.stringify({effects:Object.fromEntries(Object.entries(EFFECTS).map(([k,e])=>[k,{name:e.name,kind:e.kind,desc:e.desc,host:e.host}])),shelves,cats:CATS,recipes:RECIPES.map(r=>r.n),motions:MO},(k,v)=>k==='icon'?undefined:v));`,
      resolveDir: root,
      loader: "ts",
    },
    plugins: [
      {
        name: "declarative-only",
        setup(b) {
          b.onResolve({ filter: /^\.\/evaluation$/ }, () => ({
            path: "evaluation",
            namespace: "stub",
          }));
          b.onLoad({ filter: /.*/, namespace: "stub" }, () => ({
            contents:
              'export const ev=()=>{throw Error("Snapshot must not evaluate runtime");};export const keyVal=ev;export const setKey=ev;',
          }));
        },
      },
    ],
    bundle: true,
    platform: "node",
    format: "cjs",
    outfile: file,
    logLevel: "warning",
  });
  raw = JSON.parse(
    execFileSync(process.execPath, [file], {
      encoding: "utf8",
      maxBuffer: 8 * 1024 * 1024,
    }),
  );
} finally {
  await rm(dir, { recursive: true, force: true });
}
const hash = (s) => createHash("sha256").update(s).digest("hex");
const aliases = {
  planet: ["bolygó", "planet", "hold", "moon", "felszín", "légkör"],
  space: ["űr", "space", "csillagháttér", "univerzum"],
  haze: ["pára", "köd", "fog", "háttérbe simulás"],
  glow: ["ragyogás", "glow", "bloom"],
  castlight: ["színes árnyék", "fénycsóva", "cast light"],
  cloud3d: ["felhő", "cloud", "puha tárgy"],
  balloon: ["lufi", "balloon", "gumitest"],
  terrain3d: ["terep", "terrain", "táj", "hegy", "dűne"],
  text: ["szöveg", "text", "felirat"],
  mtext: ["szöveg", "kinetikus", "animált felirat"],
  liquidglass: ["üveg", "glass", "lencse"],
  crt: ["retro", "tévé", "monitor", "crt"],
  pdisp: ["szétesés", "részecske", "szétrobbanó felirat"],
  particles: ["részecske", "particles", "pontfelhő"],
  image: ["kép", "photo", "fotó"],
  lottie: ["lottie", "vektoranimáció"],
  gradient: ["gradiens", "gradient", "színátmenet"],
  obj3d: ["3d", "térbeli", "test"],
  windflame: ["láng", "szél", "flame"],
};
const topicRules = {
  space: ["planet", "space", "galaxy", "nebula", "blackhole", "hyper", "lens"],
  nature: [
    "terrain3d",
    "terrain",
    "skygrad",
    "sun",
    "clouds",
    "cloud3d",
    "haze",
    "aurora",
  ],
  typography: ["text", "mtext", "castlight"],
  fluid: ["liquid", "lava", "ripple", "windflame", "fire"],
  retro: [
    "crt",
    "projector",
    "film",
    "glitch",
    "ascii",
    "halftone",
    "pixelart",
  ],
  studio: ["surface3d", "obj3d", "sdfscene", "bokeh", "liquidglass"],
  abstract: ["plasma", "kali", "julia", "cells", "moire", "sacred", "gyroid"],
};
const records = new Map();
let sourceRowCount = 0;
for (const [cat, list] of Object.entries(raw.shelves))
  for (const row of list) {
    sourceRowCount++;
    const e = raw.effects[row.type];
    const role =
      row.type === "group"
        ? "recipe"
        : row.motion
          ? "motion"
          : e?.kind === "fx"
            ? "appearance"
            : "element";
    const identity = JSON.stringify([
      role,
      row.type,
      row.motion || null,
      row.title,
    ]);
    const proposedId = `draft-${role}-${hash(identity).slice(0, 16)}`;
    const current = records.get(proposedId);
    const source = { category: cat, index: row.legacyIndex, title: row.title };
    if (current) {
      current.sourceRows.push(source);
      continue;
    }
    const familyId = row.motion
      ? `motion:${row.motion}`
      : row.type === "group"
        ? `recipe:${hash(row.title).slice(0, 12)}`
        : row.type === "shape"
          ? `element:shape:${row.params?.kind?.v ?? 0}`
          : `${role}:${row.type}`;
    const acceptedTypes = row.type === "balloon" ? ["cloud3d"] : e?.host || [];
    const topics = Object.entries(topicRules)
      .filter(([, types]) => types.includes(row.type))
      .map(([tag]) => tag);
    records.set(proposedId, {
      proposedId,
      title: row.title,
      role,
      familyId,
      type: row.type,
      motion: row.motion || null,
      topics,
      keywords: aliases[row.type] || [],
      description: row.motion
        ? raw.motions[row.motion]?.desc
        : e?.desc || "Szerkeszthető receptcsoport.",
      origin: "builtin",
      availability: "builtin-source",
      applyAction:
        role === "appearance"
          ? "apply-to-target-or-explicit-filter"
          : role === "motion"
            ? "attach-motion"
            : role === "recipe"
              ? "insert-recipe"
              : "insert-element",
      accepts: acceptedTypes,
      compatibilityStatus: acceptedTypes.length
        ? "type-limited"
        : "requires-runtime-policy",
      special: row.special,
      sourceRows: [source],
    });
  }
const tracked = [
  "app/src/library.ts",
  "app/src/recipes.ts",
  "app/src/motion.ts",
  "app/src/effects/index.ts",
  "app/src/state.ts",
  "app/src/presets.ts",
  "app/src/shelf.ts",
];
const fingerprints = {};
for (const file of tracked)
  fingerprints[file] = hash(await readFile(join(root, file)));
const result = {
  schemaVersion: 1,
  snapshotDate: "2026-10-18",
  declarativeOnly: true,
  runtimeVerified: false,
  appVersion: JSON.parse(await readFile(join(root, "app/package.json"), "utf8"))
    .version,
  sourceRowCount,
  uniqueRecordCount: records.size,
  effectTypeCount: Object.keys(raw.effects).length,
  recipeCount: raw.recipes.length,
  motionCount: Object.keys(raw.motions).length,
  fingerprints,
  notes: [
    "Proposed identifiers and tags need integrator review before production.",
    "Empty accepts does not mean every target is compatible.",
    "No browser IndexedDB own-library items are included.",
  ],
  records: [...records.values()],
};
await writeFile(target, JSON.stringify(result, null, 2) + "\n");
console.log(
  `${result.sourceRowCount} rows -> ${result.uniqueRecordCount} proposed records; snapshot written. No runtime validation.`,
);
