const Blog = require('../models/Blog');
const asyncHandler = require('express-async-handler');

const createBlog = asyncHandler(async (req, res) => {
    const { title, description, category } = req.body;
    if (!title || !description || !category) throw new Error('Missing inputs');
    const response = await Blog.create(req.body);
    res.status(201).json({
        success: response ? true : false,
        blog: response ? response : 'Cannot create a blog'
    });
});

const updateBlog = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (Object.keys(req.body).length === 0) throw new Error('Missing inputs');
    const response = await Blog.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json({
        success: response ? true : false,
        blog: response ? response : 'Cannot update a blog'
    });
});

const getBlogs = asyncHandler(async (req, res) => {
    const response = await Blog.find({});
    res.status(200).json({
        success: response ? true : false,
        blog: response ? response : 'Something went wrong'
    });
});

const likeBlog = asyncHandler(async (req, res) => {
    const { userId } = req.user;
    const { blogId } = req.params;
    if (!blogId) throw new Error('Please provide blog ID');
    const blog = await Blog.findById(blogId);
    const alreadyDisliked = blog?.dislikes.find(el => el.toString() === userId);
    if (alreadyDisliked) {
        const response = await Blog.findByIdAndUpdate(blogId,
            {
                $pull: { dislikes: userId },
            },
            { new: true }
        );
        res.status(200).json({
            success: response ? true : false,
            result: response
        });
    } else {
        const isLiked = blog?.likes.find(el => el.toString() === userId);
        if (isLiked) {
            const response = await Blog.findByIdAndUpdate(blogId,
                {
                    $pull: { likes: userId },
                },
                { new: true }
            );
            res.status(200).json({
                success: response ? true : false,
                result: response
            });
        } else {
            const response = await Blog.findByIdAndUpdate(blogId,
                {
                    $push: { likes: userId },
                },
                { new: true }
            );
            res.status(200).json({
                success: response ? true : false,
                result: response
            });
        }
    };
});

const dislikeBlog = asyncHandler(async (req, res) => {
    const { userId } = req.user;
    const { blogId } = req.params;
    if (!blogId) throw new Error('Please provide blog ID');
    const blog = await Blog.findById(blogId);
    const alreadyLiked = blog?.likes.find(el => el.toString() === userId);
    if (alreadyLiked) {
        const response = await Blog.findByIdAndUpdate(blogId,
            {
                $pull: { likes: userId },
            },
            { new: true }
        );
        res.status(200).json({
            success: response ? true : false,
            result: response
        });
    }
    const isDisliked = blog?.dislikes.find(el => el.toString() === userId);
    if (isDisliked) {
        const response = await Blog.findByIdAndUpdate(blogId,
            {
                $pull: { dislikes: userId },
            },
            { new: true }
        );
        res.status(200).json({
            success: response ? true : false,
            result: response
        });
    } else {
        const response = await Blog.findByIdAndUpdate(blogId,
            {
                $push: { dislikes: userId },
            },
            { new: true }
        );
        res.status(200).json({
            success: response ? true : false,
            result: response
        });
    }
});

const getSingleBlog = asyncHandler(async (req, res) => {
    const { blogId } = req.params;
    const blog = await Blog
        .findByIdAndUpdate(blogId, { $inc: { numberViews: 1 } }, { new: true })
        .populate('likes', 'firstname lastname')
        .populate('dislikes', 'firstname lastname');
    res.status(200).json({
        success: blog ? true : false,
        blog: blog ? blog : 'Cannot find blog'
    })
});

const deleteBlog = asyncHandler(async (req, res) => {
    const { blogId } = req.params;
    const blog = await Blog.findByIdAndDelete(blogId);
    res.status(200).json({
        success: blog ? true : false,
        blog: blog ? blog : 'Cannot delete blog'
    })
});

const uploadBlogImage = asyncHandler(async (req, res) => {
    if (!req.file) throw new Error('Missing input');
    const { blogId } = req.params;
    const response = await Blog.findByIdAndUpdate(blogId, { image: req.file.path }, { new: true });
    res.status(200).json({
        success: response ? true : false,
        response: response ? response : 'Cannot update blog image'
    })
});

module.exports = {
    createBlog,
    updateBlog,
    getBlogs,
    likeBlog,
    dislikeBlog,
    getSingleBlog,
    deleteBlog,
    uploadBlogImage
};