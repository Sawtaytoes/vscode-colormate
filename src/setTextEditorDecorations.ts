import {
  Range,
  TextEditor,
} from 'vscode'

import {
  getTextEditorDecoration,
} from './getTextEditorDecoration'

export const setTextEditorDecorations = (
  editor: TextEditor,
) => (
  tokenMap: [
    string,
    Range[],
  ][],
) => (
  tokenMap
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
    editor
    .setDecorations(
      textEditorDecoration,
      ranges,
    )
  })
)
