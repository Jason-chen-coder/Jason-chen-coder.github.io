<script lang="ts">
 import {onMount, tick} from 'svelte';
 import {ui} from '../../portfolio/ui.svelte';
 let {embedded = false} = $props<{embedded?:boolean}>();
 type Theme = 'light' | 'dark' | 'system';
 const controller = (window as typeof window & {PortfolioTheme: {preference: Theme; set: (value: Theme, origin?: {x:number; y:number}) => void}}).PortfolioTheme;
 let preference = $state<Theme>(controller.preference);
 let panel: HTMLDetailsElement;
 let trigger: HTMLElement;
 const options: Theme[] = ['light', 'dark', 'system'];
 const copy = $derived(ui.locale === 'en' ? {title:'Appearance', light:'Light', dark:'Dark', system:'System', hint:'Follow your device settings'} : {title:'外观', light:'浅色', dark:'深色', system:'跟随系统', hint:'随设备外观自动切换'});
 async function choose(theme: Theme, event: MouseEvent) {
  const box = trigger.getBoundingClientRect();
  const origin = event.detail ? {x:event.clientX, y:event.clientY} : {x:box.x + box.width / 2, y:box.y + box.height / 2};
  if (!embedded) {panel.open = false;trigger.focus();}
  // Settle the closed popover before the browser captures the old appearance.
  await tick();
  controller.set(theme, origin);
 }
 onMount(() => {
  const sync = () => preference = controller.preference;
  const outside = (event: PointerEvent) => {if (!panel.contains(event.target as Node)) panel.open = false;};
  const escape = (event: KeyboardEvent) => {
   if (event.key === 'Escape' && panel.open) {event.preventDefault();event.stopImmediatePropagation();panel.open = false;trigger.focus();}
  };
  document.addEventListener('portfolio:themechange', sync);
  if (embedded) return () => document.removeEventListener('portfolio:themechange', sync);
  document.addEventListener('pointerdown', outside);
  document.addEventListener('keydown', escape, true);
  return () => {document.removeEventListener('portfolio:themechange', sync);document.removeEventListener('pointerdown', outside);document.removeEventListener('keydown', escape, true);};
 });
</script>
<details class="mac-theme" bind:this={panel} open={embedded} class:embedded>
 <summary bind:this={trigger} aria-label={`${copy.title}: ${copy[preference]}`} title={copy.title} data-theme-toggle>
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
   {#if preference === 'system'}<rect x="3" y="4" width="18" height="13" rx="2"/><path d="M8 21h8m-4-4v4"/>
   {:else if preference === 'dark'}<path d="M20.5 13.1A8.5 8.5 0 0 1 10.9 3.5a8.5 8.5 0 1 0 9.6 9.6Z"/>
   {:else}<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.4 1.4m11.2 11.2L19 19M5 19l1.4-1.4M17.6 6.4 19 5"/>{/if}
  </svg><span class="mac-theme-label">{copy.title}</span>
 </summary>
 <div class="mac-theme-panel" role="group" aria-label={copy.title}>
  <p class="mac-theme-heading">{copy.title}</p>
  {#each options as theme}<button type="button" data-theme-option={theme} aria-pressed={preference === theme} onclick={(event) => choose(theme, event)}><span class="mac-theme-swatch {theme}" aria-hidden="true"></span><span>{copy[theme]}</span><span class="mac-theme-check" aria-hidden="true">{preference === theme ? '✓' : ''}</span></button>{/each}
  <p class="mac-theme-hint">{copy.hint}</p>
 </div>
</details>
