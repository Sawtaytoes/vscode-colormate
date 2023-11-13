import {
  Epic,
  ofType
} from 'redux-observable'
import {
  ignoreElements,
  tap,
} from 'rxjs/operators'

import {
  addEditor
} from './actions'

export const testEpic: (
  Epic
) = (
  action$,
) => (
  action$
  .pipe(
    ofType(
      addEditor
      .type
    ),
    tap((t) => {
      console.log(t)
    }),
    ignoreElements(),
  )
)
