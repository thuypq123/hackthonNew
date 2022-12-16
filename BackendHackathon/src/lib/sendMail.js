var nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'aehole37@gmail.com',
         pass: process.env.MAILPW
    }
});

let sendMail = (OTP, email)=>{
    let mailOptions = {
        from: 'aehole37@gmail.com',
        to: email,
        subject: 'Mã xác nhận của bạn là: ' + OTP,
        text: 'Mã xác nhận của bạn là: ' + OTP
    };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        return console.log(error);
    }
  });
};

module.exports = sendMail;