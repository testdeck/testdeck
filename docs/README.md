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

Pure OOP TypeScript testing
``` typescript
@suite class Hello {
  @test world() {
    assert(false);
  }
}
```

Compatible with functional TDD interfaces
``` typescript
suite("Hello", () => {
  test("world", () => {
    assert(false);
  }
});
```
