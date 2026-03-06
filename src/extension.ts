import vscode from "vscode"

import { editorChangeEpic } from "./editorChangeEpic.js"
import {
  addExtensionContext,
  extensionContextsState,
} from "./extensionContextsState.js"
import { removeAllTextEditorDecorations } from "./removeAllTextEditorDecorations.js"
import { removeUnusedTextEditorDecorations } from "./removeUnusedTextEditorDecorations.js"

function onTextEditorListChange() {
  removeUnusedTextEditorDecorations(
    vscode
    .window
    .visibleTextEditors,
  )
}

export const activate = (
  extensionContext: (
    vscode.ExtensionContext
  ),
) => {
  editorChangeEpic()
  .subscribe()

  extensionContextsState
  .dispatch(
    addExtensionContext(
      extensionContext,
    ),
  )

  extensionContext
  .subscriptions
  .push(
    vscode
    .window
    .onDidChangeVisibleTextEditors(
      onTextEditorListChange,
    ),
  )
}

export const deactivate = () => {
  // TODO: Stop the Redux store and Redux-Observable listeners.
  removeAllTextEditorDecorations()
}
