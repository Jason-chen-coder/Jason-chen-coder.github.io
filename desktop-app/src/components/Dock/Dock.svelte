<svelte:options runes={true} />

<script lang="ts">
 import { onMount } from 'svelte';
 import { dockApps,t } from '../../portfolio/registry';
 import { ui } from '../../portfolio/ui.svelte';
 import DockItem from './DockItem.svelte';
 import {baseWidth,compactWidth,maximumGrowth} from './magnification';
 let dock_mouse_x=$state<number|null>(null);
 let viewport:HTMLDivElement;let dock:HTMLElement;let region:HTMLElement;
 let magnification=$state(0);
 function checkOverflow(){
  if(!region||!dock)return;
  const numeric=(value:string)=>parseFloat(value)||0;
  const panel=getComputedStyle(dock);
  let resting=numeric(panel.paddingLeft)+numeric(panel.paddingRight)+numeric(panel.borderLeftWidth)+numeric(panel.borderRightWidth),count=0,minExtra=Infinity;
  for(const child of dock.children){
   const style=getComputedStyle(child),extra=numeric(style.paddingLeft)+numeric(style.paddingRight)+numeric(style.borderLeftWidth)+numeric(style.borderRightWidth)+numeric(style.marginLeft)+numeric(style.marginRight);
   if(child.matches('[data-dock]')){resting+=(ui.compact?compactWidth:baseWidth)+extra;count++;minExtra=Math.min(minExtra,extra);}
   else resting+=numeric(style.width)+numeric(style.marginLeft)+numeric(style.marginRight);
  }
  const available=Math.max(0,region.clientWidth-24);
  ui.scrollable=resting>available+1;
  magnification=ui.compact||ui.scrollable?0:Math.min(1,Math.max(0,available-resting-2)/maximumGrowth(count,baseWidth+(Number.isFinite(minExtra)?minExtra:0)));
 }
 // The region is viewport-sized. Observing animated content width creates a
 // grow → overflow → hard reset → grow feedback loop near the viewport edge.
 onMount(()=>{const observer=new ResizeObserver(checkOverflow);observer.observe(region);checkOverflow();return()=>observer.disconnect();});
 $effect(()=>{ui.compact;checkOverflow();});
 function wheel(event:WheelEvent){if(ui.scrollable&&Math.abs(event.deltaY)>Math.abs(event.deltaX)){event.preventDefault();viewport.scrollLeft+=event.deltaY;}}
</script>
<section class="dock-container mac-dock-region" class:is-scrollable={ui.scrollable} bind:this={region}>
 <div class="mac-dock-viewport" bind:this={viewport} onwheel={wheel}>
 <!-- svelte-ignore a11y_no_static_element_interactions -->
 <nav class="dock-el mac-dock" aria-label={t('navigation')} bind:this={dock} onpointermove={event=>dock_mouse_x=event.pointerType==='touch'?null:event.clientX} onpointerleave={()=>dock_mouse_x=null} onfocusin={event=>{if(ui.scrollable)(event.target as HTMLElement).closest('button')?.scrollIntoView({block:'nearest',inline:'nearest'});}}>
  {#each dockApps as config}
   {#if config.id==='github'}<div class="divider" aria-hidden="true"></div>{/if}
   <DockItem mouse_x={dock_mouse_x} app_id={config.id} {magnification}/>
  {/each}
 </nav>
 </div>
 <p class="dock-scroll-hint">{t('dockScroll')}</p>
</section>
<style>
	.dock-container {
		position:fixed;z-index:300; padding-bottom: 0.7rem;
		left: 0;
		bottom: 0;

		width: 100%;
		height: auto;

		padding: 0.4rem;

		display: flex;
		justify-content: center;

		&:not(.dock-hidden) {
			pointer-events: none;
		}
	}

	.mac-dock-viewport{max-width:calc(100vw - 24px);overflow:visible;pointer-events:auto;}
 .is-scrollable .mac-dock-viewport{overflow-x:auto;overflow-y:hidden;scrollbar-width:none;}
 .dock-scroll-hint{display:none;position:absolute;bottom:100%;font-size:10px;color:white;text-shadow:0 1px 4px #0008;letter-spacing:.05em;}
 .is-scrollable .dock-scroll-hint{display:block;}
 @media(max-width:720px){.dock-container{bottom:env(safe-area-inset-bottom)}.dock-el{height:64px!important}.dock-scroll-hint{font-size:9px;white-space:nowrap}.is-scrollable .mac-dock-viewport{padding-top:0}}
 @media(max-height:500px){.dock-scroll-hint{display:none!important}}
	.dock-el {
		background-color: hsla(var(--system-color-light-hsl), 0.4);

		box-shadow:
			inset 0 0 0 0.2px hsla(var(--system-color-grey-100-hsl), 0.7),
			0 0 0 0.2px hsla(var(--system-color-grey-900-hsl), 0.7),
			hsla(0, 0%, 0%, 0.3) 2px 5px 19px 7px;

		position: relative; width:max-content;

		padding: 10px 0.3rem;

		border-radius: 1.2rem;

		height: auto;

		display: flex;
		align-items: center;

		transition: transform 0.3s ease;

		&:not(.hidden) {
			pointer-events: auto;
		}

		&::before {
			content: '';

			border-radius: 20px;

			width: 100%;
			height: 100%;

			border: inherit;

			backdrop-filter: blur(10px);

			position: absolute;
			top: 0;
			left: 0;

			z-index: -1;
		}
	}

	.divider {
		height: 100%;
		width: 1px;flex-shrink:0;

		background-color: hsla(var(--system-color-dark-hsl), 0.3);

		margin: 0 4px;
	}
</style>
