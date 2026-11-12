<script lang="ts">
 import {wallpaper,wallpaperOptions} from './wallpaper/preferences.svelte';
 import {onMount} from 'svelte';
 import {createFoldedScene} from './wallpaper/folded-scene';
 let redraw:(()=>void)|undefined;
 const selected=$derived(wallpaperOptions.find(option=>option.id===wallpaper.current)!);
 $effect(()=>{wallpaper.current;redraw?.();});
 let canvas:HTMLCanvasElement;
 let ready=$state(false);
 onMount(()=>{
  let scene=createFoldedScene(canvas);
  if(!scene)return;
  const media=matchMedia('(prefers-reduced-motion: reduce)');
  let frame=0,last=0,nextFrame=0,time=0,x=0,y=0,targetX=0,targetY=0,open=1,targetOpen=1,disposed=false,contextLost=false;
  const draw=(now:number)=>{
   frame=0;if(disposed||document.hidden||contextLost)return;
   if(now+0.5>=nextFrame || media.matches){
    const dt=Math.min(Math.max(0,(now-last)/1000),0.08);last=now;nextFrame=Math.max(nextFrame+1000/60,now);
    if(!media.matches){time+=dt;const follow=1-Math.exp(-2.34*dt);x+=(targetX-x)*follow;y+=(targetY-y)*follow;open+=(targetOpen-open)*(1-Math.exp(-1.38*dt));}
    scene?.draw(time,x,y,open,wallpaperOptions.findIndex(option=>option.id===wallpaper.current),!media.matches);ready=true;
   }
   if(!media.matches)frame=requestAnimationFrame(draw);
  };
  const start=()=>{cancelAnimationFrame(frame);last=performance.now();nextFrame=0;if(!document.hidden&&!contextLost)frame=requestAnimationFrame(draw);};
  redraw=start;
  const resize=()=>{scene?.resize();start();};
  const move=(event:PointerEvent)=>{if(event.pointerType==='touch'||media.matches)return;targetX=event.clientX/innerWidth*2-1;targetY=1-event.clientY/innerHeight*2;};
  const reset=()=>{targetX=0;targetY=0;};
  const click=(event:MouseEvent)=>{if(media.matches)return;const target=event.target as HTMLElement;if(target.closest('button,a,input,summary,nav,header,.mac-window'))return;if(target.closest('.mac-desktop'))targetOpen=targetOpen===1?0:1;};
  const lost=(event:Event)=>{event.preventDefault();contextLost=true;cancelAnimationFrame(frame);ready=false;};
  const restored=()=>{contextLost=false;scene?.dispose();scene=createFoldedScene(canvas);if(scene)resize();};
  window.addEventListener('pointermove',move,{passive:true});document.documentElement.addEventListener('pointerleave',reset);window.addEventListener('click',click);window.addEventListener('resize',resize);document.addEventListener('visibilitychange',start);media.addEventListener('change',start);canvas.addEventListener('webglcontextlost',lost);canvas.addEventListener('webglcontextrestored',restored);resize();
  return()=>{redraw=undefined;disposed=true;cancelAnimationFrame(frame);scene?.dispose();window.removeEventListener('pointermove',move);document.documentElement.removeEventListener('pointerleave',reset);window.removeEventListener('click',click);window.removeEventListener('resize',resize);document.removeEventListener('visibilitychange',start);media.removeEventListener('change',start);canvas.removeEventListener('webglcontextlost',lost);canvas.removeEventListener('webglcontextrestored',restored);};
 });
</script>
<div class="live-wallpaper" data-wallpaper={wallpaper.current} style={`--fallback-base:${selected.colors[0]};--fallback-mid:${selected.colors[1]};--fallback-light:${selected.colors[2]}`} aria-hidden="true">
 <svg class:concealed={ready} class="wallpaper-fallback" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice"><defs><linearGradient id="fold-base" x2="1" y2="1"><stop stop-color="#171444"/><stop offset=".5" stop-color="#3031b2"/><stop offset="1" stop-color="#7b32c2"/></linearGradient><linearGradient id="fold-ribbon" x1="0" y1="1" x2="1" y2="0"><stop stop-color="#08143b"/><stop offset=".43" stop-color="#233cb9"/><stop offset=".67" stop-color="#8984f4"/><stop offset=".72" stop-color="#b1b7ff"/><stop offset=".79" stop-color="#6032b7"/><stop offset="1" stop-color="#24123e"/></linearGradient></defs><path fill="url(#fold-base)" d="M0 0h1600v1000H0z"/><g fill="url(#fold-ribbon)"><path d="M-400 -400C600 -300 380 600 1900 700L1900 1200C650 1000 300 100 -400 200Z"/><path d="M-400 200C450 100 500 1000 1900 1100L1900 1500C400 1300 200 650 -400 800Z"/><path d="M-200 -700C1100 -400 800 200 1800 300L1900 700C800 600 400 -200 -200 -100Z"/></g></svg>
 <canvas bind:this={canvas} class:visible={ready}></canvas>
 <div class="wallpaper-shade"></div>
</div>
<style>
 .live-wallpaper{position:absolute;inset:0;overflow:hidden;pointer-events:none;background:radial-gradient(ellipse at 78% 40%,#3e2d83 0%,#222c74 38%,#171334 75%,#10152e 100%);}
 canvas,.wallpaper-fallback,.wallpaper-shade{position:absolute;inset:0;width:100%;height:100%;}
 canvas{opacity:0;}canvas.visible{opacity:1;}.concealed{visibility:hidden;}
 .wallpaper-fallback{filter:none;}
 .live-wallpaper:not([data-wallpaper="fold"]) .wallpaper-fallback{visibility:hidden;}
 .live-wallpaper{background:radial-gradient(ellipse at 70% 30%,var(--fallback-light),var(--fallback-mid) 40%,var(--fallback-base) 85%);}
 .wallpaper-shade{background:linear-gradient(90deg,#08172955,transparent 65%);}
</style>
