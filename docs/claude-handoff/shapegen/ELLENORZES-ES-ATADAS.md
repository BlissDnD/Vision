# ShapeGen terv – ellenőrzés és átadás

## Mi készült most?

A felhasználó integrációs terve, a nyolc UX-kiegészítéssel. Négy fő generátor és minden dokumentált segédeszköz funkciómegőrzési mátrixa;8 végrehajtási kártya; cél/preview/undo/Library/adatszerződés. A csatolt FORM-átadó változatlan referencia-másolata.

Nem módosult alkalmazás-runtime vagy build. Nem indult az önálló FORM app, nincs webpublikálás vagy jogosultságváltoztatás. A csatolmányban szereplő tesztparancsokat nem futtattuk le. Nem állítjuk, hogy a FORM forráskódot vagy a vizuális paritást megvizsgáltuk.

## A megvalósítás elfogadási rendje

1. SG-00 rögzíti a tényleges eredeti kódot, licenceket, manifestet és referenciaállapotokat.
2. Minden új képlethez/rajzművelethez célzott teszt; minden befogadó slothoz tényleges Vel hozzáadás/preview/apply/cancel/undo próba.
3. Újrahasznált Vel-rendszernél a meglévő tesztek + új képességre célzott kiegészítés. A legutóbbi HANDOFF/tesztek számát ellenőrizni kell, mert a fejlesztés közben is változik.
4. Renderazonosság: ugyanaz a generatorverzió/seed/méret/paraméter/time/interaction; forrás vs port kép. Scene vs alkalmazott scene azonos képkockán, vágással/effektekkel/kamerával.
5. Library/file újranyitás tiszta böngészőállapotban; minden rajz/Lottie/motívum függőség megmarad. Hibás tárolás és részleges apply esetén a szerződés szerinti visszajelzés.
6. Split/rejtett tabs/hat variation/ikonkereső memória és frame-idő; mért célgépes1080p/4K, source- és Vel-korlátok külön. Nincs korlátlan ZIP vagy videóígéret.
7. A 8 SG task és89 mátrixsor nem89 automatikus tesztet jelent. A bizonyítékot funkciócsaládonként és kockázat szerint kell felvenni; nem implementációt tükröző teszttömeg.
8. A projekt szabályai szerint az élő Vel-próbát Miksa végzi. Fejlesztői headless teszt elkülönítve; a teljes kört az integrátor egyszer záráskor futtatja, nem minden worker.

## Rövid felhasználói próba a vertikális első szelet végén

1. Nyisd meg a ShapeGent önállóan; készíts egy alkotást; egy kattintással mentsd a Libraryba, majd Edit in ShapeGen.
2. Egy tényleges támogatott recept-/elemmezőnél Add from Gen; állíts Solo/Scene/Split nézetben, majd Alkalmazás.
3. Undo, újrapróba és Mégse; az eredeti jelenet visszaáll, kamera/maszk/effektek nem változnak.
4. Ugyanazt az alkotást három helyen használva szerkeszd csak az egyiket; mentés és projekt újranyitás.

Ez az első átjárhatóságot bizonyítja, nem a teljes v8 port lezárását. A teljes elfogadásnál a rajz/geometry/asset/export családok és minden eredeti mód is kipróbálandó.

## Tervcsomag konzisztenciája

A helyi ellenőrzés a 89 funkciósort,8 taskot, hivatkozásokat, ciklusmentes függőségeket, megőrzött forrás-átadó hash-t és a kért 8 UX-pont jelenlétét vizsgálja. Ez dokumentumellenőrzés, nem app-teszt. Eredmény: `data/plan-validation.json`.

A külön ShapeGen ZIP a tervet és a csatolt átadót viszi; FORM-forráskódot, ikonkönyvtárat vagy új alkalmazást nem tartalmaz. A régebbi teljes Vel-handoff ZIP történeti pillanatképét nem cseréljük csendben a közben megváltozott0.43-as alkalmazásra.
