import { tick } from 'svelte';
import { animateWindow, interruptWindowMotion } from './window-motion';
import { apps } from '../state/apps.svelte';
import { apps_config, appList } from './registry';
const focusReturn = new Map<string, HTMLElement>();
const versions = new Map<string, number>();
let navigationVersion = 0;
function begin(id: string) { const version = (versions.get(id) || 0) + 1; versions.set(id, version); return { version, frame: interruptWindowMotion(id) }; }
function focusAfterRender(target: () => HTMLElement | null | undefined, version: number) { void tick().then(() => { if (version === navigationVersion) target()?.focus({ preventScroll:true }); }); }
function route(hash: string) { history.pushState(null, '', `${location.pathname}${location.search}${hash ? `#${hash}` : ''}`); }
export function focusApp(id: string) {
 apps.active = id;
 if (apps.active_z_index > 10000) {
  Object.keys(apps.z_indices).sort((a,b) => apps.z_indices[a]-apps.z_indices[b]).forEach((key,index) => apps.z_indices[key]=index+1);
  apps.active_z_index=appList.length;
 }
 apps.z_indices[id] = ++apps.active_z_index;
}
export async function openApp(id: string, updateRoute = true) {
 if (!apps_config[id]) return;
 const restoring = !!apps.minimized[id];
 const reveal = !apps.open[id] || restoring || apps.exiting[id];
 const { version, frame } = begin(id);
 const window = document.getElementById(`mac-window-${id}`);
 if (document.activeElement instanceof HTMLElement && document.activeElement !== document.body && !window?.contains(document.activeElement)) focusReturn.set(id, document.activeElement);
 apps.exiting[id] = false; apps.open[id] = true; apps.minimized[id] = false; focusApp(id);
 const navigation = ++navigationVersion;
 if (updateRoute && location.hash !== `#${apps_config[id].hash}`) route(apps_config[id].hash);
 focusAfterRender(() => document.querySelector<HTMLElement>(`#mac-window-${id} [data-window-action='close']`), navigation);
 await tick();
 if (versions.get(id) !== version) return;
 if (reveal || frame) await animateWindow(id, restoring ? 'restoring' : 'opening', frame, focusReturn.get(id));
}
export function pauseApp(id: string) { document.querySelectorAll<HTMLVideoElement>(`#mac-window-${id} video`).forEach(video=>video.pause()); }
export async function dismissApp(id: string, minimize=false) {
 if (!apps.open[id] || apps.minimized[id]) return;
 const { version, frame } = begin(id);
 pauseApp(id); apps.exiting[id] = true;
 const navigation = ++navigationVersion;
 const next = appList.filter(app=>apps.open[app.id]&&!apps.minimized[app.id]&&!apps.exiting[app.id]).sort((a,b)=>apps.z_indices[b.id]-apps.z_indices[a.id])[0];
 if (next) { focusApp(next.id); route(next.hash); }
 else { apps.active=''; route(''); }
 focusAfterRender(() => next ? document.querySelector<HTMLElement>(`#mac-window-${next.id} [data-window-action='close']`) : focusReturn.get(id), navigation);
 await animateWindow(id, minimize ? 'minimizing' : 'closing', frame, focusReturn.get(id));
 if (versions.get(id) !== version) return;
 if (minimize) apps.minimized[id] = true; else { apps.open[id] = false; apps.fullscreen[id] = false; }
 apps.exiting[id] = false;
}
export function showDesktop(updateRoute=true) {
 ++navigationVersion;
 for (const app of appList) { begin(app.id); pauseApp(app.id); apps.exiting[app.id] = false; if(apps.open[app.id]) apps.minimized[app.id]=true; }
 apps.active=''; if(updateRoute)route('');
}
export function routeLocation() {
 let hash='';try{hash=decodeURIComponent(location.hash.slice(1));}catch{return;}
 const target=document.getElementById(hash);
 const app=appList.find(value=>value.hash===hash || target?.closest(`#mac-window-${value.id}`));
 if(app)openApp(app.id,false);else if(!hash||hash==='top')showDesktop(false);
}
export function contentBridge(node: HTMLElement, id: string) {
 const config=apps_config[id]; const content=config.content||document.getElementById(config.hash);
 node.append(content); content.querySelectorAll('.is-pending').forEach((el:Element)=>el.classList.remove('is-pending'));
 return {destroy(){document.getElementById('main-content')?.append(content);}};
}
