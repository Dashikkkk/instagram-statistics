const moment = require('moment');

class PostDAO {
    constructor(db) {
        this._db = db;
    }

    /**
     * Save post stat info to db
     *
     * @param collectorId
     * @param data
     * @returns {Promise<void>}
     */
    async savePostInfo(collectorId, data) {
        await this._db.execute('insert into stat_post(collector_id, post_id, post_type, short_code, \
            comments, likes, video_views, post_created_at) values(?, ?, ?, ?, ?, ?, ?, ?)',
            [collectorId, data.postId, data.postType, data.shortCode, data.comments,
                data.likes, data.views, data.created]);
    }
}

module.exports.default = PostDAO;