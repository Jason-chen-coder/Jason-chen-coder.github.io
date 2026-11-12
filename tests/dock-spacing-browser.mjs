import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const browser=await chromium.launch({headless:true,args:process.platform==='darwin'?['--use-gl=angle','--use-angle=metal']:[]});
const url=process.env.DESKTOP_URL||'http://127.0.0.1:4177/';
const geometry=page=>page.evaluate(()=>{
 const panel=document.querySelector('.mac-dock').getBoundingClientRect();
 return [...document.querySelectorAll('.mac-dock-icon')].map(icon=>{
  const rect=icon.getBoundingClientRect();return {id:icon.closest('[data-dock]').dataset.dock,top:rect.top-panel.top,bottom:panel.bottom-rect.bottom,width:rect.width};
 });
});
function check(items,label){for(const item of items){assert.ok(item.top>=8 && item.bottom>=8,`${label}/${item.id}: icons inside panel with padding: ${JSON.stringify(item)}`);assert.ok(Math.abs(item.top-item.bottom)<.6,`${label}/${item.id}: equal vertical padding: ${JSON.stringify(item)}`);}}
try {
 for(const width of [1440,900,390]){
  const page=await browser.newPage({viewport:{width,height:900}});await page.goto(url);await page.locator('.mac-dock-icon').first().waitFor();await page.mouse.move(10,10);
  check(await geometry(page),`${width}px rest`);
  assert.ok(await page.locator('.mac-dock-viewport').evaluate(view=>{const panel=view.querySelector('.mac-dock').getBoundingClientRect(),clip=view.getBoundingClientRect();return getComputedStyle(view).overflowY!=='hidden'||panel.top>=clip.top-.5&&panel.bottom<=clip.bottom+.5;}),`${width}px panel padding is not clipped by scrolling viewport`);
  assert.ok(await page.locator('.mac-dock .divider').evaluate(el=>el.getBoundingClientRect().height>20),'divider remains visible');
  if(width>720){const box=await page.locator('[data-dock="speech"] .mac-dock-icon').boundingBox();await page.mouse.move(box.x+box.width/2,box.y+box.height/2);
   await page.waitForFunction(()=>parseFloat(document.querySelector('[data-dock="speech"] .mac-dock-icon').style.width)>62);
   // Observe the entire spring, including its overshoot.
   const frames=await page.evaluate(()=>new Promise(resolve=>{const samples=[];let start;function sample(now){start??=now;const panel=document.querySelector('.mac-dock').getBoundingClientRect();samples.push([...document.querySelectorAll('.mac-dock-icon')].map(icon=>{const r=icon.getBoundingClientRect();return{id:icon.closest('[data-dock]').dataset.dock,top:r.top-panel.top,bottom:panel.bottom-r.bottom};}));if(now-start<650)requestAnimationFrame(sample);else resolve(samples);}requestAnimationFrame(sample);}));
   frames.forEach(frame=>check(frame,`${width}px hover`));
  }
  console.log(`PASS ${width}px Dock has equal top/bottom icon space, including magnification`);await page.close();
 }
}finally{await browser.close();}
