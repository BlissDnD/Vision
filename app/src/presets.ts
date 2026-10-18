/** P1: presets from outside (ChatGPT) and the user's own shelves.
 *  - shelves: own library items (userlib.ts) appear on their shelf with a „saját” mark (LIB entries with `own`)
 *  - „Mentés presetként” for the selected layer / group, „Preset beillesztése” (paste or .json drop), „Utasítás ChatGPT-nek”
 *  - custom shader: named slider editor (L.cp), compile check, test render with a cost estimate */
import { R } from './runtime';
import { $, h } from './dom';
import { CATS, LIB } from './library';
import { EFFECTS, kindOf, paramsOf, CP_MAX, CP_KEY } from './effects/index';
import { assets, cloneItem, mkN, normalize, sel, st, walk } from './state';
import { ULIB, ulibDel, ulibExport, ulibGet, ulibId, ulibImport, ulibLoad, ulibPut } from './userlib';
import { TH, TW, thumbCache, thumbOf } from './thumbs';
import { audCache, buildCats, buildShelf } from './shelf';
import { cv, getProg, gl, mkCtx, progError } from './gl';
import { normCam, outSize, present, renderScene } from './render';
import { loadAsset } from './text';
import { insertItem } from './itemops';
import { commit, loadMsg, loadProject, renderAll } from './history';
import { closeBtn, closeModal, openModal, toast } from './modals';
import { saveFile } from './output';
import { markDirty } from './loop';
import { renderInsp } from './inspector';
import { buildFromSpec } from './describe';
import { PRESET_SKIP, chatPrompt } from './presetfmt';
import { loadLabel } from './cost';

const CATK = CATS.map(c => c[0]);
const catOf = (c: string) => CATK.includes(c) ? c : 'recipes';
/** A fresh, independent copy of a library item, tagged with its library id (so the project file can carry it). */
export function makeFromU(x: any) {
  const d = x.data || {};
  for (const id in d.assets || {}) if (!assets[id]) { assets[id] = d.assets[id]; loadAsset(id); }
  const it = cloneItem(normalize(JSON.parse(JSON.stringify(d.item))));
  it.ulib = x.id; return it;
}
/** Rebuild the own entries of every shelf from the library (built-in entries keep their indices). */
export function syncLib() {
  for (const c of CATK) { const keep = LIB[c].filter((x: any) => !x.own); LIB[c].length = 0; LIB[c].push(...keep); }
  for (const x of ULIB) {
    if (!x.data || !x.data.item || (x.kind !== 'preset' && x.kind !== 'shader')) continue; // other kinds: kept, not shown yet
    LIB[catOf(x.cat)].push({ name: x.name, own: x.id, kind: x.kind, thumb: x.thumb, cam: x.data.cam || null, dur: x.data.dur || null, make: () => makeFromU(x) });
  }
  for (const k in thumbCache) if (k.startsWith('own:')) delete thumbCache[k];
  for (const k in audCache) if (k.startsWith('own:')) delete audCache[k];
}
R.onUlib = () => { syncLib(); if ($('#items') && $('#cats').childElementCount) buildShelf(); };
ulibLoad().catch(() => { /* memory only */ });

/* ---------- saving ---------- */
const thumbURL = (it: any) => { try { return thumbOf(cloneItem(it)).toDataURL('image/webp', .85); } catch (e) { console.warn(e); return null; } };
const itemAssets = (it: any) => { const o: any = {}; walk([it], (L: any) => { if (L.asset && assets[L.asset]) o[L.asset] = assets[L.asset]; }); return o; };
const strip = (it: any) => { const c = JSON.parse(JSON.stringify(it)); walk([c], (L: any) => { delete L.ulib; }); return c; };
export const defaultCat = (it: any) => it.type === 'group' ? 'recipes' : it.type === 'custom' ? 'gen' : ({ fx: 'fx', shape: 'shapes', '3d': '3d', text: 'media', image: 'media' } as any)[kindOf(it)] || 'gen';
/** Save an item (layer or group) into the library. Returns the stored item. */
export async function saveAsPreset(it: any, name: string, cat: string, extra: any = {}) {
  const item = strip(it);
  return ulibPut({ id: ulibId(), kind: it.type === 'custom' ? 'shader' : 'preset', cat: catOf(cat), name: (name || it.name).slice(0, 60), created: Date.now(),
    data: { item, assets: itemAssets(it), ...extra }, thumb: thumbURL(it) });
}
const catSelect = (cur: string) => h('select', { 'aria-label': 'Polc' }, ...CATS.map(([k, l]) => { const o = h('option', { value: k }, l); if (k === cur) o.selected = true; return o; }));
export function savePresetModal(it?: any) {
  it = it || sel(); if (!it) { toast("Select a layer or group first."); return; }
  const nm = h('input', { class: 'txt', value: it.name, 'aria-label': 'Preset neve' }); const cs = catSelect(defaultCat(it));
  openModal(h('h2', null, "Save as preset"), h('p', null, "The selected item is saved to your Library on the chosen shelf. You can add it again by clicking or dragging it. The browser keeps it, and you can export the Library from the Project menu."),
    h('div', { class: 'row2' }, h('span', null, "Name"), nm), h('div', { class: 'row2' }, h('span', null, 'Polc'), h('div', { class: 'pop' }, cs)),
    h('div', { class: 'bar2' }, closeBtn(), h('button', { class: 'btn accent', onclick: async () => {
      const x = await saveAsPreset(it, nm.value.trim(), cs.value); closeModal();
      if (x) { R.cat = x.cat; R.libQ = ''; $('#libSearch').value = ''; buildCats(); buildShelf(); toast(`Saved to your Library: ${x.name}${R.ulibOk ? '' : " (this browser will only keep it for this session; save it to a file)"}`); }
    } }, "Save")));
}
R.savePreset = savePresetModal;

/** Rename / move / delete an own item (right click or ⋯ on its card). Built-in items never reach here. */
export function ownMenu(id: string) {
  const x = ulibGet(id); if (!x) return;
  const nm = h('input', { class: 'txt', value: x.name, 'aria-label': "Name" }); const cs = catSelect(catOf(x.cat)); let sure = false;
  const del = h('button', { class: 'btn', onclick: async () => { if (!sure) { sure = true; del.textContent = "Delete this item?"; return; } await ulibDel(id); closeModal(); toast(`Deleted: ${x.name}`); } }, "Delete");
  openModal(h('h2', null, "Custom item"), h('p', { class: 'small' }, `${x.kind === 'shader' ? "Custom shader" : 'Preset'} · mentve ${new Date(x.created).toLocaleString('hu-HU')}`),
    h('div', { class: 'row2' }, h('span', null, "Name"), nm), h('div', { class: 'row2' }, h('span', null, 'Polc'), h('div', { class: 'pop' }, cs)),
    h('div', { class: 'bar2' }, del, closeBtn(), h('button', { class: 'btn accent', onclick: async () => { await ulibPut({ ...x, name: nm.value.trim() || x.name, cat: cs.value }); closeModal(); } }, "Save")));
}
R.ownMenu = ownMenu;

/* ---------- cost and compile checks ---------- */
/** Compile errors of every custom shader in the items: [{name, err}]. */
export function shaderErrors(items: any[]) {
  const out: any[] = []; walk(items, (L: any) => { for (const X of [L, ...(L.fx || [])]) if (X.type === 'custom') { getProg(X); const e = progError(X); if (e) out.push({ name: X.name, err: e }); } }); return out;
}
/** Average ms per frame of items at 480×270 (presented on the canvas and read back, so the GPU really finishes). */
function msPerFrame(items: any[], n = 3) {
  if (!R.costCtx) { R.costCtx = mkCtx(480, 270); R.costCtx.noCam = true; }
  const ctx = R.costCtx, px = new Uint8Array(4); let best = 1e9;
  for (let rep = 0; rep < 2; rep++) {
    const t0 = performance.now();
    for (let i = 0; i < n; i++) { const t = 1 + i * .1; const out = renderScene(items, ctx, t, '#000'); present(ctx, out.t, null, cv.width, cv.height, t); }
    gl.bindFramebuffer(gl.FRAMEBUFFER, null); gl.readPixels(0, 0, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, px);
    best = Math.min(best, (performance.now() - t0) / n);
  }
  return best;
}
/** Test render: cost of the items in built-in cost units (1 = a light generator like Plasma). Custom layers get their own weight (L.cw). */
export function measureCost(items: any[]) {
  const ref = Math.max(.05, msPerFrame([R.costRef || (R.costRef = normalize({ type: 'plasma', name: 'ref', vis: true, blend: 'normal', clip: false, n: {}, fx: [] }))]));
  walk(items, (L: any) => { if (L.type === 'custom' && !progError(L)) L.cw = Math.max(1, Math.min(30, Math.round(msPerFrame([L]) / ref))); });
  const w = msPerFrame(items) / ref; markDirty();
  return { w, label: loadLabel(w * 2.2), heavy: w > 12 };
}

/* ---------- paste a preset ---------- */
/** Pull the JSON object out of a ChatGPT answer (code fences and prose around it are fine). */
export function extractJSON(text: string) {
  const s = String(text || ''); const f = s.match(/```(?:json)?\s*([\s\S]*?)```/i); const body = f ? f[1] : s;
  const a = body.indexOf('{'), b = body.lastIndexOf('}'); if (a < 0 || b < a) throw new Error("No JSON object was found in the text.");
  try { return JSON.parse(body.slice(a, b + 1)); } catch (e: any) { throw new Error("Invalid JSON: " + e.message); }
}
/** Validate + build + check a pasted preset. No side effects on the project. */
export function checkPreset(text: string, opt: any = {}) {
  const sp = extractJSON(text);
  const r: any = buildFromSpec(sp, { skip: PRESET_SKIP, single: true });
  r.name = String(sp.name || r.items[r.items.length - 1].name).slice(0, 60);
  r.errors = shaderErrors(r.items);
  r.cost = opt.noCost ? null : measureCost(r.items);
  return r;
}
/** Library form of a pasted result: one item (a base recipe's layers and controls are merged into the group). */
function oneItem(r: any) {
  if (r.items.length === 1) return r.items[0];
  const [rc, g] = r.items; g.children = [...rc.children, ...g.children]; g.macros = [...(rc.macros || []), ...(g.macros || [])]; return g;
}
export function insertPreset(r: any) {
  for (const it of r.items) insertItem(it, null);
  if (r.cam) st.cam = normCam(r.cam); if (r.dur) st.dur = r.dur;
  commit(); renderAll(); markDirty();
}
export const errText = (r: any) => `The preset shader did not compile in Vel. Fix it and send the complete JSON again.\n\n${r.errors.map((e: any) => `Layer “${e.name}”:\n${e.err}`).join('\n\n')}`;
async function copy(text: string) { try { await navigator.clipboard.writeText(text); return true; } catch (_) { return false; } }
export function pasteModal(initial?: string) {
  const ta = h('textarea', { class: 'code dropzone', style: 'min-height:150px', spellcheck: 'false', 'aria-label': 'Preset JSON', placeholder: "Paste the ChatGPT response here (a ```json block is fine), or drop a .json file." });
  const pv = h('canvas', { width: TW, height: TH }); const rep = h('div', { class: 'rep' }, "Nothing to check yet.");
  const nm = h('input', { class: 'txt', 'aria-label': "Library name", placeholder: "Name" }); const cs = catSelect('recipes');
  const ins = h('button', { class: 'btn accent', disabled: true }, "Add to scene"); const sv = h('button', { class: 'btn', disabled: true }, "Save to Library");
  let cur: any = null, curProject: any = null, tmo: any;
  const run = () => {
    cur = curProject = null; ins.disabled = sv.disabled = true; ins.textContent = "Add to scene"; const txt = ta.value.trim(); if (!txt) { rep.textContent = "Nothing to check yet."; return; }
    try {
      const obj = extractJSON(txt);
      if (obj.app === 'vel' && obj.state && Array.isArray(obj.state.layers)) {
        curProject = obj; ins.disabled = false; ins.textContent = "Open project (replaces the current one)";
        rep.innerHTML = ''; rep.appendChild(h('div', { class: 'ok' }, `Vel project file · ${obj.state.layers.length} layers. Opening it replaces the current project.`));
        return;
      }
      const r = checkPreset(txt); cur = r; ins.disabled = sv.disabled = false;
      nm.value = r.name; cs.value = defaultCat(r.items[r.items.length - 1]);
      try { pv.getContext('2d')!.drawImage(thumbOf(cloneItem(r.items[r.items.length - 1])), 0, 0); } catch (_) { /* preview only */ }
      const top = r.items[r.items.length - 1]; const nL = r.items.reduce((s: number, x: any) => s + (x.type === 'group' ? x.children.length : 1), 0);
      rep.innerHTML = '';
      rep.appendChild(h('div', { class: 'ok' }, `✓ ${nL} layers${r.macros ? ` · ${r.macros} controls` : ''}${r.cam ? " · with camera" : ''}${top.type === 'custom' || JSON.stringify(r.items).includes('"custom"') ? " · custom shader" : ''}`));
      if (r.cost) rep.appendChild(h('div', { class: r.cost.heavy ? 'warn' : '' }, `Estimated rendering cost: ${r.cost.label} (≈ ${r.cost.w.toFixed(1)} × Plazma)${r.cost.heavy ? " · may be too demanding: ask for a simpler shader or lower the quality" : ''}`));
      if (r.dropped.length) rep.appendChild(h('div', { class: 'warn' }, `Kimaradt (${r.dropped.length}):`, h('ul', null, ...r.dropped.slice(0, 12).map((d: string) => h('li', null, d)))));
      if (r.errors.length) {
        rep.appendChild(h('div', { class: 'errbox', style: 'margin:6px 0' }, "The custom shader failed to compile and will remain blank. Send this error back to ChatGPT:",
          h('pre', null, r.errors.map((e: any) => `${e.name}: ${e.err}`).join('\n\n')),
          h('div', { class: 'btnrow' }, h('button', { class: 'btn', onclick: async () => toast(await copy(errText(r)) ? "Error copied. Paste it into ChatGPT." : "Could not copy automatically. Select the error and copy it.") }, "Copy error for ChatGPT"))));
      }
    } catch (e: any) { rep.innerHTML = ''; rep.appendChild(h('div', { class: 'errbox', style: 'margin:0' }, e.message || String(e))); }
  };
  ta.oninput = () => { clearTimeout(tmo); tmo = setTimeout(run, 400); };
  const readFile = (f: File) => f.text().then(t => { ta.value = t; run(); }).catch(() => toast("Could not read the file."));
  ta.ondragover = (e: DragEvent) => { if (e.dataTransfer && [...e.dataTransfer.items].some(i => i.kind === 'file')) { e.preventDefault(); ta.classList.add('over'); } };
  ta.ondragleave = () => ta.classList.remove('over');
  ta.ondrop = (e: DragEvent) => { ta.classList.remove('over'); const f = e.dataTransfer && e.dataTransfer.files[0]; if (f) { e.preventDefault(); readFile(f); } };
  const fi = h('input', { type: 'file', accept: '.json,application/json,text/plain', hidden: true }); fi.onchange = () => { const f = fi.files && fi.files[0]; if (f) readFile(f); fi.value = ''; };
  ins.onclick = () => { if (curProject) { try { loadProject(curProject); closeModal(); toast(loadMsg()); } catch (e: any) { rep.innerHTML = ''; rep.appendChild(h('div', { class: 'errbox' }, e.message || String(e))); } return; }
    if (!cur) return; const r = cur; insertPreset(r); closeModal(); toast(`Beillesztve: ${r.name}${r.dropped.length ? ` · ${r.dropped.length} elem kimaradt` : ''} · ⌘Z visszavonja`); };
  sv.onclick = async () => { if (!cur) return; const r = checkPreset(ta.value, { noCost: true });
    const w = collect(cur.items).map(L => L.cw); collect(r.items).forEach((L, i) => { if (w[i]) L.cw = w[i]; }); const it = oneItem(r);
    const x = await saveAsPreset(it, nm.value.trim() || r.name, cs.value, r.cam ? { cam: r.cam, dur: r.dur } : {});
    if (x) { R.cat = x.cat; R.libQ = ''; $('#libSearch').value = ''; buildCats(); buildShelf(); toast(`Added to your Library: ${x.name}`); sv.disabled = true; } };
  openModal(h('h2', null, "Paste preset"), h('p', null, "Paste JSON from ChatGPT, or drop a .json file. Vel checks it, shows a preview, and reports anything it could not import. Press ⌘Z to undo after adding it."),
    ta, h('div', { class: 'pv' }, pv, rep), h('div', { class: 'row2' }, h('span', null, "To Library"), h('div', { class: 'btnrow' }, nm, h('div', { class: 'pop' }, cs))),
    h('div', { class: 'bar2' }, h('button', { class: 'btn', onclick: () => fi.click() }, "File…"), fi, closeBtn(), sv, ins));
  if (initial) { ta.value = initial; setTimeout(run, 0); }
}
/** A .json file dropped anywhere outside a dialog: a library file is imported, a preset opens in the paste dialog. */
const isJsonFile = (e: DragEvent) => !!e.dataTransfer && [...e.dataTransfer.items].some(i => i.kind === 'file');
window.addEventListener('dragover', e => { if (isJsonFile(e) && !(e.target as any).closest?.('#dlg')) e.preventDefault(); });
window.addEventListener('drop', e => {
  const f = e.dataTransfer && e.dataTransfer.files[0]; if (!f || (e.target as any).closest?.('#dlg') || !/\.json$/i.test(f.name)) return; e.preventDefault();
  f.text().then(t => { let o: any = null; try { o = JSON.parse(t); } catch (_) { /* maybe a ChatGPT answer with prose */ }
    if (o && !o.app && !o.state && !o.kind && Array.isArray(o.layers) && ('fr' in o || 'op' in o)) { R.importLottieFile(f,t); return; }
    if (o && o.kind === 'userlib') return ulibImport(t).then(n => toast(n ? `${n} new items added to your Library.` : "No new items; they were all already in the Library."));
    if (o && o.state) { pasteModal(t); return; }
    pasteModal(t); }).catch(err => toast(err.message || "Could not read the file."));
});
const collect = (items: any[]) => { const o: any[] = []; walk(items, (L: any) => { if (L.type === 'custom') o.push(L); }); return o; };

/* ---------- ChatGPT instruction, library file ---------- */
export function chatText() { const { W, H } = outSize(); return chatPrompt(W, H, Math.round(st.dur || 8)); }
export async function copyChatPrompt() {
  const t = chatText();
  if (await copy(t)) { toast(`Prompt copied (${Math.round(t.length / 1000)} thousand characters). Paste it into ChatGPT and ask for a preset.`); return; }
  const ta = h('textarea', { class: 'code', style: 'min-height:260px', 'aria-label': "Prompt" }); ta.value = t;
  openModal(h('h2', null, "Prompt for ChatGPT"), h('p', null, "Clipboard unavailable. Select all (⌘A) and copy (⌘C)."), ta, h('div', { class: 'bar2' }, closeBtn()));
  setTimeout(() => { ta.focus(); ta.select(); }, 0);
}
const libFile = h('input', { type: 'file', accept: '.json,application/json', hidden: true });
libFile.onchange = () => { const f = libFile.files && libFile.files[0]; libFile.value = ''; if (!f) return;
  f.text().then(ulibImport).then(n => { toast(n ? `${n} new items added to your Library.` : "No new items; they were all already in the Library."); }).catch(e => toast(e.message || "Invalid file.")); };
document.body.appendChild(libFile);
/** Extra rows for the Projekt dialog (modals.ts asks via R.projExtra). */
R.projExtra = () => h('div', null,
  h('h3', { class: 'small', style: 'margin:14px 0 6px' }, "External presets (ChatGPT)"),
  h('div', { class: 'btnrow' }, h('button', { class: 'btn accent', onclick: copyChatPrompt }, "Prompt for ChatGPT"), h('button', { class: 'btn', onclick: pasteModal }, "Paste preset…")),
  h('h3', { class: 'small', style: 'margin:14px 0 6px' }, `Your Library · ${ULIB.length} elem${R.ulibOk ? '' : " · for this session only (the browser does not allow persistent storage)"}`),
  h('div', { class: 'btnrow' }, h('button', { class: 'btn', onclick: () => saveFile(`vel-sajat-konyvtar-${new Date().toISOString().slice(0, 10)}.json`, ulibExport()) }, "Export Library to file"),
    h('button', { class: 'btn', onclick: () => libFile.click() }, "Import Library…"), h('button', { class: 'btn', onclick: () => savePresetModal() }, "Save selection as preset…")));

/* ---------- custom shader: named sliders ---------- */
/** Editor of L.cp (name, key, range, default, colour). L.cp is always replaced (paramsOf caches per array). */
export function cpEditor(L: any) {
  const cp = Array.isArray(L.cp) ? L.cp : [];
  const apply = (next: any[]) => { L.cp = next; for (const d of paramsOf(L)) if (!L.p[d.k] || (d.type === 'color') !== (typeof L.p[d.k].v === 'string')) L.p[d.k] = mkN(d.def); commit(); renderInsp(); markDirty(); };
  const rows: any[] = [h('b', null, "Name"), h('b', null, "Code: p_…"), h('b', null, 'Min'), h('b', null, 'Max'), h('b', null, 'Alap'), h('b', null, '')];
  cp.forEach((c: any, i: number) => {
    const upd = (patch: any) => apply(cp.map((x: any, j: number) => j === i ? { ...x, ...patch } : x));
    const inp = (v: any, f: (s: string) => void, lbl: string, type = 'text') => { const e = h('input', { class: 'txt', value: v ?? '', type, 'aria-label': lbl }); e.onchange = () => f(e.value); return e; };
    rows.push(inp(c.l, s => upd({ l: s }), "Slider name"),
      inp(c.k, s => { if (!CP_KEY.test(s) || cp.some((x: any, j: number) => j !== i && x.k === s)) { toast("The code must start with a letter, contain only letters, numbers and _, and be unique."); renderInsp(); return; } upd({ k: s }); }, "Slider code"));
    if (c.color) rows.push(h('span', { class: 'small' }, "color"), h('span'), inp(c.def, s => upd({ def: s }), "Base color", 'color'));
    else rows.push(inp(c.min, s => upd({ min: +s }), 'Minimum', 'number'), inp(c.max, s => upd({ max: +s }), 'Maximum', 'number'), inp(c.def, s => upd({ def: +s }), "Default value", 'number'));
    rows.push(h('button', { class: 'btn', title: "Delete slider", onclick: () => apply(cp.filter((_: any, j: number) => j !== i)) }, '×'));
  });
  const first = () => cp.length ? cp : EFFECTS.custom.params.map((d: any) => ({ k: d.k, l: 'p_' + d.k, min: 0, max: 1, def: L.p[d.k] ? L.p[d.k].v : d.def }));
  const free = (b: string) => { let i = 1; while (first().some((x: any) => x.k === b + i)) i++; return b + i; };
  return h('div', { class: 'ctl' }, h('div', { class: 'top' }, h('span', { class: 'lab' }, "Named sliders")),
    cp.length ? h('div', { class: 'cpgrid' }, ...rows) : h('p', { class: 'small' }, "The p_a … p_d sliders are active. Add a named slider and use it in code as p_<code>. It can be animated like the built-in sliders."),
    h('div', { class: 'btnrow' },
      h('button', { class: 'btn', disabled: cp.length >= CP_MAX, onclick: () => { const b = first(); apply([...b, { k: free('s'), l: "New slider", min: 0, max: 1, def: .5 }]); } }, "+ Slider"),
      h('button', { class: 'btn', disabled: cp.length >= CP_MAX, onclick: () => { const b = first(); apply([...b, { k: free('col'), l: "Color", color: true, def: '#ff8a3d' }]); } }, "+ Color")));
}
R.cpEditor = cpEditor;
