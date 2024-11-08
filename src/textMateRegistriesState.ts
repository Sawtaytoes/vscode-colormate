import {
  createEntityAdapter,
  createSlice,
  type PayloadAction,
} from '@reduxjs/toolkit'
import { Registry } from 'vscode-textmate'

import { createSliceState } from './createSliceState'

type RegistryDataEntity = {
  id: string,
  registry: Registry,
}

const textMateRegistriesAdapter = (
  createEntityAdapter<
    RegistryDataEntity
  >()
)

export const textMateRegistriesSlice = (
  createSlice({
    initialState: (
      textMateRegistriesAdapter
      .getInitialState()
    ),
    name: 'textMateRegistries',
    reducers: {
      addTextMateRegistry: (
        state,
        action: (
          PayloadAction<
            RegistryDataEntity
          >
        ),
      ) => {
        textMateRegistriesAdapter
        .addOne(
          state,
          (
            action
            .payload
          ),
        )
      },
      removeTextMateRegistry: (
        state,
        action: (
          PayloadAction<
            string
          >
        ),
      ) => {
        textMateRegistriesAdapter
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

export type TextMateRegistriesState = (
  ReturnType<
    typeof textMateRegistriesSlice[
      "reducer"
    ]
  >
)

export const textMateRegistriesState = (
  createSliceState({
    slice: textMateRegistriesSlice,
  })
)

export const {
  addTextMateRegistry,
  removeTextMateRegistry,
} = (
  textMateRegistriesSlice
  .actions
)

export const textMateRegistriesReducer = (
  textMateRegistriesSlice
  .reducer
)

export const textMateRegistriesSelectors = (
  textMateRegistriesAdapter
  .getSelectors<
    TextMateRegistriesState
  >((
    state,
  ) => (
    state
  ))
)
