const nodemailer = require("nodemailer");
const sgTransport = require("nodemailer-sendgrid-transport");
const sendGridMail = require("@sendgrid/mail");

const sendEmail = async (options) => {
  sendGridMail.setApiKey(process.env.SENDGRID_API_KEY);

  // 1) Create a transporter
  const option = {
    // host: process.env.EMAIL_HOST,
    // port: process.env.EMAIL_PORT,
    auth: {
      //   user: process.env.EMAIL_USERNAME,
      //   pass: process.env.EMAIL_PASSWORD,
      api_key: process.env.SENDGRID_API_KEY,
    },
  };
  const transporter = nodemailer.createTransport(sgTransport(option));
  // 2) Define the email options

  const mailOptions = {
    from: "Ehtesham Zahid <shamimalick321@gmail.com>",
    to: options.email,
    subject: options.subject,
    text: options.message,
  };
  // 3) Actually send the email

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
