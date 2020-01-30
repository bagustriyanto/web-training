const credentials = require("../../models").credentials
const profiles = require("../../models").profiles
const models = require("../../models/index")

const tokenService = require("../auth/tokenService")

const passwordUtil = require("../../util/password")
const generalUtil = require("../../util/general")

module.exports = {
	login(req) {
		const result = Promise.all([
			credentials.findOne({
				where: {
					email: req.body.email,
					status: true
				},
				attributes: { exclude: ["password", "salt"] }
			})
		])
			.then(result => {
				let data = result[0]
				let currentPass = general.passwordEncrypt(req.body.password, data.salt)

				if (currentPass === data.password) {
					return data
				} else {
					throw new Error("password doesn't match with server")
				}
			})
			.then(result => {
				let token = tokenService.generateToken(result.username, roleResult.role.name, result.id)
				return {
					user: result,
					token: token
				}
			})
			.catch(err => {
				throw err
			})
		return result
	},
	register(req) {
		const checkEmailExist = credentials
			.findOne({
				where: {
					email: req.body.email,
					status: true
				}
			})
			.then(result => {
				if (result) return true
				else return false
			})
		const checkUsernameExist = credentials
			.findOne({
				where: {
					username: req.body.username,
					status: true
				}
			})
			.then(result => {
				if (result) return true
				else return false
			})
		const verificationCode = generalUtil.generateVerificationCode().then(result => {
			return result
		})
		return Promise.all([checkEmailExist, checkUsernameExist, verificationCode]).then(result => {
			if (result[0]) {
				throw new Error("Email already exist. please using another email")
			} else if (result[1]) {
				throw new Error("Username already exist. please using another username")
			} else {
				passwordUtil.salt().then(salt => {
					let password = passwordUtil.passwordEncrypt(req.body.password, salt)
					models.sequelize.transaction(t => {
						return Promise.all([
							credentials
								.create({
									username: req.body.username,
									email: req.body.email,
									status: 0,
									salt: salt,
									password: password,
									public_user: 1,
									verification_code: result[2],
									createdBy: req.body.username
								})
								.then(credentialsModel => {
									profiles
										.create({
											credential_id: credentialsModel.get("id"),
											full_name: req.body.full_name
										})
										.then(() => {
											this.sendEmailVerification(result[2], req.body.email)
											return true
										})
								})
						]).catch(err => {
							throw err()
						})
					})
				})
			}
		})
	},
	verification(req) {
		const checkVerificationCode = credentials
			.findOne({ where: { username: req.body.username, verification_code: req.body.verificationCode } })
			.then(result => {
				if (result) return true
				else false
			})
		return Promise.all(checkVerificationCode).then(result => {
			if (!result) {
				throw Error("invalid verification code")
			} else {
				models.sequelize.transaction(t => {
					return credentials
						.update(
							{
								verification_code: null,
								status: 1
							},
							{ where: { username: req.body.username } }
						)
						.then(result => {
							return result
						})
						.catch(err => {
							throw err
						})
				})
			}
		})
	},
	sendEmailVerification(verification_code, email) {
		fs.readFile(`${appRoot}/templates/registrationTemplate.html`, function(err, data) {
			if (!err) {
				try {
					let render = mustache.render(data.toString(), { verification_code: verification_code })
					mailService.sendEmail("Email Verification", "no-reply@bertugas.com", email, null, render)
				} catch (error) {
					throw error
				}
			}
		})
	}
}
