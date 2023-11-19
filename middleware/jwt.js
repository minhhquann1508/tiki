const jwt = require('jsonwebtoken');

const generateAccessToken = (userId, role) => jwt.sign({ userId, role }, process.env.JWT_SECRET, { expiresIn: '1d' });

const generateRefreshToken = (userId) => jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });

module.exports = {
    generateAccessToken,
    generateRefreshToken
}
