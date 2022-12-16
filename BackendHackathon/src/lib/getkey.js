const axios = require('axios');
const evn = require('dotenv').config();
const {get_access_token} = require('../lib/getAccessToken');

exports.get_Key = async (req, res) => {
    try{
        const access_token = await get_access_token();
        const {data} = await axios.get('https://7ucpp7lkyl.execute-api.ap-southeast-1.amazonaws.com/dev/get_key', {
            headers: {
                'accept': 'application/json',
                'access-token': access_token,
                'x-api-key': 'hutech_hackathon@123456'
            }
        });
        return data;
    }catch(err){
        return ({message: 'Error'});
    }
};