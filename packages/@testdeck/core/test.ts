import { assert } from "chai";
import * as chai from "chai";
import * as chaiAsPromised from "chai-as-promised";
import {
    CallbackOptionallyAsync,
    ClassTestUI,
    Done,
    LifecycleSettings,
    SuiteSettings,
    TestClass,
    TestSettings
} from "./index";

chai.use(chaiAsPromised);

class LoggingClassTestUI extends ClassTestUI {
    public log: LoggingClassTestUI.Log;
    private readonly logger: LoggingClassTestUI.LoggingRunner;
    constructor() {
        const runner = new LoggingClassTestUI.LoggingRunner();
        super(runner);
        this.log = LoggingClassTestUI.Log.Default;
        runner.ui = this;
        this.logger = runner;
    }
    get root(): LoggingClassTestUI.ChildInfo[] { return this.logger.peek; }
}

namespace LoggingClassTestUI {
    export interface LifecycleInfo {
        type: "beforeAll" | "afterAll" | "beforeEach" | "afterEach";
        name: string;
        callback?: CallbackOptionallyAsync;
        settings?: LifecycleSettings;
    }

    export interface TestInfo {
        type: "test";
        name: string;
        callback?: CallbackOptionallyAsync;
        settings?: TestSettings;
    }

    export interface SuiteInfo {
        type: "suite";
        name: string;
        callback?: () => void;
        settings?: SuiteSettings;
        children: ChildInfo[];
    }

    export type ChildInfo = SuiteInfo | TestInfo | LifecycleInfo;

    export class LoggingRunner {
        public ui: LoggingClassTestUI;
        public stack: ChildInfo[][] = [[]];

        get peek(): ChildInfo[] { return this.stack[this.stack.length - 1]; }

        public suite(name: string, callback: () => void, settings?: SuiteSettings) {
            const suite: SuiteInfo = { type: "suite", name, children: [] };
            if (settings) { suite.settings = settings; }
            if (this.ui.log & LoggingClassTestUI.Log.Callback) { suite.callback = callback; }
            this.peek.push(suite);
            this.stack.push(suite.children);
            try {
                callback();
            } finally {
                this.stack.pop();
            }
        }
        public test(name: string, callback: CallbackOptionallyAsync, settings?: TestSettings) {
            const test: TestInfo = { type: "test", name };
            if (settings) { test.settings = settings; }
            if (this.ui.log & LoggingClassTestUI.Log.Callback) { test.callback = callback; }
            this.peek.push(test);
        }
        public beforeAll(name: string, callback: CallbackOptionallyAsync, settings: LifecycleSettings) {
            const before: ChildInfo = { type: "beforeAll", name };
            if (settings) { before.settings = settings; }
            if (this.ui.log & LoggingClassTestUI.Log.Callback) { before.callback = callback; }
            this.peek.push(before);
        }
        public beforeEach(name: string, callback: CallbackOptionallyAsync, settings: LifecycleSettings) {
            if (name === "setup instance" && !(this.ui.log & LoggingClassTestUI.Log.SetupTeardown)) { return; }
            const before: ChildInfo = { type: "beforeEach", name };
            if (settings) { before.settings = settings; }
            if (this.ui.log & LoggingClassTestUI.Log.Callback) { before.callback = callback; }
            this.peek.push(before);
        }
        public afterEach(name: string, callback: CallbackOptionallyAsync, settings: LifecycleSettings) {
            if (name === "teardown instance" && !(this.ui.log & LoggingClassTestUI.Log.SetupTeardown)) { return; }
            const after: ChildInfo = { type: "afterEach", name };
            if (settings) { after.settings = settings; }
            if (this.ui.log & LoggingClassTestUI.Log.Callback) { after.callback = callback; }
            this.peek.push(after);
        }
        public afterAll(name: string, callback: CallbackOptionallyAsync, settings: LifecycleSettings) {
            const after: ChildInfo = { type: "afterAll", name };
            if (settings) { after.settings = settings; }
            if (this.ui.log & LoggingClassTestUI.Log.Callback) { after.callback = callback; }
            this.peek.push(after);
        }
    }

    export const enum Log {
        Default = 0,
        SetupTeardown = 1,
        Callback = 2,
        All = SetupTeardown | Callback
    }
}

function cleancov(s: string): string {

    return s.replace(/cov_[^.]+[.](f|s)[^+]+[+][+];/g, "");
}

describe("testdeck", function() {
    let ui: LoggingClassTestUI;
    beforeEach("create ui", function() {
        ui = new LoggingClassTestUI();
    });
    afterEach("clear ui", function() {
        ui = null;
    });

    describe("decorators", function() {

        // TODO: `suite("s", () => { it("t", () => {})});`
        it("functional usage");

        it("plain @suite and @test", function() {

            @ui.suite class SimpleSuite {
                @ui.test public simpleTest() {}
            }

            @ui.suite() class SimpleSuite2 {
                @ui.test() public simpleTest2() {}
            }

            assert.deepEqual(ui.root, [{
                type: "suite",
                name: "SimpleSuite",
                children: [{
                    type: "test",
                    name: "simpleTest",
                }]
            }, {
                type: "suite",
                name: "SimpleSuite2",
                children: [{
                    type: "test",
                    name: "simpleTest2",
                }]
            }]);
        });

        it("execution modifier and settings combo", function() {

            @ui.suite(ui.slow(10), ui.timeout(20), ui.retries(3))
            class SuiteWithTimeouts {
                @ui.test(ui.slow(20), ui.timeout(40), ui.retries(5))
                public test1() {}
                @ui.test
                public test2() {}
                @ui.test(ui.skip)
                public test3() {}
            }

            @ui.suite
            @ui.slow(10)
            @ui.timeout(20)
            @ui.retries(3)
            class SuiteWithTimeoutsAsDecorators {
                @ui.test
                @ui.slow(5)
                @ui.skip
                public test1() {}

                @ui.test(ui.timeout(10))
                @ui.skip(true)
                public test2() {}

                @ui.test(ui.retries(2))
                @ui.skip(false)
                public test3() {}
            }

            @ui.suite
            @ui.only
            class SuiteOnlyThis {
                @ui.test
                public test1() {}

                @ui.test.skip
                public test2() {}

                @ui.test.pending()
                public test3() {}

                @ui.test.only("testXX")
                public test4() {}

                @ui.test("testYY", ui.only)
                public test5() {}
            }

            @ui.suite.skip
            class SkipSuite {}

            @ui.suite.pending
            class PendingSuite {}

            assert.deepEqual(ui.root, [{
                type: "suite",
                name: "SuiteWithTimeouts",
                settings: {
                    slow: 10,
                    timeout: 20,
                    retries: 3
                },
                children: [{
                    type: "test",
                    name: "test1",
                    settings: {
                        slow: 20,
                        timeout: 40,
                        retries: 5
                    }
                }, {
                    type: "test",
                    name: "test2"
                }, {
                    type: "test",
                    name: "test3",
                    settings: {
                        execution: "skip"
                    }
                }]
            }, {
                type: "suite",
                name: "SuiteWithTimeoutsAsDecorators",
                settings: {
                    slow: 10,
                    timeout: 20,
                    retries: 3
                },
                children: [{
                    type: "test",
                    name: "test1",
                    settings: {
                        slow: 5,
                        execution: "skip"
                    }
                }, {
                    type: "test",
                    name: "test2",
                    settings: {
                        timeout: 10,
                        execution: "skip"
                    }
                }, {
                    type: "test",
                    name: "test3",
                    settings: {
                        retries: 2
                    }
                }]
            }, {
                type: "suite",
                name: "SuiteOnlyThis",
                settings: {
                    execution: "only"
                },
                children: [{
                    type: "test",
                    name: "test1"
                }, {
                    type: "test",
                    name: "test2",
                    settings: {
                        execution: "skip"
                    }
                }, {
                    type: "test",
                    name: "test3",
                    settings: {
                        execution: "pending"
                    }
                }, {
                    type: "test",
                    name: "testXX",
                    settings: {
                        execution: "only"
                    }
                }, {
                    type: "test",
                    name: "testYY",
                    settings: {
                        execution: "only"
                    }
                }]
            }, {
                type: "suite",
                name: "SkipSuite",
                settings: {
                    execution: "skip"
                },
                children: []
            }, {
                type: "suite",
                name: "PendingSuite",
                settings: {
                    execution: "pending"
                },
                children: []
            }]);
        });

        it("before and after", function() {

            ui.log = LoggingClassTestUI.Log.SetupTeardown;

            @ui.suite class SomeSuite {
                public static before() {}
                public before() {}
                public after() {}
                public static after() {}
            }

            assert.deepEqual(ui.root, [{
                type: "suite",
                name: "SomeSuite",
                children: [{
                    type: "beforeAll",
                    name: "static before"
                }, {
                    type: "beforeEach",
                    name: "setup instance"
                }, {
                    type: "beforeEach",
                    name: "before"
                }, {
                    type: "afterEach",
                    name: "after"
                }, {
                    type: "afterEach",
                    name: "teardown instance"
                }, {
                    type: "afterAll",
                    name: "static after"
                }]
            }]);
        });

        it("async done callbacks", function() {

            ui.log = LoggingClassTestUI.Log.Callback;

            @ui.suite class AllSync {
                public static before() {}
                public before() {}
                @ui.test public test() {}
                public after() {}
                public static after() {}
            }

            @ui.suite class AllAsync {
                public static before(done: Done) {}
                public before(done: Done) {}
                @ui.test public test(done: Done) {}
                public after(done: Done) {}
                public static after(done: Done) {}
            }

            assert.equal(ui.root.length, 2);
            const syncSuite = (ui.root[0] as LoggingClassTestUI.SuiteInfo);
            const asyncSuite = (ui.root[1] as LoggingClassTestUI.SuiteInfo);
            assert.equal(syncSuite.children.length, 5);
            assert.equal(asyncSuite.children.length, 5);
            syncSuite.children.forEach((child) => assert.equal(child.callback.length, 0));
            asyncSuite.children.forEach((child) => assert.equal(child.callback.length, 1));
        });

        it("named suites and tests", function() {

            @ui.suite("My Special Named Suite")
            class Suite {
                @ui.test("My Special Named Test")
                public test() {}
            }

            assert.deepEqual(ui.root, [{
                type: "suite",
                name: "My Special Named Suite",
                children: [{
                    type: "test",
                    name: "My Special Named Test"
                }]
            }]);
        });

        it("suite can inherit abstract base class, but not another suite", function() {
            @ui.suite class Base1 {
                @ui.test public test1() {}
            }
            abstract class Base2 {
                @ui.test public test2() {}
            }
            assert.throw(function() {
                @ui.suite class Derived1 extends Base1 {
                    @ui.test public test3() {}
                }
            });
            @ui.suite class Derived2 extends Base2 {
                @ui.test public test4() {}
            }

            assert.deepEqual(ui.root, [{
                type: "suite",
                name: "Base1",
                children: [{
                    type: "test",
                    name: "test1"
                }]
            }, {
                type: "suite",
                name: "Derived2",
                children: [{
                    type: "test",
                    name: "test4"
                }, {
                    type: "test",
                    name: "test2"
                }]
            }]);
        });

        it("params", function() {
            @ui.suite
            class TestSuite {
                @ui.params({ a: 1, b: 2, c: 3 })
                @ui.params({ a: 4, b: 5, c: 9 }, "three")
                @ui.params.skip({ a: 4, b: 5, c: 6 }, "one")
                @ui.params.pending({ a: 4, b: 5, c: 6 }, "two")
                @ui.params.only({ a: 4, b: 5, c: 6 })
                public test1({ a, b, c }) {}

                @ui.params({ a: 1, b: 2, c: 3 })
                @ui.params({ a: 4, b: 5, c: 9 })
                @ui.params.naming(({ a, b, c }) => `adding ${a} and ${b} must equal ${c}`)
                public test2({ a, b, c }) {}
            }

            assert.deepEqual(ui.root, [{
                type: "suite",
                name: "TestSuite",
                children: [{
                    type: "suite",
                    name: "test1",
                    children: [{
                        type: "test",
                        name: "test1 0"
                    }, {
                        type: "test",
                        name: "three"
                    }, {
                        type: "test",
                        name: "one",
                        settings: {
                          execution: "skip"
                        }
                    }, {
                        type: "test",
                        name: "two",
                        settings: {
                          execution: "pending"
                        }
                    }, {
                        type: "test",
                        name: "test1 4",
                        settings: {
                          execution: "only"
                        }
                    }]
                }, {
                    type: "suite",
                    name: "test2",
                    children: [{
                        type: "test",
                        name: "adding 1 and 2 must equal 3"
                    }, {
                        type: "test",
                        name: "adding 4 and 5 must equal 9"
                    }]
                }]
            }]);
        });
    });

    describe("lifecycle hooks", function() {

        it("sync tests", function() {

            ui.log = LoggingClassTestUI.Log.All;

            const cycle: string[] = [];

            @ui.suite class MyClass {
                constructor() { cycle.push("Constructor"); }
                public static before() { cycle.push("Before All"); }
                public before() { cycle.push("Before Each"); }
                @ui.test public myTest() { cycle.push("Test"); }
                public after() { cycle.push("After Each"); }
                public static after() { cycle.push("After All"); }
            }

            const suite = ui.root[0] as LoggingClassTestUI.SuiteInfo;

            const callbacks = suite.children.map((c) => c.callback);

            assert.equal(callbacks[0].name, "before");
            assert.equal(callbacks[0].toString(), 'before() { cycle.push("Before All"); }');

            assert.equal(callbacks[1].name, "setupInstance");
            assert.equal(cleancov(callbacks[1].toString()), "function setupInstance(){instance=theTestUI.createInstance(constructor);}");

            assert.equal(callbacks[2].name, "before");
            assert.equal(callbacks[2].toString(), 'before() { cycle.push("Before Each"); }');

            assert.equal(callbacks[3].name, "myTest");
            assert.equal(callbacks[3].toString(), 'myTest() { cycle.push("Test"); }');

            assert.equal(callbacks[4].name, "after");
            assert.equal(callbacks[4].toString(), 'after() { cycle.push("After Each"); }');

            assert.equal(callbacks[5].name, "teardownInstance");
            assert.equal(cleancov(callbacks[5].toString()), "function teardownInstance(){instance=null;}");

            assert.equal(callbacks[6].name, "after");
            assert.equal(callbacks[6].toString(), 'after() { cycle.push("After All"); }');

            callbacks[0]();
            callbacks[1]();
            callbacks[2]();
            callbacks[3]();
            callbacks[4]();
            callbacks[5]();
            callbacks[6]();

            assert.deepEqual(cycle, [
              "Before All",
              "Constructor",
              "Before Each",
              "Test",
              "After Each",
              "After All"
            ]);

            // TODO: Call GC, check if a weak ref to the MyClass will be cleared!
        });

        it("promise async lifecycle", async function() {

            ui.log = LoggingClassTestUI.Log.All;

            const cycle: string[] = [];

            function ping(): Promise<void> {
                return new Promise<void>((done, err) => setTimeout(done, 0));
            }

            @ui.suite class MyClass {
                constructor() {
                    cycle.push("Constructor");
                }
                public static async before() {
                    cycle.push("Before All");
                    await ping();
                    cycle.push("post Before All");
                }
                public async before() {
                    cycle.push("Before Each");
                    await ping();
                    cycle.push("post Before Each");
                }
                @ui.test public async myTest() {
                    cycle.push("Test");
                    await ping();
                    cycle.push("post Test");
                }
                public async after() {
                    cycle.push("After Each");
                    await ping();
                    cycle.push("post After Each");
                }
                public static async after() {
                    cycle.push("After All");
                    await ping();
                    cycle.push("post After All");
                }
            }

            const suite = ui.root[0] as LoggingClassTestUI.SuiteInfo;

            let promise;
            promise = suite.children[0].callback();
            assert(promise instanceof Promise);
            await promise;
            suite.children[1].callback();
            promise = suite.children[2].callback();
            assert(promise instanceof Promise);
            await promise;
            promise = suite.children[3].callback();
            assert(promise instanceof Promise);
            await promise;
            promise = suite.children[4].callback();
            assert(promise instanceof Promise);
            await promise;
            suite.children[5].callback();
            promise = suite.children[6].callback();
            assert(promise instanceof Promise);
            await promise;

            assert.deepEqual(cycle, [
              "Before All",
              "post Before All",
              "Constructor",
              "Before Each",
              "post Before Each",
              "Test",
              "post Test",
              "After Each",
              "post After Each",
              "After All",
              "post After All"
            ]);

            // TODO: Call GC, check if a weak ref to the MyClass will be cleared!
        });

        it("callback async lifecycle", async function() {

            ui.log = LoggingClassTestUI.Log.All;

            const cycle: string[] = [];

            function ping(): Promise<void> {
                return new Promise<void>((done, err) => setTimeout(done, 0));
            }

            @ui.suite class MyClass {
                constructor() {
                    cycle.push("Constructor");
                }
                public static before(done) {
                    cycle.push("Before All");
                    setTimeout(() => {
                        cycle.push("post Before All");
                        done();
                    }, 0);
                }
                public before(done) {
                    cycle.push("Before Each");
                    setTimeout(() => {
                        cycle.push("post Before Each");
                        done();
                    }, 0);
                }
                @ui.test public myTest(done) {
                    cycle.push("Test");
                    setTimeout(() => {
                        cycle.push("post Test");
                        done();
                    }, 0);
                }
                public after(done) {
                    cycle.push("After Each");
                    setTimeout(() => {
                        cycle.push("post After Each");
                        done();
                    }, 0);
                }
                public static after(done) {
                    cycle.push("After All");
                    setTimeout(() => {
                        cycle.push("post After All");
                        done();
                    }, 0);
                }
            }

            const suite = ui.root[0] as LoggingClassTestUI.SuiteInfo;

            await new Promise((done) => suite.children[0].callback(done));
            suite.children[1].callback();
            await new Promise((done) => suite.children[2].callback(done));
            await new Promise((done) => suite.children[3].callback(done));
            await new Promise((done) => suite.children[4].callback(done));
            suite.children[5].callback();
            await new Promise((done) => suite.children[6].callback(done));

            assert.deepEqual(cycle, [
              "Before All",
              "post Before All",
              "Constructor",
              "Before Each",
              "post Before Each",
              "Test",
              "post Test",
              "After Each",
              "post After Each",
              "After All",
              "post After All"
            ]);

            // TODO: Call GC, check if a weak ref to the MyClass will be cleared!
        });

        it("throwing tests", function() {

            ui.log = LoggingClassTestUI.Log.All;

            @ui.suite class Suite {
                public static before() { assert.fail(); }
                public before() { assert.fail(); }
                @ui.test public test() { assert.fail(); }
                public after() { assert.fail(); }
                public static after() { assert.fail(); }
            }

            const suite = ui.root[0] as LoggingClassTestUI.SuiteInfo;

            assert.throws(suite.children[0].callback);
            suite.children[1].callback();
            assert.throws(suite.children[2].callback);
            assert.throws(suite.children[3].callback);
            assert.throws(suite.children[4].callback);
            suite.children[5].callback();
            assert.throws(suite.children[6].callback);
        });

        it("throwing async promise", async function() {

            ui.log = LoggingClassTestUI.Log.All;

            @ui.suite class Suite {
                public static before(done) {
                    setTimeout(function() {
                        done(new Error("Force fail."));
                    }, 0);
                }
                public before(done) {
                    setTimeout(function() {
                        done(new Error("Force fail."));
                    }, 0);
                }
                @ui.test public test(done) {
                    setTimeout(function() {
                        done(new Error("Force fail."));
                    }, 0);
                }
                public after(done) {
                    setTimeout(function() {
                        done(new Error("Force fail."));
                    }, 0);
                }
                public static after(done) {
                    setTimeout(function() {
                        done(new Error("Force fail."));
                    }, 0);
                }
            }

            const suite = ui.root[0] as LoggingClassTestUI.SuiteInfo;

            await assert.isRejected(new Promise((resolve, reject) => {
                suite.children[0].callback((err?) => err ? reject(err) : resolve());
            }));
            suite.children[1].callback();
            await assert.isRejected(new Promise((resolve, reject) => {
                suite.children[2].callback((err?) => err ? reject(err) : resolve());
            }));
            await assert.isRejected(new Promise((resolve, reject) => {
                suite.children[3].callback((err?) => err ? reject(err) : resolve());
            }));
            await assert.isRejected(new Promise((resolve, reject) => {
                suite.children[4].callback((err?) => err ? reject(err) : resolve());
            }));
            suite.children[5].callback();
            await assert.isRejected(new Promise((resolve, reject) => {
                suite.children[6].callback((err?) => err ? reject(err) : resolve());
            }));
        });

        it("throwing async callback", async function() {

            ui.log = LoggingClassTestUI.Log.All;

            @ui.suite class Suite {
                public static async before() {
                    assert.fail();
                }
                public async before() {
                    assert.fail();
                }
                @ui.test public async test(done) {
                    assert.fail();
                }
                public async after(done) {
                    assert.fail();
                }
                public static async after(done) {
                    assert.fail();
                }
            }

            const suite = ui.root[0] as LoggingClassTestUI.SuiteInfo;

            await assert.isRejected(suite.children[0].callback() as PromiseLike<void>);
            suite.children[1].callback();
            await assert.isRejected(suite.children[2].callback() as PromiseLike<void>);
            await assert.isRejected(suite.children[3].callback() as PromiseLike<void>);
            await assert.isRejected(suite.children[4].callback() as PromiseLike<void>);
            suite.children[5].callback();
            await assert.isRejected(suite.children[6].callback() as PromiseLike<void>);
        });

        it("instantiate through dependency injection", function() {

            ui.log = LoggingClassTestUI.Log.All;

            let x;
            let y;
            let z;

            @ui.suite class XClass {
                @ui.test public test() {
                    assert.equal(this, x);
                }
            }

            @ui.suite class YClass {
                @ui.test public test() {
                    assert.equal(this, y);
                }
            }

            @ui.suite class ZClass {
                constructor() {
                    z = this;
                }
                @ui.test public test() {
                    assert.equal(this, z);
                }
            }

            x = new XClass();
            y = new YClass();

            ui.registerDI({
                handles<T>(cls: TestClass<T>): boolean {
                    return cls.name.startsWith("X");
                },
                create<T>(cls: TestClass<T>): T {
                    return x;
                }
            });
            ui.registerDI({
                handles<T>(cls: TestClass<T>): boolean {
                    return cls.name.startsWith("Y");
                },
                create<T>(cls: TestClass<T>): T {
                    return y;
                }
            });

            ui.root
                .forEach((suite) => (suite as LoggingClassTestUI.SuiteInfo)
                    .children
                    .forEach((c) => c.callback())
            );
        });
    });
});

declare var setTimeout;
