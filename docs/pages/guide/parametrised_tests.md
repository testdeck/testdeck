---
layout: guide
section: guide
role: page
order: 70
toc: true
title: Parametrised Tests
label: Parametrised Tests
description: |
  Parametrised Tests
---

{:.toc}
## Parametrised Tests

{% highlight TypeScript linenos %}
import { suite, params } from '@testdeck/mocha';

@suite
class Suite {

  @params({ arg1: 'foo', arg2: 'bar' })
  @params({ arg1: 'bar', arg2: 'foo' }, 'custom test name')
  test({ arg1, arg2 }) {
  }
}
{% endhighlight %}

### Run Tests

{% highlight shell %}
npm test

...

  Suite
    test
      ✓ test 0
      ✓ custom test name

...
{% endhighlight %}


{:.toc}
## Parametrised Test Naming {% include support-all.html %}

{% highlight TypeScript linenos %}
import { suite, params } from '@testdeck/mocha';

@suite
class Suite {

  @params({ arg1: 'foo', arg2: 'bar' }, 'a custom test name')
  @params({ arg1: 'bar', arg2: 'foo' })
  @params.naming(({ arg1, arg2 }) => `test foobar against ${arg1} and ${arg2}`)
  test({ arg1, arg2 }) {
  }
}
{% endhighlight %}

### Run Tests

{% highlight shell %}
npm test

...

  Suite
    test
      ✓ a custom test name
      ✓ test foobar against bar and foo
      
...
{% endhighlight %}


{:.toc}
## Pending Parameter Sets {% include support-all.html %}

{% highlight TypeScript linenos %}
import { suite, params } from '@testdeck/mocha';

@suite
class Suite {

  @params({ arg1: 'foo', arg2: 'bar' })
  @params.pending({ arg1: 'bar', arg2: 'foo' }, 'SUT does not yet support this')
  "test foobar against parameters"({ arg1, arg2 }) {
  }
}
{% endhighlight %}

### Run Tests

{% highlight shell %}
npm test

...

  Suite
    test foobar against parameters
      ✓ test foobar against parameters 0
      - SUT does not yet support this

...
{% endhighlight %}


{:.toc}
## Skipping Parameter Sets {% include support-all.html %}

{% highlight TypeScript linenos %}
import { suite, params } from '@testdeck/mocha';

@suite
class Suite {

  @params({ arg1: 'foo', arg2: 'bar' })
  @params.skip({ arg1: 'bar', arg2: 'foo' }, 'test fails on this, no time fixing')
  test({ arg1, arg2 }) {
  }
}
{% endhighlight %}

### Run Tests

{% highlight shell %}
npm test

...

  Suite
    test
      ✓ test 0
      - test fails on this, no time fixing

...
{% endhighlight %}


{:.toc}
## Focused Parameter Set Testing {% include support-all.html %} 

{% highlight TypeScript linenos %}
import { suite, params } from '@testdeck/mocha';

@suite
class Suite {

  @params({ arg1: 'foo', arg2: 'bar' })
  @params.only({ arg1: 'bar', arg2: 'foo' }, 'should be fixed now...')
  test({ arg1, arg2 }) {
  }
}
{% endhighlight %}

### Run Tests

{% highlight shell %}
npm test

...

  Suite
    test
      ✓ should be fixed now...

...
{% endhighlight %}
