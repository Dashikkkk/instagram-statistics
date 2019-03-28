const express = require('express');
const router = express.Router();

const defaultUrl = '/dashboard.html';

/**
 * entry point
 */
router.get('/', (req, res, next) => {
  res.redirect(defaultUrl);
});

module.exports = {
  router: router,
  basePath: '/',
};
