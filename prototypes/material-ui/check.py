from playwright.sync_api import sync_playwright
from pathlib import Path
import json
root=Path(__file__).resolve().parent
checks=[]
with sync_playwright() as p:
 b=p.chromium.launch(headless=True)
 page=b.new_page(viewport={'width':1280,'height':1100},device_scale_factor=1)
 errors=[]
 page.on('pageerror',lambda e: errors.append(str(e)))
 page.goto((root/'index.html').as_uri())
 def check(name,ok):
  checks.append({'check':name,'passed':bool(ok)})
  assert ok,name
 check('three example panels',page.locator('.demo-grid > section').count()==3)
 number=page.get_by_role('spinbutton',name='Tempo',exact=True)
 number.fill('2.5');number.press('Tab')
 check('numeric change commits', '2.5' in page.locator('[role=status]').inner_text())
 check('number and slider stay synchronized',page.get_by_role('slider',name='Tempo',exact=True).input_value()=='2.5')
 page.get_by_role('button',name='Reset Tempo',exact=True).click()
 check('reset restores default',number.input_value()=='1.8')
 switch=page.get_by_role('switch',name='Seamless loop');switch.click()
 check('switch commits',not switch.is_checked() and 'false' in page.locator('[role=status]').inner_text())
 page.get_by_role('button',name='Strength',exact=True).click()
 check('choice selection',page.get_by_role('button',name='Strength',exact=True).get_attribute('aria-pressed')=='true')
 dial=page.locator('.v-dial');dial.focus();dial.press('ArrowRight')
 check('direction keyboard', '46 degrees' in dial.get_attribute('aria-label'))
 curve=page.locator('.v-curve');r=curve.bounding_box();before=curve.locator('[data-line]').get_attribute('d')
 page.mouse.move(r['x']+20,r['y']+30);page.mouse.down();page.mouse.move(r['x']+r['width']-20,r['y']+110,steps=15);page.mouse.up()
 check('curve drawing commits',curve.locator('[data-line]').get_attribute('d')!=before and 'committed' in page.locator('[role=status]').inner_text())
 before=curve.locator('[data-line]').get_attribute('d');page.get_by_role('button',name='Smooth',exact=True).click()
 check('smooth changes curve',curve.locator('[data-line]').get_attribute('d')!=before)
 page.get_by_role('button',name='Reset curve',exact=True).click()
 check('reset restores curve',curve.locator('[data-line]').get_attribute('d').startswith('M0 21'))
 page.get_by_role('button',name='About this starter',exact=True).click()
 check('dialog opens',page.locator('dialog').evaluate('(e)=>e.open'));page.keyboard.press('Escape')
 check('dialog Escape closes',not page.locator('dialog').evaluate('(e)=>e.open'))
 page.get_by_role('tab',name='Library',exact=True).click();page.get_by_role('searchbox').fill('warm')
 check('library filter',page.locator('[role=tabpanel]:visible li:visible').count()==1)
 page.get_by_role('button',name='Toggle light theme').click()
 check('theme toggle',page.locator('html').get_attribute('data-theme')=='light')
 page.get_by_role('button',name='Toggle light theme').click()
 page.screenshot(path=str(root/'preview-desktop.png'),full_page=True)
 for width in [320,390,768,1280]:
  page.set_viewport_size({'width':width,'height':900})
  check(f'no horizontal overflow at {width}',page.evaluate('document.documentElement.scrollWidth <= innerWidth'))
 page.set_viewport_size({'width':390,'height':900});page.screenshot(path=str(root/'preview-narrow.png'),full_page=True)
 check('no browser errors',not errors)
 b.close()
(root/'CHECK-RESULTS.json').write_text(json.dumps(checks,indent=2)+'\n')
print(f'{len(checks)}/{len(checks)} checks passed')
