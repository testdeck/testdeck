---
layout: guide
section: guide
role: page 
order: 50
toc: true
title: Tests
label: Tests
description: |
  Tests
---

{:.toc}
## Tests

With `testdeck` you author tests by decorating methods of your suite with the `@test` decorator.

And when using [inheritance](/pages/guide/inheritance#simple-inheritance) you are also able to inherit common tests 
for a family of SUTs.


{:.toc}
## Synchronous Tests

{% highlight TypeScript linenos %}
import { suite, test } from '@testdeck/mocha';
import { assert } from 'chai';

@suite
class Suite {

  @test
  test() {

    assert.isOk(false);  
  }
}
{% endhighlight %}

### Run Tests

{% highlight shell %}
npm test

...

  Suite
    1) test

...

  1) Suite
       test:
     AssertionError: expected false to be truthy

...
{% endhighlight %}


{:.toc}
## Asynchronous Tests

As with [chaining of asynchronous lifecycle hooks](/pages/guide/inheritance#static-lifecycle-hook-chaining), writing 
asynchronous tests is also somewhat more inclined.


{:.toc}
### Callback Style

{% highlight TypeScript linenos %}
import { suite, test } from '@testdeck/mocha';
import { assert } from 'chai';

function asyncSUT(cb) {

  setTimeout(() => cb(null, false), 100);
}

@suite
class Suite {

  @test
  test(done) {

    asyncSUT((err, res) => {

      if (err) {

        // expected error testing anyone?
        return done(err);
      }

      try {

        assert.isOk(res);

        return done();
      } catch (ex) {

        // we want the test to fail with the assertion error and not just due
        // to some timeout because done was not called back in time
        return done(ex);
      }
    });
  }
}
{% endhighlight %}

#### Run Tests

{% highlight shell %}
npm test

...

  Suite
    1) test

...

  1) Suite
       test:
     AssertionError: expected false to be truthy

...
{% endhighlight %}


{:.toc}
### Promise Style

{% highlight TypeScript linenos %}
import { suite, test } from '@testdeck/mocha';
import { assert } from 'chai';

function asyncSUT(): Promise<any> {

  return Promise.resolve(false);
}

@suite
class Suite {

  @test
  test() {

    return asyncSUT().then((res) => {
    
      assert.isOk(res);
    }, (err) => {
    
      // expected error testing anyone?
      // ...
    });  
  }
}
{% endhighlight %}

#### Run Tests

{% highlight shell %}
npm test

...

  Suite
    1) test

...

  1) Suite
       test:
     AssertionError: expected false to be truthy

...
{% endhighlight %}


{:.toc}
### Async/Await Style

{% highlight TypeScript linenos %}
import { suite, test } from '@testdeck/mocha';
import { assert } from 'chai';

async function asyncSUT(): Promise<any> {

  return Promise.resolve(false);
}

@suite
class Suite {

  @test
  async test() {

    let res;
    
    try {
    
      res = await asyncSUT();
    } catch (ex) {

      // expected exception testing anyone?    
      // ...
      return;
    }

    // we would not want to run these assertions in above try because otherwise we would 
    // have to filter them or use a nested try/catch/rethrow
    assert.isOk(res);
  }
}
{% endhighlight %}

#### Run Tests

{% highlight shell %}
npm test

...

  Suite
    1) test

...

  1) Suite
       test:
     AssertionError: expected false to be truthy

...
{% endhighlight %}
