import {
  textEditorDecorationMap,
} from './cache'
import {
  removeTextEditorDecorations,
} from './removeTextEditorDecorations'

export const removeAllTextEditorDecorations = () => {
  Array
  .from(
    textEditorDecorationMap
    .entries()
  )
  .forEach(([
    textEditor,
    textEditorDecorations,
  ]) => {
    removeTextEditorDecorations(
      textEditorDecorations
    )

    textEditorDecorationMap
    .delete(
      textEditor
    )
  })
}
