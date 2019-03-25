const root = require('app-root-path').path;
const express = require('express');
const instagram = require('../instagram-api');
const security = require('../security');

const router = express.Router();

router.get('/instagram/url', (req, res, next) => {
    res.json({
        url: instagram.getAuthorizationUrl(
            encodeURIComponent(process.env.instagram_redirect_url),
            {scope: ['basic']}
        ),
    });
});

router.get('/instagram', async (req, res, next) => {
    try {
        const token = await instagram.authorizeUser(
            req.query.code,
            process.env.instagram_redirect_url
        );

        /*
         "token":{"access_token":"11901158159.2c99cfc.89a611a39ef3417ea84be286d74cf02e","user":{"id":"11901158159","username":"apustyntcev","profile_picture":"https://scontent.cdninstagram.com/vp/55513d98d94df8e6191b641c16e060a1/5D29D63E/t51.2885-19/s150x150/53280753_317386922309936_7648041392039526400_n.jpg?_nc_ht=scontent.cdninstagram.com","full_name":"Алексей Пустынцев","bio":"","website":"","is_business":false}}
         */

        res.json({
            token: token,
            jwt: security.sign(token),
        });
    } catch (err) {
        res.json(err);
    }
});

module.exports = {
    router: router,
    basePath: '/login',
};
