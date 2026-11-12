<script lang="ts">
 import {onMount} from 'svelte';
 import {ui} from '../../portfolio/ui.svelte';
 import {wallpaper,wallpaperOptions,selectWallpaper,type WallpaperId} from './wallpaper/preferences.svelte';
 let panel:HTMLDetailsElement;
 let trigger:HTMLElement;
 const title=$derived(ui.locale==='en'?'Wallpaper':'壁纸');
 const selected=$derived(wallpaperOptions.find(option=>option.id===wallpaper.current)!);
 function choose(id:WallpaperId){selectWallpaper(id);panel.open=false;trigger.focus();}
 onMount(()=>{
  const outside=(event:PointerEvent)=>{if(!panel.contains(event.target as Node))panel.open=false;};
  const escape=(event:KeyboardEvent)=>{if(event.key==='Escape'&&panel.open){event.preventDefault();event.stopImmediatePropagation();panel.open=false;trigger.focus();}};
  document.addEventListener('pointerdown',outside);document.addEventListener('keydown',escape,true);
  return()=>{document.removeEventListener('pointerdown',outside);document.removeEventListener('keydown',escape,true);};
 });
</script>
<details class="wallpaper-picker" bind:this={panel}>
 <summary bind:this={trigger} data-wallpaper-toggle aria-label={`${title}: ${ui.locale==='en'?selected.en:selected.zh}`} title={title}>
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="3"/><circle cx="9" cy="9" r="1.5"/><path d="m4 17 5-5 4 4 3-3 5 5"/></svg><span class="picker-label">{title}</span>
 </summary>
 <div class="wallpaper-panel" role="group" aria-label={title}>
  {#each wallpaperOptions as option}
   <button type="button" data-wallpaper-option={option.id} aria-label={ui.locale==='en'?option.en:option.zh} aria-pressed={wallpaper.current===option.id} onclick={()=>choose(option.id)}>
    <span class="wallpaper-preview {option.id}" style={`--base:${option.colors[0]};--mid:${option.colors[1]};--light:${option.colors[2]}`} aria-hidden="true"><span></span></span>
    <span class="wallpaper-name">{ui.locale==='en'?option.en:option.zh}<span aria-hidden="true">{wallpaper.current===option.id?'✓':''}</span></span>
   </button>
  {/each}
 </div>
</details>
<style>
 .wallpaper-picker{position:relative;}
 summary{display:flex;align-items:center;gap:6px;padding:5px 8px;border-radius:999px;cursor:pointer;list-style:none;user-select:none;}
 summary::-webkit-details-marker{display:none;}summary:hover,.wallpaper-picker[open] summary{background:var(--glass-hover);}
 .wallpaper-panel{position:absolute;top:calc(100% + 9px);right:0;width:294px;max-height:calc(100dvh - 58px);overflow-y:auto;overscroll-behavior:contain;padding:12px;display:grid;grid-template-columns:1fr 1fr;gap:10px;border:1px solid var(--glass-edge);border-radius:16px;color:var(--glass-ink);background:var(--glass-reading);backdrop-filter:var(--glass-blur);box-shadow:var(--glass-highlight),0 12px 36px #0a162d38;}
 .wallpaper-panel button{min-width:0;padding:4px!important;border-radius:9px!important;text-align:left;}
 .wallpaper-panel button[aria-pressed=true]{background:var(--glass-hover);box-shadow:inset 0 0 0 1px var(--glass-edge);}
 .wallpaper-preview{position:relative;display:block;height:76px;overflow:hidden;border-radius:6px;background:var(--base);}
 .wallpaper-preview span{position:absolute;inset:-60%;background:repeating-linear-gradient(160deg,var(--base) 5%,var(--mid) 19%,var(--light) 23%,var(--mid) 25%,var(--base) 36%);transform:rotate(-18deg);}
 .chrome span{background:repeating-radial-gradient(ellipse at 70% 50%,var(--base) 0%,var(--mid) 9%,var(--light) 11%,var(--base) 18%);transform:rotate(-30deg) scaleY(.7);}
 .dunes span{background:repeating-linear-gradient(175deg,var(--base) 0%,var(--mid) 18%,var(--light) 21%,var(--base) 23%);transform:rotate(15deg);}
 .aurora span{inset:0;background:radial-gradient(ellipse at 80% 115%,var(--mid),transparent 60%),repeating-linear-gradient(105deg,transparent 5%,var(--mid) 30%,var(--light) 32%,transparent 35%);opacity:.8;mask-image:linear-gradient(transparent,#000 30%,transparent 95%);}
 .ocean span{inset:0;background:linear-gradient(var(--light) 0%,#9b695f 37%,var(--base) 39%,var(--mid) 65%,var(--base));transform:none;}
 .nebula span{inset:0;background:radial-gradient(ellipse at 70% 40%,var(--light),transparent 50%),radial-gradient(ellipse at 20% 80%,var(--mid),var(--base) 70%);transform:rotate(-15deg) scale(1.3);}
 .ribbons span{inset:-50%;background:repeating-linear-gradient(155deg,var(--base) 0%,var(--base) 15%,var(--mid) 17%,var(--light) 18%,var(--base) 20%);transform:rotate(-15deg) scaleY(.6);}
 .warp span{inset:0;background:repeating-radial-gradient(ellipse at 65% 45%,var(--base) 0%,var(--mid) 2%,var(--base) 3%,var(--base) 15%);transform:none;}
 .wallpaper-name{display:flex;justify-content:space-between;align-items:center;padding:9px 3px 4px;font-size:11px;line-height:1.3;}
 @media(max-width:720px){.picker-label{display:none;}summary{padding:6px;}.wallpaper-panel{position:fixed;top:44px;right:9px;width:min(294px,calc(100vw - 18px));}}
</style>
