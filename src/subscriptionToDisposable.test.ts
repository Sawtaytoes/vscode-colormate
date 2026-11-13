import { expect } from "expect"
import { Subject } from "rxjs"

import { subscriptionToDisposable } from "./subscriptionToDisposable.js"

suite("subscriptionToDisposable", () => {
  test("Unsubscribes when disposed", () => {
    const value$ = new Subject<number>()
    const receivedValues: number[] = []

    const subscription = value$.subscribe((value) => {
      receivedValues.push(value)
    })

    const disposable =
      subscriptionToDisposable(subscription)

    value$.next(1)

    disposable.dispose()

    value$.next(2)

    expect(subscription.closed).toBe(true)
    expect(receivedValues).toEqual([1])
  })
})
