declare namespace Mocha {
    export interface IContextDefinition {}
    export interface ITestDefinition {}
    export interface ISuiteCallbackContext {}
    export interface ITestCallbackContext {}
}

interface MochaDone {
    (error?: any): any;
}

declare namespace MochaTypeScript {
    export interface Suite {
        prototype: {
            before?: (done?: MochaDone) => void;
            after?: (done?: MochaDone) => void;
        };
        before?: (done?: MochaDone) => void;
        after?: (done?: MochaDone) => void;
        new();
    }
    export interface SuiteTrait {
        (this: Mocha.ISuiteCallbackContext, ctx: Mocha.ISuiteCallbackContext, ctor: Function): void;
    }
    export interface TestTrait {
        (this: Mocha.ITestCallbackContext, ctx: Mocha.ITestCallbackContext, instance: Object, method: Function): void;
    }

    export interface IContextDefinition {
        (target: MochaTypeScript.Suite): any;
        (): ClassDecorator;
        (name: string): ClassDecorator;
        (name: string, ... traits: MochaTypeScript.SuiteTrait[]): ClassDecorator;
        (... traits:MochaTypeScript.SuiteTrait[]): ClassDecorator;

        only(target: MochaTypeScript.Suite): any;
        only(): ClassDecorator;
        only(name: string): ClassDecorator;
        only(name: string, ... traits: MochaTypeScript.SuiteTrait[]): ClassDecorator;
        only(... traits:MochaTypeScript.SuiteTrait[]): ClassDecorator;

        skip(target: MochaTypeScript.Suite): any;
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
}

declare module "mocha-typescript" {
    export const suite: Mocha.IContextDefinition & MochaTypeScript.IContextDefinition;
    export const test: Mocha.ITestDefinition & MochaTypeScript.ITestDefinition;

    export const describe: Mocha.IContextDefinition & MochaTypeScript.IContextDefinition;
    export const it: Mocha.ITestDefinition & MochaTypeScript.ITestDefinition;

    export function slow(time: number): PropertyDecorator & ClassDecorator & MochaTypeScript.SuiteTrait & MochaTypeScript.TestTrait;
    export function timeout(time: number): PropertyDecorator & ClassDecorator & MochaTypeScript.SuiteTrait & MochaTypeScript.TestTrait;

    export function pending<TFunction extends Function>(target: Object | TFunction, propertyKey?: string | symbol): void;
    export function only<TFunction extends Function>(target: Object, propertyKey?: string | symbol): void;
    export function skip<TFunction extends Function>(target: Object | TFunction, propertyKey?: string | symbol): void;

    export function context(target: Object, propertyKey: string | symbol): void;

    export const skipOnError: MochaTypeScript.SuiteTrait;
}
