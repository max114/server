const Pool = require("pg").Pool;

const pool = new Pool({
  user: "mzelalem",
  password: "BearedMan114!",
  host: "localhost",
  port: 5432,
  database: "MPTdir",
});

module.exports = pool;
