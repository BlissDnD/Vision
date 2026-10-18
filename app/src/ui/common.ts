/** WA1: the shared controls every panel uses — icon button with a Web Awesome tooltip, segmented icon group,
 *  switch row and the ◇ animate menu. Display text comes from callers (locale.ts keys); ids and project data never change. */
import { h } from '../dom';
import { ICON_DIAMOND, ICON_KEYS, ICON_LINK, ICON_LOOP } from './icons';

let uid = 0;
const nextId = () => 'velu' + (++uid);

/** Icon button with a one-sentence tooltip. `tint` is a category colour variable name (see vel-theme.css). */
export function iconBtn(opts: { icon: string; tip: string; label?: string; pressed?: boolean; tint?: string; cls?: string; onclick?: (e: Event) => void; role?: string }) {
  const id = nextId();
  const b: any = h('button', {
    type: 'button', id, class: 'vel-ib' + (opts.cls ? ' ' + opts.cls : ''), html: opts.icon,
    'aria-label': opts.label || opts.tip, onclick: opts.onclick,
  });
  if (opts.role) b.setAttribute('role', opts.role);
  if (opts.pressed != null) b.setAttribute(opts.role === 'radio' ? 'aria-checked' : 'aria-pressed', String(!!opts.pressed));
  if (opts.tint) b.style.setProperty('--vel-cc', `var(${opts.tint})`);
  if (opts.label) b.appendChild(h('span', { class: 'vel-lbl' }, opts.label));
  return h('span', { class: 'vel-ibw' }, b, h('wa-tooltip', { for: id, placement: 'bottom' }, opts.tip)) as HTMLElement;
}

/** The button inside an iconBtn wrapper (for tests and for callers that need to flip aria state). */
export const btnOf = (wrap: Element) => wrap.querySelector('button') as HTMLButtonElement;

/** Segmented icon group: 2–4 mutually exclusive modes, radio semantics, tooltip per option. */
export function segIcons(label: string, opts: { icon: string; tip: string; name?: string }[], cur: number, on: (i: number) => void) {
  const box = h('div', { class: 'vel-seg', role: 'radiogroup', 'aria-label': label });
  const wraps = opts.map((o, i) => iconBtn({
    icon: o.icon, tip: o.tip, label: undefined, role: 'radio', pressed: i === cur,
    onclick: () => { wraps.forEach((w, j) => btnOf(w).setAttribute('aria-checked', String(j === i))); on(i); },
  }));
  wraps.forEach((w, i) => { btnOf(w).setAttribute('aria-label', opts[i].name || opts[i].tip); box.appendChild(w); });
  return box;
}

/** Switch row: a label that wraps instead of truncating, plus a wa-switch. */
export function switchRow(label: string, tip: string, checked: boolean, on: (v: boolean) => void) {
  const sw: any = h('wa-switch', { 'aria-label': label });
  sw.checked = !!checked;
  sw.addEventListener('change', () => on(!!sw.checked));
  const row = h('label', { class: 'vel-row', title: tip }, h('span', { class: 'vel-row-lab' }, label), h('span', { class: 'vel-row-ctl' }, sw));
  (row as any).velSwitch = sw;
  return row;
}

export type AnimMenuItem = { key: string; label: string; icon?: string; disabled?: boolean; tip?: string; run?: () => void };

/** The ◇ animate menu: the same control everywhere — Wave · Seamless loop · Keyframes · Link.
 *  An item with no handler is shown dimmed (that way is not available for this control yet). */
export function animMenu(label: string, items: AnimMenuItem[]) {
  const id = nextId();
  const trig: any = h('button', { type: 'button', id, slot: 'trigger', class: 'vel-ib vel-anb', html: ICON_DIAMOND, 'aria-label': label });
  const dd = h('wa-dropdown', { class: 'vel-animmenu' }, trig,
    ...items.map(it => {
      const el: any = h('wa-dropdown-item', { 'data-key': it.key, title: it.tip || '' }, it.label);
      if (it.icon) el.appendChild(h('span', { slot: 'icon', class: 'vel-mi', html: it.icon }));
      if (it.disabled || !it.run) el.disabled = true;
      else el.addEventListener('click', () => it.run!());
      return el;
    }));
  return h('span', { class: 'vel-ibw' }, dd, h('wa-tooltip', { for: id, placement: 'bottom' }, label)) as HTMLElement;
}

/** Standard items for a parameter's ◇ menu; pass only the actions that control actually supports. */
export function animItems(a: { wave?: () => void; loop?: () => void; loopOn?: boolean; keys?: () => void; link?: () => void }): AnimMenuItem[] {
  return [
    { key: 'wave', label: 'Wave', tip: 'Animate this value with a wave (depth, rhythm, waveform).', run: a.wave },
    { key: 'loop', label: a.loopOn ? 'Seamless loop · on' : 'Seamless loop', icon: ICON_LOOP, tip: 'The wave completes whole cycles in the scene, so its end meets its beginning.', run: a.loop },
    { key: 'keys', label: 'Keyframes', icon: ICON_KEYS, tip: 'Add a keyframe at the current time and edit the curve.', run: a.keys },
    { key: 'link', label: 'Link', icon: ICON_LINK, tip: 'Drive this value from a signal or another layer.', run: a.link },
  ];
}
