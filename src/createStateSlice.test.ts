import {
  createEntityAdapter,
  createSlice,
  type PayloadAction,
} from '@reduxjs/toolkit'
import expect from "expect"

import {
  createStateSlice,
  type EpicAction,
} from "./createStateSlice"
import { tap } from 'rxjs'

type TestStateValue = {
  id: string
  value: string
}

const entityAdapter = (
  createEntityAdapter<
    TestStateValue
  >()
)

export const slice = (
  createSlice({
    initialState: (
      entityAdapter
      .getInitialState()
    ),
    name: 'testState',
    reducers: {
      addTestValue: (
        state,
        action: (
          PayloadAction<
            TestStateValue
          >
        ),
      ) => {
        entityAdapter
        .addOne(
          state,
          (
            action
            .payload
          ),
        )
      },
      removeTestValue: (
        state,
        action: (
          PayloadAction<
            string
          >
        ),
      ) => {
        entityAdapter
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

export type TestState = (
  ReturnType<
    typeof slice[
      "getInitialState"
    ]
  >
)


suite.only(
  "createState",
  () => {
    test(
      "Subscribes to the state.",
      () => {
        const {
          dispatch,
          getState,
          subscribe,
        } = (
          createStateSlice({
            slice,
          })
        )

        const unsubscribe = (
          subscribe()
        )

        dispatch(
          slice
          .actions
          .addTestValue({
            id: "1",
            value: "one",
          })
        )

        expect(
          getState()
        )
        .toStrictEqual({
          "entities": {
            "1": {
              "id": "1",
              "value": "one",
            },
          },
          "ids": [
            "1",
          ],
        })

        dispatch(
          slice
          .actions
          .addTestValue({
            id: "2",
            value: "two",
          })
        )

        expect(
          getState()
        )
        .toStrictEqual({
          "entities": {
            "1": {
              "id": "1",
              "value": "one",
            },
            "2": {
              "id": "2",
              "value": "two",
            },
          },
          "ids": [
            "1",
            "2",
          ],
        })

        dispatch(
          slice
          .actions
          .removeTestValue(
            "1"
          )
        )

        expect(
          getState()
        )
        .toStrictEqual({
          "entities": {
            "2": {
              "id": "2",
              "value": "two",
            },
          },
          "ids": [
            "2",
          ],
        })

        dispatch(
          slice
          .actions
          .removeTestValue(
            "2"
          )
        )

        expect(
          getState()
        )
        .toStrictEqual({
          "entities": {},
          "ids": [],
        })

        unsubscribe()
      },
    )

    test(
      "Unsubscribes from the state.",
      () => {
        const {
          dispatch,
          getState,
          subscribe,
        } = (
          createStateSlice({
            slice,
          })
        )

        const unsubscribe = (
          subscribe()
        )

        dispatch(
          slice
          .actions
          .addTestValue({
            id: "1",
            value: "one",
          })
        )

        expect(
          getState()
        )
        .toStrictEqual({
          "entities": {
            "1": {
              "id": "1",
              "value": "one",
            },
          },
          "ids": [
            "1",
          ],
        })

        unsubscribe()

        dispatch(
          slice
          .actions
          .addTestValue({
            id: "2",
            value: "two",
          })
        )

        expect(
          getState()
        )
        .toStrictEqual({
          "entities": {
            "1": {
              "id": "1",
              "value": "one",
            },
          },
          "ids": [
            "1",
          ],
        })
      },
    )

    test(
      "Can subscribe to action$.",
      () => {
        const {
          action$,
          dispatch,
          getState,
          subscribe,
        } = (
          createStateSlice({
            slice,
          })
        )

        const unsubscribe = (
          subscribe()
        )

        let dispatchedAction: (
          EpicAction<
            typeof slice["actions"]
          >
        ) = {
          payload: "1",
          type: "testState/removeTestValue",
        }

        const epicSubscription = (
          action$
          .pipe(
            tap((
              action,
            ) => {
              dispatchedAction = action
            })
          )
          .subscribe()
        )

        const payload = {
          id: "1",
          value: "one",
        }

        dispatch(
          slice
          .actions
          .addTestValue(
            payload
          )
        )

        unsubscribe()

        epicSubscription
        .unsubscribe()

        expect(
          dispatchedAction
        )
        .toStrictEqual({
          payload,
          type: "testState/addTestValue"
        })
      },
    )

    test(
      "Can subscribe to state$.",
      () => {
        const {
          dispatch,
          getState,
          state$,
          subscribe,
        } = (
          createStateSlice({
            slice,
          })
        )

        const unsubscribe = (
          subscribe()
        )

        let currentState: (
          ReturnType<
            typeof slice["reducer"]
          >
        ) = {
          "entities": {},
          "ids": [],
        }

        const epicSubscription = (
          state$
          .pipe(
            tap((
              state,
            ) => {
              currentState = state
            })
          )
          .subscribe()
        )

        dispatch(
          slice
          .actions
          .addTestValue({
            id: "1",
            value: "one",
          })
        )

        unsubscribe()

        epicSubscription
        .unsubscribe()

        expect(
          currentState
        )
        .toStrictEqual({
          "entities": {
            "1": {
              "id": "1",
              "value": "one",
            },
          },
          "ids": [
            "1",
          ],
        })
      },
    )
  },
)
