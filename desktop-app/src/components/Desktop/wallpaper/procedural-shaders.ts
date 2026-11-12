/** Original effects informed by wave superposition / fBm / domain warping.
 * Technique references (no external runtime assets or copied demo shaders):
 * https://thebookofshaders.com/13/
 * https://threejs.org/examples/webgl_shaders_ocean.html
 */
export const proceduralShaders = `
float hash21(vec2 p) {
 p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);
}
float noise21(vec2 p) {
 vec2 i=floor(p),f=fract(p);f=f*f*(3.0-2.0*f);
 return mix(mix(hash21(i),hash21(i+vec2(1.,0.)),f.x),mix(hash21(i+vec2(0.,1.)),hash21(i+vec2(1.,1.)),f.x),f.y);
}
float fractal(vec2 p) {
 float f=0.0,a=0.55;
 for(int i=0;i<3;i++){f+=a*noise21(p);p=mat2(1.6,-1.2,1.2,1.6)*p+13.7;a*=0.48;}
 return f;
}
vec3 stars(vec2 p,float time) {
 vec2 cell=floor(p*110.0),f=fract(p*110.0)-0.5;
 float seed=hash21(cell);
 float glow=pow(max(0.0,1.0-length(f)*2.0),7.0)*step(0.991,seed);
 return vec3(0.68,0.82,1.0)*glow*(0.7+0.3*sin(time+seed*70.0));
}
vec3 ocean(vec2 screen,float time,vec2 pointer,float relief) {
 vec3 ray=normalize(vec3(screen.x*0.8,screen.y*0.7-0.24+pointer.y*0.045,-1.5));
 vec3 sun=normalize(vec3(0.65+pointer.x*0.12,0.20,-1.5));
 float sunDot=max(dot(ray,sun),0.0);
 vec3 sky=mix(vec3(0.86,0.30,0.20),vec3(0.12,0.23,0.43),smoothstep(-0.08,0.8,ray.y));
 sky+=vec3(1.0,0.64,0.31)*pow(sunDot,240.0)*1.2;
 sky+=vec3(1.0,0.22,0.06)*pow(sunDot,16.0)*0.23;
 if(ray.y>=0.0)return sky;
 float distance=1.2/max(-ray.y,0.003);
 vec2 p=vec2(ray.x,ray.z)*distance;
 vec2 gradient=vec2(0.0);
 for(int i=0;i<4;i++){
  float k=float(i),frequency=0.65+k*0.8;
  vec2 direction=vec2(cos(k*1.17),sin(k*1.17));
  gradient+=direction*cos(dot(p,direction)*frequency+time*(0.65+k*0.23))*0.12/(1.0+k*0.5);
 }
 gradient*=0.8+relief*0.35;
 vec3 n=normalize(vec3(-gradient.x,1.0,-gradient.y));
 vec3 reflection=reflect(ray,n);
 float fresnel=pow(1.0-max(dot(-ray,n),0.0),4.0);
 vec3 water=mix(vec3(0.008,0.12,0.19),vec3(0.06,0.36,0.40),clamp(n.y*0.6+gradient.x,0.,1.));
 water=mix(water,vec3(0.76,0.35,0.22),fresnel*0.8);
 float glitter=pow(max(dot(reflection,sun),0.0),110.0);
 water+=vec3(1.0,0.70,0.36)*glitter*1.5;
 water=mix(water,sky,1.0-exp(-distance*0.009));
 return water;
}
vec3 nebula(vec2 p,float time,vec2 pointer,float relief) {
 p=p*1.6+pointer*0.12;
 float t=time*0.055;
 vec2 warp=vec2(fractal(p+vec2(t,-t)),fractal(p+vec2(5.1,-2.3)-t));
 float density=fractal(p+(warp-0.5)*(3.0+relief)+vec2(t*0.5,0.0));
 float cloud=smoothstep(0.24,0.86,density);
 float filament=exp(-abs(density-0.56)*32.0);
 vec3 color=mix(vec3(0.008,0.015,0.06),vec3(0.24,0.13,0.49),cloud);
 color+=vec3(0.16,0.37,0.53)*filament*(0.25+warp.y);
 float ember=smoothstep(0.47,0.78,warp.x)*cloud;
 color=mix(color,vec3(0.90,0.39,0.22),ember*0.85);
 color+=vec3(0.8,0.60,0.80)*pow(cloud,4.0)*0.6;
 return color+stars(p*0.5,time*0.2);
}
vec3 ribbons(vec2 p,float time,vec2 pointer,float relief) {
 p+=pointer*0.13;float t=time*0.22;
 vec3 color=vec3(0.012,0.018,0.045);
 for(int i=0;i<6;i++) {
  float k=float(i);
  float curve=sin(p.x*0.95+t+k*0.42)*0.42 + sin(p.x*0.37-t*0.6)*0.45;
  float d=p.y+p.x*0.32-curve+(k-2.5)*0.28;
  float width=0.055+0.018*sin(p.x+k+t)+relief*0.015;
  float body=exp(-pow(d/width,2.0));
  float edge=exp(-pow((d-width*0.6)/(width*0.23),2.0));
  vec3 tint=0.5+0.5*cos(vec3(0.0,2.1,4.2)+k*0.73+p.x*0.18);
  color+=tint*exp(-abs(d)*7.0)*0.09;
  color=mix(color,tint*(0.45+body*0.45)+edge*0.38,body*0.9);
 }
 return color;
}
vec3 warpTunnel(vec2 p,float time,vec2 pointer,float relief) {
 p-=vec2(0.58,0.05)+pointer*0.16;
 float r=max(length(p),0.02),angle=atan(p.y,p.x);
 float depth=-log(r),t=time*(0.28+relief*0.08);
 vec3 color=vec3(0.008,0.012,0.038);
 float twist=angle+depth*0.35+sin(time*0.12)*0.3;
 float ring=abs(fract(depth*2.6-t)-0.5);
 float filament=exp(-ring*65.0)*smoothstep(0.05,0.6,r);
 float spokes=pow(0.5+0.5*sin(twist*7.0+depth),12.0);
 vec3 tint=0.5+0.5*cos(vec3(0.4,2.2,4.1)+depth*0.6+angle*0.35);
 color+=tint*filament*(0.14+spokes*0.5);
 vec2 starUv=vec2((angle/6.283185+0.5)*95.0,depth*9.0-t*2.0);
 vec2 cell=floor(starUv),f=fract(starUv)-0.5;
 float seed=hash21(cell);
 float streak=exp(-abs(f.x)*60.0-abs(f.y)*5.0)*step(0.80,seed);
 color+=mix(vec3(0.28,0.65,1.0),vec3(0.9,0.66,0.9),seed)*streak*smoothstep(0.06,0.7,r);
 color+=vec3(0.06,0.12,0.28)*exp(-r*1.8);
 return color;
}
`;
