# docs/decisions — the locked-decisions paper trail

One file per settled decision: the rule, what was rejected, why, and how to honor it.
**Never edit a file here to change its meaning** — supersede it with a new dated file and
cross-link both directions.

Newest first.

| Date | Decision |
| --- | --- |
| 2026-09-25 | [**VRT does not apply: ColorMate renders no UI of its own**](2026-09-25-vrt-does-not-apply-colormate-renders-no-ui-of-its-own.md) — no Storybook, no webview; the only visible output is an editor decoration color, pinned by unit tests. Revisit if a webview or custom view is added |
| 2026-08-11 | [**Biome formats this repo; `@stylistic` is dropped**](2026-08-11-biome-formats-colormate-not-stylistic.md) — the fleet `@charcuterie/*` biome/eslint/tsconfig stack. `@stylistic` was never VS Code-specific; it was enforcing a chain style no other repo uses. `useDefineForClassFields` is a non-issue at `target: ES2022` |
| 2022-07-29 | [**Identifier names map to stable CRC8 colors**](2022-07-29-identifier-names-map-to-stable-crc8-colors.md) — the name selects the hue; theme settings control saturation and lightness |
