const pool = require('../database/index.js');

const getReviews = (request, response) => {
  console.log(request.query);
  pool.query(`SELECT * FROM reviews WHERE product_id = ${request.query.product_id}`)
    .then(data => {console.log(data.rows); response.send('Get reviews');})
    .catch(e => {console.error(e); response.send('Uh oh');})
}

const getMeta = (request, response) => {
  console.log(request.query);
  response.send('Get reviews meta');
}

const postReview = (request, response) => {
  console.log(request.body);
  response.send('Post review');
}

const updateHelpfulness = (request, response) => {
  console.log(request.params);
  response.send('Update helpfulness');
}

const reportReview = (request, response) => {
  console.log(request.params);
  response.send('Report review');
}


module.exports.getReviews = getReviews;
module.exports.getMeta = getMeta;
module.exports.postReview = postReview;
module.exports.updateHelpfulness = updateHelpfulness;
module.exports.reportReview = reportReview;