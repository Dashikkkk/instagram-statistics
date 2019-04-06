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
        const currentTime = moment().unix();

        await this._db.insert('stat_account', {
            collector_id: collectorId,
            posts: data.posts,
            followers: data.followedBy,
            following: data.follow,
            created_at: currentTime,
            updated_at: currentTime,
        });
    }
}

module.exports.default = AccountDAO;