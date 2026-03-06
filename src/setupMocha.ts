import { glob } from "glob"
import Mocha from "mocha"
import path, { dirname } from "path"
import { fileURLToPath } from "url"

// __dirname isn't available in ESM modules, replicate its value
const __dirname = dirname(fileURLToPath(import.meta.url))

export function run(): (
  Promise<
    void
  >
) {
  // Create the mocha test
  const mocha = new Mocha({
    color: true,
    ui: "tdd",
  })

  const testsRoot = __dirname

  console.log("testsRoot", testsRoot)

  return (
    glob(
      "**/*.test.js",
      {
        cwd: testsRoot,
      },
    )
    .then((files) => {
      // Add files to the test suite
      files.forEach((filePath) => mocha.addFile(path.resolve(testsRoot, filePath)))
    })
    // Use async loader so ESM files are imported correctly
    .then(() => mocha.loadFilesAsync())
    .then(() => (
      new Promise<
        void
      >((
        resolve,
        reject,
      ) => {
        mocha
        .run((failures) => {
          if (failures > 0) {
            reject(
              new Error(`${failures} tests failed.`),
            )
          }
          else {
            resolve()
          }
        })
      })
    ))
    .catch((
      error,
    ) => {
      console.error(
        error,
      )

      throw error
    })
  )
}
