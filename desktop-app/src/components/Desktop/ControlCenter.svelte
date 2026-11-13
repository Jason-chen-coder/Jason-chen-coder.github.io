<script lang="ts">
 import {onMount,tick} from 'svelte';
 import {fly} from 'svelte/transition';
 import {ui} from '../../portfolio/ui.svelte';
 import {wallpaper,wallpaperOptions} from './wallpaper/preferences.svelte';
 import ThemeSwitch from './ThemeSwitch.svelte';
 import WallpaperSwitch from './WallpaperSwitch.svelte';
 let panel:HTMLDivElement;
 let trigger:HTMLButtonElement;
 let back=$state<HTMLButtonElement>();
 let open=$state(false);
 let view=$state<'home'|'appearance'|'wallpaper'|'language'>('home');
 const copy=$derived(ui.locale==='en'?{title:'Control Center',appearance:'Appearance',wallpaper:'Wallpaper',language:'Language',back:'Back',light:'Light',dark:'Dark',system:'System'}:{title:'控制中心',appearance:'外观',wallpaper:'壁纸',language:'语言',back:'返回',light:'浅色',dark:'深色',system:'跟随系统'});
 const selected=$derived(wallpaperOptions.find(option=>option.id===wallpaper.current)!);
 let theme=$state<'light'|'dark'|'system'>((window as any).PortfolioTheme.preference);
 function close(){open=false;trigger.focus();}
 async function enter(next:typeof view){view=next;await tick();back?.focus();}
 async function home(){const previous=view;view='home';await tick();panel.querySelector<HTMLButtonElement>(`[data-control="${previous}"]`)?.focus();}
 function setLocale(locale:string){(window as any).PortfolioI18n.applyLocale(locale);}
 onMount(()=>{
  const sync=()=>theme=(window as any).PortfolioTheme.preference;
  const outside=(e:PointerEvent)=>{if(!panel.contains(e.target as Node))open=false;};
  const escape=(e:KeyboardEvent)=>{if(e.key==='Escape'&&open){e.preventDefault();e.stopImmediatePropagation();if(view==='home')close();else home();}};
  document.addEventListener('portfolio:themechange',sync);document.addEventListener('pointerdown',outside);document.addEventListener('keydown',escape,true);
  return()=>{document.removeEventListener('portfolio:themechange',sync);document.removeEventListener('pointerdown',outside);document.removeEventListener('keydown',escape,true);};
 });
</script>
<div class="control-center" bind:this={panel}>
 <button class="control-trigger" bind:this={trigger} aria-label={copy.title} title={copy.title} aria-expanded={open} aria-controls="control-panel" data-settings-toggle onclick={()=>{if(open)close();else{view='home';open=true;}}}>
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 3h12a4 4 0 0 1 0 8H7a4 4 0 0 1 0-8Zm0 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4ZM5 13h12a4 4 0 0 1 0 8H5a4 4 0 0 1 0-8Zm12 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z"/></svg>
 </button>
 {#if open}
 <div id="control-panel" class="control-panel" class:detail={view!=='home'} role="group" aria-label={copy.title} transition:fly={{y:-8,duration:ui.reduced?0:180}}>
  {#if view==='home'}
   <div class="control-grid">
    <button class="control-card appearance" data-control="appearance" onclick={()=>enter('appearance')}><span class="round-icon" aria-hidden="true">◐</span><span class="card-copy"><strong>{copy.appearance}</strong><small>{copy[theme]}</small></span><span class="chevron" aria-hidden="true">›</span></button>
    <button class="control-card wallpaper" data-control="wallpaper" onclick={()=>enter('wallpaper')}><span class="wallpaper-thumb" style={`--a:${selected.colors[0]};--b:${selected.colors[1]};--c:${selected.colors[2]}`} aria-hidden="true"></span><span class="card-copy"><strong>{copy.wallpaper}</strong><small>{ui.locale==='en'?selected.en:selected.zh}</small></span><span class="chevron" aria-hidden="true">›</span></button>
    <button class="control-card language" data-control="language" onclick={()=>enter('language')}><span class="round-icon blue" aria-hidden="true">文</span><span class="card-copy"><strong>{copy.language}</strong><small>{ui.locale==='en'?'English':'简体中文'}</small></span><span class="chevron" aria-hidden="true">›</span></button>
   </div>
  {:else}
   <header class="detail-header"><button class="back" bind:this={back} aria-label={copy.back} onclick={home}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m14 6-6 6 6 6"/></svg></button><strong>{copy[view]}</strong></header>
   <div class="detail-content" in:fly={{x:8,duration:ui.reduced?0:160}}>
    {#if view==='appearance'}<ThemeSwitch embedded/>
    {:else if view==='wallpaper'}<WallpaperSwitch embedded/>
    {:else}<div class="language-options" aria-label={copy.language}><button data-desktop-locale="zh-CN" aria-pressed={ui.locale==='zh-CN'} onclick={()=>setLocale('zh-CN')}>简体中文 <span>{ui.locale==='zh-CN'?'✓':''}</span></button><button data-desktop-locale="en" aria-pressed={ui.locale==='en'} onclick={()=>setLocale('en')}>English <span>{ui.locale==='en'?'✓':''}</span></button></div>{/if}
   </div>
  {/if}
 </div>
 {/if}
</div>
<style>
 .control-center{position:relative;}
 .control-trigger{display:flex;align-items:center;justify-content:center;padding:5px 7px;border-radius:7px;cursor:pointer;}
 .control-trigger:hover,.control-trigger[aria-expanded=true]{background:var(--glass-hover);}
 .control-panel{position:absolute;top:calc(100% + 10px);right:0;width:320px;box-sizing:border-box;max-width:calc(100vw - 18px);max-height:calc(100dvh - 56px);overflow-y:auto;overscroll-behavior:contain;padding:12px;border:1px solid #ffffff55;border-radius:26px;background:color-mix(in srgb,var(--glass-reading) 65%,transparent);color:var(--glass-ink);backdrop-filter:blur(36px) saturate(150%);-webkit-backdrop-filter:blur(36px) saturate(150%);box-shadow:inset 0 1px 0 #ffffff60,0 18px 48px #09132730;transform-origin:top right;}
 .control-panel{font-size:12px;line-height:1.4;}
 .control-panel :global(button){color:inherit;background:transparent;}
 .control-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;}
 .control-panel .control-card{position:relative;display:flex;align-items:center;gap:10px;min-width:0;padding:14px 12px!important;border-radius:22px!important;background:color-mix(in srgb,var(--glass-control) 70%,transparent);border:1px solid #ffffff38!important;box-shadow:inset 0 1px 0 #ffffff30,0 3px 8px #00000009;text-align:left;transition:background 150ms,transform 150ms;}
 .control-panel .control-card:hover{background:var(--glass-hover);transform:translateY(-1px);}
 .control-panel .control-card:active{transform:scale(.98);}
 .appearance,.language{grid-column:1;min-height:76px;}
 .control-panel .wallpaper{grid-column:2;grid-row:1 / 3;flex-direction:column;align-items:flex-start;justify-content:space-between;}
 .round-icon{display:grid;place-items:center;flex-shrink:0;width:34px;height:34px;border-radius:50%;background:#ffffffd9;color:#344153;font-size:24px;}
 .blue{color:#fff;background:#1589f5;font-size:16px;}
 .card-copy{display:grid;gap:4px;min-width:0;}
 strong{font-size:12px;font-weight:600;}
 small{font-size:10px;color:var(--glass-secondary);line-height:1.4;}
 .chevron{margin-left:auto;opacity:0;transition:opacity 150ms;font-size:20px;}
 .control-card:hover .chevron,.control-card:focus-visible .chevron{opacity:.65;}
 .wallpaper .chevron{position:absolute;right:12px;bottom:17px;}
 .wallpaper-thumb{display:block;width:100%;height:76px;border-radius:13px;background:repeating-linear-gradient(145deg,var(--a),var(--b) 30%,var(--c) 36%,var(--a) 55%);box-shadow:inset 0 0 0 1px #ffffff22;}
 .detail-header{display:flex;align-items:center;gap:8px;margin-bottom:10px;}
 .control-panel .back{display:grid;place-items:center;flex:0 0 30px;padding:0;line-height:1;width:30px;height:30px;border-radius:50%!important;background:var(--glass-control);}
 .detail-content :global(.embedded>summary){display:none!important;}
 .detail-content :global(.mac-theme-panel),.detail-content :global(.wallpaper-panel){position:static!important;width:100%!important;max-width:none!important;max-height:none!important;box-sizing:border-box;box-shadow:none!important;backdrop-filter:none!important;background:transparent!important;border:0!important;padding:0!important;}
 .detail-content :global(.mac-theme-heading),.detail-content :global(.mac-theme-hint){display:none;}
 .detail-content :global(.mac-theme-panel button){border-radius:16px;min-height:48px;line-height:20px;}
 .detail-content :global(.mac-theme-swatch){flex-shrink:0;}
 .detail-content :global(.wallpaper-preview){height:66px;border-radius:12px;}
 .language-options{display:grid;gap:4px;}
 .language-options button{display:flex;align-items:center;justify-content:space-between;gap:12px;min-height:44px;line-height:20px;padding:12px 15px!important;border-radius:16px!important;font-size:12px;}
 .language-options button span{display:grid;place-items:center;flex:0 0 20px;height:20px;}
 .language-options button:hover{background:var(--glass-hover);}
 .language-options button[aria-pressed=true]{background:var(--glass-hover);}
 @media(prefers-reduced-motion:reduce){.control-card,.chevron{transition:none;}.control-card:hover,.control-card:active{transform:none;}}
 @media(max-width:720px){.control-panel{position:fixed;right:9px;top:44px;}}
</style>