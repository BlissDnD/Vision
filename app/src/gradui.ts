// U5 gradient editor: a layer's own colour gradient (L.grad) that replaces its palette in every shader using pal().
// Bar with draggable stops (click = add, double-click = colour, drag away = delete), OKLCH/RGB mode, harmonies,
// own palettes kept per browser (vel.mypals). One commit per finished gesture.
import { h } from './dom';
import { PALS, palJS } from './palettes';
import { gradAt, gradCSS, harmony, hexToRgb, rgbToHex } from './colorutil';
import { openPicker } from './colorpick';
import { commit } from './history';
import { markDirty } from './loop';

const MYK = 'vel.mypals';
export function myPals(): [number, string][][] { try { const a = JSON.parse(localStorage.getItem(MYK) || '[]'); return Array.isArray(a) ? a : []; } catch (_) { return []; } }
function saveMyPal(s: [number, string][]) { try { const a = myPals(); a.unshift(s.map(x => [x[0], x[1]] as [number, string])); localStorage.setItem(MYK, JSON.stringify(a.slice(0, 12))); return true; } catch (_) { return false; } }
/** Start a gradient from the layer's current palette (5 stops) — the picture does not jump. */
export function gradFromPal(i: number): [number, string][] { return [0, .25, .5, .75, 1].map(t => [t, rgbToHex(palJS(i, t) as any)]); }

export function gradEditor(L: any, onChange: () => void) {
  const g = L.grad; const box = h('div', { class: 'gedit' });
  const bar = h('div', { class: 'gbar', title: 'Click: new stop · drag a stop · double-click: color · drag down: delete' });
  const paint = () => { bar.style.background = gradCSS(g.s, g.m | 0); bar.querySelectorAll('.gstop').forEach((el: any, j: number) => { el.style.left = (g.s[j][0] * 100) + '%'; el.style.background = g.s[j][1]; }); };
  const stops = () => { bar.querySelectorAll('.gstop').forEach((e: Element) => e.remove());
    g.s.forEach((s: [number, string], j: number) => { const b = h('button', { class: 'gstop', 'aria-label': `Stop ${j + 1}: ${s[1]}` });
      b.onpointerdown = (e: PointerEvent) => { e.stopPropagation(); b.setPointerCapture(e.pointerId); const r = bar.getBoundingClientRect(); let moved = false, gone = false;
        b.onpointermove = (ev: PointerEvent) => { if (!ev.buttons) return; moved = true; gone = g.s.length > 2 && Math.abs(ev.clientY - (r.top + r.height / 2)) > 40; b.style.opacity = gone ? '.3' : '';
          g.s[j][0] = Math.min(1, Math.max(0, (ev.clientX - r.left) / r.width)); paint(); markDirty(); };
        b.onpointerup = () => { b.onpointermove = null; if (gone) { g.s.splice(j, 1); stops(); paint(); } if (moved) { commit(); onChange(); } }; };
      b.ondblclick = (e: Event) => { e.stopPropagation(); openPicker(b, { value: g.s[j][1], onInput: v => { g.s[j][1] = v; paint(); markDirty(); }, onDone: (_v, ch) => { if (ch) { commit(); onChange(); } } }); };
      bar.appendChild(b); }); paint(); };
  bar.onpointerdown = (e: PointerEvent) => { if ((e.target as Element).classList.contains('gstop')) return; const r = bar.getBoundingClientRect(), x = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
    g.s.push([x, rgbToHex(gradAt(g.s, x, g.m | 0))]); g.s.sort((a: any, b: any) => a[0] - b[0]); stops(); commit(); onChange(); };
  stops();
  const mode = h('div', { class: 'seg', role: 'group', 'aria-label': 'Átmenet' }, ...['Perceptual', 'Egyenes (RGB)'].map((t, k) => h('button', { 'aria-pressed': String((g.m | 0) === k), title: k ? 'Plain RGB mixing (the middle may turn gray)' : 'OKLCH mixing: the middle does not turn gray', onclick: (e: any) => { g.m = k; [...e.currentTarget.parentNode.children].forEach((x: any, i: number) => x.setAttribute('aria-pressed', String(i === k))); paint(); commit(); onChange(); } }, t)));
  const harm = h('div', { class: 'btnrow' }, h('span', { class: 'small' }, 'Harmony:'), ...[['komp', 'Komplementer'], ['triad', 'Triad'], ['analog', 'Analogous'], ['tonal', 'Tone']].map(([k, t]) => h('button', { class: 'btn', onclick: () => {
    const cs = harmony(hexToRgb(g.s[Math.floor(g.s.length / 2)][1]), k); g.s.splice(0, g.s.length, ...cs.map((c, j) => [j / 4, rgbToHex(c)] as [number, string])); stops(); commit(); onChange(); } }, t)));
  const save = h('button', { class: 'btn', onclick: () => { save.textContent = saveMyPal(g.s) ? 'Elmentve ✓' : 'Could not save'; onChange(); } }, 'Save as own palette');
  box.append(bar, h('div', { class: 'row2' }, h('span', null, 'Átmenet'), mode), harm, h('div', { class: 'btnrow' }, save));
  return box;
}
/** Palette picker additions: own palettes (as swatches) + the „Custom gradient” swatch that turns on L.grad. */
export function gradSwatches(L: any, refresh: () => void) {
  const mk = (s: [number, string][], title: string, on: boolean) => { const b = h('button', { class: 'swatch', title, 'aria-label': title, 'aria-pressed': String(on), style: `background:${gradCSS(s, 0)}` });
    b.onclick = () => { L.grad = { s: s.map(x => [x[0], x[1]]), m: (L.grad && L.grad.m) | 0 }; commit(); refresh(); }; return b; };
  const own = L.grad ? L.grad.s : gradFromPal(L.pal || 0);
  const cur = h('button', { class: 'swatch gown', title: 'Custom gradient: edit with stops', 'aria-label': 'Custom gradient', 'aria-pressed': String(!!L.grad), style: `background:${gradCSS(own, 0)}` }, '✎');
  cur.onclick = () => { if (!L.grad) { L.grad = { s: gradFromPal(L.pal || 0), m: 0 }; commit(); } refresh(); };
  return [cur, ...myPals().map((s, j) => mk(s, `Own palette ${j + 1}`, false))];
}
export const PAL_COUNT = PALS.length;
