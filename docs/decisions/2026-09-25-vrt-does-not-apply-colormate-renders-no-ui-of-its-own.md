# 2026-09-25 — VRT does not apply: ColorMate renders no UI of its own

- **Status:** Accepted
- **Date:** 2026-09-25
- **Type:** CI / testing
- **Supersedes:** None
- **Superseded by:** None

## Decision

vscode-colormate has **no `vrt` job**. The fleet rule is that every owned app on
Charcuterie runs visual regression testing from Storybook stories or test screenshots,
and that a repo with neither Storybook nor a rendered UI records why. This is that
record.

ColorMate has no Storybook and no rendered UI of its own. Its only visible output is the
foreground color of identifiers inside VS Code's own editor, and that color is a pure
function of the identifier name and three numbers. It is pinned by unit tests, not by
pictures.

Revisit this if the extension ever adds a webview, a custom editor, a tree view with
its own rendering, or any React UI. At that point the webview bundle can be served
standalone with a mocked `acquireVsCodeApi` and fixture state, and shot through the
shared workflow's `captureCommand`.

## Context

What the extension contributes and renders, read from the tree at `7102672`:

- **`package.json` `contributes`** holds `configuration` only: the saturation and
  lighting numbers per theme kind, `ignoredLanguages`, `semanticTokenTypes`, and the
  TextMate scope settings. No `views`, `viewsContainers`, `customEditors`, `webviews`,
  `themes`, `colors`, `commands` or `menus`.
- **The only `window.*` UI calls in `src/`** are `createTextEditorDecorationType`
  (`getTextEditorDecoration.ts`, a `color` on a range of editor text) and
  `createOutputChannel` (`outputChannel.ts`, a plain-text log). No
  `createWebviewPanel`, `registerWebviewViewProvider`, `acquireVsCodeApi`, React or HTML.
- **`@charcuterie/*` is devDependencies only**, and only for tooling:
  `@charcuterie/biome-config` (`biome.json` `extends`), `@charcuterie/eslint-config`
  (`eslint.config.mjs`, typed and test rules, no React block), and
  `@charcuterie/tsconfig` (`tsconfig.json` `extends`). Nothing under `src/` imports a
  Charcuterie package, and none of them ships in the VSIX. The
  [2026-08-11 record](2026-08-11-biome-formats-colormate-not-stylistic.md) already says
  "this is an extension host, not a UI app".

The one alternative considered: launch VS Code under `@vscode/test-electron` with
`xvfb`, open a fixture file and screenshot the editor. It was rejected:

- The pixels would be VS Code's own (its font stack, theme, minimap, cursor blink,
  version on the test download), which change on VS Code's schedule, not ours. A shot
  would go red on every VS Code release and say nothing about ColorMate.
- What ColorMate decides is a hex string per identifier, and that is already exact:
  `crc8Hash.test.ts` pins the hash, `colorize.test.ts` runs the extension against a
  fixture file, and `hslToHexColor` was proven byte-identical over all 158,760
  hue/saturation/lightness steps in the 2026-08-11 change. A unit assertion on the
  string is stricter than a pixel comparison of it.

## Why

A VRT job needs something the repo renders. A job with nothing to shoot fails with zero
PNGs, and a job pointed at VS Code's editor chrome would test Microsoft's UI rather than
this code. The fleet rule asks for the reason on record instead of a silent absence;
this is it, with the evidence to re-check it later.

## Evidence

Owner, 2026-09-25, T3 Code chat on branch `t3code/fix-castkit-time-weather-text`,
setting the fleet rule: *"We have Storybook, so that's on avenue for VRT shots, and some
tests can also do them if it makes sense."*

The fleet decision
(`agentic/docs/decisions/2026-09-25-every-owned-charcuterie-app-runs-vrt.md`):
*"A repo with neither Storybook nor a rendered UI records **why** in its own
`docs/decisions/`, with evidence, instead of silently having no job."*

Survey commands run at `7102672`:

- `grep -rn -E "webview|createWebviewPanel|WebviewView|acquireVsCodeApi|react|charcuterie" src`
  returns nothing.
- `grep -rn "createTextEditorDecorationType\|window\.\(create\|register\)" src` returns
  `getTextEditorDecoration.ts:20` and `outputChannel.ts:4` only.
