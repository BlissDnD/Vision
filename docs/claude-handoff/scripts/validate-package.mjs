/** Read-only package/source/DAG validation. No app boot or browser access. */
import { readFile, readdir, stat, writeFile } from "node:fs/promises";
import { resolve, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";
const dir = resolve(dirname(fileURLToPath(import.meta.url)), ".."),
  root = resolve(dir, "../..");
const read = async (name) =>
  JSON.parse(await readFile(join(dir, name), "utf8"));
const backlog = await read("data/backlog.json"),
  snapshot = await read("data/current-library.json"),
  coverage = await read("data/legacy-coverage.json"),
  addons = await read("data/addon-status.json"),
  sources = await read("data/source-index.json");
const ideaRoutes = await read("data/idea-routing.json");
const errors = [],
  checks = [];
const check = (ok, label) => {
  (ok ? checks : errors).push(label);
};
const ids = new Set(backlog.tasks.map((t) => t.id));
check(
  ids.size === 26 && ids.size === backlog.tasks.length,
  "26 unique task cards",
);
for (const task of backlog.tasks) for (const dep of task.conditionalDependencies || []) {
  if (!ids.has(dep.task) || !dep.when) errors.push('Invalid conditional dependency: ' + task.id);
}
const visiting = new Set(),
  done = new Set();
function walk(id) {
  if (done.has(id)) return;
  if (visiting.has(id)) {
    errors.push("Dependency cycle: " + id);
    return;
  }
  visiting.add(id);
  const task = backlog.tasks.find((t) => t.id === id);
  for (const dep of task.dependsOn) {
    if (!ids.has(dep)) errors.push("Missing dependency: " + dep);
    else walk(dep);
  }
  visiting.delete(id);
  done.add(id);
}
backlog.tasks.forEach((t) => walk(t.id));
check(done.size === 26, "Task dependency graph resolved");
for (const t of backlog.tasks) {
  check(!t.implementationApproved, "No fabricated approval: " + t.id);
  try {
    await stat(join(dir, "tasks", t.id + ".md"));
  } catch {
    errors.push("Missing task " + t.id);
  }
  for (const f of t.codeRoutes) {
    try {
      await stat(join(root, f));
    } catch {
      errors.push("Missing source route: " + f);
    }
  }
}
check(snapshot.sourceRowCount === 259, "259 original library entries retained");
check(
  snapshot.records.reduce((n, r) => n + r.sourceRows.length, 0) === 259,
  "Every source row maps to proposed record",
);
check(
  snapshot.records.length === 229 &&
    new Set(snapshot.records.map((r) => r.proposedId)).size === 229,
  "229 unique proposed catalog records",
);
check(
  snapshot.effectTypeCount === 72 &&
    snapshot.recipeCount === 54 &&
    snapshot.motionCount === 6,
  "72 types /54 recipes /6 motions represented",
);
check(
  coverage.rows.length === 44 &&
    new Set(coverage.rows.map((r) => r.sourceKey)).size === 44,
  "44 legacy requirements, including duplicate28 labels preserved",
);
check(
  coverage.rows.every((r) => r.workPackages.every((id) => ids.has(id))),
  "All legacy requirements route to work packages",
);
check(
  ideaRoutes.items.length === 96 &&
    ideaRoutes.items.every((i) => i.workPackages.every((id) => ids.has(id))),
  "All96 new ideas route to existing work packages",
);
check(
  addons.items.length === 65 &&
    addons.items.filter((i) => Number.isInteger(i.id)).length === 63,
  "63 addons +2 layouts mapped",
);
check(
  addons.items.every((r) => ids.has(r.primaryWorkPackage)),
  "Every addon has an existing work package",
);
for (const a of addons.items)
  for (const f of [a.module, a.example].filter(Boolean)) {
    try {
      await stat(join(root, f));
    } catch {
      errors.push("Addon source missing: " + f);
    }
  }
const hash = (s) => createHash("sha256").update(s).digest("hex");
for (const [path, digest] of Object.entries(snapshot.fingerprints)) {
  try {
    check(
      hash(await readFile(join(root, path))) === digest,
      "Current catalog fingerprint " + path,
    );
  } catch {
    errors.push("Fingerprint source missing " + path);
  }
}
let matched = 0;
for (const f of sources.files) {
  try {
    const bytes = await readFile(join(root, f.path));
    if (hash(bytes) !== f.sha256)
      errors.push("Source changed since package snapshot: " + f.path);
    else matched++;
  } catch {
    errors.push("Snapshot source missing: " + f.path);
  }
}
check(
  matched === sources.files.length,
  `Source context fingerprints: ${matched}/${sources.files.length}`,
);
async function markdownFiles(path) {
  const out = [];
  for (const entry of await readdir(path, { withFileTypes: true })) {
    if (entry.name === "repository-context") continue;
    const p = join(path, entry.name);
    if (entry.isDirectory()) out.push(...(await markdownFiles(p)));
    else if (entry.name.endsWith(".md")) out.push(p);
  }
  return out;
}
let links = 0;
for (const f of await markdownFiles(dir)) {
  const s = await readFile(f, "utf8");
  for (const match of s.matchAll(/\[[^\]\n]+\]\(([^)\n]+)\)/g)) {
    const href = match[1].replace(/^<|>$/g, "").split("#")[0];
    if (!href || /^[a-z]+:/i.test(href) || href.includes("<")) continue;
    try {
      await stat(resolve(dirname(f), decodeURI(href)));
      links++;
    } catch {
      errors.push("Broken local link in " + f + ": " + href);
    }
  }
}
check(links > 70, `Local Markdown links resolved: ${links}`);
const report = {
  packageValidationOnly: true,
  runtimeOrGpuVerified: false,
  checks: checks.length,
  sourceFiles: sources.files.length,
  taskCards: ids.size,
  legacyRows: coverage.rows.length,
  addons: addons.items.length,
  localLinks: links,
  errors,
};
await writeFile(
  join(dir, "data/package-validation.json"),
  JSON.stringify(report, null, 2) + "\n",
);
console.log(JSON.stringify(report, null, 2));
if (errors.length) process.exitCode = 1;
