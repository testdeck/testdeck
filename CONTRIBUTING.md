## Conding Style Guide
Run `npm test`, after the tests `tslint` will run. To run tslint alone use `npm run tslint`. There is also a `npm run tslint-fix` that will apply auto fixes for some issues, but this may also break stuff, make sure to commit your code before running autofixes.

The project uses conventional changelog with angular style.
[Read more about messages here](https://github.com/conventional-changelog-archived-repos/conventional-changelog-angular/blob/master/convention.md).

## Bug Fixes
A bug fix:
 - [ ] Has code fix
 - [ ] Has unit tests, all tests pass
 - [ ] Updates the README.md (If necessary)

Commits are made using: `git commit`, and the commit text in vim follows the pattern:
```
fix: fix async tests not detected

Fix treating class methods with a `done` parameter as asynchronous tests.

BREAKING CHANGE: Any existing synchronous tests, writen while using the previous (broken) version, that had 'accidently' a `done` parameter, will now be executed as asynchronous.
```

## New Features
A feature:
 - [ ] Has the necessary fix
 - [ ] Has unit tests, all tests pass
 - [ ] Is described in the README.md

Commits are made using `git commit`, and the commit text in vim follows the mattern:
```
feat: static `before`/`after` methods run before/after the suite

Add a support for static methods named `before` or `after` in a test class, to execute as if `before` or `after` mocha hooks. Providing a `done` argument or returning a promise will run these methods as asynchronos. `@timeout` and `@slow` can be applied on `before` or `after` methods.

BREAKING CHANGE: Any existing static `before` or `after` methods in test class will now be executed as `before` or `after` hooks. As workaround - rename these methods.
```

## Other
### Refactor
Typos, reorganizing code that should not break anything etc.
```
refactor: Move method A before method B
```

### 
Updating README.md, version patch commits, etc.
```
chore: bump version to 1.1.15
```

## Maintainers
### Publishing
Publishing prerequisits:
 - The `package.json` version must have been bumped.
 - Tag the commit locally. For example `git tag v1.1.17`. The version must match exactly the version in the `package.json`.
 - Run `npm run changelog` and edit by hand if necessary the `CHANGELOG.md`, commit, push.
 - The commit to be published must have all green github CI builds.
 - Run `git clean -xdf`, `git reset --hard`, `npm i`, `npm test` locally.

When you have this in place:
 - Publish `npm publish`.
 - Push the tag to the origin. For example `git push origin v1.1.17`.
