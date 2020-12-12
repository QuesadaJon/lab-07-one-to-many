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

app.get('/api/v1/phones/:id', (req, res, next) => {
  Phone
    .findById(req.params.id)
    .then(phone => res.send(phone))
    .catch(next);
});

app.get('/api/v1/phones', (req, res, next) => {
  Phone 
    .find()
    .then(phone => res.send(phone))
    .catch(next);
});

app.put('/api/v1/phones/:id', (req, res, next) => {
  Phone
    .update(req.params.id, req.body)
    .then(phone => res.send(phone))
    .catch(next);
});

module.exports = app;
