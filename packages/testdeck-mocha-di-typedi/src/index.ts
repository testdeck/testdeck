import "reflect-metadata";

import { Container } from "typedi";

import { registerDI } from "testdeck-mocha";

registerDI({
    handles: (cls) => true,
    create: (cls) => Container.get(cls),
});
