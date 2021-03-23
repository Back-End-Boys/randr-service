const pool = require('../database/index.js');

/*---------------------------------------------

  GET REVIEWS

  ---------------------------------------------*/ 

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

/*---------------------------------------------

  GET META

  ---------------------------------------------*/ 

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

/*---------------------------------------------

  POST REVIEWS

  ---------------------------------------------*/ 

const reviewInsertCommand = ({ product_id, rating, summary, body, recommend, name, email }) => (
  `WITH new_review AS (
    INSERT INTO reviews (product_id, rating, summary, body, recommend, reviewer_name, reviewer_email)
    VALUES (${product_id}, ${rating}, '${summary}', '${body}', ${recommend}, '${name}', '${email}')
    RETURNING id
  ), `
)

const photosInsertCommand = (photos) => {
  let statements = [];
  for (var i = 0; i < photos.length; i++) {
    statements.push(`photo${i} AS (
      INSERT INTO reviews_photos (review_id, url)
      SELECT id, '${photos[i]}' FROM new_review
    )`)
  }
  if (statements.length === 0) {
    return '';
  } else if (statements.length === 1) {
    return statements[0] + ', ';
  } else {
    return statements.join(', ') + ', ';
  }
}

const characteristicsInsertCommand = (characteristics) => {
  let statements = [];
  let count = 0;
  for (var id in characteristics) {
    if (count === Object.keys(characteristics).length - 1) {
      return statements.join(', ') + ` INSERT INTO characteristic_reviews (review_id, characteristic_id, value) SELECT id, ${Number(id)}, ${characteristics[id]} FROM new_review;`
    } else {
      statements.push(`characteristic${id} AS (
        INSERT INTO characteristic_reviews (review_id, characteristic_id, value)
        SELECT id, ${Number(id)}, ${characteristics[id]} FROM new_review)`
      )
    }
    count++;
  }
}

const reviewsInsert = (review) => {
  var full = reviewInsertCommand(review) + photosInsertCommand(review.photos) + characteristicsInsertCommand(review.characteristics);
  return pool.query(full)
}

/*---------------------------------------------

  UPDATE HELPFULNESS

  ---------------------------------------------*/ 

const updateHelpful = (id) => (
  pool.query(`UPDATE reviews SET helpfulness = helpfulness + 1 WHERE id = ${id}`)
)

module.exports = {
  reviewsQuery,
  formatReviews,
  metaQuery,
  formatMeta,
  reviewsInsert,
  updateHelpful
}