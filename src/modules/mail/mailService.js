const nodemailer = require("nodemailer")
let transporter = nodemailer.createTransport({
	host: "mail.bertugas.com",
	port: "465",
	secure: "true",
	auth: {
		user: "registration@bertugas.com",
		pass: "bertugas.8787"
	}
})

module.exports = {
	sendEmail(subject, from, to, cc, content, attachment) {
		let data = {
			from: from,
			to: to,
			cc: cc,
			subject: subject,
			html: content
			// attachments: [{ filename: null, path: null }]
		}
		transporter.sendMail(data, function(err, info) {
			console.log(err)
			console.log(info)
		})
	},
	verifyEmail() {
		return transporter.verify(function(error, success) {
			if (error) return false
			else return true
		})
	}
}
