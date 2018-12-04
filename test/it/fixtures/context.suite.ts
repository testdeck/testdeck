import * as mocha from "mocha";
import { context, only, pending, skip, slow, suite, test, timeout } from "../../../index";

@suite class Static {
    @test public one() {
    }
}

[
    { url: "google.com", title: "google" },
    { url: "github.com", title: "github" },
    { url: "npmjs.com", title: "npmjs" },
].forEach(({ url, title }) => {
    // Nice question: How to share the same instance for all tests?
    @suite(`OAuth ${title}`) class OAuthTest {

        // Get the mocha context in for instance before and after (before/after each) and test methods.
        @context public mocha: mocha.Context;

        // Get the mocha context for static before and after.
        @context public static mocha: mocha.Context;

        @test public async "Request token"() {
            // return (await request(url)).response.headers.token;
            return Promise.resolve();
        }
        @test public async "Exchange token for oauth session"() {
            return Promise.resolve();
        }
        @test public async "Request sensitive data"() {
            return Promise.resolve();
        }
        public after() {
            console.log("End of test: " + this.mocha.currentTest.fullTitle());
        }
        public static after() {
            // After all tests
            console.log("End of test: " + !!this.mocha);
        }
    }
});
