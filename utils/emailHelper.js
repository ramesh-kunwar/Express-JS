const nodemailer = require("nodemailer");

const mailHelper = async (options) => {

    // create reusable transporter object using the default SMTP transport

    let transporter = nodemailer.createTransport({
        host: process.env.SMPT_HOST,
        port: process.env.SMPT_PORT,
        auth: {
            user: process.env.SMPT_USER, // generated ethereal user
            pass: process.env.SMPT_PASS, // generated ethereal password
        },
    });

    const message = {
        from: "ramesh@gmail.com", // sender address
        to: options.email, // list of receivers
        subject: options.subject, // Subject line
        text: options.message, // plain text body

    }

    // send mail with defined transport object
    await transporter.sendMail(message);


}

module.exports = mailHelper