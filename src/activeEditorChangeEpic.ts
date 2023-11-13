import {
  concatMap,
  filter,
  fromEventPattern,
  tap,
} from "rxjs"
import {
  TextEditor,
  window,
} from "vscode"

import { catchEpicError } from "./catchEpicError"
import { EpicAction$ } from "./createSliceState"
import {
  extensionContextsSlice,
} from "./extensionContextsState"
import { addEditor, editorsState } from "./editorsState"

export const activeEditorChangeEpic = ({
  action$,
}: {
  action$: (
    EpicAction$<
      typeof extensionContextsSlice
    >
  ),
}) => (
  action$
  .pipe(
    filter(
      extensionContextsSlice
      .actions
      .addExtensionContext
      .match
    ),
    concatMap(({
      payload: extensionContext,
    }) => (
      fromEventPattern<
        | TextEditor
        | undefined
      >((
        handler,
      ) => {
        extensionContext
        .subscriptions
        .push(
          window
          .onDidChangeActiveTextEditor(
            handler
          )
        )
      })
    )),
    filter(
      Boolean
    ),
    tap((
      editor,
    ) => {
      editorsState
      .dispatch(
        addEditor(
          editor
        )
      )
    }),
    catchEpicError(
      activeEditorChangeEpic
      .name
    )
  )
)
