import "reflect-metadata";
import { Container } from "typedi";
import { registerDI } from "../index";

registerDI({
    handles: () => true,
    create: (cls) => Container.get(cls),
});
