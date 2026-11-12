import { svelte } from '@sveltejs/vite-plugin-svelte';
import { defineConfig } from 'vite';

export default defineConfig({
 define:{'process.env.NODE_ENV':JSON.stringify('production')},
 plugins:[svelte(),{name:"upstream-license",generateBundle(){this.emitFile({type:"asset",fileName:"LICENSE.txt",source:"MIT License\n\nCopyright (c) 2021 Puru Vijay\n\nPermission is hereby granted, free of charge, to any person obtaining a copy\nof this software and associated documentation files (the \"Software\"), to deal\nin the Software without restriction, including without limitation the rights\nto use, copy, modify, merge, publish, distribute, sublicense, and/or sell\ncopies of the Software, and to permit persons to whom the Software is\nfurnished to do so, subject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all\ncopies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\nFITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\nAUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\nLIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\nOUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE\nSOFTWARE.\n"});}}], publicDir:false, base:'./',
 resolve:{alias:{'🍎':new URL('./src/',import.meta.url).pathname}},
 build:{target:'esnext',cssTarget:'esnext',outDir:'../assets/macos',emptyOutDir:true,lib:{entry:'src/main.ts',formats:['es'],fileName:()=> 'desktop.js',cssFileName:'desktop'},rolldownOptions:{output:{codeSplitting:false}}}
});
