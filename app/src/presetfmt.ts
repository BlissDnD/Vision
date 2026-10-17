/** P1: the preset / scene JSON format as text, generated from the code (effect list, params, palettes, recipes,
 *  GLSL helpers). Pure (no DOM, no GL): the build also runs it in Node to write docs/VEL-PRESET-FORMATUM.md. */
import { EFFECTS, CP_MAX } from './effects/index';
import { HEAD } from './glsl';
import { PALS } from './palettes';
import { RECIPES } from './recipes';

/** Layer types a spec may not use (heavy or interactive ones). 'custom' is allowed here; the Claude description path also skips it. */
export const PRESET_SKIP = new Set(['blob', 'sky', 'obj3d', 'gyroid', 'ascii']);
export const CODE_MAX = 20000;
export function catalogText(skip: Set<string>): string {
  const L: string[] = [];
  for (const [k, d] of Object.entries(EFFECTS)) {
    if (skip.has(k)) continue;
    const ps = d.params.map((p: any) => p.type === 'sel' ? `${p.k}=${p.opts.map((o: string, i: number) => i + ':' + o).join('|')}` : p.type === 'color' ? `${p.k}=#hex` : `${p.k}=${p.min}..${p.max}(${p.def})`).join('; ');
    L.push(`${k} [${d.kind}] ${d.name}: ${k === 'custom' ? '(own GLSL, see SHADER CONTRACT; default sliders ' + ps + ')' : ps}`);
  }
  return L.join('\n');
}
const HELP: Record<string, string> = {
  P: 'pixel position in layer space: centered, y up, picture height = 1 (y -0.5..0.5); follows the layer x/y/size/rotation',
  rot: '2D rotation matrix', hash: 'random 0..1 from a 2D point', noise: 'smooth value noise 0..1', fbm: '5-octave fractal noise 0..1',
  pal: 'colour from the layer palette (t any number; the user picks the palette)', ASP: 'vec2(aspect, 1)', IN: 'premultiplied colour of everything below this layer at uv (0..1 screen uv: vUv)',
  luma: 'brightness of a colour', unp: 'un-premultiply a colour', hueShift: 'rotate hue by h turns', easeF: 'ease curve x 0..1, k = ease index (see Ease indices)',
  easeSpring: 'spring curve', easeBounce: 'bounce curve', mfr: 'mirrored repeat', toQ: 'screen uv → layer space', toUV: 'layer space → screen uv', TXUV: '(internal)',
};
/** The GLSL contract of a custom layer, read from the shared shader header. */
export function shaderContract(): string {
  const fns: string[] = [];
  for (const line of HEAD.split('\n')) {
    const m = line.match(/^(float|vec2|vec3|vec4|mat2|mat3)\s+(\w+)\(([^)]*)\)/); if (!m || HELP[m[2]] === '(internal)') continue;
    fns.push(`  ${m[1]} ${m[2]}(${m[3]})${HELP[m[2]] ? ' — ' + HELP[m[2]] : ''}`);
  }
  const defs = [...HEAD.matchAll(/#define (\w+) ([\d.]+)/g)].map(m => m[1]).join(', ');
  return `SHADER CONTRACT (layer type "custom"):
- "code" is GLSL ES 3.00 that defines  vec4 fx(){ … }  — it runs for every pixel and returns PREMULTIPLIED RGBA (rgb already multiplied by alpha; alpha 1 = opaque, 0 = transparent so lower layers show).
- Do NOT write #version, precision, uniforms, main() or out variables: they exist already. You may add your own helper functions and consts above fx().
- Available: float uTime (seconds, scene time), vec2 uRes (pixels), vec2 vUv (0..1 screen uv), ${defs}, and the helpers:
${fns.join('\n')}
- Sliders: "sliders":[{"k":"speed","l":"Sebesség","min":0,"max":2,"def":1},{"k":"tint","l":"Szín","color":true,"def":"#ff8800"}] (max ${CP_MAX}; k = letters/digits/_ starting with a letter). Each slider is a uniform named p_<k> (float, or vec3 for color:true); the user can animate it. Without "sliders" the shader gets p_a, p_b, p_c, p_d (0..1).
- Set slider values or keyframes in "p" like for any layer: "p":{"speed":1.2} or {"speed":{"k":[…]}}.
- Keep it light: at most ~64 loop iterations per pixel, no nested raymarching. Use smoothstep for anti-aliased edges. Max ${CODE_MAX} characters.`;
}
export interface FmtOpt { W: number; H: number; dur: number; custom: boolean; macros: boolean }
/** Shared OUTPUT SHAPE + rules + catalog (used by the Claude description prompt and the ChatGPT instruction). */
export function specBody(o: FmtOpt): string {
  const ax = (o.W / o.H / 2).toFixed(2);
  const skip = o.custom ? PRESET_SKIP : new Set([...PRESET_SKIP, 'custom']);
  return `OUTPUT SHAPE:
{"name":"short title","dur":${o.dur},"baseRecipe":null|"<recipe name>","cam":null|{"x":N|K,"y":N|K,"zoom":N|K,"focus":N,"ap":N,"roll":N|K},
 "layers":[ {"type":"<effect key>","name":"…","blend":"normal|add|screen|multiply|overlay","opacity":0..1,"x":N|K,"y":N|K,"s":N|K,"r":N|K,"z":N,"clip":false,"maskOnly":false,"pal":0..${PALS.length - 1},
   "text":{"str":"…","font":"Bricolage Grotesque|Instrument Sans|Fraunces|Cinzel|Unbounded|Syne|Orbitron|Major Mono Display|Bodoni Moda","weight":"400|600|700|800","align":"left|center|right"},
   "tm":{"in":0..8,"inAt":sec,"inDur":sec,"out":0..8,"outAt":sec,"outDur":sec,"ease":0..11,"fps":0|8|12|24},
   "p":{"<param>":N|K, …}${o.custom ? `,
   "code":"<GLSL, only for type custom>","sliders":[…only for type custom…]` : ''}} ]${o.macros ? `,
 "macros":[ {"l":"Big control label","v":0..1,"t":[[layerIndex,"p.<param>",from,to], …]} ]` : ''}}
N = number. K = keyframed value: {"k":[{"t":sec,"v":N,"e":ease},…]} (e = curve of the segment starting at that key).
Layers are listed BOTTOM to TOP (first = background). Use only effect keys and params from the catalog; omit params you keep at default.
Coordinates: x from -${ax} (left) to ${ax} (right), y from -0.5 (bottom) to 0.5 (top); s = size (1 = default; text layers ~0.06–0.25); r = degrees; z = depth for the camera (0 = picture plane, positive = farther, -1 = near), only matters when "cam" is set.
Masking: a layer with "clip":true only shows inside the nearest non-clip layer below it (e.g. a shape or bento with "maskOnly":true or visible).
Ease indices: 0 soft, 1 strong, 3 in-out, 4 linear, 5 spring soft, 6 spring bouncy, 7 back, 8 elastic, 9 bounce, 10 expo, 11 steps.
tm.in/out moves: 0 none, 1 fade, 2 rise, 3 sink, 4 from left, 5 from right, 6 zoom in, 7 zoom out, 8 pop.
Titles: use "mtext" (animated text) with p.anim/start/dur/stagger. Transitions over everything below: "reveal". Film look: "projector". Grids/cards: "bento". Skies/landscapes: skygrad, sun, clouds, shape kind 13 (ridge, maskOnly) + terrain (clip), haze. Keep the timeline within ${o.dur} s and make motion feel designed: staggered entrances, spring easing, one clear focal point.
${o.macros ? `Macros (optional, 2–4): big group controls shown to the user like the built-in recipes. Each target is [layerIndex (0 = first layer in "layers"), path, value at 0, value at 1]; path "p.<param>" (a param of that layer), "n.<x|y|s|r|opacity|hue|spin>" (placement), or "a:p.<param>" (the LFO depth of that param). One macro may move several params at once (e.g. "Energia" = speed + glow). "v" = start position 0..1.
` : ''}baseRecipe (optional, placed under your layers): one of ${RECIPES.map((r: any) => r.n).join(', ')}.
Palettes (pal): ${PALS.map((p: any, i: number) => i + ' ' + p.n).join(', ')}.
${o.custom ? '\n' + shaderContract() + '\n' : ''}
CATALOG (key [kind] name: params; sel params list index:label):
${catalogText(skip)}`;
}
/** The instruction the user pastes into ChatGPT once; afterwards they just describe presets there. */
export function chatPrompt(W: number, H: number, dur: number): string {
  return `You are a preset designer for Vel, a layered WebGL2 motion-design editor. In the following messages I will describe presets or scenes (often in Hungarian). For EVERY request reply with exactly ONE JSON object in a single \`\`\`json code block, nothing else. Write on-screen text and the "name" / slider / macro labels in my language. If I paste an error message from Vel, fix that preset and send the whole corrected JSON again.

A preset is a group of 1–10 layers (bottom to top) plus optional 2–4 big controls ("macros"). For a look the catalog cannot make, write a "custom" layer with your own GLSL shader and named sliders.

${specBody({ W, H, dur, custom: true, macros: true })}`;
}
/** docs/VEL-PRESET-FORMATUM.md (written by the build, so it never goes stale). */
export function presetDoc(build: string): string {
  return `# Vel preset-formátum (generált)

> Ezt a fájlt a \`npm run build\` írja a kódból (\`app/src/presetfmt.ts\`), kézzel ne szerkeszd. Build: ${build}.

## Mire való
- **Projekt → Utasítás ChatGPT-nek**: az alábbi szöveg kerül a vágólapra (az aktuális vászonmérettel és hosszal). Egyszer beilleszted a ChatGPT-be, utána csak leírod, milyen presetet kérsz.
- **Projekt → Preset beillesztése**: a ChatGPT JSON-válaszát (vagy egy \`.json\` fájlt) ide teszed. A Vel ellenőrzi (ismeretlen effekt, paraméter, csúszka, vezérlő kimarad, és megmondja, mi), lefordítja a saját shadert, megméri a gépigényt, előnézetet mutat, majd visszavonhatóan beépíti, vagy a **saját könyvtárba** menti.
- A **saját könyvtár** a böngészőben tartósan tárolódik (IndexedDB), fájlba kimenthető és visszatölthető; a projektfájl a benne használt elemeket is viszi.

## A saját könyvtár eleme
\`{id, kind:'preset'|'shader'|…, cat:<polc kulcsa>, name, created, data:{item, cam?, dur?, assets?}, thumb}\` · könyvtárfájl: \`{app:'vel', kind:'userlib', v:1, items:[…]}\`.
Polcok (cat): ${['recipes', 'gen', 'shapes', '3d', 'fx', 'motion', 'particles', 'world', 'media'].join(', ')}.

## Az utasítás teljes szövege (1920 × 1080, 8 mp)
\`\`\`\`text
${chatPrompt(1920, 1080, 8)}
\`\`\`\`
`;
}
