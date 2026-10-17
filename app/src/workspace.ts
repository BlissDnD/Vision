/* U3 workspace chrome: library/layers splitter, one tooltip style for every titled control, toggleable shortcut panel.
   Pure UI: never touches the project (no commit). Per-viewer choices live in localStorage. */
import { $, h } from './dom';

export const SHORTCUTS: [string, [string, string][]][] = [
  ['Idő', [['Szóköz', 'Lejátszás / szünet'], ['Home', 'Vissza az elejére'], [', .', 'Előző / következő kulcskocka'], ['J', 'Jelzés az aktuális időre']]],
  ['Eszközök', [['V', 'Mozgatás és méretezés'], ['O', '3D forgatás'], ['A', 'Animálás mód'], ['E', 'Eljátszás'], ['K', 'Elhelyezés-kulcskocka'], ['G', 'Fogantyúk'], ['F', 'Teljes képernyő'], ['R', 'Véletlen látomás'], ['Görgő', 'Méretezés a vásznon']]],
  ['Rétegek', [['⌘D', 'Duplikálás'], ['⌘G', 'Csoportba foglalás'], ['Del', 'Törlés'], ['[ ]', 'Réteg le / fel'], ['H', 'Elrejtés'], ['⌘Z / ⇧⌘Z', 'Visszavonás / újra'], ['⌘C / ⌘V', 'Kulcskockák másolása / beillesztése'], ['Esc', 'Kijelölés és menük bezárása'], ['?', 'Ez a panel']]],
];

const ls = (k: string, v?: string) => { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (_) { } return null; };

/* ---------- splitter between the library and the layers ---------- */
const side = $('#side') as HTMLElement, split = $('#split') as HTMLElement;
const DEF = 52;
export function setShelfFrac(pct: number, save = true) {
  const H = side.getBoundingClientRect().height || 600;
  const lo = Math.min(50, 120 / H * 100), hi = Math.max(lo, 100 - 118 / H * 100);
  pct = Math.min(hi, Math.max(lo, pct));
  side.style.setProperty('--shelfH', pct.toFixed(1) + '%');
  split.setAttribute('aria-valuenow', String(Math.round(pct)));
  if (save) ls('vel.shelfH', pct.toFixed(1));
  return pct;
}
export const shelfFrac = () => parseFloat(side.style.getPropertyValue('--shelfH')) || DEF;
split.setAttribute('aria-valuemin', '0'); split.setAttribute('aria-valuemax', '100');
side.style.setProperty('--shelfH', (+(ls('vel.shelfH') || DEF) || DEF) + '%');
split.onpointerdown = e => {
  e.preventDefault(); try { split.setPointerCapture(e.pointerId); } catch (_) { }
  split.classList.add('drag');
  const mv = (ev: PointerEvent) => { const r = side.getBoundingClientRect(); setShelfFrac((ev.clientY - r.top) / r.height * 100, false); };
  const up = () => { split.classList.remove('drag'); split.removeEventListener('pointermove', mv); split.removeEventListener('pointerup', up); split.removeEventListener('pointercancel', up); setShelfFrac(shelfFrac()); };
  split.addEventListener('pointermove', mv); split.addEventListener('pointerup', up); split.addEventListener('pointercancel', up);
};
split.ondblclick = () => setShelfFrac(DEF);
split.onkeydown = e => { const d = e.key === 'ArrowUp' ? -4 : e.key === 'ArrowDown' ? 4 : 0; if (d) { e.preventDefault(); setShelfFrac(shelfFrac() + d); } };

/* ---------- tooltips: every [title] gets the same quick, styled tip; "(X)" becomes a key cap ---------- */
let tip: HTMLElement | null = null, tipFor: Element | null = null, tipTimer = 0;
export function tipNodes(text: string) {
  const out: (string | HTMLElement)[] = []; const re = /\(([^()]{1,10})\)/g; let i = 0, m: RegExpExecArray | null;
  while ((m = re.exec(text))) { out.push(text.slice(i, m.index)); out.push(h('kbd', null, m[1])); i = m.index + m[0].length; }
  out.push(text.slice(i)); return out.filter(x => x !== '');
}
function hideTip() { clearTimeout(tipTimer); tipFor = null; if (tip) tip.hidden = true; }
function showTip(el: Element) {
  const text = (el as HTMLElement).dataset.tip; if (!text || !el.isConnected) return;
  if (!tip) { tip = h('div', { class: 'vtip', role: 'tooltip' }); document.body.appendChild(tip); }
  tip.replaceChildren(...tipNodes(text)); tip.hidden = false;
  const r = el.getBoundingClientRect(), tr = tip.getBoundingClientRect(), W = innerWidth, H = innerHeight;
  let y = r.bottom + 6; if (y + tr.height > H - 6) y = r.top - tr.height - 6;
  const x = Math.min(W - tr.width - 8, Math.max(8, r.left + r.width / 2 - tr.width / 2));
  tip.style.left = x + 'px'; tip.style.top = Math.max(6, y) + 'px';
}
/** Move a native title into data-tip (keeps an accessible name), so only our tooltip shows. */
export function adoptTitle(el: Element) {
  const t = el.getAttribute('title'); if (t == null) return;
  (el as HTMLElement).dataset.tip = t; el.removeAttribute('title');
  if (!el.getAttribute('aria-label') && !(el.textContent || '').trim()) el.setAttribute('aria-label', t);
}
document.addEventListener('pointerover', e => {
  const el = (e.target as Element).closest && (e.target as Element).closest('[title],[data-tip]');
  if (!el) { hideTip(); return; }
  adoptTitle(el); if (el === tipFor) return;
  hideTip(); tipFor = el; tipTimer = window.setTimeout(() => showTip(el), 380);
});
document.addEventListener('pointerdown', hideTip, true);
document.addEventListener('wheel', hideTip, { passive: true, capture: true });
document.addEventListener('keydown', hideTip, true);

/* ---------- shortcut panel on the stage ---------- */
const kh = $('#keyHelp') as HTMLElement, kb = $('#keysBtn') as HTMLElement;
kh.appendChild(h('h4', null, 'Gyorsbillentyűk', h('button', { class: 'ib', 'aria-label': 'Bezárás', onclick: () => setKeyHelp(false), style: 'width:22px;height:20px' }, '×')));
for (const [g, rows] of SHORTCUTS) { kh.appendChild(h('div', { class: 'grp' }, g)); kh.appendChild(h('dl', null, ...rows.flatMap(([k, d]) => [h('dt', null, h('kbd', null, k)), h('dd', null, d)]))); }
export function setKeyHelp(on: boolean) { kh.hidden = !on; kb.setAttribute('aria-pressed', String(on)); ls('vel.keys', on ? '1' : '0'); }
export const keyHelpOn = () => !kh.hidden;
kb.onclick = () => setKeyHelp(kh.hidden);
setKeyHelp(ls('vel.keys') === '1');
