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
                '/',
                '/favicon.ico',
                /^\/api\/v1\/auth\/instagram/,
                process.env.http_static_path,
                process.env.http_static_path,
            ]
        });
    }

    getExpressMiddleware() {
        return this._jwtM;
    }

    sign(content) {
        return security.sign(
            content,
            this._jwtSecret,
            {expiresIn: expressJwt()}
        );
    }
}


module.exports.default = Security;