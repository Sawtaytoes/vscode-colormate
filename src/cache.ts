import {
  TextEditor,
  TextEditorDecorationType,
} from 'vscode'

export const textEditorDecorationMap = (
  new Map<
    (
      TextEditor
    ),
    (
      Set<
        TextEditorDecorationType
      >
    )
  >()
)
