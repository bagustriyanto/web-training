const uuid = require("uuid")
const fs = require("fs")

const model = require("../../models/index")
const fileSharing = model.file_sharing
const credentials = model.credentials
const masterClass = model.master_class
const Op = model.Sequelize.Op

const extentionsImage = ["jpg", "jpeg", "bmp", "png", "tiff", "gif"]
let limitPage = 10
let page = 0

module.exports = {
	upload(req) {
		let file = req.files.file
		let id = uuid.v4()
		let splitFile = file.name.split(".")
		let fileFormat = splitFile[splitFile.length - 1]
		let fileName = splitFile[0]

		let checkFileFormat = extentionsImage.filter(function(item) {
			return item === fileFormat.toLowerCase()
		}).length

		if (checkFileFormat === 0) folderType = "file"

		let fullPath = `/public/upload/${folderType}/${id}.${fileFormat}`

		return Promise.all([
			file.mv(`${appRoot}/${fullPath}`, function(err) {
				if (err) {
					throw new Error("Upload file failed")
				} else {
					return model.sequelize.transaction(t => {
						return Promise.all([
							fileSharing
								.create({
									class_id: req.body.class_id,
									credential_id: req.session.views.userSession.id,
									file_name: `${fileName}.${fileFormat}`,
									file_name_in_folder: `${id}.${fileFormat}`,
									createdBy: req.session.views.userSession.username
								})
								.then(result => {
									return result
								})
								.catch(err => {
									throw err
								})
						])
					})
				}
			})
		])
	},
	download(req) {
		const checkFile = fileSharing.findOne({ where: { id: req.params.id } }).then(result => {
			return result
		})

		return Promise.all([checkFile]).then(result => {
			let file = result[0]
			if (!file) {
				throw new Error("file not exits")
			} else {
				let splitFile = file.file_name.split(".")
				let fileFormat = splitFile[splitFile.length - 1]

				let checkFileFormat = extentionsImage.filter(function(item) {
					return item === fileFormat.toLowerCase()
				}).length

				if (checkFileFormat === 0) folderType = "file"

				let fullPath = `${appRoot}/public/upload/${folderType}/${file.file_name_in_folder}`
				return { downloadPath: fullPath, filename: file.file_name }
			}
		})
	},
	delete(req) {
		console.log(req.params)
		const checkFile = fileSharing.findOne({ where: { id: req.params.id } }).then(result => {
			return result
		})

		return Promise.all([checkFile]).then(result => {
			let file = result[0]
			if (!file) {
				throw new Error("file not exits")
			} else {
				let splitFile = file.file_name.split(".")
				let fileFormat = splitFile[splitFile.length - 1]

				let checkFileFormat = extentionsImage.filter(function(item) {
					return item === fileFormat.toLowerCase()
				}).length

				if (checkFileFormat === 0) folderType = "file"

				let fullPath = `${appRoot}/public/upload/${folderType}/${file.file_name_in_folder}`
				return model.sequelize.transaction(t => {
					return Promise.all([
						fileSharing
							.destroy({ where: { id: req.params.id } }, { transaction: t })
							.then(result => {
								return result
							})
							.catch(err => {
								throw err
							})
					]).then(result => {
						let dataRemoved = result[0]
						if (dataRemoved) {
							fs.unlink(fullPath, err => {
								if (err) {
									throw err
								}
							})
						}
					})
				})
				fs.unlink(fullPath, err => {
					if (err) {
						throw err
					}
				})
			}
		})
	},
	getFiles(req) {
		limitPage = req.query.limit === undefined ? limitPage : parseInt(req.query.limit)
		page = req.query.page === undefined ? page : parseInt(req.query.page) - 1
		let returnPage = page === 0 ? 1 : req.query.page

		return fileSharing
			.findAndCountAll({
				offset: page,
				limit: limitPage,
				include: [
					{
						model: masterClass,
						attributes: ["class_name", "class_code"],
						where: req.query.class_name !== "" ? { class_name: { [Op.like]: `%${req.query.class_name}%` } } : {}
					},
					{
						model: credentials,
						attributes: ["username"],
						where: req.query.username !== "" ? { username: req.query.username } : {}
					}
				]
			})
			.then(result => {
				return {
					total: result.count,
					items: result.rows,
					limit: limitPage,
					pages: returnPage
				}
			})
			.catch(err => {
				throw err
			})
	}
}
