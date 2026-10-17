// One-shot migration: split the single-file app script into ES modules.
// 1) top-level `let` bindings -> fields of a shared runtime object `R` (so any module can assign them)
// 2) top-level statements grouped into modules by the "/* ===== Section ===== */" markers
// 3) every module exports its declarations and imports what it references from other modules
// 4) report load-time (non-function) cross-module references for TDZ checking
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
const require = createRequire('/opt/node-tools/node_modules/');
const acorn = require('acorn');
const escope = require('eslint-scope');

const [,, inFile, outDir, mapFile] = process.argv;
let src = fs.readFileSync(inFile, 'utf8');

function parse(code) { return acorn.parse(code, { ecmaVersion: 'latest', sourceType: 'script', ranges: true, locations: true }); }
function analyze(ast) { return escope.analyze(ast, { ecmaVersion: 2022, sourceType: 'script', nodejsScope: false, optimistic: false }); }

// ---------- pass 1: let -> R.x ----------
let ast = parse(src);
let sm = analyze(ast);
let gscope = sm.globalScope;
const letNames = new Set();
for (const st of ast.body) if (st.type === 'VariableDeclaration' && st.kind !== 'const') for (const d of st.declarations) letNames.add(d.id.name);
const edits = []; // [start,end,text]
for (const v of gscope.variables) {
  if (!letNames.has(v.name)) continue;
  for (const ref of v.references) {
    const id = ref.identifier;
    if (ref.init) continue; // handled with declarations
    edits.push([id.start, id.end, 'R.' + v.name]);
  }
}
// also implicit references through "through" (unresolved) are not ours
for (const st of ast.body) {
  if (st.type === 'VariableDeclaration' && st.kind !== 'const') {
    const parts = st.declarations.map(d => `R.${d.id.name}=${d.init ? src.slice(d.init.start, d.init.end) : 'undefined'}`);
    // keep inner references rewritten: apply inner edits later by re-parsing; simpler: rewrite initializer text with edits inside range
    edits.push([st.start, st.end, '\u0000DECL' + JSON.stringify(st.declarations.map(d => [d.id.name, d.init ? [d.init.start, d.init.end] : null])) + '\u0000']);
  }
}
function applyEdits(text, eds) {
  eds.sort((a, b) => b[0] - a[0]);
  // drop edits nested inside a DECL edit (handled separately)
  let out = text, lastStart = Infinity;
  for (const [s, e, t] of eds) { if (e > lastStart) continue; out = out.slice(0, s) + t + out.slice(e); lastStart = s; }
  return out;
}
// handle DECL: rewrite initializers with nested ref edits
const declEdits = edits.filter(e => e[2].startsWith('\u0000DECL'));
const refEdits = edits.filter(e => !e[2].startsWith('\u0000DECL'));
const finalEdits = [];
for (const de of declEdits) {
  const decls = JSON.parse(de[2].slice(5, -1));
  const parts = decls.map(([name, rng]) => {
    if (!rng) return `R.${name}=undefined`;
    const inner = refEdits.filter(r => r[0] >= rng[0] && r[1] <= rng[1]).map(r => [r[0] - rng[0], r[1] - rng[0], r[2]]);
    return `R.${name}=` + applyEdits(src.slice(rng[0], rng[1]), inner);
  });
  finalEdits.push([de[0], de[1], parts.join(';') + ';']);
}
for (const r of refEdits) if (!declEdits.some(d => r[0] >= d[0] && r[1] <= d[1])) finalEdits.push(r);
src = applyEdits(src, finalEdits);
src = src.replace(/^"use strict";\s*/, '');

// ---------- pass 2: modules ----------
ast = parse(src); sm = analyze(ast); gscope = sm.globalScope;
const markers = [];
const re = /\/\* ================= (.+?) ================= \*\//g; let m;
while ((m = re.exec(src))) markers.push({ pos: m.index, title: m[1] });
const map = JSON.parse(fs.readFileSync(mapFile, 'utf8')); // [{title-prefix, module}]
function modFor(pos) { let t = 'Prelude'; for (const mk of markers) if (mk.pos <= pos) t = mk.title; const hit = map.find(x => t.startsWith(x.title)); if (!hit) throw new Error('no module for section ' + t); return hit.module; }
const modules = new Map(); // name -> {stmts:[], decl:Set}
const order = [];
const declOwner = new Map();
for (const st of ast.body) {
  const mod = modFor(st.start);
  if (!modules.has(mod)) { modules.set(mod, { stmts: [], decl: new Set() }); order.push(mod); }
  const M = modules.get(mod); M.stmts.push(st);
  const names = [];
  if (st.type === 'VariableDeclaration') for (const d of st.declarations) names.push(d.id.name);
  else if (st.type === 'FunctionDeclaration' || st.type === 'ClassDeclaration') names.push(st.id.name);
  for (const n of names) { M.decl.add(n); declOwner.set(n, mod); }
}
// references
const uses = new Map(), loadUses = new Map();
for (const mod of order) { uses.set(mod, new Set()); loadUses.set(mod, new Set()); }
function stmtOf(pos) { for (const mod of order) for (const st of modules.get(mod).stmts) if (pos >= st.start && pos < st.end) return mod; return null; }
for (const v of gscope.variables) {
  const owner = declOwner.get(v.name); if (!owner) continue;
  for (const ref of v.references) {
    const mod = stmtOf(ref.identifier.start); if (!mod || mod === owner) continue;
    uses.get(mod).add(v.name);
    // load-time if the reference's scope chain reaches global without a function scope
    let s = ref.from; let inFn = false; while (s && s.type !== 'global') { if (s.type === 'function') { inFn = true; break; } s = s.upper; }
    if (!inFn) loadUses.get(mod).add(v.name);
  }
}
// R usage
const usesR = new Set(); for (const mod of order) for (const st of modules.get(mod).stmts) if (/\bR\./.test(src.slice(st.start, st.end))) usesR.add(mod);
// write
fs.mkdirSync(outDir, { recursive: true });
const report = [];
for (const mod of order) {
  const M = modules.get(mod);
  const imps = new Map();
  for (const n of uses.get(mod)) { const o = declOwner.get(n); if (!imps.has(o)) imps.set(o, []); imps.get(o).push(n); }
  let head = '// @ts-nocheck\n';
  if (usesR.has(mod)) head += `import { R } from './runtime';\n`;
  for (const o of order) if (imps.has(o)) head += `import { ${imps.get(o).sort().join(', ')} } from './${o}';\n`;
  let body = '';
  let prevEnd = M.stmts[0].start;
  for (const st of M.stmts) {
    const gap = src.slice(prevEnd, st.start).replace(/\/\* ================= .*? ================= \*\/\n?/g, '');
    let text = src.slice(st.start, st.end);
    if (st.type === 'VariableDeclaration' || st.type === 'FunctionDeclaration' || st.type === 'ClassDeclaration') text = 'export ' + text;
    body += gap + text; prevEnd = st.end;
  }
  fs.writeFileSync(path.join(outDir, mod + '.ts'), head + '\n' + body.trim() + '\n');
  const lt = [...loadUses.get(mod)].map(n => n + '@' + declOwner.get(n)).filter(x => order.indexOf(x.split('@')[1]) > order.indexOf(mod));
  report.push(`${mod}: ${M.stmts.length} st, imports ${uses.get(mod).size}, forward load-time: ${lt.join(' ') || '-'}`);
}
fs.writeFileSync(path.join(outDir, 'runtime.ts'), `// Shared mutable runtime state (formerly top-level \`let\` bindings).\nexport const R: any = {};\n`);
fs.writeFileSync(path.join(outDir, 'main.ts'), order.map(o => `import './${o}';`).join('\n') + '\n');
console.log(report.join('\n'));
fs.writeFileSync(path.join(outDir,'..','graph.json'),JSON.stringify({order,imports:Object.fromEntries(order.map(o=>[o,[...new Set([...uses.get(o)].map(n=>declOwner.get(n)))]])),load:Object.fromEntries(order.map(o=>[o,[...new Set([...loadUses.get(o)].map(n=>declOwner.get(n)))]]))}));
console.log('R fields:', [...letNames].join(','));
