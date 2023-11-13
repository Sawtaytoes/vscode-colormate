// Copied and modified from: https://github.com/redux-observable/redux-observable/blob/master/src/epic.ts

import { Action } from "redux"
import { Observable } from "rxjs"
import { StateObservable } from "./StateObservable"

export declare interface Epic<
  Input extends Action = any,
  Output extends Input = Input,
  State = any,
  Dependencies = any
> {
  (
    action$: Observable<Input>,
    state$: StateObservable<State>,
    dependencies: Dependencies
  ): Observable<Output>
}
