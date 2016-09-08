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
let instanceSymbol = nodeSymbol("instance");
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
            let instance;
            if (target.before) {
                if (target.before.length > 0) {
                    beforeAll((done) => {
                        return target.before(done);
                    });
                } else {
                    beforeAll(() => {
                        return target.before();
                    });
                }
            }
            if (target.after) {
                if (target.after.length > 0) {
                    afterAll((done) => {
                        return target.after(done);
                    });
                } else {
                    afterAll(() => {
                        return target.after();
                    });
                }
            }
            let prototype: SuiteProto = target.prototype;
            let beforeEachFunction: {(): any} | {(done: Function): any} = () => {
                this[instanceSymbol] = new target;
            };
            if (prototype.before) {
                if (prototype.before.length > 0) {
                    beforeEachFunction = (done: Function) => {
                        instance = new target();
                        /*let instance = new target;
                        this[instanceSymbol] = instance;*/
                        return prototype.before.call(instance, done);
                    };
                } else {
                    beforeEachFunction = () => {
                        instance = new target();
                        //this[instanceSymbol] = instance;
                        return prototype.before.call(instance);
                    };
                }
            } else {
                beforeEachFunction = () => {
                    //this[instanceSymbol] = new target;
                    instance = new target();
                }
            }
            beforeEach(beforeEachFunction);

            let afterEachFunction: {(): any} | {(done: Function): any} = () => {
                this[instanceSymbol] = undefined;
            };
            if (prototype.after) {
                if (prototype.after.length > 0) {
                    afterEachFunction = (done) => {
                        let instanceReference = instance;
                        instance = undefined;
                        return prototype.after.call(instanceReference, done);
                    };
                } else {
                    afterEachFunction = () => {
                        let instanceReference = instance;
                        instance = undefined;
                        return prototype.after.call(instanceReference);
                    };
                }
            }
            afterEach(afterEachFunction);

            (<any>Object).getOwnPropertyNames(prototype).forEach(key => {
                try {
                    let method = <Function>prototype[key];
                    let testName = method[testNameSymbol];

                    function applyTimes(target) {
                        let timeoutValue = method[timeoutSymbol];
                        let slowValue = method[slowSymbol];
                        if (typeof timeoutValue === "number") {
                            target.timeout(timeoutValue);
                        }
                        if (typeof slowValue === "number") {
                            target.slow(slowValue);
                        }
                    }

                    let shouldSkip = method[skipSymbol];
                    let shouldOnly = method[onlySymbol];

                    let testFunc = (shouldSkip && skipFunction)
                        || (shouldOnly && onlyFunction)
                        || itFunction;

                    if (testName) {
                        if (method.length == 0) {
                            testFunc(testName, function () {
                                applyTimes(this);
                                return method.apply(instance);
                            });
                        } else if (method.length == 1) {
                            testFunc(testName, function (done) {
                                applyTimes(this);
                                return method.call(instance, done);
                            });
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
export function slow(time: number): PropertyDecorator {
    return (target: Object, propertyKey: string | symbol): void => {
        target[propertyKey][slowSymbol] = time;
    }
}

/**
 * Set a test method timeout time.
 * @param time The time in miliseconds.
 */
export function timeout(time: number): PropertyDecorator {
    return (target: Object, propertyKey: string | symbol): void => {
        target[propertyKey][timeoutSymbol] = time;
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
