const router = require('express').Router();
const { verifyAccessToken, isAdmin } = require('../middleware/verifyToken');
const { createCoupon, getCoupons, updateCoupon, deleteCoupon } = require('../controllers/couponController');

router
    .route('/')
    .get(verifyAccessToken, isAdmin, getCoupons)
    .post(verifyAccessToken, isAdmin, createCoupon);

router
    .route('/:id')
    .put(verifyAccessToken, isAdmin, updateCoupon)
    .delete(verifyAccessToken, isAdmin, deleteCoupon);

module.exports = router;