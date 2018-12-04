# mocha-typescript

[![Get it on NPM](https://img.shields.io/npm/v/mocha-typescript.svg)](https://www.npmjs.com/package/mocha-typescript)
[![Downloads per Week](https://img.shields.io/npm/dw/mocha-typescript.svg)](https://www.npmjs.com/package/mocha-typescript)
[![Dependencies](https://img.shields.io/librariesio/github/pana-cc/mocha-typescript.svg)](https://libraries.io/npm/mocha-typescript)
[![Issues](https://img.shields.io/github/issues/pana-cc/mocha-typescript.svg)](https://github.com/pana-cc/mocha-typescript/issues)
[![Pull Requests](https://img.shields.io/github/issues-pr/pana-cc/mocha-typescript.svg)](https://github.com/pana-cc/mocha-typescript/pulls)
[![Build Status](https://img.shields.io/travis/pana-cc/mocha-typescript/master.svg)](https://travis-ci.org/pana-cc/mocha-typescript)
![Apache 2.0 License](https://img.shields.io/npm/l/mocha-typescript.svg)

## IDE Integration

### WebStorm

![WebStorm](./assets/WebStorm.png)

JetBrain's stellar WebStorm supports the mocha-typescript mocha UI, featuring

 - Test Explorer - Detects tests in the TypeScript using static analysis.
 - Test Runner - WebStorm has a Mocha test runner that can be configured to also do a TypeScript compilation before each
   test run.
 - Code Editor Integration - In the TypeScript code editor, tests are prefixed with an icon, that lets you
    - Run a specific test or suite
    - Debug a specific test or suite

[mocha-typescript-seed](https://github.com/pana-cc/mocha-typescript-seed) has been preconfigured (see the .idea folder 
in the repo) with `UnitTests` task that will run all mocha tests with the mocha-typescript UI.

The UnitTests is configured to run mocha, with TypeScript compilation before launch, use the mocha-typescript mocha UI,
as well as include tests in the test folder recursively.

#### Tricky
WebStorm has its own way to define tasks so the configuration for the project is duplicated at few places.
Here are some possible side-effects it would be good for you to be aware of.

Should running/debugging a single test/unit from the TypeScript code editor fail due missing ts-node, consider 
installing `npm i ts-node --save-dev` to your repo. WebStorm is using ts-node to transpile the file you are testing. 
This may omit proper type checking or using settings in your tsconfg, but that would rarely be an issue.

Should running/debugging a single test/unit run the test twice, that's because WebStorm provides the file you are 
editing to mocha as .ts file, but mocha also reads the test/mocha.opts where additional files may be specified.

You can either

 - Don't care about running the test twice
 - Edit the automatically generated single test config from the top tasks menu in WebStorm and change the file extension
   it points to from .ts to .js, this will use the JavaScript files produced by the TypeScript compilation of your
   project. But you will have to change the extension by hand each time you debug or run a single test.
 - Change the test/mocha.opts file so it won't reference any files (e.g. delete the `--recursive test` from it). In 
   that case you may need to fix the package.json build scripts.

At few occasions when mising BDD and the mocha-typescript decorators based UI, trying to run a single BDD test would
cause WebStorm to generate a mocha task that would run using BDD ui, instead of mocha-typescript. In these cases the 
tests may fail as there is no `suite` or `test` functions defined in the BDD UI. To fix this you may edit the default 
Mocha task, and configure it to use mocha-typescript UI explicitly. From that point on, when you try to run a single 
test, even a BDD only one, WebStorm will create Mocha tasks that will use the mocha-typescript UI.
