<script lang="ts">
 import { untrack } from 'svelte';
 import {baseWidth,nativeWidth} from './magnification';
 import { sineInOut } from 'svelte/easing';
 import { spring, tweened } from 'svelte/motion';
 import { apps } from '../../state/apps.svelte';
 import { ui } from '../../portfolio/ui.svelte';
 import { icons, t } from '../../portfolio/registry';
 import { openApp } from '../../portfolio/actions';
 const {mouse_x,app_id,magnification}: {mouse_x:number|null;app_id:string;magnification:number}=$props();
 let image_el=$state<HTMLElement>();
 const width_px=spring(baseWidth,{damping:0.47,stiffness:0.12});
 $effect(()=>{
  const pointer=mouse_x,image=image_el,gain=magnification;
  if(ui.reduced||ui.compact||ui.scrollable||apps.is_being_dragged){untrack(()=>width_px.set(baseWidth,{hard:true}));return;}
  const frame=requestAnimationFrame(()=>{
   const rect=image?.getBoundingClientRect();
   const target=pointer!==null&&rect?baseWidth+(nativeWidth(pointer-rect.left-rect.width/2)-baseWidth)*gain:baseWidth;
   width_px.set(target);
  });
  // A new pointer/capability update owns its own measurement. An old RAF must
  // not reapply a stale target after leaving, scrolling, or reduced-motion.
  return()=>cancelAnimationFrame(frame);
 });
 const appOpenIconBounceTransform=tweened(0,{duration:400,easing:sineInOut});
 async function launch(){
  if(app_id==='github'){window.open('https://github.com/Jason-chen-coder','_blank','noopener,noreferrer');return;}
  const alreadyOpen=apps.open[app_id];openApp(app_id);
  if(!alreadyOpen&&!ui.reduced){await appOpenIconBounceTransform.set(-28);appOpenIconBounceTransform.set(0);}
 }
</script>

<button onclick={launch} aria-label={t(app_id)} aria-expanded={app_id==='github'?undefined:!!apps.open[app_id]&&!apps.minimized[app_id]} aria-controls={app_id==='github'?undefined:`mac-window-${app_id}`} class="dock-open-app-button mac-dock-item {app_id}" data-dock={app_id} data-app-open={app_id}>
 <p class="tooltip mac-dock-tooltip" class:tooltip-enabled={!apps.is_being_dragged} style:transform="translate(0, {$appOpenIconBounceTransform}px)">{t(app_id)}</p>
 <span style:transform="translate(0, {$appOpenIconBounceTransform}px)"><span class="mac-dock-icon" bind:this={image_el} style:width="{ui.compact?44:$width_px}px">{@html icons[app_id]}</span></span>
 <div class="dot mac-dock-dot" style:--opacity={+!!apps.open[app_id]}></div>
</button>

<style>
	.mac-dock-icon { display:block; aspect-ratio:1; will-change:width; }
 :global(.mac-dock-icon svg){width:100%;height:100%;filter:drop-shadow(0 2px 3px #0003)}

	button {
		background:none;border:0;padding:0 3px;color:inherit;
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		position: relative;

		border-radius: 0.5rem;

		&:hover,
		&:focus-visible {
			.tooltip.tooltip-enabled {
				display: block;
			}
		}

		& > span {
			display: flex;
			justify-content: center;
			align-items: center;
		}
	}

	.tooltip {
		--double-border: 0 0 0 0 white;

		white-space: nowrap;

		position: absolute; bottom:calc(100% + 18px); left:50%; translate:-50% 0;

		background-color: hsla(var(--system-color-light-hsl), 0.5);
		backdrop-filter: blur(5px);

		padding: 0.5rem 0.75rem;
		border-radius: 0.375rem;

		box-shadow:
			hsla(0deg, 0%, 0%, 30%) 0px 1px 5px 2px,
			var(--double-border);

		color: var(--system-color-light-contrast);
		font-family: var(--system-font-family);
		font-weight: 400;
		font-size: 0.9rem;
		letter-spacing: 0.4px;

		display: none;

		&.dark {
			--double-border: inset 0 0 0 0.9px hsla(var(--system-color-dark-hsl), 0.3),
				0 0 0 1.2px hsla(var(--system-color-light-hsl), 0.3);
		}
	}

	.dot {
		position: absolute;
		bottom: -7px;
		left: 50%;
		translate: -50% 0;

		height: 4px;
		width: 4px;

		margin: 0;

		border-radius: 50%;

		background-color: var(--system-color-dark);

		opacity: var(--opacity);
	}
	.pwa-badge {
		position: absolute;
		top: 1px;
		right: -1px;

		background-color: rgba(248, 58, 58, 0.85);

		box-shadow: hsla(var(--system-color-dark-hsl), 0.4) 0px 0.5px 2px;
		border-radius: 50%;

		pointer-events: none;
		vertical-align: middle;

		width: 1.5rem;
		height: 1.5rem;

		margin: 0;
		padding: 0;

		text-align: center;
		color: white;

		font-size: 1rem;
		line-height: 1.5;
	}
</style>
