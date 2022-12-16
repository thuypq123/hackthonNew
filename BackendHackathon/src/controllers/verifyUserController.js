const Cryptr = require('cryptr');
const env = require('dotenv');
const cryptr = new Cryptr(process.env.SECRET_OTP);
const mongoose = require('mongoose');
const user = require('../models/user');
const OTP = require('../models/OTP');
exports.postVerifyUser = async (req, res) => {
    const {email} = req.body;
    const getOTP = req.body.OTP;
    console.log(getOTP);
    const existUser = await user.findOne({email: email});
    if(existUser){
        const existOTP = await OTP.findOne({email:req.body.email, status:false, type:'register'});
        console.log(existOTP);
        if(existOTP){
            const decryptedString = cryptr.decrypt(existOTP.otp);
            if(decryptedString === getOTP){
                res.json({
                    'response': {
                        'responseCode': '00',
                        'responseMessage': 'OTP is correct',
                    }
                });
                existUser.verify = true;
                await existUser.save();
                await existOTP.updateOne({status: true});
            }else{
                res.json({
                    'response': {
                        'responseCode': '15',
                        'responseMessage': 'OTP is not correct',
                    }
                });
            }
        }else{
            res.json({
                'response': {
                    'responseCode': '14',
                    'responseMessage': 'OTP not found',
                }
            });
        }
    }
};