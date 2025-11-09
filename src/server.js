require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('./config/session');
const { sequelize } = require('./models');

const app = express();

// Middleware
app.use(cookieParser());
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());
app.use(session);

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'EatWithLocals backend is alive!' });
});

// Routes will go here

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Server error' });
});

// Start
const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  console.log(`Server running on http://localhost:${PORT}`);
  await sequelize.authenticate();
  console.log('Database connected');
});
