import * as Mocha from "mocha";
import * as Suite from "mocha/lib/suite";
import * as Test from "mocha/lib/test";
import * as Common from "mocha/lib/interfaces/common";

interface TestFunctions {
	it: {
		(name: string, fn: Function): void,
		only(name: string, fn: Function): void;
		skip(name: string, fn?: Function): void;
	},
	describe: {
		(name: string, fn: Function): void,
		only(name: string, fn: Function): void;
		skip(name: string, fn?: Function): void;
	},
	before: any,
	after: any,
	beforeEach: any,
	afterEach: any
}

const globalTestFunctions: TestFunctions = {
	get describe() { return (<any>global).describe; },
	get it() { return (<any>global).it; },
	get before() { return (<any>global).before; },
	get after() { return (<any>global).after; },
	get beforeEach() { return (<any>global).beforeEach; },
	get afterEach() { return (<any>global).afterEach; }
};

// key => Symbol("mocha-typescript:" + key)
let nodeSymbol = key => "__mts_" + key;

let testNameSymbol = nodeSymbol("test");
let slowSymbol = nodeSymbol("slow");
let timeoutSymbol = nodeSymbol("timout");
let retriesSymbol = nodeSymbol("retries");
let onlySymbol = nodeSymbol("only");
let pendingSumbol = nodeSymbol("pending");
let skipSymbol = nodeSymbol("skip");
let traitsSymbol = nodeSymbol("traits");
let isTraitSymbol = nodeSymbol("isTrait");
let contextSymbol = nodeSymbol("context");
let handled = nodeSymbol("handled");

interface MochaDone {
    (error?: any): any;
}

interface SuiteCtor {
	prototype: SuiteProto;
	before?: (done?: MochaDone) => void;
	after?: (done?: MochaDone) => void;
	new();
}
interface SuiteProto {
	before?: (done?: MochaDone) => void;
	after?: (done?: MochaDone) => void;
}

export interface SuiteTrait {
	(this: Mocha.ISuiteCallbackContext, ctx: Mocha.ISuiteCallbackContext, ctor: SuiteCtor): void;
}
export interface TestTrait {
	(this: Mocha.ITestCallbackContext, ctx: Mocha.ITestCallbackContext, instance: SuiteProto, method: Function): void;
}

const noname = cb => cb;

function applyDecorators(mocha: Mocha.IHookCallbackContext | Mocha.ISuiteCallbackContext, ctorOrProto, method, instance) {
	const timeoutValue = method[timeoutSymbol];
	if (typeof timeoutValue === "number") {
		mocha.timeout(timeoutValue);
	}
	const slowValue = method[slowSymbol];
	if (typeof slowValue === "number") {
		mocha.slow(slowValue);
	}
	const retriesValue = method[retriesSymbol];
	if (typeof retriesValue === "number") {
		mocha.retries(retriesValue);
	}
	const contextProperty = ctorOrProto[contextSymbol];
	if (contextProperty) {
		instance[contextProperty] = mocha;
	}
}
function applyTestTraits(context: Mocha.ITestCallbackContext, instance: SuiteProto, method: Function) {
	const traits: TestTrait[] = method[traitsSymbol];
	if (traits) {
		traits.forEach(trait => {
			trait.call(context, context, instance, method);
		});
	}
}
function applySuiteTraits(context: Mocha.ISuiteCallbackContext, target: SuiteCtor) {
	const traits: SuiteTrait[] = target[traitsSymbol];
	if (traits) {
		traits.forEach(trait => {
			trait.call(context, context, target);
		});
	}
}

function suiteClassCallback(target: SuiteCtor, context: TestFunctions) {
	return function () {
		applySuiteTraits(this, target);
		applyDecorators(this, target, target, target);
		let instance;
		if (target.before) {
			if (target.before.length > 0) {
				context.before(function (done) {
					applyDecorators(this, target, target.before, target);
					return target.before(done);
				});
			} else {
				context.before(function () {
					applyDecorators(this, target, target.before, target);
					return target.before();
				});
			}
		}
		if (target.after) {
			if (target.after.length > 0) {
				context.after(function (done) {
					applyDecorators(this, target, target.after, target);
					return target.after(done);
				});
			} else {
				context.after(function () {
					applyDecorators(this, target, target.after, target);
					return target.after();
				});
			}
		}
		let prototype = target.prototype;
		let beforeEachFunction: { (): any } | { (done: Function): any };
		if (prototype.before) {
			if (prototype.before.length > 0) {
				beforeEachFunction = noname(function (this: Mocha.IHookCallbackContext, done: Function) {
					instance = new target();
					applyDecorators(this, prototype, prototype.before, instance);
					return prototype.before.call(instance, done);
				});
			} else {
				beforeEachFunction = noname(function (this: Mocha.IHookCallbackContext) {
					instance = new target();
					applyDecorators(this, prototype, prototype.before, instance);
					return prototype.before.call(instance);
				});
			}
		} else {
			beforeEachFunction = noname(function (this: Mocha.IHookCallbackContext) {
				instance = new target();
			});
		}
		context.beforeEach(beforeEachFunction);

		let afterEachFunction: { (): any } | { (done: Function): any };
		if (prototype.after) {
			if (prototype.after.length > 0) {
				afterEachFunction = noname(function (this: Mocha.IHookCallbackContext, done) {
					try {
						applyDecorators(this, prototype, prototype.after, instance);
						return prototype.after.call(instance, done);
					} finally {
						instance = undefined;
					}
				});
			} else {
				afterEachFunction = noname(function (this: Mocha.IHookCallbackContext) {
					try {
						applyDecorators(this, prototype, prototype.after, instance);
						return prototype.after.call(instance);
					} finally {
						instance = undefined;
					}
				});
			}
		} else {
			afterEachFunction = noname(function (this: Mocha.IHookCallbackContext) {
				instance = undefined;
			});
		}
		context.afterEach(afterEachFunction);

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

				let testFunc = (shouldSkip && context.it.skip)
					|| (shouldOnly && context.it.only)
					|| context.it;

				if (testName || shouldOnly || shouldPending || shouldSkip) {
					testName = testName || (<any>method).name;
					if (shouldPending && !shouldSkip && !shouldOnly) {
						context.it.skip(testName);
					} else if (method.length > 0) {
						testFunc(testName, noname(function (this: Mocha.ITestCallbackContext, done) {
							applyDecorators(this, prototype, method, instance);
							applyTestTraits(this, instance, method);
							return method.call(instance, done);
						}));
					} else {
						testFunc(testName, noname(function (this: Mocha.ITestCallbackContext) {
							applyDecorators(this, prototype, method, instance);
							applyTestTraits(this, instance, method);
							return method.call(instance);
						}));
					}
				}
			} catch (e) {
				// console.log(e);
			}
		});
	}
}

function suiteOverload(overloads: {
	suite(name: string, fn: Function): any;
	suiteCtor(ctor: SuiteCtor): void;
	suiteDecorator(... traits: SuiteTrait[]): ClassDecorator;
	suiteDecoratorNamed(name: string, ... traits: SuiteTrait[]): ClassDecorator;
}) {
	return function() {
		if (arguments.length == 2 && typeof arguments[0] === "string" && typeof arguments[1] === "function" && !arguments[1][isTraitSymbol]) {
			return overloads.suite.apply(this, arguments);
		} else if (arguments.length === 1 && typeof arguments[0] === "function" && !arguments[0][isTraitSymbol]) {
			overloads.suiteCtor.apply(this, arguments);
		} else if (arguments.length >= 1 && typeof arguments[0] === "string") {
			return overloads.suiteDecoratorNamed.apply(this, arguments);
		} else {
			return overloads.suiteDecorator.apply(this, arguments);
		}
	}
}

function makeSuiteFunction(suiteFunc: (ctor?: SuiteCtor) => Function, context: TestFunctions) {
	return suiteOverload({
		suite(name: string, fn: Function): any {
			return suiteFunc()(name, fn);
		},
		suiteCtor(ctor: SuiteCtor): void {
			suiteFunc(ctor)(ctor.name, suiteClassCallback(ctor, context));
		},
		suiteDecorator(... traits: SuiteTrait[]): ClassDecorator {
			return function<TFunction extends Function>(ctor: TFunction): void {
				ctor[traitsSymbol] = traits;
				suiteFunc(<any>ctor)(ctor.name, suiteClassCallback(<any>ctor, context));
			}
		},
		suiteDecoratorNamed(name: string, ... traits: SuiteTrait[]): ClassDecorator {
			return function<TFunction extends Function>(ctor: TFunction): void {
				ctor[traitsSymbol] = traits;
				suiteFunc(<any>ctor)(name, suiteClassCallback(<any>ctor, context));
			}
		}
	});
}

function suiteFuncCheckingDecorators(context: TestFunctions) {
	return function(ctor?: SuiteCtor) {
		if (ctor) {
			let shouldSkip = ctor[skipSymbol];
			let shouldOnly = ctor[onlySymbol];
			let shouldPending = ctor[pendingSumbol];
			return (shouldSkip && context.describe.skip)
				|| (shouldOnly && context.describe.only)
				|| (shouldPending && context.describe.skip)
				|| context.describe;
		} else {
			return context.describe;
		}
	}
}

function makeSuiteObject(context: TestFunctions): Suite {
	return Object.assign(makeSuiteFunction(suiteFuncCheckingDecorators(context), context), {
		skip: makeSuiteFunction(() => context.describe.skip, context),
		only: makeSuiteFunction(() => context.describe.only, context),
		pending: makeSuiteFunction(() => context.describe.skip, context)
	});
}
export const suite = makeSuiteObject(globalTestFunctions);

function testOverload(overloads: {
	test(name: string, fn: Function);
	testProperty(target: Object, propertyKey: string | symbol, descriptor?: PropertyDescriptor): void;
	testDecorator(... traits: TestTrait[]): PropertyDecorator & MethodDecorator;
	testDecoratorNamed(name: string, ... traits: TestTrait[]): PropertyDecorator & MethodDecorator;
}) {
	return function() {
		if (arguments.length == 2 && typeof arguments[0] === "string" && typeof arguments[1] === "function" && !arguments[1][isTraitSymbol]) {
			return overloads.test.apply(this, arguments);
		} else if (arguments.length >= 2 && typeof arguments[0] !== "string" && typeof arguments[0] !== "function") {
			overloads.testProperty.apply(this, arguments);
		} else if (arguments.length >= 1 && typeof arguments[0] === "string") {
			return overloads.testDecoratorNamed.apply(this, arguments);
		} else {
			return overloads.testDecorator.apply(this, arguments);
		}
	}
}

function makeTestFunction(testFunc: () => Function, mark: null | string | symbol) {
	return testOverload({
		test(name: string, fn: Function) {
			testFunc()(name, fn);
		},
		testProperty(target: Object, propertyKey: string | symbol, descriptor?: PropertyDescriptor): void {
			target[propertyKey][testNameSymbol] = propertyKey ? propertyKey.toString() : "";
			mark && (target[propertyKey][mark] = true);
		},
		testDecorator(... traits: TestTrait[]): PropertyDecorator & MethodDecorator {
			return function(target: Object, propertyKey: string | symbol, descriptor?: PropertyDescriptor): void {
				target[propertyKey][testNameSymbol] = propertyKey ? propertyKey.toString() : "";
				target[propertyKey][traitsSymbol] = traits;
				mark && (target[propertyKey][mark] = true);
			}
		},
		testDecoratorNamed(name: string, ... traits: TestTrait[]): PropertyDecorator & MethodDecorator {
			return function(target: Object, propertyKey: string | symbol, descriptor?: PropertyDescriptor): void {
				target[propertyKey][testNameSymbol] = name;
				target[propertyKey][traitsSymbol] = traits;
				mark && (target[propertyKey][mark] = true);
			}
		}
	});
}
function makeTestObject(context: TestFunctions): Test {
	return Object.assign(makeTestFunction(() => context.it, null), {
		skip: makeTestFunction(() => context.it.skip, skipSymbol),
		only: makeTestFunction(() => context.it.only, onlySymbol),
		pending: makeTestFunction(() => context.it.skip, pendingSumbol)
	});
}
export const test = makeTestObject(globalTestFunctions);

export function trait<T extends SuiteTrait | TestTrait>(arg: T): T {
	arg[isTraitSymbol] = true;
	return arg;
}

/**
 * Set a test method execution time that is considered slow.
 * @param time The time in miliseconds.
 */
export function slow(time: number): PropertyDecorator & ClassDecorator & SuiteTrait & TestTrait {
	return trait(function() {
		if (arguments.length === 1) {
			const target = arguments[0];
			target[slowSymbol] = time;
		} else if (arguments.length === 2 && typeof arguments[1] === "string" || typeof arguments[1] === "symbol") {
			const target = arguments[0];
			const property = arguments[1];
			target[property][slowSymbol] = time;
		} else if (arguments.length === 2) {
			const context: Mocha.ISuiteCallbackContext = arguments[0];
			const ctor = arguments[1];
			context.slow(time);
		} else if (arguments.length === 3) {
			if (typeof arguments[2] === "function") {
				const context: Mocha.ITestCallbackContext = arguments[0];
				const instance = arguments[1];
				const method = arguments[2];
				context.slow(time);
			} else if (typeof arguments[1] === "string" || typeof arguments[1] === "symbol") {
				const proto: Mocha.ITestCallbackContext = arguments[0];
				const prop = arguments[1];
				const descriptor = arguments[2];
				proto[prop][slowSymbol] = time;
			}
		}
	});
}

/**
 * Set a test method or suite timeout time.
 * @param time The time in miliseconds.
 */
export function timeout(time: number): MethodDecorator & PropertyDecorator & ClassDecorator & SuiteTrait & TestTrait {
	return trait(function() {
		if (arguments.length === 1) {
			const target = arguments[0];
			target[timeoutSymbol] = time;
		} else if (arguments.length === 2 && typeof arguments[1] === "string" || typeof arguments[1] === "symbol") {
			const target = arguments[0];
			const property = arguments[1];
			target[property][timeoutSymbol] = time;
		} else if (arguments.length === 2) {
			const context: Mocha.ISuiteCallbackContext = arguments[0];
			const ctor = arguments[1];
			context.timeout(time);
		} else if (arguments.length === 3) {
			if (typeof arguments[2] === "function") {
				const context: Mocha.ITestCallbackContext = arguments[0];
				const instance = arguments[1];
				const method = arguments[2];
				context.timeout(time);
			} else if (typeof arguments[1] === "string" || typeof arguments[1] === "symbol") {
				const proto: Mocha.ITestCallbackContext = arguments[0];
				const prop = arguments[1];
				const descriptor = arguments[2];
				proto[prop][timeoutSymbol] = time;
			}
		}
	});
}

/**
 * Set a test method or site retries count.
 * @param count The number of retries to attempt when running the test.
 */
export function retries(count: number): MethodDecorator & PropertyDecorator & ClassDecorator & SuiteTrait & TestTrait {
	return trait(function() {
		if (arguments.length === 1) {
			const target = arguments[0];
			target[retriesSymbol] = count;
		} else if (arguments.length === 2 && typeof arguments[1] === "string" || typeof arguments[1] === "symbol") {
			const target = arguments[0];
			const property = arguments[1];
			target[property][retriesSymbol] = count;
		} else if (arguments.length === 2) {
			const context: Mocha.ISuiteCallbackContext = arguments[0];
			const ctor = arguments[1];
			context.retries(count);
		} else if (arguments.length === 3) {
			if (typeof arguments[2] === "function") {
				const context: Mocha.ITestCallbackContext = arguments[0];
				const instance = arguments[1];
				const method = arguments[2];
				context.retries(count);
			} else if (typeof arguments[1] === "string" || typeof arguments[1] === "symbol") {
				const proto: Mocha.ITestCallbackContext = arguments[0];
				const prop = arguments[1];
				const descriptor = arguments[2];
				proto[prop][retriesSymbol] = count;
			}
		}
	});
}

export const skipOnError: SuiteTrait = trait(function(ctx, ctor) {
    ctx.beforeEach(function() {
        if (ctor.__skip_all) {
            this.skip();
        }
    });
    ctx.afterEach(function() {
        if (this.currentTest.state === "failed") {
            ctor.__skip_all = true;
        }
    });
});

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

/**
 * Rip-off the TDD and BDD at: mocha/lib/interfaces/tdd.js and mocha/lib/interfaces/bdd.js
 * Augmented the suite and test for the mocha-typescript decorators.
 */
function tsdd(suite) {
	var suites = [suite];

	suite.on('pre-require', function (context, file, mocha) {
		var common = Common(suites, context, mocha);

		context.before = common.before;
		context.after = common.after;
		context.beforeEach = common.beforeEach;
		context.afterEach = common.afterEach;
		context.run = mocha.options.delay && common.runWithSuite(suite);

		// Copy of bdd
		context.describe = context.context = function (title, fn) {
			return common.suite.create({
				title: title,
				file: file,
				fn: fn
			});
		};
		context.xdescribe = context.xcontext = context.describe.skip = function (title, fn) {
			return common.suite.skip({
				title: title,
				file: file,
				fn: fn
			});
		};
		context.describe.only = function (title, fn) {
			return common.suite.only({
				title: title,
				file: file,
				fn: fn
			});
		};
		context.it = context.specify = function (title, fn) {
			var suite = suites[0];
			if (suite.isPending()) {
				fn = null;
			}
			var test = new Test(title, fn);
			test.file = file;
			suite.addTest(test);
			return test;
		};
		context.it.only = function (title, fn) {
			return common.test.only(mocha, context.it(title, fn));
		};
		context.xit = context.xspecify = context.it.skip = function (title) {
			context.it(title);
		};
		context.it.retries = function (n) {
			context.retries(n);
		};

		context.suite = makeSuiteObject(context);
		context.test = makeTestObject(context);

		context.test.retries = common.test.retries;

		context.timeout = timeout;
		context.slow = slow;
		context.retries = retries;
		context.skipOnError = skipOnError;
	});
};
module.exports = Object.assign(tsdd, exports);
