const status = require("http-status")
const has = require("has-keys")
const response = require("../../util/response")

const authService = require("./authService")

module.exports = {
	async login(req, res) {
		if (!has(req.body, ["username", "password"]))
			res.status(status.BAD_REQUEST).json({ ...response, ...{ status: false, message: "you must specify username and password" } })

		authService
			.login(req)
			.then(data => {
				req.session.views.userSession = data.user
				let result = { ...response, ...{ status: true, message: "login success", data: req.session.views.userSession, token: data.token } }

				res.status(status.OK).json(result)
			})
			.catch(err => {
				res.status(status.BAD_REQUEST).json({ ...response, ...{ status: false, message: err.message } })
			})
	},
	async register(req, res) {
		if (!has(req.body, ["username", "email", "full_name", "password"])) {
			res.status(status.BAD_REQUEST).send({ ...response, ...{ status: false, message: "you must specify username, email and full name" } })
		} else {
			authService
				.register(req)
				.then(() => {
					let result = { ...response, ...{ status: true, message: "register success" } }
					res.status(status.OK).json(result)
				})
				.catch(err => {
					res.status(status.BAD_REQUEST).json({ ...response, ...{ status: false, message: err.message } })
				})
		}
	},
	async verification(req, res) {
		if (!has(req.body, ["username"])) res.status(status.BAD_REQUEST).json({ ...response, ...{ status: false, message: "you must specify username" } })

		authService
			.verification(req)
			.then(() => {
				let result = { ...response, ...{ status: true, message: "verification success " } }
				res.status(status.OK).json(result)
			})
			.catch(err => {
				throw { ...response, ...{ status: false, message: "verification failed" } }
			})
	}
}
