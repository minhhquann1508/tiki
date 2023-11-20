const User = require('../models/User');
const asyncHandler = require('express-async-handler');

const getAllUser = asyncHandler(async (req, res) => {
    const users = await User.find({});
    res.status(200).json({
        success: users ? true : false,
        users
    });
});

const getCurrentUser = asyncHandler(async (req, res) => {
    const { userId } = req.user;
    const user = await User
        .findById(userId)
        .select('-__v -refreshToken -role -password');
    res.status(200).json({
        success: user ? true : false,
        user: user ? user : 'User not found'
    });
});

const updateUser = asyncHandler(async (req, res) => {
    const { userId } = req.user;
    if (!userId) throw new Error(`Can not find user with id ${userId}`);
    if (Object.keys(req.body).length === 0) throw new Error(`Missing input`);
    const result = await User
        .findByIdAndUpdate(userId, req.body, { new: true })
        .select('-__v -password -role -refreshToken');
    res.status(200).json({
        success: result ? true : false,
        updateUser: result ? result : 'Something went wrong'
    });
});

const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!id) throw new Error(`Can not find user with id ${id}`);
    const result = await User.findByIdAndDelete(id);
    res.status(200).json({
        success: result ? true : false,
        deleteUser: result ? `User with email ${result.email} deleted` : 'No user deleted'
    });
});

const updateUserByAdmin = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!id) throw new Error(`Can not find user with id ${id}`);
    if (Object.keys(req.body).length === 0) throw new Error(`Missing input`);
    const result = await User
        .findByIdAndUpdate(id, req.body, { new: true })
        .select('-__v -password -role -refreshToken');
    res.status(200).json({
        success: result ? true : false,
        updateUser: result ? result : 'Something went wrong'
    });
});

const updateUserAddress = asyncHandler(async (req, res) => {
    const { userId } = req.user;
    if (!req.body.address) throw new Error('Missing address value');
    const response = await User
        .findByIdAndUpdate(userId, { $push: { address: req.body.address } }, { new: true })
        .select('-refreshToken -password -role');
    res.status(200).json({
        success: response ? true : false,
        updateUser: response ? response : 'Something went wrong'
    });
});

const updateCart = asyncHandler(async (req, res) => {
    const { userId } = req.user;
    const { productId, quantity, color } = req.body;
    if (!productId || !quantity || !color) throw new Error('Missing input values');
    const user = await User.findById(userId);
    const alreadyProduct = user?.cart.find(el => el.product.toString() === productId);
    if (alreadyProduct) {
        if (alreadyProduct.color === color) {
            const response = await User
                .updateOne(
                    { cart: { $elemMatch: alreadyProduct } },
                    { $set: { 'cart.$.quantity': quantity } },
                    { new: true }
                );
            res.status(200).json({
                success: response ? true : false,
                updateUser: response ? response : 'Something went wrong'
            });
        } else {
            const response = await User.findByIdAndUpdate(userId, { $push: { cart: { product: productId, quantity, color } } }, { new: true });
            res.status(200).json({
                success: response ? true : false,
                updateUser: response ? response : 'Something went wrong'
            });
        }
    } else {
        const response = await User.findByIdAndUpdate(userId, { $push: { cart: { product: productId, quantity, color } } }, { new: true });
        res.status(200).json({
            success: response ? true : false,
            updateUser: response ? response : 'Something went wrong'
        });
    }
});

module.exports = {
    getAllUser,
    getCurrentUser,
    deleteUser,
    updateUser,
    updateUserByAdmin,
    updateUserAddress,
    updateCart
};