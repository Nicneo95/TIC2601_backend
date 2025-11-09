const express = require('express');
const router = express.Router();
const { register, login, me, logout } = require('../controllers/auth.controller');
const { validate } = require('../middlewares/validate');
const { authenticate } = require('../middlewares/jwtAuth');
const { registerSchema, loginSchema } = require('../forms/auth.form');

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.get('/me', authenticate, me);
router.post('/logout', authenticate, logout);

module.exports = router;
