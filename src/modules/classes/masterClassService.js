const model = require("../../models/index")
const masterClass = require("../../models").master_class
const Op = require("../../models").Sequelize.Op

let limitPage = 10
let page = 0

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
			if (isDuplicate[0]) {
				throw new Error("duplicate master class code, please enter other code")
			} else {
				return model.sequelize
					.transaction(t => {
						return Promise.all([
							masterClass
								.create({
									class_name: req.body.class_name,
									class_code: req.body.class_code,
									status: req.body.status,
									createdBy: req.session.views.userSession.username
								})
								.then(result => {
									return result
								})
						])
					})
					.catch(err => {
						throw err
					})
			}
		})
	},
	updateMasterClass(req) {
		const checkId = masterClass
			.findOne({ where: { id: req.params.id } })
			.then(result => {
				if (result) return true
				else return false
			})
			.catch(err => {
				throw err
			})

		return Promise.all([checkId]).then(exist => {
			if (!exist[0]) {
				throw new Error("master class not found")
			} else {
				return model.sequelize
					.transaction(t => {
						return Promise.all([
							masterClass
								.update(
									{
										class_name: req.body.class_name,
										class_code: req.body.class_code,
										status: req.body.status,
										updatedBy: req.session.views.userSession.username
									},
									{ where: { id: req.params.id } }
								)
								.then(result => {
									return result
								})
						])
					})
					.catch(err => {
						throw err
					})
			}
		})
	},
	findOneMasterClass(req) {
		const checkId = masterClass
			.findOne({ where: { id: req.params.id } })
			.then(result => {
				if (result) return true
				else return false
			})
			.catch(err => {
				throw err
			})

		return Promise.all([checkId]).then(exist => {
			if (!exist[0]) {
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
		limitPage = req.query.limit === undefined ? limitPage : parseInt(req.query.limit)
		page = req.query.page === undefined ? page : parseInt(req.query.page) - 1
		let returnPage = page === 0 ? 1 : req.query.page

		return masterClass
			.findAndCountAll({
				where: req.query.class_name !== "" ? { class_name: { [Op.like]: `%${req.query.class_name}%` } } : {},
				limit: limitPage,
				offset: page
			})
			.then(result => {
				return {
					total: result.count,
					items: result.rows,
					limit: limitPage,
					pages: returnPage
				}
			})
	},
	deleteMasterClass(req) {
		const checkId = masterClass
			.findOne({ where: { id: req.params.id } })
			.then(result => {
				if (result) return true
				else return false
			})
			.catch(err => {
				throw err
			})

		return Promise.all([checkId]).then(exist => {
			if (!exist[0]) {
				throw new Error("master class not found")
			} else {
				return model.sequelize
					.transaction(t => {
						return Promise.all([
							masterClass.destroy({ where: { id: req.params.id } }).then(result => {
								return result
							})
						])
					})
					.catch(err => {
						throw err
					})
			}
		})
	}
}
