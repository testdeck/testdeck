# testdeck

The JavaScript OOP style tests!

``` TypeScript
// Use one of the mocha/jest/jasmine test runners:
import { suite, test } from "@testdeck/mocha";
import { suite, test } from "@testdeck/jest";
import { suite, test } from "@testdeck/jasmine";

import { expect } from 'chai';

// And turn your tests from functional:
describe("Hello", function() {
  it("world", function() {
    expect(false).to.be.true;
  });
});

// Into 100% OOP awesomeness:
@suite class Hello {
  @test world() {
    expect(false).to.be.true;
  }
}

// P.S. You can still mix and match!
```
