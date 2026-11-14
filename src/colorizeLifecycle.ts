// `colorize` awaits VS Code commands and the TextMate tokenizer before it
// touches any decorations. Unsubscribing the epic does not stop a promise
// that already started, so a call that is waiting when the extension
// deactivates would otherwise resume and paint decorations that nothing
// will ever remove. Each `colorize` call reads this signal when it starts and
// checks it again after it awaits.
let abortController = new AbortController()

export const getColorizeAbortSignal = () =>
  abortController.signal

export const startColorizing = () => {
  if (abortController.signal.aborted) {
    abortController = new AbortController()
  }
}

export const stopColorizing = () => {
  abortController.abort()
}
