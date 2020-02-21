const model = require("../../models/index")
const class_schedule = require("../../models").class_schedule
const master_class = require("../../models").master_class
const Op = require("../../models/index").Sequelize.Op

let limitPage = 10
let page = 0

module.exports = {
	createSchedule(req) {
		// check conflicts schedule
		const checkSchedule = class_schedule
			.findAll({
				where: {
					class_id: req.body.class_id,
					[Op.or]: {
						[Op.or]: [
							{
								start_time: {
									[Op.lt]: req.body.start_time
								}
							},
							{
								start_time: {
									[Op.lt]: req.body.end_time
								}
							}
						],
						[Op.or]: [
							{
								end_time: {
									[Op.gt]: req.body.start_time
								}
							},
							{
								end_time: {
									[Op.gt]: req.body.end_time
								}
							}
						]
					}
				}
			})
			.then(result => {
				if (result.length > 0) {
					return true
				} else {
					return false
				}
			})
			.catch(err => {
				throw err
			})

		return Promise.all([checkSchedule]).then(result => {
			if (result[0]) {
				throw new Error("Conflict schedule, please re-enter start and end time")
			} else {
				return model.sequelize.transaction(t => {
					return Promise.all([
						class_schedule
							.create({
								class_id: req.body.class_id,
								start_time: req.body.start_time,
								end_time: req.body.end_time,
								status: req.body.status
							})
							.then(model => {
								return model
							})
					]).catch(err => {
						throw err
					})
				})
			}
		})
	},
	updateSchedule(req) {
		const checkId = class_schedule
			.findOne({ where: { id: req.params.id } })
			.then(result => {
				if (result) return true
				else false
			})
			.catch(err => {
				throw err
			})

		const checkSchedule = class_schedule
			.findAll({
				where: {
					class_id: req.body.class_id,
					[Op.or]: {
						[Op.or]: [
							{
								start_time: {
									[Op.lt]: req.body.start_time
								}
							},
							{
								start_time: {
									[Op.lt]: req.body.end_time
								}
							}
						],
						[Op.or]: [
							{
								end_time: {
									[Op.gt]: req.body.start_time
								}
							},
							{
								end_time: {
									[Op.gt]: req.body.end_time
								}
							}
						]
					}
				}
			})
			.then(result => {
				if (result.length > 0) {
					let isCurrentRow = result.filter(function(value) {
						return value.id === req.params.id
					})
					if (isCurrentRow === 0) {
						// to check is current row or not
						return true
					} else if (isCurrentRow.start_time === req.body.start_time && isCurrentRow.end_time === req.body.end_time) {
						// to check when is current row change start_time and end_time
						return true
					} else {
						return false
					}
				} else {
					return false
				}
			})
			.catch(err => {
				throw err
			})

		return Promise.all([checkId, checkSchedule]).then(result => {
			let idFound = result[0]
			let conflictSchedule = result[1]

			if (!idFound) {
				throw new Error("Schedule not foud")
			} else if (conflictSchedule) {
				throw new Error("Conflict schedule, please re-enter start and end time")
			} else {
				return model.sequelize.transaction(t => {
					return Promise.all([
						class_schedule.update(
							{
								start_time: req.body.start_time,
								end_time: req.body.end_time,
								status: req.body.status
							},
							{ where: { id: req.params.id } }
						)
					])
						.then(model => {
							return model
						})
						.catch(err => {
							throw err
						})
				})
			}
		})
	},
	deleteSchedule(req) {
		const checkId = class_schedule
			.findOne({ where: { id: req.params.id } })
			.then(result => {
				if (result) return true
				else false
			})
			.catch(err => {
				throw err
			})
		return Promise.all([checkId]).then(result => {
			let idFound = result[0]

			if (!idFound) {
				throw new Error("Schedule not foud")
			} else {
				return model.sequelize.transaction(t => {
					return Promise.all([
						class_schedule
							.destroy({ where: { id: req.params.id } })
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
	},
	getScheduleById(req) {
		const checkId = class_schedule
			.findOne({ where: { id: req.params.id } })
			.then(result => {
				if (result) return true
				else false
			})
			.catch(err => {
				throw err
			})

		return Promise.all([checkId]).then(result => {
			let idFound = result[0]
			if (!idFound) {
				throw new Error("Schedule not foud")
			} else {
				return class_schedule
					.findOne({ where: { id: req.params.id } })
					.then(model => {
						return model
					})
					.catch(err => {
						throw err
					})
			}
		})
	},
	getSchedule(req) {
		let whereClause = {}
		if (req.query.search !== "") {
			whereClause.where = {
				class_name: { [Op.like]: `%${req.query.class_name}%` }
			}
		}

		limitPage = req.query.limit === undefined ? limitPage : parseInt(req.query.limit)
		page = req.query.page === undefined ? page : parseInt(req.query.page) - 1
		let returnPage = page === 0 ? 1 : req.query.page

		return class_schedule
			.findAndCountAll({
				offset: page,
				limit: limitPage,
				include: [
					{
						model: master_class,
						attributes: ["class_name", "class_code"],
						whereClause
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
	}
}
