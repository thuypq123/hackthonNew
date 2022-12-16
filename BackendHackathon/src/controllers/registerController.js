const axios = require('axios');
const {get_access_token} = require('../lib/getAccessToken');
const user = require('../models/user');
const mailer = require('../lib/sendMail');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const OTP = require('../models/OTP');
const Cryptr = require('cryptr');
const cryptr = new Cryptr(process.env.SECRET_OTP);
var newOTP = require('otp-generators')

exports.postRegister = async (req, res) => {
    const accessToken = await get_access_token();
    console.log(req.body);
    try{
        const existUserEmail = await user.findOne({email: req.body.data.email});
        const existUserPhone = await user.findOne({phone: req.body.data.phone});
        const existUserUsername = await user.findOne({ username: req.body.data.username});
        console.log(existUserUsername);
        if(existUserUsername){
            res.json({
                'response': {
                    'responseCode': '11',
                    'responseMessage': 'Username already exists',
                }
            });
        }else{
        if(existUserEmail){
            res.json({
                'response': {
                    'responseCode': '12',
                    'responseMessage': 'Email already exists',
                }
            });
        }else if(existUserPhone){
            res.json({
                'response': {
                    'responseCode': '13',
                    'responseMessage': 'Phone already exists',
                }
            });
        }else{
            const response = await axios.post(
                'https://7ucpp7lkyl.execute-api.ap-southeast-1.amazonaws.com/dev/register',
                {
                    'data': {
                        'credential': req.body.data.credential,
                        'username': req.body.data.username,
                        'email': req.body.data.email,
                        'fullName': req.body.data.fullName,
                        'identityNumber': req.body.data.identityNumber,
                        'key': req.body.data.key,
                        'phone': req.body.data.phone,
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
            const data = response.data;
            if(data.response.responseCode === '00'){
                const newUser = new user({
                    email: req.body.data.email,
                    password: req.body.data.password,
                    username: req.body.data.username,
                    fullName: req.body.data.fullName,
                    identityNumber: req.body.data.identityNumber,
                    phone: req.body.data.phone,
                    key: req.body.data.key,
                    verify: false,
                });
                await newUser.save();
                const createNewOTP = newOTP.generate(6, { alphabets: false, upperCase: false, specialChar: false }).toString();
                const encryptOTP = cryptr.encrypt(createNewOTP);
                const createOTP = new OTP({
                    otp:encryptOTP,
                    status: false,
                    date: Date.now(),
                    type: 'register',
                    email: newUser.email,
                    user: newUser._id,
                });
                await createOTP.save();
                mailer(createNewOTP, req.body.data.email);
                console.log("Register successfully");
                const token = jwt.sign({email:newUser.email}, process.env.SECRET_JWT);
                res.json({...response.data, token});
            }else{
                console.log("Register failed")
                res.json(data);
            }
        }}
    }catch(e){
        console.log("Error in register: ", e);
        res.json({error: "error when register"});
    }
};