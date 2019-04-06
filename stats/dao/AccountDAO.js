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
}

module.exports.default = AccountDAO;