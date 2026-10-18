# Vel design system (TERVEZET – jóváhagyásra vár)

Alap: **Web Awesome** komponensek, sötét téma, a Vel saját színeivel. Ez a fájl a szabály; a kódban a `vel-theme.css` (CSS-változók) lesz belőle. Állapot: tervezet, még nincs kód.
Hangulat: profi alkotóeszköz (mint a Figma / After Effects / Blender), nyugodt sötét felület, kevés szín, a vászon a főszereplő. **Alapelv: a felület csendes, a tartalom színes.**

## 1. Elvek (ezek döntenek vitás esetben)
1. **Ikon először, felirat másodszor.** Az ikon + tooltip (egy mondat) az alap; felirat csak ott, ahol az ikon nem egyértelmű, vagy a Súgó mód be van kapcsolva.
2. **Fokozatos felfedés.** Alapból a 3–5 leggyakoribb vezérlő látszik; a többi „Több” (Advanced) alatt. Egy panel soha nem görgetős falat.
3. **A vezérlő alakja a feladatot követi**, nem a számot (lásd 4. szakasz).
4. **Szín = jelentés**, nem dísz. Egy színhez egy jelentés, mindenhol ugyanaz. A szín mellett mindig ikon is van (színvak-barát).
5. **Egy dolognak egy helye van.** Színek csak a Színek alatt; fény csak a Light módban; maszk mindig ugyanott a Megjelenésben.
6. **Azonnali visszajelzés.** Minden módosítás élőben látszik a vásznon; kártyákon előnézet.
7. **Sűrű, de levegős.** Kompakt sorok (28 px), de a kattintható cél min. 28×28 px, érintésen 40 px.

## 2. Színek (kezdőérték, a téma-fájlban változtatható)
**Felület (sötét)**
| Szerep | Érték |
|---|---|
| Háttér (app) | `#141417` |
| Panel | `#1c1c21` |
| Emelt (kártya, menü) | `#25252c` |
| Vonal / elválasztó | `#34343d` |
| Szöveg | `#ececf1` · halvány `#9a9aa8` · tiltott `#5c5c68` |
| Fókusz-gyűrű | `#8b8bff` (2 px) |

**Kiemelő (interakció): indigó `#6e6cf5`** – kijelölés, aktív csúszka, elsődleges gomb. Ezt látod most is a csúszkákon; marad.

**Kategóriaszínek** (jelölik, hogy mi micsoda: ikon-háttér, fül-csík, könyvtárkártya-szél, réteg-jelvény). Telítettség egységes, hogy egyik se ordítson:
| Kategória | Szín | Alap-ikon |
|---|---|---|
| Effect (Megjelenés/effekt) | kék `#4c9bff` | `wand-magic-sparkles` |
| Shader (3D-re ráhúzható) | ciánkék `#3ccfe0` | `cube` + `wand` |
| Shape (2D/3D forma) | zöld `#4cc38a` | `shapes` |
| Text & Media | borostyán `#f0b44c` | `font` / `image` |
| Motion (mozgás) | narancs `#ff8a4c` | `wave-square` |
| Light (fény) | sárga `#ffd84c` | `lightbulb` |
| Color (szín) | rózsaszín `#f06fb0` | `palette` |
| Mask | lila `#b07cf5` | `circle-half-stroke` |
| Particles / Fluid | türkiz `#38d6b0` | `sparkles` / `droplet` |
| Library (mentett) | szürke-kék `#8a99b3` | `bookmark` |

Állapotszínek: siker `#4cc38a`, figyelmeztetés `#f0b44c`, hiba `#ff6b6b` (csak üzenetekre, nem kategóriára). Kontraszt: szöveg a háttéren ≥ 4.5:1.

## 3. Betű, méret, forma
- Betű: rendszer sans (Inter, ha beágyazzuk); számok **tabular** (ne ugráljanak húzáskor).
- Méretek: szöveg 12 px, címke 11 px (halvány), fejléc 13 px félkövér. Sorköz szoros.
- Lekerekítés: 6 px (vezérlők), 10 px (kártyák, panelek). Árnyék csak lebegő elemeken (menü, tooltip).
- Térköz skála: 4 / 8 / 12 / 16 px. Panelbelső 12 px, sorok között 6 px.
- Mozgás a felületen: 120–180 ms, csak jelentésre (nyit/zár, kijelöl); `prefers-reduced-motion` tisztelve.

## 4. Melyik feladathoz melyik vezérlő
| Feladat | Vezérlő |
|---|---|
| Be/ki (Loop, Körbeér) | **Switch** |
| Két–négy egymást kizáró mód (Tempó: ½× 1× 2×; Hullám: szinusz/háromszög/fűrész/négyszög) | **Szegmentált ikongomb-csoport** (ikon = a hullám rajza) |
| Folytonos érték (Erő, Szórás, Méret) | **Csúszka** számmezővel, ikon a bal oldalon; dupla kattintás = alaphelyzet; húzás közben az érték a kurzornál |
| Irány / szög (szélirány, fény iránya) | **Kör alakú irányválasztó** (nyíl a körben) + szám |
| 2D pozíció / eltolás | **Pad** (kis négyzet, benne pont) |
| Szín | **Színminta (swatch)** → közös választó; átmenet = sáv markerekkel |
| Időzítés / kulcsok / ritmus | **Görbeszerkesztő**: előbb rajzolsz, a rendszer simára alakítja; előre gyártott görbék ikonnal |
| Sok opció közül egy (blend mode, anyag, shader) | **Legördülő előnézettel** (minta a lista elemén) |
| Hosszú lista (könyvtár) | **Ikonrács** + keresés + szűrő-tagek (lásd 5.) |
| Egyszeri művelet | **Ikongomb tooltippel**; veszélyes művelet megerősítéssel |
Az animáció-gomb (◇) minden animálható vezérlő mellett egységes; kattintásra **menü**: Wave (szinusz…) · **Seamless loop** · Keyframes · Link.

## 5. Elrendezés
- **Toolbar (felül):** csak ikonok, kategóriaszínnel csoportosítva (Library · Shapes · Effects · Motion · Light · Mask · Export). A **Light** és **Mask** mód külön kapcsoló: bekapcsolva a jobb panel a fény-/maszk-vezérlőket mutatja.
- **Bal oldal:** Library (felül) és Layers (alul), húzható elválasztó. **Rétegek kategorizáltak**: szín-csík + kategóriaikon + név; csoportok összecsukhatók; jelvények (animált, effekt, maszk, link) ikonnal.
- **Jobb panel (Inspector):** fülek ikonnal + címkével az aktívon: Content · Appearance · Motion. Appearance sorrendje mindig: **Blend mode + Opacity → Color/Gradient overlay → Effects → Mask**. 3D-nél + Material.
- **Library:** fent keresés; alatta nagy kategóriaikonok (Recipes kiemelve külön), alattuk kis tag-chipek csak a kiválasztott kategórián belül. Kártya = előnézet + név; kategóriaszín-csík.
- **Panel-viselkedés:** minden szakasz összecsukható; megjegyzi az állapotát; „Reset” szakaszonként.

## 6. Hozzáférhetőség és nyelv
- Minden ikongombnak `aria-label` és tooltip; a tooltip szövege a `locale.ts` kulcsokból (angol alap).
- Billentyűzetről minden elérhető; látható fókusz.
- Szín sosem az egyetlen jelzés.

## 7. Nyitott kérdések a felhasználónak (jóváhagyáskor)
1. Tetszik az indigó kiemelő + a fenti kategóriaszínek? (Más szín kell az effekthez, mint a kék?)
2. Marad a sötét téma, vagy kell világos is?
3. Ikonkészlet: a Web Awesome/Font Awesome kész ikonjai, vagy saját rajzolt ikonok a Vel-specifikus dolgokra (Körbeér, Szórás)?
