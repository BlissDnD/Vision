/** Preserve installed dependency license/NOTICE files, including transitive packages. */
import fs from "node:fs/promises";
const lock = JSON.parse(await fs.readFile("package-lock.json"));
await fs.mkdir("licenses", { recursive: true });
const rows = [
  "# Third-party packages",
  "",
  "Exact resolutions: package-lock.json. These packages are not original Vel Lab code. License texts below are copied unchanged from the installed packages.",
  "",
  "| Package | Version | Declared license | Notices |",
  "|---|---|---|---|",
];
for (const key of Object.keys(lock.packages)
  .filter((k) => k.startsWith("node_modules/"))
  .sort()) {
  let pkg;
  try {
    pkg = JSON.parse(await fs.readFile(`${key}/package.json`));
  } catch {
    continue;
  }
  const files = (await fs.readdir(key)).filter((f) =>
    /^(LICENSE|LICENCE|NOTICE|COPYING)(\.|$)/i.test(f),
  );
  const links = [];
  for (const file of files) {
    if (!(await fs.stat(`${key}/${file}`)).isFile()) continue;
    const out = `${pkg.name.replaceAll("/", "__")}-${file}`;
    await fs.copyFile(`${key}/${file}`, `licenses/${out}`);
    links.push(`[${file}](licenses/${out})`);
  }
  rows.push(
    `| ${pkg.name} | ${pkg.version} | ${typeof pkg.license === "string" ? pkg.license : JSON.stringify(pkg.license) || "see package source"} | ${links.join(", ") || "See package source"} |`,
  );
}
rows.push(
  "",
  "## Locally adapted code",
  "",
  "- vendor/Water.mjs: Three.js Water, MIT; only lifecycle cleanup was added. Original license in vendor/THREE-LICENSE.txt.",
  "- vendor/ashima-simplex3.mjs: Ashima Arts / Stefan Gustavson GLSL via glsl-noise; glslify export directive removed. Original license in vendor/ASHIMA-LICENSE.txt.",
  "- fixtures/lab-vector-font.otf: original minimal V/E/L contours authored for this lab; CC0.",
  "- 50-fluid-field: original experimental solver, no PavelDoGreat source copied.",
  "- No Kenney/Poly Haven/ambientCG artwork is bundled. Their adapters consume user-supplied downloads.",
);
await fs.writeFile("THIRD-PARTY.md", rows.join("\n") + "\n");
