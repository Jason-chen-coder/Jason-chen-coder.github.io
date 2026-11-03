# Jason Chen · Personal homepage

## Current design

The homepage adapts the visual language of [Zhu Group](https://zhu.eitech.edu.cn/zh/): warm paper, large Chinese Fangsong headings, a floating capsule navigation, fine editorial rules, brass/teal/indigo details, and restrained reveal and line motion. Content, layout implementation, monogram and engineering illustrations are original. The reference site's group identity, proprietary graphics, copy and application code are not distributed here.

The site remains plain semantic HTML, CSS and JavaScript, suitable for GitHub Pages without a build step. Runtime fonts, imagery and scripts are served locally using relative paths. The default static document is Chinese; JavaScript adds the English switch, mobile navigation, engineering-flow controls, scroll states and email-copy feedback. Core content and links remain available without JavaScript.

## Content and provenance

The main open-source projects were selected by sorting all 118 public repositories and excluding forks (42 original repositories). GitHub API counts were checked on **2026-10-31** and are labeled as a snapshot, without runtime API calls.

| Repository | Stars | Forks |
|---|---:|---:|
| Mxgraph-EasyFlowEditor | 213 | 48 |
| D3-EasyFlowRender | 43 | 6 |
| Flutter-EasySpeechRecognition | 34 | 9 |
| Monaco-EasyCodeEditor | 27 | 11 |
| JsPlumb-EasyFlowEditor | 24 | 2 |
| Webpack5Mfp-Node-Nacos | 22 | 6 |

`dev-skills` is featured separately as a current AI development workflow project (7 stars at the same snapshot). Descriptions and technologies were checked against each repository's README and, where available, package metadata. Source: [GitHub profile](https://github.com/Jason-chen-coder) and the corresponding linked repositories.

Professional project contributions, employment dates, location and contact details come from the existing portfolio. They are not new claims of independent employment verification. The established αLab Studio, PrimeGen, Oxygen Future and Cloud Imaging links and approved local project imagery are retained. No new business performance, clinical accuracy or project ownership claims are added.

## Files and maintenance

- `index.html`: semantic content, project links, generated illustration references, vector brand marks and default Chinese copy.
- `styles.css`: design tokens, typography, desktop/mobile layouts and reduced-motion behavior.
- `i18n.js`: Chinese and English copy, locale normalization and application.
- `script.js`: navigation, progressive enhancement and interactive controls.
- `assets/fonts/`: local fonts and their license files; provenance in `SOURCES.md`.
- `assets/images/`: existing approved product imagery and its provenance manifest.
- `assets/illustrations/`: five generated ceramic miniature illustrations, complete prompts in `PROMPTS.md`, and dimensions/hashes in `generation-record.json`.
- `resume.pdf`: existing downloadable resume.

When changing public copy, keep Chinese and English catalogs aligned. When updating GitHub statistics, update the displayed snapshot date and this table together. The display font is a WOFF2 subset of the upstream OFL-licensed Zhuque Fangsong v0.212; new Chinese headings may require regenerating the subset. Fonts and diagrams do not rely on an external CDN.

## Run and verify

```sh
python3 -m http.server 4177 --bind 127.0.0.1
# Open http://127.0.0.1:4177/
node --test tests/*.test.mjs
node --check i18n.js
node --check script.js
git diff --check
```

The previous WebGL laboratory modules, approved image assets and their independent unit tests are retained for recovery and regression coverage. They are not loaded by the redesigned homepage. `TEARDOWN.md` describes that archived implementation rather than the current page.

The pre-redesign working tree was snapshotted outside this repository before source changes. No Git commit, push or deployment is part of this change.

## Verification evidence

Final checks completed on 2026-11-01:

- `node --test tests/*.test.mjs`: **102 passed, 0 failed, 0 skipped**. This includes the new homepage and bilingual API contracts plus preserved scene, gallery and approved-media checks.
- `node --check i18n.js`, `node --check script.js`, and `git diff --check`: passed.
- Headless Chromium at 1440×1000, 1280×900, 1024×768, 768×1024, 390×844, 360×800 and 320×740: Chinese and English content checked, zero horizontal overflow, zero captured browser errors, and no external runtime resource requests.
- Actual browser interactions passed for mobile navigation and Escape, hash navigation, engineering tabs and keyboard controls, selected-step preservation during language changes, stored locale after reload, blocked-storage handling, and clipboard success feedback.
- No-JavaScript mobile mode preserves visible navigation and content and hides unavailable controls; the four engineering steps have static explanations. Reduced-motion mode has no continuous animations. The repository subpath `/Jason-chen-coder.github.io/` loads its local resources successfully.
- Focused checks at 1440×1100 passed for all seven public chapter/deep links, smooth-scroll navigation highlights, resize recalculation and the mobile no-JavaScript navigation offset. A final focused 844×390 landscape check also passed after fixing the reading line at 160px.
- Independent review: **READY for the local change scope**, with all reported navigation, no-JavaScript and contrast findings resolved; review and independent browser artifacts are included with the local evidence.
- Font subset: 136,332 bytes with all 364 Chinese characters used by the final source covered. Latin display and UI subsets are 77,108 and 28,552 bytes respectively. Original TTF files and font licenses remain intact.

Local evidence is stored under the Git-ignored `RECON/redesign-2026-11-01/`: desktop/mobile screenshots, `browser-report.json`, `navigation-report.json`, reference screenshots and `design-dna.json`. These checks cover local Chromium; GitHub publication and Safari/Firefox-specific acceptance were not performed. The previous homepage's WebGL performance measurements are not evidence for this redesign.

## Illustration regeneration · 2026-11-01

The four open-source illustrations and engineering-loop illustration were regenerated using the built-in `image_gen` tool. The series follows the reference site's ivory porcelain, slate-blue enamel, champagne brass, pale oak and soft daylight treatment, with original subjects representing flow editing, data relationships, local speech recognition, code editing and the four-step engineering process. These are conceptual illustrations; the four professional project images remain the original screenshots, video still and product photographs.

The five deployed WebP files are 1200×800 and total **225,950 bytes** (about 221 KiB). They use local relative paths and lazy loading. Original generation prompts, reference links and conversion details are saved in `assets/illustrations/PROMPTS.md`; `generation-record.json` records each file's dimensions, size and SHA-256. Previous SVG illustrations remain on disk for recovery. Engineering tabs retain click, keyboard and bilingual selected-state feedback through HTML markers beside the generated workstations.

Validation for this imagery update:

- Full Node suite: **102 passed, 0 failed, 0 skipped**; script syntax and whitespace checks passed.
- Chromium at 1440×1000, 1024×768, 390×844 and 320×740: all five images loaded, Chinese and English layouts had zero horizontal overflow, and no page, console or failed-resource errors were captured.
- All four engineering tabs, keyboard navigation, and selected-state preservation during language changes passed. No-JavaScript, reduced-motion and GitHub Pages repository-subpath checks passed.
- Real project image references and bytes, plus the approved-media manifest, were compared against the pre-image-update snapshot and are unchanged.
- Desktop and mobile screenshots were visually reviewed for subject legibility, image cropping, caption space and engineering-state marker placement.
- Independent review: **READY for the local imagery-update scope**. A separate Chromium pass at 1440, 390 and 320 pixels verified image loading, engineering controls, English state retention and repository-subpath resources.

Image-update evidence is stored under the Git-ignored `RECON/images-2026-11-01/`. This is local verification; no commit, push or publication was performed.
