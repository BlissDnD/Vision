/** Standalone selector for 63 isolated prototypes; not part of Vel. */
import "@melloware/coloris/dist/coloris.css";
import { registry } from "./registry.mjs";
import { createHost } from "./shared/gallery-host.mjs";
import { disposeObject } from "./core.mjs";
const select = document.querySelector("#module"),
  panel = document.querySelector("#panel"),
  status = document.querySelector("#status"),
  slider = document.querySelector("#time"),
  play = document.querySelector("#play");
for (const item of registry) {
  const option = document.createElement("option");
  option.value = item.id;
  option.textContent = `${String(item.id).padStart(2, "0")} · ${item.title}`;
  select.append(option);
}
let canvas = document.querySelector("canvas");
let host = null,
  session = null,
  generation = 0,
  time = 0,
  playing = false,
  busy = false,
  last = 0,
  raf = 0;
const setTime = (t) => {
  time = Number(t);
  slider.value = String(time);
};
async function choose() {
  const token = ++generation;
  playing = false;
  play.textContent = "Lejátszás";
  if (session) {
    session.dispose?.();
    if (session.object) disposeObject(session.object);
    session = null;
  }
  host?.dispose();
  host = null;
  panel.replaceChildren();
  setTime(0);
  status.textContent = "Betöltés…";
  try {
    const item = registry.find((e) => e.id === Number(select.value)),
      module = await item.load();
    if (token !== generation) return;
    const childPanel = document.createElement("div");
    panel.append(childPanel);
    const freshCanvas = canvas.cloneNode();
    canvas.replaceWith(freshCanvas);
    canvas = freshCanvas;
    const nextHost = createHost(canvas, childPanel, { setTime });
    host = nextHost;
    const next = await module.run(nextHost);
    if (token !== generation) {
      next?.dispose?.();
      if (next?.object) disposeObject(next.object);
      nextHost.dispose();
      return;
    }
    session = next || {};
    if (session.object) {
      if (![48, 49].includes(item.id)) host.reference.visible = false;
      host.scene.add(session.object);
    }
    if (session.data) host.show(session.data);
    status.textContent = "Prototípus · a vizuális ellenőrzés még hátravan.";
  } catch (error) {
    status.textContent = `A próba nem indult: ${error.message}`;
    console.error(error);
  }
}
async function frame(now) {
  raf = requestAnimationFrame(frame);
  if (busy || !host || host.exporting) return;
  const dt = Math.min(0.05, (now - (last || now)) / 1000);
  last = now;
  if (playing) setTime((time + dt) % 5);
  busy = true;
  const current = session;
  try {
    await current?.seek?.(time);
    if (current !== session) return;
    if (playing) current?.step?.(dt);
    if (current?.render) current.render();
    else host.renderer.render(host.scene, host.camera);
  } catch (error) {
    playing = false;
    status.textContent = `Próbahiba: ${error.message}`;
  } finally {
    busy = false;
  }
}
select.addEventListener("change", choose);
slider.addEventListener("input", () => setTime(slider.value));
play.addEventListener("click", () => {
  playing = !playing;
  play.textContent = playing ? "Szünet" : "Lejátszás";
});
document.querySelector("#reset").addEventListener("click", choose);
window.addEventListener("pagehide", () => {
  cancelAnimationFrame(raf);
  session?.dispose?.();
  if (session?.object) disposeObject(session.object);
  host?.dispose();
});
await choose();
requestAnimationFrame(frame);
