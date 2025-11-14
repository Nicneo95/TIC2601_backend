'use strict';
const bcrypt = require('bcryptjs');
const { Users } = require('../models');
const { generateToken } = require('../utils/jwt');

// REGISTER USER
async function register(req, res) {
  try {
    const { name, email, password, address, phone, role } = req.body;

    // Basic validation
    if (!name || !email || !password || !phone) {
      return res.status(400).json({ message: 'Name, email, password, and phone are required' });
    }

    // Only allow 'customer' or 'host' for registration
    const allowedRoles = ['user', 'rider', 'owner'];
    const userRole = allowedRoles.includes(role) ? role : 'user';

    // Check if email already exists
    const existingUser = await Users.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    // Create new user (password is hashed automatically in model hooks)
    const newUser = await Users.create({ name, email, password, address, phone, role: userRole });

    // Generate token for new user
    // const token = generateToken(newUser);

    return res.status(201).json({
      message: 'User registered successfully',
      success: true
      // token,
      // user: {
      //   id: newUser.user_id,
      //   name: newUser.name,
      //   email: newUser.email,
      //   role: newUser.role
      // }
    });
  } catch (err) {
    console.error('Register Error:', err);
    return res.status(500).json({ message: 'Registration failed', success: false, error: err.message });
  }
}

// LOGIN USER
async function login(req, res) {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user by email
    const user = await Users.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Validate password using model method
    const valid = await user.validPassword(password);
    if (!valid) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    // Generate JWT token
    const token = generateToken(user);

    return res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.user_id,
        name: user.name,
        email: user.email,
        address: user.address,
        phone: user.phone,
        role: user.role
      }
    });
  } catch (err) {
    console.error('Login Error:', err);
    return res.status(500).json({ message: 'Login failed', error: err.message });
  }
}

// UPDATE USER PROFILE (email, password, phone, address)
async function updateProfile(req, res) {
  try {
    const userId = req.user.user_id; // Extract from JWT payload (set by auth middleware)
    const { email, password, phone, address } = req.body;

    // Find the logged-in user in DB
    const user = await Users.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Optional: Admins can update others if allowed
    if (req.user.role !== 'admin' && req.user.user_id !== user.user_id) {
      return res.status(403).json({ message: 'You can only update your own profile' });
    }

    // Update fields only if provided
    if (email) user.email = email;
    if (phone) user.phone = phone;
    if (address) user.address = address;

    if (password) {
      // Hash password before saving
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    // Save changes
    await user.save();

    return res.status(200).json({
      message: 'Profile updated successfully',
      user: {
        id: user.user_id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role
      }
    });
  } catch (err) {
    console.error('Update Profile Error:', err);
    return res.status(500).json({ message: 'Update failed', error: err.message });
  }
}

module.exports = { register, login, updateProfile };
