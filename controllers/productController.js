const Product = require('../models/Product');
const asyncHandler = require('express-async-handler');
const slugify = require('slugify');

const createProduct = asyncHandler(async (req, res) => {
    if (Object.keys(req.body).length === 0)
        throw new Error('Missing input');
    if (req.body && req.body.title) req.body.slug = slugify(req.body.title);
    const product = await Product.create(req.body);
    res.status(201).json({
        success: product ? true : false,
        product: product ? product : 'Can not create product'
    })
});

const getProductById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!id) throw new Error('Please provide a product ID');
    const product = await Product.findById(id).select('-__v');
    res.status(200).json({
        success: product ? true : false,
        product: product ? product : 'Can not found product'
    })
});

const getAllProduct = asyncHandler(async (req, res) => {
    const queries = { ...req.query };
    const excludeFields = ['sort', 'page', 'limit', 'fields'];
    excludeFields.forEach((el) => delete queries[el]);

    let queryString = JSON.stringify(queries);
    queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, matchedEl => `$${matchedEl}`);
    const formatQueries = JSON.parse(queryString);


    //Filtering
    if (queries?.title) formatQueries.title = { $regex: queries.title, $options: 'i' };
    let queryCommand = Product.find(formatQueries);

    //Sorting 
    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ');
        queryCommand = queryCommand.sort(sortBy);
    }

    //Fields 
    if (req.query.fields) {
        const fields = req.query.fields.split(',').join(' ');
        queryCommand = queryCommand.select(fields);
    }

    //pagination
    const page = req.query.page || 1;
    const limit = req.query.limit || process.env.LIMIT_ITEM;
    const skip = (page - 1) * limit;

    //Execute query
    const products = await queryCommand
        .skip(skip)
        .limit(limit);
    const total = await Product.find(formatQueries).countDocuments();
    res.status(200).json({
        success: products ? true : false,
        products: products ? products : 'Cannot found any product',
        total,
        currentPage: page
    });


});

const updateProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!id) throw new Error('Please provide a product ID');
    if (req.body && req.body.title) req.body.slug = slugify(req.body.title)
    const product = await Product.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json({
        success: product ? true : false,
        product: product ? product : 'Cannot update product'
    })
});

const deleteProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!id) throw new Error('Please provide a product ID');
    const result = await Product.findByIdAndDelete(id);
    res.status(200).json({
        success: result ? true : false,
        product: result ? 'Product deleted' : 'Cannot delete product'
    })
});

const rating = asyncHandler(async (req, res) => {
    const { userId } = req.user;
    const { star, comments, productId } = req.body;
    if (!star || !productId) throw new Error('Please provide all values');
    const ratingProduct = await Product.findById(productId);
    const alreadyRating = ratingProduct?.ratings?.find(el => el.postedBy.toString() === userId);
    if (alreadyRating) {
        await Product.updateOne(
            {
                ratings: { $elemMatch: alreadyRating }
            },
            {
                $set: { "ratings.$.star": star, "ratings.$.comments": comments }
            },
            { new: true }
        )
    } else {
        const response = await Product.findByIdAndUpdate(productId,
            {
                $push: { ratings: { star, comments, postedBy: userId } }
            },
            { new: true }
        )
    };
    res.status(200).json({
        success: true
    })
});

module.exports = {
    createProduct,
    getProductById,
    getAllProduct,
    updateProduct,
    deleteProduct,
    rating
};