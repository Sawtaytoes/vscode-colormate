import {
  TextEditorDecorationType,
} from 'vscode'

export const removeTextEditorDecorations = (
  textEditorDecorations: (
    Set<
      TextEditorDecorationType
    >
  ),
) => {
  Array
  .from(
    textEditorDecorations
  )
  .forEach((
    textEditorDecoration,
  ) => {
    textEditorDecoration
    .dispose()
  })
}
