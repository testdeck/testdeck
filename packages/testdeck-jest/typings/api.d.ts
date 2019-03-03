interface Overload<V extends SuiteTrait | TestTrait, R extends ClassDecorator | MethodDecorator> {
  (name?: string, ... traits: V[]): R;
  (trait: V, ... traits: V[]): R;
}

interface SuiteDecoratorOverload extends Overload<SuiteTrait, ClassDecorator>, ClassDecorator {
}

interface TestDecoratorOverload extends Overload<TestTrait, MethodDecorator>, MethodDecorator {
}

export interface SuiteDecorator extends SuiteDecoratorOverload {
  only: SuiteDecoratorOverload;
  skip: SuiteDecoratorOverload;
  pending: SuiteDecoratorOverload;
}

export interface TestDecorator extends TestDecoratorOverload {
  only: TestDecoratorOverload;
  skip: TestDecoratorOverload;
  pending: TestDecoratorOverload;
}

export interface ParameterisedTestDecorator {
  (params: any, name?: string): MethodDecorator;
  skip(params: any, name?: string): MethodDecorator;
  only(params: any, name?: string): MethodDecorator;
  pending(params: any, name?: string): MethodDecorator;
  naming(nameForParameters: (parameters: any) => string): MethodDecorator;
}

export interface TestFunctions {
  it: jest.It;
  describe: jest.Describe;
  before: jest.Lifecycle;
  after: jest.Lifecycle;
  beforeEach: jest.Lifecycle;
  afterEach: jest.Lifecycle;
}

interface ProvidesOptionalCallback extends jest.ProvidesCallback {
  (cb?: jest.DoneCallback): any;
}

export interface SuiteCtor extends Class<SuiteProto> {
  before?: ProvidesOptionalCallback;
  after?: ProvidesOptionalCallback;
}

export interface SuiteProto extends Prototype {
  before?: ProvidesOptionalCallback;
  after?: ProvidesOptionalCallback;
}

export type SuiteTrait = (this: any, ctx: any, ctor: SuiteCtor) => void;
export type TestTrait = (this: any, ctx: any, instance: SuiteProto, method: Function) => void;

export type NumericDecoratorOrTrait = (time: number) => PropertyDecorator & MethodDecorator & ClassDecorator & SuiteTrait & TestTrait;
export type ClassOrMethodDecorator = () => MethodDecorator | ClassDecorator;

export interface SkipDecorator extends ClassOrMethodDecorator {
  (condition: boolean): ClassOrMethodDecorator;
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
