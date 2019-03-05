/**
 * A class that encapsulates the decorators test ui based on a TestRunner adapter. 
 */
export class ClassTestUI<RunnerSuiteType, RunnerTestType> {
  /**
   * Register a dependency injection system to be used when instantiating test classes.
   * @param instantiator The dependency injection system implementation.
   */
  public registerDI(instantiator: DependencyInjectionSystem): void;

  /**
   * Declares the provided object as trait.
   */
  public trait<Arg extends SuiteTrait<RunnerSuiteType> | TestTrait<RunnerTestType>>(arg: Arg): Arg;

  public readonly runner: TestRunner<RunnerSuiteType, RunnerTestType>;

  public constructor(runner: TestRunner<RunnerSuiteType, RunnerTestType>);

  public readonly suite: SuiteDecorator<RunnerSuiteType>;
  public readonly test: TestDecorator<RunnerTestType>;
  public readonly params: ParameterisedTestDecorator;

  public readonly slow: NumericDecoratorOrTrait<RunnerSuiteType, RunnerTestType>;
  public readonly timeout: NumericDecoratorOrTrait<RunnerSuiteType, RunnerTestType>;
  public readonly retries: NumericDecoratorOrTrait<RunnerSuiteType, RunnerTestType>;

  public readonly pending: ClassOrMethodDecorator;
  public readonly only: ClassOrMethodDecorator;
  public readonly skip: SkipDecorator;

  public readonly context: PropertyDecorator;

  public readonly skipOnError: SuiteTrait<RunnerSuiteType>;
}

interface SuiteDecoratorOverload<RunnerSuiteType> extends ClassDecorator {
  (name?: string, ...traits: SuiteTrait<RunnerSuiteType>[]): ClassDecorator;
  (trait: SuiteTrait<RunnerSuiteType>, ...traits: SuiteTrait<RunnerSuiteType>[]): ClassDecorator;
}

interface TestDecoratorOverload<RunnerTestType> extends MethodDecorator {
  (name?: string, ...traits: TestTrait<RunnerTestType>[]): MethodDecorator;
  (trait: TestTrait<RunnerTestType>, ...traits: TestTrait<RunnerTestType>[]): MethodDecorator;
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

export interface ParameterisedTestDecorator {
  (params: any, name?: string): MethodDecorator;
  skip(params: any, name?: string): MethodDecorator;
  only(params: any, name?: string): MethodDecorator;
  pending(params: any, name?: string): MethodDecorator;
  naming(nameForParameters: (parameters: any) => string): MethodDecorator;
}

type Done = (err?: any) => void;

export interface SuiteCtor extends Class<SuiteProto> {
  before?: (done?: Done) => void;
  after?: (done?: Done) => void;
}

export interface SuiteProto extends Prototype {
  before?: (done?: Done) => void;
  after?: (done?: Done) => void;
}

export type SuiteTrait<RunnerSuiteType> = (this: RunnerSuiteType, ctx: RunnerSuiteType, ctor: SuiteCtor) => void;
export type TestTrait<RunnerTestType> = (this: RunnerTestType, ctx: RunnerTestType, instance: SuiteProto, method: Function) => void;

export type NumericDecoratorOrTrait<RunnerSuiteType, RunnerTestType> = (value: number) => PropertyDecorator & MethodDecorator & ClassDecorator & SuiteTrait<RunnerSuiteType> & TestTrait<RunnerTestType>;

export interface ConditionalClassAndMethodDecorator extends MethodDecorator, ClassDecorator {
  (condition: boolean): MethodDecorator | ClassDecorator;
}

export interface Prototype {
  [key: string]: any;
}

export interface Class<T extends Prototype> {
  new(...args: any[]): T;
  [key: string]: any;
  prototype: T;
}

export interface DependencyInjectionSystem {
  handles<T>(cls: Class<T>): boolean;
  create<T>(cls: Class<T>): T;
}

/**
 * A class, provided to the DependencyInjectionSystem when an instance of this class has to be created.
 */
export interface Class<T extends Prototype> {
  new(...args: any[]): T;
  prototype: T;
}

/**
 * A prototype of a Class.
 */
export interface Prototype {
}

/**
 * Dependency injection system.
 * Object instantiation for tests is abstracted.
 * A custom implementation of the DependencyinjectionSystem can be provided to registerDI.
 */
export interface DependencyInjectionSystem {
  /**
   * Check if this dependency injection system handles the class.
   * Return true if the class instantiation should be handled by this instance,
   * or fals if the class will be handled by the default or another dependency system.
   * @param cls The class.
   */
  handles<T>(cls: Class<T>): boolean;

  /**
   * For a class managed by this dependency injection system, create an instance and inject dependencies.
   * @param cls The class.
   */
  create<T>(cls: Class<T>): T;
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
export interface TestRunner<RunnerSuiteType, RunnerTestType> {
  /**
   * Declare a test suite. For example:
   *  - For mocha and jest call "global.describe".
   * @param name The name of the suite.
   * @param cb A callback that will be executed and will declare child suites and tests.
   */
  declareSuite(name: string, cb: () => void);

  /**
   * Declare a test. For example:
   *  - for mocha and jest call "global.it".
   * @param name 
   * @param cb 
   */
  declareTest(name: string, cb: () => void | Promise<void>);

  /**
   * Declares a suite, that is the only suite the runner should execute.
   * For example with the mocha runner these are declared as `describe.only("suite", cb)`.
   * These are very useful for development, when you want to focus on a single suite and reduce code change to test execution times.
   */
  declareSuiteOnly?(name: string, cb: () => void);

  declareSuiteSkip?(name: string, cb: () => void);

  declareSuitePending?(name: string, cb: () => void);

  /**
   * Declares a test, that is the only test the runner should execute.
   * For example with the mocha runner these are declared as `it.only("suite", cb)`.
   * hese are very useful for development, when you want to focus on a single suite and reduce code change to test execution times.
   */
  declareTestOnly?(name: string, cb: () => void);

  /**
   * For example:
   *  - For mocha call "global.it.skip"
   *  - For jasmine call "global.xit"
   * @param name The name of the suite.
   * @param cb A test callback thay may be provided.
   */
  declareTestSkip?(name: string, cb: () => void | Promise<void>);

  /**
   * For example:
   *  - For mocha call "global.it" without argument
   *  - For jasmine call "global.xit"
   * @param name The name of the suite.
   * @param cb A test callback thay may be provided.
   */
  declareTestPending?(name: string);

  declareBeforeAll?(cb: () => void | Promise<void>);
  declareBeforeEach?(cb: () => void | Promise<void>);
  declareAfterAll?(cb: () => void | Promise<void>);
  declareAfterEach?(cb: () => void | Promise<void>);

  // TODO: I am sloppy here, before merge split on "setSuiteSlow" and "setTestSlow" pairs
  setSlow?(context: RunnerSuiteType | RunnerTestType, ms: number);
  setTimeout?(context: RunnerSuiteType | RunnerTestType, ms: number);
  setRetries?(context: RunnerSuiteType | RunnerTestType, attempts: number);
}
