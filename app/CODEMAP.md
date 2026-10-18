# Vel kódtérkép (generált)

> `npm run build` / `node scripts/codemap.mjs` írja a forrásból; kézzel ne szerkeszd. A modul célját a fájl elején lévő megjegyzés adja (ha nincs, a `scripts/codemap.mjs` DESC táblája).
> **Használat:** feladat előtt ezt olvasd, utána csak az érintett fájlokat nyisd meg (vagy `grep -n` a kért függvényre). Ne olvass végig modulokat feleslegesen.

## Feladat → hol
| Feladat | Fájlok |
|---|---|
| New effect (Forrás/Megjelenés) | effects/<group>.ts (kind, params, GLSL fx()), cost.ts COST, library.ts LIB entry; test tests/<slice>.js |
| Inspector / panel layout | inspector.ts renderInsp, controls.ts widgets, style.css |
| Library shelf / own items | library.ts, shelf.ts, presets.ts (own items), userlib.ts (store) |
| Project format / save / migration | history.ts (projectJSON/applyProject), migrate.ts (+ old-project test), state.ts normalize |
| Time / playback / export | time.ts, sim.ts, transport.ts, loop.ts, output.ts |
| Keyframes / values / LFO | evaluation.ts (ev, setVal), timeline.ts, animate.ts, retime.ts |
| Canvas interaction | stage.ts, pick.ts, linkcord.ts, spinegrips.ts, textbar.ts |
| Links / variants | variants.ts, variantsui.ts, linkcord.ts |
| Rendering / GL | render.ts, gl.ts, glsl.ts, mesh3d.ts (real meshes), cloud.ts, partfx.ts |
| Presets / ChatGPT format | presetfmt.ts (text), describe.ts buildFromSpec, presets.ts |

## Modulok (100 fájl)
## Modulok (91 fájl)
| Fájl | KB | Cél | Exportok | R-hookok (beállítja) |
|---|---|---|---|---|
| `adaptive.ts` | 1 | adaptive preview quality (fps-driven resolution) | autoQuality | aqF, aqAcc, aqN, aqT, aqCap, aqPrev |
| `animate.ts` | 5 | U1 · Animálás mód + mozgáspálya. Animálás (A): every animatable edit (slider, number field, canvas drag) writes a key at the playhead (see setVal in evaluation.ts). … | setAnimMode, pathTimes, pathPos, updPath, pathKeyAt | animMode, CAMON |
| `autosave.ts` | 2 | Durable project autosave. IndexedDB keeps small embedded vector assets out of localStorage quota. | readAuto, saveAuto |  |
| `blob.ts` | 11 | Blob-követés: tracking + overlay drawing | blobState, resetBlobs, getSmall, hash1, BLOB_FONTS, blobPrep, rnd, blobLabel, scrambleTxt, drawBlobOverlay, gcBlobs | smallT |
| `boot.ts` | 2 | startup: autosave restore, first render, shelf build (imported last) |  | selId, last |
| `camdir.ts` | 4 | K3 · Kamera-rendezés: where the 2.5D camera looks, from scene time only (seek = export = live). st.cam.mode 0 = Kézi (keys), 1 = Célpontok (st.cam.shots [{t,id}]: … | shotAt, camDir | CAMON, camDir |
| `camui.ts` | 3 | K3 · Kamera ablak bővítése: Mód (Kézi / Célpontok / Útvonalon), célpontlista („Kijelölt réteg mostantól”, időpont, törlés), útvonalválasztó + ismétlés, „Élesség a … |  | camExtra |
| `choreo.ts` | 16 | KO1 Koreográfia (row 27, first slice): one scene-motion block st.ko = {prof, at, amt (Mérték), sp (Ritmus = spacing), acc (Hangsúly), ids (participants in play … | ROLES, PROFILES, suggestRoles, newKo, koParts, koEnd, koOpen, koClose, koAccept, koDetach | normKo, koMos, koPv, time, koOpen, koSection, koRows, koTlOpen … |
| `cloud.ts` | 4 | M7b · Felhő + Lufi: blob layout of the shared shape (deterministic from Alak + Változat), the uniforms of the cloud shader (scene light + the Lufi appearance found in … | cloudBlobs, balloonOf, balloonVals |  |
| `controls.ts` | 16 | inspector widgets: ctlSlider/Select/Color/Switch, section, fxListUI (effect icon row), palette picker | fmt, SECOPEN, section, setFill, ctlSlider, syncTwins, paintBadge, liveKinds, ctlSelect, ctlColor, ctlSwitch, ctlParam, scrubField, palettePicker … (+2) | liveCtl, liveFields, liveSel, fxSel, fxBody |
| `cost.ts` | 2 | COST table, itemCost/sceneLoad, compile-error flag | COST, itemError, itemCost, sceneLoad, loadLabel |  |
| `describe.ts` | 9 | Claude description → scene (descPrompt) and buildFromSpec (spec → items, dropped list, macros, custom) | DESC_SKIP, descCatalog, descPrompt, clampP, specVal, buildFromSpec, descModal | SAMPLE, selId, time |
| `dom.ts` | 1 | $ and h() DOM helpers | TAU, h |  |
| `effects/codepen.ts` | 4 | effect defs: liquidglass, windflame | codepenEffects |  |
| `effects/filters.ts` | 19 | effect defs: blur, glow, lens, kaleido, feedback, swirl, warp, ripple, radial, edge, mirror, polar, chroma, psycolor, grade, glitch, film, crt, castlight, texture, … | filters |  |
| `effects/fluid.ts` | 2 | effect defs: fluid, fluidfx | fluidEffects |  |
| `effects/generators.ts` | 16 | effect defs: plasma, fire, aurora, nebula, liquid, tunnel, sacred, kali, julia, moire, hyper, grid, blackhole, gradient, galaxy, waves, lava, cells, flare | generators |  |
| `effects/helpers.ts` | 3 | S/SEL/COL param constructors, shared GLSL libs | S, SEL, COL, SKYLIB, CLOUDLIB, BENTO, BENTO_NAMES, BENTO_ANIMS |  |
| `effects/index.ts` | 12 | EFFECTS registry, BASE params, paramsOf/pdefOf (per-layer params), animKeysOf/mainDupOf, icons, DEFAULT_CODE | EFFECTS, fxFits, fxHostNote, BLOB_PD, DEFAULT_CODE, CP_MAX, CP_KEY, cpDefs, paramsOf, pdefOf, SDF_MAP, SDF_RENDER, DEF_PRIMS, PRIM_T … (+18) |  |
| `effects/media.ts` | 2 | effect defs: text, image, lottie, custom | media |  |
| `effects/motionDesign.ts` | 7 | effect defs: bento, projector | motionDesign |  |
| `effects/motionText.ts` | 9 | effect defs: mtext, reveal | motionText |  |
| `effects/objects3d.ts` | 14 | effect defs: surface3d, terrain3d, obj3d, gyroid | objects3d |  |
| `effects/particles.ts` | 5 | effect defs: pdisp, particles, emitter, sdfscene | particles |  |
| `effects/shapes.ts` | 6 | effect defs: pathshape, shape | shapes |  |
| `effects/soft3d.ts` | 7 | effect defs: cloud3d, balloon | soft3d |  |
| `effects/text3d.ts` | 6 | effect defs: textwrap, textextrude, textpath | text3d |  |
| `effects/worldBlocks.ts` | 7 | effect defs: skygrad, sun, clouds, terrain, haze | worldBlocks |  |
| `effects/worlds.ts` | 13 | effect defs: planet, sky, space, bokeh | worlds |  |
| `emitter.ts` | 12 | E1 · Részecske Forrás ("emitter"): own emitter (point / line / ring / disc / rect / alpha of the image below), drawn as GL points. Stateless: every particle slot's … | emP, emLayout, emCues, drawEmitter | emErr, emN |
| `evaluation.ts` | 12 | value evaluation: ev() (keys, LFO, signals, links), keyframes, setVal (Animálás mode), key editor | wave, klVal, ev, KEY_EASES, SMOOTH_E, KEY_EPS, hasK, keyIdx, bezierY, keyEase, keyVal, curV, DEF_EASE, setKey … (+13) | animMode, keyShift, keyEdit, time, liveKed |
| `fluid.ts` | 11 | F1 · Folyadékmező: GPU Stable Fluids per layer (Áramló tinta source, Folyadékos torzítás appearance), on the shared sim clock. Grid size depends only on aspect + … | resetFluid, fluidMark, fluidSweep, Emitter, emitters, fluidPrep |  |
| `fxicons.ts` | 4 | U4: one small, consistent icon per appearance (Megjelenés) type, for the layer's effect row and the add grid. 24×24 stroke glyphs; unknown types get a two-letter … | fxIcon |  |
| `gesture.ts` | 16 | Gesztus-mozgás: motion set by showing it on the canvas. The arrow of Rugalmas beúszás / Beúszás / Kiúszás (tail = direction + distance, ⌘ ↕ tempo · ↔ character, ⌥ or … |  | updMoArrow, moScrub |
| `gl.ts` | 12 | WebGL2 context, compile/link, getProg/progKey (per-layer program cache), fixed programs, targets/textures | cv, gl, HALF, IFMT, compile, VSO, link, U, fragFor, progCache, codeOf, cpSig, progKey, getProg … (+23) |  |
| `globals.d.ts` | 0 |  |  |  |
| `glsl.ts` | 3 | shared GLSL header (HEAD: uniforms + helpers P(), pal(), noise…) and vertex shader | VS, HEAD, HEAD_LINES |  |
| `history.ts` | 6 | snapshot/commit/undo/redo, autosave, projectJSON/applyProject/loadProject | snapshot, commit, restore, undo, redo, updUndo, usedAssets, usedVectorAssets, stateJSON, projectJSON, scheduleSave, applyProject, loadProject, loadMsg … (+4) | hist, hi, selId, saveT, time, lastLoad |
| `inspector.ts` | 24 | right panel: renderInsp (tabs Tartalom/Szín/Mozgás/Effektek/Elhelyezés), timing, sdf objects | renderInsp, timingSection, FPS_OPTS, fpsObj, sdfObjectsSection, placement, ITABS, setITab, layerAnimated, tempoRow, motionSummary | liveCtl, liveFields, liveKed, liveSel, itab |
| `itemops.ts` | 4 | insert/remove/duplicate/group items, addFromLib/attachFx | insertItem, addFromLib, attachFx, removeItem, delSel, dupSel, moveSel, groupSel, ungroup, moveItemTo | selId |
| `keyboard.ts` | 4 | keyboard shortcuts |  | tlxSels, time |
| `layers.ts` | 5 | layer tree (left column): rows, badges, drag/drop | layerBadges, renderLayers | selId |
| `library.ts` | 20 | built-in shelves: LIB[cat] entries {name, make}, CATS, CAT_HINT | L3, LS, LG, LIB, CATS, CAT_HINT |  |
| `lightui.ts` | 3 | M6 · Jelenetfény: one global key light for obj3d / sdfscene (render.ts lightU), direct controls first ("lágyabb", "nagyobb csillanás", "melegebb"), global and … | usesLight, lightFromGlint, glint3, lightSection | glint |
| `linkcord.ts` | 17 | K1 · Kapcsolat-zsinór (spec: vel-intuitiv-mozgas-es-kapcsolatok.md 2–3., 9.) The selected element shows a small ⇢ point next to its gizmo. Dragging it draws a thin … | placeable, anchorOf, driverOf, Opt, linkOptions, paramChoices, applyOpt, startCord, closeCard, openChoice, openLinkCard, updCords | kdrag, selId, openLinkCard, updCords |
| `loop.ts` | 5 | frame loop (rAF): render, gizmo, live control sync, markDirty | markDirty, frame | snapping, dirty, refine, editT, last, time, fpsAcc, fpsN … |
| `lottie.ts` | 4 | Seekable Lottie Canvas → WebGL adapter; one paused player per asset and render size. | createLottiePlayer, clearLottieCache, lottieMeta, lottieMediaFor |  |
| `lottieCore.ts` | 4 | Strict, vector-only Lottie input and scene-time sampling. No browser or renderer dependency. | LOTTIE_LIMITS, LottieMeta, isLottieJSON, parseVectorLottie, sampleLottieFrame |  |
| `lottieImport.ts` | 4 | Local, vector-only Lottie import UI. JSON routing happens before the preset drop handler. | importLottieFile, chooseLottieFile | openLottie, importLottieFile |
| `macros.ts` | 1 | group macros (Vezérlők): pathObj, macroApply/macroRead | pathObj, macroTargets, macroRead, macroApply |  |
| `main.ts` | 1 | import order = init order (a module may only use modules imported before it at top level) |  |  |
| `mesh3d.ts` | 24 | Mesh-alapú 3D réteg (C szakasz / M6): „Gerincfelület”. Decision + measurements: prototypes/red-ribbon-webgl/README.md. A layer that renders real triangle geometry … | DEF_SPINE, spinePath, buildSheet, targets, formOf, meshFor, camOf, drawMesh | meshErr, meshTris |
| `migrate.ts` | 4 | Project file / autosave migration. Every load path (file, autosave, tests) goes through here, so an old project never loses layers silently: anything that cannot be … | PROJECT_VER, Migrated, migrateProject |  |
| `modals.ts` | 6 | modal dialog, toast, help, Projekt dialog (projModal), showCode, image file input | openModal, closeModal, closeBtn, openMedia, showCode, savedList, projModal, toast | toastT |
| `motion.ts` | 19 | Mozgás v1: draggable motions on a layer (L.mo = [{id, t, on, p:{key: NParam}}]). Every motion is a pure function of scene time (seek = export = live), added on top of … | MoDef, MO, MO_ORDER, moIcon, AMT, makeMo, moParam, charEase, RY_N, RY_PRE, setRy, ryValU, ryVal, ryTau … (+6) | normMo |
| `moui.ts` | 16 | Mozgás v1 UI: the Mozgások section on the Mozgás tab (icon row like the effects: Beúszás/Kiúszás from L.tm + the draggable motions L.mo, strength ring, „+” grid), the … | attachMo, motionsUI | moSel, selId, moAud, itab, attachMo, dropMo, updMoRy, moUI … |
| `motion.ts` | 22 | Mozgás v1: draggable motions on a layer (L.mo = [{id, t, on, p:{key: NParam}}]). Every motion is a pure function of scene time (seek = export = live), added on top of … | MoDef, MO, MO_ORDER, moIcon, AMT, makeMo, moParam, charEase, moLoopLen, spinSnap, RY_N, RY_PRE, setRy, ryValU … (+15) | normMo |
| `moui.ts` | 17 | Mozgás v1 UI: the Mozgások section on the Mozgás tab (icon row like the effects: Beúszás/Kiúszás from L.tm + the draggable motions L.mo, strength ring, „+” grid), the … | attachMo, motionsUI | moSel, selId, moAud, itab, attachMo, dropMo, updMoRy, moUI … |
| `output.ts` | 9 | export: PNG/MP4 (WebCodecs), saveFile | saveFile, withScale, glOOM, snapPNG, loadMuxer, renderVideo, startRec | DL, snapping, rec |
| `palettes.ts` | 2 | PALS colour palettes, hexRGB, ease names | PALS, PAL_ORDER, ff, v3, palJS, palCSS, EASE_NAMES, hexRGB |  |
| `partfx.ts` | 3 | M7 · Részecske Megjelenés ("pdisp"): a layer effect that turns its input (text, shape, image) into points, scatters them on an event and reassembles. Events: manual … | pdEvents, pdEnv, pdUniforms, altText, pdMix |  |
| `pathdraw.ts` | 9 | P2 · Útvonal réteg rajzolása: the path (paths.ts) as a triangle strip with per-vertex across (−1…1) / arc (0…1), shaded in the fragment shader: Vonal, Cső (fake 3D … | earClip, strokeOf, drawPathShape | pathErr |
| `pathedit.ts` | 9 | P2 · Útvonal szerkesztése a vásznon: a grip per control point of the selected Útvonal layer, the control polygon as a hit line (double-click = insert a point there), … | toScreen, fromClient, updPathGrips, armPathDraw, disarm, pathPick | pathSel, pathDraw, armPathDraw, updPathGrips, pathFirst, pathPick, pathSection |
| `paths.ts` | 7 | P2 · Közös útvonal: one editable curve model for every use (Útvonal layer, Mozgás „Útvonalon”, emitter shape, later camera / text). Points live on the pathshape layer … | Pt, DEF_PATH, ptsOf, isPath, placeAt, toWorld, toLocal, curve, arc, sampleArc, resample, simplify, closedOf, smoothOf … (+5) | pathAt |
| `perform.ts` | 8 | M5 + U1 · Eljátszás simítással. Armed (E): playback stops. The first value change of any animatable parameter during a pointer gesture (canvas drag of position / size … | Sample, MSample, smoothTakeN, smoothTake, applyTakeN, applyTake, setPerform, perfState | perform, perfSmooth, lastTake, perfHook |
| `physics.ts` | 13 | F2 · Fizikai test: 2D impulse rigid bodies on the top-level layers carrying the 'phys' motion (motion.ts adds the result). World state at t = fixed 60 Hz steps from t … | PHYS_HZ, physAt, physOut, physReset |  |
| `pick.ts` | 6 | Rétegválasztás a vásznon: mi van a kattintási pont alatt? Pixel-exact and type-agnostic: every candidate (top-level item; children of an open group) is rendered alone … | units, hitsAt, closePick | selId |
| `polyhaven.ts` | 6 | Small, offline-searchable Poly Haven CC0 texture shelf. Only the chosen 2K image is downloaded. | POLY_HAVEN_TEXTURES, polyHavenImageURL, addPolyHavenTexture, openPolyHaven | openPolyHaven |
| `popovers.ts` | 9 | Look / camera / export popovers | closePop, openPop, mi, EXP_DEF, EXP, applyExp, renderMB, dimsFor, updLookLbl, openLook, setTheme | popEl, popOff, aqF, speed, selId |
| `presetfmt.ts` | 9 | P1: the preset / scene JSON format as text, generated from the code (effect list, params, palettes, recipes, GLSL helpers). Pure (no DOM, no GL): the build also runs … | PRESET_SKIP, CODE_MAX, catalogText, shaderContract, FmtOpt, specBody, chatPrompt, presetDoc |  |
| `presets.ts` | 21 | P1: presets from outside (ChatGPT) and the user's own shelves. - shelves: own library items (userlib.ts) appear on their shelf with a „saját” mark (LIB entries with … | makeFromU, syncLib, defaultCat, saveAsPreset, savePresetModal, ownMenu, shaderErrors, measureCost, extractJSON, checkPreset, insertPreset, errText, pasteModal, chatText … (+2) | onUlib, cat, libQ, savePreset, ownMenu, costCtx, costRef, projExtra … |
| `random.ts` | 25 | Random (moods, seeds) | AXES, MOODS, PAL_AFF, BGS, OVS, FOCALS, SHAPES3, MATS3, ENVS3, FILLS, DIST, STYLE, LOOK_AFF, ADJ … (+16) | selId, rndLast, rndFbT |
| `recipes.ts` | 33 | RECIPES (built-in recipe groups) + makeRecipe | PLA, RECIPES, makeRecipe |  |
| `referenceAssets.ts` | 309 | Embedded reference assets: the production HTML must remain self-contained. | WIND_NOISE_ID, GLASS_PHOTO_ID, WIND_NOISE, GLASS_PHOTO |  |
| `render.ts` | 24 | renderScene/renderList/drawFx/present, camera, layer transforms, light uniforms, outSize | bindTex, setXform, CAMP, CAMK, mkCam, normCam, camXf, camApply, dofCache, dofLayer, openCam, easeSpringJ, easeBounceJ, EASE_FNS … (+27) | CAMON, PPROG, camFrame, main |
| `retime.ts` | 9 | M5 · Mozgásblokk és könnyű retime + kézi Jelzések. A layer's motion block = everything timed on it: entry (tm.in*, type "start"), middle events (bento morph), exit … | timeFields, keyRefs, Block, blockOf, cueAt, addCue, removeCue, shiftBlock, stretchBlock, tempoPivot, tempoItem |  |
| `rndq.ts` | 11 | Q1: Random quality filter. Renders a generated scene small, measures "ugliness" symptoms (dark, muddy, flat, noisy, cluttered, no focus, garish, hard cut, pixelated) … | measureImg, SYMPTOMS, qThreshold, scoreSym, judgeStats, QW, capture, judgeScene, SUSPECTS, fixCulprit | qCtx, qOut |
| `runtime.ts` | 0 | R: shared mutable runtime state and cross-module hooks | R |  |
| `scenes.ts` | 16 | S1 · Jelenetek és átmenetek (leltár 19.) A scene is a saved copy of the composition (layers keep their ids). The Jelenetek strip lists them in order; the workbench … | Scene, scenes, saveScene, loadScene, overwriteScene, removeScene, moveScene, seqTotal, matchLayers, seqFrame, sceneStart, setSeqPlay, closeScnCard, renderStrip … (+1) | selId, seqLen, seqFrame, seqPlay, seqDurSave, time, seqExit, renderStrip … |
| `shelf.ts` | 8 | library shelf UI: categories, cards, search, thumbnails, audition | libSearch, ikey, dropTag, buildCats, buildShelf, audCache, setAudition | cat, thumbJob, libQ, audition, moAud |
| `signals.ts` | 9 | audio / beat signals | AUD, TAPS, SIG_BASE, SIG_BEAT, sigList, sigLabel, arrAt, sigVal, bandEnv, pct, smoothEnv, pulseEnv, estimateBpm, ensureAC … (+5) | time |
| `sim.ts` | 4 | Shared scene clock for stateful layers (feedback / "Visszhang", blob tracking). Contract (Vel "egy közös idő"): - Stateless layers are a pure function of scene time … | frameAt, SIM_HZ, STEP, WARM, tickOf, sceneHasState, resetSim, renderAt |  |
| `spinegrips.ts` | 11 | M6 · Gerincfelület on-canvas editing: one grip per spine point (projected through the layer's own 3D camera), a thin polyline between them, and the "Gerinc" inspector … | isSurf, spineOf, projectPt, rayAt, camBasis, dragSpinePt, updSpineGrips, hitSurface, glintDrag, panStart, panDrag, wheelDist, spineSection | spSel, glint |
| `stage.ts` | 9 | canvas interaction: drag/scale/rotate gizmo, tools, wheel, fit | wrap, fitCanvas, setTool, toggleFS, toAsp, endDrag, m3x, m3y, PD, sdfAngles, sdfProj, primDrag, gizmoRadius, updGizmo | tool, gizmoOn, drag, CAMON, wheelT |
| `state.ts` | 8 | st (project), makeLayer/makeGroup/normalize, walk/findItem/sel, looks, light | uid, mkN, makeLayer, makeGroup, normalize, SIZES, LOOKP, LOOKS, mkLook, normLook, LIGHTP, normLight, st, assets … (+6) | uidN, selId |
| `tap.ts` | 12 | Időzítés gyorsan · Koppintós időzítés kosárral. T arms „Koppintás”: clicks on layers (canvas or layer list) collect them into a basket in click order (numbered … | entranceStart, basketToggle, basketMove, basketTakeSel, setTapArm, tapNow, tapEsc, renderStrip | tapArm, tapBasket, tapIdx, tapS0, tapDone, tapPulse, tapSetArm, tapNow … |
| `taste.ts` | 3 | Q1: the user's Random taste. "Ronda" / "Tetszik" votes per scene ingredient (e.g. 'dist:kaleido', 'foc:planet'), turned into pickW weight multipliers. Kept in … | Taste, TASTE, saveTaste, tasteMul, tasteVote, tasteCount, tasteClear, tasteExport, tasteMerge |  |
| `terrain3d.ts` | 18 | T1 · 3D Terep: seeded procedural heightfield as real geometry (own orbit camera, scene light, cast shadow, water, sky). Height = pure function of (x, z, params): seek … | HALF, QN, gridOf, seedOff, gridN, drawTerrain | terrErr, terrTris |
| `text.ts` | 6 | text rasterising (textCache), image assets (loadAsset) | textCache, textLines, lineSpec, textTex, auxTex, mediaFor, loadAsset |  |
| `textbar.ts` | 8 | U4: text toolbar above the canvas, shown while a text layer (Szöveg / Animált szöveg) is selected — like a rich-text editor: font, bold, colour, alignment, size, line … | TB_FONTS, updTextbar, editTextInPlace, closeTextEdit | updTextbar, selId |
| `textlines.ts` | 6 | M4 · soronkénti tipográfia: vászonfogantyú minden sor elején + „Sorok” szekció az inspectorban. Grip drag: horizontal = indent (dx), vertical = space before the line … | lineObj, tidyLines, updLineHandles, linesSection |  |
| `textpath.ts` | 6 | T6 · Szöveg útvonalon: the layer's live text as one quad per glyph, placed by arc length along a P2 path (L.path; none chosen = a built-in arc), rotated to the … | ARC, atlasOf, glyphsAt, drawTextPath |  |
| `thumbs.ts` | 2 | thumbnail rendering (renderThumb, thumbOf) | TW, thumbCache, renderThumb, thumbOf | thumbCtx, thumbOut |
| `thumbstore.ts` | 2 | Persistent shelf-thumbnail cache (IndexedDB). Keyed by build id + shelf + item name, so a new build re-renders once and later loads draw instantly. Every failure … | thumbGet, thumbPut, thumbPrune |  |
| `time.ts` | 2 | Scene time rules (pure; shared by playback, seek, export and audio). - The project range is [0, st.dur]. Loop on: the range repeats. Loop off: the clock runs on past … | loopOn, sceneT, overrun, audioIndex, loopLen, cyclesIn, snapRate |  |
| `timeline.ts` | 36 | timeline + Sávok tracks, paramList, key moves | tlHeadEl, layerSegs, paramList, objAt, layerKeyTimes, keysAt, moveKeys, selKeyRefs, retimeSel, easeSel, queueTL, renderTimeline, itemById, isSelK … (+24) | tlxSels, tlQ, keyClip, tlxView, tlxOpen, selId, itab, tlxOpenIds … |
| `transport.ts` | 1 | play/pause/seek, syncCtl | setPlay, resetFeedback, fmtT, syncCtl | playing, time, speed, last, fpsAcc, fpsN, fpsT, refine |
| `types.ts` | 4 | Shared data model of Látomás Stúdió. Everything is plain JSON so projects, undo history and recipes serialize as-is. | Key, NParam, ParamDef, EffectKind, EffectDef, Timing, LineSpec, TextSpec, Prim, Macro, Layer, Look, Camera, Project … (+1) |  |
| `userlib.ts` | 5 | P1: the user's own, durable library (presets, shaders, later anything else). One generic item shape: {id, kind, cat, name, created, data, thumb}. Kept in memory … | UItem, ULIB_VER, ULIB, ulibId, ulibValid, ulibGet, ulibBy, ulibLoad, ulibPut, ulibDel, ulibRename, ulibMerge, ulibExport, ulibImport … (+1) | ulibOk |
| `variants.ts` | 14 | Közös alap (shared base) / Változat (variant) / Kapcsolat (link). Három külön fogalom, semmi rejtett frissülés (terv 0.4): - Csoport: plain `type:'group'` layer, as … | Base, DiffEntry, LocalDiff, Link, flatten, isVariant, variantsOf, localDiff, diffCount, rematerialize, makeBase, newVariant, transfer, detach … (+10) |  |
| `variantsui.ts` | 8 | Inspector sections for Közös alap / Változat and Kapcsolat. Every action is one commit (undoable) and says what it did. | variantSection, childVariantSection, linkSection, variantBadge | selId |
| `version.ts` | 1 | Version + build stamp next to the brand (top left), so the running build is always identifiable. Values come from the build (package.json version, build time); the … | VERSION, BUILT, buildLabel |  |
| `workspace.ts` | 6 | U3 workspace chrome: library/layers splitter, one tooltip style for every titled control, toggleable shortcut panel. Pure UI: never touches the project (no commit). … | SHORTCUTS, setShelfFrac, shelfFrac, tipNodes, adoptTitle, setKeyHelp, keyHelpOn |  |
| `xfer.ts` | 10 | XF1 Mozgás átadása + Sorrend festése (row 26): from a motion card, paint across other layers on the canvas; the touch order becomes the stagger order (numbered … | xfStart, xfClose, xfAccept, xfSection | xfPv, xfStart, updXf, selId, xfSection |
