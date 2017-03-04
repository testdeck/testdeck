import * as Mocha from "mocha";
import * as Suite from "mocha/lib/suite";
import * as Test from "mocha/lib/test";
import * as Common from "mocha/lib/interfaces/common";

declare module "mocha" {
	export namespace Mocha {
		export interface IContextDefinition {
			/**
			 * Decorate a class to mark it as a test suite.
			 */
			(name: string): ClassDecorator;
			/**
			 * Decorate a class to mark it as a test suite. Also provide a custom name.
			 */
			<TFunction extends Function>(target: TFunction): TFunction | void;
		}
		export interface ITestDefinition {
			/**
			 * Decorate a suite class method as test.
			 */
			(target: Object, propertyKey: string | symbol, descriptor: PropertyDescriptor): void;
		}
	}
}

type BeforeAfterCallback = typeof before;
type BeforeAfterEachCallback = typeof after;
type DescribeFunction = typeof describe;
type ItFunction = typeof it;
type SkipFunction = typeof it.skip;
type OnlyFunction = typeof it.only;
type TestCallback = (this: Mocha.ITestCallbackContext, done: MochaDone) => any

interface TestFunctions {
	before: BeforeAfterCallback,
	after: BeforeAfterCallback,
	beforeEach: BeforeAfterEachCallback,
	afterEach: BeforeAfterEachCallback,
	it: Mocha.ITestDefinition
}

declare var global: {
	describe: DescribeFunction,
	it: ItFunction,
	before: BeforeAfterCallback,
	beforeEach: BeforeAfterEachCallback,
	after: BeforeAfterCallback,
	afterEach: BeforeAfterEachCallback
};

const globalTestFunctions: TestFunctions = {
	it: global.it,
	before: global.before,
	beforeEach: global.beforeEach,
	after: global.after,
	afterEach: global.afterEach
};

let describeFunction = global.describe;
let skipSuiteFunction = describeFunction && describeFunction.skip;
let onlySuiteFunction = describeFunction && describeFunction.only;

// key => Symbol("mocha-typescript:" + key)
let nodeSymbol = key => "__mts_" + key;

let testNameSymbol = nodeSymbol("test");
let slowSymbol = nodeSymbol("slow");
let timeoutSymbol = nodeSymbol("timout");
let onlySymbol = nodeSymbol("only");
let pendingSumbol = nodeSymbol("pending");
let skipSymbol = nodeSymbol("skip");
let contextSymbol = nodeSymbol("context");
let handled = nodeSymbol("handled");

interface SuiteCtor {
	before?: (done?: MochaDone) => void;
	after?: (done?: MochaDone) => void;
	new ();
}
interface SuiteProto {
	before?: (done?: MochaDone) => void;
	after?: (done?: MochaDone) => void;
}

function applyDecorators(mocha: Mocha.IHookCallbackContext | Mocha.ISuiteCallbackContext, ctorOrProto, method, instance) {
	const timeoutValue = method[timeoutSymbol];
	if (typeof timeoutValue === "number") {
		mocha.timeout(timeoutValue);
	}
	const slowValue = method[slowSymbol];
	if (typeof slowValue === "number") {
		(<Mocha.ISuiteCallbackContext>mocha).slow(slowValue);
	}
	const contextProperty = ctorOrProto[contextSymbol];
	if (contextProperty) {
		instance[contextProperty] = mocha;
	}
}

const noname = cb => cb;

function makeTestFunction(target: SuiteCtor, { before, after, beforeEach, afterEach, it }: TestFunctions) {
	const skipFunction = it.skip;
	const onlyFunction = it.only;
	const pendingFunction = skipFunction;
	return function () {
		applyDecorators(this, target, target, target);
		let instance;
		if (target.before) {
			if (target.before.length > 0) {
				before(function (done) {
					applyDecorators(this, target, target.before, target);
					return target.before(done);
				});
			} else {
				before(function () {
					applyDecorators(this, target, target.before, target);
					return target.before();
				});
			}
		}
		if (target.after) {
			if (target.after.length > 0) {
				after(function (done) {
					applyDecorators(this, target, target.after, target);
					return target.after(done);
				});
			} else {
				after(function () {
					applyDecorators(this, target, target.after, target);
					return target.after();
				});
			}
		}
		let prototype: SuiteProto = target.prototype;
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
		beforeEach(beforeEachFunction);

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
					|| it;

				if (testName || shouldOnly || shouldPending || shouldSkip) {
					testName = testName || (<any>method).name;
					if (shouldPending && !shouldSkip && !shouldOnly) {
						pendingFunction(testName);
					} else if (method.length > 0) {
						testFunc(testName, noname(function (this: Mocha.IHookCallbackContext, done) {
							applyDecorators(this, prototype, method, instance);
							return method.call(instance, done);
						}));
					} else {
						testFunc(testName, noname(function (this: Mocha.IHookCallbackContext) {
							applyDecorators(this, prototype, method, instance);
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

		suiteFunc(targetName, makeTestFunction(target, globalTestFunctions));
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
	return function <TFunction extends Function>(target: Object, propertyKey?: string | symbol): void {
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
	return function <TFunction extends Function>(target: Object | TFunction, propertyKey?: string | symbol): void {
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

		// Processing decorators for mocha-typescript
		function makeClassSuite(title: string, target: SuiteCtor) {
			const shouldSkip = target[skipSymbol];
			const shouldOnly = target[onlySymbol];
			const shouldPending = target[pendingSumbol];

			const fn = makeTestFunction(target, context);

			if (shouldOnly) {
				return context.suite.only({ title, file, fn });
			} else if (shouldSkip || shouldPending) {
				return context.suite.skip({ title, file, fn });
			} else {
				return common.suite.create({ title, file, fn });
			}
		}

		// tdd + mocha-typescript decorators
		context.suite = function (arg1, arg2) {
			if (typeof arg1 === "string" && arguments.length === 1) {
				return function (target: SuiteCtor) {
					makeClassSuite(arg1, target);
				}
			} else if (typeof arg1 === "function") {
				return makeClassSuite(arg1.name, arg1);
			} else {
				let title = arg1;
				let fn = arg2;
				return common.suite.create({
					title: title,
					file: file,
					fn: fn
				});
			}
		};
		context.suite.skip = function (title, fn) {
			return common.suite.skip({
				title: title,
				file: file,
				fn: fn
			});
		};
		context.suite.only = function (title, fn) {
			return common.suite.only({
				title: title,
				file: file,
				fn: fn
			});
		};

		context.test = function (arg1, arg2, arg3) {
			if (typeof arg1 === "string" && arguments.length === 1) {
				return exports.test(arg1);
			} else if (typeof arg1 === "object" && (typeof arg2 === "string" || typeof arg2 === "symbol") && arguments.length >= 2) {
				return exports.test(arg1, arg2);
			} else {
				let title = arg1;
				let fn = arg2;
				var suite = suites[0];
				if (suite.isPending()) {
					fn = null;
				}
				var test = new Test(title, fn);
				test.file = file;
				suite.addTest(test);
				return test;
			}
		};
		context.test.only = function (title, fn) {
			return common.test.only(mocha, context.test(title, fn));
		};

		context.test.skip = common.test.skip;
		context.test.retries = common.test.retries;
	});
};
module.exports = Object.assign(tsdd, exports);
