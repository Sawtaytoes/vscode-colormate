import {
  AnyAction,
  Dispatch,
} from "redux"
import {
  configureStore,
} from "@reduxjs/toolkit"
import {
  createEpicMiddleware,
} from "./createEpicMiddleware"

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

  return reduxStore
}
