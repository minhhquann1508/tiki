const router = require('express').Router();
const { verifyAccessToken, isAdmin } = require('../middleware/verifyToken');
const { getAllUser, getCurrentUser, deleteUser, updateUser, updateUserByAdmin } = require('../controllers/userController');

router
    .route('/')
    .get(verifyAccessToken, isAdmin, getAllUser);

router
    .route('/showMe')
    .get(verifyAccessToken, getCurrentUser);

router
    .route('/update-current-user')
    .put(verifyAccessToken, updateUser);

router
    .route('/:id')
    .delete(verifyAccessToken, isAdmin, deleteUser)
    .put(verifyAccessToken, updateUserByAdmin);


module.exports = router;