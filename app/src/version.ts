/** Version + build stamp next to the brand (top left), so the running build is always identifiable. Values come from the
 *  build (package.json version, build time); the Vite dev server shows „dev”. */
declare const __VERSION__: string, __BUILT__: string;
export const VERSION = typeof __VERSION__ !== 'undefined' ? __VERSION__ : 'dev';
export const BUILT = typeof __BUILT__ !== 'undefined' ? new Date(__BUILT__) : null;
const p2 = (n: number) => String(n).padStart(2, '0');
export const buildLabel = () => BUILT ? `${BUILT.getFullYear()}.${p2(BUILT.getMonth() + 1)}.${p2(BUILT.getDate())} ${p2(BUILT.getHours())}:${p2(BUILT.getMinutes())}` : 'dev';
const b = document.querySelector('.brand');
if (b) { const s = document.createElement('span'); s.className = 'ver'; s.textContent = `v${VERSION} · ${BUILT ? buildLabel().slice(5) : 'dev'}`; s.title = `Verzió ${VERSION} · build ${buildLabel()}`; b.appendChild(s); }
