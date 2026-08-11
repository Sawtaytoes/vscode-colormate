# docs/decisions — the locked-decisions paper trail

One file per settled decision: the rule, what was rejected, why, and how to honor it.
**Never edit a file here to change its meaning** — supersede it with a new dated file and
cross-link both directions.

Newest first.

| Date | Decision |
| --- | --- |
| 2026-08-11 | [**Biome formats this repo; `@stylistic` is dropped**](2026-08-11-biome-formats-colormate-not-stylistic.md) — the fleet `@charcuterie/*` biome/eslint/tsconfig stack. `@stylistic` was never VS Code-specific; it was enforcing a chain style no other repo uses. `useDefineForClassFields` is a non-issue at `target: ES2022` |
