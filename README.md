# testdeck 

This is the monorepo for the testdeck packages.

## Packages

- [testdeck-mocha](./packages/testdeck-mocha)
- [testdeck-mocha-di-typedi](./packages/testdeck-mocha-di-typedi)
- [testdeck-jest](./packages/testdeck-jest)

## Build

Clone this repository using

```
git clone https://github.com/testdeck/testdeck.git
```

Then from inside the so created `testdeck` directory run

```
npm run setup
```

This will install all required dependencies and will also bootstrap `lerna`.

The following npm scripts are available

- clean    -- clean the available packages
- build    -- runs a build on all available packages
- coverage -- runs `nyc` on all available packages
- lint     -- runs `tslint` on all sources in all available packages
- test     -- run all tests on all available packages
- setup    -- runs `npm install` and then bootstraps `lerna`
