import {
  createEntityAdapter,
  createSlice,
  type PayloadAction,
} from '@reduxjs/toolkit'
import {
  ExtensionContext,
} from 'vscode'

import { createSliceState } from './createSliceState'

const extensionContextsAdapter = (
  createEntityAdapter({
    selectId: (
      extensionContext: ExtensionContext,
    ) => (
      extensionContext
      .extensionUri
      .toString()
    )
  })
)

export const extensionContextsSlice = (
  createSlice({
    initialState: (
      extensionContextsAdapter
      .getInitialState()
    ),
    name: 'extentionContexts',
    reducers: {
      addExtensionContext: (
        state,
        action: (
          PayloadAction<
            ExtensionContext
          >
        ),
      ) => {
        extensionContextsAdapter
        .addOne(
          state,
          (
            action
            .payload
          ),
        )
      },
      removeExtensionContext: (
        state,
        action: (
          PayloadAction<
            string
          >
        ),
      ) => {
        extensionContextsAdapter
        .removeOne(
          state,
          (
            action
            .payload
          )
        )
      },
    },
  })
)

export type ExtensionContextsState = (
  ReturnType<
    typeof extensionContextsSlice[
      "reducer"
    ]
  >
)

export const extensionContextsState = (
  createSliceState({
    slice: extensionContextsSlice,
  })
)

export const {
  addExtensionContext,
  removeExtensionContext,
} = (
  extensionContextsSlice
  .actions
)

export const extensionContextsReducer = (
  extensionContextsSlice
  .reducer
)

export const extensionContextsSelectors = (
  extensionContextsAdapter
  .getSelectors<
    ExtensionContextsState
  >((
    state,
  ) => (
    state
  ))
)
