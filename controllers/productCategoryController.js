const ProductCategory = require('../models/ProductCategory');
const asyncHandler = require('express-async-handler');

const createCategory = asyncHandler(async (req, res) => {
    const response = await ProductCategory.create(req.body);
    res.status(201).json({
        success: response ? true : false,
        response: response ? response : 'Cannot create product category'
    })
});

const getCategories = asyncHandler(async (req, res) => {
    const response = await ProductCategory.find({}).select('title');
    res.status(200).json({
        success: response ? true : false,
        response: response ? response : 'Something went wrong'
    });
});

const updateCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const response = await ProductCategory.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json({
        success: response ? true : false,
        response: response ? response : 'Cannot update this category'
    });
});

const deleteCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const response = await ProductCategory.findOneAndDelete(id);
    res.status(200).json({
        success: response ? true : false,
        response: response ? response : 'Cannot delete this category'
    });
});

module.exports = {
    createCategory,
    getCategories,
    updateCategory,
    deleteCategory
}