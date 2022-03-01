---
layout: guide
section: guide
role: page 
order: 1
toc: true
title: Setup
label: Setup
description: |
  Testdeck Setup
---

{:.toc}
## Basic Setup 

If you have not already done so, you must create a new package first.

{% highlight shell %}
mkdir newpackage
cd newpackage

npm init

npm install --save-dev typescript tslint
{% endhighlight %}

### Add tsconfig.json

The presented configuration is made so to get you started. You might want a more elaborated configuration for your own project.

The experimentalDecorators setting, however, is required as Testdeck makes heavy use of these.

{% highlight json linenos %}
{
    "compilerOptions": {
        "target": "es6",
        "module": "commonjs",
        "sourceMap": true,
        "experimentalDecorators": true,
        "lib": [ "es6" ]
    }
}
{% endhighlight %}

### Add tslint.json

The presented configuration is made so to get you started. You might want a more elaborated configuration for your own project.

{% highlight json linenos %}
{
    "defaultSeverity": "error",
    "extends": [
        "tslint:recommended"
    ],
    "jsRules": {},
    "rules": {
        "max-classes-per-file": false,
        "max-line-length": false,
        "no-empty": false,
        "only-arrow-functions": false,
        "no-console": false,
        "object-literal-sort-keys": false,
        "interface-name": false,
        "ban-types": false,
        "no-shadowed-variable": false,
        "forin": false,
        "member-ordering": false,
        "deprecation": true,
        "no-reference": false,
        "trailing-comma": false
    },
    "rulesDirectory": []
}
{% endhighlight %}

### Choose a Test Framework

Next, you need to choose which test framework you are going to use.

Testdeck supports Mocha, Jasmine and Jest.

With some limitations, you can always change the test framework later on. The most obvious limitations being the mocking
framework and the assertion/expectation framework that you will use, which might or might not have a compatible API.

We have collected an overview of the available assertion/expectation frameworks and also some of the available mocking 
frameworks, so you can decide which route you will take in order to be able to migrate between test frameworks,
provided that this is a valid use case for you.

{:.toc}
## @testdeck/mocha

{% highlight shell %}
# we only include @types/node here since we are using node's assert in the below example
npm install --save-dev @testdeck/mocha mocha @types/mocha ts-node @types/node
{% endhighlight %}

### Edit package.json

{% highlight json %}
{
  "scripts": {
    "test": "mocha --opts ./mocha.opts"
  }
}
{% endhighlight %}

### Add mocha.opts

{% highlight shell %}
--require source-map-support/register
--require ts-node/register
test/**/*test.ts
{% endhighlight %}

### Add test/test.ts

{% highlight TypeScript linenos %}
import { suite, test } from '@testdeck/mocha';
import * as assert from 'assert';

@suite
class TestSuite {

  @test
  someTest() {

    assert.ok(false);
  }
}
{% endhighlight %}

### Run tests

{% highlight shell %}
npm test

> mocha --opts ./mocha.opts



  TestSuite
    1) someTest


  0 passing (24ms)
  1 failing

  1) TestSuite
       someTest:

      AssertionError [ERR_ASSERTION]: false == true
      + expected - actual

      -false
      +true

      at TestSuite.someTest (test/test.ts:10:12)
      at Context.someTest (node_modules/@testdeck/core/dist/index.js:158:39)



npm ERR! Test failed.  See above for more details.
{% endhighlight %}


{:.toc}
### testdeck-mocha-seed

Alternatively, you can clone the existing <a href="https://github.com/testdeck/testdeck-mocha-seed">testdeck-mocha-seed</a> and start from there.

There you also find information on how to enable test coverage using [nyc](https://github.com/istanbuljs/nyc).


{:.toc}
## @testdeck/jasmine

{% highlight bash %}
npm install --save-dev @testdeck/jasmine jasmine @types/jasmine jasmine-ts jasmine-spec-reporter ts-node
{% endhighlight %}

### Add jasmine.json

{% highlight json %}
{
  "spec_dir": "test",
  "spec_files": [
    "**/*[tT]est.ts"
  ],
  "helpers": [
    "helpers/**/*.ts"
  ],
  "stopSpecOnExpectationFailure": false,
  "random": false,
  "reporters": [
    {
      "name": "jasmine-spec-reporter#SpecReporter",
      "options": {
        "displayStacktrace": "all"
      }
    }
  ]
}
{% endhighlight %}

### Edit package.json

{% highlight json %}
{
  "scripts": {
    "test": "jasmine-ts --config=./jasmine.json"
  }
}
{% endhighlight %}

### Add test/test.ts

{% highlight TypeScript linenos %}
import { suite, test } from '@testdeck/jasmine';

@suite
class TestSuite {

  @test
  someTest() {

    expect(false).toBe(true);
  }
}
{% endhighlight %}

### Run tests

{% highlight shell %}
npm test

Jasmine started

  TestSuite
    ✗ someTest
      - Expected false to be true.

**************************************************
*                    Failures                    *
**************************************************

1) TestSuite someTest
  - Expected false to be true.

Executed 1 of 1 spec (1 FAILED) in 0.017 sec.
{% endhighlight %}

{:.toc}
### testdeck-jasmine-seed

Alternatively, you can clone the existing <a href="https://github.com/testdeck/testdeck-jasmine-seed">jasmine-seed</a> and start from there.

There you also find information on how to enable test coverage using [nyc](https://github.com/istanbuljs/nyc).


{:.toc}
## @testdeck/jest

{% highlight bash %}
npm install --save-dev @testdeck/jest jest @types/jest ts-jest typescript
{% endhighlight %}

### Add jest.config.js

{% highlight JavaScript %}
module.exports = {
  rootDir: '.',
  preset: 'ts-jest',
  testMatch: ['<rootDir>/test/**/*test.ts'],
  coverageThreshold: {
    global: {
      branches: 0,
      functions: 0,
      lines: 0,
      statements: 0
    }
  }
};
{% endhighlight %}

### Edit package.json

{% highlight json %}
{
  "scripts": {
    "test": "jest"
  }
}
{% endhighlight %}

### Add test/test.ts

{% highlight TypeScript linenos %}
import { suite, test } from '@testdeck/jest';

@suite
class TestSuite {

  @test
  someTest() {

    expect(false).toBe(true);
  }
}
{% endhighlight %}

### Run tests

{% highlight shell %}
npm test

> jest

 FAIL  test/test.ts
  TestSuite
    ✕ someTest (8ms)

  ● TestSuite › someTest

    expect(received).toBe(expected) // Object.is equality

    Expected: true
    Received: false

       7 |   someTest() {
       8 |
    >  9 |     expect(false).toBe(true);
         |                   ^
      10 |   }
      11 | }
      12 |

      at TestSuite.someTest (test/test.ts:9:19)
      at Object.someTest (node_modules/@testdeck/core/dist/index.js:158:39)

Test Suites: 1 failed, 1 total
Tests:       1 failed, 1 total
Snapshots:   0 total
Time:        2.016s
Ran all test suites.
npm ERR! Test failed.  See above for more details.
{% endhighlight %}

{:.toc}
### testdeck-jest-seed

Alternatively, you can clone the existing <a href="https://github.com/testdeck/testdeck-jest-seed">jest-seed</a> and start from there.

There you also find information on how to enable test coverage using built-in jest functionality, which is based on
[nyc](https://github.com/istanbuljs/nyc).


{:.toc}
## Assertion/Expectation Frameworks

Next, you might want to choose your assertion/expectation framework to actually implement your tests.

Here is a non exhaustive list of the available frameworks for you to choose from.


{:.toc}
### Chai.js

A highly recommended assertion/expectation framework which also supports expect/should in addition to the standard assert.

#### Setup

{% highlight shell %}
npm install --save-dev chai @types/chai
{% endhighlight %}

#### Example Code

{% highlight TypeScript linenos %}
import { suite, test } from '@testdeck/mocha'; // might as well use jasmine/jest here
import * as chai from 'chai';

// let's have chai's should augmentations
chai.should();

@suite
class TestSuite {

  @test
  assertTest() {

    chai.assert.isOk(false);
  }

  @test
  expectTest() {

    chai.expect(false).to.be.true;
  }

  @test
  shouldTest() {

    const val = false;

    val.should.be.true;
  }
}
{% endhighlight %}


{:.toc}
### Should.js

Should.js is a well established expectation framework.

#### Setup

{% highlight shell %}
npm install --save-dev should
{% endhighlight %}

#### Example Code

{% highlight TypeScript linenos %}
import { suite, test } from '@testdeck/mocha'; // might as well use jasmine/jest here
import * as should from 'should';

@suite
class TestSuite {

  @test
  someTest() {

    const var = false;

    var.should.be.true();
  }
}
{% endhighlight %}


{:.toc}
### Expect.js

#### Setup

{% highlight shell %}
npm install --save-dev expect.js @types/expect.js 
{% endhighlight %}

#### Example Code

{% highlight TypeScript linenos %}
TODO
{% endhighlight %}


{:.toc}
### Expect (Jest)

While this is an integral part of the Jest test framework, it can be used as a stand alone package, too.

#### Setup

{% highlight shell %}
npm install --save-dev expect
{% endhighlight %}

#### Example Code

{% highlight TypeScript linenos %}
import { suite, test } from '@testdeck/mocha';
import * as expect from 'expect';

@suite
class TestSuite {

  @test
  someTest() {

    expect(false).toBe(true);
  }
}
{% endhighlight %}


{:.toc}
### Expect (Jasmine)

While this is an integral part of the Jasmine test framework, it can be used as a stand alone package, too.

#### Setup

{% highlight shell %}
npm install --save-dev jasmine-expect
{% endhighlight %}

#### Example Code

{% highlight TypeScript linenos %}
import { suite, test } from '@testdeck/mocha';
import * as expect from 'jasmine-expect';

@suite
class TestSuite {

  @test
  someTest() {

    expect(false).toBe(true);
  }
}
{% endhighlight %}


{:.toc}
### NodeJS assert

A simple, no fuss, assertion framework that is included with the standard NodeJS library.

#### Setup

This is part of the standard NodeJS library.

#### Example Code

{% highlight TypeScript linenos %}
import { suite, test } from '@testdeck/mocha'; // might as well use jasmine/jest here
import * as assert from 'assert';

@suite
class TestSuite {

  @test
  someTest() {

    assert.ok(false);
  }
}
{% endhighlight %}


{:.toc}
### Jasmine built-in

For Jasmine, we recommend the built-in expectation framework.

#### Setup

This is an integral part of Jasmine.

#### Example Code

{% highlight TypeScript linenos %}
import { suite, test } from '@testdeck/jasmine';

@suite
class TestSuite {

  @test
  someTest() {

    expect(false).toBe(true);
  }
}
{% endhighlight %}


{:.toc}
### Jest built-in

For Jest, we recommend the built-in expectation framework.

#### Setup

This is an integral part of Jest.

#### Example Code

{% highlight TypeScript linenos %}
import { suite, test } from '@testdeck/jest';

@suite
class TestSuite {

  @test
  someTest() {

    expect(false).toBe(true);
  }
}
{% endhighlight %}


{:.toc}
## Mocking Frameworks


{:.toc}
### Sinon.JS

Sinon.JS is a popular mocking framework.

#### Setup

{% highlight shell %}
npm install --save-dev sinon @types/sinon sinon-chai @types/sinon-chai chai @types/chai
{% endhighlight %}

#### Example Code

{% highlight TypeScript linenos %}
import { suite, test } from '@testdeck/mocha';
import * as chai from 'chai';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';

chai.use(sinonChai);

class SUT {

  private flags: {};

  public setFlag(flag: string, value: boolean): void {

    this.flags[flag] = value;
  }

  public getFlag(flag: string): boolean {

    return this.flags[flag] || false;
  }
}

@suite
class TestSuite {

  private sut: SUT;

  before() {

    this.sut = new SUT();
  }

  @test
  someTest() {

    sinon.spy(this.sut, 'getFlag');

    this.sut.setFlag('foo', true);

    expect(this.sut.getFlag('foo')).toBe(true);
    expect(this.sut.getFlag).to.have.been.calledWith('foo');
  }
}
{% endhighlight %}


{:.toc}
### Jasmine built-in

Jasmine provides you with a built-in mocking facility.

#### Setup

This is an integral part of Jasmine.

#### Example Code

{% highlight TypeScript linenos %}
import { suite, test } from '@testdeck/jasmine';

class SUT {

  private flags: {};

  public setFlag(flag: string, value: boolean): void {

    this.flags[flag] = value;
  }

  public getFlag(flag: string): boolean {

    return this.flags[flag] || false;
  }
}

@suite
class TestSuite {

  private sut: SUT;

  before() {

    this.sut = new SUT();
  }

  @test
  someTest() {

    spyOn(this.sut, 'getFlag').and.returnValue(false);
    expect(this.sut.getFlag('foo')).toBe(true);
  }
}
{% endhighlight %}


{:.toc}
### Jest built-in

Jest, similarly to Jasmine, provides you with a built-in mocking facility.

And we will not go into length here on how that works.

See the official documentation [here](https://jestjs.io/docs/en/jest-object.html) and [here](https://jestjs.io/docs/en/mock-function-api).

#### Setup

This is an integral part of Jest.

#### Example Code

See the example code in the official documentation.


{:.toc}
## Dependency Injection

<dl>
<dt>TypeDI</dt>
<dd>testdeck offers support for TypeDI via its @testdeck/di-typedi package.</dd>
</dl>
