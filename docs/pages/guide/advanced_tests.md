---
layout: guide
section: guide
role: page
order: 60
toc: true
title: Advanced Tests
label: Advanced Tests
description: |
  Advanced Tests
---

{:.toc}
## Advanced Tests

{:.toc}
## Test Execution Options

{% highlight TypeScript linenos %}
import { suite, test, retries, slow, timeout } from '@testdeck/mocha';

@suite
class Suite {

  @test(retries(5))
  @timeout(1500)
  retried(done) {
  
    setTimeout(done, 1800);
  }
  
  @test(slow(1000), timeout(2000))
  slow(done) {
  
    setTimeout(done, 1500);
  }
}
{% endhighlight %}


{:.toc}
### retries {% include support-mocha.html %}

`retries` can be used as either a decorator or passed as a parameter to the `@test` decorator.

{% highlight TypeScript linenos %}
import { suite, test, retries } from '@testdeck/mocha';

@suite
class Suite {

  @test(retries(2))
  @retries(2)
  retried() {
  
    throw new Error('failed');
  }
}
{% endhighlight %}


{:.toc}
### slow {% include support-mocha.html %}

`slow` can be used as either a decorator or passed as a parameter to the `@test` decorator.

{% highlight TypeScript linenos %}
import { suite, test, slow } from '@testdeck/mocha';

@suite
class Suite {

  @test(slow(2000))
  @slow(2000)
  slow(done) {
  
    setTimeout(done, 2100);
  }
}
{% endhighlight %}


{:.toc}
### timeout {% include support-all.html %}

`timeout` can be used as either a decorator or passed as a parameter to the `@test` decorator.

{% highlight TypeScript linenos %}
import { suite, test, timeout } from '@testdeck/mocha';

@suite
class Suite {

  @test(timeout(3000))
  @timeout(3000)
  timeout(done) {
  
    setTimeout(done, 3500);
  }
}
{% endhighlight %}


{:.toc}
## Test Naming {% include support-all.html %}

{% highlight TypeScript linenos %}
import { suite, test } from '@testdeck/mocha';

@suite
class Suite {

  @test('a custom name for the test')
  test() {
  }
  
  @test 'alternate naming'() {
  }
}
{% endhighlight %}


{:.toc}
## Pending Tests {% include support-all.html %}

A test can be marked as pending.

The `@pending` decorator takes an optional boolean parameter. That way one can make individual tests pending based on
a given condition.

{% highlight TypeScript linenos %}
import { suite, test, pending } from '@testdeck/mocha';

@suite
class Suite {

  @test.pending
  pending() {
  }
  
  @test
  @pending
  alsoPending() {
  }
  
  @test
  @pending(isCondition)
  conditionallyPending() {
  }
}
{% endhighlight %}


{:.toc}
## Skipping Tests {% include support-all.html %}

A test can be marked for being skipped.

The `@skip` decorator takes an optional boolean parameter. That way one can make individual tests skip based on
a given condition.

{% highlight TypeScript linenos %}
import { suite, test, skip } from '@testdeck/mocha';

@suite
class Suite {

  @test.skip
  skipped() {
  }
  
  @test
  @skip
  alsoSkipped() {
  }
  
  @test
  @skip(isCondition)
  conditionallySkipped() {
  }
}
{% endhighlight %}


{:.toc}
## Focused Tests {% include support-all.html %}

A test can be marked as focused.

The `@only` decorator takes an optional boolean parameter. That way one can make individual focused based on
a given condition.

{% highlight TypeScript linenos %}
import { suite, test, only } from '@testdeck/mocha';

@suite
class Suite {

  @test.only
  focused() {
  }
  
  @test
  @only
  alsoFocused() {
  }
  
  @test
  @only(isCondition)
  conditionallyFocused() {
  }
}
{% endhighlight %}
