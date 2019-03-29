const {Worker} = require('worker_threads');
const _ = require('lodash');
const __ = require('aigle');

class Threading {
    constructor() {
    };

    _runSingleWorker(workerFileName, dataForWorker) {
        return new Promise((resolve, reject) => {
            const workerHandler = new Worker(workerFileName, dataForWorker);
            workerHandler.on('message', resolve);
            workerHandler.on('error', reject);
            workerHandler.on('exit', (code) => {
                code !== 0 && reject(new Error(`Worker stopped with exit code ${code}`));
            });
        });
    }

    /*
    It ends with

 Error: Module did not self-register.
 at Object.Module._extensions..node (internal/modules/cjs/loader.js:730:18)
 at Module.load (internal/modules/cjs/loader.js:600:32)
 at tryModuleLoad (internal/modules/cjs/loader.js:539:12)

    and I cant find a way to pass through it
    so, i will not use it, and leave it here for purposes xD
     */
    async run(workerFileName, data) {
        const workerPromises = _.map(data, (item) => this._runSingleWorker(workerFileName, item));
        const result = [];

        //do not fail all if one of the workers failed
        await __.forEach(workerPromises, async (item) => {
            try {
                result.push(await item);
            } catch (err) {
                result.push(err);
            }
        });

        console.log(workerPromises);

        return result;
    }
}

module.exports.default = Threading;