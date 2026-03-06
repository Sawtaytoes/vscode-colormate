import { defineConfig } from "@vscode/test-cli"

export default defineConfig({
  files: "out/**/*.test.js",
  launchArgs: [
    "--disable-extensions",
  ],
  mocha: {
    ui: "tdd",
    color: true,
    timeout: 60000,
  },
})
