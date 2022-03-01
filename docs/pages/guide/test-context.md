---
layout: guide
section: guide
role: page
order: 80
toc: true
title: Test Context
label: Test Context
description: |
  Test Context
---

{:.toc}
## Test Context

For functional mocha tests, the test and suite functions get a context passed as `this`. To obtain it in `@testdeck/mocha`, use the `context` symbol as follows:
{% highlight TypeScript lineos %}
import { suite, test, context } from "@testdeck/mocha";

@suite
class SuiteContext {

    static async before() {
        this[context].timeout(50);
    }

    @test
    testHasContext(done) {
        this[context].timeout(50);
    }
}
{% endhighlight %}
