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
	it: Mocha.ITestDefinition,
	describe: Mocha.IContextDefinition
	before: BeforeAfterCallback,
	after: BeforeAfterCallback,
	beforeEach: BeforeAfterEachCallback,
	afterEach: BeforeAfterEachCallback,
}

declare var global: {
	it: ItFunction,
	describe: DescribeFunction,
	before: BeforeAfterCallback,
	after: BeforeAfterCallback,
	beforeEach: BeforeAfterEachCallback,
	afterEach: BeforeAfterEachCallback
};

const globalTestFunctions: TestFunctions = {
	get describe() { return global.describe; },
	get it() { return global.it; },
	get before() { return global.before; },
	get after() { return global.after; },
	get beforeEach() { return global.beforeEach; },
	get afterEach() { return global.afterEach; }
};

// key => Symbol("mocha-typescript:" + key)
let nodeSymbol = key => "__mts_" + key;

let testNameSymbol = nodeSymbol("test");
let slowSymbol = nodeSymbol("slow");
let timeoutSymbol = nodeSymbol("timout");
let onlySymbol = nodeSymbol("only");
let pendingSumbol = nodeSymbol("pending");
let skipSymbol = nodeSymbol("skip");
let traitsSymbol = nodeSymbol("traits");
let isTraitSymbol = nodeSymbol("isTrait");
let contextSymbol = nodeSymbol("context");
let handled = nodeSymbol("handled");

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

const noname = cb => cb;

function makeTestFunction(target: SuiteCtor, context: TestFunctions) {
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

function makeSuiteUI(type?: "skip" | "only" | "pending") {
	return function suite() {
		if (arguments.length === 0) {
			return suite;
		} else if (typeof arguments[0] === "function" && !arguments[0][isTraitSymbol]) {
			const target: SuiteCtor = arguments[0];
			let suiteFunc;

			switch(type) {
				case "pending":
				case "skip":
					suiteFunc = global.describe.skip;
					break;
				case "only":
					suiteFunc = global.describe.only;
					break;
				default:
					let shouldSkip = target[skipSymbol];
					let shouldOnly = target[onlySymbol];
					let shouldPending = target[pendingSumbol];

					suiteFunc = (shouldSkip && global.describe.skip)
						|| (shouldOnly && global.describe.only)
						|| (shouldPending && global.describe.skip)
						|| global.describe;
					break;
			}
			suiteFunc(target.name, makeTestFunction(target, globalTestFunctions));
		} else {
			let decoratorName = undefined;
			let traits: SuiteTrait[] = [];
			if (typeof arguments[0] === "string") {
				decoratorName = arguments[0];
				for (let i = 1; i < arguments.length; i++) {
					traits.push(arguments[i]);
				}
			} else {
				for (let i = 0; i < arguments.length; i++) {
					traits.push(arguments[i]);
				}
			}
			return function(target: SuiteCtor) {
				if (traits.length > 0) {
					target[traitsSymbol] = traits;
				}
				let suiteFunc;
				switch(type) {
					case "pending":
					case "skip":
						suiteFunc = global.describe.skip;
						break;
					case "only":
						suiteFunc = global.describe.only;
						break;
					default:
						suiteFunc = global.describe;
						break;
				}
				suiteFunc(decoratorName || target.name, makeTestFunction(target, globalTestFunctions));
			}
		}
	}
}
export const suite: Suite = Object.assign(makeSuiteUI(), {
	skip: makeSuiteUI("skip"),
	only: makeSuiteUI("only"),
	pending: makeSuiteUI("pending")
});

export interface Test {
	(name: string, ...traits: TestTrait[]): PropertyDecorator;
	(...traits: TestTrait[]): PropertyDecorator;
	(target: Object, propertyKey: string | symbol): void;
	readonly skip: {
		(name: string, ...traits: TestTrait[]): PropertyDecorator;
		(...traits: TestTrait[]): PropertyDecorator;
		(target: Object, propertyKey: string | symbol): void;
	}
	readonly only: {
		(name: string, ...traits: TestTrait[]): PropertyDecorator;
		(...traits: TestTrait[]): PropertyDecorator;
		(target: Object, propertyKey: string | symbol): void;
	}
	readonly pending: {
		(name: string, ...traits: TestTrait[]): PropertyDecorator;
		(...traits: TestTrait[]): PropertyDecorator;
		(target: Object, propertyKey: string | symbol): void;
	}
}

function makeTestUI(type?: "skip" | "only" | "pending") {
	return function test() {
		if (arguments.length === 0) {
			return test;
		} else if (typeof arguments[0] !== "string" && typeof arguments[0] !== "function") {
			const target = arguments[0];
			const property = arguments[1];
			target[property][testNameSymbol] = property;
			switch (type) {
				case "skip": target[property][skipSymbol] = true; break;
				case "only": target[property][onlySymbol] = true; break;
				case "pending": target[property][pendingSumbol] = true; break;
			}
		} else {
			let decoratorName = undefined;
			let traits: TestTrait[] = [];
			if (typeof arguments[0] === "string") {
				decoratorName = arguments[0];
				for (let i = 1; i < arguments.length; i++) {
					traits.push(arguments[i]);
				}
			} else {
				for (let i = 0; i < arguments.length; i++) {
					traits.push(arguments[i]);
				}
			}
			return (target: Object, property: string | symbol) => {
				target[property][testNameSymbol] = decoratorName || property;
				if (traits.length > 0) {
					target[property][traitsSymbol] = traits;
				}
				switch (type) {
					case "skip": target[property][skipSymbol] = true; break;
					case "only": target[property][onlySymbol] = true; break;
					case "pending": target[property][pendingSumbol] = true; break;
				}
			}
		}
	}
}
export const test: Test = Object.assign(makeTestUI(), {
	skip: makeTestUI("skip"),
	only: makeTestUI("only"),
	pending: makeTestUI("pending")
});

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

export const skipOnError: SuiteTrait = trait(function(ctx, ctor) {
    beforeEach(function() {
        if (ctor.__skip_all) {
            this.skip();
        }
    });
    afterEach(function() {
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
