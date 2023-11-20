const mongoose = require('mongoose');

const AddressSchema = new mongoose.Schema({
    address: [{
        product: {
            type: mongoose.Types.ObjectId,
            ref: 'Product'
        },
        count: Number,
        color: String
    }],
    status: {
        type: String,
        default: 'Processing',
        enum: ['Cancelled', 'Processing', 'Completed']
    },
    paymentIntent: {

    },
    orderBy: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    }
});

module.exports = mongoose.model('Address', AddressSchema);