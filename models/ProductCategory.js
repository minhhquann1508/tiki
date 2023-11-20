const mongoose = require('mongoose');

const ProductCategorySchema = new mongoose.Schema({
    title: {
        type: String,
        unique: true,
        required: true,
        index: true
    }
}, { timestamps: true });

module.exports = mongoose.model('ProductCategory', ProductCategorySchema);