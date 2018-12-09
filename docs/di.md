# mocha-typescript

[![Get it on NPM](https://img.shields.io/npm/v/mocha-typescript.svg)](https://www.npmjs.com/package/mocha-typescript)
[![Downloads per Week](https://img.shields.io/npm/dw/mocha-typescript.svg)](https://www.npmjs.com/package/mocha-typescript)
[![Dependencies](https://img.shields.io/librariesio/github/pana-cc/mocha-typescript.svg)](https://libraries.io/npm/mocha-typescript)
[![Issues](https://img.shields.io/github/issues/pana-cc/mocha-typescript.svg)](https://github.com/pana-cc/mocha-typescript/issues)
[![Pull Requests](https://img.shields.io/github/issues-pr/pana-cc/mocha-typescript.svg)](https://github.com/pana-cc/mocha-typescript/pulls)
[![Travis Build Status](https://img.shields.io/travis/pana-cc/mocha-typescript/master.svg)](https://travis-ci.org/pana-cc/mocha-typescript)
[![Appveyor Build Status](https://img.shields.io/appveyor/ci/silkentrance/mocha-typescript.svg)](https://ci.appveyor.com/project/silkentrance/mocha-typescript)
![Apache 2.0 License](https://img.shields.io/npm/l/mocha-typescript.svg)

## Dependency Injection / Inversion of Control

mocha-typescript supports dependency injection, with built-in support for the typedi IOC.

### Custom IOC Registration

Custom IOCs can be registered using the `registerDI` function.

```Typescript
import "reflect-metadata";
import { Container } from "typedi";
import { registerDI } from "mocha-typescript";

registerDI({
    handles: (cls) => true,
    create: (cls) => Container.get(cls),
});
```

You can implement the ``handles`` method in case that you are using multiple IOCs or need to make sure that only
specific types will be recognised, e.g. types that have been annotated using a specific annotation only.

### typedi

Using the built-in support for typedi is easy and requires only a few extra steps.

- Configure `tsconfig.json` so that decorator metadata gets emitted during compile.

  ```json
  {
    "compilerOptions": {
      "emitDecoratorMetadata": true
    }  
  }
  ```

- Import `mocha-typescript/di/typedi` in your test or require it in your mocha.opts.

  ```
  --require mocha-typescript/di/typedi
  ```

#### Example

```TypeScript
import { assert } from "chai";
import { Service } from "typedi";
import "mocha-typescript/di/typedi";
import { suite, test } from "mocha-typescript";

@Service()
class Add {

  public do(a: number, b: number) {
    return a + b;
  }
}

@suite
class TypeDITest {

  // typedi will resolve `add` here to an instance of the `Add` service.
  constructor(public add: Add) { }
  
  @test
  public "test linear function"() {

    assert.equal(this.add.do(1, 2), 3);
  }
}
```
