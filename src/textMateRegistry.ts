// Modified from https://github.com/Microsoft/vscode-textmate#readme.
import { readFile } from "node:fs/promises"
import {
  INITIAL,
  type IToken,
  parseRawGrammar,
  Registry,
} from "vscode-textmate"

import { createVscodeOnigurmaLibrary } from "./createVscodeOnigurmaLibrary.js"
import { getScopeFilePath } from "./textMateGrammars.js"
import {
  addTextMateGrammar,
  textMateGrammarsState,
} from "./textMateGrammarsState.js"

let textMateRegistry: Registry | undefined

// Create a registry that can create a grammar from a scope name.
const createTextMateRegistry = () =>
  new Registry({
    loadGrammar: (grammarScopeName: string) => {
      const scopeFilePath = getScopeFilePath(
        grammarScopeName,
      )

      const parsedGrammarData =
        textMateGrammarsState.getState().entities[
          grammarScopeName
        ]?.parsedGrammarData

      return parsedGrammarData
        ? Promise.resolve(parsedGrammarData)
        : readFile(scopeFilePath)
            .then((data) => data.toString())
            .then((data) =>
              parseRawGrammar(data, scopeFilePath),
            )
            .then((parsedGrammarData) => {
              textMateGrammarsState.dispatch(
                addTextMateGrammar({
                  id: grammarScopeName,
                  parsedGrammarData,
                }),
              )

              return parsedGrammarData
            })
            .catch((error) => {
              console.error(error)

              return null
            })
    },
    onigLib: createVscodeOnigurmaLibrary(),
  })

// Memoized so Oniguruma's `loadWASM` only runs once per extension host
// and loaded grammars stay cached across `colorize` calls. Previously a new
// `Registry` (and WASM load) was created on every keystroke-debounced call.
export const getTextMateRegistry = () => {
  textMateRegistry ??= createTextMateRegistry()

  return textMateRegistry
}

// Load the JavaScript grammar and any other grammars included by it async.
export const getTextMateLineTokens = ({
  documentText,
  registry,
  scopeName,
}: {
  documentText: string
  registry: Registry
  scopeName: string
}) =>
  registry
    .loadGrammar(scopeName)
    .then((grammar) => {
      const lineTokens: Array<
        Array<{
          lineNumber: number
          symbol: string
          token: IToken
        }>
      > = []

      let ruleStack = INITIAL

      const documentLines = documentText.split(/\r\n|\r|\n/)

      for (
        let lineIndex = 0;
        lineIndex < documentLines.length;
        lineIndex++
      ) {
        const line = documentLines[lineIndex]

        const tokenizedLine = grammar?.tokenizeLine(
          line,
          ruleStack,
        )

        if (tokenizedLine) {
          // console.log(`\nTokenizing line: ${line}`)
          const tokenSymbols: string[] = []

          for (
            let tokenIndex = 0;
            tokenIndex < tokenizedLine.tokens.length;
            tokenIndex++
          ) {
            const token = tokenizedLine.tokens[tokenIndex]

            tokenSymbols.push(
              line.substring(
                token.startIndex,
                token.endIndex,
              ),
            )

            // console.log(` - token from ${token.startIndex} to ${token.endIndex} ` +
            //   `(${line.substring(token.startIndex, token.endIndex)}) ` +
            //   `with scopes ${token.scopes.join(', ')}`
            // )
          }

          lineTokens.push(
            tokenizedLine.tokens.map((token, index) => ({
              lineNumber: lineIndex,
              symbol: tokenSymbols[index],
              token,
            })),
          )

          ruleStack = tokenizedLine.ruleStack
        }
        // else {
        //   console.log(`\nNo tokens for line: ${line}`)
        // }
      }

      return lineTokens.flat()
    })
    .catch((error) => {
      console.error(error)

      return [] as Array<{
        lineNumber: number
        symbol: string
        token: IToken
      }>
    })
