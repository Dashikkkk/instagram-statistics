const express = require('express');
const moment = require('moment');

const router = express.Router();

const defaultUrl = '/dashboard.html';

/**
 * returns client ip address
 *
 * @param req
 * @returns {*|string}
 */
function getClientIp(req) {
    return req.headers['x-forwarded-for'] || req.connection.remoteAddress;
}

/**
 * Common login procedure, store login data, set cookie and redirect
 *
 * @param req
 * @param res
 * @param data
 * @returns {Promise<void>}
 */
async function commonLogin(req, res, data) {
    const userLogic = req.container.get('logic.user');
    const security = req.container.get('app.auth.security');

    data.ip = getClientIp(req);
    data.user.id = await userLogic.updateLoginData(data);

    const expire = moment().unix() + 3600 * 48; // +two days
    res.cookie(
        'auth_token',
        security.sign(data),
        {expire: expire, httpOnly: false},
    );

    res.redirect(302, defaultUrl);
}

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
        };

        await commonLogin(req, res, data, token);
    } catch (err) {
        console.log('error: ', err);
        res.json(err);
    }
});

/**
 * auth by instagram account name, should be set in config
 */
router.get('/name', async (req, res) => {
    // allow only if enabled in config
    if (process.env.auth_by_name === 'false') {
        return res.status(401).send('Not authorized');
    }

    const name = req.query.name;
    const instagram = req.container.get('parser.native.common');
    try {
        const details = await instagram.get(name);

        const data = {
            token: '',
            user: details.user,
        };

        await commonLogin(req, res, data);
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

    req.user.ip = getClientIp(req);

    delete req.user.exp;
    delete req.user.iat;

    await userLogic.updateLoginData(req.user);

    res.json({jwt: security.sign(req.user)});
});

module.exports = {
    router: router,
    basePath: '/api/v1/auth',
};
