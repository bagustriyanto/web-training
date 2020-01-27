const authService = require("./authService")
const tokenService = require("./tokenService")
const response = require("../../util/response")
const status = require("http-status")
const has = require("has-keys")

module.exports = {
	login(req, res) {
		authService
			.login(req)
			.then(r => {
				baseResponse.data = r.user
				baseResponse.token = r.token
				baseResponse.status = true
				baseResponse.message = "login success"

				res.status(200).send(baseResponse)
			})
			.catch(err => {
				baseResponse.message = err.message

				res.status(400).send(baseResponse)
			})
	},
	register(req, res) {
		if (!has(req.body, ["username", "email", "full_name"]))
			res.status(status.BAD_REQUEST).json({ ...response, ...{ status: false, message: "you must specify username, email and full name" } })
		authService
			.register(req)
			.then(data => {
				let result = { ...response, ...{ status: true, message: "register success", data: data.user, token: data.token } }
				res.status(status.OK).json(result)
			})
			.catch(err => {
				throw { ...response, ...{ status: false, message: "register failed", data: null, token: null } }
			})
	},
	testResponse(req, res) {
		if (!has(req.body, ["username", "email", "full_name"]))
			res.status(status.BAD_REQUEST).json({ ...response, ...{ status: false, message: "you must specify username, email and full name" } })
	}
}
