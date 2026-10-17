// Vite: fast dev server with HMR-less reloads (`npm run dev`) and an optional single-file build (`npm run build:vite`).
// The canonical production build is scripts/build.mjs (esbuild), which also emits the artifact fragment.
import { defineConfig } from 'vite';
import { viteSingleFile } from 'vite-plugin-singlefile';

export default defineConfig({
  plugins: [viteSingleFile()],
  define: { __BUILD__: JSON.stringify(Date.now().toString(36)) },
  build: { target: 'es2021', outDir: 'dist-vite', assetsInlineLimit: 100000000, cssCodeSplit: false },
  server: { open: true },
});
