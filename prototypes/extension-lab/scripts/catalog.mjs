/** Rebuild the handoff catalog from authored module metadata. */
import fs from "node:fs/promises";
const names = [
  "Térbeli formaműveletek",
  "Hálósimítás",
  "Matrica 3D tárgyon",
  "Kontúr térbelivé alakítása",
  "Görbére hajlítás",
  "Összeolvadó térbeli formák",
  "Felületre szórás",
  "SVG import",
  "Font és betűkontúrok",
  "Vektoros görbesimítás",
  "Sík formaműveletek",
  "Kontúr háromszögelése",
  "Voronoi mozaik",
  "Saját 3D shaderanyag",
  "Sík tükör",
  "Környezeti fény előkészítése",
  "Térbeli mélyedésárnyék",
  "LUT színprofil",
  "Érzékelésalapú gradiens",
  "Paletta és kontraszt",
  "Kamera célzása",
  "Csontlánc végpontja",
  "Nebula részecskék",
  "Merevtestek Cannon motorral",
  "GPU részecskeállapot",
  "Bézier sebességgörbe",
  "Explicit idejű tween",
  "Hanghullám",
  "Hangjellemzők",
  "Metronóm",
  "Gyors térbeli kijelölés",
  "GLB optimalizálás",
  "Háló egyszerűsítése",
  "Sok azonos tárgy",
  "Közös tárgyrajzolás",
  "WebGL képkockavizsgáló",
  "WebGL hibakereső",
  "Átrendezhető eszköztár",
  "Állítható panelek",
  "Növényi atlasz",
  "Füstatlasz",
  "Poly Haven kép és HDR",
  "PBR anyagimport",
  "Részecskeatlasz",
  "Hengeres élő szöveg",
  "Útvonalas cső",
  "Változó vastagságú vonal",
  "Üveganyag",
  "Quarks részecskék",
  "Áramló festékmező",
  "Tükröződő víz",
  "Seedelt makettváros",
  "Procedurális zaj",
  "Utófeldolgozás",
  "Merevtestek Rapier motorral",
  "Folyamatos videóexport",
  "Színválasztó",
  "Mozgáspálya illesztése",
  "DOM transzformáció",
  "Térbeli fogantyú",
  "Modellanimáció mintavétele",
  "GLB import",
  "Színkerék",
];
const deps = {
  1: "three-bvh-csg",
  2: "three-subdivide",
  9: "opentype.js",
  10: "paper",
  11: "polygon-clipping",
  12: "earcut",
  13: "d3-delaunay",
  14: "three-custom-shader-material",
  19: "culori",
  20: "chroma-js",
  21: "camera-controls",
  23: "three-nebula",
  24: "cannon-es",
  26: "bezier-easing",
  27: "@tweenjs/tween.js",
  28: "wavesurfer.js",
  29: "meyda",
  30: "tone",
  31: "three-mesh-bvh",
  32: "@gltf-transform/core",
  33: "meshoptimizer",
  36: "spectorjs",
  37: "webgl-lint",
  38: "sortablejs",
  39: "split.js",
  45: "troika-three-text",
  47: "meshline",
  48: "@pmndrs/vanilla",
  49: "three.quarks",
  54: "postprocessing",
  55: "@dimforge/rapier3d-compat",
  56: "mediabunny",
  57: "@melloware/coloris",
  58: "fit-curve",
  59: "moveable",
  63: "@jaames/iro",
};
const sources = {
  40: "https://kenney.nl/assets/foliage-sprites",
  41: "https://kenney.nl/assets/smoke-particles",
  42: "https://polyhaven.com/license",
  43: "https://docs.ambientcg.com/license/",
  44: "https://kenney.nl/assets/particle-pack",
  50: "https://github.com/PavelDoGreat/WebGL-Fluid-Simulation",
  51: "https://github.com/mrdoob/three.js",
  52: "https://kenney.nl/assets/city-kit-suburban",
  53: "https://github.com/ashima/webgl-noise",
};
const manifest = JSON.parse(await fs.readFile("manifest.json"));
for (const entry of manifest) {
  const dep = deps[entry.id] || "three",
    pkg = JSON.parse(await fs.readFile(`node_modules/${dep}/package.json`));
  entry.title = names[entry.id - 1];
  entry.status = "headless-bootstrap-demonstrated; not integrated";
  entry.validation = "VALIDATION.md";
  entry.dependency = dep;
  entry.version = pkg.version;
  entry.license = [40, 41, 42, 43, 44, 52].includes(entry.id)
    ? "CC0 assets (user-supplied); adapter original"
    : entry.id === 50
      ? "Original implementation (not Pavel source)"
      : entry.id === 53
        ? "MIT"
        : pkg.license;
  const repo =
    typeof pkg.repository === "string" ? pkg.repository : pkg.repository?.url;
  entry.source =
    sources[entry.id] ||
    repo?.replace(/^git\+/, "").replace(/\.git$/, "") ||
    "https://github.com/mrdoob/three.js";
  entry.runtime = [36, 37].includes(entry.id)
    ? "developer-browser"
    : entry.runtime;
}
await fs.writeFile("manifest.json", JSON.stringify(manifest, null, 2) + "\n");
await fs.writeFile(
  "registry.mjs",
  "/** Lazy registry; no module executes until selected. */\nexport const registry=[\n" +
    manifest
      .map(
        (e) =>
          `{id:${e.id},title:${JSON.stringify(e.title)},load:()=>import("./${e.example}")}`,
      )
      .join(",\n") +
    "\n];\n",
);
const lines = [
  "# A 63 külön modul térképe",
  "",
  "Minden modulhoz külön, futtatható használati példa tartozik az `examples/` mappában. A böngészős import/build nem igazol önmagában vizuális helyességet.",
  "",
  "| # | Modul | API | Függőség | Licenc/forrás |",
  "|---|---|---|---|---|",
];
for (const e of manifest) {
  const source = await fs.readFile(e.module, "utf8");
  const api = [
    ...source.matchAll(/export (?:async )?function (\w+)|export const (\w+)/g),
  ]
    .map((m) => m[1] || m[2])
    .filter((n) => n !== "requirements")
    .join(", ");
  lines.push(
    `| ${e.id} | [${e.title}](${e.module}) · [példa](${e.example}) | ${api} | ${e.dependency} ${e.version} | [${e.license}](${e.source}) |`,
  );
}
await fs.writeFile("CATALOG.md", lines.join("\n") + "\n");
