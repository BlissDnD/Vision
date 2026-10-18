// U5 shared colour picker: one lazily created popover (SV square, hue, optional alpha, hex, eyedropper, project and
// palette swatches). colorWell() is the button that replaces <input type=color>; swatches drag as text/x-vel-color.
import { h } from './dom';
import { st } from './state';
import { hexAlpha, hexToRgb, hsvToRgb, rgbToHex, rgbToHsv } from './colorutil';

export const COLOR_MIME = 'text/x-vel-color';
let POP: any = null;
type Opts = { value: string; alpha?: boolean; label?: string; onInput: (hex: string) => void; onDone?: (hex: string, changed: boolean) => void; extra?: string[] };

/** Every distinct #hex used in the project (params, text, shapes …), most frequent first. Cheap JSON scan, on open only. */
export function projectColors(max = 12) {
  const n: Record<string, number> = {}; const s = JSON.stringify([st.layers, st.bg]);
  for (const m of s.matchAll(/"(#[0-9a-fA-F]{6})(?:[0-9a-fA-F]{2})?"/g)) { const k = m[1].toLowerCase(); n[k] = (n[k] || 0) + 1; }
  return Object.keys(n).sort((a, b) => n[b] - n[a]).slice(0, max);
}
export function swatch(hex: string, onPick?: (h: string) => void, title?: string) {
  const b = h('button', { class: 'cswatch', style: `background:${hex}`, title: title || hex, draggable: 'true', 'aria-label': title || hex });
  b.ondragstart = (e: DragEvent) => { e.dataTransfer!.setData(COLOR_MIME, hex); e.dataTransfer!.setData('text/plain', hex); e.dataTransfer!.effectAllowed = 'copy'; };
  if (onPick) b.onclick = (e: Event) => { e.preventDefault(); onPick(hex); }; return b;
}

function build() {
  const sv = h('canvas', { class: 'cp-sv', width: 200, height: 140 }), hue = h('canvas', { class: 'cp-hue', width: 200, height: 12 }), alp = h('canvas', { class: 'cp-alpha', width: 200, height: 12 });
  const hex = h('input', { class: 'val cp-hex', 'aria-label': 'Hex szín', spellcheck: 'false' }), drop = h('button', { class: 'btn cp-eye', title: 'Pipetta: szín a képernyőről' }, '◉');
  const sw = h('div', { class: 'cp-sw' }), knob = h('i', { class: 'cp-knob' });
  const el = h('div', { class: 'cpick', role: 'dialog', 'aria-label': 'Színválasztó', hidden: true }, h('div', { class: 'cp-svw' }, sv, knob), hue, alp, h('div', { class: 'cp-row' }, hex, drop), sw);
  document.body.appendChild(el);
  const P: any = { el, sv, hue, alp, hex, drop, sw, knob, hsv: [0, 0, 0], a: 1, o: null as Opts | null, start: '' };
  const paintSV = () => { const g = sv.getContext('2d')!, [r, gg, b] = hsvToRgb(P.hsv[0], 1, 1); g.fillStyle = `rgb(${r * 255},${gg * 255},${b * 255})`; g.fillRect(0, 0, 200, 140);
    let w = g.createLinearGradient(0, 0, 200, 0); w.addColorStop(0, '#fff'); w.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = w; g.fillRect(0, 0, 200, 140);
    w = g.createLinearGradient(0, 0, 0, 140); w.addColorStop(0, 'rgba(0,0,0,0)'); w.addColorStop(1, '#000'); g.fillStyle = w; g.fillRect(0, 0, 200, 140);
    knob.style.left = (P.hsv[1] * 100) + '%'; knob.style.top = ((1 - P.hsv[2]) * 100) + '%'; };
  const paintStrips = () => { let g = hue.getContext('2d')!, w = g.createLinearGradient(0, 0, 200, 0); for (let i = 0; i <= 6; i++) { const c = hsvToRgb(i / 6, 1, 1); w.addColorStop(i / 6, rgbToHex(c)); } g.fillStyle = w; g.fillRect(0, 0, 200, 12);
    g.fillStyle = '#fff'; g.fillRect(P.hsv[0] * 200 - 1, 0, 2, 12);
    g = alp.getContext('2d')!; g.clearRect(0, 0, 200, 12); for (let x = 0; x < 200; x += 6) for (let y = 0; y < 12; y += 6) { g.fillStyle = ((x + y) / 6) % 2 ? '#888' : '#ccc'; g.fillRect(x, y, 6, 6); }
    const c = rgbToHex(hsvToRgb(P.hsv[0], P.hsv[1], P.hsv[2])); w = g.createLinearGradient(0, 0, 200, 0); w.addColorStop(0, c + '00'); w.addColorStop(1, c); g.fillStyle = w; g.fillRect(0, 0, 200, 12); g.fillStyle = '#fff'; g.fillRect(P.a * 200 - 1, 0, 2, 12); };
  P.cur = () => rgbToHex(hsvToRgb(P.hsv[0], P.hsv[1], P.hsv[2]), P.o && P.o.alpha ? P.a : 1);
  P.emit = () => { const v = P.cur(); P.hex.value = v; paintSV(); paintStrips(); P.o && P.o.onInput(v); };
  P.set = (v: string) => { P.hsv = rgbToHsv(hexToRgb(v)); P.a = hexAlpha(v); P.hex.value = v; paintSV(); paintStrips(); };
  const drag = (cv: HTMLElement, f: (x: number, y: number) => void) => { cv.onpointerdown = (e: PointerEvent) => { cv.setPointerCapture(e.pointerId); const go = (ev: PointerEvent) => { const r = cv.getBoundingClientRect(); f(Math.min(1, Math.max(0, (ev.clientX - r.left) / r.width)), Math.min(1, Math.max(0, (ev.clientY - r.top) / r.height))); P.emit(); }; go(e); cv.onpointermove = (ev: PointerEvent) => { if (ev.buttons) go(ev); }; }; };
  drag(sv, (x, y) => { P.hsv[1] = x; P.hsv[2] = 1 - y; }); drag(knob, (x, y) => { P.hsv[1] = x; P.hsv[2] = 1 - y; });
  drag(hue, x => { P.hsv[0] = Math.min(.999, x); }); drag(alp, x => { P.a = x; });
  hex.onchange = () => { const v = String(hex.value).trim(); if (/^#?[0-9a-f]{3}([0-9a-f]{3})?([0-9a-f]{2})?$/i.test(v)) { P.set((v[0] === '#' ? '' : '#') + v); P.emit(); } else hex.value = P.cur(); };
  hex.onkeydown = (e: KeyboardEvent) => { if (e.key === 'Enter') hex.blur(); };
  drop.onclick = async () => { const ED = (window as any).EyeDropper; if (!ED) { drop.title = 'Ez a böngésző nem tud pipettázni'; return; } try { const r = await new ED().open(); P.set(r.sRGBHex); P.emit(); } catch (_) { /* cancelled */ } };
  const outside = (e: PointerEvent) => { if (!P.el.hidden && !P.el.contains(e.target as Node) && e.target !== P.anchor) closePicker(); };
  document.addEventListener('pointerdown', outside, true);
  document.addEventListener('keydown', (e: KeyboardEvent) => { if (!P.el.hidden && (e.key === 'Escape' || e.key === 'Enter')) { e.stopPropagation(); closePicker(); } }, true);
  return P;
}
export function closePicker() { const P = POP; if (!P || P.el.hidden) return; P.el.hidden = true; const o = P.o; P.o = null; P.anchor = null; if (o && o.onDone) { const v = P.cur(); o.onDone(v, v !== P.start); } }
export const pickerOpen = () => !!(POP && !POP.el.hidden);
/** Open the shared picker next to anchor. One undo step = the caller commits in onDone when changed. */
export function openPicker(anchor: HTMLElement, o: Opts) {
  if (POP && !POP.el.hidden) closePicker(); const P = POP || (POP = build());
  P.o = o; P.anchor = anchor; P.alp.hidden = !o.alpha; P.set(o.value || '#ffffff'); P.start = P.cur();
  P.sw.innerHTML = ''; const pick = (v: string) => { P.set(v); P.emit(); };
  const proj = projectColors(); if (proj.length) P.sw.append(h('span', { class: 'cp-lbl' }, 'A projekt színei'), h('div', { class: 'cp-swr' }, ...proj.map(c => swatch(c, pick))));
  if (o.extra && o.extra.length) P.sw.append(h('span', { class: 'cp-lbl' }, 'Paletta'), h('div', { class: 'cp-swr' }, ...o.extra.map(c => swatch(c, pick))));
  P.el.hidden = false; const r = anchor.getBoundingClientRect(), W = 224, H = P.el.offsetHeight || 300;
  P.el.style.left = Math.max(8, Math.min(innerWidth - W - 8, r.left + r.width / 2 - W / 2)) + 'px';
  P.el.style.top = (r.bottom + H + 8 < innerHeight ? r.bottom + 6 : Math.max(8, r.top - H - 6)) + 'px';
  return P;
}
/** The swatch button used everywhere a colour is edited. get/set read and write '#rrggbb(aa)'; done(changed) commits. */
export function colorWell(get: () => string, set: (v: string) => void, done: (changed: boolean) => void, label = 'Szín', o: { alpha?: boolean; extra?: () => string[] } = {}) {
  const b = h('button', { class: 'cwell cwb', 'aria-label': label, title: label + ' · kattints: színválasztó · húzz rá színt' });
  const paint = () => { b.style.background = get(); }; paint();
  b.onclick = () => openPicker(b, { value: get(), alpha: o.alpha, label, extra: o.extra ? o.extra() : undefined, onInput: v => { set(v); paint(); }, onDone: (_v, ch) => { paint(); done(ch); } });
  b.ondragover = (e: DragEvent) => { if (e.dataTransfer && [...e.dataTransfer.types].includes(COLOR_MIME)) { e.preventDefault(); b.classList.add('drop'); } };
  b.ondragleave = () => b.classList.remove('drop');
  b.ondrop = (e: DragEvent) => { b.classList.remove('drop'); const v = e.dataTransfer && e.dataTransfer.getData(COLOR_MIME); if (v) { e.preventDefault(); set(v); paint(); done(true); } };
  (b as any).repaint = paint; return b;
}
