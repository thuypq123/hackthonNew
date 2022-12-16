const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const user = require('./user');
const transaction = require('./transaction');
const payment = require('./payment');
const OTPSchema = new Schema({
    otp: String,
    status: Boolean,
    date: Date,
    type: String,
    email: String,
    newPass: String,
    expireAt: {
        type: Date,
        default: Date.now() + 50 * 60 * 1000,
        index: { expires: '300s' },
    },
    transaction: {type: Schema.Types.ObjectId, ref: 'Transaction'},
    payment: {type: Schema.Types.ObjectId, ref: 'Payment'},
    user: {type: Schema.Types.ObjectId, ref: 'User'},
});

module.exports = mongoose.model('OTP', OTPSchema);