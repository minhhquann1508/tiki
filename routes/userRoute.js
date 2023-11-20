const router = require('express').Router();
const { verifyAccessToken, isAdmin } = require('../middleware/verifyToken');
const { getAllUser, getCurrentUser, deleteUser, updateUser, updateUserByAdmin, updateUserAddress, updateCart } = require('../controllers/userController');

router
    .route('/')
    .get(verifyAccessToken, isAdmin, getAllUser);

router
    .route('/showMe')
    .get(verifyAccessToken, getCurrentUser);

router
    .route('/update-current-user')
    .put(verifyAccessToken, updateUserAddress);

router
    .route('/update-user-address')
    .put(verifyAccessToken, updateUser);

router
    .route('/add-to-cart')
    .put(verifyAccessToken, updateCart);

router
    .route('/:id')
    .delete(verifyAccessToken, isAdmin, deleteUser)
    .put(verifyAccessToken, updateUserByAdmin);


module.exports = router;