import { suite, test } from "../../../index";

interface TestMixin {
  [key: string]: any;
}

abstract class AbstractMixinTestBase implements TestMixin {

  [key: string]: any;
}

class TestsMixin1 {

  @test test1() {}
}

class TestsMixin2 {

  @test test2() {}
}

// courtesy of https://www.typescriptlang.org/docs/handbook/mixins.html
function applyMixins(derivedCtor: any, baseCtors: any[]) {
  baseCtors.forEach((baseCtor) => {
    Object.getOwnPropertyNames(baseCtor.prototype).forEach((name) => {
      derivedCtor.prototype[name] = baseCtor.prototype[name];
    });
  });
}

[
  { title: "google", url: "www.google.com", bases: [TestsMixin1] },
  { title: "github", url: "www.github.com", bases: [TestsMixin1, TestsMixin2] },
].forEach(({title, url, bases}) => {
  class GeneratedTestClass extends AbstractMixinTestBase {
    @test login() {}
    @test logout() {}
  }
  applyMixins(GeneratedTestClass, bases);
  suite(GeneratedTestClass);
});
