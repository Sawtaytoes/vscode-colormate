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
  tap,
} from 'rxjs/operators'
import {
  window,
} from 'vscode'

import {
  addExtensionContext,
} from './actions'

export const activeEditorChangeEpic: (
  Epic
) = (
  action$,
) => (
  action$
  .pipe(
    ofType(
      addExtensionContext
    ),
    concatMap(({
      payload: context,
    }) => (
      fromEventPattern((
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
    tap(() => console.log('hi')),
    tap(console.log),
  )
)
