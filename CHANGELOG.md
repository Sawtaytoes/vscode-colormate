# CHANGELOG

## [4.0.2] - 2026-03-06

- Adds TextMate scope for `variable.other.readwrite.ts`. This allows coloring an import being aliased. Previously, only the aliased value was colored.

## [4.0.1] - 2026-03-06

- Adds missing Oniguruma WASM file when publishing.

## [4.0.0] - 2026-03-06

- Upgrades all packages to the latest.

## [3.3.6] - 2023-11-21

- 🐛 Attempts to fix Oniguruma memory loading error.

## [3.3.5] - 2023-11-21

- 🐛 Increases debounce time to reduce flashiness when scopes disappear and reappear.

## [3.3.4] - 2023-11-21

- ♻️ Refactors removal of text decorations to occur after recoloring.

## [3.3.3] - 2023-11-13

- Hack-fix for keywords being variable names that also happen to have TextMate scopes.

## [3.3.2] - 2023-11-13

- Improves TextMate registry.
- Adds TextMate grammars to Redux state.

## [3.3.1] - 2023-11-13

- Adds Redux for keeping track of state.

## [3.2.2] - 2022-08-02

- 🐛 Fixed a bug where TextMate scopes would sometimes stop working forever. The easiest way to reproduce was deleting a file or closing a file that wasn't yet saved.

## [3.2.1] - 2022-07-31

- 🐛 Added missing default for entity.name.function in JS and TS.

## [3.2.0] - 2022-07-31

- ✨ Added a new setting for default TextMate token scopes. Before, you were able to override these with the `textMateTokenScopes` setting, but if you wanted the defaults, it was possible to lose them completely. This new way makes them optional, but also able to be kept up-to-date by the user.

## [3.1.4] - 2022-07-31

- 🐛 Fixed an improper regex for root scopes with 2 roots (source.jsx)
- 🐛 Fixed edge-case bug in matching TextMate scopes with a single category name
- 🐛 Fixed incorrect defaults in package.json

## [3.1.3] - 2022-07-31

- 🔧 Added more search keywords.

## [3.1.2] - 2022-07-31

- 📝 Fixed README title.

## [3.1.1] - 2022-07-31

- 🔧 Updated to use the correct Git location.

## [3.1.0] - 2022-07-31

- 💄 Updated default lighting and saturation values to look better on all theme types.

## [3.0.0] - 2022-07-31

- 💥 Changed how TextMate tokens are processed. Previously, they were 1:1, but now they're processed within the TextMate scope hierarchy. This change means existing scopes could be far more generic than intended.
- ✨ Added a new feature to exclude TextMate scopes. Now that they're more generic, there's a need to exclude as well. Excluded scopes are also hierarchical and rely on specificity. If equal to or greater than the selected TextMate scopes, it will take precedence and exclude those scopes.

## [2.1.0] - 2022-07-30

- ✨ Semantic highlights now show when only TextMate tokens are available. Now you can even semantically highlight JSON!

## [2.0.0] - 2022-07-30

- 💥 Renamed `colormate.tokenKinds` setting to `colormate.semanticTokenTypes`.
- ✨ textMate tokens are now semantically highlighted when semantic tokens are unavailable. This is especially useful if you don't have any semantic tokens in your language of choice (JSX has none).
- 🔧 Added configuration for `colormate.textMateTokenScopes`. Now you can select textMate tokens to style as well as semantic tokens. This is especially useful if you don't have any semantic tokens in your language of choice (JSX has none).

## [1.3.2] - 2022-07-30

- 🔧 Updated the VSCode displayName to fit.

## [1.3.1] - 2022-07-30

- 🐛 Fixed a memory leak where invisible code windows weren't hidden. In doing this fix, only visible editors are semantically highlighted. A future change will need to be made to keep background editors highlighted.

## [1.3.0] - 2022-07-30


- ✨ Added `lighting` and `saturation` configuration settings for all color theme types.
- ✨ Changing settings now results in immediate visible changes.
- 🐛 Fixed an issue where leaving an editor view would remove semantic highlighting. This was most-apparent when using multiple columns or windows.
- 🎨 Major code styling and refactoring.

## [1.2.4] - 2022-07-30


- 🚑 Fixed a critical issue where local changes were incorrectly packaged.

## [1.2.3] - 2022-07-30


- 📝 Updated README with a callout on how to force-enable semantic highlighting.

## [1.2.2] - 2022-07-30


- 📝 Updated README with troubleshooting information.

## [1.2.1] - 2022-07-30


- 🩹 Fixed incorrect `CHANGELOG`.

## [1.2.0] - 2022-07-30


- ✨ Added more semantic token selectors for the default token configuration.

## [1.1.1] - 2022-07-30


- 🎉 First 100% working release with all the right logos!
