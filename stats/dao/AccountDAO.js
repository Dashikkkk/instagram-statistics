const moment = require('moment');

class AccountDAO {
    constructor(db) {
        this._db = db;
    }

    /**
     * Save account stats to db
     *
     * @param collectorId
     * @param data
     * @returns {Promise<void>}
     */
    async saveAccountInfo(collectorId, data) {
        await this._db.insert('stat_account', {
            collector_id: collectorId,
            posts: data.posts,
            followers: data.followedBy,
            following: data.follow,
        });
    }

    /**
     * Return stats of the first record for given day
     * @param userId
     * @param date
     * @returns {Promise<{row}>}
     */
    async getDailyInfo(userId, date = undefined) {
        let startOfDay = 0;
        if (date === undefined) {
            //today is default
            startOfDay = moment().startOf('day');
        } else {
            startOfDay = moment.unix(date).startOf('day');
        }
        const endOfDay = moment.unix(startOfDay).endOf('day');

        return await this._db.single(
            'select posts, followers, following from stat_account sa \
                left join collector c on sa.collector_id = c.id \
                where (created_at between ? and ?) and c.user_id = ? \
                order by created_at limit 1',
            [startOfDay, endOfDay, userId]
        );
    }
}

module.exports.default = AccountDAO;