const mongoose = require('mongoose');

const CouponSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true,
        uppercase: true
    },
    discount: {
        type: Number,
        required: true
    },
    expiry: {
        type: Date,
        required: true,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Coupon', CouponSchema);