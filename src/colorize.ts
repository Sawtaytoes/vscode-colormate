import vscode, {
  Position,
  Range,
  TextEditorDecorationType,
} from 'vscode'
import {
  IToken,
} from 'vscode-textmate'

import {
  getExcludedTextMateTokenScopes,
  getIgnoredLanguages,
  getConfiguredTextMateTokenScopes,
  hslConfig,
} from "./configuration"
import {
  crc8Hash,
} from './crc8Hash'
import {
  hslToHexColor,
} from './hslToHexColor'
import {
  rangesByName,
} from './rangesByName'
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

const textEditorDecorationMap = new Map<
  (
    vscode
    .TextEditor
  ),
  (
    Set<
      TextEditorDecorationType
    >
  )
>()

export const removeUnusedTextEditorDecorations = (
  editors: (
    readonly (
      vscode
      .TextEditor
    )[]
  ),
) => {
  Array
  .from(
    textEditorDecorationMap
    .keys()
  )
  .filter((
    editor,
  ) => (
    !(
      editors
      .includes(
        editor
      )
    )
  ))
  .forEach((
    editor,
  ) => {
    textEditorDecorationMap
    .delete(
      editor
    )
  })
}

export const removePreviousTextEditorDecorations = (
  editor?: (
    vscode
    .TextEditor
  ),
) => {
  const textEditorDecorations = (
    editor
    ? (
      (
        textEditorDecorationMap
        .get(
          editor
        )
      )
      || (
        new Set<
          TextEditorDecorationType
        >()
      )
    )
    : (
      new Set(
        Array
        .from(
          textEditorDecorationMap
          .values()
        )
        .map((
          textEditorDecorations,
        ) => (
          Array
          .from(
            textEditorDecorations
          )
        ))
        .flat()
      )
    )
  )

  Array
  .from(
    textEditorDecorations
  )
  .forEach((
    textEditorDecoration,
  ) => {
    textEditorDecoration
    .dispose()

    textEditorDecorations
    .delete(
      textEditorDecoration
    )
  })
}

export async function colorize(
  editor: vscode.TextEditor,
): Promise<void> {
  const uri = editor.document.uri

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
          vscode
          .commands
          .executeCommand<
            vscode
            .SemanticTokensLegend
          >(
            'vscode.provideDocumentSemanticTokensLegend',
            uri,
          )
        ),
        (
          vscode
          .commands
          .executeCommand<
            vscode
            .SemanticTokens
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
          (
            vscode
            .Range[]
          )
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
  .forEach(([
    symbolName,
    ranges,
  ]) => {
    const crcHex = (
      crc8Hash(
        symbolName
      )
    )

    const colorThemeKind = (
      vscode
      .window
      .activeColorTheme
      .kind
    )

    const hexColor = (
      hslToHexColor(
        (
          crcHex
          * (
            360
            / 256
          )
        ),
        (
          hslConfig
          [colorThemeKind]
          .getSaturation()
        ),
        (
          hslConfig
          [colorThemeKind]
          .getLighting()
        ),
      )
    )

    const textEditorDecoration = (
      vscode
      .window
      .createTextEditorDecorationType({
        color: hexColor,
      })
    )

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
