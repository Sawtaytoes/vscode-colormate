import {
  BehaviorSubject,
  Subject,
  scan,
} from 'rxjs'
import debounce from 'just-debounce'
import vscode, { TextEditor } from 'vscode'

// import {
//   addEditor,
//   addExtensionContext,
// } from './reduxObservable/actions'
import {
  colorize,
} from './colorize'
// import {
//   createReduxStore,
// } from './reduxObservable/createReduxStore'
import {
  removePreviousTextEditorDecorations,
} from './removePreviousTextEditorDecorations'
import {
  removeUnusedTextEditorDecorations,
} from './removeUnusedTextEditorDecorations'
import {
  addEditor,
  editorsSlice,
  removeEditor,
} from './editorsSlice'
import { createState } from './createState'

// const reduxStore = (
//   createReduxStore()
// )

const editorsState = (
  createState<
    ReturnType<
      typeof editorsSlice[
        "getInitialState"
      ]
    >
  >({
    slice: editorsSlice,
  })
)

const colorizeIfNeeded = (
  debounce(
    colorize,
    200,
  )
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
    // reduxStore
    // .dispatch(
    //   addEditor(
    //     editor
    //   )
    // )

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
    // reduxStore
    // .dispatch(
    //   addEditor(
    //     editor
    //   )
    // )

    colorizeIfNeeded(
      editor
    )
  }
}

export const activate = (
  context: (
    vscode
    .ExtensionContext
  )
) => {
  // reduxStore
  // .dispatch(
  //   addExtensionContext(
  //     context
  //   )
  // )

  context
  .subscriptions
  .push(
    vscode
    .window
    .onDidChangeActiveColorTheme(
      onConfigChange
    )
  )

  context
  .subscriptions
  .push(
    vscode
    .window
    .onDidChangeActiveTextEditor(
      onActiveEditorChange
    )
  )

  context
  .subscriptions
  .push(
    vscode
    .workspace
    .onDidChangeConfiguration(
      onConfigChange
    )
  )

  context
  .subscriptions
  .push(
    vscode
    .workspace
    .onDidChangeTextDocument(
      onTextDocumentChange
    )
  )

  context
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
