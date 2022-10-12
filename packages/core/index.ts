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

/* eslint-disable-next-line @typescript-eslint/naming-convention */
export const SUITE = Symbol.for('suite');
/* eslint-disable-next-line @typescript-eslint/naming-convention */
export const TEST = Symbol.for('test');
/* eslint-disable-next-line @typescript-eslint/naming-convention */
export const OPTIONS = Symbol.for('options');
/* eslint-disable-next-line @typescript-eslint/naming-convention */
export const PARAMETERS = Symbol.for('parameters');
/* eslint-disable-next-line @typescript-eslint/naming-convention */
export const BEFORE = Symbol.for('before');
/* eslint-disable-next-line @typescript-eslint/naming-convention */
export const AFTER = Symbol.for('after');
// since we assign the context to the prototype, we cannot make this
// a symbol as it will otherwise not be accessible from inside the
// constructor
/* eslint-disable-next-line @typescript-eslint/naming-convention */
export const CONTEXT = "context";

/* eslint-disable-next-line @typescript-eslint/naming-convention */
const IMMEDIATE = "immediate";
/* eslint-disable-next-line @typescript-eslint/naming-convention */
const SKIP = "skip";
/* eslint-disable-next-line @typescript-eslint/naming-convention */
const PENDING = "pending";
/* eslint-disable-next-line @typescript-eslint/naming-convention */
const FOCUS = "focus";

/**
 * The abstract class ClassTestUI ...
 */
export abstract class ClassTestUI {
    public readonly executeAfterHooksInReverseOrder: boolean = false;

    public readonly Suite: SuiteDecorator;
    public readonly Test: TestDecorator;
    public readonly Params: ParamsDecorator;
    public readonly Before: HookDecorator;
    public readonly After: HookDecorator;

    public constructor(public readonly adapter: TestFrameworkAdapter) {
        this.Suite = this.makeSuiteDecorator(adapter);
        this.Test = this.makeTestDecorator();
        this.Params = this.makeParamsDecorator();
        this.Before = this.makeHookDecorator(BEFORE);
        this.After = this.makeHookDecorator(AFTER);
    }

    private makeSuiteDecorator(adapter: TestFrameworkAdapter): SuiteDecorator {
        /* eslint-disable-next-line @typescript-eslint/ban-types */
        const preventInheritance = <TFunction extends Function>(target: TFunction): void => {
            if (target[SUITE]) {
                throw new Error(`@Suite() ${target.name} cannot subclass other @Suite() decorated classes, use (abstract) base classes instead.`);
            }
        }

        /* eslint-disable-next-line @typescript-eslint/ban-types */
        const realizeSuite = <TFunction extends Function>(options: EffectiveSuiteOptions, target: TFunction): void => {
            target[SUITE] = true;
            target[OPTIONS] = options;
            adapter.describe(options, this.declareSuite(target as unknown as Constructor, adapter));
        }

        const makeDecorator = (options: SuiteOptions | ConditionalSuiteOptions, execution: Execution): ClassDecorator => {
            /* eslint-disable-next-line @typescript-eslint/ban-types */
            return <TFunction extends Function>(target: TFunction): void => {
                preventInheritance(target);
                const effectiveSuiteOptions: EffectiveSuiteOptions = { ...options, execution };
                effectiveSuiteOptions.name = options.name || target.name;
                realizeSuite(effectiveSuiteOptions, target);
            };
        }

        const makeConditionalDecorator = (options: ConditionalSuiteOptions, execution: Execution): ClassDecorator => {
            const actualOptions = {...options, condition: options.condition === undefined ? true : options.condition};
            return makeDecorator(actualOptions, execution);
        }

        const decorator = (options: SuiteOptions = {}): ClassDecorator => {
            return makeDecorator(options, IMMEDIATE);
        };

        decorator.Focus = (options: ConditionalSuiteOptions = {}): ClassDecorator => {
            return makeConditionalDecorator(options, FOCUS);
        }

        decorator.Pending = (options: ConditionalSuiteOptions = {}): ClassDecorator => {
            return makeConditionalDecorator(options, PENDING);
        }

        decorator.Skip = (options: ConditionalSuiteOptions = {}): ClassDecorator => {
            return makeConditionalDecorator(options, SKIP);
        }

        return decorator;
    }

    private makeTestDecorator(): TestDecorator {
        const realizeTest = (options: EffectiveTestOptions, target: Prototype, propertyKey: string): void => {
            target[propertyKey][TEST] = true;
            target[propertyKey][OPTIONS] = options;
        }

        const makeDecorator = (options: TestOptions | ConditionalTestOptions, execution: Execution): MethodDecorator => {
            return (target: Prototype, propertyKey: string): void => {
                const effectiveTestOptions: EffectiveTestOptions = { ...options, execution };
                effectiveTestOptions.name = options.name || propertyKey;
                realizeTest(effectiveTestOptions, target, propertyKey);
            };
        }

        const makeConditionalDecorator = (options: ConditionalTestOptions, execution: Execution): MethodDecorator => {
            const actualOptions = {...options, condition: options.condition === undefined ? true : options.condition};
            return makeDecorator(actualOptions, execution);
        }

        const decorator = (options: TestOptions = {}): MethodDecorator => {
            return makeDecorator(options, IMMEDIATE);
        };

        decorator.Focus = (options: ConditionalTestOptions = {}): MethodDecorator => {
            return makeConditionalDecorator(options, FOCUS);
        };

        decorator.Pending = (options: ConditionalTestOptions = {}): MethodDecorator => {
            return makeConditionalDecorator(options, PENDING);
        };

        decorator.Skip = (options: ConditionalTestOptions = {}): MethodDecorator => {
            return makeConditionalDecorator(options, SKIP);
        };

        return decorator;
    }

    private makeParamsDecorator(): ParamsDecorator {
        const realizeParams = (options: ParamsOptions, params: unknown, target: Prototype, propertyKey: string | symbol): void => {
            if (target[propertyKey][PARAMETERS] === undefined) {
                target[propertyKey][PARAMETERS] = [];
            }
            const parameterHolders: ParameterHolder[] = target[propertyKey][PARAMETERS] as ParameterHolder[];
            parameterHolders.unshift(new ParameterHolder(params, options));
        }

        const makeDecorator = (options: ParamsOptions, params: unknown): MethodDecorator => {
            return (target: Prototype, propertyKey: string): void => {
                realizeParams(options, params, target, propertyKey);
            };
        }

        const decorator = (params: unknown, options: ParamsOptions = {}): MethodDecorator => {
            return makeDecorator(options, params);
        };

        return decorator;
    }

    private makeHookDecorator(kind: symbol): HookDecorator {

        const realizeHook = (options: EffectiveHookOptions, target: Constructor | Prototype, propertyKey: string): void => {
            target[propertyKey][kind] = true;
            target[propertyKey][OPTIONS] = options;
        }

        const makeDecorator = (options: HookOptions): MethodDecorator => {
            return (target: Constructor | Prototype, propertyKey: string): void => {
                // the following information is exposed for testing purposes only
                let name: string;
                if (target.constructor.name === 'Function') {
                    name = `${(target as Constructor).name}.${propertyKey}`;
                } else {
                    name = `${target.constructor.name}#${propertyKey}`;
                }
                const effectiveHookOptions: EffectiveHookOptions = { ...options, name };
                realizeHook(effectiveHookOptions, target, propertyKey);
            };
        }

        const decorator = (options: HookOptions): MethodDecorator => {
            return makeDecorator(options);
        }

        return decorator;
    }

    protected createInstance(cls: Constructor): object {
        const di = dependencyInjectionSystems.find((di) => di.handles(cls));
        const instance = di.create(cls);
        return instance;
    }

    private declareSuite(constructor: Constructor, adapter: TestFrameworkAdapter): () => void {
        /* eslint-disable-next-line @typescript-eslint/no-this-alias */
        const othis = this;
        return function(): void {
            // register beforeAll hooks in their declared order
            othis.registerStaticHooks(adapter, constructor, BEFORE);

            // create test suite instance
            const prototype = constructor.prototype as Prototype;
            prototype[CONTEXT] = this;
            const instance = othis.createInstance(constructor);
            prototype[CONTEXT] = undefined;

            // register beforeEach hooks in their declared order
            othis.registerInstanceHooks(adapter, prototype, instance, BEFORE);

            othis.declareTests(adapter, prototype, instance);

            // register afterEach hooks in their declared order
            othis.registerInstanceHooks(adapter, prototype, instance, AFTER);

            // register beforeAll hooks in their declared order
            othis.registerStaticHooks(adapter, constructor, AFTER);
        };
    }

    private declareTests(adapter: TestFrameworkAdapter, prototype: Prototype, instance: object): void {
        // collect all test methods in their declared order, recursively along the inheritance chain
        const collectedTests: Set<string> = this.collectTests(prototype);

        // register all collected tests
        for (const propertyKey of collectedTests) {
            if (prototype[propertyKey][PARAMETERS]) {
                this.declareParameterizedTests(adapter, prototype, instance, propertyKey);
            } else {
                this.declareTest(adapter, prototype, instance, propertyKey);
            }
        }
    }

    private declareTest(
        adapter: TestFrameworkAdapter, prototype: Prototype,
        instance: object, propertyKey: string | symbol
    ): void {
        const method: TestMethod = prototype[propertyKey] as TestMethod;
        const options: EffectiveTestOptions = prototype[propertyKey][OPTIONS] as EffectiveTestOptions;
        adapter.it(options, wrap(function(this: unknown) {
            instance[CONTEXT] = this;
            return method.call(instance) as PromiseOrVoid;
        }, method));
    }

    private declareParameterizedTests(
        adapter: TestFrameworkAdapter, prototype: Prototype,
        instance: object, propertyKey: string
    ): void {
        const realizeParameterizedTestName = (index: number, effectiveTestOptions: EffectiveTestOptions, parameterHolder: ParameterHolder): string => {
            if (typeof parameterHolder.options.name === 'function') {
                return parameterHolder.options.name(parameterHolder.params);
            } else if (parameterHolder.options.name !== undefined) {
                return parameterHolder.options.name;
            } else {
                return `${effectiveTestOptions.name} ${index}`;
            }
        };

        const effectiveTestOptions: EffectiveTestOptions = prototype[propertyKey][OPTIONS] as EffectiveTestOptions;
        const method: TestMethod = prototype[propertyKey] as TestMethod;

        adapter.describe({
            name: effectiveTestOptions.name, execution: effectiveTestOptions.execution, asChildSuite: true
        }, function() {
            const parameterHolders: ParameterHolder[] = method[PARAMETERS] as ParameterHolder[];

            for (const [index, parameterHolder] of parameterHolders.entries()) {
                // realize test options
                const effectiveParameterizedTestOptions: EffectiveTestOptions = {
                    ...effectiveTestOptions,
                    // exposed for testing purposes only
                    name: realizeParameterizedTestName(index, effectiveTestOptions, parameterHolder),
                    isParameterized: true,
                    originalMethodName: effectiveTestOptions.name
                };
                adapter.it(effectiveParameterizedTestOptions, wrap(function(this: unknown) {
                    instance[CONTEXT] = this;
                    return method.call(instance, parameterHolder.params) as PromiseOrVoid;
                }, method));
            }
        });
    }

    private registerStaticHooks(adapter: TestFrameworkAdapter, target: Constructor, kind: symbol): void {
        const resolvedHooks = this.resolveHooks(target, kind, true);
        for (const resolvedHook of resolvedHooks) {
            this.registerStaticHook(adapter, kind, resolvedHook);
        }
    }

    private registerStaticHook(adapter: TestFrameworkAdapter, kind: symbol, resolvedHook: ResolvedHook): void {
        const method: HookMethod = resolvedHook.target[resolvedHook.propertyKey] as HookMethod;
        const wrapper = wrap<HookMethod>(function(this: unknown): PromiseOrVoid {
            resolvedHook.target[CONTEXT] = this;
            return method.call(resolvedHook.target) as PromiseOrVoid;
        }, method);
        const options = method[OPTIONS] as EffectiveHookOptions;
        if (kind === BEFORE) {
            adapter.beforeAll(options, wrapper);
        } else {
            adapter.afterAll(options, wrapper);
        }
    }

    private registerInstanceHooks(adapter: TestFrameworkAdapter, prototype: Prototype, instance: object, kind: symbol): void {
        const resolvedHooks = this.resolveHooks(prototype, kind, false);
        for (const resolvedHook of resolvedHooks) {
            this.registerInstanceHook(adapter, instance, kind, resolvedHook);
        }
    }

    private registerInstanceHook(adapter: TestFrameworkAdapter, instance: object, kind: symbol, resolvedHook: ResolvedHook): void {
        const method: HookMethod = resolvedHook.target[resolvedHook.propertyKey] as HookMethod;
        const wrapper = wrap<HookMethod>(function(this: unknown): PromiseOrVoid {
            instance[CONTEXT] = this;
            return method.call(instance) as PromiseOrVoid;
        }, method);
        const options = method[OPTIONS] as EffectiveHookOptions;
        if (kind === BEFORE) {
            adapter.beforeEach(options, wrapper);
        } else {
            adapter.afterEach(options, wrapper);
        }
    }

    private collectTests(prototype: Prototype): Set<string> {
        const result = new Set<string>();

        let currentPrototype = prototype;
        while (currentPrototype !== Object.prototype) {
            Object.getOwnPropertyNames(currentPrototype).forEach((propertyKey) => {
                const descriptor: PropertyDescriptor = Object.getOwnPropertyDescriptor(currentPrototype, propertyKey);
                if (typeof descriptor.value === 'function'
                    && !(propertyKey in result)
                    && (descriptor.value as TestMethod)[TEST]) {
                    result.add(propertyKey);
                }
            });
            currentPrototype = Object.getPrototypeOf(currentPrototype) as Prototype;
        }

        return result;
    }

    private resolveHooks(target: Constructor | Prototype, kind: symbol, isStatic: boolean): ResolvedHook[] {
        const result: ResolvedHook[] = [];
        let targets: (Constructor | Prototype)[] = [];
        let currentTarget = target;

        while (currentTarget !== (isStatic ? Object.getPrototypeOf(Object) : Object.prototype)) {
            targets.push(currentTarget);
            currentTarget = Object.getPrototypeOf(currentTarget) as Constructor | Prototype;
        }

        // on BEFORE we will run the hooks from top to bottom of the inheritance chain (super > ... > child)
        // on AFTER we will run the hooks from bottom to top of the inheritance chain (child > ... > super)
        // also compensate for test frameworks that will run the AFTER hooks in their reverse order
        if (kind === BEFORE || (kind === AFTER && this.executeAfterHooksInReverseOrder)) {
            targets = targets.reverse();
        }
        for (const target of targets) {
            let resolvedHooks: ResolvedHook[] = [];
            Object.getOwnPropertyNames(target).forEach((propertyKey) => {
                const descriptor: PropertyDescriptor = Object.getOwnPropertyDescriptor(target, propertyKey);
                if (typeof descriptor.value === 'function'
                    && (descriptor.value as HookMethod)[kind]) {
                    resolvedHooks.push({ target, propertyKey });
                }
            });
            // compensate for test frameworks that will run the AFTER hooks in their reverse order
            if (kind === AFTER && this.executeAfterHooksInReverseOrder) {
                resolvedHooks = resolvedHooks.reverse();
            }
            result.push(...resolvedHooks);
        }

        return result;
    }
}

interface ResolvedHook {
    target: Constructor | Prototype,
    propertyKey: string
}

export class ParameterHolder {
    constructor(public readonly params: unknown, public readonly options: ParamsOptions) { }
}

export interface TestFrameworkAdapter {
    describe(options: EffectiveSuiteOptions, callback: () => void): void;
    it(options: EffectiveTestOptions, callback: () => Promise<unknown> | void): void;
    beforeAll(options: EffectiveHookOptions, callback: () => Promise<unknown> | void): void;
    afterAll(options: EffectiveHookOptions, callback: () => Promise<unknown> | void): void;
    beforeEach(options: EffectiveHookOptions, callback: () => Promise<unknown> | void): void;
    afterEach(options: EffectiveHookOptions, callback: () => Promise<unknown> | void): void;
}

/**
 * Transfers the base's toString and name to the wrapping function.
 */
export function wrap<T extends HookMethod | TestMethod | SuiteDecoratorFn | TestDecoratorFn>(fn: T, base: T): T {
    fn.toString = () => base.toString();
    Object.defineProperty(fn, "name", { value: base.name, writable: false });
    return fn;
}

export function withCondition(condition: boolean | (() => boolean), onTrue: () => void, onFalse: () => void): void {
    const resolvedCondition = typeof condition === 'function' ? condition() : condition;
    if (resolvedCondition) {
        onTrue();
    } else {
        onFalse();
    }
}

/**
 * Core dependency injection support.
 */
export interface DependencyInjectionSystem {
    handles(cls: Constructor): boolean;
    create(cls: Constructor): object;
}

const dependencyInjectionSystems: DependencyInjectionSystem[] = [{
    handles() { return true; },
    create(cls: Constructor) {
        return new cls();
    }
}];

/**
 * Register a dependency injection system to be used when instantiating test classes.
 *
 * @param instantiator The dependency injection system implementation.
 */
export function registerDI(instantiator: DependencyInjectionSystem) {
    // Maybe check if it is not already added?
    /* istanbul ignore else */
    if (!dependencyInjectionSystems.some((di) => di === instantiator)) {
        dependencyInjectionSystems.unshift(instantiator);
    }
}

export interface ExecutionOptions {
    retry?: number;
    timeout?: number;
    slow?: number;
}

export interface SuiteOptions extends ExecutionOptions {
    name?: string;
}

export interface TestOptions extends ExecutionOptions {
    name?: string;
}

/* eslint-disable-next-line @typescript-eslint/no-empty-interface */
export interface HookOptions extends ExecutionOptions { }

export interface ParamsOptions {
    name?: string | ((params: unknown) => string);
}

export interface ConditionalSuiteOptions extends SuiteOptions {
    condition?: boolean | (() => boolean);
}

export interface ConditionalTestOptions extends TestOptions {
    condition?: boolean | (() => boolean);
}

export type Execution = "immediate" | "focus" | "pending" | "skip";

export interface EffectiveSuiteOptions extends ConditionalSuiteOptions {
    execution?: Execution;
    /* for testing purposes only */
    asChildSuite?: boolean;
}

export interface EffectiveTestOptions extends ConditionalTestOptions {
    execution?: Execution;
    // exposed for testing purposes only
    isParameterized?: boolean;
    originalMethodName?: string;
}

export interface EffectiveHookOptions extends HookOptions {
    // for testing purposes only
    name: string;
}

export type SuiteDecoratorFn = (options?: SuiteOptions | ConditionalSuiteOptions) => ClassDecorator;

export interface SuiteDecorator {
    (options?: SuiteOptions): ClassDecorator;
    Skip(options?: ConditionalSuiteOptions): ClassDecorator;
    Pending(options?: ConditionalSuiteOptions): ClassDecorator;
    Focus(options?: ConditionalSuiteOptions): ClassDecorator;
}

export type TestDecoratorFn = (options?: TestOptions | ConditionalTestOptions) => MethodDecorator;

export interface TestDecorator {
    (options?: TestOptions): MethodDecorator;
    Skip(options?: ConditionalTestOptions): MethodDecorator;
    Pending(options?: ConditionalTestOptions): MethodDecorator;
    Focus(options?: ConditionalTestOptions): MethodDecorator;
}

export type ParamsDecorator = (params: unknown, options?: ParamsOptions) => MethodDecorator;

export type HookDecorator = (options?: HookOptions) => MethodDecorator;

export interface Constructor extends Record<string | symbol, unknown> {
    new(): object;
}

export type Prototype = Record<string | symbol, unknown>;

export type HookMethod = () => PromiseOrVoid;
export type TestMethod = (params?: unknown) => PromiseOrVoid;
export type PromiseOrVoid = Promise<unknown> | void;
