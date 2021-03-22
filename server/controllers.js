const pool = require('../database/index.js');
const models = require('../database/models.js');

const getReviews = (request, response) => {
  console.log(request.query);
  models.reviewsQuery(request.query.product_id)
    .then(data => {
      const formatReviews = data.rows.reduce((acc, { review_id, rating, summary, recommend, response, body, date, reviewer_name, helpfulness, photo_id, url }) => {
        acc[review_id] ? null :
          acc[review_id] = {
            review_id,
            rating,
            summary,
            body,
            recommend,
            reviewer_name,
            date,
            response,
            helpfulness,
            photos: []
          };
        photo_id ? acc[review_id].photos.push({ id: photo_id, url }) : null;
        return acc;
      }, {});

      const responseObject = {
        product: request.query.product_id,
        results: Object.values(formatReviews)
      }
      response.send(responseObject);
    })
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