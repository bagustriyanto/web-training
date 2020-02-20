const credentials = require("../../models").credentials
const profile = require("../../models").profile
const models = require("../../models/index")
const fs = require("fs")
const mustache = require("mustache")
const moment = require("moment")

const tokenService = require("../auth/tokenService")
const mailService = require("../mail/mailService")

const passwordUtil = require("../../util/password")
const generalUtil = require("../../util/general")

module.exports = {
	login(req) {
		const result = Promise.all([
			credentials.findOne({
				where: {
					username: req.body.username,
					status: true
				}
			})
		])
			.then(result => {
				let data = result[0]
				let currentPass = passwordUtil.passwordEncrypt(req.body.password, data.salt)

				if (currentPass === data.password) {
					return data
				} else {
					throw new Error("password doesn't match with server")
				}
			})
			.then(result => {
				let token = tokenService.generateToken(result.username, result.id)
				result.password = null
				result.salt = null

				credentials.update(
					{
						last_login_ip: req.connection.remoteAddress,
						last_login: moment().format("YYYY-MM-DD HH:mm:ss")
					},
					{ where: { id: result.id } }
				)

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
					status: false
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
					status: false
				}
			})
			.then(result => {
				if (result) return true
				else return false
			})

		return Promise.all([checkEmailExist, checkUsernameExist]).then(result => {
			if (result[0]) {
				throw Error("Email already exist. please using another email")
			} else if (result[1]) {
				throw Error("Username already exist. please using another username")
			} else {
				const verificationCode = generalUtil.generateVerificationCode()
				return passwordUtil.salt().then(salt => {
					let password = passwordUtil.passwordEncrypt(req.body.password, salt)
					return models.sequelize.transaction(t => {
						return Promise.all([
							credentials
								.create({
									username: req.body.username,
									email: req.body.email,
									status: 0,
									salt: salt,
									password: password,
									public_user: 1,
									verification_code: verificationCode,
									createdBy: req.body.username
								})
								.then(credentialsModel => {
									return profile
										.create({
											credential_id: credentialsModel.id,
											full_name: req.body.full_name
										})
										.then(() => {
											return credentialsModel
										})
										.catch(err => {
											throw err
										})
								})
								.then(credentialsModel => {
									return this.sendEmailVerification(verificationCode, credentialsModel.email)
								})
						]).catch(err => {
							throw err
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
				else return false
			})
			.catch(err => {
				throw err
			})
		return Promise.all([checkVerificationCode]).then(result => {
			if (!result[0]) {
				throw Error("invalid verification code ")
			} else {
				return Promise.all([
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
				]).catch(err => {
					throw err
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
