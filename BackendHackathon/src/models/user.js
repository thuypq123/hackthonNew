const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const id = mongoose.Types.ObjectId;
const userSchema = new Schema({
    accountNo: String,
    fullName: String,
    username: String,
    email: String,
    phone: String,
    verify: Boolean,
    isBlock: Boolean,
    faildLogin: Number,
    amount: String,
    password: String,
    oldPass1: String,
    oldPass2: String,
    oldPass3: String,
});

module.exports = mongoose.model('User', userSchema);