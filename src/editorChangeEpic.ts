import {
  concatMap,
  debounceTime,
  exhaustMap,
  filter,
  fromEventPattern,
  groupBy,
  merge,
  switchMap,
  tap,
} from "rxjs"
import {
  TextEditor,
  window,
  workspace,
} from "vscode"

import { catchEpicError } from "./catchEpicError"
import { extensionContextsSlice, extensionContextsState } from "./extensionContextsState"
import { colorize } from "./colorize"

export const editorChangeEpic = () => (
  extensionContextsState
  .action$
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
      merge(
        (
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
              .onDidChangeActiveTextEditor((
                textEditor,
              ) => {
                if (
                  textEditor
                ) {
                  handler(
                    textEditor
                  )
                }
              })
            )
          })
        ),
        (
          fromEventPattern<
            | TextEditor
            | undefined
          >((
            handler,
          ) => {
            extensionContext
            .subscriptions
            .push(
              workspace
              .onDidChangeTextDocument((
                textDocumentChangeEvent,
              ) => {
                const editor = (
                  window
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
                      textDocumentChangeEvent
                      .document
                    )
                  )
                ) {
                  handler(
                    editor
                  )
                }
              })
            )
          })
        ),
      )
    )),
    filter(
      Boolean
    ),
    groupBy((
      textEditor,
    ) => (
      textEditor
      .document
      .uri
      .toString()
    )),
    concatMap((
      group$,
    ) => (
      group$
      .pipe(
        debounceTime(
          200
        ),
        concatMap((
          textEditor,
        ) => (
          colorize(
            textEditor
          )
        )),
      )
    )),
    catchEpicError(
      editorChangeEpic
      .name
    )
  )
)
