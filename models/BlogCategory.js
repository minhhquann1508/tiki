const mongoose = require('mongoose');

const BlogCategorySchema = new mongoose.Schema({
    title: {
        type: String,
        unique: true,
        required: true,
        index: true
    }
}, { timestamps: true });

module.exports = mongoose.model('BlogCategory', BlogCategorySchema);