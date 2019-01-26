# mocha-typescript

This is the monorepo for the mocha-typescript packages.

## Packages

- [mocha-typescript](./packages/mocha-typescript)
- [mocha-typescript-di-typedi](./packages/mocha-typescript-di-typedi)

## Build

Clone this repository using

```
git clone https://github.com/pana-cc/mocha-typescript.git
```

Then from inside the so created `mocha-typescript` directory run

```
npm run setup
```

This will install all required dependencies and will also bootstrap `lerna`.

The following npm scripts are available

- clean    -- clean the available packages
- build    -- runs `tsc` on all available packages
- coverage -- runs `nyc` on all available packages
- lint     -- runs `tslint` on all sources in all available packages
- test     -- run all tests on all available packages
- setup    -- runs **npm install** and then bootstraps `lerna`
