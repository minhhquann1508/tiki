const router = require('express').Router();
const { register, login, refreshAccessToken, logout, forgotPassword, resetPassword } = require('../controllers/authController');
const { verifyAccessToken } = require('../middleware/verifyToken');

router
    .route('/register')
    .post(register);

router
    .route('/login')
    .post(login);

router
    .route('/refreshToken')
    .post(refreshAccessToken);

router
    .route('/logout')
    .patch(logout);

router
    .route('/forgot-password')
    .get(forgotPassword);

router
    .route('/reset-password')
    .put(resetPassword);

module.exports = router;