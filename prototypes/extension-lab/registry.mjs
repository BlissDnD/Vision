/** Lazy registry; no module executes until selected. */
export const registry = [
  {
    id: 1,
    title: "Térbeli formaműveletek",
    load: () => import("./examples/01-csg.mjs"),
  },
  {
    id: 2,
    title: "Hálósimítás",
    load: () => import("./examples/02-subdivide.mjs"),
  },
  {
    id: 3,
    title: "Matrica 3D tárgyon",
    load: () => import("./examples/03-decal.mjs"),
  },
  {
    id: 4,
    title: "Kontúr térbelivé alakítása",
    load: () => import("./examples/04-extrude.mjs"),
  },
  {
    id: 5,
    title: "Görbére hajlítás",
    load: () => import("./examples/05-curve-flow.mjs"),
  },
  {
    id: 6,
    title: "Összeolvadó térbeli formák",
    load: () => import("./examples/06-metaballs.mjs"),
  },
  {
    id: 7,
    title: "Felületre szórás",
    load: () => import("./examples/07-surface-scatter.mjs"),
  },
  {
    id: 8,
    title: "SVG import",
    load: () => import("./examples/08-svg-import.mjs"),
  },
  {
    id: 9,
    title: "Font és betűkontúrok",
    load: () => import("./examples/09-font-outlines.mjs"),
  },
  {
    id: 10,
    title: "Vektoros görbesimítás",
    load: () => import("./examples/10-vector-paths.mjs"),
  },
  {
    id: 11,
    title: "Sík formaműveletek",
    load: () => import("./examples/11-polygon-boolean.mjs"),
  },
  {
    id: 12,
    title: "Kontúr háromszögelése",
    load: () => import("./examples/12-triangulate.mjs"),
  },
  {
    id: 13,
    title: "Voronoi mozaik",
    load: () => import("./examples/13-voronoi.mjs"),
  },
  {
    id: 14,
    title: "Saját 3D shaderanyag",
    load: () => import("./examples/14-custom-material.mjs"),
  },
  {
    id: 15,
    title: "Sík tükör",
    load: () => import("./examples/15-planar-reflection.mjs"),
  },
  {
    id: 16,
    title: "Környezeti fény előkészítése",
    load: () => import("./examples/16-environment-map.mjs"),
  },
  {
    id: 17,
    title: "Térbeli mélyedésárnyék",
    load: () => import("./examples/17-contact-shading.mjs"),
  },
  {
    id: 18,
    title: "LUT színprofil",
    load: () => import("./examples/18-lut-import.mjs"),
  },
  {
    id: 19,
    title: "Érzékelésalapú gradiens",
    load: () => import("./examples/19-perceptual-gradient.mjs"),
  },
  {
    id: 20,
    title: "Paletta és kontraszt",
    load: () => import("./examples/20-palette-scales.mjs"),
  },
  {
    id: 21,
    title: "Kamera célzása",
    load: () => import("./examples/21-camera-framing.mjs"),
  },
  {
    id: 22,
    title: "Csontlánc végpontja",
    load: () => import("./examples/22-ik-chain.mjs"),
  },
  {
    id: 23,
    title: "Nebula részecskék",
    load: () => import("./examples/23-nebula-particles.mjs"),
  },
  {
    id: 24,
    title: "Merevtestek Cannon motorral",
    load: () => import("./examples/24-rigid-bodies.mjs"),
  },
  {
    id: 25,
    title: "GPU részecskeállapot",
    load: () => import("./examples/25-gpu-particle-state.mjs"),
  },
  {
    id: 26,
    title: "Bézier sebességgörbe",
    load: () => import("./examples/26-bezier-easing.mjs"),
  },
  {
    id: 27,
    title: "Explicit idejű tween",
    load: () => import("./examples/27-tween-sampling.mjs"),
  },
  {
    id: 28,
    title: "Hanghullám",
    load: () => import("./examples/28-waveform.mjs"),
  },
  {
    id: 29,
    title: "Hangjellemzők",
    load: () => import("./examples/29-audio-features.mjs"),
  },
  {
    id: 30,
    title: "Metronóm",
    load: () => import("./examples/30-metronome.mjs"),
  },
  {
    id: 31,
    title: "Gyors térbeli kijelölés",
    load: () => import("./examples/31-bvh-picking.mjs"),
  },
  {
    id: 32,
    title: "GLB optimalizálás",
    load: () => import("./examples/32-gltf-optimize.mjs"),
  },
  {
    id: 33,
    title: "Háló egyszerűsítése",
    load: () => import("./examples/33-mesh-simplify.mjs"),
  },
  {
    id: 34,
    title: "Sok azonos tárgy",
    load: () => import("./examples/34-instanced-copies.mjs"),
  },
  {
    id: 35,
    title: "Közös tárgyrajzolás",
    load: () => import("./examples/35-batched-objects.mjs"),
  },
  {
    id: 36,
    title: "WebGL képkockavizsgáló",
    load: () => import("./examples/36-frame-debugger.mjs"),
  },
  {
    id: 37,
    title: "WebGL hibakereső",
    load: () => import("./examples/37-webgl-lint.mjs"),
  },
  {
    id: 38,
    title: "Átrendezhető eszköztár",
    load: () => import("./examples/38-sortable-toolbar.mjs"),
  },
  {
    id: 39,
    title: "Állítható panelek",
    load: () => import("./examples/39-split-panels.mjs"),
  },
  {
    id: 40,
    title: "Növényi atlasz",
    load: () => import("./examples/40-foliage-assets.mjs"),
  },
  {
    id: 41,
    title: "Füstatlasz",
    load: () => import("./examples/41-smoke-assets.mjs"),
  },
  {
    id: 42,
    title: "Poly Haven kép és HDR",
    load: () => import("./examples/42-polyhaven-intake.mjs"),
  },
  {
    id: 43,
    title: "PBR anyagimport",
    load: () => import("./examples/43-ambient-pbr.mjs"),
  },
  {
    id: 44,
    title: "Részecskeatlasz",
    load: () => import("./examples/44-particle-atlas.mjs"),
  },
  {
    id: 45,
    title: "Hengeres élő szöveg",
    load: () => import("./examples/45-curved-text.mjs"),
  },
  {
    id: 46,
    title: "Útvonalas cső",
    load: () => import("./examples/46-path-tube.mjs"),
  },
  {
    id: 47,
    title: "Változó vastagságú vonal",
    load: () => import("./examples/47-tapered-line.mjs"),
  },
  {
    id: 48,
    title: "Üveganyag",
    load: () => import("./examples/48-glass-material.mjs"),
  },
  {
    id: 49,
    title: "Quarks részecskék",
    load: () => import("./examples/49-quarks-emitter.mjs"),
  },
  {
    id: 50,
    title: "Áramló festékmező",
    load: () => import("./examples/50-fluid-field.mjs"),
  },
  {
    id: 51,
    title: "Tükröződő víz",
    load: () => import("./examples/51-water-surface.mjs"),
  },
  {
    id: 52,
    title: "Seedelt makettváros",
    load: () => import("./examples/52-seeded-city.mjs"),
  },
  {
    id: 53,
    title: "Procedurális zaj",
    load: () => import("./examples/53-procedural-noise.mjs"),
  },
  {
    id: 54,
    title: "Utófeldolgozás",
    load: () => import("./examples/54-postprocessing.mjs"),
  },
  {
    id: 55,
    title: "Merevtestek Rapier motorral",
    load: () => import("./examples/55-rapier-physics.mjs"),
  },
  {
    id: 56,
    title: "Folyamatos videóexport",
    load: () => import("./examples/56-streaming-export.mjs"),
  },
  {
    id: 57,
    title: "Színválasztó",
    load: () => import("./examples/57-color-picker.mjs"),
  },
  {
    id: 58,
    title: "Mozgáspálya illesztése",
    load: () => import("./examples/58-fit-motion-path.mjs"),
  },
  {
    id: 59,
    title: "DOM transzformáció",
    load: () => import("./examples/59-dom-transform.mjs"),
  },
  {
    id: 60,
    title: "Térbeli fogantyú",
    load: () => import("./examples/60-transform-gizmo.mjs"),
  },
  {
    id: 61,
    title: "Modellanimáció mintavétele",
    load: () => import("./examples/61-model-animation.mjs"),
  },
  {
    id: 62,
    title: "GLB import",
    load: () => import("./examples/62-gltf-import.mjs"),
  },
  {
    id: 63,
    title: "Színkerék",
    load: () => import("./examples/63-color-wheel.mjs"),
  },
];
