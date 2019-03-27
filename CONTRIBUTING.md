## Getting Started
Fork the repo.
```bash
# Use your clone url
git clone https://github.com/testdeck/testdeck.git
cd testdeck
git submodule update --init
npm i
npm test
```

Files under `seeds/*` are submodules. The seeds are repos ready to be cloned for quick starting a new project.

## Working With the Monorepo
We use lerna to manage the multiple packages produced by the repo.
`npm i` will run lerna bootstrap that will symlink dependencies: core into the mocha integration, the mocha integration into the integration tests etc.

## Contributions
When submitting a pull request make sure tests pass.

Clean the repo.
```
git clean -xdf
git reset --hard
```

Make sure the tests pass locally.
```
npm i
npm test
```

Submit a PR, watch for the tests on CI. The package is used on win, linux and macos.

## Coding Style Guide
We enforce style using tslint. We enforce test coverage using nyc. These are checked on `npm test`.
