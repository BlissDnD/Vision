// Production build without Vite: esbuild bundles src/main.ts, then the result is
// inlined into two single-file outputs:
//   dist/latomas.html  – artifact fragment (title/meta/style/body/script, no <html> skeleton)
//   dist/index.html    – standalone document for local use / hosting
// Usage: node scripts/build.mjs [--dev]   (--dev: no minify, inline sourcemap)
import * as esbuild from 'esbuild';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dev = process.argv.includes('--dev');
const test = process.argv.includes('--test');
// --test: expose every module's exports as window.__L for the headless test suite (never published)
let entry = path.join(root, 'src/main.ts');
if (test) {
  const mods = [];
  const walk = d => { for (const f of fs.readdirSync(d)) { const p = path.join(d, f); if (fs.statSync(p).isDirectory()) walk(p); else if (f.endsWith('.ts') && !f.startsWith('.')) mods.push(p); } };
  walk(path.join(root, 'src'));
  entry = path.join(root, 'src/.test-entry.ts');
  fs.writeFileSync(entry, `import './main';\n` + mods.map((p, i) => `import * as m${i} from './${path.relative(path.join(root, 'src'), p).replace(/\\/g, '/').replace(/\.ts$/, '')}';`).join('\n') +
    `\n(window as any).__L = Object.assign({}, ${mods.map((_, i) => 'm' + i).join(', ')});\n`);
}
const t0 = Date.now();

const res = await esbuild.build({
  entryPoints: [entry],
  bundle: true,
  format: 'iife',
  target: ['es2021', 'chrome100', 'safari15', 'firefox100'],
  minify: !dev,
  sourcemap: dev ? 'inline' : false,
  legalComments: 'none',
  charset: 'utf8',
  write: false,
  outdir: 'out',
  loader: { '.css': 'css' },
  define: { __BUILD__: JSON.stringify(Date.now().toString(36)) },
  logLevel: 'warning',
});
const js = res.outputFiles.find(f => f.path.endsWith('.js')).text;
const css = (res.outputFiles.find(f => f.path.endsWith('.css')) || { text: '' }).text;

// markup from index.html: everything inside <head> after the viewport meta, and the body without the dev <script>
const idx = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const headInner = idx.slice(idx.indexOf('<head>') + 6, idx.indexOf('</head>'))
  .replace(/<meta charset[^>]*>\s*/i, '').replace(/<meta name="viewport"[^>]*>\s*/i, '')
  .replace(/<style>\[hidden\][^<]*<\/style>\s*/i, '').trim();
const bodyInner = idx.slice(idx.indexOf('<body>') + 6, idx.indexOf('</body>'))
  .replace(/<script type="module"[^>]*><\/script>\s*/i, '').trim();
const safeJs = js.replace(/<\/script/gi, '<\\/script');

const fragment = `${headInner}\n<style>\n${css.trim()}\n</style>\n${bodyInner}\n<script>\n${safeJs}</script>\n`;
const full = `<!doctype html>\n<html lang="hu">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">\n<style>[hidden]{display:none!important}</style>\n${headInner}\n<style>\n${css.trim()}\n</style>\n</head>\n<body>\n${bodyInner}\n<script>\n${safeJs}</script>\n</body>\n</html>\n`;

if (test) { fs.rmSync(entry); fs.mkdirSync(path.join(root, 'dist'), { recursive: true }); fs.writeFileSync(path.join(root, 'dist/latomas.test.html'), fragment); console.log('test build: dist/latomas.test.html'); process.exit(0); }
fs.mkdirSync(path.join(root, 'dist'), { recursive: true });
fs.writeFileSync(path.join(root, 'dist/latomas.html'), fragment);
fs.writeFileSync(path.join(root, 'dist/index.html'), full);
// P1: the preset format doc is generated from the code (src/presetfmt.ts), so it never goes stale
{
  const os = await import('node:os');
  const r2 = await esbuild.build({ entryPoints: [path.join(root, 'src/presetfmt.ts')], bundle: true, format: 'esm', platform: 'node', write: false, outdir: 'out', logLevel: 'warning', loader: { '.css': 'empty' } });
  const tmp = path.join(os.tmpdir(), `vel-presetfmt-${process.pid}.mjs`); fs.writeFileSync(tmp, r2.outputFiles[0].text);
  try { const m = await import(tmp); fs.writeFileSync(path.join(root, '../docs/VEL-PRESET-FORMATUM.md'), m.presetDoc(JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8')).version)); } finally { fs.rmSync(tmp, { force: true }); }
}
const kb = n => (n / 1024).toFixed(0) + ' KB';
console.log(`built in ${Date.now() - t0} ms · js ${kb(js.length)} · css ${kb(css.length)} · dist/latomas.html ${kb(fragment.length)}`);
