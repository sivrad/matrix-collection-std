import { collection, FaunaDBSource, Time } from '../src';
import { Matrix } from '@sivrad/matrix';
import * as dotenv from 'dotenv';
dotenv.config();

const s = new FaunaDBSource(process.env.APIKEY!);
new Matrix([collection], {
    primary: s,
});

const pprint = (obj: unknown) => console.log(JSON.stringify(obj, null, 4));

const main = async () => {
    const time = await Time.get<Time>('295237136496460292');
    time.setTimestamp(4444);
    console.log(time);

    // time.setTimestamp(2222);
    // await time.syncData();
    // console.log();

    // const t = await new Time({ $id: '295237136496460292' }).syncData();
    // t.setTimestamp(234);
    // await t.syncData();
    // console.log(t.getTimestamp());
};

main()
    .then(() => process.exit(0))
    .catch((e) => {
        console.error(e);
        process.exit(1);
    });

// const t = new Thing({
//     start: new Time({
//         timestamp: 1617731548,
//     }),
// });

// console.log(t.getStart()?.getTimestamp());
