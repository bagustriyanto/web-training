const status = require("http-status")
const fs = require("fs")
const { param, validationResult, query } = require("express-validator")

const fileService = require("./fileSharingService")
const response = require("../../util/response")

module.exports = {
	uploadFile(req, res) {
		if (!req.files || Object.keys(req.files).length === 0) {
			res.status(status.BAD_REQUEST).json({ ...response, ...{ message: "No file were uploaded", status: false } })
		}

		fileService
			.upload(req)
			.then(result => {
				res.status(status.OK).json({ ...response, ...{ message: "upload success", status: true } })
			})
			.catch(err => {
				res.status(status.BAD_REQUEST).json({ ...response, ...{ message: err.message, status: false } })
			})
	},
	downloadFile(req, res) {
		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			res.status(status.UNPROCESSABLE_ENTITY).json({ ...response, ...{ status: false, message: errors } })
		}

		fileService
			.download(req)
			.then(result => {
				res.setHeader("Content-disposition", `attachment; filename=${result.filename}`)
				res.setHeader("Content-type", "application/octet-stream")

				const readStream = fs.createReadStream(result.downloadPath)
				readStream.on("open", function() {
					// This just pipes the read stream to the response object (which goes to the client)
					readStream.pipe(res)
				})
				readStream.on("error", function(err) {
					res.end(err)
				})
			})
			.catch(err => {
				res.status(status.BAD_REQUEST).json({ ...response, ...{ message: err.message, status: false } })
			})
	},
	deleteFile(req, res) {
		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			res.status(status.UNPROCESSABLE_ENTITY).json({ ...response, ...{ status: false, message: errors } })
		}

		fileService
			.delete(req)
			.then(result => {
				res.status(status.OK).json({ ...response, ...{ message: "delete success", status: true } })
			})
			.catch(err => {
				res.status(status.BAD_REQUEST).json({ ...response, ...{ message: err.message, status: false } })
			})
	},
	getFiles(req, res) {
		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			res.status(status.UNPROCESSABLE_ENTITY).json({ ...response, ...{ status: false, message: errors } })
		}

		fileService
			.getFiles(req)
			.then(result => {
				res.status(status.OK).json({ ...response, ...{ message: "fetch success", status: true, data: result } })
			})
			.catch(err => {
				res.status(status.BAD_REQUEST).json({ ...response, ...{ message: err.message, status: false } })
			})
	},
	validate(type = null) {
		let result = [
			query("username")
				.exists()
				.withMessage("username doesn't exist"),
			query("class_name")
				.exists()
				.withMessage("class_name doesn't exist")
		]

		switch (type) {
			case "download":
				result = [
					param("id")
						.not()
						.isEmpty()
						.withMessage("id doesn't exist")
				]
				break
			case "delete":
				result = [
					param("id")
						.not()
						.isEmpty()
						.withMessage("id doesn't exist")
				]
				break
		}

		return result
	}
}
