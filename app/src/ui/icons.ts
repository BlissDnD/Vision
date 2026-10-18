/** WA1: inline SVG icons for the shared controls (library categories, waveforms, rhythm, animate menu).
 *  Inline on purpose: Vel is one HTML file that must open from file://, so no icon sprite is ever fetched. */
const s = (d: string, extra = '') => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}${extra}</svg>`;

/* Library categories (CATS in library.ts) — one generic icon per shelf */
export const CAT_ICON: Record<string, string> = {
  recipes: s('<path d="M5 4h11l3 3v13H5z"/><path d="M8 9h8M8 13h8M8 17h5"/>'),
  gen: s('<circle cx="12" cy="12" r="3.2"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1"/>'),
  shapes: s('<rect x="3" y="3.5" width="8" height="8" rx="1.5"/><circle cx="17" cy="7.5" r="4"/><path d="M7 13.5l4.5 7h-9z"/>'),
  '3d': s('<path d="M12 3 4 7.5v9L12 21l8-4.5v-9z"/><path d="M4 7.5 12 12l8-4.5M12 12v9"/>'),
  fx: s('<path d="M5 19 16 8"/><path d="M14 4.5l1 2.5 2.5 1-2.5 1-1 2.5-1-2.5-2.5-1 2.5-1z"/><path d="M19.5 13l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7z"/>'),
  motion: s('<path d="M3 16V8M8 16V5M13 16v-7M18 16V9M3 19h18"/>'),
  particles: s('<circle cx="7" cy="8" r="1.4"/><circle cx="13" cy="5.5" r="1.1"/><circle cx="17.5" cy="10" r="1.6"/><circle cx="9" cy="14.5" r="1.2"/><circle cx="15" cy="17.5" r="1.3"/><circle cx="5" cy="18" r="1"/>'),
  world: s('<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/>'),
  media: s('<path d="M5 6h14M9 6v13M7 19h4"/><rect x="13" y="12" width="8" height="7" rx="1.5"/>'),
};
/** Category colour variable per shelf (vel-theme.css) */
export const CAT_COLOR: Record<string, string> = {
  recipes: '--vel-cat-library', gen: '--vel-cat-particles', shapes: '--vel-cat-shape', '3d': '--vel-cat-shader',
  fx: '--vel-cat-fx', motion: '--vel-cat-motion', particles: '--vel-cat-particles', world: '--vel-cat-shape', media: '--vel-cat-media',
};

/* Waveforms, in WAVES order (effects/index.ts): sine · triangle · sawtooth · square */
export const WAVE_ICON = [
  s('<path d="M2 12c2.5-7 5-7 7.5 0s5 7 7.5 0 3-5 5-3"/>'),
  s('<path d="M2 17 6.5 7 11 17 15.5 7 20 17"/>'),
  s('<path d="M2 17 8 7v10l6-10v10l4-7"/>'),
  s('<path d="M2 17V7h5v10h5V7h5v10h3"/>'),
];

/* Rhythm presets (RY_PRE order: even · pulse · pause · swell · stutter) */
export const RY_ICON = [
  s('<path d="M4 12h16"/>'),
  s('<path d="M3 16h3l2-8 2 8h3l2-8 2 8h3"/>'),
  s('<path d="M3 8h5v8h4V8h4v8h5"/>'),
  s('<path d="M3 17c4 0 5-10 9-10s5 10 9 10"/>'),
  s('<path d="M3 12h2v4h2v-8h2v8h2v-4h2v4h2v-8h2v8h2"/>'),
];

/* Animate menu (◇) and its items */
export const ICON_DIAMOND = s('<path d="M12 3.5 20.5 12 12 20.5 3.5 12z"/>');
export const ICON_LOOP = s('<path d="M17 2l3 3-3 3"/><path d="M4 11V9a4 4 0 0 1 4-4h12"/><path d="M7 22l-3-3 3-3"/><path d="M20 13v2a4 4 0 0 1-4 4H4"/>');
export const ICON_KEYS = s('<path d="M3 12h4M17 12h4"/><path d="M12 7.5 16.5 12 12 16.5 7.5 12z" fill="currentColor"/>');
export const ICON_LINK = s('<path d="M9 15l6-6"/><path d="M7.5 10.5 6 12a3.5 3.5 0 0 0 5 5l1.5-1.5"/><path d="M16.5 13.5 18 12a3.5 3.5 0 0 0-5-5l-1.5 1.5"/>');
export const ICON_SPEED = s('<circle cx="12" cy="13" r="7.5"/><path d="M12 13l4-3M12 4.5V6"/>');
export const ICON_STRENGTH = s('<path d="M12 4v16M7 9l5-5 5 5"/>');
