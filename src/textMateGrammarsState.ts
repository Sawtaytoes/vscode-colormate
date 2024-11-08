import {
  createEntityAdapter,
  createSlice,
  type PayloadAction,
} from '@reduxjs/toolkit'
import { IRawGrammar } from 'vscode-textmate'

import { createSliceState } from './createSliceState'

type GrammarDataEntity = {
  id: string,
  parsedGrammarData: IRawGrammar,
}

const textMateGrammarsAdapter = (
  createEntityAdapter<
    GrammarDataEntity
  >()
)

export const textMateGrammarsSlice = (
  createSlice({
    initialState: (
      textMateGrammarsAdapter
      .getInitialState()
    ),
    name: 'textMateGrammars',
    reducers: {
      addTextMateGrammar: (
        state,
        action: (
          PayloadAction<
            GrammarDataEntity
          >
        ),
      ) => {
        textMateGrammarsAdapter
        .addOne(
          state,
          (
            action
            .payload
          ),
        )
      },
      removeTextMateGrammar: (
        state,
        action: (
          PayloadAction<
            string
          >
        ),
      ) => {
        textMateGrammarsAdapter
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

export type TextMateGrammarsState = (
  ReturnType<
    typeof textMateGrammarsSlice[
      "reducer"
    ]
  >
)

export const textMateGrammarsState = (
  createSliceState({
    slice: textMateGrammarsSlice,
  })
)

export const {
  addTextMateGrammar,
  removeTextMateGrammar,
} = (
  textMateGrammarsSlice
  .actions
)

export const textMateGrammarsReducer = (
  textMateGrammarsSlice
  .reducer
)

export const textMateGrammarsSelectors = (
  textMateGrammarsAdapter
  .getSelectors<
    TextMateGrammarsState
  >((
    state,
  ) => (
    state
  ))
)
