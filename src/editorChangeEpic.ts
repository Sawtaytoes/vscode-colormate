import {
  concatAll,
  concatMap,
  debounceTime,
  filter,
  from,
  fromEventPattern,
  groupBy,
  map,
  merge,
  mergeMap,
  tap,
} from "rxjs"
import {
  TextEditor,
  window,
  workspace,
} from "vscode"

import { catchEpicError } from "./catchEpicError"
import { colorize } from "./colorize"
import { extensionContextsSlice, extensionContextsState } from "./extensionContextsState"

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
        from(
          window
          .visibleTextEditors
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
              window
              .onDidChangeActiveTextEditor(
                handler
              )
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
              .onDidChangeTextDocument(
                handler
              )
            )
          })
          .pipe(
            map((
              textDocumentChangeEvent,
            ) => (
              textDocumentChangeEvent
              ?.document
              .uri
              .toString()
            )),
            concatMap((
              textDocumentUri,
            ) => (
              from(
                window
                .visibleTextEditors
              )
              .pipe(
                filter((
                  textEditor
                ) => (
                  (
                    textEditor
                    ?.document
                    .uri
                    .toString()
                  )
                  === textDocumentUri
                ))
              )
            )),
          )
        ),
        (
          (
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
                    .onDidChangeActiveColorTheme(
                      handler
                    )
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
                    .onDidChangeConfiguration(
                      handler
                    )
                  )
                })
              ),
            )
          )
          .pipe(
            map(() => (
              window
              .visibleTextEditors
            )),
            concatAll(),
          )
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
    )),
    mergeMap((
      group$,
    ) => (
      group$
      .pipe(
        debounceTime(
          100
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
