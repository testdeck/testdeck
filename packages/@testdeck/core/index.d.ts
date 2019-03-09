export interface DependencyInjectionSystem {
    handles<T>(cls: Class<T>): boolean;
    create<T>(cls: Class<T>): T;
}
export interface ConditionalClassAndMethodDecorator extends MethodDecorator, ClassDecorator {
    (condition: boolean): MethodDecorator | ClassDecorator;
}
export interface ParameterisedTestDecorator {
    (params: any, name?: string): MethodDecorator;
    skip(params: any, name?: string): MethodDecorator;
    only(params: any, name?: string): MethodDecorator;
    pending(params: any, name?: string): MethodDecorator;
    naming(nameForParameters: (parameters: any) => string): MethodDecorator;
}
export interface Prototype {
    [key: string]: any;
}
export interface Class<T extends Prototype> {
    new (...args: any[]): T;
    [key: string]: any;
    prototype: any;
}
export interface SuiteCtor extends Class<SuiteProto>, Function {
    before?: (done?: Done) => void;
    after?: (done?: Done) => void;
}
export interface SuiteProto extends Prototype {
    before?: (done?: Done) => void;
    after?: (done?: Done) => void;
}
export interface SuiteDecorator<RunnerSuiteType> extends SuiteDecoratorOverload<RunnerSuiteType> {
    only: SuiteDecoratorOverload<RunnerSuiteType>;
    skip: SuiteDecoratorOverload<RunnerSuiteType>;
    pending: SuiteDecoratorOverload<RunnerSuiteType>;
}
export interface TestDecorator<RunnerTestType> extends TestDecoratorOverload<RunnerTestType> {
    only: TestDecoratorOverload<RunnerTestType>;
    skip: TestDecoratorOverload<RunnerTestType>;
    pending: TestDecoratorOverload<RunnerTestType>;
}
export declare type SuiteTrait<RunnerSuiteType> = (this: RunnerSuiteType, ctx: RunnerSuiteType, ctor: SuiteCtor) => void;
export declare type TestTrait<RunnerTestType> = (this: RunnerTestType, ctx: RunnerTestType, instance: SuiteProto, method: Function) => void;
export declare type NumericDecoratorOrTrait<RunnerSuiteType, RunnerTestType> = (value: number) => PropertyDecorator & MethodDecorator & ClassDecorator & SuiteTrait<RunnerSuiteType> & TestTrait<RunnerTestType>;
interface SuiteDecoratorOverload<RunnerSuiteType> extends ClassDecorator {
    (name?: string, ...traits: SuiteTrait<RunnerSuiteType>[]): ClassDecorator;
    (trait: SuiteTrait<RunnerSuiteType>, ...traits: SuiteTrait<RunnerSuiteType>[]): ClassDecorator;
}
interface TestDecoratorOverload<RunnerTestType> extends MethodDecorator {
    (name?: string, ...traits: TestTrait<RunnerTestType>[]): MethodDecorator;
    (trait: TestTrait<RunnerTestType>, ...traits: TestTrait<RunnerTestType>[]): MethodDecorator;
}
declare type Done = (err?: any) => void;
export declare type MaybeAsyncCallback = (done?: Done) => void | Promise<void>;
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
export interface TestRunner<RunnerSuiteType, RunnerTestType> {
    /**
     * Declare a test suite. For example:
     *  - For mocha and jest call "global.describe".
     * @param name The name of the suite.
     * @param cb A callback that will be executed and will declare child suites and tests.
     */
    declareSuite(name: string, cb: () => void): any;
    /**
     * Declare a test. For example:
     *  - for mocha and jest call "global.it".
     * @param name
     * @param cb
     */
    declareTest(name: string, cb: MaybeAsyncCallback): any;
    /**
     * Declares a suite, that is the only suite the runner should execute.
     * For example with the mocha runner these are declared as `describe.only("suite", cb)`.
     * These are very useful for development, when you want to focus on a single suite and reduce code change to test execution times.
     */
    declareSuiteOnly?(name: string, cb: () => void): any;
    declareSuiteSkip?(name: string, cb: () => void): any;
    declareSuitePending?(name: string, cb: () => void): any;
    /**
     * Declares a test, that is the only test the runner should execute.
     * For example with the mocha runner these are declared as `it.only("suite", cb)`.
     * hese are very useful for development, when you want to focus on a single suite and reduce code change to test execution times.
     */
    declareTestOnly?(name: string, cb: MaybeAsyncCallback): any;
    /**
     * For example:
     *  - For mocha call "global.it.skip"
     *  - For jasmine call "global.xit"
     * @param name The name of the suite.
     * @param cb A test callback thay may be provided.
     */
    declareTestSkip?(name: string, cb: MaybeAsyncCallback): any;
    /**
     * For example:
     *  - For mocha call "global.it" without argument
     *  - For jasmine call "global.xit"
     * @param name The name of the suite.
     * @param cb A test callback thay may be provided.
     */
    declareTestPending?(name: string): any;
    declareBeforeAll?(cb: MaybeAsyncCallback): any;
    declareBeforeEach?(cb: MaybeAsyncCallback): any;
    declareAfterAll?(cb: MaybeAsyncCallback): any;
    declareAfterEach?(cb: MaybeAsyncCallback): any;
    setSlow?(context: RunnerSuiteType | RunnerTestType, ms: number): any;
    setTimeout?(context: RunnerSuiteType | RunnerTestType, ms: number): any;
    setRetries?(context: RunnerSuiteType | RunnerTestType, attempts: number): any;
}
export declare class ClassTestUI<RunnerSuiteType, RunnerTestType> implements ClassTestUI<RunnerSuiteType, RunnerTestType> {
    /**
     * This is supposed to create a `Symbol(key)` but some platforms does not support Symbols yet so fallback to string keys for now.
     * @param key
     */
    protected static MakeSymbol(key: string): string;
    private static readonly suiteSymbol;
    private static readonly testNameSymbol;
    private static readonly parametersSymbol;
    private static readonly nameForParametersSymbol;
    private static readonly slowSymbol;
    private static readonly timeoutSymbol;
    private static readonly retriesSymbol;
    private static readonly onlySymbol;
    private static readonly pendingSymbol;
    private static readonly skipSymbol;
    private static readonly traitsSymbol;
    private static readonly isTraitSymbol;
    private static readonly contextSymbol;
    readonly runner: TestRunner<RunnerSuiteType, RunnerTestType>;
    readonly suite: SuiteDecorator<RunnerSuiteType>;
    readonly test: TestDecorator<RunnerTestType>;
    readonly params: ParameterisedTestDecorator;
    readonly slow: NumericDecoratorOrTrait<RunnerSuiteType, RunnerTestType>;
    readonly timeout: NumericDecoratorOrTrait<RunnerSuiteType, RunnerTestType>;
    readonly retries: NumericDecoratorOrTrait<RunnerSuiteType, RunnerTestType>;
    readonly pending: ConditionalClassAndMethodDecorator;
    readonly only: ConditionalClassAndMethodDecorator;
    readonly skip: ConditionalClassAndMethodDecorator;
    readonly context: PropertyDecorator;
    private readonly dependencyInjectionSystems;
    constructor(runner: TestRunner<RunnerSuiteType, RunnerTestType>);
    /**
     * Register a dependency injection system to be used when instantiating test classes.
     * @param instantiator The dependency injection system implementation.
     */
    registerDI(instantiator: DependencyInjectionSystem): void;
    /**
     * Declares the provided object as trait.
     */
    trait<Arg extends SuiteTrait<RunnerSuiteType> | TestTrait<RunnerTestType>>(arg: Arg): Arg;
    private wrapNameAndToString;
    private applyDecorators;
    private applyTestTraits;
    private applySuiteTraits;
    private getInstance;
    private suiteClassCallback;
    private makeSuiteObject;
    private makeSuiteFunction;
    private suiteFuncCheckingDecorators;
    private suiteOverload;
    private makeTestObject;
    private makeTestFunction;
    private testOverload;
    private makeParamsFunction;
    private makeParamsNameFunction;
    private makeParamsObject;
    private createNumericBuiltinTrait;
    private createExecutionModifier;
}
export {};
