# AGENTS.md

## CHANGELOG conventions

`CHANGELOG.md` follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/)
and the project uses [Semantic Versioning](https://semver.org/spec/v2.0.0.html).
When publishing a new version, log it here using exactly this style.

### Adding an entry

1. Add a new section at the top, directly under the file header, in reverse-chronological order:

   ```markdown
   ## [X.Y.Z] - YYYY-MM-DD
   ```

   - Version goes in square brackets `[X.Y.Z]` (it is a link reference — see step 3).
   - Date is ISO 8601 (`YYYY-MM-DD`).

2. Group the changes under the relevant headings. Only include headings that apply, and keep them in this order:

   - `### Added` — new features, settings, or default scopes.
   - `### Changed` — changes to existing behavior, dependency/toolchain upgrades, refactors. Breaking changes also go here (there is no separate "Breaking" heading).
   - `### Deprecated` — soon-to-be-removed features.
   - `### Removed` — removed features.
   - `### Fixed` — bug fixes.
   - `### Security` — vulnerability fixes.

   Bullets are plain prose with **no emojis**. Phrase them as nouns describing the change (e.g. "A new setting for…", "TextMate scope for…"), not "Adds…/Added…", since the heading already supplies the verb. Use backticks for setting names, scopes, and code identifiers.

3. Add a compare-link reference at the bottom of the file so the bracketed version resolves on GitHub:

   ```markdown
   [X.Y.Z]: https://github.com/Sawtaytoes/vscode-colormate/compare/v<PREVIOUS>...vX.Y.Z
   ```

   Keep these in the same reverse-chronological order as the entries above.

### Tagging

Every released version must have a matching git tag named `vX.Y.Z` on its release
commit, and the tag must be pushed (`git push origin vX.Y.Z`). The compare links
depend on these tags existing.
