export declare abstract class ClassTestUI {
    /**
     * This is supposed to create a `Symbol(key)` but some platforms does not support Symbols yet so fallback to string keys for now.
     * @param key
     */
    protected static MakeSymbol(key: string): symbol | string;
    private static readonly suiteSymbol;
    private static readonly nameSymbol;
    private static readonly parametersSymbol;
    private static readonly nameForParametersSymbol;
    private static readonly slowSymbol;
    private static readonly timeoutSymbol;
    private static readonly retriesSymbol;
    private static readonly executionSymbol;
    private static readonly isDecoratorSymbol;
    readonly runner: TestRunner;
    readonly suite: SuiteDecorator;
    readonly test: TestDecorator;
    readonly slow: ExecutionOptionDecorator;
    readonly timeout: ExecutionOptionDecorator;
    readonly retries: ExecutionOptionDecorator;
    readonly pending: ExecutionModifierDecorator;
    readonly only: ExecutionModifierDecorator;
    readonly skip: ExecutionModifierDecorator;
    readonly params: ParameterisedTestDecorator;
    private readonly dependencyInjectionSystems;
    constructor(runner: TestRunner);
    /**
     * Register a dependency injection system to be used when instantiating test classes.
     * @param instantiator The dependency injection system implementation.
     */
    registerDI(instantiator: DependencyInjectionSystem): void;
    /**
     * Declares the provided function as decorator.
     * Used to mark decorators such as `@timeout` that can sometimes be provided as single argument to `@suite(timeout(1000))`.
     * In those cases the `suite()` overload should be able to distinguish the timeout function from class constructor.
     */
    protected markAsDecorator<Arg extends ClassDecorator | SuiteDecorator>(arg: Arg): Arg;
    private getSettings;
    private getInstance;
    private suiteCallbackFromClass;
    private makeSuiteObject;
    private makeSuiteFunction;
    private makeTestObject;
    private makeTestFunction;
    private testOverload;
    private makeParamsFunction;
    private makeParamsNameFunction;
    private makeParamsObject;
    /**
     * Create execution options such as `@slow`, `@timeout` and `@retries`.
     */
    private createExecutionOption;
    /**
     * Creates the decorators `@pending`, `@only`, `@skip`.
     */
    private createExecutionModifier;
}
export declare type Done = (err?: any) => void;
export declare type CallbackOptionallyAsync = (done?: Done) => void | Promise<void>;
export interface SuiteDecoratorOrName extends ClassDecorator {
    /**
     * Callable with optional name, followed by decorators. Allows:
     * ```
     * @suite
     * @timeout(1000)
     * @slow(500)
     * ```
     * To condensed on a single line:
     * ```
     * @suite(timeout(1000), slow(500))
     * ```
     * Please note the pit fall in the first case - the `@suite` must be the first decorator.
     */
    (name?: string, ...decorators: ClassDecorator[]): ClassDecorator;
}
export interface SuiteDecorator extends SuiteDecoratorOrName {
    only: SuiteDecoratorOrName;
    skip: SuiteDecoratorOrName;
    pending: SuiteDecoratorOrName;
}
export interface TestDecoratorOrName extends MethodDecorator {
    /**
     * Callable with optional name, followed by decorators. Allows:
     * ```
     * @test
     * @timeout(1000)
     * @slow(500)
     * ```
     * To condensed on a single line:
     * ```
     * @test(timeout(1000), slow(500))
     * ```
     * Please note the pit fall in the first case - the `@test` must be the first decorator.
     */
    (name?: string, ...decorator: MethodDecorator[]): MethodDecorator;
}
/**
 * The type of the `@test` decorator.
 * The decorator can be used as: `@test`, `@test()`, `@test("name")`, `@test.only`, `@test.only()`, `@test.only("name")`, etc.
 */
export interface TestDecorator extends TestDecoratorOrName {
    only: TestDecoratorOrName;
    skip: TestDecoratorOrName;
    pending: TestDecoratorOrName;
}
/**
 * After a `@suite` or `@test`,
 * these decortors can be used as `@slow(1000)`, `@timeout(2000)` and `@retries(3)`.
 * These can also be used as traits - such as `@suite(timeout(2000))`.
 */
export interface ExecutionOptionDecorator {
    (value: number): ClassDecorator | MethodDecorator;
}
/**
 * An execution modifier decorators. Used to control which tests will be executed on test-run.
 * Decorators can be used as `@pending`, `@only` and `@skip`.
 * Or with condition: `@only(isWindows)`.
 */
export interface ExecutionModifierDecorator extends ClassDecorator, MethodDecorator {
    (condition: boolean): ClassDecorator | MethodDecorator;
}
export interface ParameterisedTestDecorator {
    (params: any, name?: string): MethodDecorator;
    skip(params: any, name?: string): MethodDecorator;
    only(params: any, name?: string): MethodDecorator;
    pending(params: any, name?: string): MethodDecorator;
    naming(nameForParameters: (params: any) => string): MethodDecorator;
}
export interface TestInstance {
    /**
     * An instance method, that if defined, is executed before every test method.
     */
    before?(done?: Done): void | Promise<void>;
    /**
     * An instance method, that if defined, is executed after every test method.
     */
    after?(done?: Done): void | Promise<void>;
}
export interface TestClass<T extends TestInstance> {
    new (...args: any[]): T;
    prototype: T;
    /**
     * A static method, that if defined, is executed once, before all test methods.
     */
    before?(done?: Done): void | Promise<void>;
    /**
     * A static method, that if defined, is executed once, after all test methods.
     */
    after?(done?: Done): void | Promise<void>;
}
export interface DependencyInjectionSystem {
    handles<T>(cls: TestClass<T>): boolean;
    create<T>(cls: TestClass<T>): T;
}
/**
 * Test or suite execution.
 * The `undefined` means execute as normal.
 */
export declare type Execution = undefined | "pending" | "only" | "skip";
export interface SuiteSettings {
    execution?: Execution;
    timeout?: number;
    slow?: number;
    retries?: number;
}
export interface TestSettings {
    execution?: Execution;
    timeout?: number;
    slow?: number;
    retries?: number;
}
export interface LifecycleSettings {
    timeout?: number;
    slow?: number;
}
/**
 * An adapter for a test runner that is used by the class syntax decorators based test ui.
 *
 * For example the test:
 * ```TypeScript
   @suite class MyClass {
       @test myTest() {
       }
   }
   ```
 * Will call declareSuite with the name "MyClass" and a cb.
 * When that cb is called it will further call declareTest with the "myTest" name and a test function.
 * The test function when called will instantiate MyClass and call the myTest on that instance.
 */
export interface TestRunner {
    suite(name: string, callback: () => void, settings: SuiteSettings): any;
    test(name: string, callback: CallbackOptionallyAsync, settings: TestSettings): any;
    beforeAll(callback: CallbackOptionallyAsync, settings: LifecycleSettings): any;
    beforeEach(callback: CallbackOptionallyAsync, settings: LifecycleSettings): any;
    afterEach(callback: CallbackOptionallyAsync, settings: LifecycleSettings): any;
    afterAll(callback: CallbackOptionallyAsync, settings: LifecycleSettings): any;
}
/**
 * Transfers the base's toString and name to the wrapping function.
 */
export declare function wrap<T extends Function>(wrap: T, base: Function): T;
