import {
  commands,
  Position,
  Range,
  SemanticTokens,
  SemanticTokensLegend,
  TextEditor,
  TextEditorDecorationType,
} from 'vscode'
import {
  IToken,
} from 'vscode-textmate'

import {
  textEditorDecorationMap,
} from './cache'
import {
  getExcludedTextMateTokenScopes,
  getIgnoredLanguages,
  getConfiguredTextMateTokenScopes,
} from './configuration'
import {
  getTextEditorDecoration,
} from './getTextEditorDecoration'
import {
  rangesByName,
} from './rangesByName'
import {
  removeTextEditorDecorations,
} from './removeTextEditorDecorations'
import {
  getScopeName,
} from './textMateGrammars'
import {
  getTextMateLineTokens,
  getTextMateRegistry,
} from './textMateRegistry'
import {
  createIsInTextMateScope,
} from './textMateScopes'

export const colorize = async (
  editor: TextEditor,
): (
  Promise<
    void
  >
) => {
  if (
    !(
      editor
      ?.document
    )
  ) {
    return
  }

  const uri = (
    editor
    .document
    .uri
  )

  if (
    uri == null
    || (
      getIgnoredLanguages()
      .has(
        editor
        .document
        .languageId
      )
    )
  ) {
    return
  }

  const scopeName = (
    getScopeName(
      editor
      .document
      .languageId
    )
  )

  const isInTextMateScope = (
    createIsInTextMateScope(
      scopeName
    )
  )

  const [
    legend,
    tokensData,
    textMateLineTokens,
  ] = (
    await (
      Promise
      .all([
        (
          commands
          .executeCommand<
            SemanticTokensLegend
          >(
            'vscode.provideDocumentSemanticTokensLegend',
            uri,
          )
        ),
        (
          commands
          .executeCommand<
            SemanticTokens
          >(
            'vscode.provideDocumentSemanticTokens',
            uri,
          )
        ),
        (
          getTextMateLineTokens({
            documentText: (
              (
                editor
                .document
                .getText()
              )
              || ''
            ),
            registry: (
              getTextMateRegistry()
            ),
            scopeName,
          })
        ),
      ])
    )
  )

  const semanticTokenRangesBySymbolName = (
    (
      legend
      && tokensData
    )
    ? (
      rangesByName(
        tokensData,
        legend,
        editor,
      )
    )
    : (
      {} as (
        Record<
          string,
          Range[]
        >
      )
    )
  )

  // TODO: Convert these to search trees to make searching faster.
  // TODO: Add function to make searching search trees easier.
  const configuredTextMateTokenScopes = (
    Array
    .from(
      getConfiguredTextMateTokenScopes()
    )
  )

  const excludedTextMateTokenScopes = (
    Array
    .from(
      getExcludedTextMateTokenScopes()
    )
  )

  const textMateTokenRangesBySymbolName = (
    Array
    .from(
      textMateLineTokens
      .reduce(
        (
          {
            deduplicatedTokenMap,
            symbolLookup,
          },
          {
            lineNumber,
            symbol,
            token,
          },
        ) => ({
          deduplicatedTokenMap: (
            (
              (
                symbolLookup
                .has(
                  symbol
                )
              )
              // TEMP: This is hack-fix for keywords being variable names that also happen to have TextMate scopes.
              && (
                !(
                  token
                  .scopes
                  .includes(
                    "keyword.control.from.ts"
                  )
                )
              )
            )
            ? deduplicatedTokenMap
            : (
              deduplicatedTokenMap
              .set(
                (
                  // TEMP: This is hack-fix for keywords being variable names that also happen to have TextMate scopes.
                  (
                    token
                    .scopes
                    .includes(
                      "keyword.control.from.ts"
                    )
                  )
                  ? "keyword.control.from.ts"
                  : symbol
                ),
                (
                  (
                    deduplicatedTokenMap
                    .get(
                      // TEMP: This is hack-fix for keywords being variable names that also happen to have TextMate scopes.
                      (
                        token
                        .scopes
                        .includes(
                          "keyword.control.from.ts"
                        )
                      )
                      ? "keyword.control.from.ts"
                      : symbol
                    )
                    || []
                  )
                  .concat({
                    lineNumber,
                    token,
                  })
                ),
              )
            )
          ),
          symbolLookup,
        }),
        {
          deduplicatedTokenMap: (
            new Map<
              string,
              {
                lineNumber: number,
                token: IToken,
              }[]
            >()
          ),
          symbolLookup: (
            new Set<
              string
            >()
          ),
        },
      )
      .deduplicatedTokenMap
    )
    .map(([
      symbol,
      tokens,
    ]) => ({
      scopes: (
        Array
        .from(
          new Set(
            tokens
            .map(({
              token
            }) => (
              token
              .scopes
            ))
            .flat()
          )
        )
      ),
      symbol,
      tokens,
    }))
    .filter(({
      scopes,
    }) => {
      const highestScopeSpecificity = (
        configuredTextMateTokenScopes
        .filter((
          tokenScope,
        ) => (
          scopes
          .some((
            scope,
          ) => (
            isInTextMateScope(
              scope,
              tokenScope,
            )
          ))
        ))
        .reduce(
          (
            highestScopeSpecificity,
            scope,
          ) => (
            Math
            .max(
              highestScopeSpecificity,
              (
                scope
                .split(
                  '.'
                )
                .length
              ),
            )
          ),
          -1,
        )
      )

      return (
        (
          highestScopeSpecificity
          >= 0
        )
        && (
          !(
            scopes
            .some((
              scope,
            ) => (
              excludedTextMateTokenScopes
              .some((
                excludedTokenScope,
              ) => (
                isInTextMateScope(
                  scope,
                  excludedTokenScope,
                )
                && (
                  (
                    excludedTokenScope
                    .split(
                      '.'
                    )
                    .length
                  )
                  >= (
                    highestScopeSpecificity
                  )
                )
              ))
            ))
          )
        )
      )
    })
    .map<[
      string,
      Range[]
    ]>(({
      symbol,
      tokens,
    }) => ([
      symbol,
      (
        tokens
        .map(({
          lineNumber,
          token,
        }) => (
          new Range(
            new Position(
              lineNumber,
              (
                token
                .startIndex
              ),
            ),
            new Position(
              lineNumber,
              (
                token
                .endIndex
              ),
            )
          )
        ))
      ),
    ]))
  )

  const previousTextEditorDecorations = (
    textEditorDecorationMap
    .get(
      editor
    )
  )

  const textEditorDecorations = (
    new Set<
      TextEditorDecorationType
    >()
  )

  textEditorDecorationMap
  .set(
    editor,
    textEditorDecorations,
  )

  Object
  .entries(
    semanticTokenRangesBySymbolName
  )
  .concat(
    textMateTokenRangesBySymbolName
  )
  .map(([
    identifier,
    ranges,
  ]) => ({
    ranges,
    textEditorDecoration: (
      getTextEditorDecoration(
        identifier
      )
    ),
  }))
  .forEach(({
    ranges,
    textEditorDecoration,
  }) => {
    textEditorDecorations
    .add(
      textEditorDecoration,
    )

    editor
    .setDecorations(
      textEditorDecoration,
      ranges,
    )
  })

  if (previousTextEditorDecorations) {
    removeTextEditorDecorations(
      previousTextEditorDecorations
    )
  }
}
