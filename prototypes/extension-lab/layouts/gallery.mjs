/** Isolated layout workbench; no connection to Vel state. */
import { createUnwoven } from "./unwoven.mjs";
import { createWide } from "./wide.mjs";
import { defaults, ranges, normalize } from "./state.mjs";
const $ = (s) => document.querySelector(s),
  host = $("#stage");
let adapter,
  o = { ...defaults },
  time = 5,
  playing = false,
  last = 0,
  urls = [],
  busy = false;
const labels = {
  threads: "Szalagok száma",
  segments: "Szalag részletessége",
  height: "Kártyamagasság",
  aspect: "Képarány",
  gap: "Képköz",
  radius: "Sarokkerekítés",
  speed: "Sebesség / irány",
  offset: "Képsor eltolása",
  zone: "Szétbomlási zóna",
  zoneMax: "Zóna felső határa",
  strength: "Szétbomlás ereje",
  wobble: "Szalagok hullámzása",
  seed: "Véletlen változat",
  margin: "Margó",
  gutter: "Szöveg térköze",
  titleSize: "Főcím mérete",
  duration: "Beúszás hossza",
  composition: "Kompozíció",
  title: "Főcím",
  subtitle: "Alcím",
  body: "Szöveg",
  background: "Háttér",
};
function panel() {
  const keys =
    $("#preset").value === "unwoven"
      ? Object.keys(ranges).slice(0, 14)
      : [
          "margin",
          "gutter",
          "titleSize",
          "duration",
          "composition",
          "title",
          "subtitle",
          "body",
        ];
  $("#controls").replaceChildren();
  for (const key of [...keys, "background"]) {
    const label = document.createElement("label"),
      caption = document.createElement("span"),
      input = document.createElement(key === "body" ? "textarea" : "input");
    input.id = `control-${key}`;
    caption.textContent = labels[key] + (key in ranges ? ` · ${o[key]}` : "");
    if (key in ranges) {
      input.type = "range";
      [input.min, input.max, input.step] = ranges[key];
    } else input.type = key === "background" ? "color" : "text";
    input.value = o[key];
    input.oninput = () => {
      o = normalize({
        ...o,
        [key]: key in ranges ? Number(input.value) : input.value,
      });
      caption.textContent = labels[key] + (key in ranges ? ` · ${o[key]}` : "");
      adapter.setOptions(o);
    };
    label.append(caption, input);
    $("#controls").append(label);
  }
}
async function mount() {
  if (busy) return;
  busy = true;
  $("#preset").disabled = true;
  $("#status").textContent = "Betöltés…";
  adapter?.dispose();
  try {
    adapter =
      $("#preset").value === "unwoven"
        ? await createUnwoven(host, o, urls.length ? urls : undefined)
        : createWide(host, o, urls.length ? urls : undefined);
    adapter.seek(time);
    window.layoutLab = adapter;
    panel();
    $("#status").textContent =
      $("#preset").value === "unwoven"
        ? "Eredeti shader · saját idővezérlés"
        : "Önálló tanulmány · az eredeti WIDE forrása még hiányzik";
  } catch (e) {
    $("#status").textContent = e.message;
  } finally {
    busy = false;
    $("#preset").disabled = false;
  }
}
$("#preset").onchange = mount;
$("#time").oninput = (e) => {
  time = Number(e.target.value);
  adapter?.seek(time);
};
$("#play").onclick = () => {
  playing = !playing;
  $("#play").textContent = playing ? "Szünet" : "Lejátszás";
};
$("#reset").onclick = () => {
  o = { ...defaults };
  time = 5;
  $("#time").value = time;
  adapter?.setOptions(o);
  adapter?.seek(time);
  panel();
};
$("#save").onclick = () => {
  const blob = new Blob(
      [
        JSON.stringify(
          {
            version: 1,
            preset: $("#preset").value,
            options: adapter.serialize(),
          },
          null,
          2,
        ),
      ],
      { type: "application/json" },
    ),
    url = URL.createObjectURL(blob),
    a = document.createElement("a");
  a.href = url;
  a.download = "vel-layout.json";
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};
$("#load").onchange = async (e) => {
  try {
    const data = JSON.parse(await e.target.files[0].text());
    if (data.version !== 1 || !["wide", "unwoven"].includes(data.preset))
      throw Error("Ismeretlen presetformátum");
    o = normalize(data.options);
    $("#preset").value = data.preset;
    await mount();
  } catch (err) {
    $("#status").textContent = err.message;
  }
};
$("#images").onchange = async (e) => {
  if (busy) return;
  const next = [...e.target.files]
    .slice(0, 24)
    .map((f) => URL.createObjectURL(f));
  if (!next.length) return;
  busy = true;
  try {
    await adapter.setImages(next);
    urls.forEach(URL.revokeObjectURL);
    urls = next;
    $("#status").textContent = "Képek lecserélve";
  } catch (err) {
    next.forEach(URL.revokeObjectURL);
    $("#status").textContent = err.message;
  } finally {
    busy = false;
  }
};
let drag;
host.onpointerdown = (e) => {
  drag = { x: e.clientX, offset: o.offset };
  host.setPointerCapture(e.pointerId);
};
host.onpointermove = (e) => {
  if (!drag || $("#preset").value !== "unwoven") return;
  o = normalize({ ...o, offset: drag.offset - (e.clientX - drag.x) });
  adapter?.setOptions(o);
};
host.onpointerup = host.onpointercancel = () => {
  drag = null;
  panel();
};
function tick(now) {
  if (playing && !busy) {
    time = (time + Math.min(0.1, (now - last) / 1000)) % 30;
    $("#time").value = time;
    adapter?.seek(time);
  }
  last = now;
  requestAnimationFrame(tick);
}
requestAnimationFrame(tick);
await mount();
