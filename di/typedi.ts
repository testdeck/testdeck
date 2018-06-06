import "reflect-metadata";
import { Container } from 'typedi';
import { register } from '../index';

register({
    handles: () => true,
    create: (cls) => Container.get(cls),
});
