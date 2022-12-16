const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const user = require('./user');

const userSchema = new Schema({
    sdId: String,
    accNo: String,
    status: Boolean,
    email: String,
    description: String,
    amount: Number,
    type: String,
    date : Date,
    user: {type: Schema.Types.ObjectId, ref: 'User'},
});

module.exports = mongoose.model('Payment', userSchema);