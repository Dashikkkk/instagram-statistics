const security = require('jsonwebtoken');
const expressJwt = require('express-jwt');

const jwtM = expressJwt({
    secret: process.env.jwt_secret,
}).unless({
    path: [
        '/', /^\/login\//, process.env.http_static_path, '/favicon.ico'
    ]
});

function sign(content) {
    return security.sign(
        content,
        process.env.jwt_secret,
        {expiresIn: 3600 * 24 * 3});
}

module.exports = {
    jwtM: jwtM,
    sign: sign,
};