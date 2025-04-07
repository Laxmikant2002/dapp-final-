const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
const SALT_ROUNDS = 10;

exports.registerUser = async (userData) => {
  try {
    // Hash password
    const hashedPassword = await bcrypt.hash(userData.password, SALT_ROUNDS);
    
    // Create user
    const user = await prisma.user.create({
      data: {
        ...userData,
        password: hashedPassword,
        role: userData.role || 'voter'
      }
    });

    // Generate tokens
    const tokens = generateTokens(user.id, user.role);
    
    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      },
      ...tokens
    };
  } catch (error) {
    throw new Error('Registration failed: ' + error.message);
  }
};

exports.loginUser = async (email, password) => {
  try {
    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new Error('Invalid password');
    }

    // Generate tokens
    const tokens = generateTokens(user.id, user.role);

    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      },
      ...tokens
    };
  } catch (error) {
    throw new Error('Login failed: ' + error.message);
  }
};

exports.refreshToken = async (refreshToken) => {
  try {
    const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    });

    if (!user) {
      throw new Error('User not found');
    }

    return generateTokens(user.id, user.role);
  } catch (error) {
    throw new Error('Invalid refresh token');
  }
};

exports.verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid token');
  }
};

function generateTokens(userId, role) {
  const accessToken = jwt.sign(
    { userId, role },
    JWT_SECRET,
    { expiresIn: '15m' }
  );

  const refreshToken = jwt.sign(
    { userId, role },
    JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  );

  return { accessToken, refreshToken };
} 