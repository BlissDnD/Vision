# A 63 külön modul térképe

Minden modulhoz külön, futtatható használati példa tartozik az `examples/` mappában. A böngészős import/build nem igazol önmagában vizuális helyességet.

| # | Modul | API | Függőség | Licenc/forrás |
|---|---|---|---|---|
| 1 | [Térbeli formaműveletek](modules/01-csg.mjs) · [példa](examples/01-csg.mjs) | create | three-bvh-csg 0.0.18 | [MIT](https://github.com/gkjohnson/three-bvh-csg) |
| 2 | [Hálósimítás](modules/02-subdivide.mjs) · [példa](examples/02-subdivide.mjs) | subdivide, create | three-subdivide 1.1.5 | [MIT](https://github.com/stevinz/three-subdivide) |
| 3 | [Matrica 3D tárgyon](modules/03-decal.mjs) · [példa](examples/03-decal.mjs) | stamp, create | three 0.186.1 | [MIT](https://github.com/mrdoob/three.js) |
| 4 | [Kontúr térbelivé alakítása](modules/04-extrude.mjs) · [példa](examples/04-extrude.mjs) | extrude, create | three 0.186.1 | [MIT](https://github.com/mrdoob/three.js) |
| 5 | [Görbére hajlítás](modules/05-curve-flow.mjs) · [példa](examples/05-curve-flow.mjs) | bend, create | three 0.186.1 | [MIT](https://github.com/mrdoob/three.js) |
| 6 | [Összeolvadó térbeli formák](modules/06-metaballs.mjs) · [példa](examples/06-metaballs.mjs) | create | three 0.186.1 | [MIT](https://github.com/mrdoob/three.js) |
| 7 | [Felületre szórás](modules/07-surface-scatter.mjs) · [példa](examples/07-surface-scatter.mjs) | sampleSurface, create | three 0.186.1 | [MIT](https://github.com/mrdoob/three.js) |
| 8 | [SVG import](modules/08-svg-import.mjs) · [példa](examples/08-svg-import.mjs) | parseSVG, create | three 0.186.1 | [MIT](https://github.com/mrdoob/three.js) |
| 9 | [Font és betűkontúrok](modules/09-font-outlines.mjs) · [példa](examples/09-font-outlines.mjs) | fontFromBuffer, outline, create | opentype.js 2.0.0 | [MIT](git://github.com/opentypejs/opentype.js) |
| 10 | [Vektoros görbesimítás](modules/10-vector-paths.mjs) · [példa](examples/10-vector-paths.mjs) | smoothPath, create | paper 0.12.18 | [MIT](https://github.com/paperjs/paper.js) |
| 11 | [Sík formaműveletek](modules/11-polygon-boolean.mjs) · [példa](examples/11-polygon-boolean.mjs) | combine, create | polygon-clipping 0.15.7 | [MIT](github:mfogel/polygon-clipping) |
| 12 | [Kontúr háromszögelése](modules/12-triangulate.mjs) · [példa](examples/12-triangulate.mjs) | triangulate, create | earcut 3.2.4 | [ISC](git://github.com/mapbox/earcut) |
| 13 | [Voronoi mozaik](modules/13-voronoi.mjs) · [példa](examples/13-voronoi.mjs) | cells, create | d3-delaunay 6.0.4 | [ISC](https://github.com/d3/d3-delaunay) |
| 14 | [Saját 3D shaderanyag](modules/14-custom-material.mjs) · [példa](examples/14-custom-material.mjs) | create | three-custom-shader-material 6.4.0 | [MIT](https://github.com/mrdoob/three.js) |
| 15 | [Sík tükör](modules/15-planar-reflection.mjs) · [példa](examples/15-planar-reflection.mjs) | create | three 0.186.1 | [MIT](https://github.com/mrdoob/three.js) |
| 16 | [Környezeti fény előkészítése](modules/16-environment-map.mjs) · [példa](examples/16-environment-map.mjs) | prepareEnvironment, applyEnvironment | three 0.186.1 | [MIT](https://github.com/mrdoob/three.js) |
| 17 | [Térbeli mélyedésárnyék](modules/17-contact-shading.mjs) · [példa](examples/17-contact-shading.mjs) | createPass | three 0.186.1 | [MIT](https://github.com/mrdoob/three.js) |
| 18 | [LUT színprofil](modules/18-lut-import.mjs) · [példa](examples/18-lut-import.mjs) | parseLUT, sampleIdentity | three 0.186.1 | [MIT](https://github.com/mrdoob/three.js) |
| 19 | [Érzékelésalapú gradiens](modules/19-perceptual-gradient.mjs) · [példa](examples/19-perceptual-gradient.mjs) | gradient, create | culori 4.0.2 | [MIT](git@github.com:Evercoder/culori) |
| 20 | [Paletta és kontraszt](modules/20-palette-scales.mjs) · [példa](examples/20-palette-scales.mjs) | scale, contrast, create | chroma-js 3.2.0 | [(BSD-3-Clause AND Apache-2.0)](git://github.com/gka/chroma.js) |
| 21 | [Kamera célzása](modules/21-camera-framing.mjs) · [példa](examples/21-camera-framing.mjs) | attach, sampleShot | camera-controls 3.1.2 | [MIT](yomotsu/camera-controls) |
| 22 | [Csontlánc végpontja](modules/22-ik-chain.mjs) · [példa](examples/22-ik-chain.mjs) | create | three 0.186.1 | [MIT](https://github.com/mrdoob/three.js) |
| 23 | [Nebula részecskék](modules/23-nebula-particles.mjs) · [példa](examples/23-nebula-particles.mjs) | createSimulation | three-nebula 13.3.0 | [MIT](https://github.com/creativelifeform/three-nebula) |
| 24 | [Merevtestek Cannon motorral](modules/24-rigid-bodies.mjs) · [példa](examples/24-rigid-bodies.mjs) | createSimulation | cannon-es 0.20.0 | [MIT](https://github.com/pmndrs/cannon-es) |
| 25 | [GPU részecskeállapot](modules/25-gpu-particle-state.mjs) · [példa](examples/25-gpu-particle-state.mjs) | create | three 0.186.1 | [MIT](https://github.com/mrdoob/three.js) |
| 26 | [Bézier sebességgörbe](modules/26-bezier-easing.mjs) · [példa](examples/26-bezier-easing.mjs) | curve, create | bezier-easing 3.2.0 | [MIT](git://github.com/gre/bezier-easing) |
| 27 | [Explicit idejű tween](modules/27-tween-sampling.mjs) · [példa](examples/27-tween-sampling.mjs) | sample, create | @tweenjs/tween.js 25.0.0 | [MIT](https://github.com/tweenjs/tween.js) |
| 28 | [Hanghullám](modules/28-waveform.mjs) · [példa](examples/28-waveform.mjs) | mount, peakEnvelope | wavesurfer.js 8.0.2 | [BSD-3-Clause](git@github.com:katspaugh/wavesurfer.js) |
| 29 | [Hangjellemzők](modules/29-audio-features.mjs) · [példa](examples/29-audio-features.mjs) | analyze, create | meyda 5.6.3 | [MIT](https://github.com/meyda/meyda) |
| 30 | [Metronóm](modules/30-metronome.mjs) · [példa](examples/30-metronome.mjs) | mount | tone 15.1.22 | [MIT](https://github.com/Tonejs/Tone.js) |
| 31 | [Gyors térbeli kijelölés](modules/31-bvh-picking.mjs) · [példa](examples/31-bvh-picking.mjs) | accelerate, create | three-mesh-bvh 0.9.16 | [MIT](https://github.com/gkjohnson/three-mesh-bvh) |
| 32 | [GLB optimalizálás](modules/32-gltf-optimize.mjs) · [példa](examples/32-gltf-optimize.mjs) | optimize | @gltf-transform/core 4.5.1 | [MIT](github:donmccurdy/glTF-Transform) |
| 33 | [Háló egyszerűsítése](modules/33-mesh-simplify.mjs) · [példa](examples/33-mesh-simplify.mjs) | simplify | meshoptimizer 1.3.0 | [MIT](https://github.com/zeux/meshoptimizer) |
| 34 | [Sok azonos tárgy](modules/34-instanced-copies.mjs) · [példa](examples/34-instanced-copies.mjs) | create | three 0.186.1 | [MIT](https://github.com/mrdoob/three.js) |
| 35 | [Közös tárgyrajzolás](modules/35-batched-objects.mjs) · [példa](examples/35-batched-objects.mjs) | create | three 0.186.1 | [MIT](https://github.com/mrdoob/three.js) |
| 36 | [WebGL képkockavizsgáló](modules/36-frame-debugger.mjs) · [példa](examples/36-frame-debugger.mjs) | mount | spectorjs 0.9.33 | [MIT](git://github.com/BabylonJS/Spector.js) |
| 37 | [WebGL hibakereső](modules/37-webgl-lint.mjs) · [példa](examples/37-webgl-lint.mjs) | enable, configure | webgl-lint 1.11.4 | [MIT](https://github.com/greggman/webgl-lint) |
| 38 | [Átrendezhető eszköztár](modules/38-sortable-toolbar.mjs) · [példa](examples/38-sortable-toolbar.mjs) | mount | sortablejs 1.15.7 | [MIT](git://github.com/SortableJS/Sortable) |
| 39 | [Állítható panelek](modules/39-split-panels.mjs) · [példa](examples/39-split-panels.mjs) | mount | split.js 1.6.5 | [MIT](https://github.com/nathancahill/split) |
| 40 | [Növényi atlasz](modules/40-foliage-assets.mjs) · [példa](examples/40-foliage-assets.mjs) | source, importFiles | three 0.186.1 | [CC0 assets (user-supplied); adapter original](https://kenney.nl/assets/foliage-sprites) |
| 41 | [Füstatlasz](modules/41-smoke-assets.mjs) · [példa](examples/41-smoke-assets.mjs) | source, importFiles | three 0.186.1 | [CC0 assets (user-supplied); adapter original](https://kenney.nl/assets/smoke-particles) |
| 42 | [Poly Haven kép és HDR](modules/42-polyhaven-intake.mjs) · [példa](examples/42-polyhaven-intake.mjs) | source, importTexture, decodeHDR | three 0.186.1 | [CC0 assets (user-supplied); adapter original](https://polyhaven.com/license) |
| 43 | [PBR anyagimport](modules/43-ambient-pbr.mjs) · [példa](examples/43-ambient-pbr.mjs) | importMaps, materialFromRecord | three 0.186.1 | [CC0 assets (user-supplied); adapter original](https://docs.ambientcg.com/license/) |
| 44 | [Részecskeatlasz](modules/44-particle-atlas.mjs) · [példa](examples/44-particle-atlas.mjs) | source, importFiles | three 0.186.1 | [CC0 assets (user-supplied); adapter original](https://kenney.nl/assets/particle-pack) |
| 45 | [Hengeres élő szöveg](modules/45-curved-text.mjs) · [példa](examples/45-curved-text.mjs) | create | troika-three-text 0.52.5 | [MIT](https://github.com/protectwise/troika) |
| 46 | [Útvonalas cső](modules/46-path-tube.mjs) · [példa](examples/46-path-tube.mjs) | tube, create | three 0.186.1 | [MIT](https://github.com/mrdoob/three.js) |
| 47 | [Változó vastagságú vonal](modules/47-tapered-line.mjs) · [példa](examples/47-tapered-line.mjs) | create | meshline 3.3.1 | [MIT](https://github.com/mrdoob/three.js) |
| 48 | [Üveganyag](modules/48-glass-material.mjs) · [példa](examples/48-glass-material.mjs) | create | @pmndrs/vanilla 1.25.0 | [MIT](https://github.com/pmndrs/drei-vanilla) |
| 49 | [Quarks részecskék](modules/49-quarks-emitter.mjs) · [példa](examples/49-quarks-emitter.mjs) | create | three.quarks 0.17.1 | [MIT](https://github.com/Alchemist0823/three.quarks) |
| 50 | [Áramló festékmező](modules/50-fluid-field.mjs) · [példa](examples/50-fluid-field.mjs) | shaders, create | three 0.186.1 | [Original implementation (not Pavel source)](https://github.com/PavelDoGreat/WebGL-Fluid-Simulation) |
| 51 | [Tükröződő víz](modules/51-water-surface.mjs) · [példa](examples/51-water-surface.mjs) | create | three 0.186.1 | [MIT](https://github.com/mrdoob/three.js) |
| 52 | [Seedelt makettváros](modules/52-seeded-city.mjs) · [példa](examples/52-seeded-city.mjs) | layout, create | three 0.186.1 | [CC0 assets (user-supplied); adapter original](https://kenney.nl/assets/city-kit-suburban) |
| 53 | [Procedurális zaj](modules/53-procedural-noise.mjs) · [példa](examples/53-procedural-noise.mjs) | noiseGLSL | three 0.186.1 | [MIT](https://github.com/ashima/webgl-noise) |
| 54 | [Utófeldolgozás](modules/54-postprocessing.mjs) · [példa](examples/54-postprocessing.mjs) | createPipeline | postprocessing 6.39.5 | [Zlib](https://github.com/pmndrs/postprocessing) |
| 55 | [Merevtestek Rapier motorral](modules/55-rapier-physics.mjs) · [példa](examples/55-rapier-physics.mjs) | createSimulation | @dimforge/rapier3d-compat 0.21.0 | [Apache-2.0](https://github.com/dimforge/rapier) |
| 56 | [Folyamatos videóexport](modules/56-streaming-export.mjs) · [példa](examples/56-streaming-export.mjs) | exportFrames | mediabunny 1.61.6 | [MPL-2.0](https://github.com/Vanilagy/mediabunny) |
| 57 | [Színválasztó](modules/57-color-picker.mjs) · [példa](examples/57-color-picker.mjs) | mount | @melloware/coloris 0.25.0 | [MIT](https://github.com/melloware/coloris-npm) |
| 58 | [Mozgáspálya illesztése](modules/58-fit-motion-path.mjs) · [példa](examples/58-fit-motion-path.mjs) | fit, create | fit-curve 0.2.0 | [MIT](https://github.com/mrdoob/three.js) |
| 59 | [DOM transzformáció](modules/59-dom-transform.mjs) · [példa](examples/59-dom-transform.mjs) | mount | moveable 0.53.0 | [MIT](https://github.com/daybrush/moveable/blob/master/packages/moveable) |
| 60 | [Térbeli fogantyú](modules/60-transform-gizmo.mjs) · [példa](examples/60-transform-gizmo.mjs) | mount | three 0.186.1 | [MIT](https://github.com/mrdoob/three.js) |
| 61 | [Modellanimáció mintavétele](modules/61-model-animation.mjs) · [példa](examples/61-model-animation.mjs) | animate, create | three 0.186.1 | [MIT](https://github.com/mrdoob/three.js) |
| 62 | [GLB import](modules/62-gltf-import.mjs) · [példa](examples/62-gltf-import.mjs) | parseGLB | three 0.186.1 | [MIT](https://github.com/mrdoob/three.js) |
| 63 | [Színkerék](modules/63-color-wheel.mjs) · [példa](examples/63-color-wheel.mjs) | mount | @jaames/iro 5.5.2 | [MPL-2.0](https://github.com/jaames/iro.js) |
