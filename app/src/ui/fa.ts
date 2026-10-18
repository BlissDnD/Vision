/* WA1: the Font Awesome Free icons Vel uses, imported by name so only these end up in the bundle, and registered as
 * Web Awesome's default icon library from data URIs — nothing is fetched, so <wa-icon> works offline and from file://.
 * Category → icon follows docs/final-updates/DESIGN-SYSTEM.md. */
import { faWandMagicSparkles, faCube, faShapes, faFont, faImage, faWaveSquare, faLightbulb, faPalette, faCircleHalfStroke,
  faWandSparkles, faDroplet, faBookmark, faDice, faFolder, faMusic, faCircleDot, faRepeat, faInfinity, faDiamond, faLink,
  faGaugeHigh, faArrowsUpDown, faEarthAmericas, faFilm } from '@fortawesome/free-solid-svg-icons';

export const ICONS: Record<string, any> = {
  effect: faWandMagicSparkles, shader: faCube, shape: faShapes, text: faFont, media: faImage, motion: faWaveSquare,
  light: faLightbulb, color: faPalette, mask: faCircleHalfStroke, particles: faWandSparkles, fluid: faDroplet,
  library: faBookmark, random: faDice, project: faFolder, audio: faMusic, render: faCircleDot, loop: faRepeat,
  seamless: faInfinity, keyframe: faDiamond, link: faLink, speed: faGaugeHigh, strength: faArrowsUpDown,
  world: faEarthAmericas, recipes: faFilm,
};

/** Inline SVG markup of a bundled icon, for plain buttons that do not need <wa-icon>. */
export function iconSvg(name: string) {
  const d = ICONS[name]; if (!d) return '';
  const [w, hh, , , p] = d.icon as any;
  return `<svg viewBox="0 0 ${w} ${hh}" aria-hidden="true"><path fill="currentColor" d="${p}"/></svg>`;
}

/** Data URI of the same icon, for Web Awesome's icon resolver. */
export const iconUri = (name: string) => {
  const d = ICONS[name]; if (!d) return '';
  const [w, hh, , , p] = d.icon as any;
  return 'data:image/svg+xml,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${hh}"><path fill="currentColor" d="${p}"/></svg>`);
};
