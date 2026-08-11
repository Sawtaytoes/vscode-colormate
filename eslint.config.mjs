import {
  createTestRules,
  createTypedRules,
} from "@charcuterie/eslint-config"
import { defineConfig, globalIgnores } from "eslint/config"
import typescriptEslint from "typescript-eslint"

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
  globalIgnores(["dist", "out", "src/visualTester*.ts"]),
  ...typescriptEslint.configs.recommended,
  createTypedRules({
    tsconfigRootDir: import.meta.dirname,
  }),
  createTestRules({
    files: ["**/*.test.ts"],
  }),
  {
    files: ["**/*.mjs", "**/*.ts"],
    rules: {
      // An imported binding's name is the exporting module's
      // choice, not ours.
      "@typescript-eslint/naming-convention": [
        "warn",
        {
          selector: "import",
          format: ["camelCase", "PascalCase"],
        },
      ],

      curly: "warn",
      eqeqeq: ["error", "smart"],
      "no-throw-literal": "warn",
    },
  },
])
