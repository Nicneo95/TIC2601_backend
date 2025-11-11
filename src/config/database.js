// config/database.js
require('dotenv').config();

module.exports = {
  development: {
    dialect: 'sqlite',
    storage: process.env.DB_PATH || './database/dev.sqlite',
    logging: false
  },
  test: {
    dialect: 'sqlite',
    storage: process.env.TEST_DB_PATH || './database/test.sqlite',
    logging: false
  },
  production: {
    // Keep SQLite for now; you can switch to mysql/postgres later (see Step 5)
    dialect: process.env.DB_DIALECT || 'sqlite',
    storage: process.env.DB_PATH || './database/prod.sqlite',
    logging: false
  }
};
