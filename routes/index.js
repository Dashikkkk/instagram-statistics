const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
  res.send('Test');
});

router.get('/protected', (req, res, next) => {
  res.send('You shouldnt be here');
});

module.exports = {
  router: router,
  basePath: '/',
};
