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
  removePreviousTextEditorDecorations,
} from './removePreviousTextEditorDecorations'
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

export async function colorize(
  editor: TextEditor,
): Promise<void> {
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
              editor
              .document
              .getText()
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
              symbolLookup
              .has(
                symbol
              )
            )
            ? deduplicatedTokenMap
            : (
              deduplicatedTokenMap
              .set(
                symbol,
                (
                  (
                    deduplicatedTokenMap
                    .get(
                      symbol
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

  removePreviousTextEditorDecorations(
    editor
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
}
