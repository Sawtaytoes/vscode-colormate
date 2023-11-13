import type {
  Slice
} from '@reduxjs/toolkit'
import {
  BehaviorSubject,
  merge,
  scan,
  Subject,
  type Observable,
} from 'rxjs'

import { catchEpicError } from './reduxObservable/catchEpicError'

export type EpicAction<
  ActionCreators extends (
    Slice<
      unknown
    >["actions"]
  )
> = (
  ReturnType<
    ActionCreators[
      keyof ActionCreators
    ]
  >
)

export type MiddlewareEpic<
  Action$,
  State$
> = ({
  action$,
  state$,
}: {
  action$: Action$
  state$: State$
}) => (
  Observable<
    any
  >
)

export const createStateSlice = <
  EpicSlice extends (
    Slice
  ),
  Action extends (
    EpicAction<
      EpicSlice["actions"]
    >
  ) = (
    EpicAction<
      EpicSlice["actions"]
    >
  ),
  State extends (
    ReturnType<
      EpicSlice["reducer"]
    >
  ) = (
    ReturnType<
      EpicSlice["reducer"]
    >
  )
>({
  middlewareEpics,
  slice,
}: {
  middlewareEpics?: (
    Array<
      MiddlewareEpic<
        (
          Subject<
            Action
          >
        ),
        (
          BehaviorSubject<
            State
          >
        )
      >
    >
  )
  slice: (
    EpicSlice
  )
}) => {
  const action$ = (
    new Subject<
      Action
    >()
  )

  const reducer$ = (
    action$
    .pipe(
      scan((
        state,
        action,
      ) => (
        slice
        .reducer(
          state,
          action,
        )
      ),
      (
        slice
        .getInitialState()
      ))
    )
  )

  const state$ = (
    new BehaviorSubject(
      slice
      .getInitialState()
    )
  )

  const dispatch = (
    action: Action,
  ) => {
    action$
    .next(
      action
    )

    return action
  }

  const getState = () => (
    state$
    .value
  )

  const middlewareEpics$ = (
    (
      middlewareEpics
      || []
    )
    .map((
      middlewareEpic,
    ) => (
      middlewareEpic({
        action$,
        state$,
      })
      .pipe(
        catchEpicError(
          middlewareEpic
          .name
        )
      )
    ))
  )

  return {
    dispatch,
    getState,
    subscribe: () => {
      const actionStateSubscription = (
        merge(
          action$,
          state$,
          ...middlewareEpics$
        )
        .subscribe()
      )

      const reducerSubscription = (
        reducer$
        .subscribe(
          state$
        )
      )

      return () => {
        actionStateSubscription
        .unsubscribe()

        reducerSubscription
        .unsubscribe()

        action$
        .complete()

        state$
        .complete()
      }
    },
  }
}
