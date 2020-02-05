const model = require("../../models/index")
const masterClass = require("../../models").master_class
const Op = require("../../models").Sequelize.Op

const limit = 10
const page = 0

module.exports = {
	createMasterClass(req) {
		const checkClassCode = masterClass
			.findOne({ where: { class_code: req.body.class_code } })
			.then(result => {
				if (result) return true
				else return false
			})
			.catch(err => {
				throw err
			})

		return Promise.all([checkClassCode]).then(isDuplicate => {
			if (isDuplicate) {
				throw new Error("duplicate master class code, please enter other code")
			} else {
				return model.sequelize
					.transaction(t => {
						masterClass
							.create({
								class_name: req.body.class_name,
								class_code: req.body.class_code,
								status: req.body.status
							})
							.then(result => {
								return result
							})
					})
					.catch(err => {
						throw err
					})
			}
		})
	},
	updateMasterClass(req) {
		const checkId = masterClass
			.findOne({ where: { id: req.query.id } })
			.then(result => {
				if (result) return true
				else return false
			})
			.catch(err => {
				throw err
			})

		return Promise.all([checkId]).then(exist => {
			if (!exist) {
				throw new Error("master class not found")
			} else {
				return model.sequelize
					.transaction(t => {
						masterClass
							.update({
								class_name: req.body.class_name,
								class_code: req.body.class_code,
								status: req.body.status
							})
							.then(result => {
								return result
							})
					})
					.catch(err => {
						throw err
					})
			}
		})
	},
	findOneMasterClass(req) {
		const checkId = masterClass
			.findOne({ where: { id: req.query.id } })
			.then(result => {
				if (result) return true
				else return false
			})
			.catch(err => {
				throw err
			})

		return Promise.all([checkId]).then(exist => {
			if (!result) {
				throw new Error("master class not found")
			} else {
				return masterClass
					.findOne({ where: { id: req.params.id } })
					.then(result => {
						return result
					})
					.catch(err => {
						throw err
					})
			}
		})
	},
	findAllMasterClass(req) {
		let whereClause = {}
		if (req.body.class_name !== undefined || req.body.class_name !== "") {
			whereClause.where = {
				class_name: { [Op.iLike]: `%${req.body.class_name}%` }
			}
		}

		limit = req.query.limit === undefined ? limit : req.query.limit
		page = req.query.page === undefined ? page + 1 : req.query.page + 1

		return masterClass
			.findAndCountAll({
				whereClause,
				limit: limit,
				offset: page
			})
			.then(result => {
				return {
					total: result.count,
					items: result.rows,
					limit: limit,
					pages: page
				}
			})
	},
	deleteMasterClass(req) {
		const checkId = masterClass
			.findOne({ where: { id: req.query.id } })
			.then(result => {
				if (result) return true
				else return false
			})
			.catch(err => {
				throw err
			})

		return Promise.all([checkId]).then(exist => {
			if (!exist) {
				throw new Error("master class not found")
			} else {
				return model.sequelize
					.transaction(t => {
						masterClass.destroy({ where: { id: req.query.id } }).then(result => {
							return result
						})
					})
					.catch(err => {
						throw err
					})
			}
		})
	}
}
