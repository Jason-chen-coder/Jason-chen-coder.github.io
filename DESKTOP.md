# Personal desktop — macos-web source fork

This homepage builds a portfolio adaptation of [PuruVJ/macos-web](https://github.com/PuruVJ/macos-web), pinned to upstream commit `14204808226d67fce14924d0b2ea889c807f12a9`. The source is retained under `desktop-app/`, including the upstream MIT license (Copyright (c) 2021 Puru Vijay).

The desktop uses the original Svelte component architecture. Its Dock magnification uses the upstream Popmotion interpolation and Svelte springs; window dragging uses the upstream Neodrag integration. There is no GSAP runtime. Adaptations replace the application registry with Jason's projects and add portfolio content, translations, routes, functioning minimize controls and responsive behavior.

The Dock features six projects in order: YourDream Studio, Labware Creator Agent, EasyUI, mxGraph Flow Editor, Speech Recognition and dev-skills. Flutter-EasyFlow, D3-EasyFlowRender and Webpack5Mfp-Node-Nacos remain in the project directory; older Monaco and JsPlumb links still open their own windows. Existing HTML remains the content source and no-JavaScript fallback; the bridge moves actual content nodes so video controls and translations retain their original listeners. The upstream boot screen, analytics, service worker and unrelated applications are omitted.

Build from source:

```sh
npm --prefix desktop-app ci
npm --prefix desktop-app run check
npm --prefix desktop-app run build
python3 -m http.server 4177 --bind 127.0.0.1
```

The build writes static runtime assets to `assets/macos/`, consumed by the root `index.html`. Source and dependencies in `desktop-app/` are excluded from the public Jekyll site. Open `http://127.0.0.1:4177/` for local review.

Verification:

```sh
node --test tests/*.test.mjs
PLAYWRIGHT_MODULE=/absolute/path/to/playwright node tests/desktop-browser.mjs
PLAYWRIGHT_MODULE=/absolute/path/to/playwright node tests/dock-projects-browser.mjs
```

`DESKTOP_URL` sets the browser-test URL. Screenshots default to `/tmp/jason-desktop-evidence` (`DESKTOP_EVIDENCE` overrides it). Tests cover project isolation, native Dock animation, window lifecycle and keyboard focus, video playback, translations, history, small screens, reduced motion and the static fallback. Committing and publishing remain separate from local implementation.
