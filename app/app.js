const root = require('app-root-path').path;
const express = require('express');
const logger = require('morgan');
const di = require(root + '/app/di');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(di.get('app.auth.security').getExpressMiddleware());
app.use((err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {
        res.status(401).send(err);
    } else {
        next(err);
    }
});
app.use((req, res, next) => {
    req.container = di;
    next();
});

if (process.env.http_handle_static) {
    app.use(express.static(process.env.http_static_path));
}

require('fs').readdirSync(root + '/routes').forEach((fileName) => {
    const route = require(root + "/routes/" + fileName);
    app.use(route.basePath, route.router);
});

module.exports = app;

