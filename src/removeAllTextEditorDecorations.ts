import {
  textEditorDecorationMap,
} from './cache.js'
import {
  removeTextEditorDecorations,
} from './removeTextEditorDecorations.js'

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
