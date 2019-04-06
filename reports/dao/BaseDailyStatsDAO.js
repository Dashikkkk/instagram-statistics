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

    async add(userId, data) {
        return await this._db.execute(
            'insert into base_stats_daily(user_id, date, posts, followers, following, likes,\
            comments) values(?, ?, ?, ?, ?) '
        );
    }
}