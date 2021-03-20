const express = require('express');
const app = express();
const pool = require('../database/index.js');
const controller = require('./controllers.js');

app.use(express.json());

app.get('/reviews', controller.getReviews);

app.get('/reviews/meta', controller.getMeta)

app.post('/reviews', controller.postReview)

app.put('/reviews/:review_id/helpful', controller.updateHelpfulness)

app.put('/reviews/:review_id/report', controller.reportReview)

app.listen(2525, () => {
  console.log('Listening at http://localhost:2525');
})