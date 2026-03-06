import stylistic from "@stylistic/eslint-plugin"
import { defineConfig, globalIgnores } from "eslint/config"
import typescriptEslint from "typescript-eslint"

export default defineConfig([
  (
    globalIgnores([
      "src/visualTester*.ts",
    ])
  ),
  ...(
    typescriptEslint
    .configs
    .recommended
  ),
  (
    stylistic
    .configs
    .customize({
      arrowParens: true,
      quotes: "double",
      semi: false,
    })
  ),
  {
    files: [
      "**/*.mjs",
      "**/*.ts",
    ],

    languageOptions: {
      parser: typescriptEslint.parser,
      ecmaVersion: 2022,
      sourceType: "module",
    },

    plugins: {
      "@stylistic": stylistic,
    },

    rules: {
      "@typescript-eslint/naming-convention": [
        "warn",
        {
          selector: "import",
          format: ["camelCase", "PascalCase"],
        },
      ],

      "@stylistic/dot-location": ["warn", "property"],
      "@stylistic/indent": [
        "warn",
        2,
        {
          ignoredNodes: [
            "ConditionalExpression",
            "TSIndexedAccessType",
          ],
          MemberExpression: 0,
          SwitchCase: 1,
          offsetTernaryExpressions: true,
        },
      ],
      "@stylistic/newline-per-chained-call": "warn",

      "curly": "warn",
      "eqeqeq": ["error", "smart"],
      "no-throw-literal": "warn",
      "semi": "off",
    },
  },
])
