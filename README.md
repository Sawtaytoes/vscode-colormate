# ColorMate for Visual Studio Code

![ColorMate logo](images/logo.png)

ColorMate assigns a consistent color to identifiers with the same name. The
result makes code easier to skim and provides an additional visual cue beyond
the text itself.

**[Install ColorMate and enable semantic highlighting →](docs/use-colormate.md)**

> **Note:** Your color theme must support semantic highlighting. The use guide
> explains how to enable it for every theme.

## Examples

### Electron

![Electron before ColorMate](images/theme-electron-before.png)
![Electron after ColorMate](images/theme-electron-after.png)

### Visual Studio Code Dark

![Dark theme before ColorMate](images/theme-dark-before.png)
![Dark theme after ColorMate](images/theme-dark-after.png)

### Visual Studio Code Light

![Light theme before ColorMate](images/theme-light-before.png)
![Light theme after ColorMate](images/theme-light-after.png)

## What it provides

- Consistent colors for identifiers that have the same name.
- Support for every language that exposes semantic tokens through Visual Studio Code.
- Additional TextMate token scopes for common languages.
- Separate lightness and saturation controls for light, dark, and high-contrast themes.
- Configurable semantic token types, TextMate scopes, exclusions, and ignored languages.

## Documentation

- [Install, configure, and troubleshoot ColorMate](docs/use-colormate.md)
- [Develop and publish the extension](INSTALLATION.md)
- [Performance notes and planned work](docs/performance.md)
- [Project history and attribution](docs/project-history.md)
- [Architecture decisions](docs/decisions/README.md)

## Development

```sh
pnpm install
pnpm test:headless
```

Use `pnpm start` for a watch build. See the [development and publishing guide](INSTALLATION.md)
for the complete workflow.

ColorMate is available under the [MIT License](LICENSE).
