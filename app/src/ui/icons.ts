/** WA1: icons for the shared controls. The category and action icons come from the bundled Font Awesome Free set
 *  (src/ui/fa.ts, no network), while waveforms and rhythm presets are drawn from their own data — the icon IS the curve. */
import { iconSvg } from './fa';

const s = (d: string, extra = '') => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}${extra}</svg>`;

/* Library categories (CATS in library.ts) — one Font Awesome icon per shelf */
export const CAT_ICON: Record<string, string> = {
  recipes: iconSvg('recipes'), gen: iconSvg('particles'), shapes: iconSvg('shape'), '3d': iconSvg('shader'),
  fx: iconSvg('effect'), motion: iconSvg('motion'), particles: iconSvg('particles'), world: iconSvg('world'), media: iconSvg('media'),
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

/* Animate menu (◇) and its items, plus the rhythm target — bundled Font Awesome */
export const ICON_DIAMOND = iconSvg('keyframe');
export const ICON_LOOP = iconSvg('seamless');
export const ICON_KEYS = iconSvg('keyframe');
export const ICON_LINK = iconSvg('link');
export const ICON_SPEED = iconSvg('speed');
export const ICON_STRENGTH = iconSvg('strength');

/** A rhythm preset drawn as its own one-cycle curve (pts: speed/strength per segment, 0..2). */
export function curveSvg(pts?: number[]) {
  const P = pts && pts.length ? pts : [1, 1];
  const d = P.map((v, i) => `${i ? 'L' : 'M'}${(i / (P.length - 1) * 26 + 1).toFixed(1)} ${(13 - Math.min(2, v) / 2 * 12).toFixed(1)}`).join('');
  return `<svg viewBox="0 0 28 14" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" aria-hidden="true"><path d="${d}"/></svg>`;
}
