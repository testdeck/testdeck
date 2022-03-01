---
layout: guide
section: guide
role: page
order: 40
toc: true
title: Suite Inheritance
label: Suite Inheritance
description: |
  Suite Inheritance
---

{:.toc}
## Suite Inheritance

In addition to [nesting](/pages/guide/nested), `testdeck` supports inheritance. And while you may not inherit from
concrete suites, i.e. those that have been decorated with the `@suite` decorator, you can build yourself test base class
hierarchies that provide tests. And, using proper chaining, you can even override existing 
[lifecycle hooks](/pages/guide/advanced_suite#static-lifecycle-hooks---).


{:.toc}
### Why Limitations On Inheritance?

Deriving from other concrete suites will be detected by `testdeck` and will be reported as an error.

The rationale behind this is that under the hood, for each `@suite` annotated class, `describe` will be called, which 
then will be passed a callback function that will then do the rest, e.g. register tests, run lifecycle hooks and so on.

Inheriting from another `@suite` annotated class will run this process twice, once for the super class and a second
time for the child class. And this is something that we do not want to happen.

So don't do this.

{% include sample_code/mocha-inheritance-limitations.html %}


{:.toc}
## Putting Inheritance to Test

`TypeScript` allows you to define abstract classes that you can use for establishing a common test framework for your
concrete tests to build upon, so we recommend using these as it is more clean approach to OO than inheriting from a 
concrete class. Since the ECMAScript language specification does not support abstract classes yet, you are absolutely
fine subclassing concrete classes, too. For the course of this guide we will stick to abstract classes, though.

For starters you might want to have a look at our original `mocha-typescript` 
[test sources](https://github.com/testdeck/testdeck/tree/legacy/mocha-typescript/packages/%40testdeck/mocha/test/it).
Not so much for the poor performance of the tests, mind you, but from reading through the sources, you might get some
ideas on what inheritance can do for you.

{% include sample_code/mocha-simple-inherited-suite.html %}


{:.toc}
## Static Lifecycle Hook Chaining

Static lifecycle hooks are inherited. So if your super class provides a static lifecycle hook, then your child class
will have that hook and you might want to consider overriding it.

However, chaining static asynchronous lifecycle hooks is not so straight forward as one might think.

{% include sample_code/mocha-lifecycle-chaining-callback-style.html isStatic=true %}

{% include sample_code/mocha-lifecycle-chaining-promise-style.html isStatic=true %}

{% include sample_code/mocha-lifecycle-chaining-async-await-style.html isStatic=true %}


{:.toc}
## Instance Lifecycle Hook Chaining

Instance lifecycle hooks are inherited. So if your super class provides an instance lifecycle hook, then your child
class will have that hook and you might want to consider overriding it.

The below code is basically the same as shown in [Static Lifecycle Hook Chaining](#static-lifecycle-hook-chaining),
except for the scope of the hook methods.

{% include sample_code/mocha-lifecycle-chaining-callback-style.html isStatic=false %}

{% include sample_code/mocha-lifecycle-chaining-promise-style.html isStatic=false %}

{% include sample_code/mocha-lifecycle-chaining-async-await-style.html isStatic=false %}
