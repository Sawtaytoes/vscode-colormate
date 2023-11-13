import { glob } from "glob"
import Mocha from "mocha"
import path from "path"

export function run(): Promise<void> {
  // Create the mocha test
  const mocha = new Mocha({
    color: true,
    ui: "tdd"
  })

  const testsRoot = __dirname

  return (
    glob("**/**.test.js", { cwd: testsRoot })
    .then((files) => {
      // Add files to the test suite
      files.forEach(f => mocha.addFile(path.resolve(testsRoot, f)))

      mocha.run(failures => {
        if (failures > 0) {
          throw new Error(`${failures} tests failed.`)
        }
      })
    })
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
