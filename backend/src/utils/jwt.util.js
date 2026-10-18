const jwt = require('jsonwebtoken');
const JWT_SECRET=process.env.JWT_SECRET || 'default_secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '15m';
const REFRESH_SECRET = process.env.REFRESH_SECRET || 'default_refresh_secret';
const REFRESH_EXPIRES_IN = '7d';

const generateAccessToken = (payload) => {
    return jwt.sign(payload,JWT_SECRET, {expiresIn: JWT_EXPIRES_IN});
};

const generateRefreshToken = (payload) => {
    return jwt.sign(payload,REFRESH_SECRET,{expiresIn: REFRESH_EXPIRES_IN});
};

const verifyAccessToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};

const verifyRefreshToken = (token) => {
  return jwt.verify(token, REFRESH_SECRET);
};
module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken
};