import {
  textEditorDecorationMap,
} from './cache'
import { removePreviousTextEditorDecorations } from './removePreviousTextEditorDecorations'

export const removeAllTextEditorDecorations = () => {
  Array
  .from(
    textEditorDecorationMap
    .keys()
  )
  .forEach((
    editor,
  ) => {
    removePreviousTextEditorDecorations(
      editor
    )
  })
}
