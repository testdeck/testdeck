interface IOptionallyAsync {
    (): any;
    (done: Function): any;
}

declare var global: {
    describe(string, IOptionallyAsync): void;
    it: {
        (string, IOtinallyAsync): void;
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
let itFunction = global.it;
let skipFunction = itFunction.skip;
let onlyFunction = itFunction.only;
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
let skipSymbol = nodeSymbol("skip");

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

function applyDecorators(this: MochaContext, target) {
    const timeoutValue = target[timeoutSymbol];
    if (typeof timeoutValue === "number") {
        this.timeout(timeoutValue);
    }
    const slowValue = target[slowSymbol];
    if (typeof slowValue === "number") {
        this.slow(slowValue);
    }
}

const noname = (cb) => cb;

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
        describeFunction(targetName, function() {
            applyDecorators.call(this, target);
            let instance;
            if (target.before) {
                if (target.before.length > 0) {
                    beforeAll(function(done) {
                        applyDecorators.call(this, target.before);
                        return target.before(done);
                    });
                } else {
                    beforeAll(function() {
                        applyDecorators.call(this, target.before);
                        return target.before();
                    });
                }
            }
            if (target.after) {
                if (target.after.length > 0) {
                    afterAll(function(done) {
                        applyDecorators.call(this, target.after);
                        return target.after(done);
                    });
                } else {
                    afterAll(function() {
                        applyDecorators.call(this, target.after);
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
                        applyDecorators.call(this, prototype.before);
                        return prototype.before.call(instance, done);
                    });
                } else {
                    beforeEachFunction = noname(function(this: MochaContext) {
                        instance = new target();
                        applyDecorators.call(this, prototype.before);
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
                            applyDecorators.call(this, prototype.after);
                            return prototype.after.call(instance, done);
                        } finally {
                            instance = undefined;
                        }
                    });
                } else {
                    afterEachFunction = noname(function(this: MochaContext) {
                        try {
                            applyDecorators.call(this, prototype.after);
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
                    let testName = method[testNameSymbol];

                    let shouldSkip = method[skipSymbol];
                    let shouldOnly = method[onlySymbol];

                    let testFunc = (shouldSkip && skipFunction)
                        || (shouldOnly && onlyFunction)
                        || itFunction;

                    if (testName) {
                        if (method.length > 0) {
                            testFunc(testName, noname(function(this: MochaContext, done) {
                                applyDecorators.call(this, method);
                                return method.call(instance, done);
                            }));
                        } else {
                            testFunc(testName, noname(function(this: MochaContext) {
                                applyDecorators.call(this, method);
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
 * Mark a test as the only one to execute.
 */
export function only(target: Object, propertyKey: string | symbol): void {
    target[propertyKey][onlySymbol] = true;
}

/**
 * Mark a test to skip.
 */
export function skip(target: Object, propertyKey: string | symbol): void {
    target[propertyKey][skipSymbol] = true;
}
