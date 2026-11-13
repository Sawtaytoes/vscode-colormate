import type { Subscription } from "rxjs"
import type { Disposable } from "vscode"

/**
 * Wraps an RxJS subscription so VS Code can dispose it. Push the result
 * into `extensionContext.subscriptions`, and VS Code unsubscribes it when
 * the extension deactivates.
 */
export const subscriptionToDisposable = (
  subscription: Subscription,
): Disposable => ({
  dispose: () => {
    subscription.unsubscribe()
  },
})
