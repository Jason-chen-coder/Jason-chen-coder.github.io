import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { mkdir } from 'node:fs/promises';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const browser = await chromium.launch({ headless: true });
const base = process.env.DESKTOP_URL || 'http://127.0.0.1:4177/';
const output = process.env.DESKTOP_EVIDENCE || '/tmp/jason-desktop-evidence';
await mkdir(output, {recursive:true});
const page = await browser.newPage({viewport:{width:1440,height:900},reducedMotion:'reduce'});
const errors=[];
page.on('pageerror', error=>errors.push(error.message));
page.on('response', response=>{if(response.status()>=400&&response.url().startsWith(base))errors.push(`${response.status()} ${response.url()}`);});
try {
 await page.goto(base);
 const featured=['yourdream','labware','easyui','mxgraph','speech','devskills'];
 const dock=await page.locator('[data-dock]').evaluateAll(nodes=>nodes.map(n=>n.dataset.dock));
 assert.deepEqual(dock.filter(id=>!['about','craft','contact','github'].includes(id)), featured);
 console.log('PASS curated Dock order and no secondary projects');
 for(const width of [1440,390]) {
  await page.setViewportSize({width,height:900});
  for(const id of featured) {
   await page.locator(`[data-dock="${id}"]`).click();
   const content=page.locator(`#mac-window-${id} .mac-project-content`);
   await content.waitFor({state:'visible'});
   assert.ok((await content.innerText()).length>70, `${id} has substantive content`);
   assert.ok(await content.locator('video,img').count()>0, `${id} includes real project media`);
   assert.ok(await content.locator('a[href]').count()>0, `${id} has a usable destination`);
   assert.equal(await content.evaluate(n=>/undefined|\[object Object\]|\bnull\b/.test(n.innerText)),false);
   await content.locator('img').evaluateAll(images=>Promise.all(images.map(img=>img.decode())));
   await page.evaluate(()=>new Promise(requestAnimationFrame));
   if(width===1440) await page.screenshot({path:`${output}/curated-${id}.png`});
   assert.ok(await content.evaluate(n=>{const b=n.getBoundingClientRect();return b.x>=0&&b.right<=innerWidth+1;}));
  }
  await page.screenshot({path:`${output}/curated-project-${width}.png`});
 }
 await page.locator('[data-desktop-locale="en"]').click();
 await page.locator('[data-dock="labware"]').click();
 assert.match(await page.locator('#mac-window-labware').innerText(), /Labware/);
 assert.doesNotMatch(await page.locator('#mac-window-labware .mac-project-content').innerText(), /[\u4e00-\u9fff]/);
 await page.locator('[data-dock="easyui"]').click();
 assert.doesNotMatch(await page.locator('#mac-window-easyui .mac-project-content').innerText(), /[\u4e00-\u9fff]/);
 await page.locator('[data-desktop-locale="zh-CN"]').click();
 await page.goto(`${base}#opensource`);
 for(const id of ['flutterflow','d3','microfrontends']) {
  await page.locator(`#mac-window-projects [data-app-open="${id}"]`).click();
  const content=page.locator(`#mac-window-${id} .mac-project-content`);
  await content.waitFor({state:'visible'});
  assert.ok((await content.innerText()).length>70, `${id} directory entry opens real content`);
  await page.goto(`${base}#opensource`);
 }
 for(const hash of ['jsplumb','project-3']) {
  await page.goto(`${base}#${hash}`);
  const legacy=page.locator(`#mac-window-${hash==='jsplumb'?'jsplumb':'monaco'} .mac-window-body`);
  await legacy.waitFor({state:'visible'});
  assert.ok((await legacy.innerText()).length>70);
 }
 assert.deepEqual(errors,[]);
 console.log('PASS all featured windows on desktop/mobile, media, directory, legacy routes and no resource errors');
} finally {await browser.close();}
