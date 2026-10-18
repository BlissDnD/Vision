/** Compile every module independently, preserving lazy selection in the gallery. */
import { build } from "esbuild";
import { readdir, mkdir, copyFile, rm, cp } from "node:fs/promises";
const entries = (await readdir("modules"))
  .filter((f) => f.endsWith(".mjs"))
  .map((f) => `modules/${f}`);
await rm("dist", { recursive: true, force: true });
await mkdir("dist", { recursive: true });
await build({
  entryPoints: [
    ...entries,
    "gallery.mjs",
    "layouts/gallery.mjs",
    "lint-demo.mjs",
    "tests/browser-checks.mjs",
  ],
  outdir: "dist",
  outExtension: { ".js": ".mjs" },
  outbase: ".",
  bundle: true,
  splitting: true,
  format: "esm",
  platform: "browser",
  target: "es2022",
  sourcemap: true,
  metafile: true,
  legalComments: "linked",
  logLevel: "warning",
  mainFields: ["browser", "module", "main"],
  plugins: [
    {
      name: "browser-only-nodeio-guard",
      setup(b) {
        b.onResolve({ filter: /^node:(fs|path)$/ }, (args) => ({
          path: args.path,
          namespace: "nodeio-guard",
        }));
        b.onLoad({ filter: /.*/, namespace: "nodeio-guard" }, () => ({
          contents:
            "throw new Error('NodeIO is unavailable in this browser package; use WebIO');",
          loader: "js",
        }));
      },
    },
  ],
});
await copyFile("index.html", "dist/index.html");
await copyFile("lint.html", "dist/lint.html");
await mkdir("dist/fixtures", { recursive: true });
await copyFile(
  "fixtures/lab-vector-font.otf",
  "dist/fixtures/lab-vector-font.otf",
);
console.log(`Built ${entries.length} independent modules and gallery.`);

await copyFile("layouts.html", "dist/layouts.html");
await cp("layouts/assets", "dist/layouts/assets", { recursive: true });
await copyFile("layouts/style.css", "dist/layouts/style.css");
