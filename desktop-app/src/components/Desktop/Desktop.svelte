<script lang="ts">
 import { onMount } from 'svelte';
 import Dock from '../Dock/Dock.svelte';
 import ThemeSwitch from './ThemeSwitch.svelte';
 import WallpaperSwitch from './WallpaperSwitch.svelte';
 import WindowsArea from './Window/WindowsArea.svelte';
 import LiveWallpaper from './LiveWallpaper.svelte';
 import {t,icons,appList} from '../../portfolio/registry';
 import {finishWindowMotion} from '../../portfolio/window-motion';
 import {ui} from '../../portfolio/ui.svelte';
 import {apps} from '../../state/apps.svelte';
 import {openApp,showDesktop,routeLocation,dismissApp} from '../../portfolio/actions';
 let clock=$state('');
 function updateClock(){clock=new Intl.DateTimeFormat(ui.locale,{month:'short',day:'numeric',weekday:'short',hour:'2-digit',minute:'2-digit',hour12:false}).format(new Date());}
 function setLocale(locale:string){(window as any).PortfolioI18n.applyLocale(locale);}
 onMount(()=>{
  const locale=()=>{ui.locale=document.documentElement.lang;document.querySelectorAll<HTMLElement>("[data-desktop-text]").forEach(node=>node.textContent=t(node.dataset.desktopText!));updateClock();};
  const media=matchMedia('(prefers-reduced-motion: reduce)');
  const motion=()=>{ui.reduced=media.matches;if(ui.reduced)finishWindowMotion();};
  const resize=()=>ui.compact=innerWidth<=720;
  const key=(event:KeyboardEvent)=>{if(event.key==='Escape'&&apps.active&&!document.fullscreenElement){event.preventDefault();dismissApp(apps.active);}};
  const click=(event:MouseEvent)=>{
   const target=event.target as HTMLElement;
   const launcher=target.closest<HTMLElement>('.mac-project-launcher');
   if(launcher){event.preventDefault();openApp(launcher.dataset.appOpen!);return;}
   const link=target.closest<HTMLAnchorElement>('a[href^="#"]');if(!link)return;
   const hash=link.getAttribute('href')!.slice(1);
   if(hash==='top'){event.preventDefault();showDesktop();return;}
   if(hash==='main-content'){event.preventDefault();openApp('projects');return;}
   const app=appList.find(value=>value.hash===hash||document.getElementById(hash)?.closest(`#mac-window-${value.id}`));
   if(app){event.preventDefault();openApp(app.id);}
  };
  document.addEventListener('portfolio:localechange',locale);document.addEventListener('click',click);document.addEventListener('keydown',key);
  window.addEventListener('popstate',routeLocation);window.addEventListener('hashchange',routeLocation);window.addEventListener('resize',resize);media.addEventListener('change',motion);
  const timer=setInterval(updateClock,30000);updateClock();
  document.documentElement.classList.add('desktop-ready');document.body.classList.add('has-desktop');
  document.querySelectorAll('.is-pending').forEach(node=>node.classList.remove('is-pending'));routeLocation();
  return()=>{clearInterval(timer);document.removeEventListener('portfolio:localechange',locale);document.removeEventListener('click',click);document.removeEventListener('keydown',key);window.removeEventListener('popstate',routeLocation);window.removeEventListener('hashchange',routeLocation);window.removeEventListener('resize',resize);media.removeEventListener('change',motion);};
 });
</script>
<div class="container mac-desktop">
 <LiveWallpaper/>
 <header class="mac-menubar">
  <div class="mac-menu-left"><button class="mac-home" data-desktop-home aria-label={t('home')} onclick={()=>showDesktop()}><img src="./assets/images/cat-logo.svg" width="22" height="22" alt=""/></button><button class="mac-brand" onclick={()=>openApp('about')}>Jason Chen</button><span class="mac-current-app">{apps.active?t(apps.active):t('desktop')}</span><button class="mac-menu-link" onclick={()=>openApp('projects')}>{t('projects')}</button><button class="mac-menu-link" onclick={()=>openApp('contact')}>{t('contact')}</button></div>
  <div class="mac-menu-right"><WallpaperSwitch/><ThemeSwitch/><div class="mac-locales" aria-label="语言 / Language"><button data-desktop-locale="zh-CN" aria-pressed={ui.locale==='zh-CN'} onclick={()=>setLocale('zh-CN')}>中</button><button data-desktop-locale="en" aria-pressed={ui.locale==='en'} onclick={()=>setLocale('en')}>EN</button></div><time class="mac-clock">{clock}</time></div>
 </header>
 <div class="mac-desktop-intro"><p class="mac-overline">{t('role')}</p><p class="mac-greeting">{t('greeting')}</p><p class="mac-headline">{t('headline')}</p><p class="mac-description">{t('subtitle')}</p><button class="mac-explore" onclick={()=>openApp('projects')}><span>{t('explore')}</span><span aria-hidden="true">↗</span></button></div>
 <nav class="mac-shortcuts" aria-label={t('navigation')}>
  {#each [{id:'about',label:'file'},{id:'projects',label:'folder'},{id:'contact',label:'note'}] as item}<button class="mac-shortcut" onclick={()=>openApp(item.id)}><span class="mac-file-icon">{@html icons[item.id]}</span><span>{t(item.label)}</span></button>{/each}
 </nav>
 <p class="mac-desktop-signature">JASON’S WORKSPACE<span>{t('made')}</span></p>
 <WindowsArea/>
 <Dock/>
</div>
<style>.container{height:100%;width:100%;position:fixed;inset:0;background-position:center;background-size:cover;}</style>
