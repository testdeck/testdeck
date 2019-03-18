// example taken from karma-typescript
import { suite, test } from "@testdeck/mocha";
import { HelloService } from "./hello-service.interface";
import { HelloComponent } from "./hello.component";

class MockHelloService implements HelloService {

    public sayHello(): string {
        return "Hello karma!";
    }
}

@suite
class HelloKarmaTest {
  @test
  shouldSayHelloKarma() {

    let mockHelloService = new MockHelloService();
    let helloComponent = new HelloComponent(mockHelloService);

    expect(helloComponent.sayHello()).to.be("Hello karma!");
  }
}
