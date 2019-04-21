require('dotenv').config();

const concurrentCollectorsLimit = 5;

const PromisePool = require('es6-promise-pool');
const moment = require('moment');
const di = require('./app/di');

const collector = di.get('logic.collector');

console.log('Collector running at', moment().utc().toString());

(async () => {
    try {
        const users = await collector.getUsersForCollect();

        let currentUserIdx = 0;
        const collectorProducer = () => {
            if (currentUserIdx >= users.length) {
                return null;
            }

            currentUserIdx++;
            const curUser = users[currentUserIdx - 1];

            return collector.collect(curUser.id, curUser.name);
        };

        const pool = new PromisePool(collectorProducer, concurrentCollectorsLimit);
        await pool.start();

        console.log('Complete\n');
        process.exit(0);
    } catch (err) {
        console.log('Error while collecting: ', err);
        process.exit(1);
    }
})();
