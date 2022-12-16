const user = require('../models/user');
const jwt = require('jsonwebtoken');
const axios = require('axios'); 
const { get_access_token } = require('../lib/getAccessToken');
const payment = require('../models/payment');

exports.getPayment = async (req, res) => {
    const accessToken = await get_access_token();
    try{
        const {token, inSystem, sdId} = req.body.data;
        console.log(token, inSystem, sdId);
        if(inSystem || inSystem == 'true'){
            const {email, accountNo} = jwt.verify(token, process.env.SECRET_JWT);
            const existUser = await user.findOne({ email: email });
            if(existUser && existUser.verify){
                const listPayment = await payment.find({email: email});
                res.json({
                    'response': {
                        'responseCode': '00',
                        'responseMessage': 'Get list payment success',
                    },
                    'data': {
                        'listPayment': listPayment
                    }
                });
            }else{
                res.json({ responseCode: '99', responseMessage: 'User not verify' });
            }
        }else{
            const response = await axios.post(
                'https://7ucpp7lkyl.execute-api.ap-southeast-1.amazonaws.com/dev/getpayment',
                {
                    'data': {
                        'sdId': sdId,
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
            if(response.data.response.responseCode == '00'){
                res.json({
                    'response': {
                        'responseCode': '00',
                        'responseMessage': 'Get list payment success',
                    },
                    'data': {
                        'payment': response.data.payments
                    }
                });
            }
        }
    }catch(err){
        console.log(err);
        res.json({ responseCode: '99', responseMessage: 'Server error' });
    }
};