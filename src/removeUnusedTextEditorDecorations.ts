import {
  TextEditor,
} from 'vscode'

import {
  textEditorDecorationMap,
} from './cache'

export const removeUnusedTextEditorDecorations = (
  editors: (
    readonly (
      TextEditor
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
