const router = require('express').Router();
const { verifyAccessToken, isAdmin } = require('../middleware/verifyToken');
const { createProduct, getProductById, getAllProduct, updateProduct, deleteProduct, rating, uploadProductImage } = require('../controllers/productController');
const uploader = require('../config/cloudinary.config');
router
    .route('/')
    .get(getAllProduct)
    .post(verifyAccessToken, isAdmin, createProduct);

router
    .route('/rating')
    .put(verifyAccessToken, rating);

router
    .route('/uploadImage/:id')
    .put(verifyAccessToken, isAdmin, uploader.array('images', 10), uploadProductImage);

router
    .route('/:id')
    .get(getProductById)
    .put(verifyAccessToken, isAdmin, updateProduct)
    .delete(verifyAccessToken, isAdmin, deleteProduct);


module.exports = router;