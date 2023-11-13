import { glob } from "glob"
import Mocha from "mocha"
import path from "path"

export function run(): (
  Promise<
    void
  >
) {
  // Create the mocha test
  const mocha = new Mocha({
    color: true,
    ui: "tdd"
  })

  const testsRoot = __dirname

  console.log('testsRoot', testsRoot)

  return (
    glob(
      "**/**.test.js",
      {
        cwd: testsRoot,
      },
    )
    .then((files) => {
      // Add files to the test suite
      files.forEach(filePath => mocha.addFile(path.resolve(testsRoot, filePath)))
    })
    .then(() => (
      new Promise<
        void
      >((
        resolve,
        reject,
      ) => {
        mocha
        .run(failures => {
          if (failures > 0) {
            reject(
              new Error(`${failures} tests failed.`)
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
        error
      )

      throw error
    })
  )
}
