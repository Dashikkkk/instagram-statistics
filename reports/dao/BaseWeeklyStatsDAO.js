const moment = require('moment');

class BaseWeeklyStatsDAO {
    constructor(db) {
        this._db = db;
    }

    _lastWeek() {
        return moment.utc().subtract(1, 'week').startOf('week');
    }

    /**
     * Check for this week
     *
     * @param userId
     * @returns {*}
     */
    checkTodayUTC(userId) {
        return this.check(userId, this._lastWeek());
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
        const currentTime = moment();

        await this._db.insert('base_stats_weekly', {
            ...data,
            date: this._lastWeek(),
            created_at: currentTime,
            updated_at: currentTime,
        });
    }
}

module.exports.default = BaseWeeklyStatsDAO;