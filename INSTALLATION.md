# Installation

## Dev steps

### Install assets

```sh
yarn install
```

### Local development

```sh
yarn start
```

If you run into any caching issues:

```sh
yarn clean
```

### Publish package

Make sure tests and other checks are passing:

```sh
yarn test
```

Then run this command to do a cleanup of the build directory and a new compilation before triggering the publish step.

Before doing so, make sure to change the version in `package.json`:

```sh
yarn publish:package
```

If publishing doesn't work, first login with a new PAT (Personal Access Token):

```sh
yarn publish:updateLogin
```

## Repo layout

The initial startup file is located in `extension.ts`. Everything else is loaded from there.
