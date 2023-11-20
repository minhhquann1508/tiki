const mongoose = require('mongoose');

const BrandSchema = new mongoose.Schema({
    title: {
        type: String,
        unique: true,
        index: true,
        required: true
    },
    logo: {
        type: String,
        default: ''
    }
}, { timestamps: true });

module.exports = mongoose.model('Brand', BrandSchema);