const router = require('express').Router();
const { createCategory, getCategories, updateCategory, deleteCategory } = require('../controllers/productCategoryController');
const { verifyAccessToken, isAdmin } = require('../middleware/verifyToken');

router
    .route('/')
    .get(getCategories)
    .post(verifyAccessToken, isAdmin, createCategory);

router
    .route('/:id')
    .put(verifyAccessToken, isAdmin, updateCategory)
    .delete(verifyAccessToken, isAdmin, deleteCategory);

module.exports = router;