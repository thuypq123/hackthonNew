const payment = require('../models/payment');
const OTP = require('../models/OTP');
const Cryptr = require('cryptr');
const cryptr = new Cryptr(process.env.SECRET_OTP);
const user = require('../models/user');
const jwt = require('jsonwebtoken');
const axios = require('axios'); 
const { get_access_token } = require('../lib/getAccessToken');

exports.verifyPayment = async (req, res) => {
    const accessToken = await get_access_token();
    try{
        const {token, sdId} = req.body.data;
        const getOTP = req.body.data.OTP;
        const {email, accountNo} = jwt.verify(token, process.env.SECRET_JWT);
        const existUser = await user.findOne({email: email});
        console.log(existUser);
        if(existUser && existUser.verify){
            const paymentOTP = await (await OTP.find({email: email, type: 'payment', status: false}).sort({_id: -1}).limit(1))[0];
            if(paymentOTP){
                const decryptedString = cryptr.decrypt(paymentOTP.otp);
                if(decryptedString == getOTP){
                    const existPayment = await payment.findOne({email: email, status: false});
                    console.log(existPayment);
                    if(existPayment){
                        const response = await axios.post(
                            'https://7ucpp7lkyl.execute-api.ap-southeast-1.amazonaws.com/dev/payment',
                            {
                                'data': {
                                    'sdId': sdId,
                                    "amount": existPayment.amount,
                                    "description": existPayment.description,
                                    "fromAcct": existUser.accountNo,
                                },
                                'request': {
                                    'requestId': 'a7ea23df-7468-439d-9b12-26eb4a760901',
                                    'requestTime': '1667200102200'
                                }
                            },
                            {
                                headers: {
                                    'accept': 'application/json',
                                    'access-token': accessToken,
                                    'x-api-key': 'hutech_hackathon@123456',
                                    'Content-Type': 'application/json'
                                }
                            }
                        );
                        console.log(response.data);
                        existPayment.status = true;
                        await existPayment.save();
                        paymentOTP.status = true;
                        await paymentOTP.save();
                        res.json(response.data);
                    }else{
                        res.json({
                            'response': {
                                'responseCode': '17',
                                'responseMessage': 'Payment not found',
                            }
                        });
                    }
                }else{
                    res.json({
                        'response': {
                            'responseCode': '16',
                            'responseMessage': 'Wrong OTP',
                        }
                    });
                }
            }else{
                res.json({
                    'response': {
                        'responseCode': '15',
                        'responseMessage': 'OTP not found',
                    }
                })
            }
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