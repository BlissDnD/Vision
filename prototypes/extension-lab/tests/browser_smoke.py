"""Automated headless checks of isolated lab only; never opens the user's browser."""
import asyncio, functools, http.server, json, threading
from pathlib import Path
from playwright.async_api import async_playwright
ROOT=Path(__file__).resolve().parents[1]
class Quiet(http.server.SimpleHTTPRequestHandler):
    def log_message(self,*args): pass
async def main():
    server=http.server.ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(ROOT/'dist')))
    threading.Thread(target=server.serve_forever,daemon=True).start()
    results=[]
    try:
        async with async_playwright() as p:
            browser=await p.chromium.launch(headless=True,args=['--use-angle=swiftshader','--enable-unsafe-swiftshader','--disable-dev-shm-usage'])
            page=await browser.new_page(viewport={'width':1100,'height':800})
            errors=[]
            page.on('pageerror',lambda error:errors.append(str(error)))
            page.on('console',lambda msg:errors.append(msg.text) if msg.type=='error' else None)
            await page.goto(f'http://127.0.0.1:{server.server_port}/',wait_until='networkidle')
            print('INITIAL ERRORS',errors,flush=True)
            for index in range(1,64):
                errors.clear()
                await page.select_option('#module',str(index))
                try:
                    await page.wait_for_function("!document.querySelector('#status').textContent.includes('Betöltés')",timeout=20000)
                    await page.wait_for_timeout(180)
                    await page.locator('#time').evaluate("el=>{el.value='0.5'}")
                    await page.locator('#time').dispatch_event('input')
                    await page.wait_for_timeout(100)
                    status=await page.locator('#status').inner_text()
                    failed='nem indult' in status or 'Próbahiba' in status or bool(errors)
                    results.append({'id':index,'ok':not failed,'status':status,'errors':list(errors)})
                    print(f"{index:02d} {'FAIL '+status if failed else 'OK'}"+(f" {errors[:1]}" if errors else ''),flush=True)
                except Exception as e:
                    results.append({'id':index,'ok':False,'errors':[str(e)]})
                    print(f'{index:02d} FAIL {e}',flush=True)
            checks=await page.evaluate("async()=>{const m=await import('./tests/browser-checks.mjs');return m.runChecks()}")
            for item in checks:
                results.append(item)
                print('CHECK',item,flush=True)
            await browser.close()
    finally:
        server.shutdown()
    (ROOT/'browser-report.json').write_text(json.dumps(results,ensure_ascii=False,indent=2)+'\n')
    print(f"SUMMARY {sum(r['ok'] for r in results)}/{len(results)}")
    if any(not r['ok'] for r in results):raise SystemExit(1)
asyncio.run(main())
