const db = require('mysql');
const _ = require('lodash');

class Db {
    constructor() {
        this._db = new db.createPool({
            connectionLimit: process.env.db_connections_limit,
            charset: 'utf8mb4',
            host: process.env.db_host,
            port: process.env.db_port,
            user: process.env.db_user,
            password: process.env.db_pass,
            database: process.env.db_base,
        });
        this._db.config.connectionLimit = process.env.db_connections_limit;
        this._db.config.charset = 'utf8mb4';
    }

    /**
     * Close current connection
     * @returns {Promise<void>}
     */
    async close() {
        return await this._db.destroy();
    }


    /**
     * Get direct handler to database library
     * @returns {Pool}
     */
    getHandler() {
        return this._db;
    }

    /**
     * Execute query, and get ALL rows
     *
     * @param sql
     * @param params
     * @returns {Promise<{row}>}
     */
    query(sql, params) {
        return new Promise((resolve, reject) => {
            this._db.query(sql, params, (err, rows, fields) => {
                if (err) {
                    return reject(err);
                }
                return resolve(rows);
            });
        });
    }

    /**
     * Execute query and get FIRST row only
     *
     * @param sql
     * @param params
     * @returns {Promise<{row}>}
     */
    single(sql, params) {
        return new Promise((resolve, reject) => {
            this._db.query(sql, params, (err, rows) => {
                if (err) {
                    return reject(err);
                }
                return resolve(rows.length > 0 ? rows[0] : null);
            });
        });
    }

    /**
     * Execute query and get first element of the first row
     *
     * @param sql
     * @param params
     * @returns {Promise<any>}
     */
    async scalar(sql, params) {
        const result = await this.single(sql, params);
        return result[Object.keys(result)[0]];
    }

    /**
     * Execute command, return nothing
     *
     * @param sql
     * @param params
     * @returns {Promise<int>} //if insert - returns last inserted id
     */
    execute(sql, params) {
        return new Promise((resolve, reject) => {
            this._db.query(sql, params, (err, results) => {
                if (err) {
                    return reject(err);
                }
                let lastInsertedId = 0;
                if (results.hasOwnProperty('insertId')) {
                    lastInsertedId = results.insertId;
                }
                return resolve(lastInsertedId);
            });
        });
    }

    /**
     * Convert camelCase to snake_case
     *
     * WARNING: camelCASE will be converted to snake_c_a_s_e
     *
     * @param text
     * @returns {string|Db}
     * @private
     */
    _toSnakeCase(text) {
        const upperChars = text.match(/([A-Z])/g);
        if (! upperChars) {
            return text;
        }

        let str = text.toString();
        for (let i = 0, n = upperChars.length; i < n; i++) {
            str = str.replace(
                new RegExp(upperChars[i]),
                '_' + upperChars[i].toLowerCase()
            );
        }

        if (str.slice(0, 1) === '_') {
            str = str.slice(1);
        }

        return str;
    };

    /**
     * Simplified insert
     *
     * @param table
     * @param data, format {db_field_name: field_value, db_field_name_1: field_value_1, ...}
     * @returns {Promise<int>} //returns last inserted id
     */
    async insert(table, data) {
        const keys = _.map(Object.keys(data), (key) => this._toSnakeCase(key));
        const values = Object.values(data);
        const questionsForQuery = Object.values(data).fill('?');

        let sql = `insert into ${table}(${keys.join(',')}) values(${questionsForQuery.join(',')})`;

        return await this.execute(sql, values);
    }
}

module.exports.default = Db;