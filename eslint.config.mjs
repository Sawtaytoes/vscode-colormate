import {
  createTestRules,
  createTypedRules,
  tseslint,
} from "@charcuterie/eslint-config"
import { defineConfig, globalIgnores } from "eslint/config"

/**
 * The fleet's shared ESLint rules, from `@charcuterie/eslint-config`
 * — `id-length` and the `is`/`has` boolean naming convention. No
 * React blocks: this is a VS Code extension host, not a UI app.
 *
 * FORMATTING IS BIOME'S JOB. `@stylistic/eslint-plugin` used to
 * format this repo (`newline-per-chained-call`, `dot-location`, a
 * customized `indent`), which made colormate the one repo in the
 * fleet formatted differently from every other. Dropped 2026-08-11
 * — see `docs/decisions/2026-08-11-biome-formats-colormate-not-stylistic.md`.
 */
export default defineConfig([
  globalIgnores([
    ".vscode-test",
    "dist",
    "out",
    "src/visualTester*.ts",
  ]),
  ...tseslint.configs.recommended,
  createTypedRules({
    tsconfigRootDir: import.meta.dirname,
  }),
  createTestRules({
    files: ["**/*.test.ts"],
  }),
  {
    // Three rules from the VS Code extension template (`yo code`),
    // which ships them at `warn`. They are style and safety rules,
    // not anything the extension host needs, so they run at
    // `error` like every other rule here.
    //
    // Do not add `@typescript-eslint/naming-convention` to this
    // block. ESLint replaces a rule's options rather than merging
    // them, so the template's `selector: "import"` entry switched
    // off the preset's `is`/`has` boolean rule above for every `.ts`
    // file from 2026-08-11 to 2026-11-14
    // (`docs/decisions/2026-11-14-every-lint-rule-is-an-error-and-the-preset-naming-rule-applies.md`).
    files: ["**/*.mjs", "**/*.ts"],
    rules: {
      curly: "error",
      eqeqeq: ["error", "smart"],
      "no-throw-literal": "error",
    },
  },
])
