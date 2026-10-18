// Vite: fast dev server with HMR-less reloads (`npm run dev`) and an optional single-file build (`npm run build:vite`).
// The canonical production build is scripts/build.mjs (esbuild), which also emits the artifact fragment.
import { defineConfig } from 'vite';
import fs from 'node:fs';
import path from 'node:path';
const root = __dirname;
import { viteSingleFile } from 'vite-plugin-singlefile';

export default defineConfig({
  plugins: [viteSingleFile()],
  define: { __BUILD__: JSON.stringify(Date.now().toString(36)), __VERSION__: JSON.stringify(JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8')).version), __BUILT__: JSON.stringify(new Date().toISOString()) },
  build: { target: 'es2021', outDir: 'dist-vite', assetsInlineLimit: 100000000, cssCodeSplit: false },
  server: { open: true },
});
