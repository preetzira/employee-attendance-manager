const nodemailer = require("nodemailer")
const config = require("config").get(process.env.mode || "dev")

const transporter = nodemailer.createTransport({
  host: config.email.host,
  service: config.email.service,
  // port: config.email.port,
  secure: true, // true for 465, false for other ports
  auth: {
    user: config.email.username,
    pass: config.email.password,
  },
})

const sendMail = ({ to, subject, html }) => {
  return new Promise((resolve, reject) => {
    const mailOptions = {
      from: config.email.username,
      to,
      subject,
      html,
    }

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error)
        reject(error)
      } else {
        console.log("Mail has been sent to", to)
        resolve({ message: "Mail Sent!!!", info })
      }
    })
  })
}

module.exports = {
  sendMail,
}
