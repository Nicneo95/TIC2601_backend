require('dotenv').config();

module.exports = {
  development: {
    dialect: 'sqlite',
    storage: process.env.DB_PATH,
    logging: false
  }
};
