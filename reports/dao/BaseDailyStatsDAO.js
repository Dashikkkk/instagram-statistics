const moment = require('moment');

class BaseDailyStatsDAO {
    constructor(db) {
        this._db = db;
    }

    _yesterday() {
        return moment.utc().subtract(1, 'days').startOf('day').format();
    }

    /**
     * Check for today
     *
     * @param userId
     * @returns {*}
     */
    checkTodayUTC(userId) {
        return this.check(userId, this._yesterday());
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
        const currentTime = moment().format();

        await this._db.insert('base_stats_daily', {
            ...data,
            date: this._yesterday(),
        });
    }
}

module.exports.default = BaseDailyStatsDAO;