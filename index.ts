declare function Symbol(description: string): symbol;

declare var global: any;
let describeFunction = global.describe;
let itFunction = global.it;
let skipFunction = itFunction.skip;
let onlyFunction = itFunction.only;
let beforeAll = global.before;
let beforeEach = global.beforeEach;
let afterAll = global.after;
let afterEach = global.afterEach;

let testNameSymbol = Symbol("test");
let instanceSymbol = Symbol("instance");
let slowSymbol = Symbol("slow");
let timeoutSymbol = Symbol("timout");
let onlySymbol = Symbol("only");
let skipSymbol = Symbol("skip");

interface SuiteCtor {
    before?();
    after?();
    new();
}
interface SuiteProto {
    before?();
    after?();
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
    let result = (target: SuiteCtor) => {
        let targetName = decoratorName || (<any>target).name;
        describeFunction(targetName, function() {
            beforeAll(function() {
                target.before && target.before();
            });
            afterAll(function() {
                target.after && target.after();
            });
            let prototype: SuiteProto = target.prototype;
            beforeEach(function() {
                let instance = new target;
                this[instanceSymbol] = instance;
                prototype.before && prototype.before.call(instance);
            });
            afterEach(function() {
                let instance = this[instanceSymbol];
                prototype.after && prototype.after.call(instance);
                this[instanceSymbol] = undefined;
            });
            for (let key in prototype) {
                (function forInstanceMethod() {
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
                            testFunc(testName, function() {
                                applyTimes(this);
                                let instance = this[instanceSymbol];
                                return method.apply(instance);
                            });
                        } else if (method.length == 1) {
                            testFunc(testName, function(done) {
                                applyTimes(this);
                                let instance = this[instanceSymbol];
                                return method.call(instance, done);
                            });
                        }
                    }
                })();
            }
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
        let targetName = decoratorName || propertyKey;
        target[propertyKey][testNameSymbol] = targetName;
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
