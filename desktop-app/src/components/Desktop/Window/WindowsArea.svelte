<script lang="ts">
 // Persistent component registry; each original Window bridges its actual app content on mount.
 import { appList } from '../../../portfolio/registry';
 import Window from './Window.svelte';
</script>
<section id="windows-area" class="mac-window-layer" aria-label="Windows">
 {#each appList as app}<Window app_id={app.id}/>{/each}
</section>
<style>section{position:fixed;inset:0;z-index:100;pointer-events:none;width:100vw;height:100%;}</style>
