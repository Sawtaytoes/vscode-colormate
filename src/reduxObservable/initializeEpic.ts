import {
  Epic,
  ofType
} from 'redux-observable'
import {
  map,
  tap,
} from 'rxjs/operators'

import {
  addExtensionContext,
  colorize,
} from './actions'

export const initializeEpic: (
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
    map(() => (
      colorize()
    )),
    tap(
      dispatch
    ),
  )
)
