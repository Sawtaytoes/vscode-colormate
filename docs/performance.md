# Performance: debouncing & caching

Handoff notes for performance work on ColorMate's colorization pipeline. This
documents **what already exists** (so it isn't re-implemented) and **what's
worth doing next**, with enough detail for another agent to pick up.

The hot path is [`colorize()`](../src/colorize.ts), triggered by the
redux-observable [`editorChangeEpic`](../src/editorChangeEpic.ts). On each run it
requests semantic tokens from VS Code, tokenizes every line via TextMate,
dedupes/filters identifiers, builds a `TextEditorDecorationType` per identifier,
and applies decorations to the editor.

## Already done — do not re-implement

- **Per-editor debounce (250ms).** [editorChangeEpic.ts:161-193](../src/editorChangeEpic.ts#L161-L193)
  groups the merged event stream by `TextEditor` and applies `debounceTime(250)`
  per group, so rapid edits in one editor coalesce while separate editors
  colorize in parallel. The interval is **hard-coded**, not configurable.
- **TextMate `Registry` + WASM memoized.** [textMateRegistry.ts](../src/textMateRegistry.ts)
  keeps a module-level singleton `Registry`, so Oniguruma's `loadWASM` runs once
  per extension host and loaded grammars stay warm across `colorize` calls.
- **Parsed grammars cached in redux state.** The registry's `loadGrammar`
  callback checks `textMateGrammarsState` before reading/parsing a grammar from
  disk and stores the parsed result back. See [textMateGrammarsState.ts](../src/textMateGrammarsState.ts).
- **Stale decoration cleanup.** [cache.ts](../src/cache.ts)'s `textEditorDecorationMap`
  tracks the decoration types applied per editor; the tail of `colorize()`
  disposes the previous run's decorations.

## Not done — candidate tasks

### 1. Skip re-colorize when the document hasn't changed (highest value)

`colorize()` re-tokenizes and rebuilds decorations on every trigger even when
the document text is identical to the last run (e.g. cursor-only activity,
theme/config events, re-activation). The user framed this as "hash the doc in
the editor view."

**Recommendation — use `TextDocument.version`, not a text hash.** VS Code already
exposes a monotonically-increasing `document.version` that bumps on every edit
("might already be done for us"). Cache the last-colorized version per document
and bail early when unchanged:

- Key a cache by `document.uri.toString()` → last `document.version` (and the
  theme kind, since a theme change must force a recolor even with the same
  version — see task 2).
- At the top of `colorize()` (or as a `filter` in the epic before `colorize`),
  skip if `document.version` matches the cached value **and** the theme hasn't
  changed.
- A `crc8`/text hash is unnecessary and weaker than `version`; `crc8Hash`
  ([crc8Hash.ts](../src/crc8Hash.ts)) is an 8-bit identifier→color hash and would
  collide badly as a document fingerprint — don't reuse it for this.

Caveat: theme and config changes don't bump `document.version`, so the cache key
must include theme kind / a config generation counter, or those event branches
must explicitly invalidate the cache.

### 2. Make the debounce interval configurable ("small debounce window")

Replace the hard-coded `debounceTime(250)` with a setting.

- Add a `colormate.debounceInterval` (number, ms, default `250`) to
  `package.json` `contributes.configuration`, alongside the existing keys.
- Add a getter in [configuration.ts](../src/configuration.ts) following the
  pattern of `getConfiguredTextMateTokenScopes` etc.
- Wire it into [editorChangeEpic.ts:171](../src/editorChangeEpic.ts#L171). Read
  it per emission (or re-subscribe on `onDidChangeConfiguration`) so changes take
  effect without reload. `debounceTime` takes a fixed number, so to make it
  dynamic use `debounce(() => timer(getDebounceInterval()))` or recompute on
  config change.

### 3. Memoize `getTextEditorDecoration` by identifier + theme

[getTextEditorDecoration.ts:53-63](../src/getTextEditorDecoration.ts#L53-L63)
calls `window.createTextEditorDecorationType()` on every call, creating a fresh
decoration type for the same identifier across runs (and disposing it shortly
after). Memoize by `(identifier, colorThemeKind, saturation, lighting)` so the
same color reuses one decoration type. Invalidate/dispose the cache on theme or
HSL-config change. Note decoration types are disposable VS Code resources, so the
cache must own disposal — coordinate with `textEditorDecorationMap` in
[cache.ts](../src/cache.ts).

### 4. (Lower priority) Cache TextMate line tokens per document version

`getTextMateLineTokens()` re-tokenizes the whole document each run. If task 1
lands, most redundant tokenization disappears. If profiling still shows cost on
large files, cache line tokens keyed by `document.version` and re-tokenize only
changed line ranges from `onDidChangeTextDocument` `contentChanges`.

## Suggested order

1. Task 1 (version-based skip) — biggest win, unblocks the rest.
2. Task 2 (configurable debounce) — small, user-facing.
3. Task 3 (decoration memoization) — reduces churn/allocations.
4. Task 4 — only if profiling justifies it.

## Verification

- Manual: open a large file, hold a key / spam edits, confirm colorization stays
  responsive; switch editors and themes and confirm colors update correctly
  (esp. that theme changes still force a recolor after task 1).
- `yarn compile` and `yarn lint` must pass; run `yarn test` for the existing
  suite ([crc8Hash.test.ts](../src/crc8Hash.test.ts) and others).

---

### Preserved from the old `todo.md`

Gray-theme design reference (the "Gray themes" work is complete; kept here so the
snippet isn't lost):

```jsonc
"editor.tokenColorCustomizations": {
  "[Default Light+]": {
    "semanticHighlighting": false,
    "comments": "#306030",
    "keywords": "#606060",
    "functions": "#202020",
    "numbers": "#404040",
    "strings": "#404040",
    "types": "#606060",
    "variables": "#202020"
  }
}
```
