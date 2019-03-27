const express = require('express');

const router = express.Router();

/**
 * get url of auth over instagram
 */
router.get('/instagram/url', (req, res, next) => {
    const instagram = req.container.get('app.auth.instagram');
    res.json({
        url: instagram.getUrl(),
    });
});

/**
 * instagram auth callback
 */
router.get('/instagram', async (req, res, next) => {
    const instagram = req.container.get('app.auth.instagram');
    const security = req.container.get('app.auth.security');
    const userLogic = req.container.get('logic.user');

    try {
        const token = await instagram.authorize(req.query.code);

        /*
          example of returning data
         {"access_token":"11901158159.2c99cfc.89a611a39ef3417ea84be286d74cf02e","user":{"id":"11901158159","username":"apustyntcev","profile_picture":"https://scontent.cdninstagram.com/vp/55513d98d94df8e6191b641c16e060a1/5D29D63E/t51.2885-19/s150x150/53280753_317386922309936_7648041392039526400_n.jpg?_nc_ht=scontent.cdninstagram.com","full_name":"Алексей Пустынцев","bio":"","website":"","is_business":false}}
         */

        const data = {
            token: token.access_token,
            user: {
                instagramId: token.user.id,
                userName: token.user.username,
                fullName: token.user.full_name,
            },
            ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
        };

        await userLogic.updateLoginData(data);

        res.json({
            data: data,
            jwt: security.sign(data),
        });
    } catch (err) {
        console.log('error: ', err);
        res.json(err);
    }
});

/**
 * check that current jwt is working
 */
router.get('/check', (req, res, next) => {
    res.json({
        data: req.user,
    });
});

/**
 * get new jwt token
 */
router.get('/refresh', async (req, res, next) => {
    const security = req.container.get('app.auth.security');
    const userLogic = req.container.get('logic.user');

    req.user.ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    await userLogic.updateLoginData(req.user);

    res.json({jwt: security.sign(req.user)});
});

module.exports = {
    router: router,
    basePath: '/api/v1/auth',
};
