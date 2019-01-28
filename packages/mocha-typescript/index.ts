/// <reference path="index.d.ts"/>

import * as Mocha from "mocha";

import * as util from "util";

const globalTestFunctions: MochaTypeScript.TestFunctions = {
    get describe() { return (global as any).describe; },
    get it() { return (global as any).it; },
    get before() { return (global as any).before; },
    get after() { return (global as any).after; },
    get beforeEach() { return (global as any).beforeEach; },
    get afterEach() { return (global as any).afterEach; },
};

// key => Symbol("mocha-typescript:" + key)
const nodeSymbol = (key): string => "__mts_" + key;

const suiteSymbol = nodeSymbol("suite");
const testNameSymbol = nodeSymbol("test");
const parametersSymbol = nodeSymbol("parametersSymbol");
const nameForParametersSymbol = nodeSymbol("nameForParameters");
const slowSymbol = nodeSymbol("slow");
const timeoutSymbol = nodeSymbol("timeout");
const retriesSymbol = nodeSymbol("retries");
const onlySymbol = nodeSymbol("only");
const pendingSymbol = nodeSymbol("pending");
const skipSymbol = nodeSymbol("skip");
const traitsSymbol = nodeSymbol("traits");
const isTraitSymbol = nodeSymbol("isTrait");
const contextSymbol = nodeSymbol("context");
const skipAllSymbol = nodeSymbol("skipAll");

const wrapNameAndToString = (cb: (done?: Function) => any, innerFunction: Function): () => any => {
    cb.toString = () => innerFunction.toString();
    Object.defineProperty(cb, "name", { value: innerFunction.name, writable: false });
    return cb;
};

function applyDecorators(mocha: Mocha.Context, ctorOrProto, method, instance) {
    const timeoutValue = method[timeoutSymbol];
    if (typeof timeoutValue === "number") {
        mocha.timeout(timeoutValue);
    }
    const slowValue = method[slowSymbol];
    if (mocha.slow && typeof slowValue === "number") {
        mocha.slow(slowValue);
    }
    const retriesValue = method[retriesSymbol];
    if (mocha.retries && typeof retriesValue === "number") {
        mocha.retries(retriesValue);
    }
    const contextProperty = ctorOrProto[contextSymbol];
    if (contextProperty) {
        instance[contextProperty] = mocha;
    }
}
function applyTestTraits(context: Mocha.Context, instance: MochaTypeScript.SuiteProto, method: Function) {
    const traits: MochaTypeScript.TestTrait[] = method[traitsSymbol];
    if (traits) {
        traits.forEach((trait) => {
            trait.call(context, context, instance, method);
        });
    }
}
function applySuiteTraits(context: Mocha.Suite, target: MochaTypeScript.SuiteCtor) {
    const traits: MochaTypeScript.SuiteTrait[] = target[traitsSymbol];
    if (traits) {
        traits.forEach((trait) => {
            trait.call(context, context, target);
        });
    }
}

function suiteClassCallback(target: MochaTypeScript.SuiteCtor, context: MochaTypeScript.TestFunctions) {

    // console.log("suiteCallbackFactory called");
    // console.log(`target: ${target}`);
    // console.log(`context: ${context}`);

    return function() {
        applySuiteTraits(this, target);
        applyDecorators(this, target, target, target);
        let instance;
        if (target.before) {
            if (isAsync(target.before)) {
                context.before(function(done) {
                    applyDecorators(this, target, target.before, target);
                    return target.before(done);
                });
            } else {
                context.before(function() {
                    applyDecorators(this, target, target.before, target);
                    return target.before();
                });
            }
        }
        if (target.after) {
            if (isAsync(target.after)) {
                context.after(function(done) {
                    applyDecorators(this, target, target.after, target);
                    return target.after(done);
                });
            } else {
                context.after(function() {
                    applyDecorators(this, target, target.after, target);
                    return target.after();
                });
            }
        }
        const prototype = target.prototype;
        let beforeEachFunction: (() => any) | ((done: Function) => any);
        if (prototype.before) {
            if (isAsync(prototype.before)) {
                beforeEachFunction = wrapNameAndToString(function(this: Mocha.Context, done: Function) {
                    instance = getInstance(target);
                    applyDecorators(this, prototype, prototype.before, instance);
                    return prototype.before.call(instance, done);
                }, prototype.before);
            } else {
                beforeEachFunction = wrapNameAndToString(function(this: Mocha.Context) {
                    instance = getInstance(target);
                    applyDecorators(this, prototype, prototype.before, instance);
                    return prototype.before.call(instance);
                }, prototype.before);
            }
        } else {
            beforeEachFunction = function(this: Mocha.Context) {
                instance = getInstance(target);
            };
        }
        context.beforeEach(beforeEachFunction);

        let afterEachFunction: (() => any) | ((done: Function) => any);
        if (prototype.after) {
            if (isAsync(prototype.after)) {
                afterEachFunction = wrapNameAndToString(function(this: Mocha.Context, done) {
                    try {
                        applyDecorators(this, prototype, prototype.after, instance);
                        return prototype.after.call(instance, done);
                    } finally {
                        instance = undefined;
                    }
                }, prototype.after);
            } else {
                afterEachFunction = wrapNameAndToString(function(this: Mocha.Context) {
                    try {
                        applyDecorators(this, prototype, prototype.after, instance);
                        return prototype.after.call(instance);
                    } finally {
                        instance = undefined;
                    }
                }, prototype.after);
            }
        } else {
            afterEachFunction = function(this: Mocha.Context) {
                instance = undefined;
            };
        }
        context.afterEach(afterEachFunction);

        function runTest(prototype: any, method: Function) {
            const testName = method[testNameSymbol];
            const shouldSkip = method[skipSymbol] || prototype.constructor[skipSymbol];
            const shouldOnly = method[onlySymbol] || prototype.constructor[onlySymbol];
            const shouldPending = method[pendingSymbol];
            const parameters = method[parametersSymbol] as TestParams[];

            // assert testName is truthy
            if (parameters) {
                // we make the parameterised test a child suite so we can late bind the parameterised tests
                context.describe(testName, function() {
                    const nameForParameters = method[nameForParametersSymbol];
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

                        const testFunc = ((shouldPendingParam || shouldSkipParam) && context.it.skip)
                                         || (shouldOnlyParam && context.it.only)
                                         || context.it;

                        applyTestFunc(testFunc, parametersTestName, method, [params]);
                    });
                });
            } else {
                const testFunc = ((shouldPending || shouldSkip) && context.it.skip)
                    || (shouldOnly && context.it.only)
                    || context.it;

                // console.log(`applying test: ${testName}`);
                // console.log(`applying test: ${testFunc}`);
                // console.log(`applying test: ${method}`);
                applyTestFunc(testFunc, testName, method, []);
            }
        }

        function isAsync(method: Function): boolean {

            const isParameterised = method[parametersSymbol] !== undefined;
            const length = method.length;
            return (isParameterised && length > 1) || (!isParameterised && length > 0);
        }

        function applyTestFunc(testFunc: Function, testName: string, method: Function, callArgs: any[]) {
            if (isAsync(method)) {
                testFunc(testName, wrapNameAndToString(function(this: Mocha.Context, done) {
                  applyDecorators(this, prototype, method, instance);
                  applyTestTraits(this, instance, method);
                  return method.call(instance, done, ...callArgs);
                }, method));
            } else {
                const t = testFunc(testName, wrapNameAndToString(function(this: Mocha.Context) {
                  applyDecorators(this, prototype, method, instance);
                  applyTestTraits(this, instance, method);
                  return method.call(instance, ...callArgs);
                }, method));
                // console.log(`t: ${util.inspect(t)}`);
                // console.log(`suite: ${util.inspect(t.parent)}`);
            }
        }

        // collect all tests along the inheritance chain, allow overrides
        const collectedTests: { [key: string]: any[] } = {};
        let currentPrototype = prototype;
        while (currentPrototype !== Object.prototype) {
            Object.getOwnPropertyNames(currentPrototype).forEach((key) => {
                if (typeof prototype[key] === "function") {
                    const method = prototype[key];
                    if (method[testNameSymbol] && !collectedTests[key]) {
                        collectedTests[key] = [prototype, method];
                    }
                }
            });
            currentPrototype = (Object as any).getPrototypeOf(currentPrototype);
            if (currentPrototype !== Object.prototype && currentPrototype.constructor[suiteSymbol]) {
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

function suiteOverload(overloads: {
    // suite(name: string, fn: Function): any;
    suiteCtor(ctor: MochaTypeScript.SuiteCtor): void;
    suiteDecorator(...traits: MochaTypeScript.SuiteTrait[]): ClassDecorator;
    suiteDecoratorNamed(name: string, ...traits: MochaTypeScript.SuiteTrait[]): ClassDecorator;
}) {
    return function() {
        // if (arguments.length === 2 && typeof arguments[0] === "string" && typeof arguments[1] === "function" && !arguments[1][isTraitSymbol]) {
        //     return overloads.suite.apply(this, arguments);
        // }

        if (arguments.length === 1 && typeof arguments[0] === "function" && !arguments[0][isTraitSymbol]) {
            return overloads.suiteCtor.apply(this, arguments);
        }

        if (arguments.length >= 1 && typeof arguments[0] === "string") {
            return overloads.suiteDecoratorNamed.apply(this, arguments);
        }

        return overloads.suiteDecorator.apply(this, arguments);
    };
}

function makeSuiteFunction(suiteFunc: (ctor: MochaTypeScript.SuiteCtor) => Function, context: MochaTypeScript.TestFunctions) {
    return suiteOverload({
        // suite(name: string, fn: Function): any {
        //     return suiteFunc()(name, fn);
        // },
        suiteCtor(ctor: MochaTypeScript.SuiteCtor): void {
            ctor[suiteSymbol] = true;
            suiteFunc(ctor)(ctor.name, suiteClassCallback(ctor, context));
        },
        suiteDecorator(...traits: MochaTypeScript.SuiteTrait[]): ClassDecorator {
            return function <TFunction extends Function>(ctor: TFunction): void {
                ctor[suiteSymbol] = true;
                ctor[traitsSymbol] = traits;
                suiteFunc(ctor as any)(ctor.name, suiteClassCallback(ctor as any, context));
            };
        },
        suiteDecoratorNamed(name: string, ...traits: MochaTypeScript.SuiteTrait[]): ClassDecorator {
            return function <TFunction extends Function>(ctor: TFunction): void {
                ctor[suiteSymbol] = true;
                ctor[traitsSymbol] = traits;
                suiteFunc(ctor as any)(name, suiteClassCallback(ctor as any, context));
            };
        },
    });
}

function suiteFuncCheckingDecorators(context: MochaTypeScript.TestFunctions) {
    return function(ctor: MochaTypeScript.SuiteCtor) {
        const shouldSkip = ctor[skipSymbol];
        const shouldOnly = ctor[onlySymbol];
        const shouldPending = ctor[pendingSymbol];
        return (shouldOnly && context.describe.only)
            || ((shouldSkip || shouldPending) && context.describe.skip)
            || context.describe;
    };
}

function makeSuiteObject(context: MochaTypeScript.TestFunctions): MochaTypeScript.SuiteDecorator {
    return Object.assign(makeSuiteFunction(suiteFuncCheckingDecorators(context), context), {
        skip: makeSuiteFunction(() => context.describe.skip, context),
        only: makeSuiteFunction(() => context.describe.only, context),
        pending: makeSuiteFunction(() => context.describe.skip, context),
    });
}
export const suite = makeSuiteObject(globalTestFunctions);

const enum Mark { test, skip, only, pending }

interface TestParams {
    mark: Mark;
    name?: string;
    params: any;
}

function makeParamsFunction(mark: Mark) {
    return (params: any, name?: string) => {
        return (target: Object, propertyKey: string) => {
            target[propertyKey][testNameSymbol] = propertyKey.toString();
            target[propertyKey][parametersSymbol] = target[propertyKey][parametersSymbol] || [];
            target[propertyKey][parametersSymbol].push({ mark, name, params } as TestParams);
        };
    };
}

function makeParamsNameFunction() {
    return (nameForParameters: (parameters: any) => string) => {
        return (target: Object, propertyKey: string) => {
            target[propertyKey][nameForParametersSymbol] = nameForParameters;
        };
    };
}

function makeParamsObject(context: MochaTypeScript.TestFunctions) {
    return Object.assign(makeParamsFunction(Mark.test), {
        skip: makeParamsFunction(Mark.skip),
        only: makeParamsFunction(Mark.only),
        pending: makeParamsFunction(Mark.pending),
        naming: makeParamsNameFunction(),
    });
}
export const params = makeParamsObject(globalTestFunctions);

function testOverload(overloads: {
    // test(name: string, fn: Function);
    testProperty(target: Object, propertyKey: string | symbol, descriptor?: PropertyDescriptor): void;
    testDecorator(...traits: MochaTypeScript.TestTrait[]): PropertyDecorator & MethodDecorator;
    testDecoratorNamed(name: string, ...traits: MochaTypeScript.TestTrait[]): PropertyDecorator & MethodDecorator;
}) {
    return function() {
        // if (arguments.length === 2 && typeof arguments[0] === "string" && typeof arguments[1] === "function" && !arguments[1][isTraitSymbol]) {
        //     return overloads.test.apply(this, arguments);
        // console.log(`testOverload arguments.length = ${arguments.length}`);
        // console.log(`arguments[0] = ${arguments[0]}`);
        // console.log(`arguments[1] = ${arguments[1]}`);
        if (arguments.length >= 2 && typeof arguments[0] !== "string" && typeof arguments[0] !== "function") {
            // console.log('as property decorator');
            return overloads.testProperty.apply(this, arguments);
        } else if (arguments.length >= 1 && typeof arguments[0] === "string") {
            // console.log('as named decorator');
            return overloads.testDecoratorNamed.apply(this, arguments);
        } else {
            // console.log('as decorator');
            return overloads.testDecorator.apply(this, arguments);
        }
    };
}

function makeTestFunction(testFunc: Mocha.TestFunction | Mocha.PendingTestFunction | Mocha.ExclusiveTestFunction, mark: null | string | symbol) {
    return testOverload({
        // unable to comply, test decorator overrides standard vanilla test interface
        // test(name: string, fn: Mocha.Func | Mocha.AsyncFunc): Mocha.Test {
        //     return testFunc(name, fn);
        // },
        testProperty(target: Object, propertyKey: string | symbol, descriptor?: PropertyDescriptor): void {
            // console.log("shizerest");
            target[propertyKey][testNameSymbol] = propertyKey.toString();
            if (mark) {
                target[propertyKey][mark] = true;
            }
        },
        testDecorator(...traits: MochaTypeScript.TestTrait[]): PropertyDecorator & MethodDecorator {
            return function(target: Object, propertyKey: string | symbol, descriptor?: PropertyDescriptor): void {
                // console.log("shize");
                target[propertyKey][testNameSymbol] = propertyKey.toString();
                target[propertyKey][traitsSymbol] = traits;
                if (mark) {
                    target[propertyKey][mark] = true;
                }
            };
        },
        testDecoratorNamed(name: string, ...traits: MochaTypeScript.TestTrait[]): PropertyDecorator & MethodDecorator {
            return function(target: Object, propertyKey: string | symbol, descriptor?: PropertyDescriptor): void {
                // console.log("shizer");
                target[propertyKey][testNameSymbol] = name;
                target[propertyKey][traitsSymbol] = traits;
                if (mark) {
                    target[propertyKey][mark] = true;
                }
            };
        },
    });
}
function makeTestObject(context: MochaTypeScript.TestFunctions): MochaTypeScript.TestDecorator {

    // console.log("it: " + context.it.skip);

    return Object.assign(makeTestFunction(context.it, null), {
        skip: makeTestFunction(context.it.skip, skipSymbol),
        only: makeTestFunction(context.it.only, onlySymbol),
        pending: makeTestFunction(context.it.skip, pendingSymbol),
    });
}
export const test = makeTestObject(globalTestFunctions);

export function trait<T extends MochaTypeScript.SuiteTrait | MochaTypeScript.TestTrait>(arg: T): T {
    arg[isTraitSymbol] = true;
    return arg;
}

function createNumericBuiltinTrait(traitSymbol: any, fn: (ctx: Mocha.Suite | Mocha.Context, value: number) => void): MochaTypeScript.NumericDecoratorOrTrait {
    return function(value: number): ClassDecorator & MethodDecorator & MochaTypeScript.SuiteTrait & MochaTypeScript.TestTrait {
        return trait(function() {
            // TODO: Implement an overload selector similar to the testOverload function

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
                const context: Mocha.Suite = arguments[0];
                const ctor = arguments[1];
                fn(context, value);
                return;
            }

            if (arguments.length === 3 && typeof arguments[2] === "function") {
                // Method trait as retries in `@suite class { @test(retries(4)) method() {} }`
                const context: Mocha.Context = arguments[0];
                const instance = arguments[1];
                const method = arguments[2];
                fn(context, value);
                return;
            }

            /* istanbul ignore else */
            if (arguments.length === 3 && typeof arguments[1] === "string") {
                // MethodDecorator
                const proto: Mocha.Context = arguments[0];
                const prop = arguments[1];
                const descriptor = arguments[2];
                proto[prop][traitSymbol] = value;
                return;
            }

            // assert unreachable.
        });
    };
}

/**
 * Set a test method execution time that is considered slow.
 * @param value The time in miliseconds.
 */
export const slow = createNumericBuiltinTrait(slowSymbol, (context, value) => context.slow(value));

/**
 * Set a test method or suite timeout time.
 * @param value The time in miliseconds.
 */
export const timeout = createNumericBuiltinTrait(timeoutSymbol, (context, value) => context.timeout(value));

/**
 * Set a test method or site retries count.
 * @param value The number of retries to attempt when running the test.
 */
export const retries = createNumericBuiltinTrait(retriesSymbol, (context: Mocha.Context, value) => context.retries(value));

export const skipOnError: MochaTypeScript.SuiteTrait = trait(function(ctx, ctor) {
    ctx.beforeEach(function() {
        if (ctor[skipAllSymbol]) {
            this.skip();
        }
    });
    ctx.afterEach(function() {
        if (this.currentTest.state === "failed") {
            ctor[skipAllSymbol] = true;
        }
    });
});

function createExecutionModifier(executionSymbol: any): <TFunction extends Function>(target: boolean | Object | TFunction, propertyKey?: string | symbol) => any {
    const decorator = function <TFunction extends Function>(target: Object | TFunction, propertyKey?: string | symbol): any {
        if (arguments.length === 1) {
            if (typeof target === "undefined" || typeof target === "boolean") {
                if (target) {
                    return decorator as ClassDecorator & MethodDecorator | void;
                } else {
                    return () => {};
                }
            } else {
                target[executionSymbol] = true;
            }
        } else {
            target[propertyKey][executionSymbol] = true;
        }
    };
    return decorator;
}

/**
 * Mart a test or suite as pending.
 *  - Used as `@suite @pending class` is `describe.skip("name", ...);`.
 *  - Used as `@test @pending method` is `it("name");`
 */
export const pending = createExecutionModifier(pendingSymbol);

/**
 * Mark a test or suite as the only one to execute.
 *  - Used as `@suite @only class` is `describe.only("name", ...)`.
 *  - Used as `@test @only method` is `it.only("name", ...)`.
 */
export const only = createExecutionModifier(onlySymbol);

/**
 * Mark a test or suite to skip.
 *  - Used as `@suite @skip class` is `describe.skip("name", ...);`.
 *  - Used as `@test @skip method` is `it.skip("name")`.
 *  - Used as conditional skip mark `@skip(isWin)`.
 */
export const skip = createExecutionModifier(skipSymbol);

/**
 * Mark a property of the class for mocha context injection.
 */
export const context: PropertyDecorator = function context(target: Object, propertyKey: string): void {
    target[contextSymbol] = propertyKey;
};

const defaultDependencyInjectionSystem: MochaTypeScript.DependencyInjectionSystem = {
    handles() { return true; },
    create<T>(cls: MochaTypeScript.Class<T>) {
        return new cls();
    },
};

const dependencyInjectionSystems: MochaTypeScript.DependencyInjectionSystem[] = [defaultDependencyInjectionSystem];

function getInstance<T>(testClass: MochaTypeScript.Class<T>) {
    const di = dependencyInjectionSystems.find((di) => di.handles(testClass));
    return di.create(testClass);
}

/**
 * Register a dependency injection system.
 */
export function registerDI(instantiator: MochaTypeScript.DependencyInjectionSystem) {
    // Maybe check if it is not already added?
    /* istanbul ignore else */
    if (!dependencyInjectionSystems.some((di) => di === instantiator)) {
        dependencyInjectionSystems.unshift(instantiator);
    }
}
