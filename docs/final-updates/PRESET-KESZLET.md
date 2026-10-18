# Preset-készlet: hogyan kérj új presetet a ChatGPT-től (sablon + szabályzat)

Egyszerű menet, nincs kézi fájlírás. A ChatGPT egy JSON-t ír, a Vel ellenőrzi és beteszi a Könyvtárba.

## 1. Egyszeri beállítás (a ChatGPT-ben, új beszélgetés)
1. Vel → **Prompt for ChatGPT** gomb (Project menü / Paste preset ablak; régi nevén „Utasítás ChatGPT-nek"): a vágólapra kerül a teljes, naprakész utasítás (effektlista, paraméterek, formátum, shader-szerződés).
   - Ha a böngészős ChatGPT-ben ez nem fér be, töltsd fel helyette a `docs/VEL-PRESET-FORMATUM.md` fájlt (kb. 23 KB, a build generálja, mindig friss).
2. Közvetlenül utána küldd el a lenti **Szabályzat** blokkot is (ugyanabban a beszélgetésben).

## 2. Minden új presethez (sablon, töltsd ki, küldd el)
```text
Preset: <rövid angol név>
Polc: <Recipes | Shapes | 3D | Appearance(fx) | Motion | Particles | World | Media>
Milyen: <1–2 mondat: hogyan néz ki, mit csinál, hangulat>
Referencia: <link vagy kép, ha van; nem kell pontosan egyezni>
Mozgás: <áll | lassan mozog | loopol (hány mp) | beúszik/kiúszik>
Vezérlők (2–4): <mit szeretnél egy csúszkával állítani, pl. Intensity, Speed, Color>
Méret/hossz: <alapértelmezett: a Velből jövő érték>
```
Elég néhány sort kitölteni, a többit a ChatGPT dönti el.

## 3. Beillesztés
1. A ChatGPT válasza egy ```json blokk. Másold ki.
2. Vel → **Project → Paste preset** → beillesztés. A Vel jelzi, ha valami ismeretlen (az hiányzik, és megmondja, mi), lefordítja a saját shadert, megméri a gépigényt, és betölti.
3. Hiba esetén a Vel hibaüzenetét másold vissza a ChatGPT-nek: kijavítja és újraküldi.
4. Ha jó: **☆ Save as preset**, válaszd ki a polcot. Innentől a Könyvtárban van (böngészőben tárolva; Project menüből fájlba menthető).

## Szabályzat (ezt küldd el az utasítás után, egyszer)
```text
Extra rules for every preset you write for Vel:
1. Reply with exactly ONE json code block per request, nothing else. All "name", slider and macro labels and on-screen text in ENGLISH (the app is English-default). Short, plain names: "Soft Glow", "Film Burn", not "Ultimate Cinematic Bloom v2".
2. Prefer building from existing catalog layers (chain). If a look clearly needs it for better quality, add ONE custom shader layer with named sliders. Never a custom shader for something the catalog already does well.
3. Macros: 2–4, with clear icon-like labels (Intensity, Speed, Scale, Color, Mix). Each macro must visibly change the result from 0 to 1 and 0 must still look good.
4. Loops: if I ask for a loop, make it seamless (the last frame matches the first; use the dur I gave, whole-second keyframes, sin/cos of uTime*2π/dur in shaders).
5. Performance: no heavy loops (≤ 64 iterations per pixel), ≤ 10 layers, no nested raymarching. It must run smoothly at 1080p.
6. Layout and colour: use the palette system (pal) so the user can recolour; do not hard-code a single colour unless the look needs it. Keep text layers inside the frame.
7. Defaults must look finished on a black or transparent background; do not rely on layers that are not in your JSON.
8. Use ONLY effect keys, params and enum values from the catalog. If something is missing, say nothing; approximate with the closest catalog option.
9. When I paste a Vel error, fix exactly that and resend the complete JSON.
```

## Belső szabály a Claude/Codex agenteknek
- A preset-formátum igazsága a `app/src/presetfmt.ts` (a build ebből írja a `docs/VEL-PRESET-FORMATUM.md`-t). Új effekt/paraméter automatikusan bekerül az utasításba; kézzel ne szerkeszd a generált fájlt.
- Beépített (a repóban élő) presetnél: amit lehet, láncból építsünk; jobb eredményért legyen egyedi shader (`docs/final-updates/UI-UPDATE.md` 7d). Új beépített presethez katalóguskulcs + angol megjelenített név (`catalogcopy.ts`) + célzott teszt.
- A felhasználó saját presetjei a böngészőben vannak (IndexedDB). Ha a ChatGPT-vel készült preset beépítésre érdemes, a Project menüből exportált könyvtárfájlból (`{app:'vel', kind:'userlib'}`) lehet átvenni.
