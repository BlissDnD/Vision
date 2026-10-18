/** U4: one small, consistent icon per appearance (Megjelenés) type, for the layer's effect row and the add grid.
 *  24×24 stroke glyphs; unknown types get a two-letter monogram. Pure (no DOM). */
const P: Record<string, string> = {
  blob: '<rect x="4" y="5" width="9" height="8" rx="1"/><rect x="13" y="12" width="7" height="7" rx="1"/><path d="M13 9h3v3"/>',
  texture: '<path d="M4 8c3-2 5 2 8 0s5-2 8 0M4 13c3-2 5 2 8 0s5-2 8 0M4 18c3-2 5 2 8 0s5-2 8 0"/>',
  blur: '<circle cx="12" cy="12" r="3"/><circle cx="12" cy="12" r="6" stroke-dasharray="2 2.5"/><circle cx="12" cy="12" r="9" stroke-dasharray="1 3" opacity=".6"/>',
  glow: '<circle cx="12" cy="12" r="3.5"/><path d="M12 3v2.5M12 18.5V21M3 12h2.5M18.5 12H21M5.6 5.6l1.8 1.8M16.6 16.6l1.8 1.8M5.6 18.4l1.8-1.8M16.6 7.4l1.8-1.8"/>',
  lens: '<circle cx="12" cy="12" r="2.5" fill="currentColor"/><ellipse cx="12" cy="12" rx="9" ry="4"/><ellipse cx="12" cy="12" rx="9" ry="4" transform="rotate(60 12 12)"/>',
  warp: '<path d="M3 7c4 0 5 4 9 4s5-4 9-4M3 13c4 0 5 4 9 4s5-4 9-4"/>',
  edge: '<path d="M5 19 12 5l7 14z"/><path d="M8.5 12h7" stroke-dasharray="1.5 2"/>',
  radial: '<circle cx="12" cy="12" r="2"/><path d="M12 7V3M12 21v-4M7 12H3M21 12h-4M8.5 8.5 6 6M18 18l-2.5-2.5M8.5 15.5 6 18M18 6l-2.5 2.5"/>',
  kaleido: '<path d="M12 3v18M4.2 7.5l15.6 9M4.2 16.5l15.6-9"/><circle cx="12" cy="12" r="8"/>',
  feedback: '<rect x="3" y="5" width="13" height="10" rx="1.5"/><rect x="6" y="8" width="13" height="10" rx="1.5" opacity=".7"/><rect x="9" y="11" width="12" height="9" rx="1.5" opacity=".45"/>',
  swirl: '<path d="M12 12c0-2 3-2 3 0s-3 4-6 2-2-7 3-7 8 4 6 9-9 6-12 2"/>',
  ripple: '<circle cx="12" cy="12" r="2"/><circle cx="12" cy="12" r="5.5"/><circle cx="12" cy="12" r="9" opacity=".6"/>',
  ascii: '<path d="M5 16 8 7l3 9M6 13h4M14 9h5M14 13h5M14 17h3"/>',
  halftone: '<circle cx="6" cy="6" r="2"/><circle cx="12" cy="6" r="1.5"/><circle cx="18" cy="6" r="1"/><circle cx="6" cy="12" r="1.5"/><circle cx="12" cy="12" r="1"/><circle cx="6" cy="18" r="1"/>',
  pixelart: '<path d="M4 4h5v5H4zM9 9h5v5H9zM14 14h6v6h-6zM14 4h6v5h-6z"/>',
  mirror: '<path d="M12 3v18" stroke-dasharray="2 2"/><path d="M9 7 4 12l5 5zM15 7l5 5-5 5z"/>',
  polar: '<circle cx="12" cy="12" r="8"/><path d="M12 12 18 6M12 4v8"/><path d="M15 12a3 3 0 0 0-3-3"/>',
  chroma: '<circle cx="10" cy="11" r="5"/><circle cx="14" cy="13" r="5" opacity=".6"/>',
  psycolor: '<path d="M12 4a8 8 0 1 0 8 8"/><path d="M12 8a4 4 0 1 0 4 4"/><path d="M20 12h-4"/>',
  grade: '<path d="M4 20 20 4"/><path d="M4 4h16v16H4z"/><path d="M7 7h4v4H7z" fill="currentColor" opacity=".5"/>',
  glitch: '<path d="M4 6h10M8 10h12M4 14h8M10 18h10"/>',
  crt: '<rect x="3" y="5" width="18" height="13" rx="3"/><path d="M6 9h12M6 12h12M6 15h12" opacity=".6"/><path d="M9 21h6"/>',
  castlight: '<path d="M5 8h6v8H5z"/><path d="M11 8l9 6M11 16l9-2" opacity=".6"/>',
  film: '<rect x="4" y="3" width="16" height="18" rx="1.5"/><path d="M8 3v18M16 3v18M4 8h4M4 16h4M16 8h4M16 16h4"/>',
  pdisp: '<circle cx="6" cy="12" r="1.3"/><circle cx="10" cy="8" r="1.3"/><circle cx="10" cy="16" r="1.3"/><circle cx="15" cy="6" r="1"/><circle cx="16" cy="12" r="1"/><circle cx="15" cy="18" r="1"/><circle cx="20" cy="9" r=".8"/><circle cx="20" cy="15" r=".8"/>',
  inksketch: '<path d="M4 20l3-1 11-11-2-2L5 17z"/><path d="M14 6l2 2M4 14l4-4M4 10l2-2M8 18l4-4"/>',
  hologram: '<path d="M12 3l7 4v10l-7 4-7-4V7z"/><path d="M5 10h14M5 14h14"/>',
  balloon: '<ellipse cx="12" cy="10" rx="6" ry="7"/><path d="M12 17l-1 2h2zM12 19c0 1-1 2 0 3"/>',
  custom: '<path d="M8 7 4 12l4 5M16 7l4 5-4 5M13.5 5l-3 14"/>',
  text: '<path d="M5 6V4h14v2M12 4v16M9 20h6"/>',
};
export function fxIcon(type: string, name?: string): string {
  const g = P[type];
  if (g) return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${g}</svg>`;
  const m = String(name || type).replace(/[^A-Za-zÁÉÍÓÖŐÚÜŰáéíóöőúüű]/g, '').slice(0, 2) || '?';
  return `<svg viewBox="0 0 24 24"><rect x="2.5" y="2.5" width="19" height="19" rx="5" fill="none" stroke="currentColor" stroke-width="1.5"/><text x="12" y="16" text-anchor="middle" font-size="9.5" font-weight="700" fill="currentColor" font-family="system-ui,sans-serif">${m}</text></svg>`;
}
