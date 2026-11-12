# Project icon provenance

These files replace the earlier illustrative Dock glyphs. Dock and project-directory icons use the same local image files; the images are not embedded in the compiled JavaScript.

| App | Asset verified in its source | Meaning |
| --- | --- | --- |
| Mxgraph-EasyFlowEditor | `readme_images/app_icon.png` (README) | Actual project logo |
| D3-EasyFlowRender | [D3 official logo](https://github.com/d3/d3-logo/blob/master/d3.svg) | Official D3 technology mark; this project has no distinct product icon |
| Flutter-EasySpeechRecognition | `assets/images/logo.jpg` (README) | Actual blue waveform project logo, rather than the scaffold Flutter icon |
| Monaco-EasyCodeEditor | `src/assets/logo.png` (`App.vue`) | The VS Code mark actually used by this app |
| JsPlumb-EasyFlowEditor | `public/favicon.ico` (`public/index.html`) | Actual connected-node project favicon; source resolution is 32 × 32 |
| Webpack5Mfp-Node-Nacos | `vue-app1/src/assets/images/webpackimage.png` (`App.vue`) | Webpack technology image actually displayed by the demo |
| dev-skills | `images/logo.png` (README) | Actual project logo; MIT license retained alongside this file |
| YourDream Studio | `studio/src/assets/yourdream-icon-dark-v2.png` (packaging settings and AppNavigation) | Actual local product application icon |

All assets retain their original bytes. Monaco's original `logo.png` contains JPEG data, so its local filename is `monaco.jpg` without re-encoding. `sources.json` records exact upstream URLs, source commits where available, byte sizes, and SHA-256 digests. The D3, Monaco and Webpack marks identify their corresponding technologies; they are not newly invented project brands.

Presentation uses one shared white rounded-square tile in the Dock and project directory (22% corner radius). Every original image receives 10% padding so the white plate remains visible around opaque artwork too; dev-skills uses 4% additional padding because its source already contains generous intrinsic whitespace. Images preserve their original bytes and aspect ratios, with consistent inner rounding. Shadows apply to the outer tile only.

Dock selection update (2026-11-11):
- `labware.png` and `labware-workbench.jpg`: original project assets from `labware-creator-agent/public/icons/labware-creator-icon-512.png` and `docs/screenshots/form-workbench.jpg` (local project checkout).
- `easyui.png`: original logo from https://jason-chen-coder.github.io/EasyUI/assets/assets/images/easy_ui_logo.png
- `easyui-workbench.png`: actual browser capture of https://jason-chen-coder.github.io/EasyUI/ at 1440 × 1000.
- `flutterflow.png`: original `Flutter-EasyFlow/docs/icons/Icon-512.png`, retrieved via GitHub Contents API.
