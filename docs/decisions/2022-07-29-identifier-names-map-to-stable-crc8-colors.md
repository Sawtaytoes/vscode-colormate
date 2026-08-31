# Identifier names map to stable CRC8 colors

- **Status:** Accepted
- **Date:** 2022-07-29
- **Type:** Architecture
- **Supersedes:** None
- **Superseded by:** None

## Decision

ColorMate hashes an identifier name with CRC8 and maps the result into a color.
Every occurrence of the same name therefore receives the same color under the
same theme settings.

Theme settings control saturation and lightness. The name hash selects the hue.
The extension does not assign colors by declaration order or document position.

## Context

The product uses color as a stable cue that helps a reader recognize repeated
identifiers without reading every character. A position-based palette would
change when code moved or when declarations were added.

## Why

The mapping is deterministic, inexpensive, and independent of the active file.
It preserves the same visual cue across occurrences and editor sessions.

## Evidence

The initial implementation at commit `b34b0bb` includes the CRC8 identifier
hash. The original README credits the same approach in Colorcoder for Sublime
Text. Tests in `src/crc8Hash.test.ts` preserve the expected mapping behavior.
