const express = require('express');
const Phone = require('./models/phones');
const app = express();

app.use(express.json());

app.post('/api/v1/phones', (req, res, next) => {
    Phone
        .insert(req.body)
        .then(phone => res.send(phone))
        .catch(next);
});

module.exports = app;
