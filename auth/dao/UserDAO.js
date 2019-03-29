const moment = require('moment');
const _ = require('lodash');

const ActiveUserThreshold = 3600 * 24 * 2; // logged in within 2 days

class UserDAO {
    constructor(db) {
        this._db = db;
    }

    /**
     * Update or create user info record
     *
     * @param instagramId
     * @param values (name, fullName, ip, accessToken)
     * @returns {Promise<int>}
     */
    async saveUserInfo(instagramId, values) {
        const currentTime = moment().unix();
        const result = await this._db.single(
            'select id from user where instagram_id = ?',
            [instagramId]
        );

        if (result) {
            await this._db.execute(
                'update user set name = ?, full_name = ?, ip = ?, access_token = ?, \
                    last_login = ?, updated_at = ? where id = ?',
                [values.userName, values.fullName, values.accessToken,
                    values.ip, currentTime, currentTime, result.id]
            );

            return result.id;
        } else {
            await this._db.execute(
                'insert into user(instagram_id, name, full_name, ip, access_token, \
                    last_login, created_at, updated_at) values \
                    (?, ?, ?, ?, ?, ?, ?, ?)',
                [instagramId, values.userName, values.fullName, values.ip,
                    values.accessToken, currentTime, currentTime, currentTime]
            );

            return await this._db.getLastInsertedId();
        }
    }

    /**
     * Returns active users ids and names
     *
     * @returns {Promise<Array>}
     */
    async getActiveUsers() {
        const result = await this._db.query('select id, name from user where last_login > ?',
            [moment().unix() - ActiveUserThreshold]);
        return _.map(result, (row) => {
            return {
                id: row.id,
                name: row.name,
            }
        });
    }
}

module.exports.default = UserDAO;