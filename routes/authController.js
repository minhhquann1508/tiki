const router = require('express').Router();
const { register } = require('../controllers/authController');

router
    .route('/register')
    .post(register);

module.exports = router;