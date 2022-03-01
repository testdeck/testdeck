---
layout: guide
section: guide
role: page
order: 20
toc: true
title: Nested Suites
label: Nested Suites
description: |
  Nested Suites
---

{:.toc}
## Nested Suites 

Just like your favourite test framework, `Testdeck` supports nested suites.

{% highlight TypeScript lineos %}
import { suite, test } from '@testdeck/jasmine';

describe('a suite', function() {

  describe('nested suite', function () {

    @suite
    class DeeplyNestedSuite {

      @test
      failingTest() {

        throw new Error('not implemented yet');
      }
    }
  });
});
{% endhighlight %}

{:.toc}
## The Power of Nesting

Nesting gives you the power of dynamically generating suites from, say, test fixtures.

{:.toc}
## Suite Inheritance

And while nesting is a powerful mechanism, we want to point out that there is also inheritance.

With `Testdeck` you can define (abstract) base classes from which your concrete test suites will inherit from, regardless
of the language used for implementing such tests.
And given other mechanisms such as `mixins`, you are free to make your test suites work as you need them to.

See [Suite Inheritance](/pages/guide/inheritance).
