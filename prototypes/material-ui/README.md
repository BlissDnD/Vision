# Vel · Material 3 starter

**Belépési pont Claude számára: `AGENTS.md`.** Ez az elkészült, különálló alapcsomag a végleges design system kialakításához; a Vel forrás-UI még nem használja.

## Megnyitás
Az `index.html` dupla kattintással, internet és szerver nélkül megnyitható. Sötét/világos téma, három mintapanel és komponensreferencia. A HTML tartalmazza a közös CSS-t, a vezérlőket és az ikonokat; nem kell hozzá React.

## Tartalom és tényleges állapot
| Elem | Állapot |
|---|---|
| Szemantikus sötét/világos tokenek | Működő kezdőkészlet, végleges méretezés és témahangolás hátra |
| Gomb, ikongomb, kapcsoló, választógombok | Működő, típusos DOM-gyártófüggvények |
| Paramétersor | Szinkron csúszka és számmező, reset, min/max, tiltás |
| Iránykör | Pointer és nyílbillentyű, Shift 15°, számbevitel |
| Görbe | Szabadkézi mintavétel, simítás, reset; normalizált pontok; nem teljes keyframe-editor |
| Tooltip, lenyitható részletek | Közös függvények, tooltip cleanup |
| Fülek, kereső, lista, paletta, dialógus | Működő összerakási példák a demóban, még nem külön exportált komponensek |
| Ikonok | 11 hivatalos Material Symbols Outlined SVG, offline beágyazva |
| Vel renderer / undo / mentés | Nincs bekötve; Claude feladata |
| Teljes design system / minden panel migrációja | Nincs kész; ebből az alapból folytatható |

## Gyors használat
```ts
import { parameter } from './src/controls';
const tempo = parameter({
  label: 'Tempo', icon: 'tempo', min: 0, max: 4, step: .01,
  value: 1, defaultValue: 1,
  onInput: value => previewTempo(value),
  onCommit: value => finishTempoGesture(value),
});
container.append(tempo.element);
tempo.setValue(2); // csak UI-szinkron, nincs callback
```
Az adapterfüggvények helykitöltő példák; a `previewTempo`, `finishTempoGesture` és `container` a fogadó alkalmazásból jönnek. A két közös CSS-fájlt egyszer kell betölteni.

## Claude következő lépése
1. A bemutató vizuális véglegesítése a felhasználóval: sűrűség, tipográfia, kategóriaszínek, ikonos ritmusok.
2. Vel-adapter: paraméterút, preview, gesztuskezdet/vég, undo, mentés, animáció és egységek. A callback nem helyettesíti a tranzakciót.
3. A kiválasztott első panel átvezetése; majd a többi panel fokozatos migrációja.
4. Görbe billentyűzetes pontszerkesztés, valódi keyframe-egységek és timeline-kapcsolat. Színpicker és gradiens jelenlegi Vel-funkcióinak megőrzése.
5. További szükséges komponensek kiemelése a demóból: tabs, dialog, search, palette; később menu/select/progress/snackbar és drag/drop állapotok.

## Ellenőrzés
19/19 célzott Playwright-ellenőrzés: érték-szinkron/reset, commit, kapcsoló, módválasztó, irány billentyűzettel, görberajz/simítás/reset, dialógus/Escape, keresés, téma, horizontális túlcsordulás 320/390/768/1280 px-en, futási hibák. Strict TypeScript és offline build zöld. Eredmények: `CHECK-RESULTS.json`; képek: `preview-desktop.png`, `preview-narrow.png`. Teljes hozzáférhetőségi audit és kézi felhasználói próba még nem történt. A főapp teljes tesztköre nem indokolt: nem módosult.

## Források és licenc
Material 3: https://m3.material.io/ ; ikonútmutató: https://developers.google.com/fonts/docs/material_symbols .
A 11 SVG forrása: `https://github.com/google/material-design-icons/tree/master/symbols/web`, a fájlnevek az `assets/` mappában. Google Material Symbols: Apache-2.0, a teljes licenc `assets/LICENSE-Material-Symbols.txt`. Ezt meg kell tartani az átvett ikonok mellett. A CSS és vezérlők saját, Velhez készült starterkód, nem Google-komponensek másolatai. Nincs Material Web futásidejű függőség vagy hálózati betöltés.
