const nodemailer = require("nodemailer")
let transporter = nodemailer.createTransport({
	host: "",
	port: "",
	secure: "",
	auth: {
		user: "",
		pass: ""
	}
})

module.exports = {
	sendEmail(subject, from, to, content, attachment) {},
	verifyEmail() {
		transporter.verify(function(error, success) {
			if (error) return false
			else return true
		})
	}
}
