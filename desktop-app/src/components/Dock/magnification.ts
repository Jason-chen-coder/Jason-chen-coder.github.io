import { interpolate } from 'popmotion';
export const baseWidth = 57.6;
export const compactWidth = 44;
const distanceLimit = baseWidth * 6;
// The upstream macos-web Dock interpolation; share it with the resting-layout
// capacity calculation so animation can never change whether scrolling is needed.
export const nativeWidth = interpolate(
 [-distanceLimit,-distanceLimit/1.25,-distanceLimit/2,0,distanceLimit/2,distanceLimit/1.25,distanceLimit],
 [baseWidth,baseWidth*1.1,baseWidth*1.414,baseWidth*2,baseWidth*1.414,baseWidth*1.1,baseWidth],
);
export function maximumGrowth(count: number, spacing: number) {
 let maximum = 0;
 for (let pointer=0;pointer<=Math.max(0,count-1)*spacing;pointer+=baseWidth/8) {
  let growth=0;
  for(let index=0;index<count;index++)growth+=nativeWidth(pointer-index*spacing)-baseWidth;
  maximum=Math.max(maximum,growth);
 }
 // Reserve space for the existing spring's brief overshoot and pixel rounding.
 return maximum*1.15;
}
