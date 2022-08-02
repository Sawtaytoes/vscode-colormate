import {
  AnyAction,
} from '@reduxjs/toolkit'
import {
  pipe,
} from 'rxjs'
import {
  filter,
} from 'rxjs/operators'

const ofCategory = (
  ...requiredCategories: string[]
) => (
  pipe(
    filter<
      AnyAction
    >(
      Boolean
    ),
    filter((
      action,
    ) => (
      action
      .category
    )),
    filter(({
      category,
    }) => (
      requiredCategories
      .includes(
        category
      )
    )),
  )
)

export default ofCategory
