const moment = require('moment');

class BaseDailyStatsDAO {
    constructor(db) {
        this._db = db;
    }

    _today() {
        return moment.utc().startOf('day').unix();
    }

    /**
     * Check for today
     *
     * @param userId
     * @returns {*}
     */
    checkTodayUTC(userId) {
        return this.check(userId, this._today());
    }

    /**
     * Checks that we already have stats for this day and user
     *
     * @param userId
     * @param date
     * @returns {Promise<any>}
     */
    async check(userId, date) {
        return await this._db.scalar(
            'select count(*) from base_stats_daily where user_id = ? and date = ?',
            [userId, date]
        );
    }

    /**
     * Store daily data
     *
     * @param userId
     * @param data (fields: userId, posts, followers, following, likes, comments)
     * @returns {Promise<void>}
     */
    async add(userId, data) {
        const currentTime = moment().unix();

        await this._db.insert('base_stats_daily', {
            ...data,
            date: this._today(),
            created_at: currentTime,
            updated_at: currentTime,
        });
    }
}

module.exports.default = BaseDailyStatsDAO;