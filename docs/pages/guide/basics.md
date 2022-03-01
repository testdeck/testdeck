---
layout: guide
section: guide
role: page 
order: 10
toc: true
title: Basics
label: Basics
description: |
  Testdeck Basics
---

{:.toc}
## Preliminaries

You should have set up your package as shown in [Setup](/pages/guide/setup).

For the course of this tutorial we will be using `@testdeck/mocha`. So you might want to replace this with your favorite
test framework instead.

Also, we will use the expectation framework provided by Chai.js, so that you can easily migrate the provided example code
to either `@testdeck/jasmine` or `@testdeck/jest`.

Also, the existing examples will focus on `TypeScript` but we try to keep as simple as possible to allow for easy adoption
to for example `Babel`.


{:.toc}
## Add Source QueryService

This is our system under test, or as some might call it, the CUT, or class under test.

SUT represents a simple QueryService that runs a query by a QueryExecutor implementation. For testing purposes, we can
easily exchange the default implementation by a custom one in order to for example induce errors into the system or
return test specific results.

{% highlight TypeScript linenos %}
export interface QueryExecutor {

    executeQuery(query: {}): Promise<any>;
}

export interface QueryServiceConfig {

  executor?: QueryExecutor;
}

// while this should be testable, too, we will not go to lengths here
class DefaultQueryExecutorImpl implements QueryExecutor {

    public executeQuery(query: {}): Promise<any> {
    
        return Promise.resolve({});
    }
}

export default class QueryService {

  private _isRunning: boolean;
  
  public get isRunning() {
  
    return this._isRunning;
  }
  
  private constructor(private readonly executor: QueryExecutor) {
  
    this._isRunning = false;
  }
  
  public static fromConfig(config: QueryServiceConfig) {
  
    return new QueryService(config.executor || new DefaultQueryExecutorImpl());
  }

  public start() {

    this._isRunning = true;
  }  

  public stop() {

    this._isRunning = false;
  }
  
  public queryAsync1(query: {}, cb: Function) {

    if (!this.isRunning) {
    
      return cb(new Error('not running'), null);
    }
    
    this.executor.executeQuery(query)
      .then((result) => {

        cb(null, result);
      }, (err) => {

        cb(err, null);
      });
  }

  public queryAsync2(query: {}): Promise<any> {

     if (!this.isRunning) {
     
        return Promise.reject(new Error('not running'));
     }

     return this.executor.executeQuery(query);
  }

  public async queryAsync3(query: {}): Promise<any> {

     if (!this.isRunning) {
     
        return Promise.reject(new Error('not running'));
     }

     return this.executor.executeQuery(query);
  }
}
{% endhighlight %}


{:.toc}
## Add Suite QueryServiceTests

Let's create an empty test suite first.

Please note that we will not develop our SUT in a TDD/BDD way while we implement our tests. This is both to keep things
as compact as possible and this not being a tutorial on how to apply TDD/BDD. 

{% highlight TypeScript linenos %}
import { suite, test } from '@testdeck/mocha';
import { expect } from 'chai';

import QueryService from '../src/QueryService';

@suite
class QueryServiceTests {

}
{% endhighlight %}


{:.toc}
## Add Basic Behaviour Tests

We now add an initial set of tests for the basic behaviour of the SUT.

{% highlight TypeScript linenos %}
// ...

@suite
class QueryServiceTests {

  // ...

  @test
  isRunningMustReturnFalseByDefault() {
  
     const sut = QueryService.fromConfig({});
     
     expect(sut.isRunning).to.be.false;
  }

  @test
  isRunningMustReturnTrueAfterStartWasCalled() {
  
     const sut = QueryService.fromConfig({});
     
     sut.start();
     expect(sut.isRunning).to.be.true;
  }

  @test
  isRunningMustReturnFalseAfterStopWasCalled() {
  
     const sut = QueryService.fromConfig({});
     
     sut.start();
     sut.stop();
     expect(sut.isRunning).to.be.false;
  }
  
  @test
  fromConfigMustFailOnWronglyConfiguredExecutor(done) {
  
    // well, we lied, there is a FIXME here somewhere...
    try {
    
      const sut = QueryService.fromConfig({
        executor: {
          executeQuery: null
        }
      });
      
      done(new Error('query service failed to detect invalid config'));
    } catch (err) {
    
      done();      
    }
  }
}
{% endhighlight %}

## Run Tests

{% highlight shell %}
npm test

> nyc mocha

  QueryServiceTests
    ✓ isRunningMustReturnFalseByDefault
    ✓ isRunningMustReturnTrueAfterStartWasCalled
    ✓ isRunningMustReturnFalseAfterStopWasCalled
    1) fromConfigMustFailOnWronglyConfiguredExecutor

  3 passing (1s)
  1 failing

  1) QueryServiceTests
       fromConfigMustFailOnWronglyConfiguredExecutor:
     Error: query service failed to detect invalid config
      at QueryServiceTests.fromConfigMustFailOnWronglyConfiguredExecutor (test/QueryServiceTests.ts:48:12)
      at Context.fromConfigMustFailOnWronglyConfiguredExecutor (node_modules/@testdeck/core/dist/index.js:153:39)
{% endhighlight %}

Nice, as expected the configuration was invalid and QueryService failed to detect this.


{:.toc}
## Add #queryAsync1() Behaviour Tests

{% highlight TypeScript linenos %}
// ...

@suite
class QueryServiceTests {

  // ...

  @test
  queryAsync1MustFailWhenNotStarted(done) {
  
    const sut = QueryService.fromConfig({});
    
    sut.queryAsync1({}, (err, result) => {
    
      try {
      
        expect(result).to.be.null;
        expect(err).to.not.be.null;
        expect(err.toString()).to.contain('not running');
        done();
      } catch (ex) {

        done(ex);  
      }
    });
  }
  
  @test
  queryAsync1MustSucceedWhenStartedAndEverythingWorkingAsExpected(done) {
  
    const sut = QueryService.fromConfig({});
    
    sut.start();
    sut.queryAsync1({}, (err, result) => {
    
      try {
      
        expect(err).to.be.null;
        expect(result).to.not.be.null;
        expect(result).to.deep.equal({});
        done();
      } catch (ex) {

        done(ex);    
      }
    });
  }

  @test
  queryAsync1MustFailOnErrorByExecutor(done) {
  
    const sut = QueryService.fromConfig({
      executor: {
        executeQuery: function(query: {}): Promise<any> {
        
          return Promise.reject(new Error('remote unavailable'));
        }
      }
    });

    sut.start();
    sut.queryAsync1({}, (err, result) => {
    
      try {
      
        expect(result).to.be.null;
        expect(err).to.not.be.null;
        expect(err.toString()).to.contain('remote unavailable');
        done();
      } catch (ex) {

        done(ex);     
      }
    });  
  }
}
{% endhighlight %}

## Run Tests

{% highlight shell %}
npm test

> nyc mocha

...

    ✓ queryAsync1MustFailWhenNotStarted
    ✓ queryAsync1MustSucceedWhenStartedAndEverythingWorkingAsExpected
    ✓ queryAsync1MustFailOnErrorByExecutor

...
{% endhighlight %}


{:.toc}
## Add #queryAsync2() Behaviour Tests

{% highlight TypeScript linenos %}
// ...

@suite
class QueryServiceTests {

  // ...

  @test
  queryAsync2MustFailWhenNotStarted() {
  
    const sut = QueryService.fromConfig({});
    
    return sut.queryAsync2({})
      .then((result) => {
      
        expect.fail('must not have been called');
      }, (err) => {
      
        expect(err).to.not.be.null;
        expect(err.toString()).to.contain('not running'));
      }); 
  }

  @test
  queryAsync2MustSucceedWhenStartedAndEverythingWorkingAsExpected() { 
  
    const sut = QueryService.fromConfig({});
    
    sut.start();
    return sut.queryAsync2({})
      .then((result) => {
      
        expect(result).to.not.be.null;
        expect(result).to.deep.equal({});
      }, (err) => {
      
        expect.fail('must not have been called');
      }); 
  }
  
  @test
  queryAsync2MustFailOnErrorByExecutor() {
  
    const sut = QueryService.fromConfig({
      executor: {
        executeQuery: function(query: {}): Promise<any> {
        
          return Promise.reject(new Error('remote unavailable'));
        }
      }
    });

    sut.start();
    return sut.queryAsync2({})
      .then((result) => {
      
        expect.fail('must not have been called');
      }, (err) => {
      
        expect(err).to.not.be.null;
        expect(err.toString()).to.contain('remote unavailable'));
      });
  }
}
{% endhighlight %}

## Run Tests

{% highlight shell %}
...

    ✓ queryAsync2MustFailWhenNotStarted
    ✓ queryAsync2MustSucceedWhenStartedAndEverythingWorkingAsExpected
    ✓ queryAsync2MustFailOnErrorByExecutor
    
...
{% endhighlight %}

{:.toc}
## Add #queryAsync3() Behaviour Tests

{% highlight TypeScript linenos %}
// ...

@suite
class QueryServiceTests {

  // ...
  
  @test
  async queryAsync3MustFailWhenNotStarted() {
    
    const sut = QueryService.fromConfig({});
    
    try {
    
      const result = await sut.queryAsync3({});
      
      expect.fail('error expected');
    } catch (err) {
    
      expect(err.toString()).to.contain('not running');
    }
  }

  @test
  async queryAsync3MustSucceedWhenStartedAndEverythingWorkingAsExpected() {
   
    const sut = QueryService.fromConfig({});

    sut.start();    

    try {

      const result = await sut.queryAsync3({});
      
      expect(result).to.deep.equal({});
    } catch (err) {
    
      expect.fail(err.toString());
    }
  }
  
  @test
  async queryAsync3MustFailOnErrorByExecutor() {
  
    const sut = QueryService.fromConfig({
      executor: {
        executeQuery: function(query: {}): Promise<any> {
        
          return Promise.reject(new Error('remote unavailable'));
        }
      }
    });

    sut.start();    

    try {
    
      const result = await sut.queryAsync3({});
      expect.fail('should not have succeeded');
    } catch (err) {
    
      expect(err.toString()).to.contain('remote unavailable');
    }
  }
}
{% endhighlight %}

## Run Tests

{% highlight shell %}
...

    ✓ queryAsync3MustFailWhenNotStarted
    ✓ queryAsync3MustSucceedWhenStartedAndEverythingWorkingAsExpected
    ✓ queryAsync3MustFailOnErrorByExecutor
    
...
{% endhighlight %}
