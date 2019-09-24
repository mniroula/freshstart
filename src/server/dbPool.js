const Pool = require('pg').Pool
const pool = new Pool({
  host: 'localhost',
  database: 'fsportal',
  port: 5432,
  user: 'csp',
  password: 'NFhG9hhuNBQSA2dn',
});
const fsPool = new Pool({
  host: 'localhost',
  database: 'cspbase',
  port: 5432,
  user: 'csp',
  password: 'NFhG9hhuNBQSA2dn',
});

module.exports = {
  pool,
  fsPool,
};