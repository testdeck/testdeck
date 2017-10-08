/// <reference path="./index.d.ts" />
/**
 * This TypeScript declaration file describes the API provided by mocha-typescript when it is used as custom-ui.
 * To import the definitions, use somewhere in your test files the tripple slash reference:
 * /// <reference path="node_modules/mocha-typescript/globals.d.ts" />
 */

declare namespace Mocha {
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
}

declare var suite: Mocha.IContextDefinition;
declare var test: Mocha.ITestDefinition;

declare var describe: Mocha.IContextDefinition;
declare var it: Mocha.ITestDefinition;

declare var skipOnError: MochaTypeScript.SuiteTrait;

declare function slow(time: number): PropertyDecorator & ClassDecorator & MochaTypeScript.SuiteTrait & MochaTypeScript.TestTrait;
declare function timeout(time: number): PropertyDecorator & ClassDecorator & MochaTypeScript.SuiteTrait & MochaTypeScript.TestTrait;
declare function retries(count: number): PropertyDecorator & ClassDecorator & MochaTypeScript.SuiteTrait & MochaTypeScript.TestTrait;

declare function pending<TFunction extends Function>(target: Object | TFunction, propertyKey?: string | symbol): void;
declare function only<TFunction extends Function>(target: Object, propertyKey?: string | symbol): void;
declare function skip<TFunction extends Function>(target: Object | TFunction, propertyKey?: string | symbol): void;
