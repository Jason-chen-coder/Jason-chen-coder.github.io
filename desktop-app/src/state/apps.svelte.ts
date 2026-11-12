// Adapted from PuruVJ/macos-web: open/fullscreen/z-order app state.
import { appList } from '../portfolio/registry';
export type AppID = string;
export const apps = $state({
 open: Object.fromEntries(appList.map(app => [app.id, false])) as Record<string, boolean>,
 exiting: {} as Record<string, boolean>,
 minimized: {} as Record<string, boolean>,
 active: '', active_z_index: 0,
 z_indices: Object.fromEntries(appList.map(app => [app.id, 0])) as Record<string, number>,
 is_being_dragged: false,
 fullscreen: {} as Record<string, boolean>
});
