# Vel — Lottie, Unsplash, Poly Haven, Imgur és GIPHY: import-előkészítés

Állapot: kutatott implementációs brief, **nem kész funkció és nem jóváhagyott mérföldkő**. A Vel működő kódját ez a dokumentum nem módosítja. Claude az aktuális `HANDOFF.md`-ből induljon, és az egyes szeletek előtt a `CLAUDE.md` szerinti konkrét javaslatot adja a felhasználónak.

## Termékdöntés

Nem négy önálló, élő URL-es effekt kell, hanem egy közös **Külső média beillesztése** útvonal a Vel saját könyvtárához. A felhasználó keres vagy fájlt ad hozzá, előnézetet kap, elhelyezi a vásznon, majd a rétegre ráhúzhat Megjelenést, Mozgást és Kapcsolatot. A forrás, szerző, felhasználási feltétel és eredeti azonosító maradjon az asset adatai közt. A külső URL csak felfedezésre és letöltésre szolgáljon ott, ahol a szolgáltatás ezt engedi; a Vel projektjének megnyitása és az export ne függjön egy változó távoli URL-től.

| Forrás | Velbeli hely | Első valóban hasznos szelet | Prioritás |
|---|---|---|---|
| Lottie JSON | Média → Vektoranimáció | Saját `.json` feltöltés, rétegként elhelyezés, idővonal-szinkron, sebesség/Loop, WebGL-kompozit | 1 |
| Poly Haven | Anyagok/Textúrák → PBR-készlet; később Ég/HDRI | Egy kurált CC0 készlet importja, albedo/normal/roughness/metalness egy anyagként | 2, a 3D anyagút érettsége után |
| Unsplash | Média → Fotókeresés | Keresés és képkiválasztás hivatalos API-val, fotóréteg, szerzői adat | 3, az API-kulcs és projektmédia-tárolás tisztázása után |
| Imgur GIF / MP4 | Média → Mozgó kép | Elsőként saját vagy jogszerűen használható `.gif`/`.mp4` fájl rétegként; utána opcionális Imgur-linkfeloldás és forrásmetaadat | helyi import a videómérföldkő része; Imgur kereső később |
| GIPHY | Média → Mozgó kép keresése | Egyelőre csak önálló kísérlet; a GIPHY API-val szolgáltatott tartalom cache-szabályai ütközhetnek az offline projekttel/exporttal | halasztva |

## A bemásolt javaslat szükséges pontosításai

- **Lottie:** a `lottie-web` SVG, Canvas és HTML renderert tud, nem közvetlen WebGL2 renderert. A Vel számára az első adapter a Canvas kimenetből frissíthet WebGL textúrát; SVG fallback kellhet bizonyos fájlokhoz, mert a Canvas renderer nem támogat minden Lottie-funkciót. A közösségi „free” elemnél az **adott asset licencét** ellenőrizd. A LottieFiles közvetlen asset URL-je nem helyettesíti a Velbe mentett, exportnál is elérhető fájlt.
- **Unsplash:** ne szerkessz kézzel `unsplash.com[ID]` URL-t és ne alapozz a régi Source-véletlen URL-re. A hivatalos `api.unsplash.com/search/photos` vagy `/photos/random` végpont adja a fotóadatot és a `photo.urls.*` címet. A képméretezésnél az `ixid` maradjon meg. Az API-képek kijelzését, szerzői hivatkozását és a kiválasztáskor küldendő `download_location` eseményt az API irányelvei szerint kezeld. Az API hotlink-előírása és a Vel offline hordozható projektje között külön termék-/jogi döntés kell; ne ígérj automatikus beágyazást ellenőrzés nélkül.
- **Poly Haven:** az assetek CC0-k, de a **live API** külön feltételeket kér, köztük a Poly Haven megnevezését és egyedi User-Agentet. Böngészőből ezt a fejlécet nem lehet megbízhatóan beállítani; első körben hivatalosan letöltött, kurált assetcsomagot vagy fejlesztői/import segédprogramot használj. A hivatalos asset- és fájlvégpontokat használd; GitHub-tükör/jsDelivr nem CORS-megoldás és nem megbízható eredet.
- **GIPHY:** az API MP4/WebP változatokat kínál, de „Powered by GIPHY” jelölést kér, és általában tiltja a média-URL-ek vagy fájlok cache-elését, illetve proxyzását külön jóváhagyás nélkül. Emiatt ne építs rá automatikus projektbe mentést és 4K exportot. A felhasználó saját, külön jogon birtokolt MP4/WebM fájljának importja másik, már tervezett videómérföldkő.
- **Imgur:** az API képmodellje az animált GIF-hez adhat `mp4`, `gifv`, `looping` és méret mezőket. A `.gifv` Imgur-megjelenítési forma, ne kezeld közvetlenül videódekóder-bemenetként; az `mp4` vagy egy felhasználó által adott GIF/MP4 a hasznos média. A nyilvános Imgur-poszt nem általános stock-licenc: az eredeti feltöltő jogai megmaradnak. Az Imgur API kereskedelmi használatához az aktuális dokumentáció külön regisztrációt és RapidAPI-kapcsolatot ír elő. Az Imgur nem CDN a Vel médiájához, ezért a projekt ne maradjon puszta hotlink. Az első szelet **fájlból import**, a linkes keresés/átvétel csak forrás- és jogellenőrzés után.

## Adapterhatár és adatok

Az import réteg ugyanazt a belső médiaazonosítót adja a renderelőnek, akár helyi fájlból, akár megengedett távoli választásból jön az asset. A projekt rétege stabil asset ID-t tartson. **Első Lottie-szeletben kivételként** a legfeljebb 2 MB-os, ellenőrzött vektor-JSON beágyazható a hordozható projektfájlba egy külön `vectorAssets` mezőben; ez nem keverhető össze a jelenlegi kép-`assets` térképpel. Nagy fotó, PBR-map, GIF/MP4 esetén bináris tároló és hordozható projektcsomag/ZIP kell, külön migrációval és hiányzó-média jelzéssel. A jelenlegi `assets` és `loadAsset` útvonal képet adat-URL-ként kezel; a `modals.ts` jelenleg legfeljebb 2048 px-re méretezi az importált képet. Ez **nem elég** 4K fotóhoz vagy több nagy PBR-maphez. A meglévő projektformátum és régi fájlok migrációja maradjon működőképes.

Javasolt közös rekord (sémaötlet, nem kész kód): `id`, `kind` (`image`, `lottie`, `texture-set`, `video`), `origin`, `sourceId`, `sourceUrl`, `author`, `authorUrl`, `license`, `licenseUrl`, `width`, `height`, `bytes`, `hash`, `localBlobKey`, `createdAt`. A réteg csak az `id`-re hivatkozzon. A PBR-készlet külön map-azonosítókat tartson: base color sRGB, normal/roughness/metalness lineáris; a mapokat ne egyetlen „képként” olvaszd össze.

## Biztonsági minimum — minden külső média nem megbízható bemenet

Az import előbb **ellenőriz**, majd csak a jóváhagyott fájlt teszi a könyvtárba. A felhasználónak érthető hibát mutasson, és hibás import után a jelenet maradjon változatlan; a művelet visszavonható legyen.

- **Formátum és erőforrás:** MIME-ot a tényleges fájltartalommal is ellenőrizni kell, nem elég a kiterjesztés. Legyen korlát a tömörített és dekódolt bájtméretre, pixelméretre, videóhosszra, GIF/Lottie képkockaszámra, Lottie réteg- és alakzatszámra, textúramapok számára. A korlátot túllépő fájl ne fagyassza le az editort; lehetőleg külön workerben dolgozd fel, megszakíthatóan.
- **Lottie és SVG:** a JSON adat, nem futtatható kód. Ne engedj importból `eval`-t, önkényes scriptet vagy korlátlan expression-futtatást. Külső kép/font URL-je csak kifejezett, látható jóváhagyással töltődjön; első szeletben inkább utasítsd el és mondd meg, melyik hiányzik. Ha SVG fallback kell, ne injektáld az idegen SVG-t ellenőrzés nélkül a DOM-ba; tisztítás és biztonságos rasterizálás szükséges.
- **URL-ek:** csak `https:` és ismert szolgáltatás hivatalos hostja; `javascript:`, `data:`, `file:`, helyi/intranet cím és ismeretlen átirányítás nem kerülhet a távoli beolvasóba. Ha később szerveroldali lekérés lesz, az átirányítás minden lépésén újra ellenőrizni kell a célt, hogy belső címre ne lehessen kérést küldeni. Távoli HTML-oldalt vagy embed-kódot ne kezelj médiaként.
- **Böngésző és WebGL:** csak olvasható, megfelelő CORS-jogosultságú kép/videó kerülhet a rajzolóvászonba; a nem olvasható forrást jelöld hibásnak, ne rontsa el a teljes vászon exportját. Objektum-URL-eket és GPU-textúrákat felszabadításkor töröld. Egy-egy asset memóriahasználatát és 4K feltöltési költségét mérd.
- **Adatok és kulcsok:** API-kulcs, token, privát URL nem kerülhet projektfájlba, naplóba vagy az önálló HTML-be. A cím, szerző, leírás és keresési találat szövegként jelenjen meg, ne HTML-ként. Fájlnév ne dönthessen fájlútvonalról; a mentett rekord saját generált ID-t kapjon. A tartalom hash-e és forrásmetaadata segít az újranyitás és cserék felismerésében.
- **Próba:** hibás/óriási Lottie, megtévesztő `.png` nevű más fájl, külső erőforrást kérő animáció, CORS-hibás kép, lejárt/törölt Imgur-link, ismeretlen átirányítás és sérült videó. Mindnél maradjon használható az editor, ne szivárogjon kulcs, és az export vagy teljesüljön, vagy pontos hibával álljon meg.

### Lottie első adaptere — konkrét szerződés

Az első szelethez előkészített, önálló kód: [`vel-media-import-core-prototipus.mjs`](vel-media-import-core-prototipus.mjs), próba: [`vel-media-import-core-prototipus.test.mjs`](vel-media-import-core-prototipus.test.mjs). Ez már ellenőrzi a szándékosan szűk, csak vektoros Lottie-részhalmazt (méret, mélység, csomópontszám, kép/szöveg/font/expression tiltás **előkompozícióban is**), a jelenetidőből számolja a frame-et, API-hívás nélkül felismeri a megengedett Imgur-linkformákat, és a különböző hosszúságú GIF-képkockákhoz is tiszta időmintát ad. `node --test docs/spec/vel-media-import-core-prototipus.test.mjs` — 5 célzott próba zöld (2026-10-18). **Nem állítja**, hogy minden érvényes Lottie-t támogat, GIF-et dekódol, vagy hogy egy önmagában lefutó ellenőrző biztonsági auditot helyettesít. A Velbe még nincs bekötve.

1. Helyi JSON betöltésekor formátum- és erőforráskorlát ellenőrzés: maximális fájlméret, külső képek/fontok jelenléte, frame range, fps, méretek, nem támogatott Lottie-funkciók. A hiba legyen látható a felhasználónak.
2. Első választás a `lottie-web/build/player/lottie_light_canvas` build: `autoplay:false`, `loop:false`, `renderer:'canvas'`, `rendererSettings:{runExpressions:false}`; használható rajzolóvászon/kontekstus esetén azt add át. A render időpontja kizárólag a Vel jelenetidejéből jöjjön: `sampleLottieFrame(meta, sceneTime, {layerStart,speed,loop})`, majd `goToAndStop(frame,true)`. Ne fusson mellette önálló `requestAnimationFrame`-óra. `null` minta = a réteg még nem kezdődött el.
3. A Canvas csak akkor frissítsen GPU-textúrát, ha a mintavételezett képkocka vagy az asset változott. Exportkor tetszőleges időpontban ugyanazt a képet kell adnia; első betöltésnél és képek/fontoknál várni kell a readinessre. A rétegnek ugyanúgy mennie kell csoporttal, maszkkal, Megjelenéssel, undo/redo-val és mentés–újranyitással.
4. A canvas-rendererrel rosszul megjelenő Lottie esetén a fallback legyen jelzett SVG→raster út, vagy a konkrét fájl támogatásának elutasítása. Ne állítsd, hogy minden Lottie szerkeszthető vektorelemként a Velben: az első szelet animált **médiumréteg**.

**Bekötési térkép a jelenlegi kódhoz:** `app/src/modals.ts` (`#fileImg`) mintája mutatja a fájlválasztás UX-ét, de a Lottie-nak saját bemenete és validátora kell; `app/src/effects/media.ts` kapjon új `kind:'image'` jellegű médiumréteg-definíciót csak akkor, ha a meglévő render szerződéssel valóban illik; `app/src/text.ts` `mediaFor(L,t)` adhatja a Canvas→WebGL textúrát a `render.ts`-nek, de a jelenlegi `loadAsset` kizárólag képet ért; `app/src/history.ts` `projectJSON`/`applyProject` és `app/src/migrate.ts` gondoskodjon a külön `vectorAssets` mentéséről/megnyitásáról, a régi projektek érintetlenül hagyásával. Az `app/src/userlib.ts` saját polca használható később, de a Lottie első működő rétegéhez **nem előfeltétel** a teljes könyvtárintegráció. A `renderScene(...,t,...)` és `mediaFor(L,t)` már kap jelenetidőt; ehhez illeszkedjen az adapter. Az export és seek ugyanazon mintavételezőn menjen át.

**Kritikus részlet:** a mostani kép-assetek az `assets` objektumban adat-URL-ek, és `applyProject` minden ilyen elemre `loadAsset`-et hív. A vektor-JSON-t ne tedd ide ellenőrizetlenül, mert a képként való betöltés félremegy. A kis Lottie-k külön `vectorAssets` térképe belső, beágyazott JSON-szöveg legyen; csak a kiválasztott rétegekhez tartozó rekord kerüljön a projektfájlba. Az undo a réteg elhelyezését vonja vissza, az assettároló használaton kívüli adatait később gyűjtheti. A nagy média ZIP-csomagja külön szelet.

**Kódellenőrzés után pontosítva:** a `presets.ts` jelenlegi globális `.json`-ejtéskezelője a Lottie-t is presetként próbálná megnyitni; a Lottie-felismerésnek a preset-ág előtt kell állnia. A `history.ts` automatikus mentése kvótahibánál `assets:{}` tartalékot ír; Lottie esetén ez nem lehet néma médiavesztés. A hordozható projektfájlba kerülő kis JSON mellett a böngészős autosave-hez külön tartós médiarekord és látható írási hiba kell. A média saját Loopja nem a már meglévő kulcsanimáció-Loop. A képkockánként számolt MP4-export alkalmas pontos összehasonlításra; a `captureStream`/MediaRecorder-ág valós idejű felvétel, ezért nem tekinthető ugyanilyen determinisztikus exportnak. A részletes ellenőrzés: [`LOTTIE-ELSO-SZELET-ELLENORZES.md`](../javaslatok/LOTTIE-ELSO-SZELET-ELLENORZES.md).

### Poly Haven első anyagkészlete

Válassz három, látványban eltérő CC0 PBR anyagot (például fém, kő, fa), mindegyikhez az eredeti Poly Haven assetazonosítóval. Egy húzással 3D tárgyra lehessen tenni a készletet, és legyen skála, forgatás, érdesség/metalness finomhangolás. A jelenetfényre reagáló normal map és a fényes felületek látványa a fő próba. Előnézetben kisebb map, exportnál nagyobb map csak akkor, ha a projektben tényleg rendelkezésre áll; a böngésző GPU memóriahatárát mérni kell. HDRI/skybox külön, későbbi szelet.

### Unsplash későbbi keresője

A kereső kártyákon szerző és Unsplash-forrás látszik. Kiválasztás után a fotó saját Kép-réteg legyen, nem véletlenszerűen cserélődő URL. A 4K használathoz a fotó eredeti méretét és az exporthoz választott változatot külön kezeld. Az API-kulcsot ne égesd bele az önálló HTML-buildbe; ehhez saját kulcsbeviteli vagy kiszolgálóoldali megoldásról kell dönteni. A hivatalos API-feltételek miatt először egy jogilag/technikailag tiszta prototípus és két kiválasztott kép mentés–újranyitás/export próbája kell.

### Imgur GIF-ek és a Vel saját mozgóképrétege

Első művelet: a felhasználó saját `.gif` vagy `.mp4` fájlt húz a vászonra; a Vel felismeri a mozgóképet, rétegként helyezi el, és a Sávokon kezdet/vég, Loop, sebesség, vágás, átlátszóság és Megjelenések állíthatók. GIF-nél egyszer dekódolt képkockák vagy helyi videóváltozat használható a dekódolási költség és memóriahatár alapján; a változó késleltetésű képkockákhoz az előkészített `createTimedFrameIndex` egyszeri indexelés + `sampleTimedFrames` gyors mintavétel használható. Ez **nem GIF-dekóder**. MP4-nél a meglévő többvideós terv proxy/seek stratégiáját kövesd. Az export képkockái a Vel jelenetidejéből jöjjenek, ne a böngésző videóelemének szabadon futó órájából. Az Imgur-link beillesztése egy külön későbbi adapter: API-val azonosító/forrás/MP4 ellenőrzés, jogosultság és hozzáférhetőség jelzése, és csak ezután projektbe helyezés. A forrás URL-je és feltétele maradjon látható az assetnél.

## Rövid próba és teljesítménykapu

- **Lottie:** egy áttetsző ikon és egy bonyolultabb karakter a vásznon; tetszőleges időpontra ugrás oda-vissza; fotó és 3D tárgy fölé rétegezés; mentés–újranyitás; MP4 export ugyanazzal a frame-mel. Mérd a dekódolás/rajzolás, GPU-feltöltés és 4K export idejét külön.
- **PBR:** ugyanaz a fém/kő/fa tárgy a globális fény kapcsolásával és eltérő fényirányoknál; GPU memória, első betöltés és 4K frame-idő. A textúra maradjon a tárgyon projekt újranyitása után.
- **Unsplash:** két keresés, egy kiválasztás, forrásmegjelenítés, fotóréteg elhelyezése; API-esemény és hozzáférési hiba látható kezelése; offline projekt viselkedése előre tisztázva.
- **Imgur/mozgó kép:** saját rövid GIF és MP4 fájl importja; visszatekerés és ismétlés; más réteggel együtt lejátszás; újranyitás és 1080p/4K export. Imgur-linkkel csak a külön API-szelet után próba, a felhasználási jog ellenőrzésével.
- **GIPHY:** csak külön, jóváhagyott API/licenc-prototípus után kerülhet a Vel könyvtárába. Enélkül a saját MP4/WebM import legyen a következő lépés a videótervben.

## Ellenőrzött elsődleges források

- [lottie-web betöltési opciók](https://github.com/airbnb/lottie-web/wiki/loadAnimation-options), [renderer-beállítások](https://github.com/airbnb/lottie-web/wiki/Renderer-Settings), [LottieFiles licenc](https://lottiefiles.com/page/license)
- [Unsplash API dokumentáció](https://unsplash.com/documentation), [API attribúció](https://help.unsplash.com/en/articles/2511315-guideline-attribution), [letöltési esemény](https://help.unsplash.com/en/articles/2511258-guideline-triggering-a-download)
- [Poly Haven API és feltételek](https://polyhaven.com/our-api), [CC0 assetlicenc](https://polyhaven.com/license)
- [GIPHY API dokumentáció és korlátozások](https://developers.giphy.com/docs/api/)
- [Imgur API és kereskedelmi hozzáférés](https://apidocs.imgur.com/), [animált képmodell/MP4 mező](https://api.imgur.com/models/image), [Imgur beágyazási és szerzői jogi tájékoztató](https://help.imgur.com/hc/en-us/articles/26516808982299-Embed-Unit)
