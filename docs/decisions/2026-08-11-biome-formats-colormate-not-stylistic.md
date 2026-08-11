# 2026-08-11 — Biome formats this repo; `@stylistic` is dropped

- **Status:** Accepted
- **Date:** 2026-08-11
- **Type:** tooling / linting / formatting
- **Related:** [Charcuterie is the fleet's shared infrastructure](https://github.com/Sawtaytoes/charcuterie) — the `@charcuterie/*` config packages this adopts

## Decision

vscode-colormate formats and lints with the fleet stack:

- **`@charcuterie/biome-config`** via `biome.json` — Biome is the **formatter** and the
  first linter.
- **`@charcuterie/eslint-config`** via `eslint.config.mjs` — `createTypedRules`
  (`id-length`, the `is`/`has` boolean naming convention) and `createTestRules`. No React
  blocks; this is an extension host, not a UI app.
- **`@charcuterie/tsconfig/base`** via `extends`, with the VS Code runtime overrides kept
  (`target`/`lib` ES2022, `module` Node16).
- **`@stylistic/eslint-plugin` is removed.**

## Context

`@stylistic` is not a VS Code thing — it is ESLint's own formatting rules, spun out into
a plugin when ESLint deprecated them in core. Nothing about it is specific to extensions.

What it *was* doing here is enforcing a chain style no other repo in the fleet uses —
`newline-per-chained-call`, `dot-location: property`, and a customized `indent` with
`MemberExpression: 0`, which put every property access on its own line:

```ts
// before
export const editorChangeEpic = () => (
  extensionContextsState
  .action$
  .pipe(
    filter(
      extensionContextsSlice
      .actions
      .addExtensionContext
      .match,
    ),

// after (Biome)
export const editorChangeEpic = () =>
  extensionContextsState.action$.pipe(
    filter(
      extensionContextsSlice.actions.addExtensionContext
        .match,
    ),
```

Biome cannot reproduce that style, so adopting it is a real, visible change:
`src/editorChangeEpic.ts` went from 224 lines to 60, and every file in `src/` moved.
castkit, mux-magic, image-viewer, gallery-downloader and charcuterie already read the
"after" way; colormate was the last one that did not.

### On `useDefineForClassFields`

Flagged as a risk before adoption — the base sets it `true`, and it changes class fields
from assignment (`[[Set]]`) to `Object.defineProperty` (`[[Define]]`), which can shadow
an inherited accessor. **It is a non-issue here:** TypeScript already defaults the flag
to `true` whenever `target` is ES2022 or higher, and this repo targets ES2022. The value
was already `true` before the `extends`; nothing about class-field semantics changed.

## Why

One formatter across the fleet is the whole point of the shared-tooling rollout. Keeping
one repo on a second formatter means every cross-repo copy/paste reformats, and the
`@charcuterie/biome-config` version bump has to be reasoned about twice.

## What came with it (not cosmetic)

The lint pass found real things, fixed in the same change:

- Two `reduce` + spread accumulators in `textMateGrammars.ts` rebuilt the array on every
  installed extension — quadratic over the extension list. Now `flatMap`.
- `getTextMateRegistry` memoized via assignment-in-expression; now `??=`.
- Seven Node builtin imports missing the `node:` protocol.
- `hslToHexColor`'s single-letter parameters are spelled out. Verified byte-identical
  over all 158,760 hue/saturation/lightness combinations at a 1°/5% step before and
  after — the mutation of `l` in place made the rename worth proving rather than eyeballing.

## How to honor it

- **Do not reinstall `@stylistic/eslint-plugin`** or reintroduce formatting rules to
  ESLint. If the formatting is wrong, it is `@charcuterie/biome-config` that is wrong,
  and it should be fixed there for every repo at once.
- `src/visualTester*.ts` stays excluded from **both** linters (it already was in ESLint).
- `yarn lint` writes; `yarn lint:check` only checks. `package`/`compile`/`test` call
  `lint:check`, so packaging never rewrites source.

## Evidence

Owner, 2026-08-10, on the Phase 2 report that colormate formats with `@stylistic`:

> "Is `@stylistic` somehow related to formatting for VSCode Extensions specifically?
> Maybe it's important? If not, then just swap it with Biome."

Shown the concrete before/after and the 224→60 line collapse, and asked whether to swap
fully, keep `@stylistic` as the formatter, or adopt only the tsconfig, he chose the full
swap.
