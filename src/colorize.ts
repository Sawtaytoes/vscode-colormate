import vscode, { TextEditorDecorationType } from 'vscode'

import {
  getIgnoredLanguages,
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

  const [
    legend,
    tokensData,
  ] = (
    await (
      Promise
      .all([
        (
          vscode
          .commands
          .executeCommand<
            | (
              vscode
              .SemanticTokensLegend
            )
            | undefined
          >(
            'vscode.provideDocumentSemanticTokensLegend',
            uri,
          )
        ),
        (
          vscode
          .commands
          .executeCommand<
            | (
              vscode
              .SemanticTokens
            )
            | undefined
          >(
            'vscode.provideDocumentSemanticTokens',
            uri,
          )
        ),
      ])
    )
  )

  if (
    legend == null
    || tokensData == null
  ) {
    return
  }

  const rangesBySymbolName = (
    rangesByName(
      tokensData,
      legend,
      editor,
    )
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
    rangesBySymbolName
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
