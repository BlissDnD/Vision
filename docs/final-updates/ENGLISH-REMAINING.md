# Angol lokalizáció – mi van kész, mi hiányzik még (2026-10-18)

A `claude/nifty-shtern-5f86d9` ág három commitja be van fésülve (receptek/könyvtár; mozgás, koreográfia, átadás, random, változatok, kapcsolatok, útvonal, kamera, fény, paletta, réteg; maradék panelek, jelzések, koppintás, gesztus, állapot). Plusz itt: Gerinc szekció és gombjai, Kapcsolat-összefoglalók.

## Kész
- Felső sáv, dialógusok, gyorsbillentyűk, Súgó-témák, 128 statikus tooltip-leírás.
- 300 könyvtári elem angol megjelenítő szövege (a mentett azonosítók változatlanok).
- 82 Megjelenés-típus és 8 mozgástípus név/leírás/opció (`effectcopy.ts`, `motioncopy.ts`).
- Export, beállítások, presetek, jelenetek, Mozgás fül, idővonal, Random, Változatok, Kapcsolatok, Kamera, Fény, Paletta, Koreográfia, Mozgás átadása.

## Hiányzik még (mért darabszám: 1273 magyar szöveg-literál a `src/`-ben)
| Hely | Darab | Mi ez |
|---|---|---|
| `src/effects/filters.ts` | 201 | Megjelenés-paraméterek **belső** nevei és opciói |
| `src/library.ts` | 185 | könyvtári bejegyzések eredeti (örökölt) nevei |
| `src/effects/objects3d.ts` | 133 | 3D paraméternevek |
| `src/effects/particles.ts` | 123 | részecske-paraméternevek |
| `src/effects/generators.ts` | 118 | forrás-paraméternevek |
| további `src/effects/*.ts` | ~330 | szöveg, világ, folyadék, média, motion design |
| `src/recipes.ts` | 45 | recept-leírások |
| egyéb (`random.ts`, `catalogcopy.ts`, `effectcopy.ts` …) | ~140 | vegyes |

Fontos: a `filters.ts` / `objects3d.ts` stb. paraméternevei **nem jelennek meg közvetlenül** – az `effectcopy.ts` angol fordítását használja az Inspector. Ahol nincs bejegyzés az `effectcopy`-ban, ott átüt a magyar név. Ezt elemenként kell végigmenni (rendered-app audit, nem forrás-grep).

### Két külön, még nyitott pont a specből (`docs/spec/VEL-ENGLISH-DEFAULT-LOCALIZATION.md`)
1. **Dinamikus tooltipek**: a futásidőben összeállított címkék (pl. „3 loops / 10 s”, Kapcsolat-összefoglalók, hibaüzenetek, toastok) nem a `locale.ts` kulcsokból jönnek, hanem beégetett sablonokból. Ezeket kulcsokra kell vinni.
2. **`lang="en"` kapu**: az `app/index.html` és a build `<html lang="hu">` marad, amíg bármelyik normál munkafolyamatban magyar beépített szöveg látszik (a spec 5. pontja: „Quality gate”). Addig a dokumentum nyelve nem váltható.

## Teszt-tanulság
A fordítás nyolc tesztet bukott el, mind magyar szelektor miatt (`Új pont utána`, `Elfogadás`, `Jelenetfény`, `Napfény`, `Lágy`, `ív`, `3 kör / 10 mp`, `Vektoranimáció importálása`, Loop-gomb `ki`/`be`). Mind angol szövegre javítva. Tanulság: a tesztek **ne a megjelenő szövegre** szelektáljanak, hanem id/class/data-attribútumra; a következő fordítási szeletnél érdemes ezt lépésenként átvinni.
