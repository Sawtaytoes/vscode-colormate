import {
  catchError,
} from 'rxjs/operators'
import {
  of,
} from 'rxjs'

export const catchEpicError = (
  epicName: string,
) => (
  catchError((
    error,
  ) => {
    console
    .error(
      (
        epicName
      ),
      (
        '\n'
      ),
      (
        (
          (
            error
            .constructor
            .name
          )
          === 'ErrorEvent'
        )
        ? (
          error
          .error
          .stack
        )
        : error
      ),
    )

    return (
      of({
        payload: {
          epicName,
          error,
        },
        type: 'caughtError',
      })
    )
  })
)
