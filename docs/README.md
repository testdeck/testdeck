# testdeck

The JavaScript OOP style tests!

<div class="mocha">
``` typescript
import { suite, test } from "@testdeck/mocha";
```
</div>
<div class="jest">
``` typescript
import { suite, test } from "@testdeck/jest";
```
</div>
<div class="jasmine">
``` typescript
import { suite, test } from "@testdeck/jasmine";
```
</div>

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
