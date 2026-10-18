# WA1 – Web Awesome alap és közös vezérlők (mérföldkő-terv, jóváhagyásra vár)

> **Állapot: megvalósítva** a `claude/english-wa1-2419a5` ágon (0.49.0-wa1), felhasználói próba hátra. Az angol fordítás előbb lezárult, ezért a függőségi javaslat teljesült.

## Mit tud majd a felhasználó
1. Megnyitja a buildet: az egész felület az új sötét téma (`vel-theme.css`, a DESIGN-SYSTEM.md színeivel) – egységes gombok, menük, tooltipek.
2. A **toolbar ikonos**, a kategóriák színnel és általános ikonnal jelölve (effekt = kék stb.); ráviszi az egeret: egy mondatos tooltip.
3. A **Mozgás kártyán** a Tempó, Erő, Hullám (szinusz/háromszög/fűrész/négyszög) és Ritmus **ikonos gombcsoport** szöveg helyett; a Loop/Körbeér **kapcsoló**; felirat nem csonkul le.
4. Az **animálás (◇) gomb** minden vezérlőnél egyforma, kattintásra menü: Wave · **Seamless loop** · Keyframes · Link (a Seamless loop a meglévő „Körbeér” motort használja; ahol még nincs, szürkén jelzi).
5. Minden csúszkasor egységes: ikon + csúszka + szám, dupla kattintás = alaphelyzet.

## Mit építek pontosan
- Web Awesome telepítése (csak a használt komponensek, import komponensenként), `vel-theme.css` a DESIGN-SYSTEM.md értékeivel, kategóriaszín-változók.
- Közös komponensek a kódban (`src/ui/`): ikongomb tooltippel, szegmentált ikoncsoport, kapcsoló, csúszkasor, animálás-menü.
- Átállítva: toolbar és a Mozgás kártya (Tempó/Erő/Hullám/Ritmus/Loop); a többi panel csak megörökli a témát.
- Szövegek a `locale.ts` kulcsokból (tooltipek is), régi projektek és azonosítók változatlanok.

## Amit NEM építek ebben a szeletben
Könyvtár átszervezése, Light mód, maszkolás, Megjelenés-fül blend/overlay, 3D anyagszerkesztő, rétegek kategorizálása, görbeszerkesztő, körös irányválasztó, ikonok saját rajzolása (kész ikonokat használok). Ezek a következő szeletek (WA2…). A többi panel még a régi elrendezés az új témával.

## Függőség (a felhasználó dönt)
Az angol-fordítás session ugyanezeket a fájlokat érinti (`locale.ts`, panelek). **Javaslat: előbb ennek a befejezése és összefésülése, utána WA1**, különben dupla munka és ütközés. (Az angol branch: `claude/nifty-shtern-5f86d9`, még nincs ide fésülve; a teljes teszt eredménye ott még nincs meg.)

## Hogyan próbáljuk ki (3–4 lépés + mérés)
1. Nyisd meg `app/dist/index.html`: az új téma látszik; a toolbar ikonos, tooltipek jönnek.
2. Mozgás fül → egy mozgáskártya: kapcsold a Tempót ½×/1×/2×, a Hullámot, a Loopot; nincs levágott felirat keskeny panelen sem.
3. Kattints egy ◇ gombra: menü Wave/Seamless loop/Keyframes/Link.
4. Nyisd meg `dist/index.html`-t dupla kattintással (`file://`): minden betölt.
- Mérés: a build mérete előtte/utána (cél: ≤ +300 KB tömörítve, ha több, szólok), typecheck 0 hiba, célzott teszt a közös komponensekre + régi projekt megnyitása, teljes tesztkör egyszer a végén.

## Hátralévő lista változása
Kész lesz: alap téma + közös vezérlők. Marad sorrendben: WA2 Könyvtár + Rétegek · WA3 Megjelenés (blend/overlay) + Maszk · WA4 Light mód + 3D anyag · WA5 Animációk (előnézet, loop, élő mód) + görbeszerkesztő.

## Kockázat
A Web Awesome `file://` alól és egyetlen HTML-ben nem biztos, hogy működik – ezt az első lépésben ellenőrzöm; ha nem, a buildbe ágyazom, vagy szólok, mielőtt továbblépek.
