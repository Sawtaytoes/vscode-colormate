import {
  catchError,
} from "rxjs/operators"
import {
  EMPTY,
} from "rxjs"

import {
  outputChannel,
} from "./outputChannel"

export const catchEpicError = (
  epicName: string,
) => (
  catchError((
    error,
  ) => {
    outputChannel
    .error(
      (
        epicName
      ),
      (
        "\n"
      ),
      (
        (
          (
            error
            .constructor
            .name
          )
          === "ErrorEvent"
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
      EMPTY
    )
  })
)
