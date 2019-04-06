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
        const currentTime = moment().unix();

        await this._db.insert('stat_post', {
            collector_id: collectorId,
            post_id: data.postId,
            post_type: data.postType,
            short_code: data.shortCode,
            comments: data.comments,
            likes: data.likes,
            video_views: data.views,
            post_created_at: data.created,
            created_at: currentTime,
            updated_at: currentTime,
        });
    }
}

module.exports.default = PostDAO;