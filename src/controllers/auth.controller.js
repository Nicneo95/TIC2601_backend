const AuthService = require('../services/auth.service');

const register = async (req, res) => {
  try {
    const user = await AuthService.register(req.body);
    const token = require('jsonwebtoken').sign(
      { userId: user.user_id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.status(201).json({
      message: 'User registered',
      token,
      user: {
        id: user.user_id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const data = await AuthService.login(email, password);
    res.json(data);
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
};

const me = (req, res) => {
  res.json({ user: req.user });
};

const logout = async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (token) await AuthService.logout(token);
  res.json({ message: 'Logged out' });
};

module.exports = { register, login, me, logout };
