import {proceduralShaders} from './procedural-shaders';

/** Original parametric pleated surfaces; no model, texture or runtime dependency. */
const vertexSource = `
precision highp float;
attribute vec2 aUv;
uniform float uTime, uAspect, uOpen, uMode;
uniform vec2 uPointer;
varying vec3 vNormal, vPosition;
varying vec2 vUv;
vec3 surface(vec2 uv) {
 float x = (uv.x * 15.0 - 7.5) * max(1.0, uAspect / 1.8);
 float y = uv.y * 5.5;
 float t = uTime * 0.12;
 float bend = y + x * 0.48 + sin(x * 0.51 + t) * 0.95;
 float wave = sin(bend * 1.65 + t);
 float ridge = pow(0.5 + wave * 0.5, 2.4);
 float z = ridge * (1.25 + uOpen * 0.35) + sin(x * 0.45 - y * 0.4 + t) * 0.42;
 z += sin(bend * 3.3 + t * 2.0) * 0.07;
 if(uMode > 0.5 && uMode < 1.5) {
  float r = length(vec2((x - uAspect * 1.1) * 0.75, (y + 0.85) * 1.15));
  z = sin(r * 2.0 - t * 1.8 + sin(x * 0.6 + t) * 0.7) * (0.55 + uOpen * 0.22);
  z += cos(x * 0.65 + y * 0.8 + t) * 0.35;
 } else if(uMode > 1.5 && uMode < 2.5) {
  float dune = y * 1.45 + sin(x * 0.33 + t * 0.5) * 1.8 + x * 0.18;
  z = pow(0.5 + sin(dune) * 0.5, 3.8) * (1.3 + uOpen * 0.25);
  z += sin(x * 0.3 - y * 0.2) * 0.24;
 } else if(uMode > 2.5) { z = 0.0; }
 return vec3(x + uPointer.x * 0.13, y + uPointer.y * 0.10, z);
}
void main() {
 if(uMode > 2.5) {
  vPosition=vec3((aUv.x*2.0-1.0)*3.0*uAspect,aUv.y*3.0,0.0);
  vNormal=vec3(0.0,0.0,1.0);vUv=aUv;
  gl_Position=vec4(aUv.x*2.0-1.0,aUv.y,0.0,1.0);return;
 }
 vec3 p = surface(aUv);
 vec3 du = surface(aUv + vec2(0.0005,0.0)) - p;
 vec3 dv = surface(aUv + vec2(0.0,0.0005)) - p;
 vNormal = normalize(cross(du,dv)); vPosition = p; vUv = aUv;
 float depth = 6.0 - p.z;
 gl_Position = vec4(p.x / uAspect * 2.0, p.y * 2.0, (depth-3.0)*0.2, depth);
}`;
const fragmentSource = `
precision highp float;
uniform vec2 uPointer;
uniform float uMode, uTime, uAspect, uOpen;
varying vec3 vNormal, vPosition;
varying vec2 vUv;
${proceduralShaders}
void main() {
 vec2 screen=vec2((vUv.x*2.0-1.0)*uAspect,vUv.y);
 if(uMode > 3.5) {
  vec3 color;
  if(uMode < 4.5)color=ocean(screen,uTime,uPointer,uOpen);
  else if(uMode < 5.5)color=nebula(screen,uTime,uPointer,uOpen);
  else if(uMode < 6.5)color=ribbons(screen,uTime,uPointer,uOpen);
  else color=warpTunnel(screen,uTime,uPointer,uOpen);
  gl_FragColor=vec4(color,1.0);return;
 }
 if(uMode > 2.5) {
  vec2 q = vec2(vPosition.x * 0.27, vPosition.y * 0.23);
  float t = uTime * 0.10;
  q += uPointer * vec2(0.08,0.05);
  vec3 sky = mix(vec3(0.008,0.018,0.055),vec3(0.025,0.10,0.17),smoothstep(-1.0,1.0,q.y));
  vec3 glow = vec3(0.0);
  for(int i=0;i<4;i++) {
   float k=float(i);
   float arc = sin(q.x * (1.3+k*0.16) + t + k*0.55) * 0.42 + k*0.15 - 0.18;
   arc += sin(q.x * 2.6 - t * 0.6) * 0.1;
   float d=q.y-arc;
   float curtain = exp(-abs(d)*(d>0.0?3.5:24.0));
   float rays = 0.65+0.35*sin(q.x*38.0+sin(q.x*8.0+t)*3.0+k);
   vec3 tint = mix(vec3(0.045,0.8,0.48),vec3(0.34,0.17,0.70),k/3.0);
   glow += tint * curtain * rays * (0.24 + uOpen*0.1);
  }
  vec2 starCell=floor(q*125.0);
  float hash=fract(sin(dot(starCell,vec2(127.1,311.7)))*43758.5453);
  float star=step(0.997,hash)*pow(max(0.0,1.0-length(fract(q*125.0)-0.5)*2.0),5.0);
  gl_FragColor=vec4(sky+glow+star*0.55,1.0);return;
 }
 vec3 n = normalize(vNormal);
 vec3 light = normalize(vec3(-0.4 + uPointer.x * 0.25,1.0,1.2));
 vec3 view = normalize(vec3(0.0,0.0,6.0)-vPosition);
 float diffuse = max(dot(n,light),0.0);
 float spec = pow(max(dot(n,normalize(light+view)),0.0),38.0);
 float broad = pow(max(dot(n,normalize(light+view)),0.0),5.0);
 float band = sin(vPosition.y * 0.45 + vPosition.x * 0.18 + 0.5) * 0.5 + 0.5;
 vec3 violet = vec3(0.30,0.055,0.75);
 vec3 blue = vec3(0.015,0.17,0.82);
 vec3 color = mix(blue,violet,smoothstep(0.2,0.9,band));
 float coral = smoothstep(0.32,0.9,vUv.x) * smoothstep(-0.3,2.4,vPosition.y);
 color = mix(color,vec3(1.0,0.19,0.25),coral*0.88);
 if(uMode > 0.5 && uMode < 1.5) {
  color = mix(vec3(0.018,0.12,0.15),vec3(0.58,0.78,0.77),broad);
  color += vec3(0.04,0.13,0.17) * sin(vPosition.x * 0.6 + vPosition.y);
 } else if(uMode > 1.5) {
  color = mix(vec3(0.22,0.035,0.045),vec3(0.9,0.36,0.12),diffuse);
  color = mix(color,vec3(0.95,0.65,0.32),smoothstep(0.8,1.0,diffuse)*0.6);
 }
 color *= 0.22 + diffuse * 0.88;
 color += broad * vec3(0.13,0.16,0.38) * 0.55;
 vec3 highlight = uMode < 0.5 ? mix(vec3(0.30,0.63,1.0),vec3(1.0,0.74,0.66),coral) : (uMode < 1.5 ? vec3(0.80,0.95,0.94) : vec3(1.0,0.67,0.36));
 color += spec * highlight * (uMode > 1.5 ? 0.12 : 0.82);
 float fresnel = pow(1.0-max(dot(n,view),0.0),3.0);
 color += fresnel * (uMode > 1.5 ? vec3(0.15,0.055,0.025) : vec3(0.15,0.22,0.35));
 color = pow(color,vec3(0.92));
 gl_FragColor = vec4(color,1.0);
}`;

export function createFoldedScene(canvas: HTMLCanvasElement) {
 const gl = canvas.getContext('webgl', {alpha:true, antialias:true, depth:true, powerPreference:'high-performance'});
 if (!gl) return null;
 const shaders: WebGLShader[] = [];
 const compile = (type:number, source:string) => {
  const shader=gl.createShader(type)!; shaders.push(shader); gl.shaderSource(shader,source); gl.compileShader(shader);
  if (!gl.getShaderParameter(shader,gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(shader) || 'Wallpaper shader compilation failed');
  return shader;
 };
 const program=gl.createProgram()!, blendProgram=gl.createProgram()!;
 const blendVertex=`attribute vec2 aUv;varying vec2 vUv;void main(){vUv=vec2(aUv.x,(aUv.y+1.0)*0.5);gl_Position=vec4(aUv.x*2.0-1.0,aUv.y,0.0,1.0);}`;
 const blendFragment=`precision mediump float;uniform sampler2D uSnapshot;uniform float uOpacity;varying vec2 vUv;void main(){gl_FragColor=vec4(texture2D(uSnapshot,vUv).rgb,uOpacity);}`;
 try {
  gl.attachShader(program,compile(gl.VERTEX_SHADER,vertexSource)); gl.attachShader(program,compile(gl.FRAGMENT_SHADER,fragmentSource)); gl.linkProgram(program);
  if (!gl.getProgramParameter(program,gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program) || 'Wallpaper shader linking failed');
  gl.attachShader(blendProgram,compile(gl.VERTEX_SHADER,blendVertex));gl.attachShader(blendProgram,compile(gl.FRAGMENT_SHADER,blendFragment));gl.linkProgram(blendProgram);
  if(!gl.getProgramParameter(blendProgram,gl.LINK_STATUS))throw new Error(gl.getProgramInfoLog(blendProgram)||'Wallpaper blend linking failed');
 } catch (error) { shaders.forEach(shader=>gl.deleteShader(shader)); gl.deleteProgram(program);gl.deleteProgram(blendProgram); console.warn('3D wallpaper uses its static fallback:',error); return null; }
 shaders.forEach(shader=>gl.deleteShader(shader));
 const vertices:number[]=[], indices:number[]=[];
 const rows=170, columns=170;
 for(let i=0;i<=rows;i++) for(let j=0;j<=columns;j++) vertices.push(i/rows,j/columns*2-1);
 for(let i=0;i<rows;i++) for(let j=0;j<columns;j++) {const a=i*(columns+1)+j,b=a+columns+1;indices.push(a,b,a+1,b,b+1,a+1);}
 const vertex=gl.createBuffer(), index=gl.createBuffer(), quad=gl.createBuffer(), quadIndex=gl.createBuffer();
 gl.bindBuffer(gl.ARRAY_BUFFER,vertex); gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(vertices),gl.STATIC_DRAW);
 gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,index); gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Uint16Array(indices),gl.STATIC_DRAW);
 gl.bindBuffer(gl.ARRAY_BUFFER,quad);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([0,-1,1,-1,0,1,1,1]),gl.STATIC_DRAW);
 gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,quadIndex);gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Uint16Array([0,1,2,2,1,3]),gl.STATIC_DRAW);
 gl.bindBuffer(gl.ARRAY_BUFFER,vertex);gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,index);
 gl.useProgram(program);
 const uv=gl.getAttribLocation(program,'aUv');gl.enableVertexAttribArray(uv);gl.vertexAttribPointer(uv,2,gl.FLOAT,false,0,0);
 const uniforms=Object.fromEntries(['uTime','uAspect','uOpen','uPointer','uMode'].map(name=>[name,gl.getUniformLocation(program,name)]));
 const blendUv=gl.getAttribLocation(blendProgram,'aUv');
 const opacity=gl.getUniformLocation(blendProgram,'uOpacity');
 const sampler=gl.getUniformLocation(blendProgram,'uSnapshot');
 const snapshot=gl.createTexture();gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,snapshot);
 gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
 gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
 let displayedMode=-1,transitionStart=-Infinity;
 const duration=1600;
 const remaining=(now:number)=>{const progress=Math.min(1,Math.max(0,(now-transitionStart)/duration));return 1-progress*progress*(3-2*progress);};
 gl.enable(gl.DEPTH_TEST);gl.clearColor(0,0,0,0);
 const renderScene=(time:number,x:number,y:number,open:number,mode:number)=>{
  gl.useProgram(program);gl.bindBuffer(gl.ARRAY_BUFFER,mode>=3?quad:vertex);
  gl.enableVertexAttribArray(uv);gl.vertexAttribPointer(uv,2,gl.FLOAT,false,0,0);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,mode>=3?quadIndex:index);
  gl.uniform1f(uniforms.uMode,mode);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);gl.uniform1f(uniforms.uTime,time);gl.uniform1f(uniforms.uAspect,canvas.width/canvas.height);gl.uniform2f(uniforms.uPointer,x,y);gl.uniform1f(uniforms.uOpen,open);
  gl.drawElements(gl.TRIANGLES,mode>=3?6:indices.length,gl.UNSIGNED_SHORT,0);
 };
 const overlay=(amount:number)=>{
  if(amount<=0)return;
  gl.useProgram(blendProgram);gl.disable(gl.DEPTH_TEST);gl.enable(gl.BLEND);gl.blendFuncSeparate(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA,gl.ZERO,gl.ONE);
  gl.bindBuffer(gl.ARRAY_BUFFER,quad);gl.enableVertexAttribArray(blendUv);gl.vertexAttribPointer(blendUv,2,gl.FLOAT,false,0,0);gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,quadIndex);
  gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,snapshot);gl.uniform1i(sampler,0);gl.uniform1f(opacity,amount);
  gl.drawElements(gl.TRIANGLES,6,gl.UNSIGNED_SHORT,0);gl.disable(gl.BLEND);gl.enable(gl.DEPTH_TEST);
 };
 return {
  resize() { const dpr=Math.min(devicePixelRatio || 1,1.5), scale=Math.min(1,1800/(innerWidth*dpr),Math.sqrt(2_000_000/(innerWidth*innerHeight*dpr*dpr)));canvas.width=Math.round(innerWidth*dpr*scale);canvas.height=Math.round(innerHeight*dpr*scale);gl.viewport(0,0,canvas.width,canvas.height);transitionStart=-Infinity; },
  draw(time:number,x:number,y:number,open:number,mode:number,animate=true) {
   const now=performance.now();
   if(!animate)transitionStart=-Infinity;
   if(mode!==displayedMode && displayedMode>=0 && animate){
    // Re-render before copying: the default framebuffer may be discarded after presentation.
    // Capturing the composited frame also makes interrupted transitions continuous.
    renderScene(time,x,y,open,displayedMode);overlay(remaining(now));
    gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,snapshot);
    gl.copyTexImage2D(gl.TEXTURE_2D,0,gl.RGB,0,0,canvas.width,canvas.height,0);
    transitionStart=now;
   }
   displayedMode=mode;renderScene(time,x,y,open,mode);overlay(remaining(now));
  },
  dispose() {gl.deleteBuffer(vertex);gl.deleteBuffer(index);gl.deleteBuffer(quad);gl.deleteBuffer(quadIndex);gl.deleteTexture(snapshot);gl.deleteProgram(program);gl.deleteProgram(blendProgram);}
 };
}
