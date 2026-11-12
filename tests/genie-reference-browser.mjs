import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const browser=await chromium.launch({headless:true});
const page=await browser.newPage({viewport:{width:1440,height:900}});
try {
 await page.goto(process.env.DESKTOP_URL||'http://127.0.0.1:4177/');
 await page.locator('[data-dock="mxgraph"]').click();
 await page.waitForFunction(()=>!document.querySelector('#mac-window-mxgraph').dataset.windowMotion);
 await page.mouse.move(20,20);
 await page.locator('#mac-window-mxgraph [data-window-action="minimize"]').click();
 await page.waitForSelector('[data-genie-for="mxgraph"] .mac-genie-slice');
 const frames=await page.evaluate(()=>{
  const slices=[...document.querySelectorAll('[data-genie-for="mxgraph"] .mac-genie-slice')], animations=slices.flatMap(n=>n.getAnimations());
  animations.forEach(a=>a.pause());
  const sample=t=>{
   animations.forEach(a=>a.currentTime=Number(a.effect.getTiming().duration)*t);
   const rects=slices.map(n=>n.getBoundingClientRect().toJSON());
   return{t,far:rects[0],near:rects.at(-1),middle:rects[9]};
  };
  return [0,.3,.6,1].map(sample);
 });
 const [start,formed,travel,end]=frames;
 // Reference: the Dock edge forms a mouth before the broad far edge travels.
 assert.ok(formed.far.width>start.far.width*.98);
 assert.ok(Math.abs(formed.far.y-start.far.y)<start.far.width*.02);
 assert.ok(formed.near.width<start.far.width*.1);
 // Content in the middle remains broad during absorption, rather than
 // becoming a thin neck across most of the window before it has moved.
 assert.ok(travel.middle.width>travel.far.width*.4);
 assert.ok(travel.far.width>start.far.width*.5);
 assert.ok(travel.far.y>formed.far.y+100);
 assert.ok(end.far.width<=3&&end.near.bottom-end.far.top<=3);
 console.log('PASS reference sequence: form mouth, retain broad content, then absorb into Dock');
} finally {await browser.close();}
