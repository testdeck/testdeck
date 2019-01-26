import "reflect-metadata";

import { Container } from "typedi";

import { registerDI } from "mocha-typescript";

registerDI({
    handles: (cls) => Container.has(cls),
    create: (cls) => Container.get(cls),
});
