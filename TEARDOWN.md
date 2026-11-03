> Archived implementation note: this document describes the previous continuous WebGL laboratory. The redesigned homepage uses semantic HTML, CSS and original SVG diagrams and does not load the scene runtime. See NOTES.md for the current design and validation. Existing scene modules and source assets remain available for recovery.

# Kage reference technical teardown

> **HISTORICAL REFERENCE ONLY (2026-08-09).** This document records research into
> a superseded reference direction. It does not represent the current design,
> runtime, production assets, or verification status. The active portfolio is a
> continuous laboratory world documented in `.impeccable.md` and `NOTES.md`.

Reference revision: `7f6bda72cbd7a1e78238082b3ba454a59a2f3deb`

## 0. One-sentence essence

Kage combines one fixed Three.js sanctuary, scroll-interpolated camera poses, semantic editorial sections, and section-bound foreground imagery so the reader experiences one continuous environment rather than separate scenes.

## A. Source-grounded structure

- **Rendering - SOURCE:** The reference loads vendored Three.js r149 from `index.html:1197`; the bundled license identifies the runtime as MIT. The repository itself grants no reuse license.
- **World construction - SOURCE:** Temple, moon, torii, foreground geometry, atmosphere, and leaf systems are built by separate functions at `index.html:2570`, `2703`, `2731`, `2981`, `3067`, and `3181`.
- **Post-processing - SOURCE:** The post stack starts at `index.html:3920`; renderer resolution is capped and then adjusted by a runtime performance scale at `index.html:2263` and `4565`.
- **Camera - SOURCE:** Authored camera states begin at `index.html:4026`, interpolation is applied at `4056`, and document scroll is normalized at `4091`.
- **HTML composition - SOURCE:** Five semantic scene sections begin at `index.html:925`, `969`, `1010`, `1058`, and `1114`.
- **Foreground handoff - SOURCE:** Section-specific WebP layers are attached with `data-fg` between `index.html:971-1151`; responsive placement rules begin around `index.html:738`.
- **Editorial reveals - SOURCE:** Reveal attributes appear throughout the sections and are wired at `index.html:4138`.
- **Navigation - SOURCE:** The fixed navigation is authored near `index.html:913` and its active/hide/menu behavior is wired at `4321`.
- **Reduced motion and fallback - SOURCE:** CSS reduced-motion rules appear at `index.html:350`, `797`, and `871`; JavaScript reads the preference at `1211`; WebGL failure falls back to readable HTML at `4767`.
- **Audio - SOURCE:** No audio resource or playback path is present in the inspected repository.

## B. Evidence discipline

| Claim | Evidence | Level | Use in this project |
|---|---|---|---|
| One world persists through all chapters | Fixed canvas plus camera table and scroll normalization | SOURCE | Adopt the narrative principle with an independent scene and pose table |
| Warm/cold lighting guides chapter mood | Source materials/lights plus browser screenshots | SOURCE | Reinterpret for authored work versus surrounding complexity |
| Foreground layers create collage depth | `data-fg` DOM and responsive CSS | SOURCE | Generate new local alpha artwork and implement a different staging system |
| Exact camera coordinates are essential | Only true for the reference implementation | GUESS | Do not copy; compose new camera poses around the portfolio content |
| Exact shaders or bloom constants should be reused | No license permits reuse | REJECTED | Use official Three.js modules and original parameters |

## C. Transferable method

1. Keep professional content in semantic HTML so it survives WebGL failure.
2. Treat each chapter as a camera composition inside one world.
3. Use warm practical lights to mark evidence and human action; use cold light for system scale.
4. Cap DPR, reduce particles on mobile, and disable continuous motion for reduced-motion users.
5. Validate canvas pixels, console output, assets, navigation, and responsive screenshots in a real browser.

This teardown is a technical study. It is not permission to reuse the reference code or artwork.
