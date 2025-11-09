const session = require('express-session');
const SQLiteStore = require('connect-sqlite3')(session);
require('dotenv').config();

module.exports = session({
  store: new SQLiteStore({ db: 'eatwithlocals.db' }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 1 day
  }
});
