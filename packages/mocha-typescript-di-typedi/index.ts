import "reflect-metadata";

import { Container } from "typedi";

import { registerDI } from "mocha-typescript";

registerDI({
    handles: (cls) => true,
    create: (cls) => Container.get(cls),
});
