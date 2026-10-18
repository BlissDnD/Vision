// Writes app/CODEMAP.md: one line per source module (purpose, size, exports, R hooks), generated from the code so it
// never goes stale. Agents read this instead of opening every file. Run: node scripts/codemap.mjs (npm run build runs it too).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
// purpose of modules without a header comment (keep short; a header comment in the file wins)
const DESC = {
  'adaptive.ts': 'adaptive preview quality (fps-driven resolution)', 'blob.ts': 'Blob-követés: tracking + overlay drawing',
  'boot.ts': 'startup: autosave restore, first render, shelf build (imported last)', 'controls.ts': 'inspector widgets: ctlSlider/Select/Color/Switch, section, fxListUI (effect icon row), palette picker',
  'cost.ts': 'COST table, itemCost/sceneLoad, compile-error flag', 'describe.ts': 'Claude description → scene (descPrompt) and buildFromSpec (spec → items, dropped list, macros, custom)',
  'dom.ts': '$ and h() DOM helpers', 'evaluation.ts': 'value evaluation: ev() (keys, LFO, signals, links), keyframes, setVal (Animálás mode), key editor',
  'gl.ts': 'WebGL2 context, compile/link, getProg/progKey (per-layer program cache), fixed programs, targets/textures', 'glsl.ts': 'shared GLSL header (HEAD: uniforms + helpers P(), pal(), noise…) and vertex shader',
  'history.ts': 'snapshot/commit/undo/redo, autosave, projectJSON/applyProject/loadProject', 'inspector.ts': 'right panel: renderInsp (tabs Tartalom/Szín/Mozgás/Effektek/Elhelyezés), timing, sdf objects',
  'itemops.ts': 'insert/remove/duplicate/group items, addFromLib/attachFx', 'keyboard.ts': 'keyboard shortcuts', 'layers.ts': 'layer tree (left column): rows, badges, drag/drop',
  'library.ts': 'built-in shelves: LIB[cat] entries {name, make}, CATS, CAT_HINT', 'loop.ts': 'frame loop (rAF): render, gizmo, live control sync, markDirty',
  'macros.ts': 'group macros (Vezérlők): pathObj, macroApply/macroRead', 'main.ts': 'import order = init order (a module may only use modules imported before it at top level)',
  'modals.ts': 'modal dialog, toast, help, Projekt dialog (projModal), showCode, image file input', 'output.ts': 'export: PNG/MP4 (WebCodecs), saveFile',
  'palettes.ts': 'PALS colour palettes, hexRGB, ease names', 'popovers.ts': 'Look / camera / export popovers', 'random.ts': 'Random (moods, seeds)',
  'recipes.ts': 'RECIPES (built-in recipe groups) + makeRecipe', 'render.ts': 'renderScene/renderList/drawFx/present, camera, layer transforms, light uniforms, outSize',
  'runtime.ts': 'R: shared mutable runtime state and cross-module hooks', 'shelf.ts': 'library shelf UI: categories, cards, search, thumbnails, audition', 'signals.ts': 'audio / beat signals',
  'stage.ts': 'canvas interaction: drag/scale/rotate gizmo, tools, wheel, fit', 'state.ts': 'st (project), makeLayer/makeGroup/normalize, walk/findItem/sel, looks, light',
  'text.ts': 'text rasterising (textCache), image assets (loadAsset)', 'thumbs.ts': 'thumbnail rendering (renderThumb, thumbOf)', 'timeline.ts': 'timeline + Sávok tracks, paramList, key moves',
  'transport.ts': 'play/pause/seek, syncCtl', 'types.ts': 'data model types (Layer, NParam, EffectDef, Project)',
  'effects/index.ts': 'EFFECTS registry, BASE params, paramsOf/pdefOf (per-layer params), animKeysOf/mainDupOf, icons, DEFAULT_CODE',
  'effects/helpers.ts': 'S/SEL/COL param constructors, shared GLSL libs',
};
const TASKS = [
  ['New effect (Forrás/Megjelenés)', 'effects/<group>.ts (kind, params, GLSL fx()), cost.ts COST, library.ts LIB entry; test tests/<slice>.js'],
  ['Inspector / panel layout', 'inspector.ts renderInsp, controls.ts widgets, style.css'],
  ['Library shelf / own items', 'library.ts, shelf.ts, presets.ts (own items), userlib.ts (store)'],
  ['Project format / save / migration', 'history.ts (projectJSON/applyProject), migrate.ts (+ old-project test), state.ts normalize'],
  ['Time / playback / export', 'time.ts, sim.ts, transport.ts, loop.ts, output.ts'],
  ['Keyframes / values / LFO', 'evaluation.ts (ev, setVal), timeline.ts, animate.ts, retime.ts'],
  ['Canvas interaction', 'stage.ts, pick.ts, linkcord.ts, spinegrips.ts, textbar.ts'],
  ['Links / variants', 'variants.ts, variantsui.ts, linkcord.ts'],
  ['Rendering / GL', 'render.ts, gl.ts, glsl.ts, mesh3d.ts (real meshes), cloud.ts, partfx.ts'],
  ['Presets / ChatGPT format', 'presetfmt.ts (text), describe.ts buildFromSpec, presets.ts'],
];
const files = [];
const walk = d => { for (const f of fs.readdirSync(d).sort()) { const p = path.join(d, f); if (fs.statSync(p).isDirectory()) walk(p); else if (/\.ts$/.test(f) && !f.startsWith('.')) files.push(p); } };
walk(path.join(root, 'src'));
const rows = files.map(p => {
  const rel = path.relative(path.join(root, 'src'), p).replace(/\\/g, '/'); const s = fs.readFileSync(p, 'utf8');
  const head = s.match(/^\s*\/\*\*?([\s\S]*?)\*\//); let desc = DESC[rel] || '';
  if (head) desc = head[1].split('\n').map(l => l.replace(/^\s*\*\s?/, '').trim()).filter(Boolean).join(' ').replace(/\s+/g, ' ');
  if (!desc && rel.startsWith('effects/')) { const keys = [...s.matchAll(/^\s*['"]?(\w+)['"]?\s*:\s*\{\s*kind\s*:/gm)].map(m => m[1]); if (keys.length) desc = 'effect defs: ' + keys.join(', '); }
  if (desc.length > 170) desc = desc.slice(0, 167).replace(/\s\S*$/, '') + ' …';
  const ex = [...new Set([...s.matchAll(/export\s+(?:async\s+)?(?:function|const|let|class|interface|type)\s+(\w+)/g)].map(m => m[1]))];
  const hooks = [...new Set([...s.matchAll(/\bR\.(\w+)\s*=(?!=)/g)].map(m => m[1]))];
  return `| \`${rel}\` | ${(s.length / 1024).toFixed(0)} | ${desc.replace(/\|/g, '/')} | ${ex.slice(0, 14).join(', ')}${ex.length > 14 ? ` … (+${ex.length - 14})` : ''} | ${hooks.slice(0, 8).join(', ')}${hooks.length > 8 ? ' …' : ''} |`;
});
const out = `# Vel kódtérkép (generált)

> \`npm run build\` / \`node scripts/codemap.mjs\` írja a forrásból; kézzel ne szerkeszd. A modul célját a fájl elején lévő megjegyzés adja (ha nincs, a \`scripts/codemap.mjs\` DESC táblája).
> **Használat:** feladat előtt ezt olvasd, utána csak az érintett fájlokat nyisd meg (vagy \`grep -n\` a kért függvényre). Ne olvass végig modulokat feleslegesen.

## Feladat → hol
| Feladat | Fájlok |
|---|---|
${TASKS.map(([a, b]) => `| ${a} | ${b} |`).join('\n')}

## Modulok (${files.length} fájl)
| Fájl | KB | Cél | Exportok | R-hookok (beállítja) |
|---|---|---|---|---|
${rows.join('\n')}
`;
fs.writeFileSync(path.join(root, 'CODEMAP.md'), out);
console.log(`CODEMAP.md: ${files.length} modules`);
