const mongoose = require('mongoose');

let userSchema = new mongoose.Schema({
    username: {
        type: String,
        lowercase: true,
        required: [true, "can't be blank"],
        match: [/^[a-zA-Z0-9]+$/, 'is invalid'],
        index: true
    },
    password: String
}, {timestamps: true});

const User = mongoose.model('user', userSchema);
module.exports = User;
