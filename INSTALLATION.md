# Installation

## Dev steps

### Install assets

```sh
npm install --global pnpm@12.9.1
pnpm install --frozen-lockfile
```

### Local development

```sh
pnpm start
```

If you run into any caching issues:

```sh
pnpm clean
```

### Publish package

Make sure tests and other checks are passing:

```sh
pnpm test
```

Then run this command to do a cleanup of the build directory and a new compilation before triggering the publish step.

Before doing so, make sure to change the version in `package.json`:

```sh
pnpm publish:package
```

If publishing doesn't work, first login with a new PAT (Personal Access Token):

```sh
pnpm publish:updateLogin
```

## Repo layout

The initial startup file is located in `extension.ts`. Everything else is loaded from there.

The extension bundles its JavaScript with esbuild. VSCE uses `--no-dependencies`
with pnpm, copying the Oniguruma WASM asset into `dist/onig.wasm` alongside the bundle.
