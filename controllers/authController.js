const { generateAccessToken, generateRefreshToken } = require('../middleware/jwt');
const User = require('../models/User');
const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const sendMail = require('../utils/sendEmail');
const crypto = require('crypto');

const register = asyncHandler(async (req, res) => {
    const { email, firstname, password, lastname } = req.body;
    if (!email || !firstname || !lastname || !password) res.status(400).json({
        success: false,
        mess: 'Missing input'
    });
    const isEmailAlreadyExist = await User.findOne({ email });

    if (isEmailAlreadyExist) throw new Error('User is already existed');

    const user = await User.create(req.body);
    res.status(201).json({
        success: user ? true : false,
        mess: user ? 'Register is successfully' : 'Something went wrong'
    });
});

const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) res.status(400).json({
        success: false,
        mess: 'Missing input'
    });

    const user = await User.findOne({ email });

    if (!user) throw new Error('Cannot found any user with this email');

    const { userPassword, role, refreshToken, ...userData } = user.toObject();
    const accessToken = generateAccessToken(user._id, role);
    const newRefreshToken = generateRefreshToken(user._id);
    await User
        .findByIdAndUpdate(
            user._id,
            { newRefreshToken },
            { new: true }
        );

    res.cookie('refreshToken', newRefreshToken, {
        httpOnly: true,
        signed: true,
        maxAge: 7 * 24 * 60 * 60 * 1000
    });

    if (user && await user.isCorrectPassword(password))
        return res.status(200).json({
            success: true,
            accessToken,
            user: userData,
        });

    throw new Error('Invalid credentials');
});

const refreshAccessToken = asyncHandler(async (req, res) => {
    const cookie = req.signedCookies;
    if (!cookie || !cookie.refreshToken) throw new Error('No refreshtoken available in cookie store');
    const result = await jwt.verify(cookie.refreshToken, process.env.JWT_SECRET);
    const response = await User.findOne({ _id: result.userId, refreshToken: cookie.refreshToken });
    res.status(200).json({
        success: response ? true : false,
        accessToken: response ? generateAccessToken(response._id, response.role) : 'Refresh token invalid'
    });
});

const logout = asyncHandler(async (req, res) => {
    const cookie = req.signedCookies;
    if (!cookie || !cookie.refreshToken) throw new Error('No refreshtoken available in cookie store');
    await User.findOneAndUpdate(
        { refreshToken: cookie.refreshToken },
        { refreshToken: '' },
        { new: true }
    );
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: true
    });
    res.status(200).json({
        success: true,
        mess: 'Logout successfully'
    })
});

const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.query;
    if (!email) throw new Error('Missing email');
    const user = await User.findOne({ email });
    if (!user) throw new Error('User not found');
    const resetToken = user.createPasswordChangeToken();
    await user.save();

    const html = `Click <a href=${process.env.URL_SERVER}/api/v1/reset-password/${resetToken}>here</a> 
    to change your password.This link will be disable after 15 minutes`;

    const data = {
        email,
        html
    }
    const result = await sendMail(data);
    res.status(200).json({
        success: true,
        result
    });
});

const resetPassword = asyncHandler(async (req, res) => {
    const { password, token } = req.body;
    if (!password || !token) throw new Error('Missing value');

    const passwordResetToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({ passwordResetToken, passwordResetExpires: { $gt: Date.now() } });
    if (!user) throw new Error('Invalid reset token');
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    user.passwordChangeAt = Date.now();
    await user.save();
    res.status(200).json({
        success: user ? true : false,
        mess: user ? 'Update this password successfully' : 'Something went wrong !'
    });
});

module.exports = {
    register,
    login,
    refreshAccessToken,
    logout,
    forgotPassword,
    resetPassword
};