/*
It ends with

Error: Module did not self-register.
at Object.Module._extensions..node (internal/modules/cjs/loader.js:730:18)
at Module.load (internal/modules/cjs/loader.js:600:32)
at tryModuleLoad (internal/modules/cjs/loader.js:539:12)

and I cant find a way to pass through it
so, i will not use it, and leave it here for purposes xD
 */

require('dotenv').config();
const { workerData, parentPort } = require('worker_threads');
const root = require('app-root-path').path;
const di = require(root + '/app/di');

const moment = require('moment');

const collector = di.get('logic.collector');

(async () => {
    await collector.collect(workerData.id, workerData.name);
    parentPort.postMessage(
        `${moment().utc().valueOf()}: ${workerData.name}(${workerData.id})`
    );
})();
