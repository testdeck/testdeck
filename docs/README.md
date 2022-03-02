# testdeck

The JavaScript OOP style tests!

``` typescript
import { suite, test } from "@testdeck/mocha";
```
{: .mocha}

``` typescript
import { suite, test } from "@testdeck/jest";
```
{: .jest}

``` typescript
import { suite, test } from "@testdeck/jasmine";
```
{: .jasmine}

``` typescript
// Switch gears from functional:
describe("Hello", () => {
  it("world", () => {
    expect(false).to.be.true;
  });
});

// To pure OOP awesomeness:
@suite class Hello {
  @test world() {
    assert(false == true);
  }
}

// And you can mix and match!
```
