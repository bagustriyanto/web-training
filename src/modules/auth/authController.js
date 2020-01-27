const authService = require("./authService")
const tokenService = require("./tokenService")
const response = require("../../util/response")
const status = require("http-status")
const has = require("has-keys")

module.exports = {
	async login(req, res) {
		if (!has(req.body, ["username", "password"]))
			res.status(status.BAD_REQUEST).json({ ...response, ...{ status: false, message: "you must specify username and password" } })

		authService
			.login(req)
			.then(r => {
				let result = { ...response, ...{ status: true, message: "login success", data: data.user, token: data.token } }
				res.status(status.OK).json(result)
			})
			.catch(err => {
				res.status(status.BAD_REQUEST).json({ ...response, ...{ status: false, message: "register failed" } })
			})
	},
	async register(req, res) {
		if (!has(req.body, ["username", "email", "full_name"]))
			res.status(status.BAD_REQUEST).json({ ...response, ...{ status: false, message: "you must specify username, email and full name" } })

		authService
			.register(req)
			.then(data => {
				let result = { ...response, ...{ status: true, message: "register success" } }
				res.status(status.OK).json(result)
			})
			.catch(err => {
				res.status(status.BAD_REQUEST).json({ ...response, ...{ status: false, message: "register failed" } })
			})
	},
	async testResponse(req, res) {
		if (!has(req.body, ["username", "email", "full_name"]))
			res.status(status.BAD_REQUEST).json({ ...response, ...{ status: false, message: "you must specify username, email and full name" } })
	},
	async verification(req, res) {
		if (!has(req.body, ["username"])) res.status(status.BAD_REQUEST).json({ ...response, ...{ status: false, message: "you must specify username" } })

		authService
			.verification(req)
			.then(() => {
				let result = { ...response, ...{ status: true, message: "verification success" } }
				res.status(status.OK).json(result)
			})
			.catch(err => {
				throw { ...response, ...{ status: false, message: "verification failed" } }
			})
	}
}
