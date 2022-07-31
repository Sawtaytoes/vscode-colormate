// Modified from https://github.com/Microsoft/vscode-textmate#readme.
import fs from 'fs'
import {
  readFile,
} from 'fs/promises'
import {
  loadWASM,
  OnigScanner,
  OnigString,
} from 'vscode-oniguruma'
import path from 'path'
import {
  INITIAL,
  IToken,
  parseRawGrammar,
  Registry,
} from 'vscode-textmate'

import {
  getScopeFilePath,
} from './textMateGrammars'

const wasmBin = fs.readFileSync(path.join(__dirname, '../node_modules/vscode-oniguruma/release/onig.wasm')).buffer

const vscodeOnigurumaLib = (
  loadWASM(wasmBin)
  .then(() => {
    return {
      createOnigScanner(patterns: string[]) { return new OnigScanner(patterns) },
      createOnigString(s: string) { return new OnigString(s) }
    }
  })
)

// Create a registry that can create a grammar from a scope name.
export const getTextMateRegistry = (
  scopeName: string,
) => (
  new Registry({
    loadGrammar: (
      gammarScopeName: string,
    ) => {
      if (
        gammarScopeName
        === scopeName
      ) {
        const scopeFilePath = (
          getScopeFilePath(
            scopeName
          )
        )

        return (
          readFile(
            scopeFilePath
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
          .catch((
            error,
          ) => {
            console
            .error(
              error
            )

            return null
          })
        )
      }

      console.log(
        'Unknown scope name:',
        gammarScopeName,
      )

      return (
        Promise
        .resolve(
          null
        )
      )
    },
    onigLib: vscodeOnigurumaLib,
  })
)

// Load the JavaScript grammar and any other grammars included by it async.
export const getTextMateLineTokens = ({
  documentText,
  registry,
  scopeName,
}: {
  documentText: string,
  registry: Registry,
  scopeName: string,
}) => (
  registry
  .loadGrammar(
    scopeName
  )
  .then((
    grammar,
  ) => {
    const lineTokens: {
      lineNumber: number;
      symbol: string;
      token: IToken;
    }[][] = []
    let ruleStack = INITIAL

    const documentLines = (
      documentText
      .split(
        /\r\n|\r|\n/
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
            )
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
          }))
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
      error
    )

    return [] as {
      lineNumber: number;
      symbol: string;
      token: IToken;
    }[]
  })
)
