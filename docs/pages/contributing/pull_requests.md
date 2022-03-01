---
layout: contributing
section: contributing
role: page
toc: true
order: 20
title: Pull Requests
label: Pull Requests
description: |
  Pull requests
---

{:.toc}
## Pull Requests


{:.toc}
### Bug Fixes

When doing pull requests for bug fixes, you can use this short list as a reminder what needs to be done.

 - [ ] [A bug report has been filed](./reporting#bugs)
 - [ ] Has the necessary changes
 - [ ] Has unit tests, all tests pass
 - [ ] The commit message follows the pattern shown below (we use conventional-changelog) 

#### Commit Message Pattern

```
fix #123: fix async tests not detected

Fix treating class methods with a `done` parameter as asynchronous tests.

BREAKING CHANGE: Any existing synchronous tests, written while using the previous (broken) version,
that had 'accidently' a `done` parameter, will now be executed as asynchronous.
```


{:.toc}
### New Features

When doing pull requests for new features, you can use this short list as a reminder what needs to be done.

 - [ ] [A feature request has been filed](./reporting#feature-requests)
 - [ ] Has the necessary changes
 - [ ] Has unit tests, all tests pass
 - [ ] The commit message follows the pattern shown below 
 - [ ] Optional: a pull request for [testdeck-site](https://github.com/testdeck/testdeck-site) that includes 
       documentation on the new features has been made available

#### Commit Message Pattern

```
feature #123: new super duper feature

A super duper new feature that makes testdeck fly.
```
