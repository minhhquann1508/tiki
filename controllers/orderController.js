const Order = require('../models/Order');
const User = require('../models/User');
const Coupon = require('../models/Coupon');
const asyncHandler = require('express-async-handler');

const createOrder = asyncHandler(async (req, res) => {
    const { userId } = req.user;
    const { coupon } = req.body;
    const userCart = await User.findById(userId).select('cart').populate('cart.product', 'title price');
    const products = userCart?.cart.map(el => ({
        product: el.product._id,
        count: el.quantity,
        color: el.color
    }));
    let total = userCart?.cart.reduce((sum, el) => sum + el.product.price * el.quantity, 0);
    if (coupon) {
        const selectedCoupon = await Coupon.findById(coupon);
        total = total - total * selectedCoupon?.discount / 100 || total;
    }
    const result = await Order.create({
        products,
        total,
        coupon,
        orderBy: userId
    });
    res.status(200).json({
        success: result ? true : false,
        order: result ? result : 'Something went wrong'
    });
});

const updateStatus = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    if (!status) throw new Error('Missing status value');
    const result = await Order.findByIdAndUpdate(id, { status }, { new: true });
    res.status(200).json({
        success: result ? true : false,
        order: result ? result : 'Something went wrong'
    });
});

const getUserOrder = asyncHandler(async (req, res) => {
    const { userId } = req.user;
    const order = await Order.find({ orderBy: userId });
    res.status(200).json({
        success: order ? true : false,
        order: order ? order : 'Cannot found any order'
    });
});

const getOrder = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const order = await Order.find({});
    res.status(200).json({
        success: order ? true : false,
        order: order ? order : 'Cannot found any order'
    });
});

module.exports = {
    createOrder,
    updateStatus,
    getUserOrder,
    getOrder
};