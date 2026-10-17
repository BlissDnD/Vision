"""Builds old-format project fixtures (tests/fixtures/*.json) from the legacy single-file app.
Usage: python3 tools/make-legacy-fixtures.py ../legacy/latomas.v12-egyfajlos.html tests/fixtures
Each fixture = one library recipe added to an empty project, saved with the legacy projectJSON()."""
import sys, asyncio, json, os
from playwright.async_api import async_playwright
CHROME = os.environ.get('LATOMAS_CHROME', '/opt/pw-browsers/chromium')
src, outdir = sys.argv[1], sys.argv[2]
os.makedirs(outdir, exist_ok=True)
JS = r"""
(()=>{const out=[];const cats=Object.keys(LIB);
 for(const c of cats){LIB[c].forEach((it,i)=>{ if(!it.recipe&&!(it.make&&/recipe/i.test(String(it.make))))return; out.push([c,i,it.n||it.name||'']);});}
 return out;})()
"""
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path=CHROME if os.path.exists(CHROME) else None,
                                    args=['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'])
        pg = await b.new_page(viewport={'width': 1400, 'height': 900})
        await pg.goto('file://' + os.path.abspath(src))
        await pg.wait_for_timeout(2500)
        # pick a few representative recipes by name (world, motion text, bento, 3D, camera)
        names = await pg.evaluate("RECIPES.map(r=>r.n)")
        want = [n for n in names if any(k in n for k in ['Bliss', 'Bento', 'Portál', 'Parallax', 'rugós', 'Rugós', 'Éjszakai'])][:6]
        print('recipes:', want)
        for n in want:
            js = """(n)=>{st.layers=[];const c=Object.keys(LIB).find(c=>LIB[c].some(x=>x.name===n));
              const i=LIB[c].findIndex(x=>x.name===n);addFromLib(c,i);st.loop=false;return projectJSON();}"""
            try:
                j = await pg.evaluate(js, n)
            except Exception as e:
                print('skip', n, e); continue
            fn = os.path.join(outdir, 'v12-' + ''.join(ch if ch.isalnum() else '_' for ch in n.lower()) + '.json')
            open(fn, 'w').write(j)
            print('wrote', fn, len(j))
        await b.close()
asyncio.run(main())
