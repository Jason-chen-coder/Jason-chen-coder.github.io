export const wallpaperOptions = [
 {id:'fold', zh:'流光折叠', en:'Prismatic folds', colors:['#11143b','#5354ed','#db80eb']},
 {id:'chrome', zh:'液态铬', en:'Liquid chrome', colors:['#06292f','#3f8895','#bedcd7']},
 {id:'dunes', zh:'赤金沙丘', en:'Ember dunes', colors:['#30141d','#b34c2f','#e6ad6e']},
 {id:'aurora', zh:'极光幕', en:'Aurora veil', colors:['#081b2c','#247a74','#8edbb5']},
 {id:'ocean', zh:'日落海面', en:'Sunset ocean', colors:['#092f40','#397c87','#f2a071']},
 {id:'nebula', zh:'星云流体', en:'Nebula flow', colors:['#10172f','#68548e','#d48e76']},
 {id:'ribbons', zh:'虹彩丝带', en:'Iridescent ribbons', colors:['#101329','#b45d85','#91d9c0']},
 {id:'warp', zh:'星际跃迁', en:'Hyperspace', colors:['#0a122b','#305ca2','#a18ddb']},
] as const;
export type WallpaperId = typeof wallpaperOptions[number]['id'];
const key='portfolio-wallpaper';
function read():WallpaperId {
 try {const saved=localStorage.getItem(key);if(wallpaperOptions.some(option=>option.id===saved))return saved as WallpaperId;}catch{/* Storage may be disabled; selection still works for this visit. */}
 return 'fold';
}
export const wallpaper=$state({current:read()});
export function selectWallpaper(id:WallpaperId){
 wallpaper.current=id;
 try{localStorage.setItem(key,id);}catch{/* Persistence is optional in restricted browsers. */}
}
