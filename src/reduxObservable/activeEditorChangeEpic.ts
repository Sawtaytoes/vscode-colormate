import {
  Epic,
  ofType
} from 'redux-observable'
import {
  fromEventPattern,
} from 'rxjs'
import {
  concatMap,
  filter,
  map,
  tap,
} from 'rxjs/operators'
import {
  TextEditor,
  window,
} from 'vscode'

import {
  addEditor,
  addExtensionContext,
} from './actions'

export const activeEditorChangeEpic: (
  Epic<
    (
      ReturnType<
        typeof addExtensionContext
      >
    ),
    any
  >
) = (
  action$,
  state$,
  {
    dispatch,
  },
) => (
  action$
  .pipe(
    ofType(
      addExtensionContext
      .type
    ),
    concatMap(({
      payload: context,
    }) => (
      fromEventPattern<
        | TextEditor
        | undefined
      >((
        handler,
      ) => {
        context
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
    map(
      addEditor
    ),
    tap(
      dispatch
    ),
  )
)
