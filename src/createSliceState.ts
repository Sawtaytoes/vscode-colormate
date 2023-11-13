import type {
  Slice
} from '@reduxjs/toolkit'
import {
  BehaviorSubject,
  merge,
  scan,
  Subject,
} from 'rxjs'

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

export type EpicAction$<
  EpicSlice extends (
    Slice
  )
> = (
  Subject<
    EpicAction<
      EpicSlice["actions"]
    >
  >
)

export type EpicState$<
  State
> = (
  BehaviorSubject<
    State
  >
)


export const createSliceState = <
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
  slice,
}: {
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
    new BehaviorSubject<
      State
    >(
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

  const actionStateSubscription = (
    merge(
      action$,
      state$,
    )
    .subscribe()
  )

  const reducerSubscription = (
    reducer$
    .subscribe(
      state$
    )
  )

  const unsubscribe = () => {
    actionStateSubscription
    .unsubscribe()

    reducerSubscription
    .unsubscribe()

    action$
    .complete()

    state$
    .complete()
  }

  return {
    action$,
    dispatch,
    getState,
    state$,
    unsubscribe,
  }
}
