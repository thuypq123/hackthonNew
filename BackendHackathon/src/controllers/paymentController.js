const user = require('../models/user');
const payment = require('../models/payment');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const sendMail = require('../lib/sendMail');
var newOTP = require('otp-generators')
const OTP = require('../models/OTP');
const Cryptr = require('cryptr');
const cryptr = new Cryptr(process.env.SECRET_OTP);
exports.payment = async (req, res) => {
    const {amount, token ,description, sdId} = req.body.data;
    try{
        const {email, accountNo} = jwt.verify(token, process.env.SECRET_JWT);
        const existUser = await user.findOne({email: email});
        if(existUser && existUser.verify){
            const newPayment = new payment({
                sdId: sdId,
                accNo: accountNo,
                status: false,
                amount: amount,
                type: 'not verified',
                date : new Date(),
                description: description,
                email: email,
                user: existUser._id
            });
            await newPayment.save();
            const createNewOTP = newOTP.generate(6, { alphabets: false, upperCase: false, specialChar: false }).toString();
            const encryptOTP = cryptr.encrypt(createNewOTP);
            const createOTP = new OTP({
                otp:encryptOTP,
                status: false,
                date: Date.now(),
                type: 'payment',
                email: existUser.email,
                user: existUser._id,
            });
            await createOTP.save();
            sendMail(createNewOTP, existUser.email);
            console.log(createNewOTP);
            res.json({responseCode:"00" ,message: 'Please check your email to verify'});
        }else{
            res.json({
                'response': {
                    'responseCode': '14',
                    'responseMessage': 'User not verify',
                }
            });
        }
    }catch(err){
        console.log(err);
        res.json({ responseCode: '99', responseMessage: 'Server error' });
    }
};