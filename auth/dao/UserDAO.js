const moment = require('moment');

class UserDAO {
    constructor(db) {
        this._db = db;
    }

    /**
     * Update or create user info record
     *
     * @param instagramId
     * @param values (name, fullName, ip, accessToken)
     * @returns {Promise<void>}
     */
    async saveUserInfo(instagramId, values) {
        const currentTime = moment().unix();
        const result = await this._db.single(
            'select id from user where instagram_id = ?',
            [instagramId]
        );

        if (result) {
            return await this._db.execute(
                'update user set name = ?, full_name = ?, ip = ?, access_token = ?, \
                    last_login = ?, updated_at = ? where id = ?',
                [values.userName, values.fullName, values.accessToken,
                    values.ip, currentTime, currentTime, result.id]
            )
        } else {
            return await this._db.execute(
                'insert into user(instagram_id, name, full_name, ip, access_token, \
                    last_login, created_at, updated_at) values \
                    (?, ?, ?, ?, ?, ?, ?, ?)',
                [instagramId, values.userName, values.fullName, values.ip,
                    values.accessToken, currentTime, currentTime, currentTime]
            );
        }
    }
}

module.exports.default = UserDAO;