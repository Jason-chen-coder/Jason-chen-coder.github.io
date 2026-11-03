# Image generation record

## 2026-08-11 current production assets

The current continuous laboratory release uses five newly generated production
assets from OpenAI's built-in ImageGen tool:

- `poster-fallback.webp` is the local laboratory fallback shown when WebGL cannot
  initialize or loses context. It depicts a fictional continuous lab interior and
  contains no people, logos, patient data, or readable interface text.
- `cloud-remote-consultation-ui.webp` is a privacy-safe substitute for a clinical
  consultation screenshot. It uses calibration phantoms and fictional interface
  content instead of patient imagery or records.
- `cloud-handheld-app.webp` is a privacy-safe substitute for a handheld ultrasound
  application screenshot. It uses a calibration phantom and fictional interface
  content instead of patient imagery or records.
- `plate-alab-continuous-lab.webp` - SHA-256 `f4968482cd0bf69aa336fdbfa8645afc7081a9c7fdc7c2625505390416ef65bc`, 1024 x 641, 45,010 bytes - shows a white six-axis robot transferring a microplate between an ordered rack and an enclosed laboratory instrument inside the shared lab.
- `plate-primegen-workflow.webp` - SHA-256 `7916ad5072bcf737f21399d28d23495165198ce3fd98f39bfeca4833406a8300`, 820 x 1024, 49,398 bytes - shows a physical workflow station with integrated screens, queued microplates, and robotic handling hardware inside the shared lab.

The two project-plate prompts required realistic, inspectable laboratory equipment,
the primary workflow in the middle 60% of the frame, restrained cyan/amber status
light, and no people, logos, readable text, gardens, lanterns, Japanese architecture,
or clinical claims. The generated masters are retained by Codex outside the
repository; the deployed WebP derivatives are capped at a 1024 px longest edge and
contain no EXIF, XMP, or ICC profile chunks.

The two Cloud files are safe substitutes, not evidence of a real patient session.
No source image containing a face, patient name, identifier, contact information,
or clinical footage was supplied to generation or retained in the repository.
Their purpose is to demonstrate the product surface without expanding Jason
Chen's stated contribution or making clinical-performance claims.

## 2026-08-09 historical Kage prompt set

The prompt set below is a historical generation record from the superseded
visual direction. It does not describe the current fallback or current 3D world.
No Kage artwork, screenshots, or other reference images were supplied to the
generator. None of the assets produced by this historical prompt set remain in
the current runtime; the two project plates were regenerated for the continuous
laboratory release.

### Historical prompt set

### `poster-fallback.webp`

Create a cinematic 16:9 night view of a fictional Kyoto mountain temple for a
senior frontend engineer's portfolio. Show a rain-dark stone ascent, restrained
timber temple architecture, warm amber shoji light, cold blue-charcoal
moonlight, mist, black pines, and a large vermilion moon. Keep the left-center
and lower third quiet enough for bone-white editorial text. Photographic art-book
color grading, deep near-black shadows, no people, no text, no logos, no border.

### `plate-alab.webp`

Create a cinematic vertical project still of an automated laboratory platform:
precision liquid-handling hardware, glass vials, subtle status lights, and a
dark workstation UI reflected in wet black surfaces. Use near-black,
blue-charcoal, bone white, restrained amber, and one vermilion accent. Editorial
photography, tactile and credible, no people, no readable text, no logos.

### `plate-primegen.webp`

Create a cinematic vertical project still about an AI laboratory copilot:
abstract intent pathways, a restrained conversation interface, instrument
telemetry, and a precise research workstation. Dark blue-charcoal environment,
warm amber practical light, bone-white detail, one vermilion signal. Editorial
art-book photography, no people, no readable text, no logos.

### `plate-oxygen.webp`

Create a cinematic vertical project still for a unified cross-platform control
system: one coherent command language represented across desktop, tablet,
mobile, and embedded instrument surfaces in a dark laboratory. Precise,
minimal, near-black and blue-charcoal with amber equipment light and vermilion
status accents. No people, no readable text, no logos.

### `plate-imaging.webp`

Create a cinematic vertical project still of a cloud medical-imaging control
room: luminous scan slices, a remote device console, dark glass, and disciplined
technical hardware. Cold moonlit blue-charcoal, warm amber practical light,
bone-white data shapes, one vermilion marker. Editorial and credible, no
people, no readable text, no logos.

### `foreground-hero.webp`

Create a wide isolated foreground silhouette for chroma-key removal: wet silver
grass, irregular dark stones, and one weathered Japanese stone lantern arranged
along the bottom edge. Black-charcoal forms with faint cold rim light and tiny
amber reflections. Pure flat chroma green background, no green in the subject,
no text, no border, generous empty space above.

### `foreground-work.webp`

Create a wide isolated foreground silhouette for chroma-key removal: an
asymmetric Japanese maple branch entering from one side, sparse pale sakura
twigs, and a low dark bush along the bottom. Deep charcoal leaves with restrained
vermilion maple accents and cold edge light. Pure flat chroma green background,
no green in the subject, no text, no border.

### `foreground-craft.webp`

Create a wide isolated foreground silhouette for chroma-key removal: a windswept
pine, fragmented temple wall and ruin stones, low distant hills, and scattered
rocks across the bottom. Near-black and blue-charcoal forms with subtle bone and
amber edge light. Pure flat chroma green background, no green in the subject,
no text, no border.

The three foreground masters are also reused under chapter-specific filenames
for the about, experience, and contact handoffs. Transparency was produced
locally after generation; runtime assets are WebP files with relative paths.
