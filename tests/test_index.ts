import { Thing, Time, collection } from '../src';
import { Matrix } from '@sivrad/matrix';

new Matrix([collection]);

const t = new Thing({
    start: new Time({
        timestamp: 1617731548,
    }),
});

console.log(t.getStart()?.getTimestamp());
