# AGENTS.md

## Prefer MCP, APIs, and CLIs over computer use

For service access and routine reads or writes, prefer an available MCP tool, a
supported HTTP API, or the service's CLI over browser or desktop interaction.
Check the project's runbooks, existing tools, and documented endpoints first.
The presence of browser tools is not a reason to choose computer use. A missing
MCP tool or browser login does not prove that an API or CLI is unavailable.

Use computer interaction when the task needs a visual check, a browser test, a
UI-only operation, or authentication that the available programmatic routes
cannot perform. Keep that interaction narrow, then return to MCP/API/CLI calls
for the rest. If no documented route exists, check the app's existing HTTP
requests before assuming repeated clicks are necessary; do not bypass access
controls. State the specific limitation when computer use is required.

This preference does not grant new access, widen credentials or permissions,
replace a more specific service route, or remove required visual verification.

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

## Independent adversarial review

Before integrating any change in this repository, including an authorized direct push
to the default branch, obtain review from at least one other agent that did not author
the changes. This includes code, tests, dependencies,
configuration, CI, and documentation; scale review depth to the risk. For risky designs,
seek an early challenge as well as review of the final diff. Give the reviewer the
requirements, applicable instructions, base/head SHAs, full diff, and test evidence.
Ask it to find correctness defects, regressions, edge cases, security problems, and
missing verification; a no-findings result is valid. Reviewers inspect and report;
they do not edit, merge, or deploy.

Resolve findings with evidence, fix confirmed defects, and re-run affected checks.
Unresolved material concerns block integration. Re-review substantive changes after fixes
or rebases so the final head is covered. Record reviewer identity, reviewed SHAs,
findings (or none), resolutions, and verification on the PR; for a direct-push workflow,
use a tracked review note instead. Self-review and passing
CI do not replace independent review. If the reviewer is unavailable, retry or use
another authorized agent; report the gate instead of silently waiving it. Only an
explicit owner instruction can waive the review, with its scope recorded in the same
review evidence.
Existing required checks, merge rules, and deployment verification still apply.
