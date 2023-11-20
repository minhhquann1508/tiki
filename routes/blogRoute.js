const router = require('express').Router();
const { createBlog, updateBlog, getBlogs, likeBlog, dislikeBlog, getSingleBlog, deleteBlog, uploadBlogImage } = require('../controllers/blogController');
const { verifyAccessToken, isAdmin } = require('../middleware/verifyToken');
const uploader = require('../config/cloudinary.config');

router
    .route('/')
    .get(getBlogs)
    .post(verifyAccessToken, isAdmin, createBlog);

router
    .route('/like/:blogId')
    .put(verifyAccessToken, likeBlog);

router
    .route('/dislike/:blogId')
    .put(verifyAccessToken, dislikeBlog);

router
    .route('/uploadImage/:blogId')
    .put(verifyAccessToken, isAdmin, uploader.single('image'), uploadBlogImage);

router
    .route('/one/:blogId')
    .get(getSingleBlog);


router
    .route('/update/:id')
    .put(verifyAccessToken, isAdmin, updateBlog);

router
    .route('/delete/:blogId')
    .delete(verifyAccessToken, isAdmin, deleteBlog);

module.exports = router;