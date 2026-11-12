import assert from 'node:assert/strict';
import {writeFile} from 'node:fs/promises';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const {chromium}=require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const browser=await chromium.launch({headless:true,args:process.platform==='darwin'?['--use-gl=angle','--use-angle=metal']:[]});
const url=process.env.DESKTOP_URL || 'http://127.0.0.1:4177/';
const choose=async(page,id)=>{await page.locator('[data-wallpaper-toggle]').click();await page.locator(`[data-wallpaper-option="${id}"]`).click();};
try {
 const page=await browser.newPage({viewport:{width:1920,height:1080},deviceScaleFactor:2});
 const results=[];
 const errors=[];page.on('pageerror',error=>errors.push(error.message));
 await page.addInitScript(()=>{
  window.__wallpaperDraws=0;window.__wallpaperFrames=[];window.__wallpaperBlends=[];
  const uniforms=new WeakMap();
  const draw=WebGLRenderingContext.prototype.drawElements;
  WebGLRenderingContext.prototype.drawElements=function(...args){
   const program=this.getParameter(this.CURRENT_PROGRAM);
   if(!program)return draw.apply(this,args);
   if(!uniforms.has(program))uniforms.set(program,{mode:this.getUniformLocation(program,'uMode'),opacity:this.getUniformLocation(program,'uOpacity')});
   const {mode,opacity}=uniforms.get(program);
   if(mode){window.__wallpaperDraws++;window.__wallpaperFrames.push({time:performance.now(),indices:args[1]});}
   else if(opacity)window.__wallpaperBlends.push({time:performance.now(),opacity:this.getUniform(program,opacity)});
   return draw.apply(this,args);
  };
 });
 await page.goto(url,{waitUntil:'domcontentloaded'});await page.locator('.live-wallpaper canvas.visible').waitFor();
 const renderer=await page.evaluate(()=>{const gl=document.querySelector('.live-wallpaper canvas').getContext('webgl');const ext=gl.getExtension('WEBGL_debug_renderer_info');return ext?gl.getParameter(ext.UNMASKED_RENDERER_WEBGL):gl.getParameter(gl.RENDERER);});
 console.log(renderer);
 for(const id of ['chrome','dunes','aurora','ocean','nebula','ribbons','warp','fold']) {
  await choose(page,id);
  assert.equal(await page.locator('.live-wallpaper').getAttribute('data-wallpaper'),id);
  assert.equal(await page.locator(`[data-wallpaper-option="${id}"]`).getAttribute('aria-pressed'),'true');
  assert.equal(await page.locator('.wallpaper-picker').getAttribute('open'),null);
  assert.equal(await page.evaluate(()=>localStorage.getItem('portfolio-wallpaper')),id);
  await page.waitForTimeout(200);
  const begin=await page.evaluate(()=>window.__wallpaperFrames.length);
  await page.waitForTimeout(1200);
  const sample=await page.evaluate(start=>window.__wallpaperFrames.slice(start),begin);
  const intervals=sample.slice(1).map((frame,index)=>frame.time-sample[index].time).sort((a,b)=>a-b);
  const fps=(sample.length-1)*1000/(sample.at(-1).time-sample[0].time);
  const p95=intervals[Math.floor(intervals.length*.95)];
  assert.ok(fps>=50 && fps<=65,`${id}: ${fps.toFixed(1)} fps`);
  assert.ok(sample.every(frame=>frame.indices===(['fold','chrome','dunes'].includes(id)?173400:6)),`${id}: expected geometry path`);
  results.push({id,drawsPerSecond:fps,p95FrameIntervalMs:p95,samples:sample.length});
  console.log(`${id}: ${fps.toFixed(1)} draws/s; p95 ${p95.toFixed(1)}ms`);
 }
 // The outgoing frame fades for1.6s; a new choice continues from the composite.
 await page.waitForTimeout(1700);
 const start=await page.evaluate(()=>window.__wallpaperBlends.length);
 await choose(page,'chrome');await page.waitForTimeout(750);
 const halfway=await page.evaluate(start=>window.__wallpaperBlends.slice(start),start);
 assert.ok(halfway[0].opacity>.98 && halfway.at(-1).opacity>.3 && halfway.at(-1).opacity<.7,'slow crossfade retains outgoing frame halfway');
 assert.ok(halfway.every((value,i)=>!i||value.opacity<=halfway[i-1].opacity),'fade eases monotonically');
 const interrupt=await page.evaluate(()=>window.__wallpaperBlends.length);
 await choose(page,'ocean');await page.waitForTimeout(100);
 assert.ok((await page.evaluate(start=>window.__wallpaperBlends.slice(start),interrupt)).some(value=>value.opacity>.98),'interrupted blend restarts from captured composite');
 await page.waitForTimeout(1650);
 const finished=await page.evaluate(()=>window.__wallpaperBlends.length);await page.waitForTimeout(150);
 assert.equal(await page.evaluate(()=>window.__wallpaperBlends.length),finished,'blend draw stops after transition');
 console.log('PASS1.6s eased crossfade, continuous interruption, completed overlay released');
 await choose(page,'dunes');await page.reload();await page.locator('.live-wallpaper canvas.visible').waitFor();
 assert.equal(await page.locator('.live-wallpaper').getAttribute('data-wallpaper'),'dunes');
 await page.locator('[data-wallpaper-toggle]').click();await page.keyboard.press('Escape');
 assert.equal(await page.locator('.wallpaper-picker').getAttribute('open'),null);
 assert.equal(await page.locator('[data-wallpaper-toggle]').evaluate(el=>el===document.activeElement),true);
 const resolution=await page.locator('.live-wallpaper canvas').evaluate(el=>({width:el.width,height:el.height}));
 assert.ok(resolution.width<=1800 && resolution.width*resolution.height<=2003000,'bounded render resolution');
 if(process.env.WALLPAPER_REPORT)await writeFile(process.env.WALLPAPER_REPORT,JSON.stringify({renderer,viewport:{width:1920,height:1080,dpr:2},backing:resolution,targetFPS:60,results},null,2));
 const before=await page.evaluate(()=>window.__wallpaperDraws);await page.waitForTimeout(600);
 const frames=await page.evaluate(()=>window.__wallpaperDraws)-before;
 assert.ok(frames>=28 && frames<=40,`render cap: ${frames} draws in600ms`);
 await page.emulateMedia({reducedMotion:'reduce'});await page.waitForTimeout(100);
 const stopped=await page.evaluate(()=>window.__wallpaperDraws);await page.waitForTimeout(250);
 assert.equal(await page.evaluate(()=>window.__wallpaperDraws),stopped);
 await choose(page,'aurora');await page.waitForTimeout(100);
 assert.equal(await page.evaluate(()=>window.__wallpaperDraws),stopped+1,'switch redraws a still with reduced motion');
 await page.waitForTimeout(150);assert.equal(await page.evaluate(()=>window.__wallpaperDraws),stopped+1);
 await page.setViewportSize({width:390,height:844});await page.locator('[data-wallpaper-toggle]').click();
 const box=await page.locator('.wallpaper-panel').boundingBox();assert.ok(box.x>=0 && box.x+box.width<=391);
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
 await page.locator('[data-wallpaper-option="chrome"]').click();
 const glLost=await page.evaluate(()=>{const gl=document.querySelector('.live-wallpaper canvas').getContext('webgl');const ext=gl.getExtension('WEBGL_lose_context');if(!ext)return false;window.__wallpaperContext=ext;ext.loseContext();return true;});
 if(glLost){await page.waitForTimeout(100);assert.equal(await page.locator('.live-wallpaper canvas').evaluate(el=>el.classList.contains('visible')),false);await choose(page,'fold');await page.evaluate(()=>window.__wallpaperContext.restoreContext());await page.locator('.live-wallpaper canvas.visible').waitFor();}
 assert.deepEqual(errors,[]);
 const fallback=await browser.newPage();await fallback.addInitScript(()=>{const original=HTMLCanvasElement.prototype.getContext;HTMLCanvasElement.prototype.getContext=function(type,...args){return type==='webgl'?null:original.call(this,type,...args);};});
 await fallback.goto(url);await fallback.locator('[data-wallpaper-toggle]').waitFor();await choose(fallback,'aurora');
 assert.equal(await fallback.locator('.live-wallpaper').getAttribute('data-wallpaper'),'aurora');
 assert.equal(await fallback.locator('.live-wallpaper canvas').evaluate(el=>el.classList.contains('visible')),false);
 console.log(`PASS eight modes, persistence, keyboard, mobile, reduced motion, context recovery, GPU fallback; ${frames} draws/600ms`);
} finally {await browser.close();}
