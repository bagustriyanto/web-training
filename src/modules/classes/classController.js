const status = require("http-status")
const { body, param, query, validationResult } = require("express-validator")

const classService = require("./classService")
const response = require("../../util/response")

module.exports = {
	create(req, res) {
		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			res.status(status.UNPROCESSABLE_ENTITY).json({ ...response, ...{ status: false, message: errors } })
		}
		classService
			.createSchedule(req)
			.then(result => {
				res.status(status.OK).json({ ...response, ...{ message: "create success", data: result, status: true } })
			})
			.catch(err => {
				res.status(status.BAD_REQUEST).json({ ...response, ...{ status: false, message: err.message } })
			})
	},
	update(req, res) {
		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			res.status(status.UNPROCESSABLE_ENTITY).json({ ...response, ...{ status: false, message: errors } })
		}
		classService
			.updateSchedule(req)
			.then(result => {
				res.status(status.OK).json({ ...response, ...{ message: "update success", data: result, status: true } })
			})
			.catch(err => {
				res.status(status.BAD_REQUEST).json({ ...response, ...{ status: false, message: err.message } })
			})
	},
	delete(req, res) {
		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			res.status(status.UNPROCESSABLE_ENTITY).json({ ...response, ...{ status: false, message: errors } })
		}
	},
	getById(req, res) {
		classService
			.getScheduleById(req)
			.then(result => {
				res.status(status.OK).json({ ...response, ...{ message: "fetch success", status: true, data: result } })
			})
			.catch(err => {
				res.status(status.BAD_REQUEST).json({ ...response, ...{ status: false, message: err.message } })
			})
	},
	getAll(req, res) {
		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			res.status(status.UNPROCESSABLE_ENTITY).json({ ...response, ...{ status: false, message: errors } })
		}

		classService
			.getSchedule(req)
			.then(result => {
				res.status(status.OK).json({ ...response, ...{ message: "fetch success", status: true, data: result } })
			})
			.catch(err => {
				res.status(status.BAD_REQUEST).json({ ...response, ...{ status: false, message: err.message } })
			})
	},
	validate(method) {
		let result = [
			body("class_id", "class_id can't be null")
				.not()
				.isEmpty(),
			body("start_time", "start_time can't be null")
				.not()
				.isEmpty(),
			body("end_time", "end_time can't be null")
				.not()
				.isEmpty(),
			body("status", "status is boolean type").isBoolean()
		]
		switch (method) {
			case "get":
				result = [
					query("limit")
						.isNumeric()
						.withMessage("only number to fill in")
						.not()
						.isEmpty()
						.withMessage("limit not found")
						.custom(value => {
							if (parseInt(value) <= 0) {
								return false
							}

							return true
						})
						.withMessage("limit can't less than equals to 0"),
					query("page")
						.isNumeric()
						.withMessage("only number to fill in")
						.not()
						.isEmpty()
						.withMessage("page not found")
						.custom(value => {
							if (parseInt(value) <= 0) {
								return false
							}

							return true
						})
						.withMessage("limit can't less than equals to 0")
				]

				break
			case "put":
				result.push(param("id", "id doesn't exist").exists())
				break
			case "delete":
				result = [param("id", "id doesn't exist").exists()]
				break
		}

		return result
	}
}
