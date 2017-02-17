Watcher for TypeScript and Mocha and a Decorators Based Interface for Mocha

[![Build Status](https://travis-ci.org/pana-cc/mocha-typescript.svg?branch=master)](https://travis-ci.org/pana-cc/mocha-typescript)

[![NPM](https://nodei.co/npm-dl/mocha-typescript.png)](https://nodei.co/npm/mocha-typescript/)

# Summary
## Watcher
Set up a watcher that does TypeScript compilation for a TypeScript project and runs mocha tests on file change.
The watcher can be used with any mocha test interface.

## Decorators
Use TypeScript decorators such as `@suite`, `@test`, `@timeout`, `@slow`, `@only` and `@skip`,
to write your tests. The package will call the appopriate `describe`, `it`, `timeout`, `slow`, `it.only` or `it.skip`.

 - A class decorated with `@suite` is considered suite.
 - Static `before` and `after` methods will be called before and after all tests.
 - A class instance will be created for each test.
 - Instance `before` and `after` methods will be called before and after each test.
 - A method decorated with `@test` is considered a test.
 - Methods accepting `done` callback or returning a `Promise` instance are considered async.

# Thanks to
 - [Haringat](https://github.com/PanayotCankov/mocha-typescript/pull/6) for the async support in before and after methods.
 - [godart](https://github.com/PanayotCankov/mocha-typescript/pull/16) for taking the extra step to support non-default test file paths.

# Test Watcher
There is a watcher script in the package, that runs `tsc -w` process and watches its output for successful compilation, upon compilation runs a `mocha` process.

You will need a `tsconfig.json`, and at least `test.ts` mocha entrypoint.

Install `mocha`, `typescript` and `mocha-typescript` as dev dependencies (required):
```
npm install typescript --save-dev
npm install mocha --save-dev
npm install mocha-typescript --save-dev
```

Add the following npm script to `package.json`:
```
  "scripts": {
    "dev-test-watch": "mocha-typescript-watch"
  },
```

And run the typescript mocha watcher from the terminal using `npm run dev-test-watch`.

You can use the watcher with plain `describe`, `it` functions. The decorator based interface is not required for use with the watcher.

The `mocha-typescript-watch` script is designed as a command line tool.
You can provide the arguments in the package.json's script.
In case you are not using the default `test.js` file as entrypoint for mocha,
you can list the test suite files as arguments to mocha-typescript-watch and they will be passed to mocha.
For example:
```
  "scripts": {
    "dev-test-watch": "mocha-typescript-watch -p tsconfig.test.json -o mocha.opts dist/test1.js dist/test2.js"
  },
```

For complete list with check `./node_modules/.bin/mocha-typescript-watch --help`: 
```
Options:
  -p, --project  Path to tsconfig file or directory containing tsconfig, passed
                 to `tsc -p <value>`.                    [string] [default: "."]
  -t, --tsc      Path to executable tsc, by default points to typescript
                 installed as dev dependency. Set to 'tsc' for global tsc
                 installation.
                         [string] [default: "./node_modules/typescript/bin/tsc"]
  -o, --opts     Path to mocha.opts file containing additional mocha
                 configuration.          [string] [default: "./test/mocha.opts"]
  -m, --mocha    Path to executable mocha, by default points to mocha installed
                 as dev dependency.
                           [string] [default: "./node_modules/mocha/bin/_mocha"]
  -g, --grep     Passed down to mocha: only run tests matching <pattern>[string]
  -f, --fgrep    Passed down to mocha: only run tests containing <string>
                                                                        [string]
  -h, --help     Show help                                             [boolean]
```

# Test Interface
The standard mocha interface (arrow functions are discouraged because this is messed up, so we use function):
```
describe("Hello", function() {
    it("world", function() {});
})
```

Becomes:
```
@suite class Hello {
    @test "world"() { }
}
```

## Scafolding
In the terminal run:
```
mkdir mocha-ts-use
cd mocha-ts-use

npm init
# then multiple enter hits

npm install typescript --save-dev
npm install mocha --save-dev
npm install mocha-typescript --save-dev
```

In the `package.json` add:
```
  "scripts": {
    "test": "tsc -p . && mocha",
    "prepublish": "tsc -p ."
  },
```

Create `tsconfig.json` file near the `package.json` like that:
```
{
    "compilerOptions": {
        "module": "commonjs",
        "removeComments": false,
        "preserveConstEnums": true,
        "sourceMap": true,
        "experimentalDecorators": true,
        "declaration": true
    }
}
```

Add a `test.ts` file:
```
import { suite, test, slow, timeout, skip, only } from "mocha-typescript";

@suite class Hello {
    @test "world"() { }
}
```

Back to the terminal:
```
npm test
```

Now you have tests for the code you are about to write.

Mind adding `.npmignore` and `.gitignore` to keep `.ts` files in `git`,
and `.js` and `.d.ts` files in `npm`.

## More Example Code
Check the playground:
``` TypeScript
import { suite, test, slow, timeout, skip, only } from "mocha-typescript";

@suite("mocha typescript")
class Basic {
    
    @test("should pass when asserts are fine")
    asserts_pass() {
    }
    
    @test("should fail when asserts are broken")
    asserts_fail() {
        // Any self-respecting assertion framework should throw
        var error = new Error("Assert failed");
        (<any>error).expected = "expected";
        (<any>error).actual = "to fail";
        throw error;
    }
    
    @test("should pass async tests")
    assert_pass_async(done: Function) {
        setTimeout(() => done(), 1);
    }
    
    @test("should fail async when given error")
    assert_fail_async(done: Function) {
        setTimeout(() => done(new Error("Oops...")), 1);
    }
    
    @test("should fail async when callback not called")
    @timeout(100)
    assert_fail_async_no_callback(done: Function) {
        // Never called... t/o intentional.
    }
    
    @test("should pass when promise resolved")
    promise_pass_resolved() {
        return new Promise((resolve, reject) => {
            setTimeout(() => resolve(), 1);
        });
    }
    
    @test("should fail when promise rejected")
    promise_fail_rejected() {
        return new Promise((resolve, reject) => {
            setTimeout(() => reject(new Error("Ooopsss...")), 1);
        });
    }
}

//   mocha typescript
//     √ should pass when asserts are fine
//     1) should fail when asserts are broken
//     √ should pass async tests
//     2) should fail async when given error
//     3) should fail async when callback not called
//     √ should pass when promise resolved
//     4) should fail when promise rejected

@suite class CuteSyntax {
    @test testNamedAsMethod() {
    }
    
    @test "can have non verbose syntax for fancy named tests"() {
    }
    
    @test "and they can be async too"(done) {
        done();
    }
}

//   CuteSyntax
//     √ testNamedAsMethod
//     √ can have non verbose syntax for fancy named tests
//     √ and they can be async too

@suite class LifeCycle {
    static tokens = 0;
    token: number;
    
    constructor() {
        console.log("     - new LifeCycle");
    }
    
    before() {
        this.token = LifeCycle.tokens++;
        console.log("       - Before each test " + this.token);
    }
    
    after() {
        console.log("       - After each test " + this.token);
    }

    static before() {
        console.log("   - Before the suite: " + ++this.tokens);
    }
    
    static after() {
        console.log("   - After the suite" + ++this.tokens);
    }
    
    @test one() {
        console.log("         - Run one: " + this.token);
    }
    @test two() {
        console.log("         - Run two: " + this.token);
    }
}

//   LifeCycle
//    - Before the suite: 1
//      - new LifeCycle
//        - Before each test 1
//          - Run one: 1
//     √ one
//        - After each test 1
//      - new LifeCycle
//        - Before each test 2
//          - Run two: 2
//     √ two
//        - After each test 2
//    - After the suite4

@suite class PassingAsyncLifeCycle {

    constructor() {
    }

    before(done) {
        setTimeout(done, 100);
    }

    after() {
        return new Promise((resolve, reject) => resolve());
    }

    static before() {
        return new Promise((resolve, reject) => resolve());
    }

    static after(done) {
        setTimeout(done, 300);
    }

    @test one() {
    }
    @test two() {
    }
}

//   PassingAsyncLifeCycle
//     √ one
//     √ two

@suite class Times {
    @test @slow(10) "when fast is normal"(done) {
        setTimeout(done, 0);
    }
    @test @slow(15) "when average is yellow-ish"(done) {
        setTimeout(done, 10);
    }
    @test @slow(15) "when slow is red-ish"(done) {
        setTimeout(done, 20);
    }
    @test @timeout(10) "when faster than timeout passes"(done) {
        setTimeout(done, 0);
    }
    @test @timeout(10) "when slower than timeout fails"(done) {
        setTimeout(done, 20);
    }
}

//   Times
//     √ when fast is normal
//     √ when average is yellow-ish (10ms)
//     √ when slow is red-ish (20ms)
//     √ when faster than timeout passes
//     5) when slower than timeout fails

@suite class ExecutionControl {
    @skip @test "this won't run"() {
    }
    
    @test "this however will"() {
    }
    
    // @only
    @test "add @only to run just this test"() {
    }
}

//   ExecutionControl
//     - this won't run
//     √ this however will
//     √ add @only to run just this test

class ServerTests {
    connect() {
        console.log("      connect(" + ServerTests.connection + ")");
    }
    disconnect() {
        console.log("      disconnect(" + ServerTests.connection + ")");
    }
    
    static connection: string;
    static connectionId: number = 0;

    static before() {
        ServerTests.connection = "shader connection " + ++ServerTests.connectionId;
        console.log("    boot up server.");
    }

    static after() {
        ServerTests.connection = undefined;
        console.log("    tear down server.");
    }
}

@suite class MobileClient extends ServerTests {
    @test "client can connect"() { this.connect(); }
    @test "client can disconnect"() { this.disconnect(); }
}

@suite class WebClient extends ServerTests {
    @test "web can connect"() { this.connect(); }
    @test "web can disconnect"() { this.disconnect(); }
}

//   MobileClient
//   boot up server.
//     connect(shader connection 1)
//     √ client can connect
//     disconnect(shader connection 1)
//     √ client can disconnect
//   tear down server.

//   WebClient
//   boot up server.
//     connect(shader connection 2)
//     √ web can connect
//     disconnect(shader connection 2)
//     √ web can disconnect
//   tear down server.

// Nested suites
describe("outer suite", () => {
    @suite class TestClass {
        @test method() {
        }
    }
});

//   outer suite
//     TestClass
//       ✓ method

//   19 passing (219ms)
//   1 pending
//   5 failing
```

In case you really really need the mocha context (the 'this' argument of it/describe/before/after etc.)
you can decorate a class field to be asigned the mocha context as follows:
```
@suite class OAuthTest {

    // Get the mocha context for instance before and after (before/after each) and test methods.
    @context mocha: mocha.IBeforeAndAfterContext & mocha.IHookCallbackContext;

    // Get the mocha context for static before and after.
    @context static mocha: mocha.IBeforeAndAfterContext & mocha.IHookCallbackContext;

    @test async "Request token"() {
        // return (await request(url)).responce.headers.token;
        return Promise.resolve();
    }
    @test async "Exchange token for oauth session"() {
        return Promise.resolve();
    }
    @test async "Request sensitive data"() {
        return Promise.resolve();
    }
    after() {
        console.log("End of test: " + this.mocha.currentTest.fullTitle());
    }
    static after() {
        // After all tests
        console.log("End of test: " + !!this.mocha);
    }
}
```
