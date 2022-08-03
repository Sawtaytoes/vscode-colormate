import {
  createEntityAdapter,
  createSlice,
} from '@reduxjs/toolkit'
import {
  TextEditor,
} from 'vscode'

const editorsAdapter = (
  createEntityAdapter<
    boolean
  >()
)

const editorsSlice = (
  createSlice({
    initialState: (
      editorsAdapter
      .getInitialState()
    ),
    name: 'editors',
    reducers: {
      addEditor: (
        state,
        action,
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
        action,
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
  .getSelectors((
    state: any,
  ) => (
    state
    .editors
  ))
)
