const OTP = require('../models/OTP');
const user = require('../models/user');
const Cryptr = require('cryptr');
const cryptr = new Cryptr(process.env.SECRET_OTP);
const { get_access_token } = require('../lib/getAccessToken');
const jwt = require('jsonwebtoken');
const axios = require('axios');
exports.verify_changePassword = async (req, res) => {
    const accessToken = await get_access_token();
    try{
        const {token, credential, key} = req.body.data;
        console.log(req.body);
        const getOTP = req.body.data.OTP;
        const {email, accountNo} = jwt.verify(token, process.env.SECRET_JWT);
        const existUser = await user.findOne({email: email});
        if(existUser && existUser.verify){
            const existOTP = (await OTP.find({email: email, type: 'changePassWord', status: false}).sort({_id: -1}).limit(1))[0];
            if(existOTP){
                if(getOTP == cryptr.decrypt(existOTP.otp)){
                    const response = await axios.post(
                        'https://7ucpp7lkyl.execute-api.ap-southeast-1.amazonaws.com/dev/change_password',
                        {
                            'data': {
                                'credential': credential,
                                'key': key,
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
                                'Content-Type': 'application/json',
                                'x-api-key': 'hutech_hackathon@123456',
                            }
                        }
                    );
                    if(response.data.response.responseCode == '00'){
                        existUser.password = existOTP.newPass;
                        await existUser.save();
                        existOTP.status = true;
                        await existOTP.save();
                        res.json({
                            'response': {
                                'responseCode': '00',
                                'responseMessage': 'Change password success',
                            }
                        });
                    }else{
                        res.json(response.data);
                    }
                }
            }
            console.log(existOTP);
        }else{
            res.json({ responseCode: '99', responseMessage: 'User not verify' });
        }
    }catch(err){
        console.log(err);
        res.json({ responseCode: '99', responseMessage: 'Server error' });
    }
};