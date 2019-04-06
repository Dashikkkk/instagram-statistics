const moment = require('moment');
const _ = require('lodash');

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
        await this._db.insert('collector', {
            user_id: userId,
            started_at: currentTime,
            finished_at: 0,
        });

        return await this._db.scalar('select id from collector where user_id = ? and \
                started_at = ? and finished_at = ? order by id desc',
            [userId, currentTime, 0]);
    }

    async success(collectorId) {
        const currentTime = moment().unix();
        await this._db.execute('update collector set finished_at = ?, success = 1\
            where id = ?',
            [currentTime, collectorId]);
    }

    async fail(collectorId, err) {
        const currentTime = moment().unix();
        await this._db.execute('update collector set finished_at = ?, error_details = ?\
            where id = ?',
            [currentTime, err, collectorId]);
    }

    /**
     * Get last amount of collects for given user
     *
     * @param userId
     * @param amount
     * @returns {Promise<Array>}
     */
    async getLastCollects(userId, amount) {
        const result = await this._db.query('select id, started_at, finished_at, success, \
            error_details from collector where user_id = ? order by started_at desc limit ?',
            [userId, amount]);

        return _.map(result, (row) => {
            return {
                id: row.id,
                started: row.started_at,
                finished: row.finished_at,
                success: row.success > 0,
                errorDetails: row.error_details,
            };
        });
    }
}

module.exports.default = CollectorDAO;