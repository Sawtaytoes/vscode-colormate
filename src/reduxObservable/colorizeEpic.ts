import {
  Epic,
  ofType
} from 'redux-observable'
import {
  map,
  tap,
} from 'rxjs/operators'

import {
  colorize,
} from './actions'

export const colorizeEpic: (
  Epic<
    (
      ReturnType<
        typeof colorize
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
      colorize
      .type
    ),
    tap(() => {
      // TODO: Add a function to loop through editors and throw them out to token finders.
      // TODO: Maybe this should be named `tokenize` instead of `colorize`.
    }),
  )
)
