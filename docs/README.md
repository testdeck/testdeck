# testdeck

The JavaScript OOP style tests!

<div class="mocha">
``` typescript
import { suite, test } from "@testdeck/mocha";
import { expect } from 'chai';

// Turn your tests from functional:
describe("Hello", function() {
  it("world", function() {
    expect(false).to.be.true;
  });
});

// Into pure OOP awesomeness:
@suite class Hello {
  @test world() {
    expect(false).to.be.true;
  }
}

// Yes, you can mix and match!
```
</div>

<div class="jest">
``` typescript
import { suite, test } from "@testdeck/jest";
import { expect } from 'chai';

// Turn your tests from functional:
describe("Hello", function() {
  it("world", function() {
    expect(false).to.be.true;
  });
});

// Into pure OOP awesomeness:
@suite class Hello {
  @test world() {
    expect(false).to.be.true;
  }
}

// Yes, you can mix and match!
```
</div>
<div class="jasmine">
``` typescript
import { suite, test } from "@testdeck/jasmine";
import { expect } from 'chai';

// Turn your tests from functional:
describe("Hello", function() {
  it("world", function() {
    expect(false).to.be.true;
  });
});

// Into pure OOP awesomeness:
@suite class Hello {
  @test world() {
    expect(false).to.be.true;
  }
}

// Yes, you can mix and match!
```
</div>