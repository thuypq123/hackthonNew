const axios = require('axios');
const {get_access_token} = require('../lib/getAccessToken');
const jwt = require('jsonwebtoken');
const user = require('../models/user');

exports.getBalance = async (req, res) => {
    const accessToken = await get_access_token();
    try{
        const {token} = req.body;
        const {email, accountNo} = jwt.verify(token, process.env.SECRET_JWT);
        const existUser = await user.findOne({email: email});
        if(existUser && existUser.verify){
            const response = await axios.post(
                'https://7ucpp7lkyl.execute-api.ap-southeast-1.amazonaws.com/dev/balance',
                {
                    'data': {
                        'acctNo': accountNo
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
            if(response.data.response.responseCode == '00'){
                existUser.amount = response.data.data.amount;
                await existUser.save();
                res.json({ _id: existUser._id,
                    fullName: existUser.fullName,
                    username: existUser.username,
                    email: existUser.email,
                    amount: existUser.amount , 
                    accountNo: existUser.accountNo,
                });
            }else{
                res.json({response});
            }
        }else{
            res.json({responseCode:"99" ,message: 'User not verify'});
        }
    }catch(err){
        console.log("in getkeyController: ");   
        res.json({responseCode:"17" ,message: 'Error when get balance'});
    }
};