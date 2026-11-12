<script lang="ts">
 // Adapted from macos-web Window.svelte: same neodrag attachment, focus layering,
 // saved maximize transform; portfolio bridge replaces AppNexus, native motion wraps its surface.
 import {bounds,BoundsFrom,Compartment,ControlFrom,controls,disabled,draggable,events,position,transform} from '@neodrag/svelte';
 import {onMount,tick} from 'svelte';
 import {finishWindowMotion} from '../../../portfolio/window-motion';
 import {apps} from '../../../state/apps.svelte';
 import {apps_config,t,appList} from '../../../portfolio/registry';
 import {ui} from '../../../portfolio/ui.svelte';
 import {contentBridge,focusApp,dismissApp} from '../../../portfolio/actions';
 import TrafficLights from './TrafficLights.svelte';
 const {app_id}:{app_id:string}=$props();
 let windowEl:HTMLElement;let maximized=$state(false);let savedTransform='';
 const width=Math.min(1050,innerWidth-(innerWidth<=720?14:80));
 const height=Math.min(720,innerHeight-170);
 const offset=(appList.findIndex(app=>app.id===app_id)%4)*7;
 const defaultPosition={x:Math.max(7,(innerWidth-width)/2+offset),y:Math.max(43,(innerHeight-height)/2-40+offset)};
 const controlsComp=new Compartment();
 $effect(()=>{apps.open[app_id];apps.minimized[app_id];maximized;tick().then(()=>{controlsComp.current={...controls({allow:ControlFrom.selector('.app-window-drag-handle'),block:ControlFrom.selector('button')}),liveUpdate:true};});});
 const positionComp=Compartment.of(()=>position({default:defaultPosition}));
 const disabledComp=Compartment.of(()=>disabled(maximized||ui.compact));
 function maximizeApp(){
  if(!windowEl)return;
  finishWindowMotion(app_id);
  if(!maximized){savedTransform=windowEl.style.transform;windowEl.style.transform='translate(0px,0px)';}
  else windowEl.style.transform=savedTransform;
  maximized=!maximized;apps.fullscreen[app_id]=maximized;
 }
 $effect(()=>{if(!apps.open[app_id]&&maximized){if(windowEl)windowEl.style.transform=savedTransform;maximized=false;}});
 onMount(()=>{
  const resize=()=>{
   finishWindowMotion(app_id);
   const nextWidth=Math.min(1050,innerWidth-(innerWidth<=720?14:80));
   const nextHeight=Math.min(720,innerHeight-170);
   controlsComp.current={...controls({allow:ControlFrom.selector('.app-window-drag-handle'),block:ControlFrom.selector('button')}),liveUpdate:true};
   positionComp.current=position({current:{x:Math.max(7,(innerWidth-nextWidth)/2+offset),y:Math.max(43,(innerHeight-nextHeight)/2-40+offset)}});
  };
  const settled=()=>{controlsComp.current={...controls({allow:ControlFrom.selector('.app-window-drag-handle'),block:ControlFrom.selector('button')}),liveUpdate:true};};
  windowEl.addEventListener('window-motion-settled',settled);
  window.addEventListener('resize',resize);return()=>{window.removeEventListener('resize',resize);windowEl.removeEventListener('window-motion-settled',settled);};
 });
 function onDragStart(){focusApp(app_id);apps.is_being_dragged=true;}
 function onDragEnd(){apps.is_being_dragged=false;}
</script>
<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<div hidden={!apps.open[app_id]||apps.minimized[app_id]} inert={apps.exiting[app_id]} class="container mac-window" id="mac-window-{app_id}" role="dialog" aria-labelledby="mac-title-{app_id}" class:active={apps.active===app_id} class:is-focused={apps.active===app_id} class:is-maximized={maximized} style:z-index={apps.z_indices[app_id]} bind:this={windowEl} tabindex="-1" onpointerdown={()=>focusApp(app_id)} onfocusin={()=>focusApp(app_id)}
 {@attach draggable(()=>[transform(({offset,rootNode})=>{(rootNode as HTMLElement).style.transform=`translate(${offset.x}px,${offset.y}px)`;}),controlsComp,bounds(BoundsFrom.viewport({top:40,left:7,right:7,bottom:100})),disabledComp,positionComp,events({onDragStart,onDragEnd})])}>
 <div class="mac-window-visual">
 <!-- svelte-ignore a11y_no_static_element_interactions -->
 <header class="mac-titlebar app-window-drag-handle" ondblclick={event=>{if(!(event.target as HTMLElement).closest('button'))maximizeApp();}}>
 <TrafficLights {app_id} on_close_app={()=>dismissApp(app_id)} on_minimize_click={()=>dismissApp(app_id,true)} on_maximize_click={maximizeApp}/>
 <span class="mac-window-title" id="mac-title-{app_id}">{t(apps_config[app_id].key)}</span>
 </header>
 <!-- Keyboard-focusable scrolling region for long project content. -->
 <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
 <div class="mac-window-body" tabindex="0" use:contentBridge={app_id}></div>
 </div>
</div>
<style>
 .container{--elevated-shadow:0px 8.5px 10px rgba(0,0,0,.115),0px 68px 80px rgba(0,0,0,.23);position:absolute;left:0;top:0;width:min(1050px,calc(100vw - 80px));height:min(720px,calc(100dvh - 170px));display:flex;flex-direction:column;border-radius:.75rem;overflow:visible;pointer-events:auto;color:#252a32;--paper:#f8f9fb;--paper-deep:#f0f2f6;--ink:#252a32;--ink-2:#4f5763;--muted:#697384;--line:#28395520;--serif:var(--sans);}
 .mac-window-visual{display:flex;flex-direction:column;width:100%;height:100%;min-height:0;border-radius:inherit;overflow:hidden;box-shadow:var(--elevated-shadow);background:#f8f9fb;border:1px solid #ffffff88;transform-origin:center;will-change:auto}
 .container[hidden]{display:none!important}
 .container.active{--elevated-shadow:0px 8.5px 10px rgba(0,0,0,.28),0px 68px 80px rgba(0,0,0,.56);}
 .container.is-maximized{left:12px;top:44px;width:calc(100vw - 24px);height:calc(100dvh - 136px);transform:none!important;translate:none!important;}
 .mac-titlebar{height:49px;flex-shrink:0;display:flex;align-items:center;gap:20px;padding:0 17px;background:#ececf1ed;border-bottom:1px solid #d8dce3;user-select:none;touch-action:none;cursor:grab;}
 .mac-window-title{position:absolute;left:100px;right:100px;text-align:center;font-size:12px;font-weight:600;pointer-events:none;}
 .mac-window-body{overflow:auto;min-height:0;flex:1;overscroll-behavior:contain;scrollbar-width:thin;scrollbar-color:#c5cad2 transparent;}
 @media(max-width:720px){.container,.container.is-maximized{left:7px;top:43px;width:calc(100vw - 14px);height:calc(100dvh - 129px - env(safe-area-inset-bottom));transform:none!important;translate:none!important;border-radius:10px}.mac-titlebar{height:45px;padding:0 15px}.mac-window-title{font-size:11px;left:100px;right:10px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}}
</style>
