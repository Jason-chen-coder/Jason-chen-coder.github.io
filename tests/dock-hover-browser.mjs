import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {mkdir,writeFile} from 'node:fs/promises';
const require=createRequire(import.meta.url);
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const base=process.env.DESKTOP_URL||'http://127.0.0.1:4177/';
const output=process.env.DESKTOP_EVIDENCE||'/tmp/jason-desktop-evidence';
await mkdir(output,{recursive:true});
const browser=await chromium.launch({headless:true,args:process.platform==='darwin'?['--use-gl=angle','--use-angle=metal']:[]});
const reports=[],errors=[];
const check=(condition,message)=>{assert.ok(condition,message);console.log(`PASS ${message}`);};
const sample=(page,duration=1200)=>page.evaluate(duration=>new Promise(resolve=>{const frames=[];let start;const frame=time=>{start??=time;const icons=[...document.querySelectorAll('.mac-dock-icon')].map(icon=>{const box=icon.getBoundingClientRect();return{id:icon.closest('[data-dock]').dataset.dock,x:box.x,y:box.y,w:box.width};});const viewport=document.querySelector('.mac-dock-viewport');frames.push({t:time-start,icons,scroll:document.querySelector('.mac-dock-region').classList.contains('is-scrollable'),viewport:viewport.clientWidth,dock:document.querySelector('.mac-dock').getBoundingClientRect().width});if(time-start<duration)requestAnimationFrame(frame);else resolve(frames);};requestAnimationFrame(frame);}),duration);
const flips=frames=>frames.slice(1).filter((frame,index)=>frame.scroll!==frames[index].scroll).length;
const biggestJump=frames=>Math.max(0,...frames.slice(1).flatMap((frame,index)=>frame.icons.map((icon,item)=>Math.abs(icon.w-frames[index].icons[item].w))));
const tailWidths=(frames,id)=>frames.filter(frame=>frame.t>650).map(frame=>frame.icons.find(icon=>icon.id===id).w);
try{
 for(const width of [900,1000,1440]){
  const page=await browser.newPage({viewport:{width,height:900},deviceScaleFactor:2});page.on('pageerror',error=>errors.push(error.message));
  await page.goto(base);await page.locator('#desktop-boot').waitFor({state:'hidden'});await page.mouse.move(30,30);
  const box=await page.locator('[data-dock="speech"] .mac-dock-icon').boundingBox();
  await page.mouse.move(box.x+box.width/2,box.y+box.height/2);
  const frames=await sample(page),tail=frames.filter(frame=>frame.t>650),widths=tail.map(frame=>frame.icons.find(icon=>icon.id==='speech').w);
  reports.push({width,stage:'fixed-hover',frames});
  check(Math.min(...widths)>box.width*1.08, `${width}px fixed hover stays magnified instead of collapsing to rest`);
  check(flips(frames)===0&&Math.max(...widths)-Math.min(...widths)<.5, `${width}px fixed pointer does not toggle overflow or oscillate`);
  check(frames.every(frame=>frame.dock<=width-23), `${width}px magnification fits the viewport budget`);
  const microCapture=sample(page,1400);
  for(let index=0;index<60;index++){await page.mouse.move(box.x+box.width/2+Math.sin(index*.75)*3,box.y+box.height/2);await page.waitForTimeout(16);}
  const micro=await microCapture;reports.push({width,stage:'micro-move',frames:micro});
  check(flips(micro)===0&&biggestJump(micro)<8&&Math.min(...tailWidths(micro,'speech'))>box.width*1.08, `${width}px tiny pointer moves do not trigger hard collapses`);
  const panel=await page.locator('.mac-dock').boundingBox();
  const crossingCapture=sample(page,1600);
  for(let index=0;index<60;index++){await page.mouse.move(panel.x+15+(panel.width-30)*index/59,panel.y+panel.height-12);await page.waitForTimeout(16);}
  const crossing=await crossingCapture;reports.push({width,stage:'cross-icons',frames:crossing});
  check(flips(crossing)===0&&biggestJump(crossing)<18&&crossing.every(frame=>frame.dock<=width-23), `${width}px crossing neighboring icons stays smooth and contained`);
  await page.mouse.move(30,30);const leaving=await sample(page);
  check(leaving.filter(frame=>frame.t>650).every(frame=>frame.icons.every(icon=>Math.abs(icon.w-box.width)<.2)), `${width}px leaving restores every icon to its resting size`);
  await page.close();
 }
 // Recreate the reported upper-edge path relative to the current speech icon.
 // Fixed screen coordinates target a different app when the Dock app list changes.
 const recorded=await browser.newPage({viewport:{width:892,height:954},deviceScaleFactor:2});recorded.on('pageerror',error=>errors.push(error.message));await recorded.goto(base);await recorded.locator('#desktop-boot').waitFor({state:'hidden'});
 const resting=await recorded.locator('[data-dock="speech"] .mac-dock-icon').boundingBox();
 const anchorX=resting.x+resting.width/2;
 await recorded.mouse.move(anchorX,resting.y+resting.height*.85);await recorded.waitForTimeout(400);
 const pathCapture=sample(recorded,4000);
 for(let cycle=0;cycle<4;cycle++)for(const [dx,ratio] of [[-3,.12],[7,.8],[0,.03],[-7,.75],[0,.82]]){await recorded.mouse.move(anchorX+dx,resting.y+resting.height*ratio,{steps:8});await recorded.waitForTimeout(110);}
 const pathFrames=await pathCapture,pathWidths=pathFrames.filter(frame=>frame.t>650).map(frame=>frame.icons.find(icon=>icon.id==='speech').w);
 reports.push({width:892,height:954,stage:'reported-recording-path',frames:pathFrames});
 check(pathFrames.every(frame=>!frame.scroll)&&flips(pathFrames)===0,'892px recorded upper-edge path never enables the scrolling hint');
 check(Math.min(...pathWidths)>resting.width*1.08&&Math.max(...pathWidths)-Math.min(...pathWidths)<1.5,'892px recorded vertical and neighboring-icon path remains magnified without flickering');
 await recorded.close();
 const page=await browser.newPage({viewport:{width:900,height:900},deviceScaleFactor:2});page.on('pageerror',error=>errors.push(error.message));await page.goto(base);await page.locator('#desktop-boot').waitFor({state:'hidden'});
 const icon=await page.locator('[data-dock="speech"] .mac-dock-icon').boundingBox(),panel=await page.locator('.mac-dock').boundingBox();
 await page.mouse.move(icon.x+icon.width/2,panel.y+panel.height-12);await sample(page);
 await page.emulateMedia({reducedMotion:'reduce'});
 const reduced=await sample(page,400);check(reduced.at(-1).icons.every(item=>Math.abs(item.w-icon.width)<.2), 'reduced motion immediately resets magnification');
 await page.emulateMedia({reducedMotion:'no-preference'});
 const restored=await sample(page);check(Math.min(...tailWidths(restored,'speech'))>icon.width*1.08, 'disabling reduced motion restores hover without another pointer move');
 await page.setViewportSize({width:700,height:900});const compact=await sample(page,500);
 check(compact.at(-1).icons.every(item=>Math.abs(item.w-44)<.2), 'compact mode keeps fixed 44px icons');
 await page.setViewportSize({width:900,height:900});const resized=await sample(page);
 check(Math.min(...tailWidths(resized,'speech'))>icon.width*1.08&&flips(resized)===0, 'resizing back restores hover without stale spring targets');
 await page.setViewportSize({width:390,height:900});const mobile=await sample(page,500);
 check(mobile.at(-1).scroll&&mobile.at(-1).icons.every(item=>Math.abs(item.w-44)<.2), 'a naturally overflowing Dock scrolls with fixed-size icons');
 const viewport=page.locator('.mac-dock-viewport'),viewportBox=await viewport.boundingBox();
 await page.mouse.move(viewportBox.x+viewportBox.width/2,viewportBox.y+viewportBox.height/2);const before=await viewport.evaluate(node=>node.scrollLeft);await page.mouse.wheel(0,220);
 await page.waitForFunction(before=>document.querySelector('.mac-dock-viewport').scrollLeft>before,before);
 check(await viewport.evaluate(node=>node.scrollLeft)>before, 'wheel input reaches Dock items beyond the initial mobile view');
 await page.locator('[data-dock="github"]').focus();
 check(await page.locator('[data-dock="github"]').evaluate(button=>{const item=button.getBoundingClientRect(),view=button.closest('.mac-dock-viewport').getBoundingClientRect();return item.x>=view.x-1&&item.right<=view.right+1;}), 'keyboard focus reveals the final Dock item');
 await page.close();
 check(errors.length===0,`no browser errors (${errors.join('; ')})`);
}finally{await writeFile(`${output}/dock-hover-regression.json`,JSON.stringify(reports,null,2));await browser.close();}
