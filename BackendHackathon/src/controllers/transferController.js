const jwt = require('jsonwebtoken');
const user = require('../models/user');
const {get_access_token} = require('../lib/getAccessToken');
const OTP = require('../models/OTP');
const Cryptr = require('cryptr');
const cryptr = new Cryptr(process.env.SECRET_OTP);
var newOTP = require('otp-generators')
const mailer = require('../lib/sendMail');
const transaction = require('../models/transaction');
exports.transfer = async (req, res) => {
    const accessToken = await get_access_token();
    try{
        const {token, amount, description, toAcc} = req.body.data;
        console.log(req.body.data);
        const {email, accountNo} = jwt.verify(token, process.env.SECRET_JWT);
        const existUser = await user.findOne({email: email});
        if(existUser && existUser.verify){
            if(existUser.accountNo !== toAcc){
                if(existUser.verify){
                    const createNewOTP = newOTP.generate(6, { alphabets: false, upperCase: false, specialChar: false }).toString();
                    const encryptOTP = cryptr.encrypt(createNewOTP);
                    const createOTP = new OTP({
                        otp:encryptOTP,
                        status: false,
                        date: Date.now(),
                        type: 'transfer',
                        email: existUser.email,
                        user: existUser._id,
                    });
                    await createOTP.save();
                    const createNewTransaction = new transaction({
                        accountNo: accountNo,
                        amount: amount,
                        toAccNo: toAcc,
                        status: false,
                        description: description,
                        date: Date.now(),
                        email: existUser.email,
                        user: existUser._id,
                        reason: 'not verify',
                    });
                    await createNewTransaction.save();
                    mailer(createNewOTP, existUser.email);
                    res.json({responseCode:"00" ,message: 'Please check your email to verify'});
                }else{
                    res.json({responseCode:"18" ,message: 'Please verify your email'});
                }
            }else{
                res.json({responseCode:"17" ,message: 'Can not transfer to your account'});
            }
        }else{
            res.json({responseCode:"19" ,message: 'account not verify'});
        }
        console.log(email, accountNo);
    }catch(err){
        console.log("in getkeyController");
        res.json({responseCode:"20" ,message: 'Error when transfer'});
    }
};