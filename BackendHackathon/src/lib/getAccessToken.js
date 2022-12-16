const axios = require('axios');
const evn = require('dotenv').config();
exports.get_access_token = async () => {
    try{
        const token_access = await axios.post(
                'https://hdbank-hackathon.auth.ap-southeast-1.amazoncognito.com/oauth2/token',
                new URLSearchParams({
                    'client_id': 'sikcnei4t2h3ntkqj5d49ltvr',
                    'grant_type': 'refresh_token',
                    'refresh_token': process.env.REFRESH_TOKEN
                }),
                {
                    headers: {
                        'accept': 'application/json',
                        'Content-Type':' application/x-www-form-urlencoded'
                    }
                }
            );
        return token_access.data.id_token;
    }catch(err){
        console.log("in getAccessToken: ");
        return ({error: "in getAccessToken"});
    }
}