/* WA1: Web Awesome, imported component by component (no kit, no network at runtime — Vel must open from file://).
 * Icons stay inline SVG (src/fxicons.ts, src/ui/icons.ts), so wa-icon and its sprite fetch are deliberately not used. */
import '@awesome.me/webawesome/dist/styles/themes/default.css';
import '@awesome.me/webawesome/dist/components/tooltip/tooltip.js';
import '@awesome.me/webawesome/dist/components/switch/switch.js';
import '@awesome.me/webawesome/dist/components/dropdown/dropdown.js';
import '@awesome.me/webawesome/dist/components/dropdown-item/dropdown-item.js';
import './vel-theme.css';

/** True once the custom elements we use are defined; the headless tests wait on this. */
export const WA_TAGS = ['wa-tooltip', 'wa-switch', 'wa-dropdown', 'wa-dropdown-item'];
export const waReady = () => Promise.all(WA_TAGS.map(t => customElements.whenDefined(t))).then(() => true);
export const waDefined = () => WA_TAGS.every(t => !!customElements.get(t));
