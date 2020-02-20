const status = require("http-status")
const { body, param, validationResult } = require("express-validator")

const absentService = require("./absentsService")
const response = require("../../util/response")

module.exports = {
	create(req, res) {
		absentService
			.createAbsent(req)
			.then(result => {
				res.status(status.OK).json({ ...response, ...{ message: "create success", status: true, data: result } })
			})
			.catch(err => {
				res.status(status.BAD_REQUEST).json({ ...response, ...{ message: err.message, status: false } })
			})
	},
	get(req, res) {
		absentService
			.getAbsent(req)
			.then(result => {
				res.status(status.OK).json({ ...response, ...{ message: "fetch success", status: true, data: result } })
			})
			.catch(err => {
				res.status(status.BAD_REQUEST).json({ ...response, ...{ message: err.message, status: false } })
			})
	},
	getHistory(req, res) {
		absentService
			.getAbsentHistory(req)
			.then(result => {
				res.status(status.OK).json({ ...response, ...{ message: "fetch success", status: true, data: result } })
			})
			.catch(err => {
				res.status(status.BAD_REQUEST).json({ ...response, ...{ message: err.message, status: false } })
			})
	},
	validate() {
		let result = [
			body("schedule_id")
				.not()
				.isEmpty()
				.withMessage("schedule_id doesn't exist")
				.isNumeric()
				.withMessage("schedule_id is number")
		]

		return result
	}
}
