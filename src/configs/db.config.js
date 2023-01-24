require("dotenv").config();
const { env } = process;
const { Pool } = require("pg");

const dbClient = new Pool({
  host: env.DB_HOST,
  user: env.DB_USER,
  port: env.DB_PORT,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
});

module.exports = dbClient;
