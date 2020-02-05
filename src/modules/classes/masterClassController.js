const status = require("http-status")

const masterClassService = require("./masterClassService")
const response = require("../../util/response")

module.exports = {
	create(req, res) {
		let result = {}

		masterClassService
			.createMasterClass(req)
			.then(result => {
				result = { ...response, ...{ status: true, message: "create success" } }
				res.status(status.OK).json(result)
			})
			.catch(err => {
				result = { ...response, ...{ status: false, message: err.message } }
				res.status(status.BAD_REQUEST).json(result)
			})
	},
	update(req, res) {
		let result = {}

		masterClassService
			.updateMasterClass(req)
			.then(result => {
				result = { ...response, ...{ status: true, message: "update success" } }
				res.status(status.OK).json(result)
			})
			.catch(err => {
				result = { ...response, ...{ status: false, message: err.message } }
				res.status(status.BAD_REQUEST).json(result)
			})
	},
	getById(req, res) {
		masterClassService
			.findOneMasterClass(req)
			.then(result => {
				result = { ...response, ...{ status: true, message: "fetch success", data: result } }
				res.status(status.OK).json(result)
			})
			.catch(err => {
				result = { ...response, ...{ status: false, message: err.message } }
				res.status(status.BAD_REQUEST).json(result)
			})
	},
	getAll(req, res) {
		masterClassService
			.findAllMasterClass(req)
			.then(result => {
				result = { ...response, ...{ status: true, message: "fetch success", data: result } }
				res.status(status.OK).json(result)
			})
			.catch(err => {
				result = { ...response, ...{ status: false, message: err.message } }
				res.status(status.BAD_REQUEST).json(result)
			})
	},
	delete(req, res) {
		masterClassService
			.deleteMasterClass(req)
			.then(result => {
				result = { ...response, ...{ status: true, message: "delete success" } }
				res.status(status.OK).json(result)
			})
			.catch(err => {
				result = { ...response, ...{ status: false, message: err.message } }
				res.status(status.BAD_REQUEST).json(result)
			})
	}
}
