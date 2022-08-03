import {
  createSlice, PayloadAction,
} from '@reduxjs/toolkit'
import {
  TextEditor,
} from 'vscode'

type Editors = (
  Set<
    TextEditor
  >
)

type EditorsState = {
  value: Editors,
}

const initialState: (
  EditorsState
) = {
  value: new Set()
}

const editorsSlice = (
  createSlice({
    initialState,
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
        new Set(
          state
          .value
        )
        .add(
          action
          .payload
        )
      },
      removeEditor: (
        state,
        action: (
          PayloadAction<
            TextEditor
          >
        ),
      ) => {
        state
        .value
        .delete(
          action
          .payload
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

type ReduxEditorsState = {
  editors: Editors,
}

const editorsSelectors = {
  createGetEditors: () => (
    state: ReduxEditorsState,
  ) => (
    Array
    .from(
      state
      .editors
    )
  ),
  createHasEditor: (
    editor: TextEditor,
  ) => (
    state: ReduxEditorsState,
  ) => (
    state
    .editors
    .has(
      editor
    )
  ),
}

export const {
  createHasEditor,
} = (
  editorsSelectors
)
