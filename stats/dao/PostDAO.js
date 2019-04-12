const moment = require('moment');
const _ = require('lodash');

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
        const currentTime = moment().format();

        await this._db.insert('stat_post', {
            collector_id: collectorId,
            post_id: data.postId,
            post_type: data.postType,
            short_code: data.shortCode,
            comments: data.comments,
            likes: data.likes,
            video_views: data.views,
            post_created_at: data.createdAt,
        });
    }

    _lastPosts(dailyPosts) {
        return _.reduce(dailyPosts, (result, post) => {
            if (!(post.post_id in result)) {
                result[post.post_id] = post;
            } else if(result[post.post_id].collector_id > post.collector_id) {
                result[post.post_id] = post;
            }

            return result;
        }, {});
    }

    _calculateTotal(current, prev) {
        let total = {
            comments: 0,
            likes: 0,
        };
        _.forEach(current, (post) => {
            total.comments += post.comments;
            total.likes += post.likes;

            if (post.collector_id in prev) {
                total.comments -= prev.comments;
                total.likes -= prev.likes;
            }
        });

        return total;
    }

    async getDailyInfo(userId, date = undefined) {
        let startOfDay = 0;
        if (date === undefined) {
            //today is default
            startOfDay = moment().startOf('day').unix();
        } else {
            startOfDay = moment.unix(date).startOf('day').unix();
        }
        const endOfDay = moment.unix(startOfDay).endOf('day').unix();

        const currentPosts = await this._db.query(
            'select collector_id, post_id, comments, likes from stat_post sp \
                left join collector c on sp.collector_id = c.id \
                where (created_at between ? and ?) and c.user_id = ? \
                order by collector_id',
            [startOfDay, endOfDay, userId]
        );

        const startOfPrevDay = moment.unix(startOfDay)
            .subtract(1, 'day').startOf('day');
        const endOfPrevDay = moment.unix(endOfDay)
            .subtract(1, 'day').endOf('day');

        const prevPosts = await this._db.query(
            'select collector_id, post_id, comments, likes from stat_post sp \
                left join collector c on sp.collector_id = c.id \
                where (created_at between ? and ?) and c.user_id = ? \
                order by collector_id',
            [startOfPrevDay, endOfPrevDay, userId]
        );

        const currentPostsFiltered = this._lastPosts(currentPosts);
        const prevPostsFiltered = this._lastPosts(prevPosts);
    }
}

module.exports.default = PostDAO;