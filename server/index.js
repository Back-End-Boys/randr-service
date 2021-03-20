const express = require('express');
const app = express();
const pool = require('../database/index.js');

app.use(express.json());

app.get('/reviews', (req, res) => {
  console.log(req.query);
  res.send('Get reviews');
})

app.get('/reviews/meta', (req, res) => {
  console.log(req.query);
  res.send('Get reviews meta');
})

app.post('/reviews', (req, res) => {
  console.log(req.body);
  res.send('Post review');
})

app.put('/reviews/:review_id/helpful', (req, res) => {
  console.log(req.params);
  res.send('Update helpfulness');
})

app.put('/reviews/:review_id/report', (req, res) => {
  console.log(req.params);
  res.send('Report review');
})

app.listen(2525, () => {
  console.log('Listening at http://localhost:2525');
})