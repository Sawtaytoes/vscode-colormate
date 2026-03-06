import { runTests } from "@vscode/test-electron"
import { resolve, dirname } from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = dirname(fileURLToPath(import.meta.url))

async function main() {
  try {
    // The folder containing the Extension Manifest package.json
    // Passed to `--extensionDevelopmentPath`
    const extensionDevelopmentPath = process.cwd()

    // The path to test runner
    // Passed to --extensionTestsPath
    const extensionTestsPath = resolve(
      __dirname,
      "./setupMocha.js",
    )

    // Download VS Code, unzip it and run the integration test
    await runTests({
      extensionDevelopmentPath,
      extensionTestsEnv: {
        DISABLE_WSL: "true",
      },
      extensionTestsPath,
      launchArgs: [
        "--disable-extensions",
      ],
    })
  }
  catch (error) {
    console.error("Failed to run tests", error)
    process.exit(1)
  }
}

main()
