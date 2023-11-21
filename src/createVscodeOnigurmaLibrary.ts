// Modified from https://github.com/Microsoft/vscode-textmate#readme.
import {
  readFile,
} from 'fs/promises'
import {
  join,
} from 'path'
import {
  loadWASM,
  OnigScanner,
  OnigString,
} from 'vscode-oniguruma'
import {
  IOnigLib,
} from 'vscode-textmate'

export const createVscodeOnigurmaLibrary = (): (
  Promise<
    IOnigLib
  >
) => (
  readFile(
    join(
      __dirname,
      '../node_modules/vscode-oniguruma/release/onig.wasm'
    )
  )
  .then(({
    buffer,
  }) => (
    loadWASM(
      buffer
    )
    .then(() => ({
      createOnigScanner: (
        patterns: string[]
      ) => (
        new OnigScanner(
          patterns
        )
      ),
      createOnigString: (
        string: string
      ) => (
        new OnigString(
          string
        )
      ),
    }))
  ))
  .catch((
    error,
  ) => {
    console
    .error(
      error
    )

    return createVscodeOnigurmaLibrary()
  })
)
