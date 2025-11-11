'use strict';
// Enforces strict mode for cleaner, safer JavaScript.

const fs = require('fs');                 // File System module — lets us read model files dynamically.
const path = require('path');             // Path module — handles file and directory paths safely.
const Sequelize = require('sequelize');   // Sequelize ORM — used to connect to the database and define models.

const basename = path.basename(__filename); // Stores the current file name (usually "index.js") so we can ignore it later.
const db = {};                             // Will hold all loaded models and Sequelize instances.

// ---------------------------------------------------------------------------
// 1 Load database configuration dynamically based on the environment
// ---------------------------------------------------------------------------
const env = process.env.NODE_ENV || 'development'; // Determine the environment ("development", "test", or "production").
const config = require('../config/database')[env]; // Load the matching DB configuration from config/database.js.

// Create a new Sequelize instance using the configuration for this environment.
const sequelize = new Sequelize(config);

// ---------------------------------------------------------------------------
// 2 Test database connection (optional but very helpful)
// ---------------------------------------------------------------------------
// Immediately-invoked async function — runs on startup to check if the DB is reachable.
(async () => {
  try {
    await sequelize.authenticate();                     // Tries to connect using provided credentials/config.
    console.log(`Database connected successfully (${env})`); // Logs success message.
  } catch (err) {
    console.error('Database connection failed:', err.message); // Logs an error if the DB connection fails.
  }
})();

// ---------------------------------------------------------------------------
// 3 Dynamically import all model files in the current folder
// ---------------------------------------------------------------------------
// Reads every .js file inside the /models directory except this index.js file itself.
fs.readdirSync(__dirname)
  .filter((file) =>
    file !== basename &&          // Skip this file (index.js).
    file.endsWith('.js')          // Only include JavaScript model files.
  )
  .forEach((file) => {
    // Require (import) the model definition function from the file.
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);

    // Store the initialized model inside the db object using its name (e.g., Users, Orders).
    db[model.name] = model;
  });

// ---------------------------------------------------------------------------
// 4 Setup associations between models
// ---------------------------------------------------------------------------
// Once all models are loaded, call their associate() methods to link relationships (belongsTo, hasMany, etc.).
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// ---------------------------------------------------------------------------
// 5 Attach Sequelize instances to the db object
// ---------------------------------------------------------------------------
// Expose both the active database connection and Sequelize library itself for later use.
db.sequelize = sequelize;  // The live Sequelize instance (used to run queries and sync models).
db.Sequelize = Sequelize;  // The Sequelize class (useful for DataTypes and utilities).

// ---------------------------------------------------------------------------
// 6 Export the db object so the rest of the app can access all models and the connection
// ---------------------------------------------------------------------------
module.exports = db;
