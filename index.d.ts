
declare namespace Mocha {
    interface IContextDefinition {
        /**
         * Decorate a class to mark it as a test suite.
         */
        (name: string): ClassDecorator;
        /**
         * Decorate a class to mark it as a test suite. Also provide a custom name.
         */
        <TFunction extends Function>(target: TFunction): TFunction | void;
    }
    interface ITestDefinition {
        /**
         * Decorate a suite class method as test.
         */
        (target: Object, propertyKey: string | symbol, descriptor: PropertyDescriptor): void;
    }
}

/**
 * Set a test method execution time that is considered slow.
 * @param time The time in miliseconds.
 */
declare function slow(time: number): PropertyDecorator & ClassDecorator;
/**
 * Set a test method or suite timeout time.
 * @param time The time in miliseconds.
 */
declare function timeout(time: number): PropertyDecorator & ClassDecorator;
/**
 * Mart a test or suite as pending.
 *  - Used as `@suite @pending class` is `describe.skip("name", ...);`.
 *  - Used as `@test @pending method` is `it("name");`
 */
declare function pending<TFunction extends Function>(target: Object | TFunction, propertyKey?: string | symbol): void;
/**
 * Mark a test or suite as the only one to execute.
 *  - Used as `@suite @only class` is `describe.only("name", ...)`.
 *  - Used as `@test @only method` is `it.only("name", ...)`.
 */
declare function only<TFunction extends Function>(target: Object, propertyKey?: string | symbol): void;
/**
 * Mark a test or suite to skip.
 *  - Used as `@suite @skip class` is `describe.skip("name", ...);`.
 *  - Used as `@test @skip method` is `it.skip("name")`.
 */
declare function skip<TFunction extends Function>(target: Object | TFunction, propertyKey?: string | symbol): void;

// NOTE: context clashes with other global context.

declare module "mocha-typescript" {
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
    /**
     * Mark a method as test and provide a custom name.
     * @param name The test name.
     */
    export function test(name: string): PropertyDecorator;
    /**
     * Mark a method as test. Use the method name as test name.
     */
    export function test(target: Object, propertyKey: string | symbol): void;
    /**
     * Set a test method execution time that is considered slow.
     * @param time The time in miliseconds.
     */
    export function slow(time: number): PropertyDecorator & ClassDecorator;
    /**
     * Set a test method or suite timeout time.
     * @param time The time in miliseconds.
     */
    export function timeout(time: number): PropertyDecorator & ClassDecorator;
    /**
     * Mart a test or suite as pending.
     *  - Used as `@suite @pending class` is `describe.skip("name", ...);`.
     *  - Used as `@test @pending method` is `it("name");`
     */
    export function pending<TFunction extends Function>(target: Object | TFunction, propertyKey?: string | symbol): void;
    /**
     * Mark a test or suite as the only one to execute.
     *  - Used as `@suite @only class` is `describe.only("name", ...)`.
     *  - Used as `@test @only method` is `it.only("name", ...)`.
     */
    export function only<TFunction extends Function>(target: Object, propertyKey?: string | symbol): void;
    /**
     * Mark a test or suite to skip.
     *  - Used as `@suite @skip class` is `describe.skip("name", ...);`.
     *  - Used as `@test @skip method` is `it.skip("name")`.
     */
    export function skip<TFunction extends Function>(target: Object | TFunction, propertyKey?: string | symbol): void;
    /**
     * Mark a method as test. Use the method name as test name.
     */
    export function context(target: Object, propertyKey: string | symbol): void;
}
