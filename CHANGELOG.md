
## v0.3.3 (2022-12-05)

#### :house: Internal
* [#342](https://github.com/testdeck/testdeck/pull/342) Closes [#334](https://github.com/testdeck/testdeck/issues/334): Add additional issue templates ([@silkentrance](https://github.com/silkentrance))
* [#350](https://github.com/testdeck/testdeck/pull/350) Closes [#349](https://github.com/testdeck/testdeck/issues/349): Disable package-lock.json on root package ([@silkentrance](https://github.com/silkentrance))
* [#352](https://github.com/testdeck/testdeck/pull/352) Closes [#351](https://github.com/testdeck/testdeck/issues/351): Update Github Workflow ([@silkentrance](https://github.com/silkentrance))
* [#357](https://github.com/testdeck/testdeck/pull/357) Closes [#356](https://github.com/testdeck/testdeck/issues/356): Add SonarCloud to check for code coverage and other quality reports ([@silkentrance](https://github.com/silkentrance))
* [#363](https://github.com/testdeck/testdeck/pull/363) Closes [#362](https://github.com/testdeck/testdeck/issues/362): Split workflows into CI and QA ([@silkentrance](https://github.com/silkentrance))
* `core`, `di-typedi`, `jasmine`, `jest`, `mocha`, `vitest`
  * [#348](https://github.com/testdeck/testdeck/pull/348) Closes [#335](https://github.com/testdeck/testdeck/issues/335): Switch to eslint ([@silkentrance](https://github.com/silkentrance))
  * [#341](https://github.com/testdeck/testdeck/pull/341) Closes [#336](https://github.com/testdeck/testdeck/issues/336): Push down dependencies into requiring packages so that errors show up early ([@silkentrance](https://github.com/silkentrance))
  * [#345](https://github.com/testdeck/testdeck/pull/345) Closes [#344](https://github.com/testdeck/testdeck/issues/344): Reenable coverage checks and coverage reports for all packages ([@silkentrance](https://github.com/silkentrance))
  * [#347](https://github.com/testdeck/testdeck/pull/347) Closes [#346](https://github.com/testdeck/testdeck/issues/346): Remove nyc configuration from all package.json ([@silkentrance](https://github.com/silkentrance))
  * [#354](https://github.com/testdeck/testdeck/pull/354) Closes [#353](https://github.com/testdeck/testdeck/issues/353): Reconfigure Package Scripts ([@silkentrance](https://github.com/silkentrance))
  * [#361](https://github.com/testdeck/testdeck/pull/361) Closes [#360](https://github.com/testdeck/testdeck/issues/360): Include tests in sonar report ([@silkentrance](https://github.com/silkentrance))
* `jasmine`, `jest`, `mocha`, `vitest`
  * [#368](https://github.com/testdeck/testdeck/pull/368) Closes [#367](https://github.com/testdeck/testdeck/issues/367): Fix randomly failing test timeouts ([@silkentrance](https://github.com/silkentrance))
* `vitest`
  * [#359](https://github.com/testdeck/testdeck/pull/359) Closes [#358](https://github.com/testdeck/testdeck/issues/358): Enable coverage reports for @testdeck/vitest ([@silkentrance](https://github.com/silkentrance))

#### :memo: Documentation
* `core`, `di-typedi`, `jasmine`, `jest`, `mocha`, `vitest`
  * [#365](https://github.com/testdeck/testdeck/pull/365) Closes [#364](https://github.com/testdeck/testdeck/issues/364): Streamline badges in READMEs ([@silkentrance](https://github.com/silkentrance))
  * [#372](https://github.com/testdeck/testdeck/pull/372) Closes [#369](https://github.com/testdeck/testdeck/issues/369): Add QA Badges to Package Readmes ([@silkentrance](https://github.com/silkentrance))

## v0.3.2 (2022-11-10)

#### :bug: Bug Fix
* `di-typedi`
  * [#337](https://github.com/testdeck/testdeck/pull/338) testdeck/di-typedi does not depend on testdeck/core as a runtime dependency ([@silkentrance](https://github.com/silkentrance))

## v0.3.1 (2022-11-07)

#### :house: Internal
* [#329](https://github.com/testdeck/testdeck/pull/329) Remove package-lock.json ([@silkentrance](https://github.com/silkentrance))
* [#325](https://github.com/testdeck/testdeck/pull/325) Update ISSUE_TEMPLATES ([@silkentrance](https://github.com/silkentrance))

#### :bug: Bug Fix
* `vitest`
  * [#330](https://github.com/testdeck/testdeck/pull/330) Change vitest package type to module / esnext ([@silkentrance](https://github.com/silkentrance))
  * [#326](https://github.com/testdeck/testdeck/pull/326) vitest index.d.ts not generated ([@silkentrance](https://github.com/silkentrance))

#### Committers: 1
- Carsten Klein ([@silkentrance](https://github.com/silkentrance))

## v0.3.0 (2022-10-28)

#### :rocket: New Feature
* `vitest`
  * [#300](https://github.com/testdeck/testdeck/pull/300) add initial support for vitest ([@silkentrance](https://github.com/silkentrance))

#### :memo: Documentation
* `core`, `di-typedi`, `jasmine`, `jest`, `mocha`, `vitest`
  * [#320](https://github.com/testdeck/testdeck/pull/320) use github workflow badge instead of appveyor/travis-ci ([@silkentrance](https://github.com/silkentrance))

#### Committers: 1
- Carsten Klein ([@silkentrance](https://github.com/silkentrance))

## v0.2.2 (2022-10-28)

#### :house: Internal

* fix internal dependency version mismatch
* add missing tags to repo (v0.2.0, v0.2.1)
* add missing changelog entries (v0.2.1, v0.2.2)

## v0.2.1 (2022-09-08, incomplete)

#### :bug: Bug Fix
* `mocha`
  * [#294](https://github.com/testdeck/testdeck/pull/294) fix typings
  * [#290](https://github.com/testdeck/testdeck/pull/290) fix watcher to use new mocha --options flag and .mocharc.json instead

## v0.2.0 (internal)

* Fix null `this` in jest after methods
* Reorganize typings, uses re-exports instead `module.exports =`
* Mocha now export a `context` symbol that can be used to access the underlying mocha context

## v0.1.0 (2020-05-04)

#### :boom: Breaking Change
* [#274](https://github.com/testdeck/testdeck/pull/274) drop support for node < v10.0.0 ([@silkentrance](https://github.com/silkentrance))

#### :memo: Documentation
* [#271](https://github.com/testdeck/testdeck/pull/271) Closes [#270](https://github.com/testdeck/testdeck/issues/270): packages have been moved ([@silkentrance](https://github.com/silkentrance))

#### Committers: 1
- Carsten Klein ([@silkentrance](https://github.com/silkentrance))

## v0.0.10 (2020-04-19)

#### :bug: Bug Fix
* `core`
  * [#269](https://github.com/testdeck/testdeck/pull/269) fix gh-254: use Object.getOwnPropertyDescriptor instead of accessing the fields directly ([@silkentrance](https://github.com/silkentrance))

#### Committers: 1
- Carsten Klein ([@silkentrance](https://github.com/silkentrance))

## v0.0.9 (2020-04-17)

#### :house: Internal
* `core`, `jasmine`, `jest`, `mocha`
  * [#268](https://github.com/testdeck/testdeck/pull/268) Closes [#267](https://github.com/testdeck/testdeck/issues/267): add missing keywords to package manifest ([@silkentrance](https://github.com/silkentrance))

#### Committers: 1
- Carsten Klein ([@silkentrance](https://github.com/silkentrance))

## v0.0.8 (2020-04-17)

#### :bug: Bug Fix
* `core`, `jasmine`, `jest`
  * [#266](https://github.com/testdeck/testdeck/pull/266) Closes [#265](https://github.com/testdeck/testdeck/issues/265): support running afterAll/afterEach hooks in reverse order ([@silkentrance](https://github.com/silkentrance))

#### Committers: 1
- Carsten Klein ([@silkentrance](https://github.com/silkentrance))

## v0.0.7 (2020-04-16)

#### :house: Internal
* `core`, `jasmine`, `jest`, `mocha`
  * [#263](https://github.com/testdeck/testdeck/pull/263) Closes [#219](https://github.com/testdeck/testdeck/issues/219) ([@silkentrance](https://github.com/silkentrance))

#### :bug: Bug Fix
* `core`, `jasmine`, `jest`, `mocha`
  * [#263](https://github.com/testdeck/testdeck/pull/263) Closes [#262](https://github.com/testdeck/testdeck/issues/262) ([@silkentrance](https://github.com/silkentrance))

#### :rocket: New Feature
* `@testdeck/mocha`
  * [#257](https://github.com/testdeck/testdeck/pull/257) let npm resolve mocka and tsc binary ([@dcharbonnier](https://github.com/dcharbonnier))

#### :memo: Documentation
* [#233](https://github.com/testdeck/testdeck/pull/233) chore #205: update readme ([@silkentrance](https://github.com/silkentrance))

#### Committers: 2
- Carsten Klein ([@silkentrance](https://github.com/silkentrance))
- [@dcharbonnier](https://github.com/dcharbonnier)

## v0.0.6 (2019-04-09)

#### :house: Internal
* Other
  * [#232](https://github.com/testdeck/testdeck/pull/232) chore #231: add changelog ([@silkentrance](https://github.com/silkentrance))
  * [#230](https://github.com/testdeck/testdeck/pull/230) Update issue templates ([@silkentrance](https://github.com/silkentrance))
* `@testdeck/di-typedi`, `@testdeck/jest`
  * [#217](https://github.com/testdeck/testdeck/pull/217) chore #207: remove unused code ([@silkentrance](https://github.com/silkentrance))

#### :bug: Bug Fix
* `@testdeck/core`, `@testdeck/di-typedi`
  * [#228](https://github.com/testdeck/testdeck/pull/228) Closes [#226](https://github.com/testdeck/testdeck/issues/226): make registerDI a separate export ([@silkentrance](https://github.com/silkentrance))
* `@testdeck/di-typedi`
  * [#223](https://github.com/testdeck/testdeck/pull/223) chore #222: add missing tests to di-typedi ([@silkentrance](https://github.com/silkentrance))
* `@testdeck/core`, `@testdeck/di-typedi`, `@testdeck/jasmine`, `@testdeck/jest`, `@testdeck/mocha`
  * [#216](https://github.com/testdeck/testdeck/pull/216) chore #210: files must include relevant files only ([@silkentrance](https://github.com/silkentrance))

#### :memo: Documentation
* `@testdeck/core`, `@testdeck/di-typedi`, `@testdeck/jasmine`, `@testdeck/jest`, `@testdeck/mocha`
  * [#225](https://github.com/testdeck/testdeck/pull/225) chore #224: fix package.json links and descriptions ([@silkentrance](https://github.com/silkentrance))
  * [#215](https://github.com/testdeck/testdeck/pull/215) chore #209: add missing LICENSE ([@silkentrance](https://github.com/silkentrance))
* `@testdeck/di-typedi`
  * [#218](https://github.com/testdeck/testdeck/pull/218) chore #204: add/revise README ([@silkentrance](https://github.com/silkentrance))
* `@testdeck/core`
  * [#212](https://github.com/testdeck/testdeck/pull/212) chore #200: add readme ([@silkentrance](https://github.com/silkentrance))
* `@testdeck/jasmine`
  * [#213](https://github.com/testdeck/testdeck/pull/213) chore #202: add/revise readme ([@silkentrance](https://github.com/silkentrance))
* `@testdeck/mocha`
  * [#211](https://github.com/testdeck/testdeck/pull/211) chore #201: add/revise readme ([@silkentrance](https://github.com/silkentrance))
* `@testdeck/jest`
  * [#214](https://github.com/testdeck/testdeck/pull/214) chore #203: add/revise readme ([@silkentrance](https://github.com/silkentrance))

#### Committers: 1
- Carsten Klein ([@silkentrance](https://github.com/silkentrance))

## v0.0.5 (2019-04-07)

#### :bug: Bug Fixes
* [#199](https://github.com/testdeck/testdeck/pull/199) fix tsc errors ([@silkentrance](https://github.com/silkentrance))

#### Committers: 1
- [@silkentrance](https://github.com/silkentrance)

## v0.0.4 (2019-04-05)

#### :memo: Documentation
* [#187](https://github.com/testdeck/testdeck/pull/187) Update the contributing with recent information ([@pana-cc](https://github.com/pana-cc))
* move all documentation to [testdeck-site](https://github.com/testdeck/testdeck-site) ([@silkentrance](https://github.com/silkentrance))

#### Committers: 2
- [@pana-cc](https://github.com/pana-cc)
- [@silkentrance](https://github.com/silkentrance)

## v0.0.3 - v0.0.1

#### :boom: Breaking Change
* [#181](https://github.com/testdeck/testdeck/pull/181) Major rewrite ([@pana-cc](https://github.com/pana-cc))
* move TypeDI support to separate package

#### :bug: Bug Fixes
* various bug fixes ([@pana-cc](https://github.com/pana-cc), [@silkentrance](https://github.com/silkentrance))

#### :rocket: New Feature
* add support for jasmine
* add support for jest

#### :house: Internal
* switch to lerna

#### Committers: 2
- [@pana-cc](https://github.com/pana-cc)
- [@silkentrance](https://github.com/silkentrance)

## Pre v0.0.1: mocha-typescript
* no changelog information available
