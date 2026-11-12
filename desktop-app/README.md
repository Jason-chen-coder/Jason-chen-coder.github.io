# Jason macOS portfolio

This is a direct adaptation of [PuruVJ/macos-web](https://github.com/PuruVJ/macos-web) at `14204808226d67fce14924d0b2ea889c807f12a9`. See `LICENSE` for the original MIT license and `../DESKTOP.md` for the integration and verification commands.

Retained source foundations include `Dock.svelte`, `DockItem.svelte`, `Window.svelte`, `WindowsArea.svelte`, the traffic-light SVG components, app state and elevation helpers. Their application registry and portfolio bridge replace the reference's demo applications. The Dock uses Popmotion interpolation and native Svelte motion; window dragging uses Neodrag. GSAP is not used.

```sh
npm ci
npm run check
npm run build
```

The build writes `../assets/macos/`. The root portfolio HTML supplies the actual project content and media. Build output is static and works with the existing GitHub Pages publication approach; the source folder itself is excluded by Jekyll.
