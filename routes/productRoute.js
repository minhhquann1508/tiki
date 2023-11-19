const router = require('express').Router();
const { verifyAccessToken, isAdmin } = require('../middleware/verifyToken');
const { createProduct, getProductById, getAllProduct, updateProduct, deleteProduct, rating } = require('../controllers/productController');

router
    .route('/')
    .get(getAllProduct)
    .post(verifyAccessToken, isAdmin, createProduct);

router
    .route('/rating')
    .put(verifyAccessToken, rating);

router
    .route('/:id')
    .get(getProductById)
    .put(verifyAccessToken, isAdmin, updateProduct)
    .delete(verifyAccessToken, isAdmin, deleteProduct);


module.exports = router;