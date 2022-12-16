const user = require('../models/user');
const transaction = require('../models/transaction');
const OTP = require('../models/OTP');
const jwt = require('jsonwebtoken');
const Cryptr = require('cryptr');
const cryptr = new Cryptr(process.env.SECRET_OTP);
const {get_access_token} = require('../lib/getAccessToken');
var _ = require('lodash');
const axios = require('axios');
exports.verifyTransfer = async (req, res) => {
    const accessToken = await get_access_token();
    const {token} = req.body;
    try{
        const {email, accountNo} = jwt.verify(token, process.env.SECRET_JWT);
        var d = new  Date().toISOString().
        replace(/T/, ' ').      // replace T with a space
        replace(/\..+/, '') 
        console.log(d);    
        const existUser = await user.findOne({email});
        if(existUser && existUser.verify){
            const getTransaction = (await transaction.find({email: email, status: false}).sort({_id: -1}).limit(1))[0];
            console.log(getTransaction);
            if(getTransaction){
                const existOTP = (await OTP.find({email: email, type: 'transfer', status: false}).sort({_id: -1}).limit(1))[0];
                console.log(existOTP);
            if(existOTP){
                const decryptedString = cryptr.decrypt(existOTP.otp);
                if(decryptedString == req.body.OTP){
                    existOTP.status = true;
                    await existOTP.save();
                    const response = await axios.post(
                        'https://7ucpp7lkyl.execute-api.ap-southeast-1.amazonaws.com/dev/transfer',
                        {
                            'data': {
                                'amount': getTransaction.amount,
                                'description': getTransaction.description,
                                'fromAcct': getTransaction.accountNo,
                                'toAcct': getTransaction.toAccNo
                            },
                            'request': {
                                'requestId': 'a7ea23df-7468-439d-9b12-26eb4a760901',
                                'requestTime': d
                            }
                        },
                        {
                            headers: {
                                'accept': 'application/json',
                                'access-token': accessToken,
                                'x-api-key': 'hutech_hackathon@123456',
                                'Content-Type': 'application/json'
                            }
                        });
                        if(response.data.response.responseCode == '00'){
                            getTransaction.status = true;
                            getTransaction.reason = 'Transfer successful';
                            await getTransaction.save();
                            res.json({
                                'response': {
                                    'responseCode': '00',
                                    'responseMessage': 'Transfer successful',
                                }
                            });
                        }else{
                            getTransaction.reason = response.data.response.responseMessage;
                            await getTransaction.save();
                            res.json(response.data);
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
                });
            }
            }else{
                res.json({
                    'response': {
                        'responseCode': '15',
                        'responseMessage': 'Transaction not found',
                    }
                });
            }
        }else{
            res.json({
                'response': {
                    'responseCode': '14',
                    'responseMessage': 'User not verify',
                }
            });
        }
        const existOTP = (await OTP.find({email: email, type: 'transfer', status: false}).sort({_id: -1}).limit(1))[0];
    }catch(err){
        console.log(err);
    }
};