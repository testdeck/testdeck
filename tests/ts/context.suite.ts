import * as mocha from "mocha";
import { suite, test, slow, timeout, skip, only, pending, context } from "../../index";

@suite class Static {
    @test one() {
    }
}

[
    { url: "google.com", title: "google" },
    { url: "github.com", title: "github" },
    { url: "npmjs.com", title: "npmjs" }
].forEach(({ url, title }) => {
    // Nice question: How to share the same instance for all tests?
    @suite(`OAuth ${title}`) class OAuthTest {

        // Get the mocha context in for instance before and after (before/after each) and test methods.
        @context mocha: mocha.IBeforeAndAfterContext & mocha.IHookCallbackContext;

        // Get the mocha context for static before and after.
        @context static mocha: mocha.IBeforeAndAfterContext & mocha.IHookCallbackContext;

        @test async "Request token"() {
            // return (await request(url)).responce.headers.token;
            return Promise.resolve();
        }
        @test async "Exchange token for oauth session"() {
            return Promise.resolve();
        }
        @test async "Request sensitive data"() {
            return Promise.resolve();
        }
        after() {
            console.log("End of test: " + this.mocha.currentTest.fullTitle());
        }
        static after() {
            // After all tests
            console.log("End of test: " + !!this.mocha);
        }
    }
});