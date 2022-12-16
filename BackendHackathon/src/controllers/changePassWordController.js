const axios = require('axios');
const jwt = require('jsonwebtoken');
const user = require('../models/user');
const Cryptr = require('cryptr');
const cryptr = new Cryptr(process.env.SECRET_OTP);
var newOTP = require('otp-generators')
const OTP = require('../models/OTP');
const {get_access_token} = require('../lib/getAccessToken');
const sendMail = require('../lib/sendMail');
exports.changePassWord = async (req, res) => {
    const accessToken = await get_access_token();
    const {token, newPass,oldPass, credential, key, username} = req.body.data;
    console.log(req.body);
    try{
        const {email, accountNo} = jwt.verify(token, process.env.SECRET_JWT);
        console.log(email, accountNo);
        const existUser = await user.findOne({email:email, username: username, password: oldPass});
        if(existUser && existUser.verify){
            // const response = await axios.post(
            //     'https://7ucpp7lkyl.execute-api.ap-southeast-1.amazonaws.com/dev/change_password',
            //     {
            //         'data': {
            //             'credential': credential,
            //             'key': key,
            //         },
            //         'request': {
            //             'requestId': 'a7ea23df-7468-439d-9b12-26eb4a760901',
            //             'requestTime': '1667200102200'
            //         }
            //     },
            //     {
            //         headers: {
            //             'accept': 'application/json',
            //             'access-token': accessToken,
            //             'Content-Type': 'application/json',
            //             'x-api-key': 'hutech_hackathon@123456',
            //         }
            //     }
            // );
                const createNewOTP = newOTP.generate(6, { alphabets: false, upperCase: false, specialChar: false }).toString();
                const encryptOTP = cryptr.encrypt(createNewOTP);
                const createOTP = new OTP({
                    otp:encryptOTP,
                    status: false,
                    date: Date.now(),
                    type: 'changePassWord',
                    newPass: newPass,
                    email: existUser.email,
                    user: existUser._id,
                });
                await createOTP.save();
                sendMail(createNewOTP, existUser.email);
                res.json({responseCode:"00" ,message: 'Please check your email to verify'});
        }else{
            res.json({responseCode:"99" ,message: 'pass word is not correct'});
        }
    }catch(err){
        console.log(err);
        res.json({responseCode:"99" ,message: 'Server error'});
    }
};