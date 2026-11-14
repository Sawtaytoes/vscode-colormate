# 2026-11-14 — Every lint rule is an error, and the preset's naming rule applies

- **Status:** Accepted
- **Date:** 2026-11-14
- **Type:** tooling / linting
- **Supersedes:** —
- **Superseded by:** —

## Decision

`eslint.config.mjs` sets no rule below `error` and does not replace a rule from
`@charcuterie/eslint-config`:

- The `@typescript-eslint/naming-convention` entry with `selector: "import"` is removed, so the
  preset's `is`/`has` boolean rule from `createTypedRules` applies to every `.ts` file.
- `curly` and `no-throw-literal` stay, at `error` instead of `warn`.

No exception is kept for the VS Code API: no name in this repo's code needs one.

## Context

On 2026-11-14 the fleet made a lint warning fail CI (#29 here). Three ESLint settings were still
at `warn`, and the owner asked whether the platform (here, the VS Code extension host) was the
reason. The history:

| Setting | Added | Where it came from |
| --- | --- | --- |
| `curly: "warn"` | `b34b0bb`, 2022-07-29 (initial commit) | the `yo code` extension template |
| `no-throw-literal: "warn"` | `b34b0bb`, 2022-07-29 (initial commit) | the `yo code` extension template |
| `naming-convention`, `selector: "import"`, `warn` | `8ae9d41`, 2026-03-05 ("Converts to latest VSCode Extension starter") | the newer `yo code` template |

The template's original `"@typescript-eslint/naming-convention": "warn"` was removed on
2023-11-13 (`cce6aa0`) because it was noisy. The 2026-03-05 template brought back the narrower
import-only entry.

On 2026-08-11 (`d5c661d`) the repo adopted `createTypedRules`, which sets
`@typescript-eslint/naming-convention` to the fleet's `is`/`has` boolean rule. The template's
import entry came later in the same config. ESLint replaces a rule's options when a later
config sets the rule again; it does not merge them. So `eslint --print-config` showed only the
import entry, at `warn`, and the boolean rule never ran here, although the 2026-08-11 decision
says it was adopted.

## Why

None of the three has a platform reason. The extension host runs ordinary TypeScript, and
`curly` and `no-throw-literal` are style and safety rules that the template ships at `warn` as a
default, not because VS Code needs it. The import entry was not protecting an import name that
the `vscode` API forces: the code imports `vscode` as `vscode`, and the preset does not check
import names at all. Its only effect was to switch the boolean rule off.

At `error` with no override, all three report 0 findings, and so does the restored boolean rule,
so no code changes.

## Evidence

- Before, on `master` at `a880534`: `eslint --print-config src/extension.ts` gives
  `naming-convention` as `[1, {"selector": "import", ...}]`, `curly` as `[1, "all"]`, and
  `no-throw-literal` as `[1]`.
- After: `naming-convention` is `[2, <the preset's is/has rule>]`, `curly` is `[2, "all"]`, and
  `no-throw-literal` is `[2]`. `eslint . --max-warnings 0` reports 0 findings.
- The owner, 2026-11-14, about these settings: *"Those are Electron-based, and that might be why
  right?"*
