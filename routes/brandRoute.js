const router = require('express').Router();
const { verifyAccessToken, isAdmin } = require('../middleware/verifyToken');
const { createBrand,
    updateBrand,
    getBrands,
    getSingleBrand,
    deleteBrand, uploadBrandLogo } = require('../controllers/brandController');

router
    .route('/')
    .get(getBrands)
    .post(verifyAccessToken, isAdmin, createBrand);

router
    .route('/logo/:id')
    .put(verifyAccessToken, isAdmin, uploadBrandLogo)

router
    .route('/:id')
    .get(getSingleBrand)
    .put(verifyAccessToken, isAdmin, updateBrand)
    .delete(verifyAccessToken, isAdmin, deleteBrand);




module.exports = router;