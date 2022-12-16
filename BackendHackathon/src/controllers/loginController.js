const mongoose = require('mongoose');
const user = require('../models/user');
const mailer = require('../lib/sendMail');
const { get_access_token } = require('../lib/getAccessToken');
const Cryptr = require('cryptr');
const cryptr = new Cryptr(process.env.SECRET_OTP);
const OTP = require('../models/OTP');
var newOTP = require('otp-generators')
const axios = require('axios');
const { get_Key } = require('../lib/getkey');

exports.login = async (req, res) => {
    const { username, password } = req.body.data;
    console.log(req.body)
    try {
        const accessToken = await get_access_token();
        const existUser = await user.findOne({ username: username, password: password });
        if (existUser) {
            if (existUser.verify) {
                const response = await axios.post(
                    'https://7ucpp7lkyl.execute-api.ap-southeast-1.amazonaws.com/dev/login',
                    {
                        'data': {
                            'credential': req.body.data.credential,
                            'key': req.body.data.key,
                        },
                        'request': {
                            'requestId': "d6c2cef4-0579-45ba-a789-e265e913a06b",
                            'requestTime': "2022-12-08 21:10:44",
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
                if (response.data.response.responseCode == '00') {
                    existUser.accountNo = response.data.data.accountNo;
                    existUser.save();
                    const createNewOTP = newOTP.generate(6, { alphabets: false, upperCase: false, specialChar: false }).toString();
                    const encryptOTP = cryptr.encrypt(createNewOTP);
                    const createOTP = new OTP({
                        otp: encryptOTP,
                        status: false,
                        date: Date.now(),
                        type: 'login',
                        email: existUser.email,
                        user: existUser._id,
                    });
                    await createOTP.save();
                    mailer(createNewOTP, existUser.email);
                    console.log(existUser);
                    // send json sendmail success
                    res.json({ responseCode: '00', responseMessage: 'send OTP to mail success' , email : existUser.email});
                } else {
                    console.log("Login failed");
                    res.json({ ...response.data });
                }
            } else {
                console.log("Login failed");
                res.json({ responseCode: '01', responseMessage: 'user not verify' });
            }
        } else {
            console.log("Login failed");
            res.json({ responseCode: '01', responseMessage: 'password or username is not correct' });
        }
    } catch (err) {
        console.log(err);
        res.json({ responseCode: '01', responseMessage: 'login failed' });
    }
};