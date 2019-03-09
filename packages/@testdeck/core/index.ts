export class ClassTestUI {
  /**
   * This is supposed to create a `Symbol(key)` but some platforms does not support Symbols yet so fallback to string keys for now.
   * @param key 
   */
  protected static MakeSymbol(key: string) { return "__testdeck_" + key; }

  private static readonly suiteSymbol = ClassTestUI.MakeSymbol("suite");
  private static readonly testNameSymbol = ClassTestUI.MakeSymbol("test");
  private static readonly parametersSymbol = ClassTestUI.MakeSymbol("parametersSymbol");
  private static readonly nameForParametersSymbol = ClassTestUI.MakeSymbol("nameForParameters");
  private static readonly slowSymbol = ClassTestUI.MakeSymbol("slow");
  private static readonly timeoutSymbol = ClassTestUI.MakeSymbol("timeout");
  private static readonly retriesSymbol = ClassTestUI.MakeSymbol("retries");
  private static readonly onlySymbol = ClassTestUI.MakeSymbol("only");
  private static readonly pendingSymbol = ClassTestUI.MakeSymbol("pending");
  private static readonly skipSymbol = ClassTestUI.MakeSymbol("skip");
  private static readonly traitsSymbol = ClassTestUI.MakeSymbol("traits");
  private static readonly isTraitSymbol = ClassTestUI.MakeSymbol("isTrait");
  private static readonly contextSymbol = ClassTestUI.MakeSymbol("context");

  public readonly runner: TestRunner;

  public readonly suite: SuiteDecorator;
  public readonly test: TestDecorator;

  public readonly slow: ExecutionOption;
  public readonly timeout: ExecutionOption;
  public readonly retries: ExecutionOption;

  public readonly pending: ExecutionModifier;
  public readonly only: ExecutionModifier;
  public readonly skip: ExecutionModifier;

  public readonly params: ParameterisedTestDecorator;

  public readonly context: PropertyDecorator;

  private readonly dependencyInjectionSystems: DependencyInjectionSystem[] = [{
    handles() { return true; },
    create<T>(cls: TestClass<T>) {
      return new cls();
    }
  }];

  public constructor(runner: TestRunner) {
    this.runner = runner;

    this.suite = this.makeSuiteObject();
    this.test = this.makeTestObject();
    this.params = this.makeParamsObject();

    this.slow = this.createNumericBuiltinTrait(ClassTestUI.slowSymbol, (context, value) => this.runner.setSlow(context, value));
    this.timeout = this.createNumericBuiltinTrait(ClassTestUI.timeoutSymbol, (context, value) => this.runner.setTimeout(context, value));
    this.retries = this.createNumericBuiltinTrait(ClassTestUI.retriesSymbol, (context, value) => this.runner.setRetries(context, value));

    this.pending = this.createExecutionModifier(ClassTestUI.pendingSymbol);
    this.only = this.createExecutionModifier(ClassTestUI.onlySymbol);
    this.skip = this.createExecutionModifier(ClassTestUI.skipSymbol);

    this.context = function context(target: Object, propertyKey: string): void {
      target[ClassTestUI.contextSymbol] = propertyKey;
    };
  }

  /**
   * Register a dependency injection system to be used when instantiating test classes.
   * @param instantiator The dependency injection system implementation.
   */
  public registerDI(instantiator: DependencyInjectionSystem) {
    // Maybe check if it is not already added?
    /* istanbul ignore else */
    if (!this.dependencyInjectionSystems.some((di) => di === instantiator)) {
      this.dependencyInjectionSystems.unshift(instantiator);
    }
  }

  /**
   * Declares the provided object as trait.
   */
  public trait<Arg extends SuiteTrait | TestTrait>(arg: Arg): Arg {
    arg[ClassTestUI.isTraitSymbol] = true;
    return arg;
  }

  // Things regarding suite, abstract in a separate class...
  private wrapNameAndToString(cb: (done?: Function) => any, innerFunction: Function): () => any {
    cb.toString = () => innerFunction.toString();
    Object.defineProperty(cb, "name", { value: innerFunction.name, writable: false });
    return cb;
  };

  private applyDecorators(context: RunnerSuiteType | RunnerTestType, ctorOrProto, method, instance) {
    const timeoutValue = method[ClassTestUI.timeoutSymbol];
    if (typeof timeoutValue === "number") {
      this.runner.setTimeout(context, timeoutValue);
    }
    const slowValue = method[ClassTestUI.slowSymbol];
    if (typeof slowValue === "number") {
      this.runner.setSlow(context, slowValue);
    }
    const retriesValue = method[ClassTestUI.retriesSymbol];
    if (typeof retriesValue === "number") {
      this.runner.setRetries(context, retriesValue);
    }
    const contextProperty = ctorOrProto[ClassTestUI.contextSymbol];
    if (contextProperty) {
      instance[contextProperty] = context;
    }
  }

  private applyTestTraits(context: RunnerTestType, instance: TestInstance, method: Function) {
    const traits: TestTrait[] = method[ClassTestUI.traitsSymbol];
    if (traits) {
      traits.forEach((trait) => {
        trait.call(context, context, instance, method);
      });
    }
  }

  private applySuiteTraits(context: RunnerSuiteType, target: TestInstance) {
    const traits: SuiteTrait[] = target[ClassTestUI.traitsSymbol];
    if (traits) {
      traits.forEach((trait) => {
        trait.call(context, context, target);
      });
    }
  }

  private getInstance<T>(testClass: TestClass<T>) {
    const di = this.dependencyInjectionSystems.find((di) => di.handles(testClass));
    const instance = di.create(testClass);
    return instance;
  }

  private suiteClassCallback<T extends TestInstance>(target: TestClass<T>) {
    const theTestUI = this;
    return function()  {
      theTestUI.applySuiteTraits(this, target);
      theTestUI.applyDecorators(this, target, target, target);
      let instance;
      if (target.before) {
        if (isAsync(target.before)) {
          theTestUI.runner.declareBeforeAll(function(done) {
            theTestUI.applyDecorators(this, target, target.before, target);
            return target.before(done);
          });
        } else {
          theTestUI.runner.declareBeforeAll(function() {
            theTestUI.applyDecorators(this, target, target.before, target);
            return target.before();
          });
        }
      }
      if (target.after) {
        if (isAsync(target.after)) {
          theTestUI.runner.declareAfterAll(function(done) {
            theTestUI.applyDecorators(this, target, target.after, target);
            return target.after(done);
          });
        } else {
          theTestUI.runner.declareAfterAll(function() {
            theTestUI.applyDecorators(this, target, target.after, target);
            return target.after();
          });
        }
      }
      const prototype = target.prototype;
      let beforeEachFunction: (() => any) | ((done: Function) => any);
      if (prototype.before) {
        if (isAsync(prototype.before)) {
          beforeEachFunction = theTestUI.wrapNameAndToString(function(this: RunnerTestType, done: Function) {
            instance = theTestUI.getInstance(target);
            theTestUI.applyDecorators(this, prototype, prototype.before, instance);
            return prototype.before.call(instance, done);
          }, prototype.before);
        } else {
          beforeEachFunction = theTestUI.wrapNameAndToString(function(this: RunnerTestType) {
            instance = theTestUI.getInstance(target);
            theTestUI.applyDecorators(this, prototype, prototype.before, instance);
            return prototype.before.call(instance);
          }, prototype.before);
        }
      } else {
        beforeEachFunction = function(this: RunnerTestType) {
          instance = theTestUI.getInstance(target);
        };
      }
      theTestUI.runner.declareBeforeEach(beforeEachFunction);

      let afterEachFunction: (() => any) | ((done: Function) => any);
      if (prototype.after) {
        if (isAsync(prototype.after)) {
          afterEachFunction = theTestUI.wrapNameAndToString(function(this: RunnerTestType, done) {
            try {
              theTestUI.applyDecorators(this, prototype, prototype.after, instance);
              return prototype.after.call(instance, done);
            } finally {
              instance = undefined;
            }
          }, prototype.after);
        } else {
          afterEachFunction = theTestUI.wrapNameAndToString(function(this: RunnerTestType) {
            try {
              theTestUI.applyDecorators(this, prototype, prototype.after, instance);
              return prototype.after.call(instance);
            } finally {
              instance = undefined;
            }
          }, prototype.after);
        }
      } else {
        afterEachFunction = function(this: RunnerTestType) {
          instance = undefined;
        };
      }
      theTestUI.runner.declareAfterEach(afterEachFunction);

      function runTest(prototype: any, method: Function) {
        const testName = method[ClassTestUI.testNameSymbol];
        const shouldSkip = method[ClassTestUI.skipSymbol] || prototype.constructor[ClassTestUI.skipSymbol];
        const shouldOnly = method[ClassTestUI.onlySymbol] || prototype.constructor[ClassTestUI.onlySymbol];
        const shouldPending = method[ClassTestUI.pendingSymbol];
        const parameters = method[ClassTestUI.parametersSymbol] as TestParams[];

        // assert testName is truthy
        if (parameters) {
          // we make the parameterised test a child suite so we can late bind the parameterised tests
          theTestUI.runner.declareTest(testName, function() {
            const nameForParameters = method[ClassTestUI.nameForParametersSymbol];
            parameters.forEach((parameterOptions, i) => {
              const { mark, name, params } = parameterOptions;

              let parametersTestName = `${testName}_${i}`;
              if (name) {
                parametersTestName = name;
              } else if (nameForParameters) {
                parametersTestName = nameForParameters(params);
              }

              const shouldSkipParam = shouldSkip || (mark === Mark.skip);
              const shouldOnlyParam = shouldOnly || (mark === Mark.only);
              const shouldPendingParam = shouldPending || (mark === Mark.pending);

              const testFunc = ((shouldPendingParam || shouldSkipParam) && theTestUI.runner.declareTestSkip)
                              || (shouldOnlyParam && theTestUI.runner.declareTestOnly)
                              || theTestUI.runner.declareTest;

              applyTestFunc(testFunc, parametersTestName, method, [params]);
            });
          });
        } else {
          const testFunc = ((shouldPending || shouldSkip) && theTestUI.runner.declareTestSkip)
                          || (shouldOnly && theTestUI.runner.declareTestOnly)
                          || theTestUI.runner.declareTest;

          applyTestFunc(testFunc, testName, method, []);
        }
      }

      function isAsync(method: Function): boolean {

        const isParameterised = method[ClassTestUI.parametersSymbol] !== undefined;
        const length = method.length;
        return (isParameterised && length > 1) || (!isParameterised && length > 0);
      }

      function applyTestFunc(testFunc: Function, testName: string, method: Function, callArgs: any[]) {
        if (isAsync(method)) {
          testFunc(testName, theTestUI.wrapNameAndToString(function(this: RunnerTestType, done) {
            theTestUI.applyDecorators(this, prototype, method, instance);
            theTestUI.applyTestTraits(this, instance, method);
            return method.call(instance, done, ...callArgs);
          }, method));
        } else {
          const t = testFunc(testName, theTestUI.wrapNameAndToString(function(this: RunnerTestType) {
            theTestUI.applyDecorators(this, prototype, method, instance);
            theTestUI.applyTestTraits(this, instance, method);
            return method.call(instance, ...callArgs);
          }, method));
        }
      }

      // collect all tests along the inheritance chain, allow overrides
      const collectedTests: { [key: string]: any[] } = {};
      let currentPrototype = prototype;
      while (currentPrototype !== Object.prototype) {
        Object.getOwnPropertyNames(currentPrototype).forEach((key) => {
          if (typeof prototype[key] === "function") {
            const method = prototype[key];
            if (method[ClassTestUI.testNameSymbol] && !collectedTests[key]) {
              collectedTests[key] = [prototype, method];
            }
          }
        });
        currentPrototype = (Object as any).getPrototypeOf(currentPrototype);
        if (currentPrototype !== Object.prototype && currentPrototype.constructor[ClassTestUI.suiteSymbol]) {
          throw new Error(`@suite ${prototype.constructor.name} cannot be a subclass of @suite ${currentPrototype.constructor.name}.`);
        }
      }

      // run all collected tests
      for (const key in collectedTests) {
        const value = collectedTests[key];
        runTest(value[0], value[1]);
      }
    };
  }

  private makeSuiteObject(): SuiteDecorator {
    return Object.assign(this.makeSuiteFunction(this.suiteFuncCheckingDecorators()), {
      skip: this.makeSuiteFunction(() => this.runner.declareSuiteSkip),
      only: this.makeSuiteFunction(() => this.runner.declareSuiteOnly),
      pending: this.makeSuiteFunction(() => this.runner.declareSuitePending)
    });
  }

  private makeSuiteFunction<T extends TestInstance>(suiteFunc: (ctor: TestClass<T>) => Function) {
    const theTestUI = this;
    return this.suiteOverload({
      suiteCtor(ctor: TestClass<T>): void {
        ctor[ClassTestUI.suiteSymbol] = true;
        suiteFunc(ctor)(ctor.name, theTestUI.suiteClassCallback(ctor));
      },
      suiteDecorator(...traits: SuiteTrait[]): ClassDecorator {
        return function <TFunction extends Function>(ctor: TFunction): void {
          ctor[ClassTestUI.suiteSymbol] = true;
          ctor[ClassTestUI.traitsSymbol] = traits;
          suiteFunc(ctor as any)(ctor.name, theTestUI.suiteClassCallback(ctor as any));
        };
      },
      suiteDecoratorNamed(name: string, ...traits: SuiteTrait[]): ClassDecorator {
        return function <TFunction extends Function>(ctor: TFunction): void {
          ctor[ClassTestUI.suiteSymbol] = true;
          ctor[ClassTestUI.traitsSymbol] = traits;
          suiteFunc(ctor as any)(name, theTestUI.suiteClassCallback(ctor as any));
        };
      }
    });
  }

  private suiteFuncCheckingDecorators() {
    return <T extends TestInstance>(ctor: TestClass<T>) => {
      const shouldSkip = ctor[ClassTestUI.skipSymbol];
      const shouldOnly = ctor[ClassTestUI.onlySymbol];
      const shouldPending = ctor[ClassTestUI.pendingSymbol];
      return (shouldOnly && this.runner.declareSuiteOnly)
            || (shouldSkip && this.runner.declareSuiteSkip)
            || (shouldPending && this.runner.declareSuitePending)
            || this.runner.declareSuite;
    };
  }

  private suiteOverload<T extends TestInstance>({suiteCtor, suiteDecorator, suiteDecoratorNamed}: {
    suiteCtor(ctor: TestClass<T>): void;
    suiteDecorator(...traits: SuiteTrait[]): ClassDecorator;
    suiteDecoratorNamed(name: string, ...traits: SuiteTrait[]): ClassDecorator;
  }) {
    return function() {
      const args = [];
      for (let idx = 0; idx < arguments.length; idx++) {
        args[idx] = arguments[idx];
      }

      if (arguments.length === 1 && typeof arguments[0] === "function" && !arguments[0][ClassTestUI.isTraitSymbol]) {
        return suiteCtor.apply(this, args);
      }

      if (arguments.length >= 1 && typeof arguments[0] === "string") {
        return suiteDecoratorNamed.apply(this, args);
      }

      return suiteDecorator.apply(this, args);
    };
  }

  // Things regarding test, abstract in a separate class...
  private makeTestObject(): TestDecorator {
    return Object.assign(this.makeTestFunction(), {
      skip: this.makeTestFunction(ClassTestUI.skipSymbol),
      only: this.makeTestFunction(ClassTestUI.onlySymbol),
      pending: this.makeTestFunction(ClassTestUI.pendingSymbol)
    });
  }

  private makeTestFunction(mark: null | string | symbol = null) {
    return this.testOverload({
      testProperty(target: Object, propertyKey: string | symbol, descriptor?: PropertyDescriptor): void {
        target[propertyKey][ClassTestUI.testNameSymbol] = propertyKey.toString();
        if (mark) {
          target[propertyKey][mark] = true;
        }
      },
      testDecorator(...traits: TestTrait[]): PropertyDecorator & MethodDecorator {
        return function(target: Object, propertyKey: string | symbol, descriptor?: PropertyDescriptor): void {
          target[propertyKey][ClassTestUI.testNameSymbol] = propertyKey.toString();
          target[propertyKey][ClassTestUI.traitsSymbol] = traits;
          if (mark) {
            target[propertyKey][mark] = true;
          }
        };
      },
      testDecoratorNamed(name: string, ...traits: TestTrait[]): PropertyDecorator & MethodDecorator {
        return function(target: Object, propertyKey: string | symbol, descriptor?: PropertyDescriptor): void {
          target[propertyKey][ClassTestUI.testNameSymbol] = name;
          target[propertyKey][ClassTestUI.traitsSymbol] = traits;
          if (mark) {
            target[propertyKey][mark] = true;
          }
        };
      }
    });
  }

  private testOverload({testProperty, testDecorator, testDecoratorNamed}: {
    testProperty(target: Object, propertyKey: string | symbol, descriptor?: PropertyDescriptor): void;
    testDecorator(...traits: TestTrait[]): PropertyDecorator & MethodDecorator;
    testDecoratorNamed(name: string, ...traits: TestTrait[]): PropertyDecorator & MethodDecorator;
  }) {
    return function() {
      const args = [];
      for (let idx = 0; idx < arguments.length; idx++) {
        args[idx] = arguments[idx];
      }

      if (arguments.length >= 2 && typeof arguments[0] !== "string" && typeof arguments[0] !== "function") {
        return testProperty.apply(this, args);
      } else if (arguments.length >= 1 && typeof arguments[0] === "string") {
        return testDecoratorNamed.apply(this, args);
      } else {
        return testDecorator.apply(this, args);
      }
    };
  }

  private makeParamsFunction(mark: Mark) {
    return (params: any, name?: string) => {
      return (target: Object, propertyKey: string) => {
        target[propertyKey][ClassTestUI.testNameSymbol] = propertyKey.toString();
        target[propertyKey][ClassTestUI.parametersSymbol] = target[propertyKey][ClassTestUI.parametersSymbol] || [];
        target[propertyKey][ClassTestUI.parametersSymbol].push({ mark, name, params } as TestParams);
      };
    };
  }

  private makeParamsNameFunction() {
    return (nameForParameters: (parameters: any) => string) => {
      return (target: Object, propertyKey: string) => {
        target[propertyKey][ClassTestUI.nameForParametersSymbol] = nameForParameters;
      };
    };
  }

  private makeParamsObject() {
    return Object.assign(this.makeParamsFunction(Mark.test), {
      skip: this.makeParamsFunction(Mark.skip),
      only: this.makeParamsFunction(Mark.only),
      pending: this.makeParamsFunction(Mark.pending),
      naming: this.makeParamsNameFunction()
    });
  }

  /**
   * Create execution options such as `@slow`, `@timeout` and `@retries`.
   */
  private createNumericBuiltinTrait(key: any, fn: (ctx: RunnerSuiteType | RunnerTestType, value: number) => void): ExecutionOption {
    const classTestUIInstance = this;
    return function(value: number): ClassDecorator & MethodDecorator & SuiteTrait & TestTrait {
      return classTestUIInstance.trait(function() {
        if (arguments.length === 1) {
          // Class decorator
          const target = arguments[0];
          target[key] = value;
          return;
        }

        /* istanbul ignore if  */
        if (arguments.length === 2 && typeof arguments[1] === "string") {
          // PropertyDecorator, some TSC versions generated property decorators when decorating method
          const target = arguments[0];
          const property = arguments[1];
          target[property][key] = value;
          return;
        }

        if (arguments.length === 2) {
          // Class trait as retries in `@suite(repeat(2)) class X {}`
          const context: RunnerSuiteType = arguments[0];
          const ctor = arguments[1];
          fn(context, value);
          return;
        }

        if (arguments.length === 3 && typeof arguments[2] === "function") {
          // Metod trait as retries in `@suite class { @test(retries(4)) method() {} }`
          const context: RunnerTestType = arguments[0];
          const instance = arguments[1];
          const method = arguments[2];
          fn(context, value);
          return;
        }

        /* istanbul ignore else */
        if (arguments.length === 3 && typeof arguments[1] === "string") {
          // MethodDecorator
          const proto: RunnerTestType = arguments[0];
          const prop = arguments[1];
          const descriptor = arguments[2];
          proto[prop][key] = value;
          return;
        }

        // assert unreachable.
      });
    };
  }

  /**
   * Creates the decorators `@pending`, `@only`, `@skip`.
   */
  private createExecutionModifier(key: Symbol | string): ExecutionModifier {
    const decorator = function(target: Function | boolean, propertyKey?: string | symbol): any {
      if (typeof target === "undefined" || typeof target === "boolean") {
        if (target) {
          return decorator;
        } else {
          return () => {};
        }
      }
      if (arguments.length === 1) {
        target[key as any] = true;
      } else {
        target[propertyKey][key] = true;
      }
    };
    return decorator;
  }
}

type Done = (err?: any) => void;
export type MaybeAsyncCallback = (done?: Done) => void | Promise<void>;
declare type RunnerSuiteType = any;
declare type RunnerTestType = any;

/**
 * @deprecated
 */
export type SuiteTrait = (this: any, ctx: any, ctor: any) => void;
/**
 * deprecated
 */
export type TestTrait = (this: any, ctx: any, instance: any, method: any) => void;

interface SuiteDecoratorOrName extends ClassDecorator {
  (name?: string): ClassDecorator;

  /**
   * Traits were introduced to allow external implementations of mocha specific options.
   * This however increased imensly the complexity of the overload handling and is not applicable for other test runners.
   * @deprecated
   */
  (name?: SuiteTrait, ...traits: SuiteTrait[]): ClassDecorator;

  /**
   * Traits were introduced to allow external implementations of mocha specific options.
   * This however increased imensly the complexity of the overload handling and is not applicable for other test runners.
   * @deprecated
   */
  (trait: SuiteTrait, ...traits: SuiteTrait[]): ClassDecorator;
}

export interface SuiteDecorator extends SuiteDecoratorOrName {
  only: SuiteDecoratorOrName;
  skip: SuiteDecoratorOrName;
  pending: SuiteDecoratorOrName;
}

export interface TestDecoratorOrName extends MethodDecorator {
  (name?: string): MethodDecorator;
}

/**
 * The type of the `@test` decorator.
 * The decorator can be used as: `@test`, `@test()`, `@test("name")`, `@test.only`, `@test.only()`, `@test.only("name")`, etc.
 */
export interface TestDecorator extends TestDecoratorOrName {
  only: TestDecoratorOrName;
  skip: TestDecoratorOrName;
  pending: TestDecoratorOrName;
}

/**
 * After a `@suite` or `@test`,
 * these decortors can be used as `@slow(1000)`, `@timeout(2000)` and `@retries(3)`.
 * These can also be used as traits - such as `@suite(timeout(2000))`.
 */
export interface ExecutionOption {
  (value: number): ClassDecorator | MethodDecorator;
}

/**
 * An execution modifier decorators. Used to control which tests will be executed on test-run.
 * Decorators can be used as `@pending`, `@only` and `@skip`.
 * Or with condition: `@only(isWindows)`.
 */
export interface ExecutionModifier extends ClassDecorator, MethodDecorator {
  (condition: boolean): ClassDecorator | MethodDecorator;
}

export interface ParameterisedTestDecorator {
  (params: any, name?: string): MethodDecorator;
  skip(params: any, name?: string): MethodDecorator;
  only(params: any, name?: string): MethodDecorator;
  pending(params: any, name?: string): MethodDecorator;
  naming(nameForParameters: (params: any) => string): MethodDecorator;
}

export interface TestInstance {
  /**
   * An instance method, that if defined, is executed before every test method.
   */
  before?(done?: Done): void | Promise<void>;

  /**
   * An instance method, that if defined, is executed after every test method.
   */
  after?(done?: Done): void | Promise<void>;
}

export interface TestClass<T extends TestInstance> {
  new(...args: any[]): T;
  prototype: T;

  /**
   * A static method, that if defined, is executed once, before all test methods. 
   */
  before?(done?: Done): void | Promise<void>;

  /**
   * A static method, that if defined, is executed once, after all test methods.
   */
  after?(done?: Done): void | Promise<void>;
}

export interface DependencyInjectionSystem {
  handles<T>(cls: TestClass<T>): boolean;
  create<T>(cls: TestClass<T>): T;
}

const enum Mark { test, skip, only, pending }

interface TestParams {
  mark: Mark;
  name?: string;
  params: any;
}

/**
 * An adapter for a test runner that is used by the class syntax decorators based test ui.
 * 
 * For example the test:
 * ```TypeScript
   @suite class MyClass {
       @test myTest() {
       }
   }
   ```
 * Will call declareSuite with the name "MyClass" and a cb.
 * When that cb is called it will further call declareTest with the "myTest" name and a test function.
 * The test function when called will instantiate MyClass and call the myTest on that instance.
 */
export interface TestRunner {
  /**
   * Declare a test suite. For example:
   *  - For mocha and jest call "global.describe".
   * @param name The name of the suite.
   * @param cb A callback that will be executed and will declare child suites and tests.
   */
  declareSuite(name: string, cb: () => void);

  /**
   * Declare a test. For example:
   *  - for mocha and jest call "global.it".
   * @param name 
   * @param cb 
   */
  declareTest(name: string, cb: MaybeAsyncCallback);

  /**
   * Declares a suite, that is the only suite the runner should execute.
   * For example with the mocha runner these are declared as `describe.only("suite", cb)`.
   * These are very useful for development, when you want to focus on a single suite and reduce code change to test execution times.
   */
  declareSuiteOnly?(name: string, cb: () => void);

  declareSuiteSkip?(name: string, cb: () => void);

  declareSuitePending?(name: string, cb: () => void);

  /**
   * Declares a test, that is the only test the runner should execute.
   * For example with the mocha runner these are declared as `it.only("suite", cb)`.
   * hese are very useful for development, when you want to focus on a single suite and reduce code change to test execution times.
   */
  declareTestOnly?(name: string, cb: MaybeAsyncCallback);

  /**
   * For example:
   *  - For mocha call "global.it.skip"
   *  - For jasmine call "global.xit"
   * @param name The name of the suite.
   * @param cb A test callback thay may be provided.
   */
  declareTestSkip?(name: string, cb: MaybeAsyncCallback);

  /**
   * For example:
   *  - For mocha call "global.it" without argument
   *  - For jasmine call "global.xit"
   * @param name The name of the suite.
   * @param cb A test callback thay may be provided.
   */
  declareTestPending?(name: string);

  declareBeforeAll?(cb: MaybeAsyncCallback);
  declareBeforeEach?(cb: MaybeAsyncCallback);
  declareAfterAll?(cb: MaybeAsyncCallback);
  declareAfterEach?(cb: MaybeAsyncCallback);

  // TODO: I am sloppy here, before merge split on "setSuiteSlow" and "setTestSlow" pairs
  setSlow?(context: any, ms: number);
  setTimeout?(context: any, ms: number);
  setRetries?(context: any, attempts: number);
}
