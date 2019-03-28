const request = require('request');

/**
 * Do http requests
 */
class Requester {
    constructor() {
        this._request = request.defaults({
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
                    '(KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36'
            }
        });
    }

    /**
     * Do http get request
     *
     * @param url
     * @returns {Promise<any>}
     */
    async get(url) {
        return new Promise((resolve, reject) => {
            this._request(url, (err, response, body) => {
                if (!err && response.statusCode === 200) {
                    resolve(body);
                } else if (!err && response.statusCode !== 200) {
                    reject('http error code: ' + response.statusCode.toString());
                } else {
                    reject(err);
                }
            });
        });
    }
}

module.exports.default = Requester;