'use strict';  
// Enables strict mode in JavaScript — helps catch common coding mistakes.

const { Model } = require('sequelize');  
// Imports the Model class from Sequelize to define models.

const bcrypt = require('bcryptjs');  
// Imports bcrypt.js for hashing and comparing passwords securely.

module.exports = (sequelize, DataTypes) => {  
  // Exports a function that defines the Users model. Sequelize automatically passes
  // the `sequelize` instance and available `DataTypes` to this function.

  class Users extends Model {
    // Declares a class `Users` extending Sequelize’s Model class.
    // This allows you to define custom methods and associations.

    static associate(models) {
      // Defines associations (relationships) with other models.

      Users.hasMany(models.Restaurants, { foreignKey: 'user_id', onDelete: 'CASCADE' });
      // One User can own many Restaurants.
      // If the user is deleted, their restaurants are also deleted.

      Users.hasMany(models.Orders, { foreignKey: 'user_id', onDelete: 'CASCADE' });
      // One User can have many Orders.
      // Cascade delete ensures orders are removed when the user is deleted.

      Users.hasMany(models.Reviews, { foreignKey: 'user_id', onDelete: 'CASCADE' });
      // One User can write many Reviews.
      // Again, cascade delete removes all reviews if the user is deleted.
    }

    async validPassword(pwd) {
      // Defines an instance method to validate a given password.

      return await bcrypt.compare(pwd, this.password);
      // Compares the provided plain-text password with the stored hashed password.
      // Returns `true` if they match, `false` otherwise.
    }
  }

  // Initializes the model with its schema (columns and properties).
  Users.init({
    user_id: {
      type: DataTypes.INTEGER,          // Integer type for user_id.
      primaryKey: true,                 // Sets as the primary key.
      autoIncrement: true               // Automatically increments for each new user.
    },
    name: {
      type: DataTypes.STRING(100),      // String type with a max length of 100.
      allowNull: false                  // Field cannot be null (required).
    },
    email: {
      type: DataTypes.STRING(255),      // String type up to 255 characters.
      allowNull: false,                 // Required field.
      unique: true,                     // Ensures each email is unique.
      // validate: { isEmail: true }       // Adds built-in email format validation.
    },
    password: {
      type: DataTypes.STRING(255),      // Stores the hashed password.
      allowNull: false                  // Password is required.
    },
    address: DataTypes.STRING(255),     // Optional address field.
    phone: {
      type: DataTypes.STRING(11),       // String (usually for phone numbers up to 11 digits).
      allowNull: false                  // Required field.
    },
    role: {
      // type: DataTypes.ENUM('customer', 'host', 'admin'),
      type: DataTypes.ENUM('user', 'rider', 'owner'),
      // Defines a fixed list of allowed roles.

      // defaultValue: 'customer'
      defaultValue: 'user'
      // Sets default role for new users to 'customer'.
    }
  }, {
    sequelize,                          // Passes the Sequelize instance.
    modelName: 'Users',                 // Model name (used internally by Sequelize).
    tableName: 'Users',                 // Explicitly sets table name in the database.
    underscored: true,                  
    // Converts field names like `createdAt` → `created_at`, `updatedAt` → `updated_at`.

    hooks: {
      // Hooks are lifecycle callbacks run automatically at specific points.

      beforeCreate: async (u) => {
        // Runs before a new user is created in the database.

        u.password = await bcrypt.hash(u.password, 10);
        // Hashes the user's plain password with a salt factor of 10 before saving.
      },

      beforeUpdate: async (u) => {
        // Runs before a user record is updated.

        if (u.changed('password'))
          // Checks if the password field was modified.

          u.password = await bcrypt.hash(u.password, 10);
          // If yes, hashes the new password before saving it.
      }
    }
  });

  return Users;  
  // Returns the fully defined Users model to be registered with Sequelize.
};
