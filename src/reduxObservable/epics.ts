import {
  Epic,
} from 'redux-observable'
import { Observable } from 'rxjs'
import {
  ignoreElements,
} from 'rxjs/operators'

import {
  activeEditorChangeEpic,
} from './activeEditorChangeEpic'
import {
  testEpic,
} from './testEpic'
import {
  catchEpicError,
} from './catchEpicError'

export const epics = (
  [
    activeEditorChangeEpic,
    testEpic,
  ]
  .map((
    epic,
  ) => (
    ...args: (
      Parameters<
        Epic
      >
    )
  ) => (
    epic(
      ...args
    )
    .pipe(
      ignoreElements(),
      catchEpicError(
        epic
        .name
      ),
    ) as (
      Observable<
        never
      >
    )
  ))
)
