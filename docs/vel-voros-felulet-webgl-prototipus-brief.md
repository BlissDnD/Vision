# Vel – vörös ívelt felület, első WebGL-látványpróba

## Cél

A mellékelt referenciakép vizuális logikáját megközelítő, **valódi, interaktív WebGL2 3D jelenet** külön prototípusban. Ez látvány- és teljesítménykísérlet, nem a Vel meglévő kódjának átírása és nem pontos képklón ígérete.

## Agentnek adható feladat

> Készíts egy futtatható, önálló WebGL2-prototípust a mellékelt referenciakép alapján. Használhatsz Three.js-t vagy közvetlen WebGL2-t; indokold röviden a választást. A jelenet valódi 3D geometriából álljon, ne egy háttérkép, videó, AI-generált kép vagy 2D CSS-illúzió legyen.
>
> A fő forma egy szerkeszthető 3D gerincgörbéből generált, széles, vékony, ívelt felület legyen. A gerinc pontjai, a szélességprofil, taper, vastagság és a csavarodás módosítható legyen. Építs hozzá fényes mélyvörös lakk/fém anyagot, világos stúdiókörnyezetet, hosszú világos fénycsíkokat, erős középső/hátsó fényt, és vörös formát tükröző padlót. A padlóval való találkozást külön, állítható geometriai/lekerekített vagy lágy összeolvadási próbaként készítsd; ha a teljes összeolvadás nem fér bele, jelöld világosan, és ne rejtsd el utómunkával. Használj gondos színkezelést, tónuskezelést és élsimítást. A glow csak finom utómunka legyen.
>
> Legyen egy egyszerű kezelőpanel legfeljebb nyolc fő vezérlővel: gerincpontok vagy ív, szélesség/taper, vastagság, vörös anyag érdessége, lakkréteg/fémesség, fénycsík helye/mérete, padlóreflexió, expozíció. A kamerát lehessen forgatni, hogy lássuk: valódi térbeli forma. A változtatásokra a fény és a tükörkép is reagáljon. Készíts alapbeállítást, amely kompozícióban és hangulatban a referenciához közelít, majd egy eltérő kameraállású képet is ugyanerről a jelenetről.
>
> A prototípust a Vel projektjétől elkülönített mappába tedd; a meglévő alkalmazást ne módosítsd. Indítsd el helyben, javítsd a konzolhibákat, készíts két képernyőképet és egy rövid mérési jegyzetet az előnézeti felbontásról, mért FPS-ről/célgépről és a legdrágább látványelemről. Írd le őszintén, mi felel meg a referenciának, mi csak közelítés, és pontosan mi hiányzik az azonos minőséghez. A forrás legyen tovább szerkeszthető.

## Az agentnek átadandó bemenet

1. A referenciakép tényleges csatolmányként, nem csak „az első kép” szöveges hivatkozásként.
2. A fenti brief. Ha a feladat ugyanebben a helyi projektben fut, a prototípus helye: `muchdesigner/prototypes/red-ribbon-webgl/`.
3. Célgép és böngésző, ha különösen fontos a valós idejű sebesség; enélkül a mért FPS csak az agent futtatási környezetére vonatkozik.

## Sikerfeltételek

- A kamera forgatásával a forma és a padló valódi 3D jelenetként viselkedik.
- A gerinc/taper állítása a geometriát módosítja; a normálok, csillanások és tükörkép követik.
- A vörös anyag, a nagy fehér fényformák és a padló tükröződése együtt adják a látványt; egyik sem előre belesütött kép.
- Az agent képernyőképpel, futó kóddal és hiánylistával igazolja az eredményt. Ha a képre nem hasonlít eléggé, iterál a formán, a világításon és az anyagon, nem csak szűrőket halmoz.

## Második lépcső

Csak a látványpróba után kell összevetni a Vel jelenlegi saját WebGL2/SDF renderágával, és eldönteni, hogy az új forma mesh-ként, SDF-ként vagy hibrid úton integrálható. A prototípus önmagában nem bizonyítja, hogy a teljes Velben ugyanolyan gyors lesz.
