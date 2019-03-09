import * as T from "../typings/index";

const enum Mark { test, skip, only, pending }

interface TestParams {
  mark: Mark;
  name?: string;
  params: any;
}

export class ClassTestUI<RunnerSuiteType, RunnerTestType> implements T.ClassTestUI<RunnerSuiteType, RunnerTestType> {
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

  public readonly runner: T.TestRunner<RunnerSuiteType, RunnerTestType>;

  public readonly suite: T.SuiteDecorator<RunnerSuiteType>;
  public readonly test: T.TestDecorator<RunnerTestType>;
  public readonly params: T.ParameterisedTestDecorator;

  public readonly slow: T.NumericDecoratorOrTrait<RunnerSuiteType, RunnerTestType>;
  public readonly timeout: T.NumericDecoratorOrTrait<RunnerSuiteType, RunnerTestType>;
  public readonly retries: T.NumericDecoratorOrTrait<RunnerSuiteType, RunnerTestType>;

  public readonly pending: T.ConditionalClassAndMethodDecorator;
  public readonly only: T.ConditionalClassAndMethodDecorator;
  public readonly skip: T.ConditionalClassAndMethodDecorator;

  public readonly context: PropertyDecorator;

  private readonly dependencyInjectionSystems: T.DependencyInjectionSystem[] = [{
    handles() { return true; },
    create<T>(cls: T.Class<T>) {
      return new cls();
    }
  }];

  public constructor(runner: T.TestRunner<RunnerSuiteType, RunnerTestType>) {
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
  public registerDI(instantiator: T.DependencyInjectionSystem) {
    // Maybe check if it is not already added?
    /* istanbul ignore else */
    if (!this.dependencyInjectionSystems.some((di) => di === instantiator)) {
      this.dependencyInjectionSystems.unshift(instantiator);
    }
  }

  /**
   * Declares the provided object as trait.
   */
  public trait<Arg extends T.SuiteTrait<RunnerSuiteType> | T.TestTrait<RunnerTestType>>(arg: Arg): Arg {
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

  private applyTestTraits(context: RunnerTestType, instance: T.SuiteProto, method: Function) {
    const traits: T.TestTrait<RunnerTestType>[] = method[ClassTestUI.traitsSymbol];
    if (traits) {
      traits.forEach((trait) => {
        trait.call(context, context, instance, method);
      });
    }
  }

  private applySuiteTraits(context: RunnerSuiteType, target: T.SuiteCtor) {
    const traits: T.SuiteTrait<RunnerSuiteType>[] = target[ClassTestUI.traitsSymbol];
    if (traits) {
      traits.forEach((trait) => {
        trait.call(context, context, target);
      });
    }
  }

  private getInstance<Type>(testClass: T.Class<Type>) {
    const di = this.dependencyInjectionSystems.find((di) => di.handles(testClass));
    const instance = di.create(testClass);
    return instance;
  }

  private suiteClassCallback(target: T.SuiteCtor) {
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

  private makeSuiteObject(): T.SuiteDecorator<RunnerSuiteType> {
    return Object.assign(this.makeSuiteFunction(this.suiteFuncCheckingDecorators()), {
      skip: this.makeSuiteFunction(() => this.runner.declareSuiteSkip),
      only: this.makeSuiteFunction(() => this.runner.declareSuiteOnly),
      pending: this.makeSuiteFunction(() => this.runner.declareSuitePending)
    });
  }

  private makeSuiteFunction(suiteFunc: (ctor: T.SuiteCtor) => Function) {
    const theTestUI = this;
    return this.suiteOverload({
      suiteCtor(ctor: T.SuiteCtor): void {
        ctor[ClassTestUI.suiteSymbol] = true;
        suiteFunc(ctor)(ctor.name, theTestUI.suiteClassCallback(ctor));
      },
      suiteDecorator(...traits: T.SuiteTrait<RunnerSuiteType>[]): ClassDecorator {
        return function <TFunction extends Function>(ctor: TFunction): void {
          ctor[ClassTestUI.suiteSymbol] = true;
          ctor[ClassTestUI.traitsSymbol] = traits;
          suiteFunc(ctor as any)(ctor.name, theTestUI.suiteClassCallback(ctor as any));
        };
      },
      suiteDecoratorNamed(name: string, ...traits: T.SuiteTrait<RunnerSuiteType>[]): ClassDecorator {
        return function <TFunction extends Function>(ctor: TFunction): void {
          ctor[ClassTestUI.suiteSymbol] = true;
          ctor[ClassTestUI.traitsSymbol] = traits;
          suiteFunc(ctor as any)(name, theTestUI.suiteClassCallback(ctor as any));
        };
      }
    });
  }

  private suiteFuncCheckingDecorators() {
    return (ctor: T.SuiteCtor) => {
      const shouldSkip = ctor[ClassTestUI.skipSymbol];
      const shouldOnly = ctor[ClassTestUI.onlySymbol];
      const shouldPending = ctor[ClassTestUI.pendingSymbol];
      return (shouldOnly && this.runner.declareSuiteOnly)
            || (shouldSkip && this.runner.declareSuiteSkip)
            || (shouldPending && this.runner.declareSuitePending)
            || this.runner.declareSuite;
    };
  }

  private suiteOverload({suiteCtor, suiteDecorator, suiteDecoratorNamed}: {
    suiteCtor(ctor: T.SuiteCtor): void;
    suiteDecorator(...traits: T.SuiteTrait<RunnerSuiteType>[]): ClassDecorator;
    suiteDecoratorNamed(name: string, ...traits: T.SuiteTrait<RunnerSuiteType>[]): ClassDecorator;
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
  private makeTestObject(): T.TestDecorator<RunnerTestType> {
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
      testDecorator(...traits: T.TestTrait<RunnerTestType>[]): PropertyDecorator & MethodDecorator {
        return function(target: Object, propertyKey: string | symbol, descriptor?: PropertyDescriptor): void {
          target[propertyKey][ClassTestUI.testNameSymbol] = propertyKey.toString();
          target[propertyKey][ClassTestUI.traitsSymbol] = traits;
          if (mark) {
            target[propertyKey][mark] = true;
          }
        };
      },
      testDecoratorNamed(name: string, ...traits: T.TestTrait<RunnerTestType>[]): PropertyDecorator & MethodDecorator {
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
    testDecorator(...traits: T.TestTrait<RunnerTestType>[]): PropertyDecorator & MethodDecorator;
    testDecoratorNamed(name: string, ...traits: T.TestTrait<RunnerTestType>[]): PropertyDecorator & MethodDecorator;
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

  // slow, timeout, retries
  private createNumericBuiltinTrait(traitSymbol: any, fn: (ctx: RunnerSuiteType | RunnerTestType, value: number) => void): T.NumericDecoratorOrTrait<RunnerSuiteType, RunnerTestType> {
    const classTestUIInstance = this;
    return function(value: number): ClassDecorator & MethodDecorator & T.SuiteTrait<RunnerSuiteType> & T.TestTrait<RunnerTestType> {
      return classTestUIInstance.trait(function() {
        if (arguments.length === 1) {
          // Class decorator
          const target = arguments[0];
          target[traitSymbol] = value;
          return;
        }

        /* istanbul ignore if  */
        if (arguments.length === 2 && typeof arguments[1] === "string") {
          // PropertyDecorator, some TSC versions generated property decorators when decorating method
          const target = arguments[0];
          const property = arguments[1];
          target[property][traitSymbol] = value;
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
          proto[prop][traitSymbol] = value;
          return;
        }

        // assert unreachable.
      });
    };
  }

  // pending, only, skip
  private createExecutionModifier(executionSymbol: any): <TFunction extends Function>(target: boolean | Object | TFunction, propertyKey?: string | symbol) => any {
    const decorator = function <TFunction extends Function>(target: Object | TFunction, propertyKey?: string | symbol): any {
      if (typeof target === "undefined" || typeof target === "boolean") {
        if (target) {
          return decorator;
        } else {
          return () => {};
        }
      }
      if (arguments.length === 1) {
        target[executionSymbol] = true;
      } else {
        target[propertyKey][executionSymbol] = true;
      }
    };
    return decorator;
  }
}
