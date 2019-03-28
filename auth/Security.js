const security = require('jsonwebtoken');
const expressJwt = require('express-jwt');

const expiresIn = 3600 * 24 * 3;

class Security {
    constructor() {
        this._jwtSecret = process.env.jwt_secret;
        this._jwtM = expressJwt({
            secret: this._jwtSecret,
        }).unless({
            /* not secure paths */
            path: [
                /^\/api\/v1\/auth\/instagram/,
                /^\/api\/v1\/auth\/name/,
                /^((?!\/api).)*$/
            ]
        });
    }

    /**
     * returns express middleware for jwt
     *
     * @returns {*}
     */
    getExpressMiddleware() {
        return this._jwtM;
    }

    /**
     * sign data and encode them to jwt
     *
     * @param content
     * @returns string
     */
    sign(content) {
        return security.sign(
            content,
            this._jwtSecret,
            {expiresIn: expiresIn}
        );
    }
}


module.exports.default = Security;