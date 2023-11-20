const Coupon = require('../models/Coupon');
const asyncHandler = require('express-async-handler');

const createCoupon = asyncHandler(async (req, res) => {
    const { name, discount, expiry } = req.body;
    if (!name || !discount || !expiry)
        throw new Error('Missing inputs')
    const coupon = await Coupon.create({
        ...req.body,
        expiry: Date.now() + expiry * 24 * 60 * 60 * 1000,
    });
    res.status(201).json({
        success: coupon ? true : false,
        coupon: coupon ? coupon : ' Cannot create coupon'
    })
});

const getCoupons = asyncHandler(async (req, res) => {
    const coupons = await Coupon.find({});
    res.status(200).json({
        success: coupons ? true : false,
        coupons: coupons ? coupons : ' Cannot find any coupon'
    })
});

const updateCoupon = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (Object.keys(req.body).length === 0)
        throw new Error('Missing inputs');
    if (req.body.expiry) req.body.expiry = Date.now() + req.body.expiry * 24 * 60 * 60 * 1000;
    const coupon = await Coupon.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json({
        success: coupon ? true : false,
        coupon: coupon ? coupon : ' Cannot update coupon'
    });
});

const deleteCoupon = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const coupon = await Coupon.findByIdAndDelete(id);
    res.status(200).json({
        success: coupon ? true : false,
        coupon: coupon ? coupon : ' Cannot delete coupon'
    })
});

module.exports = {
    createCoupon,
    getCoupons,
    updateCoupon,
    deleteCoupon
};