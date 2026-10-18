/** Local, vector-only Lottie import UI. JSON routing happens before the preset drop handler. */
import { createLottiePlayer } from './lottie';
import { R } from './runtime';
import { h } from './dom';
import { insertItem } from './itemops';
import { commit, renderAll } from './history';
import { closeModal, openModal, toast } from './modals';
import { makeLayer, vectorAssets } from './state';
import { parseVectorLottie } from './lottieCore';

const shortName = (name: string) => name.replace(/\.json$/i, '').slice(0, 60) || 'Vektoranimáció';
export async function importLottieFile(file: File, suppliedText?: string) {
  try {
    if (file.size > 2_000_000) throw new RangeError('A Lottie-fájl legfeljebb 2 MB lehet.');
    const source = suppliedText ?? await file.text();
    const { data, meta } = parseVectorLottie(source);
    const canvas = h('canvas', { width: String(Math.min(320, meta.width)), height: String(Math.max(1, Math.round(Math.min(320, meta.width) * meta.height / meta.width))),
      style: 'max-width:100%;height:auto;background:#181822;border-radius:8px' }) as HTMLCanvasElement;
    const scrub = h('input', { type: 'range', min: 0, max: Math.max(0, Math.floor(meta.op - meta.ip - 1)), step: 1, value: 0, 'aria-label': 'Lottie előnézeti képkocka' }) as HTMLInputElement;
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
      toast(`${L.name} vektoranimáció hozzáadva · a kezdést a Sávokon is húzhatod.`);
    };
    openModal(h('h2', null, 'Vektoranimáció importálása'),
      h('p', null, `${shortName(file.name)} · ${meta.width} × ${meta.height} · ${meta.fps} fps · ${meta.duration.toFixed(1)} mp`),
      canvas, scrub,
      h('p', { class: 'small' }, 'Csak vektoros Lottie. Külső kép, betűkészlet és kifejezés ebben a szeletben nem importálható.'),
      h('div', { class: 'bar2' }, h('button', { class: 'btn', onclick: cancel }, 'Mégsem'),
        h('button', { class: 'btn accent', onclick: add }, 'Hozzáadás rétegként')));
    const observer = new MutationObserver(() => { if (!canvas.isConnected) { player.destroy(); observer.disconnect(); } });
    observer.observe(document.querySelector('#dlg'), { childList: true });
  } catch (e) { toast(`Lottie-import: ${e.message || e}`); }
}
export function chooseLottieFile() {
  const input = h('input', { type: 'file', accept: '.json,application/json' }) as HTMLInputElement;
  input.onchange = () => { const f = input.files?.[0]; if (f) void importLottieFile(f); };
  input.click();
}
R.openLottie = chooseLottieFile;
R.importLottieFile = importLottieFile;
