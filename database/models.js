const pool = require('../database/index.js');

const reviewsQuery = (product_id) => (
  pool.query(`SELECT r.id AS review_id, r.rating, r.summary, r.recommend, r.response, r.body, r.date, r.reviewer_name, r.helpfulness, p.id AS photo_id, p.url FROM reviews AS r FULL OUTER JOIN reviews_photos AS p ON r.id = p.review_id WHERE r.product_id = ${product_id}`)
)

const metaQuery = (product_id) => (
  pool.query(`SELECT r.id as review_id, r.rating, r.recommend, cr.characteristic_id, cr.value, c.name FROM reviews as r LEFT OUTER JOIN characteristic_reviews as cr ON r.id = cr.review_id RIGHT OUTER JOIN characteristics AS c ON cr.characteristic_id = c.id WHERE r.product_id = ${product_id}`)
)

module.exports = {
  reviewsQuery,
  metaQuery
}