import vscode from "vscode"

import { editorChangeEpic } from "./editorChangeEpic"
import {
  addExtensionContext,
  extensionContextsState,
} from "./extensionContextsState"
import {
  removePreviousTextEditorDecorations,
} from "./removePreviousTextEditorDecorations"
import {
  removeUnusedTextEditorDecorations,
} from "./removeUnusedTextEditorDecorations"

editorChangeEpic()
.subscribe()

function onTextEditorListChange() {
  removeUnusedTextEditorDecorations(
    vscode
    .window
    .visibleTextEditors
  )
}

export const activate = (
  extensionContext: (
    vscode
    .ExtensionContext
  )
) => {
  extensionContextsState
  .dispatch(
    addExtensionContext(
      extensionContext
    )
  )

  extensionContext
  .subscriptions
  .push(
    vscode
    .window
    .onDidChangeVisibleTextEditors(
      onTextEditorListChange
    )
  )
}

export const deactivate = () => {
  // TODO: Stop the Redux store and Redux-Observable listeners.
  removePreviousTextEditorDecorations()
}
