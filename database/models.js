const pool = require('../database/index.js');

const reviewsQuery = (product_id) => (
  pool.query(`SELECT r.id AS review_id, r.rating, r.summary, r.recommend, r.response, r.body, r.date, r.reviewer_name, r.helpfulness, p.id AS photo_id, p.url FROM reviews AS r FULL OUTER JOIN reviews_photos AS p ON r.id = p.review_id WHERE r.product_id = ${product_id}`)
)

module.exports = {
  reviewsQuery
}