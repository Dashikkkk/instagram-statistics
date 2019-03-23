const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

if (process.env.http_handle_static) {
    app.use(express.static(process.env.http_static_path));
}

const indexRoute = require('./routes/index');
app.use(indexRoute.basePath, indexRoute.router);

module.exports = app;

