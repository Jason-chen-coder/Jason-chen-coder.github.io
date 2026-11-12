import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {mkdir} from 'node:fs/promises';
const require = createRequire(import.meta.url);
const {chromium} = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const base = process.env.DESKTOP_URL || 'http://127.0.0.1:4177/';
const output = process.env.DESKTOP_EVIDENCE || '/tmp/jason-theme-transition-evidence';
await mkdir(output, {recursive:true});
const browser = await chromium.launch({headless:true});
try {
 const page = await browser.newPage({viewport:{width:1440,height:900}, colorScheme:'light'});
 const errors=[]; page.on('pageerror',error=>errors.push(error.message));
 await page.addInitScript(() => {
  const original = Element.prototype.animate;
  window.__reveals=[];
  Element.prototype.animate=function(frames,options) {
   const animation=original.call(this,frames,options);
   if(options?.pseudoElement==='::view-transition-new(root)') {
    animation.pause();animation.currentTime=325;
    window.__reveals.push({animation,frames,options});
   }
   return animation;
  };
  const start=document.startViewTransition?.bind(document);
  if(start) document.startViewTransition=function(callback) {
   window.__capturedOpenMenu=document.querySelector('.mac-theme')?.open;
   return start(callback);
  };
 });
 await page.goto(base,{waitUntil:'domcontentloaded'});
 await page.locator('[data-theme-toggle]').waitFor();
 await page.evaluate(()=>window.PortfolioTheme.set('light'));
 const choose=async value=>{await page.locator('[data-theme-toggle]').click();await page.locator(`[data-theme-option="${value}"]`).click();};
 for(const [index,value] of ['dark','light'].entries()) {
  await page.locator('[data-theme-toggle]').click();
  const option=page.locator(`[data-theme-option="${value}"]`);const box=await option.boundingBox();
  await option.click();
  await page.waitForFunction(count=>window.__reveals.length===count,index+1);
  const reveal=await page.evaluate(()=>{
   const {animation,frames,options}=window.__reveals.at(-1);
   return {frames,options,time:animation.currentTime,target:animation.effect.pseudoElement,menuOpen:window.__capturedOpenMenu,theme:document.documentElement.dataset.theme};
  });
  assert.equal(reveal.theme,value);assert.equal(reveal.menuOpen,false);assert.equal(reveal.target,'::view-transition-new(root)');
  const x=box.x+box.width/2,y=box.y+box.height/2;
  const origin=reveal.frames.clipPath[0].match(/at ([\d.]+)px ([\d.]+)px/);
  assert.ok(Math.abs(Number(origin[1])-x)<1&&Math.abs(Number(origin[2])-y)<1,'circle originates at clicked option');
  const radius=Number(reveal.frames.clipPath[1].match(/circle\(([\d.]+)/)[1]);
  assert.ok(radius>=Math.hypot(Math.max(Number(origin[1]),1440-Number(origin[1])),Math.max(Number(origin[2]),900-Number(origin[2])))-.1,'circle reaches every viewport corner');
  await page.screenshot({path:`${output}/${value}-midpoint.png`});
  await page.evaluate(()=>window.__reveals.at(-1).animation.finish());
  await page.waitForFunction(()=>!document.getAnimations().some(animation=>animation.effect?.pseudoElement && animation.playState !== 'finished'));
  console.log(`PASS ${value} reveal uses click origin, new snapshot and full coverage`);
 }
 // Keyboard activation has no pointer coordinates and uses the trigger centre.
 await page.locator('[data-theme-toggle]').click();
 const triggerBox=await page.locator('[data-theme-toggle]').boundingBox();
 await page.locator('[data-theme-option="dark"]').focus();await page.keyboard.press('Enter');
 await page.waitForFunction(()=>window.__reveals.length===3);
 const keyboardOrigin=await page.evaluate(()=>window.__reveals.at(-1).frames.clipPath[0]);
 const point=keyboardOrigin.match(/at ([\d.]+)px ([\d.]+)px/);
 assert.ok(Math.abs(Number(point[1])-(triggerBox.x+triggerBox.width/2))<1&&Math.abs(Number(point[2])-(triggerBox.y+triggerBox.height/2))<1);
 await page.evaluate(()=>window.__reveals.at(-1).animation.finish());
 await page.waitForFunction(()=>!document.getAnimations().some(animation=>animation.effect?.pseudoElement && animation.playState !== 'finished'));
 await page.evaluate(()=>window.PortfolioTheme.set('dark',{x:10,y:10}));
 assert.equal(await page.evaluate(()=>window.__reveals.length),3,'same resolved appearance skips animation');
 await page.emulateMedia({reducedMotion:'reduce'});await choose('light');
 assert.equal(await page.locator('html').getAttribute('data-theme'),'light');
 assert.equal(await page.evaluate(()=>window.__reveals.length),3,'reduced motion switches immediately');
 await page.emulateMedia({reducedMotion:'no-preference'});
 // Rapid requests must apply the newest preference even when skipped callbacks run later.
 await page.evaluate(()=>{for(const value of ['dark','light','dark','light'])window.PortfolioTheme.set(value,{x:100,y:100});});
 await page.waitForFunction(()=>document.documentElement.dataset.theme==='light');
 await page.waitForTimeout(200);
 assert.equal(await page.locator('html').getAttribute('data-theme'),'light');
 assert.equal(await page.evaluate(()=>localStorage.getItem('portfolio-theme')),'light');
 assert.equal(await page.evaluate(()=>document.getAnimations().filter(animation=>animation.effect?.pseudoElement && animation.playState !== 'finished').length),0);
 await page.evaluate(()=>{document.startViewTransition=undefined;window.PortfolioTheme.set('dark',{x:10,y:10});});
 assert.equal(await page.locator('html').getAttribute('data-theme'),'dark','unsupported browsers switch immediately');
 assert.deepEqual(errors,[]);
 console.log('PASS keyboard origin, same appearance, reduced motion, rapid requests, fallback and no page errors');
} finally {await browser.close();}
