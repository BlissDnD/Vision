// Builds a portable, offline single HTML using Vel's existing esbuild dependency.
import {build} from '../../app/node_modules/esbuild/lib/main.js';
import {readFile,writeFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('.',import.meta.url));
const result=await build({entryPoints:[root+'src/demo.ts'],bundle:true,write:false,format:'iife',target:'es2021'});
const css=(await Promise.all(['tokens','components','demo'].map(n=>readFile(root+'src/'+n+'.css','utf8')))).join('\n');
await writeFile(root+'index.html',`<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Vel · Material 3 starter</title><style>${css}</style><body><div id="demo"></div><script>${result.outputFiles[0].text}</script></body></html>`);
console.log('Built prototypes/material-ui/index.html');
