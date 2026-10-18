// U5 colour math: hex/RGB/HSV, OKLab/OKLCH (Björn Ottosson's formulas, as in culori), perceptual gradient sampling,
// WCAG contrast (as in chroma-js) and simple OKLCH harmonies. Pure functions, no DOM/GL.
export type RGB = [number, number, number];
const cl = (x: number) => Math.min(1, Math.max(0, x));
export function hexToRgb(hx: string): RGB { let s = String(hx || '').replace('#', ''); if (s.length === 3) s = [...s].map(c => c + c).join(''); const n = parseInt(s.slice(0, 6), 16) || 0; return [(n >> 16 & 255) / 255, (n >> 8 & 255) / 255, (n & 255) / 255]; }
export const hexAlpha = (hx: string) => { const s = String(hx || '').replace('#', ''); return s.length === 8 ? (parseInt(s.slice(6), 16) || 0) / 255 : 1; };
export function rgbToHex(c: RGB, a = 1) { const h = (x: number) => Math.round(cl(x) * 255).toString(16).padStart(2, '0'); return '#' + h(c[0]) + h(c[1]) + h(c[2]) + (a < .999 ? h(a) : ''); }
export function hsvToRgb(h: number, s: number, v: number): RGB { const f = (n: number) => { const k = (n + h * 6) % 6; return v - v * s * Math.max(0, Math.min(k, 4 - k, 1)); }; return [f(5), f(3), f(1)]; }
export function rgbToHsv([r, g, b]: RGB): [number, number, number] { const mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn; let h = 0;
  if (d) h = mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4; h = (h / 6 + 1) % 1; return [h, mx ? d / mx : 0, mx]; }
const lin = (x: number) => x <= .04045 ? x / 12.92 : Math.pow((x + .055) / 1.055, 2.4);
const gam = (x: number) => x <= .0031308 ? 12.92 * x : 1.055 * Math.pow(x, 1 / 2.4) - .055;
export function rgbToOklab([r, g, b]: RGB): RGB { r = lin(r); g = lin(g); b = lin(b);
  const l = Math.cbrt(.4122214708 * r + .5363325363 * g + .0514459929 * b), m = Math.cbrt(.2119034982 * r + .6806995451 * g + .1073969566 * b), s = Math.cbrt(.0883024619 * r + .2817188376 * g + .6299787005 * b);
  return [.2104542553 * l + .793617785 * m - .0040720468 * s, 1.9779984951 * l - 2.428592205 * m + .4505937099 * s, .0259040371 * l + .7827717662 * m - .808675766 * s]; }
export function oklabToRgb([L, a, b]: RGB): RGB { const l = (L + .3963377774 * a + .2158037573 * b) ** 3, m = (L - .1055613458 * a - .0638541728 * b) ** 3, s = (L - .0894841775 * a - 1.291485548 * b) ** 3;
  return [cl(gam(4.0767416621 * l - 3.3077115913 * m + .2309699292 * s)), cl(gam(-1.2684380046 * l + 2.6097574011 * m - .3413193965 * s)), cl(gam(-.0041960863 * l - .7034186147 * m + 1.707614701 * s))]; }
export const toOklch = (c: RGB): RGB => { const [L, a, b] = rgbToOklab(c); return [L, Math.hypot(a, b), (Math.atan2(b, a) / (2 * Math.PI) + 1) % 1]; };
export const fromOklch = ([L, C, h]: RGB): RGB => oklabToRgb([L, C * Math.cos(h * 2 * Math.PI), C * Math.sin(h * 2 * Math.PI)]);

/** Mix two colours: mode 0 = perceptual (OKLab, no grey middle), 1 = straight sRGB. */
export function mixColor(a: RGB, b: RGB, t: number, mode = 0): RGB {
  if (mode === 1) return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
  const A = rgbToOklab(a), B = rgbToOklab(b); return oklabToRgb([A[0] + (B[0] - A[0]) * t, A[1] + (B[1] - A[1]) * t, A[2] + (B[2] - A[2]) * t]);
}
/** Gradient stops [[pos 0..1, '#hex'], …] (any order) sampled at x. */
export function gradAt(stops: [number, string][], x: number, mode = 0): RGB {
  const s = [...stops].sort((p, q) => p[0] - q[0]); if (!s.length) return [0, 0, 0];
  if (x <= s[0][0]) return hexToRgb(s[0][1]); const last = s[s.length - 1]; if (x >= last[0]) return hexToRgb(last[1]);
  for (let i = 0; i < s.length - 1; i++) if (x <= s[i + 1][0]) { const d = s[i + 1][0] - s[i][0]; return mixColor(hexToRgb(s[i][1]), hexToRgb(s[i + 1][1]), d > 0 ? (x - s[i][0]) / d : 0, mode); }
  return hexToRgb(last[1]);
}
/** N evenly spaced samples (flat RGB array) — what the shaders receive (uG[16]). */
export function gradSamples(stops: [number, string][], mode = 0, n = 16) { const o = new Float32Array(n * 3); for (let i = 0; i < n; i++) o.set(gradAt(stops, i / (n - 1), mode), i * 3); return o; }
export function gradCSS(stops: [number, string][], mode = 0) { const k = 12, parts: string[] = []; for (let i = 0; i <= k; i++) parts.push(`${rgbToHex(gradAt(stops, i / k, mode))} ${(i / k * 100).toFixed(1)}%`); return `linear-gradient(90deg,${parts.join(',')})`; }

/** WCAG relative luminance and contrast ratio. */
export const luminance = (c: RGB) => .2126 * lin(c[0]) + .7152 * lin(c[1]) + .0722 * lin(c[2]);
export function contrast(a: RGB, b: RGB) { const x = luminance(a), y = luminance(b); return (Math.max(x, y) + .05) / (Math.min(x, y) + .05); }
/** Shift lightness (OKLCH) away from bg until the ratio reaches target (4.5 = readable). */
export function readableOn(fg: RGB, bg: RGB, target = 4.5): RGB {
  const [L, C, h] = toOklch(fg), up = luminance(bg) < .3; let best = fg;
  for (let i = 1; i <= 20; i++) { const c = fromOklch([cl(up ? L + (1 - L) * i / 20 : L * (1 - i / 20)), C, h]); best = c; if (contrast(c, bg) >= target) break; }
  return best;
}
/** OKLCH harmonies around a base colour: 'komp', 'triad', 'analog', 'tonal' → 5 colours. */
export function harmony(base: RGB, kind: string): RGB[] {
  const [L, C, h] = toOklch(base), H = (d: number, l = L, c = C) => fromOklch([cl(l), c, (h + d + 1) % 1]);
  if (kind === 'komp') return [H(0, L * .7), H(0), H(0, Math.min(.95, L + .2)), H(.5), H(.5, L * .75)];
  if (kind === 'triad') return [H(0), H(1 / 3), H(2 / 3), H(0, L * .6), H(1 / 3, Math.min(.95, L + .2), C * .6)];
  if (kind === 'analog') return [H(-.083), H(-.042), H(0), H(.042), H(.083)];
  return [0, 1, 2, 3, 4].map(i => fromOklch([.2 + i * .17, C * (1 - Math.abs(i - 2) * .2), h]));
}
