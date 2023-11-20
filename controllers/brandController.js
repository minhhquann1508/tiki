const Brand = require('../models/Brand');
const asyncHandler = require('express-async-handler');

const createBrand = asyncHandler(async (req, res) => {
    const { title } = req.body;
    if (!title) throw new Error('Please provide a title');
    const response = await Brand.create(req.body);
    res.status(201).json({
        success: response ? true : false,
        brand: response ? response : 'Cannot create a brand'
    });
});

const updateBrand = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (Object.keys(req.body).length === 0) throw new Error('Missing inputs');
    const response = await Brand.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json({
        success: response ? true : false,
        brand: response ? response : 'Cannot update a brand'
    });
});

const getBrands = asyncHandler(async (req, res) => {
    const response = await Brand.find({});
    res.status(200).json({
        success: response ? true : false,
        brands: response ? response : 'Cannot get brand'
    });
});

const getSingleBrand = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const brand = await Brand.findById(id);
    res.status(200).json({
        success: brand ? true : false,
        brand: brand ? brand : 'Cannot find brand'
    })
});

const deleteBrand = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const brand = await Brand.findByIdAndDelete(id);
    res.status(200).json({
        success: brand ? true : false,
        brand: brand ? brand : 'Cannot delete brand'
    })
});

const uploadBrandLogo = asyncHandler(async (req, res) => {
    const { id } = req.params;
});

module.exports = {
    createBrand,
    updateBrand,
    getBrands,
    getSingleBrand,
    deleteBrand,
    uploadBrandLogo
};