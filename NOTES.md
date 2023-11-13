- Track `document`s.
- Listen for changes to the document's language.
- Listen for when a document has closed (hopefully this is separate from the `editor`).
- Refactor `colorize`.
  - Run TextMate and Semantic Tokens in parallel.
  - Cache TextMate registries. Remove when those documents are gone.

- When colorizing, only one should occur at a time. Need to setup a queueing system with epics to colorize. Right now, debounces are per editor. That's good, but we can't have multiple colorizes happening at once because they use too much memory in aggregate.

- Coloring everything with the same name breaks TypeScript imports because `from` is a valid variable name, but also a keyword. Excluding that from TextMate scopes doesn't help.
