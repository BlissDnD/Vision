/** Refresh recorded files only after reviewing live changes. Does not grant approvals or update task status. */
import { readFile, writeFile } from "node:fs/promises";
import { resolve, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
const dir = resolve(dirname(fileURLToPath(import.meta.url)), ".."),
  root = resolve(dir, "../.."),
  file = join(dir, "data/source-index.json");
const index = JSON.parse(await readFile(file, "utf8"));
const tracked = new Set(
  execFileSync("git", ["ls-files", "-z"], {
    cwd: root,
    encoding: "utf8",
  }).split("\0"),
);
const dirty = new Set(
  execFileSync("git", ["status", "--porcelain", "-z"], {
    cwd: root,
    encoding: "utf8",
  })
    .split("\0")
    .filter(Boolean)
    .map((s) => s.slice(3)),
);
for (const entry of index.files) {
  const bytes = await readFile(join(root, entry.path));
  entry.sha256 = createHash("sha256").update(bytes).digest("hex");
  entry.bytes = bytes.length;
  entry.tracked = tracked.has(entry.path);
  entry.dirtyAtSnapshot = !entry.tracked || dirty.has(entry.path);
}
index.baseCommit = execFileSync("git", ["rev-parse", "HEAD"], {
  cwd: root,
  encoding: "utf8",
}).trim();
index.appVersion = JSON.parse(
  await readFile(join(root, "app/package.json"), "utf8"),
).version;
await writeFile(file, JSON.stringify(index, null, 2) + "\n");
console.log(
  `Refreshed ${index.files.length} context fingerprints. Review catalog and requirement coverage separately.`,
);
