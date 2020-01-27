const credentials = require("../../models").credentials
const profiles = require("../../models").profiles
const models = require("../../models/index")
const tokenService = require("../auth/tokenService")
const passwordUtil = require("../../util/password")

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
		const result = Promise.all([checkEmailExist, checkUsernameExist]).then(result => {
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
									status: 1,
									salt: salt,
									password: password,
									public_user: 1,
									createdBy: req.body.username
								})
								.then(credentialsModel => {
									profiles
										.create({
											credential_id: credentialsModel.get("id"),
											full_name: req.body.full_name
										})
										.then(() => {
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
	}
}
