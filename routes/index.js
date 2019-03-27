const express = require('express');
const router = express.Router();

/**
 * entry point
 */
router.get('/', (req, res, next) => {
  res.redirect('/dashboard.html');
});

module.exports = {
  router: router,
  basePath: '/',
};
