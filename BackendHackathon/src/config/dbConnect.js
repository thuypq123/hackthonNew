const mongoose = require('mongoose');
const evn = require('dotenv').config();

const dbConnect = async () => {
    try{
        await mongoose.connect(process.env.MONGO_URL);
        console.log('MongoDB connected');
    }catch(err){
        console.log(err);
    }
}

module.exports = {dbConnect};