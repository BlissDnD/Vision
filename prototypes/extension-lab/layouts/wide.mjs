/** Editable editorial study inspired by WIDE; independently authored, not an original-code port. */
import { normalize } from "./state.mjs";
import { sampleImages } from "./unwoven.mjs";
const arrangements = [
  [
    [0, 0, 65, 100],
    [71, 3, 29, 29],
    [71, 65, 29, 35],
  ],
  [
    [0, 4, 37, 82],
    [42, 22, 58, 78],
    [73, 0, 27, 18],
  ],
  [
    [0, 0, 100, 100],
    [5, 60, 22, 35],
    [73, 5, 22, 35],
  ],
  [
    [0, 0, 48, 100],
    [52, 0, 48, 100],
    [38, 64, 24, 31],
  ],
  [
    [0, 28, 65, 72],
    [70, 0, 30, 55],
    [70, 61, 30, 39],
  ],
];
export function createWide(host, options = {}, images = sampleImages) {
  let o = normalize(options),
    time = 0;
  const root = document.createElement("article");
  root.className = "wide-preset";
  const nav = document.createElement("nav");
  nav.textContent =
    "LFT / RGHT                                      COMPOSITION / 01";
  const stage = document.createElement("div");
  stage.className = "wide-stage";
  const plates = Array.from({ length: 3 }, (_, i) => {
    const img = document.createElement("img");
    img.alt = `Szerkeszthető kompozíció, ${i + 1}. kép`;
    stage.append(img);
    return img;
  });
  const title = document.createElement("h1"),
    subtitle = document.createElement("h2"),
    body = document.createElement("p"),
    footer = document.createElement("footer");
  footer.textContent =
    "LAB / VOL. 01                                              © 2026";
  stage.append(title, subtitle, body);
  root.append(nav, stage, footer);
  host.append(root);
  function seek(t) {
    time = Math.max(0, Number.isFinite(t) ? t : 0);
    const u = Math.min(1, time / o.duration),
      ease = 1 - (1 - u) ** 4;
    plates.forEach((img, i) => {
      const [x, y, w, h] = arrangements[o.composition][i];
      Object.assign(img.style, {
        left: `${x}%`,
        top: `${y}%`,
        width: `${w}%`,
        height: `${h}%`,
        transform: `translateY(${(1 - ease) * (i + 1) * 15}%) scale(${1 + (1 - ease) * 0.12})`,
        opacity: String(ease),
      });
    });
    title.style.transform = `translateY(${(1 - ease) * 35}%)`;
    title.style.opacity = String(ease);
  }
  function apply() {
    root.style.background = o.background;
    root.style.padding = `${o.margin}%`;
    root.style.setProperty("--title-size", o.titleSize + "cqw");
    root.style.setProperty("--gutter", o.gutter + "cqw");
    title.textContent = o.title;
    subtitle.textContent = o.subtitle;
    body.textContent = o.body;
    nav.textContent = `LFT / RGHT                                      COMPOSITION / 0${o.composition + 1}`;
    seek(time);
  }
  function setImages(urls) {
    if (!urls.length) throw Error("Legalább egy kép szükséges");
    plates.forEach((img, i) => (img.src = urls[i % urls.length]));
  }
  setImages(images);
  apply();
  return {
    seek,
    setOptions(input) {
      o = normalize({ ...o, ...input });
      apply();
    },
    setImages,
    serialize: () => ({ ...o }),
    dispose() {
      root.remove();
    },
  };
}
