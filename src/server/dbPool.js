const Pool = require('pg').Pool
const pool = new Pool({
  host: 'localhost',
  database: 'fsportal',
  port: 5432,
  // user: 'csp',
  // password: 'NFhG9hhuNBQSA2dn',
  user: 'vitalmedvedev',
  password: 'medvedev'
});

module.exports = pool;