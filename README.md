# testdeck 

This is the monorepo for the testdeck packages.

## Packages

- [@testdeck/mocha](./packages/mocha)
- [@testdeck/jasmine](./packages/jasmine)
- [@testdeck/jest](./packages/jest)
- [@testdeck/di-typedi](./packages/di-typedi)
- [@testdeck/core](./packages/core)

## Build

Clone this repository using

```
git clone https://github.com/testdeck/testdeck.git
```

Then from inside the so created `testdeck` directory run

```
npm install 
```

This will install all required dependencies and will also bootstrap `lerna`.

The following npm scripts are available

- tslint      -- runs `tslint` on all sources in all available packages
- tslint-fix  -- runs `tslint --fix` on all sources in all available packages
- test        -- run all tests on all available packages

## Resources 

- [Official Documentation](https://testdeck.org)

