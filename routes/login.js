const express = require('express');

const router = express.Router();

router.get('/instagram', (req, res, next) => {
    res.send('instagram');
});

module.exports = {
    router: router,
    basePath: '/login',
};
