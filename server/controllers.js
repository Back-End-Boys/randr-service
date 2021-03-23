const pool = require('../database/index.js');
const models = require('../database/models.js');

const getReviews = (request, response) => {
  models.reviewsQuery(request.query.product_id)
    .then(data => {
      const formattedReviews = models.formatReviews(data.rows);

      const responseReviews = {
        product: request.query.product_id,
        results: Object.values(formattedReviews)
      }

      response.send(responseReviews);
    })
    .catch(err => {
      console.error(err);
      response.send('Error retrieving data');
    })
}

const getMeta = (request, response) => {
  models.metaQuery(request.query.product_id)
    .then(data => {
      const formattedMeta = models.formatMeta(data.rows);

      const responseMeta = {
        product_id: request.query.product_id,
        ratings: formattedMeta.ratings,
        recommended: formattedMeta.recommended,
        characteristics: formattedMeta.characteristics
      }

      response.send(responseMeta);
    })
    .catch(err => {
      console.error(err);
      response.send('Error retrieving data')
    })
}

const postReview = (request, response) => {
  models.reviewsInsert(request.body)
    .then(data => {
      response.send('Inserted');
    })
    .catch(err => {
      console.error(err);
      response.send('Error posting review')
    })
}

const putHelpfulness = (request, response) => {
  models.updateHelpful(request.params.review_id)
    .then(data => {
      response.send('Updated');
    })
    .catch(err => {
      console.error(err);
      response.send('Error updating helpfulness');
    })
}

const putReview = (request, response) => {
  console.log(request.params);
  response.send('Report review');
}


module.exports.getReviews = getReviews;
module.exports.getMeta = getMeta;
module.exports.postReview = postReview;
module.exports.putHelpfulness = putHelpfulness;
module.exports.putReview = putReview;