const moment = require('moment');

class BaseWeeklyStatsDAO {
    constructor(db) {
        this._db = db;
    }

    _today() {
        return moment.utc().startOf('week').unix();
    }

    /**
     * Check for this week
     *
     * @param userId
     * @returns {*}
     */
    checkTodayUTC(userId) {
        return this.check(userId, this._today());
    }

    /**
     * Checks that we already have stats for this week and user
     *
     * @param userId
     * @param date
     * @returns {Promise<any>}
     */
    async check(userId, date) {
        return await this._db.scalar(
            'select count(*) from base_stats_weekly where user_id = ? and date = ?',
            [userId, date]
        );
    }

    /**
     * Store weekly data
     *
     * @param userId
     * @param data (fields: userId, posts, followers, following, likes, comments)
     * @returns {Promise<void>}
     */
    async add(userId, data) {
        await this._db.insert('base_stats_weekly', {
            ...data,
            date: this._today(),
        });
    }
}

module.exports.default = BaseWeeklyStatsDAO;