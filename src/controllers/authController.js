const { createUser, getUserByEmail } = require('../models/userModel');
const { hashPassword, comparePassword, generateToken } = require('../utils/helpers');

const registerUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const userExists = await getUserByEmail(email);

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const userId = await createUser(email, hashedPassword);

    if (userId) {
      res.status(201).json({
        id: userId,
        email: email,
        token: generateToken(userId),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check for user email
    const user = await getUserByEmail(email);

    if (user && (await comparePassword(password, user.password_hash))) {
      res.json({
        id: user.id,
        email: user.email,
        token: generateToken(user.id),
      });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
};
