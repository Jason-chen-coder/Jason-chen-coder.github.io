import { mount } from 'svelte';
import './portfolio/global.css';
import './portfolio/content.css';
import './portfolio/theme.css';
// Classic deferred scripts bind video/i18n handlers before any original node moves.
if (document.readyState === 'loading') await new Promise<void>(resolve => document.addEventListener('DOMContentLoaded', () => resolve(), {once:true}));
const {default: Desktop} = await import('./components/Desktop/Desktop.svelte');
const target=document.createElement('div'); target.id='macos-root'; document.body.append(target);
mount(Desktop,{target});
