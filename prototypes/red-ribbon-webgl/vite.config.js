// Single-file build so dist/index.html opens straight from disk (no server needed).
import { defineConfig } from 'vite';
import { viteSingleFile } from 'vite-plugin-singlefile';
export default defineConfig({ plugins: [viteSingleFile()], build: { target: 'es2021' } });
