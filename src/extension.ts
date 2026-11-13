import vscode from "vscode"

import { editorChangeEpic } from "./editorChangeEpic"
import {
  addExtensionContext,
  extensionContextsState,
} from "./extensionContextsState.js"
import { outputChannel } from "./outputChannel"
import { removeAllTextEditorDecorations } from "./removeAllTextEditorDecorations"
import { removeUnusedTextEditorDecorations } from "./removeUnusedTextEditorDecorations"
import { subscriptionToDisposable } from "./subscriptionToDisposable"

function onTextEditorListChange() {
  removeUnusedTextEditorDecorations(
    vscode.window.visibleTextEditors,
  )
}

export const activate = (
  extensionContext: vscode.ExtensionContext,
) => {
  extensionContext.subscriptions.push(outputChannel)

  // VS Code disposes everything in `subscriptions` when the extension
  // deactivates, so the epic stops listening for editor changes.
  extensionContext.subscriptions.push(
    subscriptionToDisposable(
      editorChangeEpic().subscribe(),
    ),
  )

  extensionContextsState.dispatch(
    addExtensionContext(extensionContext),
  )

  extensionContext.subscriptions.push(
    vscode.window.onDidChangeVisibleTextEditors(
      onTextEditorListChange,
    ),
  )
}

export const deactivate = () => {
  // The epic and the VS Code event listeners are in
  // `extensionContext.subscriptions`, so VS Code disposes them.
  removeAllTextEditorDecorations()
}
