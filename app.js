const express = require('express');
const logger = require('morgan');
const security = require('./security');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use(security.jwtM);
app.use((err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {
        res.status(401).send(err);
    } else {
        next(err);
    }
});

if (process.env.http_handle_static) {
    app.use(express.static(process.env.http_static_path));
}

require('fs').readdirSync('./routes').forEach((fileName) => {
    const route = require("./routes/" + fileName);
    app.use(route.basePath, route.router);
});

module.exports = app;

