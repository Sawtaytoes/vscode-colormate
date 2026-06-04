# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [4.4.0] - 2026-06-04

### Fixed

- Colorization no longer permanently dies after a single error. A failed `colorize` (e.g. a rejected semantic-tokens request under heavy load or across multiple windows) is now logged and skipped per-editor instead of completing the whole epic and killing all coloring until reload.

### Changed

- Memoizes the TextMate `Registry` so Oniguruma's `loadWASM` only loads once per extension host and grammars stay cached, instead of rebuilding the registry (and reloading WASM) on every debounced `colorize` call.

## [4.3.0] - 2026-06-04

### Added

- Default TextMate scopes for dotenv (`variable.key.dotenv`) and shell (`constant.other.option.shell`, `variable.other.assignment.shell`, `variable.other.normal.shell`), so `.env` and shell files are semantically colored out of the box.
- Default excluded TextMate scopes (`punctuation.definition.evaluation.parens`, `punctuation.definition.variable.shell`, `punctuation.section.bracket.curly.variable`) to avoid coloring shell punctuation. Both the new defaults and exclusions respect the `hasDefaultTextMateTokenScopes` setting.

## [4.2.0] - 2026-06-04

### Changed

- Upgrades the toolchain to TypeScript 6.0 and `@types/node` 24. Adds an explicit `types` array to `tsconfig.json` since TypeScript 6.0 no longer auto-includes `@types/node`.

## [4.1.0] - 2026-06-04

### Added

- A dedicated "ColorMate" output channel so epic errors and grammar-loading failures are isolated and easy to capture (View → Output → ColorMate), instead of being buried in the shared extension-host console.

### Changed

- Upgrades Yarn to 4.16.0 and bumps dev/runtime dependencies; raises the minimum VSCode to 1.120.

## [4.0.2] - 2026-03-06

### Added

- TextMate scope for `variable.other.readwrite.ts`. This allows coloring an import being aliased. Previously, only the aliased value was colored.

## [4.0.1] - 2026-03-06

### Fixed

- Adds the missing Oniguruma WASM file when publishing.

## [4.0.0] - 2026-03-06

### Changed

- Upgrades all packages to the latest.

## [3.3.6] - 2023-11-21

### Fixed

- Attempts to fix Oniguruma memory loading error.

## [3.3.5] - 2023-11-21

### Fixed

- Increases debounce time to reduce flashiness when scopes disappear and reappear.

## [3.3.4] - 2023-11-21

### Changed

- Refactors removal of text decorations to occur after recoloring.

## [3.3.3] - 2023-11-13

### Fixed

- Hack-fix for keywords being variable names that also happen to have TextMate scopes.

## [3.3.2] - 2023-11-13

### Added

- TextMate grammars to Redux state.

### Changed

- Improves TextMate registry.

## [3.3.1] - 2023-11-13

### Added

- Redux for keeping track of state.

## [3.2.2] - 2022-08-02

### Fixed

- A bug where TextMate scopes would sometimes stop working forever. The easiest way to reproduce was deleting a file or closing a file that wasn't yet saved.

## [3.2.1] - 2022-07-31

### Fixed

- Missing default for `entity.name.function` in JS and TS.

## [3.2.0] - 2022-07-31

### Added

- A new setting for default TextMate token scopes. Before, you were able to override these with the `textMateTokenScopes` setting, but if you wanted the defaults, it was possible to lose them completely. This new way makes them optional, but also able to be kept up-to-date by the user.

## [3.1.4] - 2022-07-31

### Fixed

- An improper regex for root scopes with 2 roots (`source.jsx`).
- An edge-case bug in matching TextMate scopes with a single category name.
- Incorrect defaults in `package.json`.

## [3.1.3] - 2022-07-31

### Added

- More search keywords.

## [3.1.2] - 2022-07-31

### Fixed

- README title.

## [3.1.1] - 2022-07-31

### Changed

- Updated to use the correct Git location.

## [3.1.0] - 2022-07-31

### Changed

- Updated default lighting and saturation values to look better on all theme types.

## [3.0.0] - 2022-07-31

### Added

- A new feature to exclude TextMate scopes. Now that they're more generic, there's a need to exclude as well. Excluded scopes are also hierarchical and rely on specificity. If equal to or greater than the selected TextMate scopes, it will take precedence and exclude those scopes.

### Changed

- Changed how TextMate tokens are processed. Previously, they were 1:1, but now they're processed within the TextMate scope hierarchy. This change means existing scopes could be far more generic than intended.

## [2.1.0] - 2022-07-30

### Added

- Semantic highlights now show when only TextMate tokens are available. Now you can even semantically highlight JSON!

## [2.0.0] - 2022-07-30

### Added

- TextMate tokens are now semantically highlighted when semantic tokens are unavailable. This is especially useful if you don't have any semantic tokens in your language of choice (JSX has none).
- Configuration for `colormate.textMateTokenScopes`. Now you can select TextMate tokens to style as well as semantic tokens. This is especially useful if you don't have any semantic tokens in your language of choice (JSX has none).

### Changed

- Renamed `colormate.tokenKinds` setting to `colormate.semanticTokenTypes`.

## [1.3.2] - 2022-07-30

### Changed

- Updated the VSCode displayName to fit.

## [1.3.1] - 2022-07-30

### Fixed

- A memory leak where invisible code windows weren't hidden. In doing this fix, only visible editors are semantically highlighted. A future change will need to be made to keep background editors highlighted.

## [1.3.0] - 2022-07-30

### Added

- `lighting` and `saturation` configuration settings for all color theme types.

### Changed

- Changing settings now results in immediate visible changes.
- Major code styling and refactoring.

### Fixed

- An issue where leaving an editor view would remove semantic highlighting. This was most-apparent when using multiple columns or windows.

## [1.2.4] - 2022-07-30

### Fixed

- A critical issue where local changes were incorrectly packaged.

## [1.2.3] - 2022-07-30

### Changed

- Updated README with a callout on how to force-enable semantic highlighting.

## [1.2.2] - 2022-07-30

### Changed

- Updated README with troubleshooting information.

## [1.2.1] - 2022-07-30

### Fixed

- Incorrect `CHANGELOG`.

## [1.2.0] - 2022-07-30

### Added

- More semantic token selectors for the default token configuration.

## [1.1.1] - 2022-07-30

### Added

- First 100% working release with all the right logos!

[4.4.0]: https://github.com/Sawtaytoes/vscode-colormate/compare/v4.3.0...v4.4.0
[4.3.0]: https://github.com/Sawtaytoes/vscode-colormate/compare/v4.2.0...v4.3.0
[4.2.0]: https://github.com/Sawtaytoes/vscode-colormate/compare/v4.1.0...v4.2.0
[4.1.0]: https://github.com/Sawtaytoes/vscode-colormate/compare/v4.0.2...v4.1.0
[4.0.2]: https://github.com/Sawtaytoes/vscode-colormate/compare/v4.0.1...v4.0.2
[4.0.1]: https://github.com/Sawtaytoes/vscode-colormate/compare/v4.0.0...v4.0.1
[4.0.0]: https://github.com/Sawtaytoes/vscode-colormate/compare/v3.3.6...v4.0.0
[3.3.6]: https://github.com/Sawtaytoes/vscode-colormate/compare/v3.3.5...v3.3.6
[3.3.5]: https://github.com/Sawtaytoes/vscode-colormate/compare/v3.3.4...v3.3.5
[3.3.4]: https://github.com/Sawtaytoes/vscode-colormate/compare/v3.3.3...v3.3.4
[3.3.3]: https://github.com/Sawtaytoes/vscode-colormate/compare/v3.3.2...v3.3.3
[3.3.2]: https://github.com/Sawtaytoes/vscode-colormate/compare/v3.3.1...v3.3.2
[3.3.1]: https://github.com/Sawtaytoes/vscode-colormate/compare/v3.2.2...v3.3.1
[3.2.2]: https://github.com/Sawtaytoes/vscode-colormate/compare/v3.2.1...v3.2.2
[3.2.1]: https://github.com/Sawtaytoes/vscode-colormate/compare/v3.2.0...v3.2.1
[3.2.0]: https://github.com/Sawtaytoes/vscode-colormate/compare/v3.1.4...v3.2.0
[3.1.4]: https://github.com/Sawtaytoes/vscode-colormate/compare/v3.1.3...v3.1.4
[3.1.3]: https://github.com/Sawtaytoes/vscode-colormate/compare/v3.1.2...v3.1.3
[3.1.2]: https://github.com/Sawtaytoes/vscode-colormate/compare/v3.1.1...v3.1.2
[3.1.1]: https://github.com/Sawtaytoes/vscode-colormate/compare/v3.1.0...v3.1.1
[3.1.0]: https://github.com/Sawtaytoes/vscode-colormate/compare/v3.0.0...v3.1.0
[3.0.0]: https://github.com/Sawtaytoes/vscode-colormate/compare/v2.1.0...v3.0.0
[2.1.0]: https://github.com/Sawtaytoes/vscode-colormate/compare/v2.0.0...v2.1.0
[2.0.0]: https://github.com/Sawtaytoes/vscode-colormate/compare/v1.3.2...v2.0.0
[1.3.2]: https://github.com/Sawtaytoes/vscode-colormate/compare/v1.3.1...v1.3.2
[1.3.1]: https://github.com/Sawtaytoes/vscode-colormate/compare/v1.3.0...v1.3.1
[1.3.0]: https://github.com/Sawtaytoes/vscode-colormate/compare/v1.2.4...v1.3.0
[1.2.4]: https://github.com/Sawtaytoes/vscode-colormate/compare/v1.2.3...v1.2.4
[1.2.3]: https://github.com/Sawtaytoes/vscode-colormate/compare/v1.2.2...v1.2.3
[1.2.2]: https://github.com/Sawtaytoes/vscode-colormate/compare/v1.2.1...v1.2.2
[1.2.1]: https://github.com/Sawtaytoes/vscode-colormate/compare/v1.2.0...v1.2.1
[1.2.0]: https://github.com/Sawtaytoes/vscode-colormate/compare/v1.1.1...v1.2.0
[1.1.1]: https://github.com/Sawtaytoes/vscode-colormate/compare/v1.1.0...v1.1.1
