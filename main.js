require('dotenv').config();

const express = require('express');
const app = express();

app.get('/', (req, res) => res.send('Test'));

app.listen(process.env.port, () => console.log(`Running on ${process.env.port}`));
