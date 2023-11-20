const router = require('express').Router();
const { createOrder, updateStatus, getUserOrder, getOrder } = require('../controllers/orderController');
const { verifyAccessToken, isAdmin } = require('../middleware/verifyToken');

router
    .route('/')
    .post(verifyAccessToken, createOrder);

router
    .route('/myOrder')
    .get(verifyAccessToken, getUserOrder);

router
    .route('/admin')
    .get(verifyAccessToken, isAdmin, getOrder);

router
    .route('/:id')
    .put(verifyAccessToken, isAdmin, updateStatus);

module.exports = router;