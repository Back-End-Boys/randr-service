const { Pool } = require('pg');

const pool = new Pool({
  user: 'jaspreetatwal',
  host: 'localhost',
  database: 'sdc_reviews',
  port: 5432
})

module.exports = pool;