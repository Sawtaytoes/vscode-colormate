// Modified from https://github.com/Microsoft/vscode-textmate#readme.
import {
  readFile,
} from "fs/promises"
import {
  INITIAL,
  IToken,
  parseRawGrammar,
  Registry,
} from "vscode-textmate"

import {
  createVscodeOnigurmaLibrary,
} from "./createVscodeOnigurmaLibrary.js"
import {
  getScopeFilePath,
} from "./textMateGrammars.js"
import {
  addTextMateGrammar,
  textMateGrammarsState,
} from "./textMateGrammarsState.js"

let textMateRegistry: (
  | Registry
  | undefined
)

// Create a registry that can create a grammar from a scope name.
const createTextMateRegistry = () => (
  new Registry({
    loadGrammar: (
      grammarScopeName: string,
    ) => {
      const scopeFilePath = (
        getScopeFilePath(
          grammarScopeName,
        )
      )

      const parsedGrammarData = (
        textMateGrammarsState
        .getState()
        .entities
        [grammarScopeName]
        ?.parsedGrammarData
      )

      return (
        parsedGrammarData
        ? (
          Promise
          .resolve(
            parsedGrammarData,
          )
        )
        : (
          readFile(
            scopeFilePath,
          )
          .then((
            data,
          ) => (
            data
            .toString()
          ))
          .then((
            data,
          ) => (
            parseRawGrammar(
              data,
              scopeFilePath,
            )
          ))
          .then((
            parsedGrammarData,
          ) => {
            textMateGrammarsState
            .dispatch(
              addTextMateGrammar({
                id: grammarScopeName,
                parsedGrammarData,
              }),
            )

            return parsedGrammarData
          })
          .catch((
            error,
          ) => {
            console
            .error(
              error,
            )

            return null
          })
        )
      )
    },
    onigLib: createVscodeOnigurmaLibrary(),
  })
)

// Memoized so Oniguruma's `loadWASM` only runs once per extension host
// and loaded grammars stay cached across `colorize` calls. Previously a new
// `Registry` (and WASM load) was created on every keystroke-debounced call.
export const getTextMateRegistry = () => (
  textMateRegistry
  ?? (
    textMateRegistry
      = createTextMateRegistry()
  )
)

// Load the JavaScript grammar and any other grammars included by it async.
export const getTextMateLineTokens = ({
  documentText,
  registry,
  scopeName,
}: {
  documentText: string
  registry: Registry
  scopeName: string
}) => (
  registry
  .loadGrammar(
    scopeName,
  )
  .then((
    grammar,
  ) => {
    const lineTokens: (
      Array<
        Array<{
          lineNumber: number
          symbol: string
          token: IToken
        }>
      >
    ) = []

    let ruleStack = INITIAL

    const documentLines = (
      documentText
      .split(
        /\r\n|\r|\n/,
      )
    )

    for (let i = 0; i < documentLines.length; i++) {
      const line = documentLines[i]

      const tokenizedLine = (
        grammar
        ?.tokenizeLine(
          line,
          ruleStack,
        )
      )

      if (tokenizedLine) {
        // console.log(`\nTokenizing line: ${line}`)
        const tokenSymbols: string[] = []

        for (let j = 0; j < tokenizedLine.tokens.length; j++) {
          const token = tokenizedLine.tokens[j]

          tokenSymbols
          .push(
            line
            .substring(
              (
                token
                .startIndex
              ),
              (
                token
                .endIndex
              ),
            ),
          )

          // console.log(` - token from ${token.startIndex} to ${token.endIndex} ` +
          //   `(${line.substring(token.startIndex, token.endIndex)}) ` +
          //   `with scopes ${token.scopes.join(', ')}`
          // )
        }

        lineTokens
        .push(
          tokenizedLine
          .tokens
          .map((
            token,
            index,
          ) => ({
            lineNumber: i,
            symbol: (
              tokenSymbols
              [index]
            ),
            token,
          })),
        )

        ruleStack = tokenizedLine.ruleStack
      }
      // else {
      //   console.log(`\nNo tokens for line: ${line}`)
      // }
    }

    return (
      lineTokens
      .flat()
    )
  })
  .catch((
    error,
  ) => {
    console
    .error(
      error,
    )

    return [] as (
      Array<{
        lineNumber: number
        symbol: string
        token: IToken
      }>
    )
  })
)
