/** Local, vector-only Lottie import UI. JSON routing happens before the preset drop handler. */
import { createLottiePlayer } from './lottie';
import { R } from './runtime';
import { h } from './dom';
import { insertItem } from './itemops';
import { commit, renderAll } from './history';
import { closeModal, openModal, toast } from './modals';
import { makeLayer, vectorAssets } from './state';
import { parseVectorLottie } from './lottieCore';

const shortName = (name: string) => name.replace(/\.json$/i, '').slice(0, 60) || 'Vector animation';
export async function importLottieFile(file: File, suppliedText?: string) {
  try {
    if (file.size > 2_000_000) throw new RangeError('A Lottie file can be at most 2 MB.');
    const source = suppliedText ?? await file.text();
    const { data, meta } = parseVectorLottie(source);
    const canvas = h('canvas', { width: String(Math.min(320, meta.width)), height: String(Math.max(1, Math.round(Math.min(320, meta.width) * meta.height / meta.width))),
      style: 'max-width:100%;height:auto;background:#181822;border-radius:8px' }) as HTMLCanvasElement;
    const scrub = h('input', { type: 'range', min: 0, max: Math.max(0, Math.floor(meta.op - meta.ip - 1)), step: 1, value: 0, 'aria-label': 'Lottie preview frame' }) as HTMLInputElement;
    const player = createLottiePlayer(canvas, data);
    const show = () => player.goToAndStop(+scrub.value, true);
    player.addEventListener('DOMLoaded', show); player.addEventListener('data_ready', show);
    if (player.isLoaded) show();
    scrub.oninput = show;
    const cancel = () => { player.destroy(); closeModal(); };
    const add = () => {
      const id = 'V' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
      vectorAssets[id] = source;
      const L = makeLayer('lottie', { name: shortName(file.name), asset: id, s: .8,
        media: { start: Math.max(0, R.time || 0), speed: 1, loop: true } });
      insertItem(L, null); commit(); renderAll(); cancel();
      toast(`${L.name} vector animation added · you can also drag its start on the Tracks.`);
    };
    openModal(h('h2', null, 'Import vector animation'),
      h('p', null, `${shortName(file.name)} · ${meta.width} × ${meta.height} · ${meta.fps} fps · ${meta.duration.toFixed(1)} mp`),
      canvas, scrub,
      h('p', { class: 'small' }, 'Vector-only Lottie. External images, fonts and expressions cannot be imported.'),
      h('div', { class: 'bar2' }, h('button', { class: 'btn', onclick: cancel }, 'Cancel'),
        h('button', { class: 'btn accent', onclick: add }, 'Add as a layer')));
    const observer = new MutationObserver(() => { if (!canvas.isConnected) { player.destroy(); observer.disconnect(); } });
    observer.observe(document.querySelector('#dlg'), { childList: true });
  } catch (e) { toast(`Lottie-import: ${e.message || e}`); }
}
export function chooseLottieFile() {
  const input = h('input', { type: 'file', accept: '.json,application/json', style: 'display:none' }) as HTMLInputElement;
  input.onchange = () => { const f = input.files?.[0]; if (f) void importLottieFile(f); };
  openModal(h('h2', null, 'Add vector animation'),
    h('p', null, 'Choose your own Lottie JSON file, or look for an animation in the LottieFiles collection.'),
    h('p', { class: 'small' }, 'Download the Lottie JSON version from the collection. Vel currently accepts vector-only animations up to 2 MB.'),
    input,
    h('div', { class: 'bar2' },
      h('a', { class: 'btn', href: 'https://lottiefiles.com/free-animations', target: '_blank', rel: 'noopener noreferrer' }, 'LottieFiles collection ↗'),
      h('button', { class: 'btn accent', onclick: () => input.click() }, 'Choose JSON file'),
      h('button', { class: 'btn', onclick: closeModal }, 'Cancel')));
}
R.openLottie = chooseLottieFile;
R.importLottieFile = importLottieFile;
