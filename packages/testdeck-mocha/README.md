# testdeck-mocha

[![Get it on NPM](https://img.shields.io/npm/v/testdeck-mocha.svg)](https://www.npmjs.com/package/testdeck-mocha)
[![Downloads per Week](https://img.shields.io/npm/dw/testdeck-mocha.svg)](https://www.npmjs.com/package/testdeck-mocha)
[![Dependencies](https://img.shields.io/librariesio/github/pana-cc/testdeck-mocha.svg)](https://libraries.io/npm/testdeck-mocha)
[![Issues](https://img.shields.io/github/issues/testdeck/testdeck.svg)](https://github.com/testdeck/testdeck/issues)
[![Pull Requests](https://img.shields.io/github/issues-pr/testdeck/testdeck.svg)](https://github.com/testdeck/testdeck/pulls)
[![Travis Build Status](https://img.shields.io/travis/testdeck/testdeck/master.svg)](https://travis-ci.org/testdeck/testdeck)
[![Appveyor Build Status](https://img.shields.io/appveyor/ci/testdeck/testdeck.svg)](https://ci.appveyor.com/project/testdeck/testdeck)
![Apache 2.0 License](https://img.shields.io/npm/l/testdeck-mocha.svg)

Mocha testing with style - the OOP way

```TypeScript
import { suite, test } from "testdeck-mocha";

@suite
class Hello {
  
    @test
    world() {
      // place your assertions here
    }
}
```

## Documentation Licensing

All documentation is licenced under the [CC BY-NC 4.0 license](https://creativecommons.org/licenses/by-nc/4.0/).

You need legal consent by all direct maintainers of the project in order to use (parts of) the documentation for any 
commercial purposes.

## Features

- Object Oriented Interface
- Parameterised Tests
- Dependency Injection Support
- Watcher

## Installation

Just run

```bash
npm install --save-dev testdeck-mocha
npm install --save-dev @types/mocha
```

and you are ready to go.

You might also want to consider using the very good [Chai](https://github.com/chaijs/chai) BDD/TDD assertion framework.

```bash
npm install --save-dev chai
npm install --save-dev @types/chai
```

And, depending on your project, you will also have to install the type declarations for node.

```bash
npm install --save-dev @types/node
```

## Usage

Classes can be annotated with ``@suite`` to make them test suites, similarly so, individual methods of test suites can
be annotated using ``@test``. And, by using inheritance, one can build complex test suites and reuse existing 
code.

The test interface also supports mocha's built-in BDD and TDD interfaces such as ``describe`` and ``it``. 

And you can mix both the OOP style and the declarative style, and you can even create nested suites by using a mixture
of both styles.

```TypeScript
import { assert } from "chai";
import { suite, test, describe, it } from "testdeck-mocha";

@suite
class Suite {
  
    @test
    method() {}
}

// mixed operations
describe("outer", () => {
    it("one", () => {});
    
    @suite
    class Inner {
      
        @test
        method() {}
    }
});

// abstract suites
abstract class TestBase {
  
  @test
  commonTest() {
  }
}

@suite
class ConcreteTest extends TestBase {
  
  @test
  specificTest() {
  }
}
```

Please keep in mind, that when the tests are run, a new instance of the test suite will be instantiated before each test
method is executed.

## Watcher

testdeck-mocha comes with a watcher script that runs the TypeScript compiler in watch mode. So whenever your code 
changes and compiles, your tests will be run, too.

## Further Reading

 - [API](https://github.com/testdeck/testdeck/blob/master/docs/api.md)
 - [Object Oriented Testing](https://github.com/testdeck/testdeck/blob/master/docs/oop.md)
   - [Generated Test Suites](https://github.com/testdeck/testdeck/blob/master/docs/oop_generated.md)
   - [Parameterised Tests](https://github.com/testdeck/testdeck/blob/master/docs/oop_params.md)
   - [Using Dependency Injection](https://github.com/testdeck/testdeck/blob/master/docs/di.md)
 - [Extending Test Behaviour](https://github.com/testdeck/testdeck/blob/master/docs/extendbehave.md)
 - [Using the Watcher](https://github.com/testdeck/testdeck/blob/master/docs/watcher.md)
 - [Set up testdeck-mocha](https://github.com/testdeck/testdeck/blob/master/docs/setup.md)
 - [IDE Integration](https://github.com/testdeck/testdeck/blob/master/docs/ide.md)

### Contributors

[//]: contributor-faces
<a href="https://github.com/silkentrance"><img src="https://avatars3.githubusercontent.com/u/6068824?v=4" title="silkentrance" width="80" height="80"></a>
<a href="https://github.com/pana-cc"><img src="https://avatars2.githubusercontent.com/u/24751471?v=4" title="pana-cc" width="80" height="80"></a>
<a href="https://github.com/dimastark"><img src="https://avatars3.githubusercontent.com/u/11780431?v=4" title="dimastark" width="80" height="80"></a>
<a href="https://github.com/Haringat"><img src="https://avatars1.githubusercontent.com/u/3000678?v=4" title="Haringat" width="80" height="80"></a>
<a href="https://github.com/godart"><img src="https://avatars2.githubusercontent.com/u/5794761?v=4" title="godart" width="80" height="80"></a>
<a href="https://github.com/Eronana"><img src="https://avatars3.githubusercontent.com/u/9164153?v=4" title="Eronana" width="80" height="80"></a>
<a href="https://github.com/FabianLauer"><img src="https://avatars0.githubusercontent.com/u/2205595?v=4" title="FabianLauer" width="80" height="80"></a>
<a href="https://github.com/JoshuaKGoldberg"><img src="https://avatars1.githubusercontent.com/u/3335181?v=4" title="JoshuaKGoldberg" width="80" height="80"></a>
<a href="https://github.com/gallayl"><img src="https://avatars0.githubusercontent.com/u/16716099?v=4" title="gallayl" width="80" height="80"></a>
<a href="https://github.com/richardspence"><img src="https://avatars2.githubusercontent.com/u/9914123?v=4" title="richardspence" width="80" height="80"></a>
<a href="https://github.com/sergebat"><img src="https://avatars1.githubusercontent.com/u/5421460?v=4" title="sergebat" width="80" height="80"></a>
<a href="https://github.com/cexoso"><img src="https://avatars2.githubusercontent.com/u/11764107?v=4" title="cexoso" width="80" height="80"></a>
<a href="https://github.com/dcharbonnier"><img src="https://avatars3.githubusercontent.com/u/6220422?v=4" title="dcharbonnier" width="80" height="80"></a>
<a href="https://github.com/itaysabato"><img src="https://avatars0.githubusercontent.com/u/2768658?v=4" title="itaysabato" width="80" height="80"></a>
<a href="https://github.com/stanhuff"><img src="https://avatars2.githubusercontent.com/u/4603784?v=4" title="stanhuff" width="80" height="80"></a>

[//]: contributor-faces
