import {
  TextEditor,
  TextEditorDecorationType,
} from 'vscode'

import {
  textEditorDecorationMap,
} from './cache'

export const removePreviousTextEditorDecorations = (
  editor?: (
    TextEditor
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
