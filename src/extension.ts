import debounce from "just-debounce"
import vscode from "vscode"

import {
  colorize,
} from "./colorize"
import {
  addEditor,
  editorsState,
} from "./editorsState"
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

const colorizeIfNeeded = (
  colorize
  // debounce(
  //   colorize,
  //   200,
  // )
)

const onActiveEditorChange = (
  editor: (
    | (
      vscode
      .TextEditor
    )
    | undefined
  )
) => {
  if (editor) {
    editorsState
    .dispatch(
      addEditor(
        editor
      )
    )

    colorizeIfNeeded(
      editor
    )
  }
}

function onConfigChange() {
  const textEditors = (
    vscode
    .window
    .visibleTextEditors
  )

  textEditors
  .filter((
    editor
  ) => (
    editor
  ))
  .forEach((
    editor,
  ) => {
    colorizeIfNeeded(
      editor
    )
  })
}

function onTextEditorListChange() {
  removeUnusedTextEditorDecorations(
    vscode
    .window
    .visibleTextEditors
  )
}

function onTextDocumentChange(
  event: (
    vscode
    .TextDocumentChangeEvent
  ),
) {
  const editor = (
    vscode
    .window
    .activeTextEditor
  )

  if (
    editor
    && (
      (
        editor
        .document
      )
      === (
        event
        .document
      )
    )
  ) {
    editorsState
    .dispatch(
      addEditor(
        editor
      )
    )

    colorizeIfNeeded(
      editor
    )
  }
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
    .onDidChangeActiveColorTheme(
      onConfigChange
    )
  )

  extensionContext
  .subscriptions
  .push(
    vscode
    .window
    .onDidChangeActiveTextEditor(
      onActiveEditorChange
    )
  )

  extensionContext
  .subscriptions
  .push(
    vscode
    .workspace
    .onDidChangeConfiguration(
      onConfigChange
    )
  )

  extensionContext
  .subscriptions
  .push(
    vscode
    .workspace
    .onDidChangeTextDocument(
      onTextDocumentChange
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

  const editor = (
    vscode
    .window
    .activeTextEditor
  )

  if (editor) {
    colorizeIfNeeded(
      editor
    )
  }
}

export const deactivate = () => {
  // TODO: Stop the Redux store and Redux-Observable listeners.
  removePreviousTextEditorDecorations()
}
