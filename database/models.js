const pool = require('../database/index.js');

const reviewsQuery = (product_id) => (
  pool.query(`SELECT r.id AS review_id, r.rating, r.summary, r.recommend, r.response, r.body, r.date, r.reviewer_name, r.helpfulness, p.id AS photo_id, p.url FROM reviews AS r FULL OUTER JOIN reviews_photos AS p ON r.id = p.review_id WHERE r.product_id = ${product_id}`)
)

const formatReviews = (results) => (
  results.reduce((acc, { review_id, rating, summary, recommend, response, body, date, reviewer_name, helpfulness, photo_id, url }) => {
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
  }, {})
)

const metaQuery = (product_id) => (
  pool.query(`SELECT r.id as review_id, r.rating, r.recommend, cr.characteristic_id, cr.value, c.name FROM reviews as r LEFT OUTER JOIN characteristic_reviews as cr ON r.id = cr.review_id RIGHT OUTER JOIN characteristics AS c ON cr.characteristic_id = c.id WHERE r.product_id = ${product_id}`)
)

const formatMeta = (results) => (
  results.reduce((acc, { review_id, rating, recommend, characteristic_id, value, name }) => {
    if (acc.reviews[review_id] === undefined) {
      acc.reviews[review_id] = 1;
      acc.ratings[rating] ? acc.ratings[rating]++ : acc.ratings[rating] = 1;
      acc.recommended[recommend] ? acc.recommended[recommend]++ : acc.recommended[recommend] = 1;
    }
    if (acc.characteristics[name] === undefined) {
      acc.characteristics[name] = {
        id: characteristic_id,
        values: [value],
        value: value
      }
    } else {
      acc.characteristics[name].values.push(value);
      acc.characteristics[name].value = acc.characteristics[name].values.reduce((a, b) => (a + b), 0) / acc.characteristics[name].values.length
    }
    return acc;
  }, {
    ratings: {},
    recommended: {},
    characteristics: {},
    reviews: {}
  })
)

module.exports = {
  reviewsQuery,
  formatReviews,
  metaQuery,
  formatMeta
}