import { ui } from './ui.svelte';
import './window-motion.css';
type GenieGeometry = { rect: DOMRect; target: { x: number; y: number; width: number; height: number } };
export type MotionFrame = { transform: string; opacity: string; genie?: number; geometry?: GenieGeometry };
type Phase = 'opening' | 'restoring' | 'minimizing' | 'closing';
type Motion = { animations: Animation[]; visual: HTMLElement; window: HTMLElement; cleanup: () => void; progress?: () => number; geometry?: GenieGeometry };
const motions = new Map<string, Motion>();
// Focus order is bounded near 10,000 in focusApp. Temporary presentations use
// their own order above that tier, inside windows-area (below the Dock/menu).
// This lets focus move immediately without painting over an outgoing surface.
let presentationOrder = 0;
function presentationLevel() {
 if (!motions.size) presentationOrder = 0;
 return String(1_000_000 + ++presentationOrder);
}
function clearPresentation(window: HTMLElement) {
 delete window.dataset.windowMotion;
 window.style.removeProperty('--window-motion-z-index');
}
const clamp = (n: number, min = 0, max = 1) => Math.min(max, Math.max(min, n));
const pace = (t: number) => t - Math.sin(2 * Math.PI * t) / (2 * Math.PI);
const smooth = (n: number) => { const t = clamp(n); return t * t * (3 - 2 * t); };

/** Capture the current funnel progress before removing its temporary presentation. */
export function interruptWindowMotion(id: string): MotionFrame | undefined {
 const current = motions.get(id);
 if (!current) return;
 const style = getComputedStyle(current.visual);
 const frame = { transform: style.transform, opacity: style.opacity, genie: current.progress?.(), geometry: current.geometry };
 motions.delete(id); current.animations.forEach(animation => animation.cancel()); current.cleanup();
 clearPresentation(current.window);
 return frame;
}
export function finishWindowMotion(id?: string) {
 for (const [key, current] of motions) if (!id || id === key) current.animations.forEach(animation => animation.finish());
}
function dockTarget(id: string, rect: DOMRect, fallback?: HTMLElement) {
 const dock = document.querySelector<HTMLElement>(`[data-dock="${id}"]`);
 const target = dock || fallback;
 if (!target?.isConnected || !target.getClientRects().length) return { x: rect.left + rect.width / 2, y: rect.top + rect.height * .8, width: 58, height: 38 };
 const box = target.getBoundingClientRect();
 const clip = (dock?.closest('.mac-dock-viewport') as HTMLElement)?.getBoundingClientRect();
 const width = Math.min(box.width, 58), height = Math.min(box.height, 58);
 const icon = dock?.querySelector<HTMLElement>('.mac-dock-icon'), dot = dock?.querySelector<HTMLElement>('.mac-dock-dot');
 const centerY = icon ? box.bottom - (dot?.offsetHeight || 0) - (dot ? parseFloat(getComputedStyle(dot).marginTop) || 0 : 0) - icon.offsetHeight / 2 : box.top + box.height / 2;
 return { x: clamp(box.left + box.width / 2, Math.max(8, clip?.left ?? 8) + width / 2, Math.min(innerWidth - 8, clip?.right ?? innerWidth - 8) - width / 2), y: clamp(centerY, 36 + height / 2, innerHeight - height / 2 - 8), width, height };
}

/** One frozen DOM presentation, never a second live player. Canvas/video pixels
 * are captured once and reused by all slices; the real media nodes stay put. */
function frozenVisual(visual: HTMLElement, rect: DOMRect) {
 const copy = visual.cloneNode(true) as HTMLElement;
 const originals = [visual, ...visual.querySelectorAll<HTMLElement>('*')];
 const clones = [copy, ...copy.querySelectorAll<HTMLElement>('*')];
 const scrolls: { index: number; top: number; left: number }[] = [];
 originals.forEach((original, index) => {
  const clone = clones[index];
  if (original instanceof SVGElement && original.id) clone.setAttribute('data-genie-svg-id', original.id);
  clone.removeAttribute('id');
  for (const attribute of [...clone.attributes]) {
   if (attribute.name.startsWith('on') || /^(aria-labelledby|aria-describedby|aria-controls|aria-owns|for|autoplay|name)$/.test(attribute.name)) clone.removeAttribute(attribute.name);
  }
  if (original.scrollTop || original.scrollLeft) scrolls.push({ index, top: original.scrollTop, left: original.scrollLeft });
  if (original instanceof HTMLVideoElement || original instanceof HTMLCanvasElement) {
   const image = document.createElement('img'); image.className = original.className; image.style.cssText = original.style.cssText; image.alt = ''; image.draggable = false;
   try {
    const canvas = document.createElement('canvas');
    // canvasPresentation already paints the current frame beside its hidden
    // video. Never encode that hidden duplicate or an inactive canvas.
    if (original.style.opacity === '0' || original.style.display === 'none') throw new Error('Hidden presentation');
    const sourceWidth = original instanceof HTMLVideoElement ? original.videoWidth : original.width;
    const sourceHeight = original instanceof HTMLVideoElement ? original.videoHeight : original.height;
    const scale = Math.min(1, 1280 / sourceWidth, Math.max(1, original.clientWidth) * Math.min(devicePixelRatio, 1.25) / sourceWidth);
    canvas.width = Math.round(sourceWidth * scale);
    canvas.height = Math.round(sourceHeight * scale);
    if (!canvas.width || !canvas.height) throw new Error('No decoded frame');
    canvas.getContext('2d')!.drawImage(original, 0, 0, canvas.width, canvas.height);
    image.src = canvas.toDataURL('image/png');
   } catch { if (original instanceof HTMLVideoElement && original.poster) image.src = original.poster; }
   // The adjacent presentation canvas already carries the visible frame when
   // canvasPresentation hides its video. Preserve that visibility exactly.
   clone.replaceWith(image); clones[index] = image;
  } else if (/^(SCRIPT|IFRAME|AUDIO|SOURCE|TRACK)$/.test(clone.tagName)) clone.remove();
 });
 Object.assign(copy.style, { width: `${rect.width}px`, height: `${rect.height}px`, position: 'absolute', inset: '0', transform: 'none', opacity: '1', visibility: 'visible', boxShadow: 'none', backgroundColor: '#f4f6fa', pointerEvents: 'none' });
 // Scoped portfolio tokens normally inherited from the draggable window.
 const computed = getComputedStyle(visual);
 copy.style.borderRadius = computed.borderRadius;
 for (const name of ['--paper', '--paper-deep', '--ink', '--ink-2', '--muted', '--line', '--serif', '--sans']) copy.style.setProperty(name, computed.getPropertyValue(name));
 return { copy, scrolls: scrolls.map(scroll => ({ ...scroll, node: clones[scroll.index] })) };
}
function genieMotion(id: string, phase: Phase, visual: HTMLElement, window: HTMLElement, level: string, from?: MotionFrame, fallback?: HTMLElement): Motion {
 const rect = from?.geometry?.rect || window.getBoundingClientRect();
 const target = from?.geometry?.target || { ...dockTarget(id, rect, fallback), width: 2, height: 2 };
 const geometry = { rect, target };
 const overlay = document.createElement('div'); overlay.className = 'mac-genie-overlay'; overlay.dataset.genieFor = id; overlay.setAttribute('aria-hidden', 'true'); overlay.inert = true;
 Object.assign(overlay.style, { position: 'fixed', inset: '0', pointerEvents: 'none', zIndex: level, overflow: 'hidden' });
 const { copy, scrolls } = frozenVisual(visual, rect);
 const slices = 16;
 // Spend more of the same sixteen samples on the shoulder's curvature;
 // the long neck now changes gently enough to use larger source strips.
 const sourceY = (index: number) => rect.height * Math.pow(index / slices, 1.3);
 const start = from?.genie ?? (phase === 'restoring' ? 1 : 0), end = phase === 'restoring' ? 0 : 1;
 const duration = Math.max(180, 520 * Math.abs(end - start));
 const motionProgress = (time: number) => phase === 'minimizing' ? time : pace(time);
 const animations: Animation[] = [];
 const copyNodes = [copy, ...copy.querySelectorAll<HTMLElement>('*')];
 const scrollIndices = scrolls.map(scroll => ({ ...scroll, index: copyNodes.indexOf(scroll.node) }));
 const fragment = document.createDocumentFragment();
 // The reference first draws the near edge into the Dock while the far
 // edge stays broad. Only then does that far edge travel down the funnel.
 // Its width follows the remaining distance, not the local funnel profile:
 // feeding travel into the profile made the whole window become thin early.
 const upwards = target.y < rect.top + rect.height / 2;
 const edge = (q: number, progress: number) => {
  const bend = smooth(progress / .32);
  const travel = smooth((progress - .27) / .73);
  const neckWidth = target.width + rect.width * .04 * (1 - smooth((progress - .78) / .22));
  const along = clamp(upwards ? 1 - q : q);
  const flare = 1 - smooth(along);
  const remaining = 1 - travel;
  const farWidth = neckWidth + (rect.width - neckWidth) * smooth(remaining);
  const funnelWidth = neckWidth + (farWidth - neckWidth) * flare;
  const originalCenter = rect.left + rect.width / 2;
  const farCenter = originalCenter + (target.x - originalCenter) * travel;
  const funnelCenter = target.x + (farCenter - target.x) * flare;
  const direction = upwards ? -1 : 1;
  const originalFarY = upwards ? rect.bottom : rect.top;
  const finalFarY = target.y - direction * neckWidth / 2;
  const farY = originalFarY + (finalFarY - originalFarY) * travel;
  const funnelY = farY + along * (finalFarY - farY + direction * neckWidth);
  const width = rect.width + (funnelWidth - rect.width) * bend;
  const center = originalCenter + (funnelCenter - originalCenter) * bend;
  const y = rect.top + q * rect.height + (funnelY - rect.top - q * rect.height) * bend;
  return { left: center - width / 2, width, y };
 };
 for (let index = 0; index < slices; index++) {
  const slice = document.createElement('div'); slice.className = 'mac-genie-slice'; slice.dataset.slice = String(index);
  const topY = sourceY(index), height = sourceY(index + 1) - topY + 2;
  Object.assign(slice.style, { position: 'absolute', left: '0', top: '0', width: `${rect.width}px`, height: `${height}px`, overflow: 'hidden', transformOrigin: '0 0', willChange: 'transform', pointerEvents: 'none' });
  const content = copy.cloneNode(true) as HTMLElement; content.style.top = `${-topY}px`;
  const svgIds = new Map<string, string>();
  content.querySelectorAll<SVGElement>('[data-genie-svg-id]').forEach(node => { const old = node.getAttribute('data-genie-svg-id')!; const unique = `genie-${id}-${index}-${old}`; svgIds.set(old, unique); node.id = unique; node.removeAttribute('data-genie-svg-id'); });
  if (svgIds.size) content.querySelectorAll('*').forEach(node => { for (const attribute of [...node.attributes]) { let value = attribute.value.replace(/url\(["']?#([^)'"]+)["']?\)/g, (match, key) => svgIds.has(key) ? `url(#${svgIds.get(key)})` : match); if ((attribute.name === 'href' || attribute.name === 'xlink:href') && value.startsWith('#') && svgIds.has(value.slice(1))) value = `#${svgIds.get(value.slice(1))}`; if (value !== attribute.value) node.setAttribute(attribute.name, value); } });
  slice.append(content); fragment.append(slice);
  const frames: Keyframe[] = [];
  for (let step = 0; step <= 40; step++) {
   const progress = start + (end - start) * motionProgress(step / 40);
   const top = edge(topY / rect.height, progress), bottom = edge((topY + height) / rect.height, progress);
   // Homography maps all four strip corners to the funnel's sampled edges.
   // Unlike scaleX strips, the two horizontal edges have different widths,
   // eliminating the staircase silhouette and warping the content itself.
   const denominator = top.width / bottom.width;
   const a = top.width / rect.width, c = (bottom.left * denominator - top.left) / height;
   const d = (bottom.y * denominator - top.y) / height, g = (denominator - 1) / height;
   frames.push({ offset: step / 40, transform: `matrix3d(${a},0,0,0,${c},${d},0,${g},0,0,1,0,${top.left},${top.y},0,1)`, opacity: String(1 - smooth((progress - .84) / .16)) });
  }
  const animation = slice.animate(frames, { duration, easing: 'linear', fill: 'both' }); animation.pause(); animations.push(animation);
 }
 // Attach once, then restore scroll after layout (detached scroll containers
 // cannot accept scrollTop reliably). No layout reads occur on animation frames.
 document.getElementById('windows-area')!.append(overlay); overlay.append(fragment);
 if (scrollIndices.length) overlay.querySelectorAll<HTMLElement>('.mac-window-visual').forEach(content => { const nodes = [content, ...content.querySelectorAll<HTMLElement>('*')]; for (const scroll of scrollIndices) if (nodes[scroll.index]) { nodes[scroll.index].scrollTop = scroll.top; nodes[scroll.index].scrollLeft = scroll.left; } });
 animations.forEach(animation => { animation.currentTime = 0; animation.play(); });
 const opacity = visual.style.opacity, pointerEvents = visual.style.pointerEvents; visual.style.opacity = '0'; visual.style.pointerEvents = 'none';
 return { animations, visual, window, geometry, progress: () => start + (end - start) * motionProgress(clamp(Number(animations[0].currentTime || 0) / duration)), cleanup: () => { overlay.remove(); visual.style.opacity = opacity; visual.style.pointerEvents = pointerEvents; } };
}
export async function animateWindow(id: string, phase: Phase, from?: MotionFrame, fallback?: HTMLElement) {
 const window = document.getElementById(`mac-window-${id}`), visual = window?.querySelector<HTMLElement>('.mac-window-visual');
 if (!window || !visual || ui.reduced || !visual.animate) return;
 const level = presentationLevel();
 let current: Motion;
 if (phase === 'minimizing' || phase === 'restoring' || (phase === 'opening' && from?.genie !== undefined)) {
  current = genieMotion(id, phase === 'opening' ? 'restoring' : phase, visual, window, level, from, fallback);
 } else {
  const rect = window.getBoundingClientRect(), target = dockTarget(id, rect, fallback);
  const full: MotionFrame = { transform: 'translate(0px, 0px) scale(1)', opacity: '1' };
  const compact = phase === 'closing' ? { transform: 'scale(.97)', opacity: '0' } : { transform: `translate(${target.x - rect.left - rect.width / 2}px, ${target.y - rect.top - rect.height / 2}px) scale(${target.width / rect.width},${target.height / rect.height})`, opacity: '.12' };
  const animation = visual.animate(phase === 'opening' ? [from || compact, full] : [from?.genie !== undefined ? full : from || full, compact], { duration: phase === 'closing' ? 140 : 360, easing: 'cubic-bezier(.22,.75,.2,1)', fill: 'both' });
  current = { animations: [animation], visual, window, cleanup: () => {} };
 }
 motions.set(id, current); window.style.setProperty('--window-motion-z-index', level); window.dataset.windowMotion = phase;
 try { await Promise.all(current.animations.map(animation => animation.finished)); } catch { /* Cancelled operations no longer own application state. */ }
 finally {
  if (motions.get(id) === current) {
   motions.delete(id); current.animations.forEach(animation => animation.cancel()); current.cleanup(); clearPresentation(window);
   window.dispatchEvent(new CustomEvent('window-motion-settled'));
  }
 }
}
