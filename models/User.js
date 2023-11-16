const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    mobile: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: 'user',
    },
    cart: {
        type: Array,
        default: []
    },
    address: [{ type: mongoose.Schema.ObjectId, ref: 'Address' }],
    wishlist: [{ type: mongoose.Schema.ObjectId, ref: 'Product' }],
    isBlocked: {
        type: Boolean,
        default: false
    },
    refreshToken: {
        type: String
    },
    passwordChangeAt: {
        type: String
    },
    passwordResetToken: {
        type: String
    },
    passwordResetExpires: {
        type: String
    }
}, { timestamps: true });

UserSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    const salt = bcrypt.genSaltSync(10);
    this.password = await bcrypt.hash(this.password, salt);
});

module.exports = mongoose.model('User', UserSchema);