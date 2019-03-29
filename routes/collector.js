const express = require('express');
const router = express.Router();

const lastCollectsLimit = 14;

/**
 * entry point
 */
router.get('/last', async (req, res, next) => {
    const userId = req.user.user.id;

    const collectorLogic = req.container.get('logic.collector');
    const data = await collectorLogic.getLastCollects(userId, lastCollectsLimit);

    res.json(data);
});

module.exports = {
    router: router,
    basePath: '/api/v1/collector',
};
