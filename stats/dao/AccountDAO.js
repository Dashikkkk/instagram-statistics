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
        await this._db.execute('insert into stat_account(collector_id, posts, followers, following) \
            values(?, ?, ?, ?)',
            [collectorId, data.posts, data.followedBy, data.follow]);
    }
}

module.exports.default = AccountDAO;