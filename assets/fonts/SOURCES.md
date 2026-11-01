# Local typefaces

- `JasonDisplay-Fangsong.woff2`: a character subset of Zhuque Fangsong Regular v0.212 by TrionesType. [Upstream release](https://github.com/TrionesType/zhuque/releases/tag/v0.212), [source license](https://github.com/TrionesType/zhuque/blob/v0.212/LICENSE.txt). The original SIL OFL 1.1 text is retained in `OFL-ZhuqueFangsong.txt`. FontTools generated this WOFF2 from the upstream TTF using the characters in `index.html` and `i18n.js`. Its CSS alias is `Jason Display`.
- `CormorantGaramond-Latin.woff2`: local Latin subset of the existing `CormorantGaramond-Variable.ttf` display font; see `OFL-CormorantGaramond.txt`. The source TTF is retained.
- `Manrope-Latin.woff2`: local Latin subset of the existing `Manrope-Variable.ttf` interface font; see `OFL-Manrope.txt`. The source TTF is retained.

All fonts are served locally. No font asset was copied from the design reference website. When adding Chinese display text, regenerate the Fangsong subset to include the new characters; unavailable glyphs fall back to the platform serif fonts.
