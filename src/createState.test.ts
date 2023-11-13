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
      "Middleware subscribes to new actions.",
      () => {
        let dispatchedAction: (
          EpicAction<
            typeof slice["actions"]
          >
        )

        const {
          dispatch,
          getState,
          subscribe,
        } = (
          createStateSlice({
            middlewareEpics: [
              ({
                action$
              }) => (
                action$
                .pipe(
                  tap((
                    action,
                  ) => {
                    dispatchedAction = action
                  })
                )
              )
            ],
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
  },
)
