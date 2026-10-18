# Vel English-default localization — implementation handoff

**Scope:** the entire Vel editor, not only Help mode. The user's current instruction supersedes older notes saying the UI is Hungarian. English must be the default for every new installation and every visible built-in string. Hungarian may later be an optional locale; it must not silently remain the default.

## Current state and honest boundary

The editor is still predominantly Hungarian. The 16 linked Help topics and 128 static control tooltip descriptions now have English copy, but this is only a foundation. Do not set `<html lang="en">` or declare localization complete while any normal workflow still exposes Hungarian built-in UI text. Audit the rendered app, not just source literals. Current areas include the top bar, Library, Layers, Inspector, Motion, timeline, scenes, all dialogs, settings, errors, toasts, accessibility names, presets and recipe descriptions, shortcuts, and export.

## Non-negotiable data boundary

Display language must never become identity. Preserve persisted project keys, effect `kind`, catalog and recipe IDs, animation paths, parameter keys, shader names, keyboard shortcuts, localStorage keys, import/export schema, and Help topic IDs. Some built-in catalog identifiers are currently derived from Hungarian `name` values (`catalog.ts`); replacing those names in place could make old projects fail to resolve. First introduce explicit stable IDs or a tested legacy-name migration, then translate display labels. Do not translate user-authored names, text layers, imported metadata, or project content. Existing saved projects must load, render, save again, and retain all links in English UI.

## Source-of-truth structure

1. Use immutable message keys (for example `toolbar.project`, `layer.duplicate`, `fx.blur.description`) and an English source catalog. UI code requests text by key, including interpolated values. Avoid using Hungarian text as a runtime lookup key once a surface is migrated.
2. Keep tooltip identity separate from its copy. `src/helptooltips.ts` currently has stable IDs and a `source` field containing old Hungarian title aliases for migration. Freeze existing IDs; copy edits must not regenerate them from English titles. Move new controls directly to `data-help-id`/message keys. The Hungarian alias can be retired after every call site is migrated.
3. The quick tooltip answers “what does this do?” in one sentence. Help mode adds how to use it, constraints, and linked terms when relevant. Every interactive control needs a reviewed explanation or an explicit exemption (decorative/obvious self-labeled control); generic missing-help copy is a development failure, not finished content.
4. Make the document language and ARIA labels match the active locale. All modal headings, focus announcements, keyboard help, placeholders, disabled-state explanations, empty states, validation and failure messages need the same treatment as visible labels.
5. The English catalog is canonical. Any future Hungarian catalog translates from the same keys and must not change behavior.

## Terminology

| Hungarian concept | English UI term | Notes |
|---|---|---|
| Könyvtár | Library | Asset browser and saved creations |
| Réteg | Layer | Scene layer |
| Forrás | Source | Generates visual content |
| Forma | Shape | Outline or geometry |
| Megjelenés | Appearance | Visual effect attached to a layer |
| Mozgás | Motion | Time-driven layer behavior |
| Recept | Recipe | Multi-element starting composition |
| Sávok | Tracks | Expanded timeline view |
| Kulcskocka | Keyframe | Value at a specific time |
| Jelzés | Cue | Timeline event marker |
| Jelenet | Scene | Saved composition/sequence unit |
| Változat | Variant | Linked local variation; not randomization |
| Közös alap | Shared base | Source shared by variants |
| Kapcsolat | Link | Relation between elements |
| Eljátszás | Perform | Recording motion by direct manipulation |
| Véletlen | Randomize | Complete regeneration |
| Súgó mód | Help mode | Contextual hover/touch explanations |

Keep existing product/technical names such as Vel, WebGL, SVG, Lottie, GLSL, and parameter codes unchanged. Avoid translating the same concept differently across Library, Inspector, timeline, and Help.

## Delivery order for Claude

1. **Inventory and freeze references:** extract all user-visible strings from `index.html`, `src/**/*.ts`, preset/recipe data and generated dialogs. Classify each as UI copy, catalog display, user data, or persisted identity. Record existing storage-key and old-project fixtures.
2. **Build the localization layer:** English default catalog with stable keys, interpolation and explicit fallback diagnostics. Set locale at application start, then render chrome and dialogs from the catalog. No brittle post-render DOM text replacement.
3. **Migrate vertical workflows:** top bar and shortcuts; Library/catalog/search; Layers/Inspector and all effect controls; timeline/Motion/scenes; project/export/settings; remaining notifications/errors. Translate built-in recipe, effect, preset and material descriptions while keeping stable identities. Check a real workflow after each group.
4. **Complete Help:** audit every reachable control, including dynamic controls from `controls.ts`, `timeline.ts`, `moui.ts`, `scenes.ts`, `shelf.ts`, etc. Add stable IDs and reviewed one-sentence quick tips plus deeper Help where useful. Preserve linked glossary navigation and one-toggle touch behavior.
5. **Quality gate:** no unexplained Hungarian built-in text in the rendered default locale. Verify navigation, search, old project round-trip, export/import, undo, timeline, screen-reader names and narrow/touch view. Update `lang="en"` only when the default UI passes this gate. Document known exceptions explicitly.

## Acceptance examples

- Fresh launch shows English toolbar, Library, Inspector, timeline, dialogs, toasts and keyboard guide.
- Open an old Hungarian-era project. Its effects, recipe links and animations remain intact; UI labels are English; the user's layer names remain as authored.
- Search finds a built-in item by its English name; saved references still resolve by stable ID.
- Hovering a control shows its English quick tip; turning on Help opens the English explanation, and linked terms navigate correctly. Touch uses the same Help toggle.
- A new control without a localized label or Help description fails the content check rather than falling back silently to Hungarian.

## Agent guidance

Inspect the present code and tests before editing; the file map and current implementation take precedence over assumptions in this document. If a cleaner solution preserves the behavior and data compatibility above, use it and explain the choice in the handoff. Do not call the whole-app migration complete after translating Help or static HTML alone. Keep each change reviewable, run the affected tests, and commit with an English message.
