const status = require("http-status")
const { body, param, validationResult } = require("express-validator")

const masterClassService = require("./masterClassService")
const response = require("../../util/response")

module.exports = {
	create(req, res) {
		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			res.status(status.UNPROCESSABLE_ENTITY).json({ ...response, ...{ status: false, message: errors } })
		}

		masterClassService
			.createMasterClass(req)
			.then(result => {
				res.status(status.OK).json({ ...response, ...{ status: true, message: "create success" } })
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

		masterClassService
			.updateMasterClass(req)
			.then(result => {
				res.status(status.OK).json({ ...response, ...{ status: true, message: "update success" } })
			})
			.catch(err => {
				res.status(status.BAD_REQUEST).json({ ...response, ...{ status: false, message: err.message } })
			})
	},
	getById(req, res) {
		masterClassService
			.findOneMasterClass(req)
			.then(result => {
				res.status(status.OK).json({ ...response, ...{ status: true, message: "fetch success", data: result } })
			})
			.catch(err => {
				res.status(status.BAD_REQUEST).json({ ...response, ...{ status: false, message: err.message } })
			})
	},
	getAll(req, res) {
		masterClassService
			.findAllMasterClass(req)
			.then(result => {
				res.status(status.OK).json({ ...response, ...{ status: true, message: "fetch success", data: result } })
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

		masterClassService
			.deleteMasterClass(req)
			.then(result => {
				res.status(status.OK).json({ ...response, ...{ status: true, message: "delete success" } })
			})
			.catch(err => {
				res.status(status.BAD_REQUEST).json({ ...response, ...{ status: false, message: err.message } })
			})
	},
	validate(method) {
		let result = [
			body("class_name", "class_name can't be null")
				.not()
				.isEmpty(),
			body("class_code", "class_code can't be null")
				.not()
				.isEmpty(),
			body("status", "status is boolean type").isBoolean()
		]
		switch (method) {
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
