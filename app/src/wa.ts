/* WA1: Web Awesome, imported component by component, plus the bundled Font Awesome icon library.
 * Nothing is fetched at runtime (no kit, no sprite, icons come from data URIs), so Vel still opens from file://. */
import '@awesome.me/webawesome/dist/styles/themes/default.css';
import '@awesome.me/webawesome/dist/components/tooltip/tooltip.js';
import '@awesome.me/webawesome/dist/components/switch/switch.js';
import '@awesome.me/webawesome/dist/components/dropdown/dropdown.js';
import '@awesome.me/webawesome/dist/components/dropdown-item/dropdown-item.js';
import '@awesome.me/webawesome/dist/components/icon/icon.js';
import { registerIconLibrary } from '@awesome.me/webawesome/dist/components/icon/library.js';
import { iconUri } from './ui/fa';
import './vel-theme.css';

document.documentElement.classList.add('wa-dark', 'wa-theme-default');
registerIconLibrary('default', { resolver: iconUri, mutator: (svg: SVGElement) => svg.setAttribute('fill', 'currentColor') });

/** True once the custom elements we use are defined; the headless tests wait on this. */
export const WA_TAGS = ['wa-tooltip', 'wa-switch', 'wa-dropdown', 'wa-dropdown-item', 'wa-icon'];
export const waReady = () => Promise.all(WA_TAGS.map(t => customElements.whenDefined(t))).then(() => true);
export const waDefined = () => WA_TAGS.every(t => !!customElements.get(t));
