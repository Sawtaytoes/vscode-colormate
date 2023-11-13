import {
  createEntityAdapter,
  createSlice,
  type PayloadAction,
} from '@reduxjs/toolkit'
import {
  TextEditor,
} from 'vscode'

import { createSliceState } from './createSliceState'

const editorsAdapter = (
  createEntityAdapter<
    TextEditor
  >({
    selectId: (
      textEditor,
    ) => (
      textEditor
      .document
      .uri
      .toString()
    )
  })
)

export const editorsSlice = (
  createSlice({
    initialState: (
      editorsAdapter
      .getInitialState()
    ),
    name: 'editors',
    reducers: {
      addEditor: (
        state,
        action: (
          PayloadAction<
            TextEditor
          >
        ),
      ) => {
        editorsAdapter
        .addOne(
          state,
          (
            action
            .payload
          ),
        )
      },
      removeEditor: (
        state,
        action: (
          PayloadAction<
            string
          >
        ),
      ) => {
        editorsAdapter
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

export type EditorsState = (
  ReturnType<
    typeof editorsSlice[
      "reducer"
    ]
  >
)

export const editorsState = (
  createSliceState({
    slice: editorsSlice,
  })
)

export const {
  addEditor,
  removeEditor,
} = (
  editorsSlice
  .actions
)

export const editorsReducer = (
  editorsSlice
  .reducer
)

export const editorsSelectors = (
  editorsAdapter
  .getSelectors<
    EditorsState
  >((
    state,
  ) => (
    state
  ))
)
