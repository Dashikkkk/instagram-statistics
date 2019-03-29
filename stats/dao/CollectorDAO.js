const moment = require('moment');

class CollectorDAO {
    constructor(db) {
        this._db = db;
    }

    /**
     * Store into db that the collector cycle has been started
     *
     * @param userId
     * @returns {Promise<int>}
     */
    async start(userId) {
        const currentTime = moment().unix();
        await this._db.execute('insert into collector(user_id, started_at, finished_at) \
                values(?, ?, ?)',
            [userId, currentTime, 0]);

        return await this._db.getLastInsertedId();
    }

    async success(collectorId) {
        const currentTime = moment().unix();
        await this._db.execute('update collector set finished_at = ?, success = 1',
            [currentTime]);
    }

    async fail(collectorId, err) {
        const currentTime = moment().unix();
        await this._db.execute('update collector set finished_at = ?, error_details = ?',
            [currentTime, err]);
    }
}

module.exports.default = CollectorDAO;