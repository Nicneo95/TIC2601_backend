const { Users, BlacklistedTokens } = require('../models');
const jwt = require('jsonwebtoken');

class AuthService {
  static async register(data) {
    return await Users.create(data); // password hashed in model hook
  }

  static async login(email, password) {
    const user = await Users.findOne({ where: { email } });
    if (!user || !(await user.validPassword(password))) {
      throw new Error('Invalid email or password');
    }

    const token = jwt.sign(
      { userId: user.user_id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return {
      token,
      user: {
        id: user.user_id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    };
  }

  static async logout(token) {
    const decoded = jwt.decode(token);
    if (decoded?.exp) {
      await BlacklistedTokens.create({
        token,
        expires_at: new Date(decoded.exp * 1000)
      });
    }
  }
}

module.exports = AuthService;
