// Copyright 2022 Testdeck Team and Contributors
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import { AFTER, BEFORE, ClassTestUI, ConditionalSuiteOptions, ConditionalTestOptions, Constructor, EffectiveHookOptions, EffectiveSuiteOptions, EffectiveTestOptions, HookDecorator, HookMethod, HookOptions, OPTIONS, ParameterHolder, PARAMETERS, Prototype, SUITE, SuiteDecorator, SuiteOptions, TEST, TestDecorator, TestFrameworkAdapter, TestMethod, TestOptions, wrap } from "../index";

export class HookInfo {
    name: string = null;
    kind: symbol = null;
    userOptions: HookOptions = {};
    effectiveOptions: EffectiveHookOptions = undefined;
    hookSymbolWasSet = false;
    isStaticHook = false;
    hookWasRegisteredWith: "beforeAll" | "afterAll" | "beforeEach" | "afterEach" = undefined;
    methodWasCalled = false;
}

export class ParameterizedTestInfo {
    name: string = null;
    itWasCalled = false;
    methodWasCalled = false;
}

export class TestInfo {
    name: string = null;
    testSymbolIsSet = false;
    paramsSymbolIsSet = false;
    userOptions: TestOptions | ConditionalTestOptions = {};
    effectiveOptions: EffectiveTestOptions = {};
    params: ParameterHolder[] = [];
    itWasCalled = false;
    methodWasCalled = false;
    parameterizedInstances: ParameterizedTestInfo[] = [];
}

export class SuiteInfo {
    suiteSymbolIsSet = false;
    inheritanceWasPrevented = false;
    userOptions: SuiteOptions | ConditionalSuiteOptions = {};
    effectiveOptions: EffectiveSuiteOptions = {};
    children: (TestInfo | HookInfo)[] = [];
    childSuites: string[] = [];
    describeWasCalled = false;
    constructorWasCalled = false;
    executionOrder: string[] = [];
}

export class LoggingClassTestUI extends ClassTestUI {
    public readonly Suite: SuiteDecorator;
    public readonly Test: TestDecorator;
    public readonly Before: HookDecorator;
    public readonly After: HookDecorator;

    constructor() {
        super(new LoggingAdapter());

        this.Suite = this.makeSuiteDecoratorAdapter(this.Suite);
        this.Test = this.makeTestDecoratorAdapter(this.Test);
        this.Before = this.makeHookDecoratorAdapter(this.Before, BEFORE);
        this.After = this.makeHookDecoratorAdapter(this.After, AFTER);
    }

    protected createInstance(cls: Constructor): object {
        this.loggingAdapter.suite.constructorWasCalled = true;
        return super.createInstance(cls);
    }

    private makeSuiteDecoratorAdapter(superSuite: SuiteDecorator): SuiteDecorator {
        /* eslint-disable-next-line @typescript-eslint/ban-types */
        const recordDecoratorBehavior = (decorator: ClassDecorator, target: Function, options: SuiteOptions): void => {
            const suiteInfo = this.loggingAdapter.suite;
            suiteInfo.userOptions = options;
            try {
                decorator(target);
                suiteInfo.suiteSymbolIsSet = (target[SUITE] || false) as boolean;
                suiteInfo.effectiveOptions = target[OPTIONS] as EffectiveSuiteOptions;
            } catch (e) {
                if (e instanceof Error) {
                    if (e.message.includes("cannot subclass other")) {
                        suiteInfo.inheritanceWasPrevented = true;
                    } else {
                        throw e;
                    }
                }
            }
        }

        const decoratorAdapter = wrap((options: SuiteOptions): ClassDecorator => {
            /* eslint-disable-next-line @typescript-eslint/ban-types */
            return <TFunction extends Function>(target: TFunction): void => {
                const decorator: ClassDecorator = superSuite(options);
                recordDecoratorBehavior(decorator, target, options || {});
            };
        }, superSuite);

        (decoratorAdapter as SuiteDecorator).Skip = wrap((options: ConditionalSuiteOptions): ClassDecorator => {
            /* eslint-disable-next-line @typescript-eslint/ban-types */
            return <TFunction extends Function>(target: TFunction): void => {
                const decorator: ClassDecorator = superSuite.Skip(options);
                recordDecoratorBehavior(decorator, target, options || {});
            };
            /* eslint-disable-next-line @typescript-eslint/unbound-method */
        }, superSuite.Skip);

        (decoratorAdapter as SuiteDecorator).Focus = wrap((options: ConditionalSuiteOptions): ClassDecorator => {
            /* eslint-disable-next-line @typescript-eslint/ban-types */
            return <TFunction extends Function>(target: TFunction): void => {
                const decorator: ClassDecorator = superSuite.Focus(options);
                recordDecoratorBehavior(decorator, target, options || {});
            };
            /* eslint-disable-next-line @typescript-eslint/unbound-method */
        }, superSuite.Focus);

        (decoratorAdapter as SuiteDecorator).Pending = wrap((options: ConditionalSuiteOptions): ClassDecorator => {
            /* eslint-disable-next-line @typescript-eslint/ban-types */
            return <TFunction extends Function>(target: TFunction): void => {
                const decorator: ClassDecorator = superSuite.Pending(options);
                recordDecoratorBehavior(decorator, target, options || {});
            };
            /* eslint-disable-next-line @typescript-eslint/unbound-method */
        }, superSuite.Pending);

        return decoratorAdapter as SuiteDecorator;
    }

    private makeTestDecoratorAdapter(superTest: TestDecorator): TestDecorator {

        const recordDecoratorBehavior = <T>(decorator: MethodDecorator, target: Prototype, propertyKey: string, descriptor: TypedPropertyDescriptor<T>, options: TestOptions): void => {
            const testInfo = new TestInfo();
            decorator(target, propertyKey, descriptor);
            testInfo.userOptions = options;
            const method = target[propertyKey] as TestMethod;
            testInfo.testSymbolIsSet = (method[TEST] || false) as boolean;
            testInfo.effectiveOptions = method[OPTIONS] as EffectiveTestOptions;
            testInfo.name = testInfo.effectiveOptions.name;
            const params = method[PARAMETERS] as ParameterHolder[];
            if (params) {
                testInfo.paramsSymbolIsSet = true;
                testInfo.params = params;
            }
            this.loggingAdapter.addChild(testInfo);
        }

        const decoratorAdapter = wrap((options: TestOptions): MethodDecorator => {
            return <T>(target: Prototype, propertyKey: string, descriptor: TypedPropertyDescriptor<T>): void => {
                const decorator: MethodDecorator = superTest(options);
                recordDecoratorBehavior(decorator, target, propertyKey, descriptor, options || {});
            };
        }, superTest);

        (decoratorAdapter as TestDecorator).Skip = wrap((options: ConditionalTestOptions): MethodDecorator => {
            return <T>(target: Prototype, propertyKey: string, descriptor: TypedPropertyDescriptor<T>): void => {
                const decorator: MethodDecorator = superTest.Skip(options);
                recordDecoratorBehavior(decorator, target, propertyKey, descriptor, options || {});
            };
            /* eslint-disable-next-line @typescript-eslint/unbound-method */
        }, superTest.Skip);

        (decoratorAdapter as TestDecorator).Focus = wrap((options: ConditionalTestOptions): MethodDecorator => {
            return <T>(target: Prototype, propertyKey: string, descriptor: TypedPropertyDescriptor<T>): void => {
                const decorator: MethodDecorator = superTest.Focus(options);
                recordDecoratorBehavior(decorator, target, propertyKey, descriptor, options || {});
            };
            /* eslint-disable-next-line @typescript-eslint/unbound-method */
        }, superTest.Focus);

        (decoratorAdapter as TestDecorator).Pending = wrap((options: ConditionalTestOptions): MethodDecorator => {
            return <T>(target: Prototype, propertyKey: string, descriptor: TypedPropertyDescriptor<T>): void => {
                const decorator: MethodDecorator = superTest.Pending(options);
                recordDecoratorBehavior(decorator, target, propertyKey, descriptor, options || {});
            };
            /* eslint-disable-next-line @typescript-eslint/unbound-method */
        }, superTest.Pending);

        return decoratorAdapter as TestDecorator;
    }

    private makeHookDecoratorAdapter(superHook: HookDecorator, kind: symbol): HookDecorator {

        const recordDecoratorBehavior = <T>(decorator: MethodDecorator, target: Constructor | Prototype, propertyKey: string, descriptor: TypedPropertyDescriptor<T>, options: HookOptions): void => {
            const hookInfo = new HookInfo();
            hookInfo.kind = kind;
            const method = target[propertyKey] as HookMethod;
            decorator(target, propertyKey, descriptor);
            hookInfo.hookSymbolWasSet = (method[kind] || false) as boolean;
            hookInfo.isStaticHook = ((target.constructor) as Constructor).name === "Function";
            hookInfo.userOptions = options;
            hookInfo.effectiveOptions = method[OPTIONS] as EffectiveHookOptions;
            hookInfo.name = hookInfo.effectiveOptions.name;
            this.loggingAdapter.addChild(hookInfo);
        }

        const decoratorAdapter = wrap((options: HookOptions = {}): MethodDecorator => {
            return <T>(target: Constructor | Prototype, propertyKey: string, descriptor: TypedPropertyDescriptor<T>): void => {
                const decorator: MethodDecorator = superHook(options);
                recordDecoratorBehavior(decorator, target, propertyKey, descriptor, options);
            };
        }, superHook);

        return decoratorAdapter;
    }

    get loggingAdapter(): LoggingAdapter {
        return this.adapter as LoggingAdapter;
    }
}

export class LoggingAdapter implements TestFrameworkAdapter {
    public readonly suite: SuiteInfo = new SuiteInfo();

    constructor() { }

    public findChildByName(name: string): TestInfo | HookInfo {
        for (const childInfo of this.suite.children) {
            if (childInfo.name === name) {
                return childInfo;
            }
        }
        return null;
    }

    public addChild(childInfo: TestInfo | HookInfo): void {
        this.suite.children.push(childInfo);
    }

    public describe(options: EffectiveSuiteOptions, callback: () => void) {
        if (options.asChildSuite) {
            this.suite.childSuites.push(options.name);
        } else {
            this.suite.describeWasCalled = true;
        }
        callback();
    }

    public it(options: EffectiveTestOptions, callback: () => Promise<unknown> | void) {
        const testInfo = this.findChildByName(options.isParameterized ? options.originalMethodName : options.name) as TestInfo;
        if (options.isParameterized) {
            const parameterizedTestInfo = new ParameterizedTestInfo();
            parameterizedTestInfo.name = options.name;
            parameterizedTestInfo.itWasCalled = true;
            const promiseOrVoid = callback();
            if (promiseOrVoid instanceof Promise) {
                promiseOrVoid.then(() => { }, () => { });
            }
            parameterizedTestInfo.methodWasCalled = true;
            testInfo.parameterizedInstances.push(parameterizedTestInfo);
            this.suite.executionOrder.push(options.name);
        }
        else {
            testInfo.itWasCalled = true;
            const promiseOrVoid = callback();
            if (promiseOrVoid instanceof Promise) {
                promiseOrVoid.then(() => { }, () => { });
            }
            testInfo.methodWasCalled = true;
            this.suite.executionOrder.push(options.name);
        }
    }

    public beforeAll(options: EffectiveHookOptions, callback: () => Promise<unknown> | void) {
        const hookInfo = this.findChildByName(options.name) as HookInfo;
        hookInfo.hookWasRegisteredWith = "beforeAll";
        const promiseOrVoid = callback();
        if (promiseOrVoid instanceof Promise) {
            promiseOrVoid.then(() => { }, () => { });
        }
        hookInfo.methodWasCalled = true;
        this.suite.executionOrder.push(options.name);
    }

    public beforeEach(options: EffectiveHookOptions, callback: () => Promise<unknown> | void) {
        const hookInfo = this.findChildByName(options.name) as HookInfo;
        hookInfo.hookWasRegisteredWith = "beforeEach";
        const promiseOrVoid = callback();
        if (promiseOrVoid instanceof Promise) {
            promiseOrVoid.then(() => { }, () => { });
        }
        hookInfo.methodWasCalled = true;
        this.suite.executionOrder.push(options.name);
    }

    public afterEach(options: EffectiveHookOptions, callback: () => Promise<unknown> | void) {
        const hookInfo = this.findChildByName(options.name) as HookInfo;
        hookInfo.hookWasRegisteredWith = "afterEach";
        const promiseOrVoid = callback();
        if (promiseOrVoid instanceof Promise) {
            promiseOrVoid.then(() => { }, () => { });
        }
        hookInfo.methodWasCalled = true;
        this.suite.executionOrder.push(options.name);
    }

    public afterAll(options: EffectiveHookOptions, callback: () => Promise<unknown> | void) {
        const hookInfo = this.findChildByName(options.name) as HookInfo;
        hookInfo.hookWasRegisteredWith = "afterAll";
        const promiseOrVoid = callback();
        if (promiseOrVoid instanceof Promise) {
            promiseOrVoid.then(() => { }, () => { });
        }
        hookInfo.methodWasCalled = true;
        this.suite.executionOrder.push(options.name);
    }
}
