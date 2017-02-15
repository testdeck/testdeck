interface IOptionallyAsync {
    (): any;
    (done: Function): any;
}

declare var global: {
    describe: {
        (string, IOptionallyAsync): void;
        skip(string, IOptionallyAsync): void;
        only(string, IOptionallyAsync): void;
    };
    it: {
        (string, IOtinallyAsync?): void;
        skip(string, IOptionallyAsync): void,
        only(string, IOptionallyAsync): void
    };
    before(IOptionallyAsync): void,
    beforeEach(IOptionallyAsync): void,
    after(IOptionallyAsync): void,
    afterEach(IOptionallyAsync): void,
    // Symbol: Symbol;
};

let describeFunction = global.describe;
let skipSuiteFunction = describeFunction.skip;
let onlySuiteFunction = describeFunction.only;

let itFunction = global.it;
let skipFunction = itFunction.skip;
let onlyFunction = itFunction.only;
let pendingFunction = itFunction;
let beforeAll = global.before;
let beforeEach = global.beforeEach;
let afterAll = global.after;
let afterEach = global.afterEach;

//let nodeSymbol = global.Symbol || (key => "__mts_" + key);
let nodeSymbol = (key => "__mts_" + key);

let testNameSymbol = nodeSymbol("test");
let slowSymbol = nodeSymbol("slow");
let timeoutSymbol = nodeSymbol("timout");
let onlySymbol = nodeSymbol("only");
let pendingSumbol = nodeSymbol("pending");
let skipSymbol = nodeSymbol("skip");
let contextSymbol = nodeSymbol("context");
let handled = nodeSymbol("handled");

interface SuiteCtor {
    before?: IOptionallyAsync;
    after?: IOptionallyAsync;
    new();
}
interface SuiteProto {
    before?: IOptionallyAsync;
    after?: IOptionallyAsync;
}
interface MochaContext {
    timeout(timeout: number);
    slow(time: number);
}

function applyDecorators(mocha: MochaContext, ctorOrProto, method, instance) {
    const timeoutValue = method[timeoutSymbol];
    if (typeof timeoutValue === "number") {
        mocha.timeout(timeoutValue);
    }
    const slowValue = method[slowSymbol];
    if (typeof slowValue === "number") {
        mocha.slow(slowValue);
    }
    const contextProperty = ctorOrProto[contextSymbol];
    if (contextProperty) {
        instance[contextProperty] = mocha;
    }
}

const noname = cb => cb;

/**
 * Mark a class as test suite and provide a custom name.
 * @param name The suite name.
 */
export function suite(name: string): ClassDecorator;
/**
 * Mark a class as test suite. Use the class name as suite name.
 * @param target The test class.
 */
export function suite<TFunction extends Function>(target: TFunction): TFunction | void;
export function suite<TFunction extends Function>(target: TFunction | string): ClassDecorator | TFunction | void {
    let decoratorName = typeof target === "string" && target;
    function result(target: SuiteCtor) {
        let targetName = decoratorName || (<any>target).name;

        let shouldSkip = target[skipSymbol];
        let shouldOnly = target[onlySymbol];
        let shouldPending = target[pendingSumbol];

        let suiteFunc = (shouldSkip && skipSuiteFunction)
            || (shouldOnly && onlySuiteFunction)
            || (shouldPending && skipSuiteFunction)
            || describeFunction;
        
        suiteFunc(targetName, function() {
            applyDecorators(this, target, target, target);
            let instance;
            if (target.before) {
                if (target.before.length > 0) {
                    beforeAll(function(done) {
                        applyDecorators(this, target, target.before, target);
                        return target.before(done);
                    });
                } else {
                    beforeAll(function() {
                        applyDecorators(this, target, target.before, target);
                        return target.before();
                    });
                }
            }
            if (target.after) {
                if (target.after.length > 0) {
                    afterAll(function(done) {
                        applyDecorators(this, target, target.after, target);
                        return target.after(done);
                    });
                } else {
                    afterAll(function() {
                        applyDecorators(this, target, target.after, target);
                        return target.after();
                    });
                }
            }
            let prototype: SuiteProto = target.prototype;
            let beforeEachFunction: {(): any} | {(done: Function): any};
            if (prototype.before) {
                if (prototype.before.length > 0) {
                    beforeEachFunction = noname(function(this: MochaContext, done: Function) {
                        instance = new target();
                        applyDecorators(this, prototype, prototype.before, instance);
                        return prototype.before.call(instance, done);
                    });
                } else {
                    beforeEachFunction = noname(function(this: MochaContext) {
                        instance = new target();
                        applyDecorators(this, prototype, prototype.before, instance);
                        return prototype.before.call(instance);
                    });
                }
            } else {
                beforeEachFunction = noname(function(this: MochaContext) {
                    instance = new target();
                });
            }
            beforeEach(beforeEachFunction);

            let afterEachFunction: {(): any} | {(done: Function): any};
            if (prototype.after) {
                if (prototype.after.length > 0) {
                    afterEachFunction = noname(function(this: MochaContext, done) {
                        try {
                            applyDecorators(this, prototype, prototype.after, instance);
                            return prototype.after.call(instance, done);
                        } finally {
                            instance = undefined;
                        }
                    });
                } else {
                    afterEachFunction = noname(function(this: MochaContext) {
                        try {
                            applyDecorators(this, prototype, prototype.after, instance);
                            return prototype.after.call(instance);
                        } finally {
                            instance = undefined;
                        }
                    });
                }
            } else {
                afterEachFunction = noname(function(this: MochaContext) {
                    instance = undefined;
                });
            }
            afterEach(afterEachFunction);

            (<any>Object).getOwnPropertyNames(prototype).forEach(key => {
                try {
                    let method = <Function>prototype[key];
                    if (method === target) {
                        return;
                    }

                    let testName = method[testNameSymbol];
                    let shouldSkip = method[skipSymbol];
                    let shouldOnly = method[onlySymbol];
                    let shouldPending = method[pendingSumbol];

                    let testFunc = (shouldSkip && skipFunction)
                        || (shouldOnly && onlyFunction)
                        || itFunction;

                    if (testName || shouldOnly || shouldPending || shouldSkip) {
                        testName = testName || (<any>method).name;
                        if (shouldPending && !shouldSkip && !shouldOnly) {
                            pendingFunction(testName);
                        } else if (method.length > 0) {
                            testFunc(testName, noname(function(this: MochaContext, done) {
                                applyDecorators(this, prototype, method, instance);
                                return method.call(instance, done);
                            }));
                        } else {
                            testFunc(testName, noname(function(this: MochaContext) {
                                applyDecorators(this, prototype, method, instance);
                                return method.call(instance);
                            }));
                        }
                    }
                } catch(e) {
                    // console.log(e);
                }
            });
        });
    }
    return decoratorName ? result : result(<any>target);
}

/**
 * Mark a method as test and provide a custom name.
 * @param name The test name.
 */
export function test(name: string): PropertyDecorator;
/**
 * Mark a method as test. Use the method name as test name.
 */
export function test(target: Object, propertyKey: string | symbol): void;
export function test(target: string | Object, propertyKey?: string | symbol): PropertyDecorator | void {
    let decoratorName = typeof target === "string" && target;
    let result = (target: Object, propertyKey: string | symbol) => {
        target[propertyKey][testNameSymbol] = decoratorName || propertyKey;
    };
    return decoratorName ? result : result(target, propertyKey);
}

/**
 * Set a test method execution time that is considered slow.
 * @param time The time in miliseconds.
 */
export function slow(time: number): PropertyDecorator & ClassDecorator {
    return function<TFunction extends Function>(target: Object, propertyKey?: string | symbol): void {
        if (arguments.length === 1) {
            target[slowSymbol] = time;
        } else {
            target[propertyKey][slowSymbol] = time;
        }
    }
}

/**
 * Set a test method or suite timeout time.
 * @param time The time in miliseconds.
 */
export function timeout(time: number): PropertyDecorator & ClassDecorator {
    return function<TFunction extends Function>(target: Object | TFunction, propertyKey?: string | symbol): void {
        if (arguments.length === 1) {
            target[timeoutSymbol] = time;
        } else {
            target[propertyKey][timeoutSymbol] = time;
        }
    }
}

/**
 * Mart a test or suite as pending.
 *  - Used as `@suite @pending class` is `describe.skip("name", ...);`.
 *  - Used as `@test @pending method` is `it("name");`
 */
export function pending<TFunction extends Function>(target: Object | TFunction, propertyKey?: string | symbol): void {
    if (arguments.length === 1) {
        target[pendingSumbol] = true;
    } else {
        target[propertyKey][pendingSumbol] = true;
    }
}

/**
 * Mark a test or suite as the only one to execute.
 *  - Used as `@suite @only class` is `describe.only("name", ...)`.
 *  - Used as `@test @only method` is `it.only("name", ...)`.
 */
export function only<TFunction extends Function>(target: Object, propertyKey?: string | symbol): void {
    if (arguments.length === 1) {
        target[onlySymbol] = true;
    } else {
        target[propertyKey][onlySymbol] = true;
    }
}

/**
 * Mark a test or suite to skip.
 *  - Used as `@suite @skip class` is `describe.skip("name", ...);`.
 *  - Used as `@test @skip method` is `it.skip("name")`.
 */
export function skip<TFunction extends Function>(target: Object | TFunction, propertyKey?: string | symbol): void {
    if (arguments.length === 1) {
        target[onlySymbol] = true;
    } else {
        target[propertyKey][skipSymbol] = true;
    }
}

/**
 * Mark a method as test. Use the method name as test name.
 */
export function context(target: Object, propertyKey: string | symbol): void {
    target[contextSymbol] = propertyKey;
}
