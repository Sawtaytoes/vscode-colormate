import {
  AnyAction,
  Dispatch,
} from "redux"
import {
  configureStore,
} from "@reduxjs/toolkit"
import {
  combineEpics,
  createEpicMiddleware
} from "redux-observable"

import {
  epics,
} from "./epics"

export const createReduxStore = () => {
  let reduxStoreDispatch: (
    Dispatch<
      AnyAction
    >
  ) = (
    action,
  ) => (
    action
  )

  const reduxObservableDispatch = (
    action: AnyAction,
  ) => (
    reduxStoreDispatch(
      action
    )
  )

  const epicMiddleware = (
    createEpicMiddleware({
      dependencies: {
        dispatch: (
          reduxObservableDispatch
        ),
      },
    })
  )

  const reduxStore = (
    configureStore({
      middleware: [
        epicMiddleware,
      ],
      reducer: (
        state,
      ) => (
        state
      ),
      preloadedState: {},
    })
  )

  reduxStoreDispatch = (
    reduxStore
    .dispatch
  )

  epicMiddleware
  .run(
    combineEpics(
      ...epics
    )
  )

  return reduxStore
}
