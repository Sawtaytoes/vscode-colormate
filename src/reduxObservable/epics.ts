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
import {
  colorizeEpic,
} from './colorizeEpic'
import {
  initializeEpic,
} from './initializeEpic'

export const epics = (
  [
    activeEditorChangeEpic,
    colorizeEpic,
    initializeEpic,
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
