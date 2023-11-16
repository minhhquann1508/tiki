const User = require('../models/User');
const asyncHandler = require('express-async-handler');

const register = asyncHandler(async (req, res) => {
    const { email, firstname, password, lastname } = req.body;
    if (!email || !firstname || !lastname || !password) res.status(400).json({
        success: false,
        mess: 'Missing input'
    });
    const user = await User.create(req.body);
    res.status(201).json({
        success: user ? true : false,
        res: user
    });
});

module.exports = {
    register
}