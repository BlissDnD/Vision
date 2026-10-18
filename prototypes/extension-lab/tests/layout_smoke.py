"""Headless layout-only rendering, rewind and editable-content checks."""
import asyncio,functools,http.server,threading,json
from pathlib import Path
from playwright.async_api import async_playwright
ROOT=Path(__file__).resolve().parents[1]
class Quiet(http.server.SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
async def main():
 server=http.server.ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(ROOT/'dist')))
 threading.Thread(target=server.serve_forever,daemon=True).start()
 results=[]
 try:
  async with async_playwright() as p:
   browser=await p.chromium.launch(headless=True,args=['--use-angle=swiftshader','--enable-unsafe-swiftshader'])
   page=await browser.new_page(viewport={'width':1440,'height':1000},device_scale_factor=1)
   errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
   await page.goto(f'http://127.0.0.1:{server.server_port}/layouts.html',wait_until='networkidle')
   await page.wait_for_function('window.layoutLab && document.querySelector("#status").textContent.includes("Eredeti")')
   a=await page.locator('canvas').screenshot();await page.evaluate('layoutLab.seek(12);layoutLab.seek(5)');b=await page.locator('canvas').screenshot()
   assert a==b,'rewind differs';results.append('Unwoven exact pixel rewind')
   await page.locator('#stage').screenshot(path=str(ROOT/'layouts/unwoven-preview.png'))
   await page.locator('#control-threads').fill('48');await page.locator('#control-threads').dispatch_event('input')
   assert await page.evaluate('layoutLab.serialize().threads')==48;results.append('ribbon rebuild')
   await page.locator('#images').set_input_files(str(ROOT/'layouts/assets/motion_blur_portrait_02.jpg'))
   await page.wait_for_function('document.querySelector("#status").textContent.includes("lecserélve")');results.append('image replacement')
   async with page.expect_download() as download:
    await page.locator('#save').click()
   path=await (await download.value).path();data=json.loads(Path(path).read_text());assert data['options']['threads']==48
   await page.locator('#load').set_input_files(str(path));await page.wait_for_function('document.querySelector("#status").textContent.includes("Eredeti")');assert await page.evaluate('layoutLab.serialize().threads')==48;results.append('JSON roundtrip')
   await page.select_option('#preset','wide');await page.wait_for_selector('.wide-preset')
   for i in range(5):
    await page.evaluate('(i)=>layoutLab.setOptions({composition:i})',i)
    assert await page.locator('.wide-stage img').count()==3
   results.append('five editorial compositions')
   await page.evaluate('layoutLab.setOptions({composition:0})');await page.locator('#stage').screenshot(path=str(ROOT/'layouts/wide-study-preview.png'))
   await page.locator('#control-title').fill('Saját magazin');assert await page.locator('.wide-stage h1').inner_text()=='Saját magazin';results.append('editable title')
   await page.set_viewport_size({'width':430,'height':900});await page.locator('#stage').screenshot(path=str(ROOT/'layouts/mobile-preview.png'))
   assert await page.evaluate('document.documentElement.scrollWidth <= innerWidth');results.append('mobile no horizontal overflow')
   assert not errors,errors
   await browser.close()
 finally:server.shutdown()
 (ROOT/'layouts/browser-report.json').write_text(json.dumps({'passed':results,'errors':errors},ensure_ascii=False,indent=2)+'\n')
 print(f'{len(results)}/{len(results)} layout checks passed: '+', '.join(results))
asyncio.run(main())
