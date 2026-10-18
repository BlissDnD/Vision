/* K3 · Kamera ablak bővítése: Mode (Kézi / Targets / On path), célpontlista („Selected layer from now”, időpont, törlés),
 * útvonalválasztó + ismétlés, „Élesség a célon”. Every change is one commit; the camera turns on when a mode is chosen. */
import { R } from './runtime';
import { h } from './dom';
import { st, findItem } from './state';
import { ctlSwitch } from './controls';
import { commit } from './history';
import { markDirty } from './loop';
import { renderTimeline } from './timeline';
import { toast } from './modals';

const MODES = ['Manual (keys)', 'Targets', 'On path'];
R.camExtra = (reopen: () => void) => {
  const C = st.cam, mode = C.mode || 0, done = (msg?: string) => { commit(); markDirty(); renderTimeline(); reopen(); if (msg) toast(msg); };
  const ms = h('select', { class: 'sel', 'aria-label': 'Camera mode' }, ...MODES.map((m, i) => h('option', { value: String(i), selected: i === mode }, m)));
  ms.onchange = () => { const v = +ms.value; if (v) C.mode = v; else delete C.mode; if (v) C.on = true; done(); };
  const kids: any[] = [h('div', { class: 'ctl' }, h('label', null, 'Mode'), ms)];
  if (mode === 1) {
    const S = C.shots || [];
    kids.push(h('div', { class: 'btnrow' }, h('button', { class: 'btn accent', title: 'The camera aims at the selected layer from the playhead time.', onclick: () => {
      const r = R.selId && findItem(R.selId); if (!r) { toast('Select a layer for the camera to aim at.'); return; }
      const t = Math.round(Math.max(0, R.time) * 100) / 100, list = (C.shots = (C.shots || []).filter(x => Math.abs(x.t - t) > 1e-3)); list.push({ t, id: r.it.id }); list.sort((a, b) => a.t - b.t);
      done(`Target: ${r.it.name} · from ${t.toFixed(2)} s`); } }, 'Selected layer from now')));
    if (!S.length) kids.push(h('p', { class: 'small' }, 'No target yet. Select a layer, set the playhead and click the button; several targets = target changes.'));
    S.forEach((x, i) => { const L = findItem(x.id); const tf = h('input', { type: 'number', class: 'num', step: '0.1', min: '0', value: String(x.t), 'aria-label': 'Time (s)' });
      tf.onchange = () => { const v = Math.max(0, +tf.value || 0); x.t = v; S.sort((a, b) => a.t - b.t); done(); };
      kids.push(h('div', { class: 'row2 camshot' }, tf, h('span', { class: 'small' }, L ? L.it.name : '(deleted layer)'),
        h('button', { class: 'btn', title: 'Delete target', onclick: () => { S.splice(i, 1); if (!S.length) delete C.shots; done(); } }, '×'))); });
    kids.push(ctlSwitch('Focus on target (depth of field)', !!C.focusT, v => { if (v) C.focusT = true; else delete C.focusT; done(); }));
  }
  if (mode === 2) {
    if (R.pathPick) kids.push(R.pathPick(C, 'path'));
    const ls = h('select', { class: 'sel', 'aria-label': 'Repeat' }, ...['Loop', 'Ping-pong', 'Once'].map((m, i) => h('option', { value: String(i), selected: i === (C.ploop || 0) }, m)));
    ls.onchange = () => { const v = +ls.value; if (v) C.ploop = v; else delete C.ploop; done(); };
    kids.push(h('div', { class: 'ctl' }, h('label', null, 'Repeat'), ls));
  }
  if (mode) kids.push(h('p', { class: 'small' }, 'In this mode Camera X/Y acts as an offset. Handheld: gentle shake in any mode.'));
  return h('div', { class: 'camdir' }, ...kids);
};
