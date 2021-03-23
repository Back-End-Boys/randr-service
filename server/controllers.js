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
    .catch(e => {console.error(e); response.send('Error retrieving data');})
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
    .catch(err => {console.error(err); response.send('Error retrieving data')})
}

const postReview = (request, response) => {
  models.reviewsInsert(request.body)
    // .then(data => {
    //   console.log(data);
    //   response.send('Inserted');
    // })
    // .catch(err => {console.err(err); response.send('Error posting review')})
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