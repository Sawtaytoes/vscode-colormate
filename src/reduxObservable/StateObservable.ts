// Copied and modified from: https://github.com/redux-observable/redux-observable/blob/master/src/StateObservable.ts

import { Observable, Subject } from 'rxjs'

export class StateObservable<S> extends Observable<S> {
  value: S
  // eslint-disable-next-line @typescript-eslint/naming-convention
  private __notifier = new Subject<S>()

  constructor(input$: Observable<S>, initialState: S) {
    super(subscriber => {
      const subscription = this.__notifier.subscribe(subscriber)
      if (subscription && !subscription.closed) {
        subscriber.next(this.value)
      }
      return subscription
    })

    this.value = initialState
    input$.subscribe(value => {
      // We only want to update state$ if it has actually changed since
      // redux requires reducers use immutability patterns.
      // This is basically what distinctUntilChanged() does but it's so simple
      // we don't need to pull that code in
      if (value !== this.value) {
        this.value = value
        this.__notifier.next(value)
      }
    })
  }
}
