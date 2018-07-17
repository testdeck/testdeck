declare namespace Mocha {
    export interface ITest {
        <T>(target: Object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<T>): TypedPropertyDescriptor<T> | void;
    }
    export interface Test {
        <T>(target: Object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<T>): TypedPropertyDescriptor<T> | void;
    }
    export interface ISuite {
        <TFunction extends Function>(target: TFunction): TFunction | void;
    }
    export interface Suite {
        <TFunction extends Function>(target: TFunction): TFunction | void;
    }
    // @types/mocha v5.2.4
    interface SuiteFunction {
        (args: any): any;
        (): ClassDecorator;
        (name: string): ClassDecorator;
        (name: string, ... traits: MochaTypeScript.SuiteTrait[]): ClassDecorator;
        (trait: MochaTypeScript.SuiteTrait, ... traits:MochaTypeScript.SuiteTrait[]): ClassDecorator;
    }
    interface PendingSuiteFunction {
        (args: any): any;
        (): ClassDecorator;
        (name: string): ClassDecorator;
        (name: string, ... traits: MochaTypeScript.SuiteTrait[]): ClassDecorator;
        (trait: MochaTypeScript.SuiteTrait, ... traits:MochaTypeScript.SuiteTrait[]): ClassDecorator;
    }
    interface ExclusiveSuiteFunction {
        (args: any): any;
        (): ClassDecorator;
        (name: string): ClassDecorator;
        (name: string, ... traits: MochaTypeScript.SuiteTrait[]): ClassDecorator;
        (trait: MochaTypeScript.SuiteTrait, ... traits:MochaTypeScript.SuiteTrait[]): ClassDecorator;
    }
    interface TestFunction {
        (target: Object, propertyKey: string | symbol): void;
        (name: string): PropertyDecorator;
        (name: string, ... traits: MochaTypeScript.TestTrait[]): PropertyDecorator;
        (... traits: MochaTypeScript.TestTrait[]): PropertyDecorator;
    }
    interface PendingTestFunction {
        (target: Object, propertyKey: string | symbol): void;
        (name: string): PropertyDecorator;
        (name: string, ... traits: MochaTypeScript.TestTrait[]): PropertyDecorator;
        (... traits: MochaTypeScript.TestTrait[]): PropertyDecorator;
    }
    interface ExclusiveTestFunction {
        (target: Object, propertyKey: string | symbol): void;
        (name: string): PropertyDecorator;
        (name: string, ... traits: MochaTypeScript.TestTrait[]): PropertyDecorator;
        (... traits: MochaTypeScript.TestTrait[]): PropertyDecorator;
    }
}

declare namespace MochaTypeScript {
    export interface Suite {
        prototype: {
            before?: (done?: MochaDone) => void;
            after?: (done?: MochaDone) => void;
        };
        before?: (done?: MochaDone) => void;
        after?: (done?: MochaDone) => void;
        new(): any;
    }
    export interface SuiteTrait {
        (this: Mocha.ISuiteCallbackContext, ctx: Mocha.ISuiteCallbackContext, ctor: Function): void;
    }
    export interface TestTrait {
        (this: Mocha.ITestCallbackContext, ctx: Mocha.ITestCallbackContext, instance: Object, method: Function): void;
    }

    export interface IContextDefinition {
        /**
         * This is either a single trait overload `(trait: MochaTypeScript.SuiteTrait): ClassDecorator`
         * or a class decorator overload `(target: Function): void`.
         * Can't figure out proper typing.
         */
        (args: any): any;
        (): ClassDecorator;
        (name: string): ClassDecorator;
        (name: string, ... traits: MochaTypeScript.SuiteTrait[]): ClassDecorator;
        (trait: MochaTypeScript.SuiteTrait, ... traits:MochaTypeScript.SuiteTrait[]): ClassDecorator;

        only(arg: any): any;
        only(): ClassDecorator;
        only(name: string): ClassDecorator;
        only(name: string, ... traits: MochaTypeScript.SuiteTrait[]): ClassDecorator;
        only(... traits:MochaTypeScript.SuiteTrait[]): ClassDecorator;

        skip(arg: any): any;
        skip(): ClassDecorator;
        skip(name: string): ClassDecorator;
        skip(name: string, ... traits: MochaTypeScript.SuiteTrait[]): ClassDecorator;
        skip(... traits:MochaTypeScript.SuiteTrait[]): ClassDecorator;
    }
    export interface ITestDefinition {
        (target: Object, propertyKey: string | symbol): void;
        (name: string): PropertyDecorator;
        (name: string, ... traits: MochaTypeScript.TestTrait[]): PropertyDecorator;
        (... traits: MochaTypeScript.TestTrait[]): PropertyDecorator;

        only(target: Object, propertyKey: string | symbol): void;
        only(name: string): PropertyDecorator;
        only(name: string, ... traits: MochaTypeScript.TestTrait[]): PropertyDecorator;
        only(... traits: MochaTypeScript.TestTrait[]): PropertyDecorator;

        skip(target: Object, propertyKey: string | symbol): void;
        skip(name: string): PropertyDecorator;
        skip(name: string, ... traits: MochaTypeScript.TestTrait[]): PropertyDecorator;
        skip(... traits: MochaTypeScript.TestTrait[]): PropertyDecorator;
    }

    export interface TestClass<T> {
        new(...args: any[]): T;
        prototype: T;
    }

    export interface DependencyInjectionSystem {
        handles<T>(cls: TestClass<T>): boolean;
        create<T>(cls: TestClass<T>): typeof cls.prototype;
    }
}

declare module "mocha-typescript" {
    export const suite: Mocha.IContextDefinition & MochaTypeScript.IContextDefinition;
    export const test: Mocha.ITestDefinition & MochaTypeScript.ITestDefinition;

    export const describe: Mocha.IContextDefinition & MochaTypeScript.IContextDefinition;
    export const it: Mocha.ITestDefinition & MochaTypeScript.ITestDefinition;

    export function slow(time: number): PropertyDecorator & ClassDecorator & MochaTypeScript.SuiteTrait & MochaTypeScript.TestTrait;
    export function timeout(time: number): PropertyDecorator & ClassDecorator & MochaTypeScript.SuiteTrait & MochaTypeScript.TestTrait;
    export function retries(count: number): PropertyDecorator & ClassDecorator & MochaTypeScript.SuiteTrait & MochaTypeScript.TestTrait;

    export function pending<TFunction extends Function>(target: Object | TFunction, propertyKey?: string | symbol): void;
    export function only<TFunction extends Function>(target: Object, propertyKey?: string | symbol): void;
    export function skip<TFunction extends Function>(target: Object | TFunction, propertyKey?: string | symbol): void;

    export function context(target: Object, propertyKey: string | symbol): void;

    export const skipOnError: MochaTypeScript.SuiteTrait;

    export function registerDI(instantiator: MochaTypeScript.DependencyInjectionSystem): boolean;
}
