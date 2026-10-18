"""Headless test runner (Playwright + Chromium/SwiftShader).
Usage: python3 tests/run.py dist/latomas.test.html tests/<test>.js [screenshot-js ...]
The test JS is evaluated inside `with(window.__L){...}` so every module export is in scope;
former top-level `let` state lives on `R` (e.g. R.time, R.selId, R.main)."""
import sys, asyncio, json, os
from playwright.async_api import async_playwright
CHROME=os.environ.get('LATOMAS_CHROME','/opt/pw-browsers/chromium')
src=sys.argv[1]; js=open(sys.argv[2]).read(); shots=sys.argv[3:]
if '/*FIXTURES*/' in js:  # inline tests/fixtures/*.json as an object {filename: project}
    import glob
    fx={os.path.basename(f):json.load(open(f)) for f in sorted(glob.glob(os.path.join(os.path.dirname(os.path.abspath(__file__)),'fixtures','*.json')))}
    js=js.replace('/*FIXTURES*/',json.dumps(fx,ensure_ascii=False))
wrap=lambda code:'(()=>{with(window.__L){return eval('+json.dumps(code)+');}})()'
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(executable_path=CHROME if os.path.exists(CHROME) else None,args=['--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist','--autoplay-policy=no-user-gesture-required'])
        pg=await b.new_page(viewport={'width':1400,'height':900},color_scheme='dark')
        logs=[]
        pg.on('console',lambda m: logs.append(f'[{m.type}] {m.text}'))
        pg.on('pageerror',lambda e: logs.append(f'[pageerror] {e}'))
        html=open(src).read()
        page_html='<!doctype html><html><head><meta charset=utf-8><style>[hidden]{display:none!important}</style></head><body>'+html+'</body></html>'
        # A local HTTP origin enables IndexedDB and localStorage, which set_content(about:blank) blocks.
        await pg.route('http://127.0.0.1:5189/',lambda route: route.fulfill(body=page_html,content_type='text/html'))
        await pg.goto('http://127.0.0.1:5189/',wait_until='domcontentloaded')
        await pg.wait_for_timeout(1500)
        r=await pg.evaluate(wrap(js))
        print('EVAL:',r if isinstance(r,str) else json.dumps(r,ensure_ascii=False,indent=1)[:6000])
        for i,sjs in enumerate(shots):
            await pg.evaluate(wrap(sjs)); await pg.wait_for_timeout(900)
            el=await pg.query_selector('#cv')
            await (el.screenshot(path=f'shot{i}.png') if os.environ.get('SHOT')=='cv' else pg.screenshot(path=f'shot{i}.png'))
        for l in logs:
            if 'ERR_TUNNEL' in l or 'Failed to load resource' in l: continue
            print(l[:500])
        await b.close()
asyncio.run(main())
