'use strict';
require('dotenv').config(); // Load .env variables
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const SQLiteStore = require('connect-sqlite3')(session);
const cookieParser = require('cookie-parser');
const path = require('path');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Setup sessions (for web clients)
app.use(session({
  store: new SQLiteStore(),
  secret: process.env.SESSION_SECRET || 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    maxAge: 3600000 // 1 hour
  }
}));

// Routes
const authRoutes = require('./routes/auth.routes');
app.use('/api/auth', authRoutes);

const restaurantRoutes = require('./routes/restaurant.routes');
app.use('/api/restaurants', restaurantRoutes);

const menuItemRoutes = require('./routes/menuItem.routes');
app.use('/api/menuitems', menuItemRoutes);

const orderRoutes = require('./routes/order.routes');
app.use('/api/orders', orderRoutes);

const reviewRoutes = require('./routes/review.routes');
app.use('/api/reviews', reviewRoutes);

// serve uploaded files: http://localhost:3000/uploads/<filename>
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));


// Health check
app.get('/health', (req, res) => res.json({ ok: true }));

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
