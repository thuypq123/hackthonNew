const {user} = require('./user');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const id = mongoose.Types.ObjectId;

const transactionSchema = new Schema({
    accountNo: String,
    amount: Number,
    toAccNo: String,
    status: Boolean,
    description: String,
    type: String,
    date: Date,
    email: String,
    reason: String,
    user: {type: Schema.Types.ObjectId, ref: 'User'},
});

module.exports = mongoose.model('Transaction', transactionSchema);