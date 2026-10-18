/** Small, offline-searchable Poly Haven CC0 texture shelf. Only the chosen 2K image is downloaded. */
import { R } from './runtime';
import { h } from './dom';
import { assets, imgTex, makeLayer } from './state';
import { texFromCanvas } from './gl';
import { insertItem } from './itemops';
import { commit, renderAll } from './history';
import { closeModal, openModal, toast } from './modals';

export const POLY_HAVEN_TEXTURES = [
  ['marble_01', 'Márvány', 'kő fehér elegáns'],
  ['dark_wood', 'Sötét fa', 'fa barna'],
  ['concrete_floor_01', 'Beton', 'szürke építészet'],
  ['rusty_metal', 'Rozsdás fém', 'fém ipari'],
  ['denim_fabric', 'Farmeranyag', 'textil kék'],
  ['aerial_sand', 'Homok felülről', 'táj sivatag'],
  ['aerial_beach_01', 'Tengerpart felülről', 'táj víz'],
  ['red_bricks_04', 'Vörös tégla', 'fal építészet'],
  ['mossy_rock', 'Mohás szikla', 'természet kő'],
  ['oak_wood_planks', 'Tölgyfa deszkák', 'fa barna'],
  ['blue_metal_plate', 'Kék fémlemez', 'fém ipari'],
  ['fabric_leather_01', 'Bőr', 'textil barna']
] as const;

export const polyHavenImageURL = (id: string) =>
  `https://dl.polyhaven.org/file/ph-assets/Textures/jpg/2k/${id}/${id}_diff_2k.jpg`;
const sourceURL = (id: string) => `https://polyhaven.com/a/${id}`;
const thumbnailURL = (id: string) => `https://cdn.polyhaven.com/asset_img/thumbs/${id}.png?width=192&height=192`;
const MAX_DOWNLOAD = 8_000_000;
const fold = (value: string) => value.toLocaleLowerCase('hu-HU').normalize('NFD').replace(/[\u0300-\u036f]/g, '');

async function downloadImage(url: string): Promise<Blob> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000);
  try {
    const response = await fetch(url, { signal: controller.signal, redirect: 'error' });
    if (!response.ok || !response.headers.get('content-type')?.toLowerCase().startsWith('image/jpeg'))
      throw new Error('A kép nem érhető el a Poly Havenről.');
    if (Number(response.headers.get('content-length') || 0) > MAX_DOWNLOAD)
      throw new Error('A kép túl nagy az importhoz.');
    const blob = await response.blob();
    if (blob.size > MAX_DOWNLOAD) throw new Error('A kép túl nagy az importhoz.');
    return blob;
  } finally { clearTimeout(timeout); }
}

export async function addPolyHavenTexture(id: string) {
  const entry = POLY_HAVEN_TEXTURES.find(e => e[0] === id);
  if (!entry) throw new Error('Ismeretlen Poly Haven elem.');
  const bitmap = await createImageBitmap(await downloadImage(polyHavenImageURL(id)));
  try {
    const canvas = document.createElement('canvas');
    const scale = Math.min(1, 2048 / Math.max(bitmap.width, bitmap.height));
    canvas.width = Math.max(1, Math.round(bitmap.width * scale));
    canvas.height = Math.max(1, Math.round(bitmap.height * scale));
    canvas.getContext('2d').drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    const assetId = 'PH' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
    const encoded = canvas.toDataURL('image/jpeg', .9);
    const layer = makeLayer('image', { name: entry[1], asset: assetId });
    layer.source = { provider: 'Poly Haven', id, url: sourceURL(id), license: 'CC0' };
    assets[assetId] = encoded;
    imgTex.set(assetId, { tex: texFromCanvas(canvas), w: canvas.width, h: canvas.height });
    insertItem(layer, null); commit(); renderAll(); closeModal();
    toast(`${entry[1]} hozzáadva · Poly Haven CC0`);
    return layer;
  } finally { bitmap.close(); }
}

export function openPolyHaven() {
  const search = h('input', { class: 'txt', type: 'search', placeholder: 'Keresés: márvány, fa, homok…', 'aria-label': 'Poly Haven textúrák keresése' }) as HTMLInputElement;
  const results = h('div', { style: 'display:grid;grid-template-columns:repeat(auto-fill,minmax(130px,1fr));gap:8px;max-height:48vh;overflow:auto' });
  const status = h('p', { class: 'small', role: 'status' }, 'Válassz egy textúrát.');
  let busy = false;
  const draw = () => {
    const query = fold(search.value.trim());
    results.replaceChildren();
    let count = 0;
    for (const [id, name, tags] of POLY_HAVEN_TEXTURES) {
      if (query && !fold(`${name} ${tags} ${id}`).includes(query)) continue;
      count++;
      const card = h('button', { class: 'btn', style: 'display:flex;flex-direction:column;align-items:stretch;text-align:left;gap:5px',
        onclick: async () => {
          if (busy) return;
          busy = true; status.textContent = `${name} letöltése…`;
          try { await addPolyHavenTexture(id); }
          catch (error) { status.textContent = `Nem sikerült: ${error instanceof Error ? error.message : String(error)}`; }
          finally { busy = false; }
        } },
        h('img', { src: thumbnailURL(id), alt: '', loading: 'lazy', style: 'width:100%;aspect-ratio:1;object-fit:cover;border-radius:4px' }),
        h('span', null, name));
      results.appendChild(card);
    }
    if (!count) results.appendChild(h('p', { class: 'small' }, 'Nincs találat ebben a válogatásban.'));
  };
  search.oninput = draw;
  openModal(h('h2', null, 'Poly Haven · textúrák'),
    h('p', null, 'Kurált CC0-válogatás. A kiválasztott kép saját rétegként, a projektbe mentve kerül a vászonra.'),
    h('p', { class: 'small' }, 'Ez most 2D képréteg; PBR-anyag és 3D skybox még nincs bekötve.'),
    search, results, status,
    h('div', { class: 'bar2' },
      h('a', { class: 'btn', href: 'https://polyhaven.com/textures', target: '_blank', rel: 'noopener noreferrer' }, 'Poly Haven ↗'),
      h('button', { class: 'btn', onclick: closeModal }, 'Bezárás')));
  draw(); search.focus();
}
R.openPolyHaven = openPolyHaven;
