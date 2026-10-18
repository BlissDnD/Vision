/* English tooltip copy. Stable IDs; source is a migration alias for current Hungarian titles. */
export interface TooltipCopy { id: string; source: string; title: string; summary: string; file: string }
export const TOOLTIP_COPY: TooltipCopy[] = [
  {
    "file": "index.html",
    "source": "Vissza az elejére (Home)",
    "id": "ui.index.go-to-start",
    "title": "Go to start",
    "summary": "Move the playhead to the beginning of the scene. Press Home for the same action."
  },
  {
    "file": "index.html",
    "source": "Lejátszás / szünet (Szóköz)",
    "id": "ui.index.play-or-pause",
    "title": "Play or pause",
    "summary": "Start or pause scene playback. Press Space when you are not typing in a field."
  },
  {
    "file": "index.html",
    "source": "10 mp videó rögzítése",
    "id": "ui.index.record-a-10-second-video",
    "title": "Record a 10-second video",
    "summary": "Capture a short video from the current composition using the quick recording action."
  },
  {
    "file": "index.html",
    "source": "Visszavonás (⌘Z)",
    "id": "ui.index.undo",
    "title": "Undo",
    "summary": "Reverse the most recent editable change. Use Command-Z."
  },
  {
    "file": "index.html",
    "source": "Újra (⇧⌘Z)",
    "id": "ui.index.redo",
    "title": "Redo",
    "summary": "Restore a change that you just undid. Use Shift-Command-Z."
  },
  {
    "file": "index.html",
    "source": "Vászon: méret, arány, háttér",
    "id": "ui.index.canvas-settings",
    "title": "Canvas settings",
    "summary": "Set the canvas size, aspect ratio, and background in this panel."
  },
  {
    "file": "index.html",
    "source": "Projekt: mentés, megnyitás, fájl",
    "id": "ui.index.project",
    "title": "Project",
    "summary": "Open project saving, loading, and file actions. Save the project to keep it editable."
  },
  {
    "file": "index.html",
    "source": "Hang és jelek",
    "id": "ui.index.audio-and-cues",
    "title": "Audio and cues",
    "summary": "Open the audio and cue controls used to synchronize scene events."
  },
  {
    "file": "index.html",
    "source": "Véletlen látomás hangulat alapján (R)",
    "id": "ui.index.random-vision",
    "title": "Random vision",
    "summary": "Generate a new composition based on a mood. Press R for the shortcut."
  },
  {
    "file": "index.html",
    "source": "Leírásból animáció: Claude összerakja a jelenetet",
    "id": "ui.index.animate-from-a-description",
    "title": "Animate from a description",
    "summary": "Open the workflow that lets Claude assemble a scene from a written description."
  },
  {
    "file": "index.html",
    "source": "Renderelés és színkezelés",
    "id": "ui.index.rendering-and-color",
    "title": "Rendering and color",
    "summary": "Adjust how the scene is rendered and how its colors are handled."
  },
  {
    "file": "index.html",
    "source": "Exportálás: kép, videó, önálló HTML",
    "id": "ui.index.export",
    "title": "Export",
    "summary": "Create an image, video, or standalone HTML file from the current composition."
  },
  {
    "file": "index.html",
    "source": "Gyorsbillentyűk a vásznon (?)",
    "id": "ui.index.keyboard-shortcuts",
    "title": "Keyboard shortcuts",
    "summary": "Show the shortcut panel over the canvas. Press ? for the same panel."
  },
  {
    "file": "index.html",
    "source": "Súgó: így működik",
    "id": "ui.index.how-vel-works",
    "title": "How Vel works",
    "summary": "Open the general guide to recipes, layers, effects, animation, and controls."
  },
  {
    "file": "index.html",
    "source": "Húzd: több hely a könyvtárnak vagy a rétegeknek · dupla kattintás: alaphelyzet",
    "id": "ui.index.resize-sidebar-sections",
    "title": "Resize sidebar sections",
    "summary": "Drag to give more height to the Library or Layers. Double-click to restore the default split."
  },
  {
    "file": "index.html",
    "source": "Csoportba foglalás (⌘G)",
    "id": "ui.index.group-layers",
    "title": "Group layers",
    "summary": "Combine selected layers into a group. Use Command-G for the shortcut."
  },
  {
    "file": "index.html",
    "source": "Duplikálás (⌘D)",
    "id": "ui.index.duplicate",
    "title": "Duplicate",
    "summary": "Create a copy of the selected item. Use Command-D for the shortcut."
  },
  {
    "file": "index.html",
    "source": "Feljebb (])",
    "id": "ui.index.move-layer-up",
    "title": "Move layer up",
    "summary": "Move the selected layer one position higher in the layer list. Press ]."
  },
  {
    "file": "index.html",
    "source": "Lejjebb ([)",
    "id": "ui.index.move-layer-down",
    "title": "Move layer down",
    "summary": "Move the selected layer one position lower in the layer list. Press [."
  },
  {
    "file": "index.html",
    "source": "Törlés (Del)",
    "id": "ui.index.delete",
    "title": "Delete",
    "summary": "Remove the selected item. Press Delete for the shortcut."
  },
  {
    "file": "index.html",
    "source": "Méretezés",
    "id": "ui.index.scale",
    "title": "Scale",
    "summary": "Drag this handle to change the selected item’s size."
  },
  {
    "file": "index.html",
    "source": "Forgatás",
    "id": "ui.index.rotate",
    "title": "Rotate",
    "summary": "Drag this handle to turn the selected item."
  },
  {
    "file": "index.html",
    "source": "Mozgatás és méretezés (V)",
    "id": "ui.index.move-and-scale",
    "title": "Move and scale",
    "summary": "Use this canvas tool to position and resize layers. Press V to select it."
  },
  {
    "file": "index.html",
    "source": "3D forgatás (O)",
    "id": "ui.index.orbit-in-3d",
    "title": "Orbit in 3D",
    "summary": "Rotate the 3D view around the scene. Press O to select this tool."
  },
  {
    "file": "index.html",
    "source": "Animálás (A): amit állítasz, kulcskocka lesz az aktuális időponton",
    "id": "ui.index.animate-mode",
    "title": "Animate mode",
    "summary": "When enabled, changing an animatable value writes a keyframe at the current time. Press A."
  },
  {
    "file": "index.html",
    "source": "Eljátszás: lejátszás közben húzd a réteget, mozdulatból kulcskockák (E)",
    "id": "ui.index.perform-mode",
    "title": "Perform mode",
    "summary": "Record a layer gesture as keyframes while playback runs. Press E to enable it."
  },
  {
    "file": "index.html",
    "source": "Simítás (az utolsó eljátszásra is hat)",
    "id": "ui.index.performance-smoothing",
    "title": "Performance smoothing",
    "summary": "Change how smooth a performed movement is, including the last recorded performance."
  },
  {
    "file": "index.html",
    "source": "Fogantyúk (G)",
    "id": "ui.index.handles",
    "title": "Handles",
    "summary": "Show or hide canvas handles for direct editing. Press G for the shortcut."
  },
  {
    "file": "index.html",
    "source": "Teljes képernyő (F)",
    "id": "ui.index.full-screen",
    "title": "Full screen",
    "summary": "Expand the editing view to full screen. Press F to toggle it."
  },
  {
    "file": "index.html",
    "source": "Sávok: rétegek az időben, húzható kulcskockák",
    "id": "ui.index.tracks",
    "title": "Tracks",
    "summary": "Show layers and draggable keyframes in the detailed timeline."
  },
  {
    "file": "index.html",
    "source": "Jelenetek: mentett kompozíciók egymás után, átmenettel",
    "id": "ui.index.scenes",
    "title": "Scenes",
    "summary": "Arrange saved compositions in sequence and transition between them."
  },
  {
    "file": "index.html",
    "source": "Kamera (2,5D tér, parallaxis, mélységélesség)",
    "id": "ui.index.camera",
    "title": "Camera",
    "summary": "Adjust perspective, parallax, and depth of field in the 2.5D scene."
  },
  {
    "file": "index.html",
    "source": "Ismétlés",
    "id": "ui.index.loop",
    "title": "Loop",
    "summary": "Repeat playback when the scene reaches its duration."
  },
  {
    "file": "index.html",
    "source": "Idővonal hossza (mp)",
    "id": "ui.index.timeline-duration",
    "title": "Timeline duration",
    "summary": "Set how long the current timeline lasts, in seconds."
  },
  {
    "file": "choreo.ts",
    "source": "A jelenetmozgás eltávolítása",
    "id": "ui.choreo.remove-scene-choreography",
    "title": "Remove scene choreography",
    "summary": "Delete the scene-wide motion block from the composition."
  },
  {
    "file": "choreo.ts",
    "source": "Koreográfia: a Vel szerepenként összehangolt érkezést javasol a jelenetre (előnézet, majd Elfogadás)",
    "id": "ui.choreo.choreography-suggestion",
    "title": "Choreography suggestion",
    "summary": "Preview an arrival order based on layer roles, then accept it to apply the coordinated motion."
  },
  {
    "file": "choreo.ts",
    "source": "A réteg része valódi, szerkeszthető mozgás lesz, és kilép a blokkból",
    "id": "ui.choreo.make-motion-independent",
    "title": "Make motion independent",
    "summary": "Turn this layer’s part of the choreography into editable standalone motion."
  },
  {
    "file": "choreo.ts",
    "source": "Szerepcsoportok",
    "id": "ui.choreo.role-groups",
    "title": "Role groups",
    "summary": "View or change the roles used to coordinate the scene’s layer entrances."
  },
  {
    "file": "choreo.ts",
    "source": "Ritmus nyújtása (a belépések sebessége marad)",
    "id": "ui.choreo.stretch-rhythm",
    "title": "Stretch rhythm",
    "summary": "Change the spacing between entrances while keeping each entrance’s speed."
  },
  {
    "file": "choreo.ts",
    "source": "Jelenetmozgás",
    "id": "ui.choreo.scene-motion",
    "title": "Scene motion",
    "summary": "Edit the coordinated motion applied to the whole scene."
  },
  {
    "file": "gradui.ts",
    "source": "Kattints: új állomás · húzd az állomást · dupla katt: szín · húzd le: törlés",
    "id": "ui.gradui.edit-gradient-stops",
    "title": "Edit gradient stops",
    "summary": "Click to add a stop, drag to move it, double-click to change its color, or drag it away to remove it."
  },
  {
    "file": "gradui.ts",
    "source": "Saját átmenet: állomásokkal szerkeszthető",
    "id": "ui.gradui.custom-gradient",
    "title": "Custom gradient",
    "summary": "Create and edit a gradient with individual color stops."
  },
  {
    "file": "camui.ts",
    "source": "A kijelölt rétegre áll a kamera a lejátszófej idejétől.",
    "id": "ui.camui.set-camera-target",
    "title": "Set camera target",
    "summary": "Aim the camera at the selected layer from the current playhead time onward."
  },
  {
    "file": "camui.ts",
    "source": "Célpont törlése",
    "id": "ui.camui.delete-camera-target",
    "title": "Delete camera target",
    "summary": "Remove this camera target from the camera path."
  },
  {
    "file": "layers.ts",
    "source": "Ez a réteg nem tudott lefordulni ezen a gépen, ezért üres. Kattints rá a részletekért.",
    "id": "ui.layers.unavailable-layer",
    "title": "Unavailable layer",
    "summary": "This layer could not compile on this device, so it appears empty. Click it for details."
  },
  {
    "file": "layers.ts",
    "source": "Gépigény: ",
    "id": "ui.layers.rendering-cost",
    "title": "Rendering cost",
    "summary": "See an estimate of how demanding this layer is for the current device."
  },
  {
    "file": "spinegrips.ts",
    "source": "Húzd: a pont mozgatása a kamerával szemközti síkban. Shift: vízszintesen (a magasság marad).",
    "id": "ui.spinegrips.move-surface-point",
    "title": "Move surface point",
    "summary": "Drag the point in a plane facing the camera. Hold Shift to constrain it horizontally."
  },
  {
    "file": "spinegrips.ts",
    "source": "Bekapcsolva a felületen húzva a mennyezeti fénycsík oda kerül, hogy a csillanás az egér alatt legyen.",
    "id": "ui.spinegrips.place-ceiling-highlight",
    "title": "Place ceiling highlight",
    "summary": "Drag on the surface to put the ceiling light strip where its reflection falls under the pointer."
  },
  {
    "file": "xfer.ts",
    "source": "A forrásmozgás megnyitása",
    "id": "ui.xfer.open-source-motion",
    "title": "Open source motion",
    "summary": "Jump to the motion that supplies this linked movement."
  },
  {
    "file": "xfer.ts",
    "source": "Önálló mozgás lesz a most látható értékekkel (a forrás változását már nem követi)",
    "id": "ui.xfer.detach-motion",
    "title": "Detach motion",
    "summary": "Keep the values currently visible as independent motion. Later source changes will no longer update it."
  },
  {
    "file": "xfer.ts",
    "source": "Végigfested a vásznon a többi elemet: ugyanez a mozgás a festés sorrendjében, lépcsőzve jut el hozzájuk",
    "id": "ui.xfer.paint-motion-order",
    "title": "Paint motion order",
    "summary": "Paint across other elements to give them this motion in the order you touch them, with staggered starts."
  },
  {
    "file": "xfer.ts",
    "source": "Kivétel a sorból (a cél mozgása megszűnik)",
    "id": "ui.xfer.remove-from-motion-order",
    "title": "Remove from motion order",
    "summary": "Take this target out of the sequence and remove its assigned motion."
  },
  {
    "file": "scenes.ts",
    "source": "A jelenet a vászonra kerül szerkesztésre (visszavonható)",
    "id": "ui.scenes.edit-scene-on-canvas",
    "title": "Edit scene on canvas",
    "summary": "Load this scene onto the canvas for editing. The operation can be undone."
  },
  {
    "file": "scenes.ts",
    "source": "A jelenet tartalma a mostani vászon lesz",
    "id": "ui.scenes.replace-scene-contents",
    "title": "Replace scene contents",
    "summary": "Store the current canvas contents in this scene slot."
  },
  {
    "file": "scenes.ts",
    "source": "Jelenetsor: a jelenetek egymás után, átmenettel (az idővonal a teljes sor). Kikapcsolva a vászon szerkeszthető.",
    "id": "ui.scenes.scene-sequence",
    "title": "Scene sequence",
    "summary": "Play scenes one after another with transitions. Turn it off to edit the canvas directly."
  },
  {
    "file": "scenes.ts",
    "source": "A mostani vászon új jelenetként a sor végére kerül",
    "id": "ui.scenes.add-current-canvas-as-scene",
    "title": "Add current canvas as scene",
    "summary": "Append the current canvas as a new scene at the end of the sequence."
  },
  {
    "file": "tap.ts",
    "source": "Belépési sorrend a koppintáshoz · húzd egy másik számra az átrendezéshez · kattintás a soron: kivétel",
    "id": "ui.tap.tap-entrance-order",
    "title": "Tap entrance order",
    "summary": "Drag a number to reorder entrances, or click an item in the row to remove it."
  },
  {
    "file": "tap.ts",
    "source": "Húzd az átrendezéshez",
    "id": "ui.tap.reorder",
    "title": "Reorder",
    "summary": "Drag this item to another position in the list."
  },
  {
    "file": "tap.ts",
    "source": "Kivétel a kosárból",
    "id": "ui.tap.remove-from-tap-basket",
    "title": "Remove from tap basket",
    "summary": "Take this item out of the planned entrance sequence."
  },
  {
    "file": "tap.ts",
    "source": "Koppintás most (J): a következő elem itt lép be",
    "id": "ui.tap.tap-now",
    "title": "Tap now",
    "summary": "Press J during playback to bring the next item in at this beat."
  },
  {
    "file": "tap.ts",
    "source": "Koppintás (T): rétegek kosárba a belépés sorrendjében, aztán lejátszás közben J minden ütemre",
    "id": "ui.tap.tap-timing",
    "title": "Tap timing",
    "summary": "Press T to collect layers in entrance order, then press J on each beat during playback."
  },
  {
    "file": "random.ts",
    "source": "Az összetevőit ritkábban választom, és dobok újat",
    "id": "ui.random.choose-less-often",
    "title": "Choose less often",
    "summary": "Lower this ingredient’s chance of appearing and generate another result."
  },
  {
    "file": "random.ts",
    "source": "Az összetevőit gyakrabban választom",
    "id": "ui.random.choose-more-often",
    "title": "Choose more often",
    "summary": "Raise this ingredient’s chance of appearing in future random results."
  },
  {
    "file": "random.ts",
    "source": "Ugyanaz a felépítés, más paraméterekkel",
    "id": "ui.random.vary-parameters",
    "title": "Vary parameters",
    "summary": "Keep the same structure and generate new parameter values."
  },
  {
    "file": "variantsui.ts",
    "source": "A helyi értékek a közös alapba kerülnek; a többi változat megkapja, kivéve amit ott helyben már átírtál.",
    "id": "ui.variantsui.apply-local-values-to-base",
    "title": "Apply local values to base",
    "summary": "Copy local values into the shared base. Other variants inherit them unless they override them locally."
  },
  {
    "file": "variantsui.ts",
    "source": "Törlés",
    "id": "ui.variantsui.delete",
    "title": "Delete",
    "summary": "Remove the item shown by this control."
  },
  {
    "file": "pathedit.ts",
    "source": "Húzd: a pont mozgatása. Alt+kattintás: törlés. Dupla kattintás a szaggatott vonalon: új pont.",
    "id": "ui.pathedit.edit-path-point",
    "title": "Edit path point",
    "summary": "Drag to move the point, Alt-click to delete it, or double-click a dashed segment to insert a point."
  },
  {
    "file": "pathedit.ts",
    "source": "Rajzold meg az útvonalat egy húzással. Esc: mégse.",
    "id": "ui.pathedit.draw-a-path",
    "title": "Draw a path",
    "summary": "Draw the path with one drag. Press Escape to cancel the drawing."
  },
  {
    "file": "pathedit.ts",
    "source": "Melyik Útvonal rétegen",
    "id": "ui.pathedit.path-layer",
    "title": "Path layer",
    "summary": "Choose which Path layer this control edits."
  },
  {
    "file": "inspector.ts",
    "source": "Mentés presetként a saját könyvtárba (polcválasztással)",
    "id": "ui.inspector.save-as-preset",
    "title": "Save as preset",
    "summary": "Save this layer as a preset in your Library and choose its shelf."
  },
  {
    "file": "inspector.ts",
    "source": "Van animáció",
    "id": "ui.inspector.animated",
    "title": "Animated",
    "summary": "This item has animation attached to it."
  },
  {
    "file": "inspector.ts",
    "source": "Tempó finoman (¼× … 4×), elengedéskor átidőzít",
    "id": "ui.inspector.fine-tempo",
    "title": "Fine tempo",
    "summary": "Adjust speed from one quarter to four times normal. Timing updates when you release the control."
  },
  {
    "file": "inspector.ts",
    "source": "Az elem minden mozgása (kulcsok, beúszás/kiúszás, mozgások üteme) a mozgásblokk elejéhez képest gyorsul vagy lassul",
    "id": "ui.inspector.retiming-scope",
    "title": "Retiming scope",
    "summary": "Scale this item’s keys, entrances, exits, and motion rhythm relative to the beginning of its motion block."
  },
  {
    "file": "inspector.ts",
    "source": "A",
    "id": "ui.inspector.animate-shortcut",
    "title": "Animate shortcut",
    "summary": "Press A to toggle Animate mode."
  },
  {
    "file": "inspector.ts",
    "source": "E",
    "id": "ui.inspector.perform-shortcut",
    "title": "Perform shortcut",
    "summary": "Press E to toggle Perform mode."
  },
  {
    "file": "inspector.ts",
    "source": "Következő kulcs",
    "id": "ui.inspector.next-keyframe",
    "title": "Next keyframe",
    "summary": "Move the playhead to the next keyframe on this parameter."
  },
  {
    "file": "inspector.ts",
    "source": "Animáció eltávolítása erről a paraméterről (visszavonható)",
    "id": "ui.inspector.remove-animation",
    "title": "Remove animation",
    "summary": "Remove animation from this parameter. You can undo the change."
  },
  {
    "file": "linkcord.ts",
    "source": "Kapcsolat: húzd egy másik elemre",
    "id": "ui.linkcord.create-a-connection",
    "title": "Create a connection",
    "summary": "Drag from here to another item to link their behavior."
  },
  {
    "file": "linkcord.ts",
    "source": "Irány megfordítása: a másik hasson erre",
    "id": "ui.linkcord.reverse-connection",
    "title": "Reverse connection",
    "summary": "Switch which of the two connected items drives the other."
  },
  {
    "file": "evaluation.ts",
    "source": "Kulcskocka ezen az időponton (K)",
    "id": "ui.evaluation.keyframe-here",
    "title": "Keyframe here",
    "summary": "Add or edit a keyframe at the current time. Press K for placement keys."
  },
  {
    "file": "colorsum.ts",
    "source": "Paletta · kattints: Szín fül",
    "id": "ui.colorsum.palette",
    "title": "Palette",
    "summary": "Click to open the Color tab for this palette."
  },
  {
    "file": "colorsum.ts",
    "source": "Kapcsolat vezérli",
    "id": "ui.colorsum.driven-by-connection",
    "title": "Driven by connection",
    "summary": "This value is controlled by a connection to another item."
  },
  {
    "file": "presets.ts",
    "source": "Csúszka törlése",
    "id": "ui.presets.remove-slider",
    "title": "Remove slider",
    "summary": "Delete this custom slider from the preset."
  },
  {
    "file": "textlines.ts",
    "source": "Húzd: vízszintesen behúzás, függőlegesen sortávolság. Shift + függőleges: a sor mérete.",
    "id": "ui.textlines.edit-text-line",
    "title": "Edit text line",
    "summary": "Drag horizontally to indent and vertically to set line spacing. Shift-drag vertically to resize the line."
  },
  {
    "file": "textbar.ts",
    "source": "Betűtípus",
    "id": "ui.textbar.font-family",
    "title": "Font family",
    "summary": "Choose the typeface for the selected text."
  },
  {
    "file": "textbar.ts",
    "source": "Félkövér (vastagság: Vékony … Extra a ⋯ alatt)",
    "id": "ui.textbar.bold-text",
    "title": "Bold text",
    "summary": "Make the text bold. Additional weights, from Thin to Extra, are under the more-options menu."
  },
  {
    "file": "textbar.ts",
    "source": "Szín: paletta és színezés",
    "id": "ui.textbar.text-color",
    "title": "Text color",
    "summary": "Open palette and color controls for the selected text."
  },
  {
    "file": "textbar.ts",
    "source": "Szövegmozgás beállításai (Mozgás fül)",
    "id": "ui.textbar.text-motion",
    "title": "Text motion",
    "summary": "Open the Motion tab for text animation settings."
  },
  {
    "file": "textbar.ts",
    "source": "További szövegbeállítások (Tartalom fül)",
    "id": "ui.textbar.more-text-settings",
    "title": "More text settings",
    "summary": "Open the Content tab for additional text properties."
  },
  {
    "file": "textbar.ts",
    "source": "Enter: új sor · ⌘Enter vagy kattintás mellé: kész · Esc: mégse",
    "id": "ui.textbar.finish-text-editing",
    "title": "Finish text editing",
    "summary": "Enter adds a line. Command-Enter or clicking outside finishes; Escape cancels."
  },
  {
    "file": "lightui.ts",
    "source": "Bekapcsolva a tárgyon húzva a fény úgy fordul, hogy a csillanás az egér alatt legyen.",
    "id": "ui.lightui.aim-a-light-by-reflection",
    "title": "Aim a light by reflection",
    "summary": "Drag on the object to rotate the light until its highlight sits under the pointer."
  },
  {
    "file": "lightui.ts",
    "source": "Új fény: elsőre ellenfény, aztán hideg kitöltő, majd meleg felső fény.",
    "id": "ui.lightui.add-a-light",
    "title": "Add a light",
    "summary": "The first extra light is a rim light; later ones add cool fill and warm overhead light."
  },
  {
    "file": "timeline.ts",
    "source": "Kulcskocka ",
    "id": "ui.timeline.keyframe",
    "title": "Keyframe",
    "summary": "Inspect the keyframe at this time."
  },
  {
    "file": "timeline.ts",
    "source": "Jelzések: lejátszás közben J = koppintás az ütemre · dupla katt: új jelzés · Alt+katt a jelzésen: törlés",
    "id": "ui.timeline.cues",
    "title": "Cues",
    "summary": "Press J during playback to tap a beat, double-click to add a cue, or Alt-click a cue to remove it."
  },
  {
    "file": "timeline.ts",
    "source": "Mozgásblokk · húzás: egészben eltolás · Shift+katt: több blokk · jobb szél: középrész nyújtása (Alt: zárás lassítása)",
    "id": "ui.timeline.move-motion-block",
    "title": "Move motion block",
    "summary": "Drag to move the block, Shift-click to select more, or drag the right edge to stretch its middle. Alt adjusts the ending."
  },
  {
    "file": "timeline.ts",
    "source": "Húzd: a rugalmas közép nyúlik, a beúszás sebessége marad · Alt+húzás: zárás lassítása",
    "id": "ui.timeline.stretch-motion-middle",
    "title": "Stretch motion middle",
    "summary": "Drag to lengthen the flexible middle while keeping entrance speed. Alt-drag to change the exit slowdown."
  },
  {
    "file": "timeline.ts",
    "source": "Húzd az időzítés eltolásához",
    "id": "ui.timeline.shift-timing",
    "title": "Shift timing",
    "summary": "Drag to move this timing position along the timeline."
  },
  {
    "file": "timeline.ts",
    "source": "Animálva: ",
    "id": "ui.timeline.animated-by",
    "title": "Animated by",
    "summary": "See the animation sources that affect this parameter."
  },
  {
    "file": "timeline.ts",
    "source": "Hang / jel vezérli",
    "id": "ui.timeline.driven-by-audio-or-cue",
    "title": "Driven by audio or cue",
    "summary": "Audio or a cue currently controls this value."
  },
  {
    "file": "timeline.ts",
    "source": "Kapcsolat: egy másik elem értéke hajtja",
    "id": "ui.timeline.driven-by-connection",
    "title": "Driven by connection",
    "summary": "Another item’s value drives this parameter through a connection."
  },
  {
    "file": "timeline.ts",
    "source": "Kezdés",
    "id": "ui.timeline.start",
    "title": "Start",
    "summary": "Change when this item or motion begins."
  },
  {
    "file": "timeline.ts",
    "source": "A mozgás paraméterei (kulcsok)",
    "id": "ui.timeline.motion-parameters",
    "title": "Motion parameters",
    "summary": "Open the keyframes and other controls for this motion."
  },
  {
    "file": "timeline.ts",
    "source": "A mozgás terjedése a festett sorrendben",
    "id": "ui.timeline.motion-spread",
    "title": "Motion spread",
    "summary": "Adjust how the motion reaches targets in the order they were painted."
  },
  {
    "file": "timeline.ts",
    "source": "Késés nyújtása",
    "id": "ui.timeline.stretch-delay",
    "title": "Stretch delay",
    "summary": "Drag to increase or reduce the delay between targets."
  },
  {
    "file": "gesture.ts",
    "source": "Húzd oldalra: ív",
    "id": "ui.gesture.curve-the-path",
    "title": "Curve the path",
    "summary": "Drag sideways to bend the gesture’s movement path."
  },
  {
    "file": "moui.ts",
    "source": "Saját görbe (a szalagon húzva)",
    "id": "ui.moui.custom-rhythm-curve",
    "title": "Custom rhythm curve",
    "summary": "Drag on the rhythm strip to shape a custom timing curve."
  },
  {
    "file": "moui.ts",
    "source": "Egy ütem: pont le = lassabb / megáll, fel = gyorsabb · a jobb szélt húzva az ütem hossza",
    "id": "ui.moui.edit-a-beat",
    "title": "Edit a beat",
    "summary": "Drag a point down to slow or pause and up to speed up. Drag the right edge to change the beat length."
  },
  {
    "file": "moui.ts",
    "source": "Húzd: az ütem hossza",
    "id": "ui.moui.beat-length",
    "title": "Beat length",
    "summary": "Drag to make this beat shorter or longer."
  },
  {
    "file": "moui.ts",
    "source": "Más, de ugyanúgy ismételhető szünetminta",
    "id": "ui.moui.new-pause-variation",
    "title": "New pause variation",
    "summary": "Generate a different pause pattern that can still loop the same way."
  },
  {
    "file": "moui.ts",
    "source": "A tempó a legközelebbi olyan értékre igazodik, amelynél egész számú kör fér a projekt (jelenet) hosszába: a loop vége pontosan az elejébe ér.",
    "id": "ui.moui.fit-a-seamless-loop",
    "title": "Fit a seamless loop",
    "summary": "Snap tempo to a value that fits a whole number of motion cycles into the scene duration."
  },
  {
    "file": "moui.ts",
    "source": "Mozgás hozzáadása",
    "id": "ui.moui.add-motion",
    "title": "Add motion",
    "summary": "Attach another motion to the selected layer."
  },
  {
    "file": "moui.ts",
    "source": "Eltávolítás",
    "id": "ui.moui.remove-motion",
    "title": "Remove motion",
    "summary": "Remove this motion from the selected layer."
  },
  {
    "file": "moui.ts",
    "source": "A mozgást valódi X / Y / Méret / Szög / Átlátszóság kulcsokká alakítja (a mozgás eltűnik; ⌘Z visszavonja)",
    "id": "ui.moui.convert-to-keyframes",
    "title": "Convert to keyframes",
    "summary": "Bake the motion into editable X, Y, Size, Angle, and Opacity keys. Undo restores the original motion."
  },
  {
    "file": "moui.ts",
    "source": "A vászon szélét újra fallá teszi, így a test bent marad",
    "id": "ui.moui.canvas-walls",
    "title": "Canvas walls",
    "summary": "Treat the canvas edges as walls again so the physical body remains inside."
  },
  {
    "file": "colorpick.ts",
    "source": "Pipetta: szín a képernyőről",
    "id": "ui.colorpick.eyedropper",
    "title": "Eyedropper",
    "summary": "Sample a color from the screen with the browser’s eyedropper."
  },
  {
    "file": "colorpick.ts",
    "source": "Ez a böngésző nem tud pipettázni",
    "id": "ui.colorpick.eyedropper-unavailable",
    "title": "Eyedropper unavailable",
    "summary": "This browser does not provide the eyedropper feature."
  },
  {
    "file": "shelf.ts",
    "source": "Átnevezés, polc, törlés",
    "id": "ui.shelf.manage-library-item",
    "title": "Manage Library item",
    "summary": "Rename, move to another shelf, or delete this own Library item."
  },
  {
    "file": "controls.ts",
    "source": "Animálás",
    "id": "ui.controls.animate-parameter",
    "title": "Animate parameter",
    "summary": "Open animation controls for this parameter."
  },
  {
    "file": "controls.ts",
    "source": "Kulcskockák és görbe",
    "id": "ui.controls.keys-and-curve",
    "title": "Keys and curve",
    "summary": "Edit this parameter’s keyframes and interpolation curve."
  },
  {
    "file": "controls.ts",
    "source": "Új véletlen",
    "id": "ui.controls.new-random-seed",
    "title": "New random seed",
    "summary": "Generate another random seed for this control."
  },
  {
    "file": "controls.ts",
    "source": "A hullám egész számú kört tesz meg a projekt (jelenet) hosszában, így a loop vége pontosan az elejébe ér.",
    "id": "ui.controls.fit-wave-to-loop",
    "title": "Fit wave to loop",
    "summary": "Make the wave complete whole cycles during the scene so its end joins its beginning."
  },
  {
    "file": "controls.ts",
    "source": "Húzd vízszintesen az érték állításához",
    "id": "ui.controls.scrub-value",
    "title": "Scrub value",
    "summary": "Drag horizontally to adjust this value directly."
  },
  {
    "file": "controls.ts",
    "source": "Megjelenés hozzáadása",
    "id": "ui.controls.add-appearance",
    "title": "Add Appearance",
    "summary": "Choose an Appearance to add to the selected layer."
  },
  {
    "file": "controls.ts",
    "source": "Előrébb",
    "id": "ui.controls.move-effect-earlier",
    "title": "Move effect earlier",
    "summary": "Move this Appearance earlier in the effect chain."
  },
  {
    "file": "controls.ts",
    "source": "Hátrébb",
    "id": "ui.controls.move-effect-later",
    "title": "Move effect later",
    "summary": "Move this Appearance later in the effect chain."
  },
  {
    "file": "signals.ts",
    "source": "Húzd rá egy csúszkára",
    "id": "ui.signals.drag-onto-slider",
    "title": "Drag onto slider",
    "summary": "Drag this signal onto a slider to make it drive that value."
  },
  {
    "file": "abar.ts",
    "source": "Munkatér-elrendezések",
    "id": "ui.abar.workspace-layouts",
    "title": "Workspace layouts",
    "summary": "Open saved workspace layouts or restore the default arrangement."
  },
  {
    file: 'index.html',
    source: 'Továbbfutás: az Ismétlés ki van kapcsolva, ezért a jelenet a tartomány vége után is él. Az időzített elemek a végállapotukban maradnak, a folyamatos mozgás és a generátorok mennek tovább. Kattints: vissza az elejére.',
    id: 'ui.index.continue-beyond-scene-end',
    title: 'Continue beyond scene end',
    summary: 'With Loop off, timed elements hold their last state while continuous motions and generators keep running. Click to return to the start.'
  }
];
const bySource = new Map(TOOLTIP_COPY.map(item => [item.source, item]));
const byTitle = new Map(TOOLTIP_COPY.map(item => [item.title, item]));
const byId = new Map(TOOLTIP_COPY.map(item => [item.id, item]));
export const tooltipForSource = (text: string) => bySource.get(text) || byTitle.get(text);
export const tooltipForId = (id: string) => byId.get(id);
