const axios = require('axios');
const evn = require('dotenv').config();
const {get_Key} = require('../lib/getkey');
exports.get_Key = async (req, res) => {
    try{
        res.json(await get_Key());
    }catch(err){
        console.log("in getkeyController: ");   
        res.status(200).json({message: 'Error'});
    }
}