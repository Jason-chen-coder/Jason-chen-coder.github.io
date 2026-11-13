/** Move the actual boot image into its desktop position without a duplicate avatar. */
export function beginStartupMotion(target:HTMLImageElement|null,reduced:boolean):()=>void {
 const root=document.documentElement;
 const boot=document.getElementById('desktop-boot');
 const avatar=boot?.querySelector('img');
 if(!boot||!avatar||!target||reduced||typeof avatar.animate!=='function')return()=>{};
 const from=avatar.getBoundingClientRect();
 const to=target.getBoundingClientRect();
 if(!from.width||!to.width)return()=>{};
 root.classList.add('desktop-entering');
 target.style.visibility='hidden';
 const originalParent=avatar.parentElement!;
 const sibling=avatar.nextSibling;
 boot.append(avatar);
 Object.assign(avatar.style,{position:'fixed',left:`${from.left}px`,top:`${from.top}px`,width:`${from.width}px`,height:`${from.height}px`,margin:'0',transformOrigin:'top left'});
 const track=boot.querySelector<HTMLElement>('.boot-content');
 if(track)track.style.visibility='hidden';
 const animations=[
  boot.animate([{backgroundColor:'#000'},{backgroundColor:'transparent'}],{duration:850,easing:'cubic-bezier(.22,1,.36,1)',fill:'forwards'}),
  avatar.animate([{transform:'translate(0,0) scale(1)'},{transform:`translate(${to.left-from.left}px,${to.top-from.top}px) scale(${to.width/from.width},${to.height/from.height})`}],{duration:1000,easing:'cubic-bezier(.65,0,.2,1)',fill:'forwards'})
 ];
 let finished=false;
 function finish(){
  if(finished)return;finished=true;
  target!.style.visibility='';
  root.classList.remove('desktop-entering');
  animations.forEach(animation=>animation.cancel());
  avatar!.removeAttribute('style');
  originalParent.insertBefore(avatar!,sibling);
  if(track)track.style.visibility='';
  window.removeEventListener('resize',finish);
  media.removeEventListener('change',motion);
 }
 const media=matchMedia('(prefers-reduced-motion: reduce)');
 const motion=()=>{if(media.matches)finish();};
 window.addEventListener('resize',finish,{once:true});media.addEventListener('change',motion);
 Promise.all(animations.map(animation=>animation.finished)).then(finish,finish);
 return finish;
}
