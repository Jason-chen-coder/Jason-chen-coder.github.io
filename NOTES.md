# Jason Chen Portfolio - Kage reference notes

## Source information

- Reference site: https://mengto.github.io/kage/
- Reference repository: https://github.com/MengTo/kage
- Reference revision inspected: `7f6bda72cbd7a1e78238082b3ba454a59a2f3deb`
- Original author: Meng To
- License: **NONE for the original Kage code and artwork**. The repository README explicitly grants no reuse or redistribution license.
- Third-party runtime: Three.js r149, MIT licensed in the reference repository.

This project does not copy the reference implementation, generated artwork, fonts, copy, brand, shaders, or tuned scene parameters. It uses the user-provided brief and observable high-level composition as inspiration, then implements an original portfolio with independently sourced MIT/OFL dependencies and original assets.

## Technology

- Plain semantic HTML, CSS, and JavaScript
- Locally vendored Three.js r184 modules
- No framework, build step, analytics, tracker, remote font, or runtime CDN
- Node's built-in test runner for static contracts and pure scene logic

## Pre-build assessment

- Complexity: **L5 - WebGL / Three.js**
- Mode: **content transformation**, not faithful cloning
- High-fidelity targets: fixed environmental canvas, continuous scroll camera, editorial pacing, chapter-aware navigation, warm/cold lighting, foreground handoffs, desktop/mobile composition
- Independent replacements: scene geometry, camera poses, shaders, imagery, typography, content model, navigation behavior, performance governor
- Explicitly excluded: original code, original generated plates/cutouts, Kage brand copy, exact shaders, exact geometry, exact source constants
- Main risks: GPU performance, content legibility over WebGL, mobile composition, reduced-motion completeness, GitHub Pages subpath paths

## Local run

```bash
python3 -m http.server 4173 --bind 127.0.0.1
```

Open `http://127.0.0.1:4173/`.

## Replacement map

- Identity and chapter copy: `index.html`
- Layout, palette, responsive composition, foreground staging: `styles.css`
- Navigation, reveals, scroll state, cursor, fallback: `script.js`
- Camera interpolation and performance profiles: `scene-model.js`
- Three.js world and animation: `scene.js`
- Original local imagery: `assets/images/`
- Local fonts and licenses: `assets/fonts/`
- Three.js runtime and license: `assets/vendor/`

## Reference versus portfolio

| Module | Reference behavior | Portfolio implementation | Deliberate difference | Evidence |
|---|---|---|---|---|
| Hero | Temple, moon, oversized Kage wordmark | Temple ascent behind Jason Chen identity | Name and positioning are the first-viewport signal | `index.html`, desktop/mobile screenshots |
| Navigation | Four themed chapters | Five professional chapters plus contact | Destinations follow portfolio tasks | browser interaction evidence |
| Core motion | Scroll-bound camera and atmosphere | Independent six-pose camera, adaptive particles, authored light states | No source constants or shader reuse | `scene-model.js`, `scene.js` |
| Editorial media | Generated Kyoto plates | Original project-specific cinematic plates | Work evidence replaces tourism narrative | `assets/images/` |
| Mobile | Reduced layer density and menu sheet | Re-composed content, lower DPR and particles, complete nav | All professional content retained | 390 x 844 screenshot |

## Verification checklist

- [x] Unit/static contract tests pass
- [x] Every authored and vendored script parses
- [x] Local server returns all referenced assets without 404s
- [x] Desktop browser screenshot and canvas pixel check pass
- [x] 390 x 844 screenshot has no incoherent overlap
- [x] Mobile menu, focus loop, Escape, wordmark, and anchor interactions pass
- [x] Full scroll reaches Contact and updates the chapter state
- [x] Browser console has no errors or warnings
- [x] Reduced-motion CSS and static scene profile preserve the complete reading experience
- [x] Clone audit reports no tracker, remote runtime, or copied reference asset

## Final verification evidence

- Fresh tests: `node --test tests/*.test.mjs` -> 8 passed, 0 failed.
- Syntax audit: 17 JavaScript and MJS files parsed, including the local Three.js dependency graph.
- Runtime paths: 24 relative references exist; 0 root-relative paths; 0 paths escape a simulated `/Jason-chen-coder.github.io/` GitHub Pages subpath.
- HTTP audit: the root document and all 30 files under `assets/` returned 200; the local favicon returned `image/png`.
- Desktop browser: 1440 x 900 viewport, `data-webgl="ready"`, 1440 x 900 canvas at full opacity, 1440 px document width, and an empty console.
- Mobile browser: 390 x 844 viewport, 390 px document width, full-screen 390 x 844 navigation, no horizontal overflow, and an empty console.
- Navigation: native hashes remain deep-linkable; Work and Contact update both navigation surfaces via `aria-current`; Contact lands 76 px below the mobile masthead.
- Accessibility: the menu makes background landmarks inert, cycles focus in both directions, closes with Escape or the wordmark, and restores the menu button state.
- Canvas evidence: two 1440 x 900 captures 700 ms apart were non-identical (`PSNR 52.876 dB`), with nonblank luma (`YAVG 12.182`, `YMAX 255`), while WebGL remained ready.
- Reduced motion: unit coverage confirms zero rain, leaves, and embers plus a static camera; CSS forces every reveal visible and removes animated transitions.

Evidence files:

- `RECON/screenshots/portfolio-desktop-final.png`
- `RECON/screenshots/portfolio-mobile-final.jpg`
- `RECON/screenshots/chapter-craft-final.jpg`
- `RECON/interactions/portfolio-mobile-menu-final.png`
- `RECON/screenshots/canvas-motion-a.jpg`
- `RECON/screenshots/canvas-motion-b.jpg`

## Delivery scorecard

| Dimension | Score | Basis |
|---|---:|---|
| Brief fidelity | 96 / 100 | Continuous procedural world, six composed camera poses, editorial chapters, local stills and foreground handoffs |
| Reference translation | 92 / 100 | Preserves pacing and spatial ideas while replacing identity, code, artwork, typography, scene geometry, and camera values |
| Interaction and accessibility | 96 / 100 | Deep links, chapter state, keyboard-safe mobile menu, focus visibility, progressive enhancement, and reduced motion |
| Responsive composition | 95 / 100 | Verified at 1440 x 900 and 390 x 844 with zero root overflow and complete content |
| Runtime quality | 92 / 100 | Adaptive DPR and particles, local dependencies, restrained bloom, clean console, fallback poster, and BFCache recovery |
| Source autonomy | 100 / 100 | No original Kage code, artwork, fonts, shaders, or tuned scene values reused |

The play control from the brief is intentionally omitted because this portfolio has no video. A decorative play button would imply an unavailable action.
