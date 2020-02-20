const moment = require("moment")

const model = require("../../models/index")
const absent = model.absent
const schedule = model.class_schedule
const master_class = model.master_class
const Op = model.Sequelize.Op

let limitPage = 10
let page = 0

module.exports = {
	createAbsent(req) {
		const checkSchedule = schedule.findOne({ where: { id: req.body.schedule_id } }).then(result => {
			if (result) return true
			else return false
		})
		return Promise.all([checkSchedule]).then(result => {
			let scheduleExist = result
			if (!scheduleExist) {
				throw new Error("Schedule not found")
			} else {
				return model.sequelize.transaction(t => {
					return Promise.all([
						absent
							.create({
								credential_id: req.session.views.userSession.credential_id,
								schedule_id: req.body.schedule_id,
								absent_time: moment().format("YYYY-MM-DD HH:mm:ss")
							})
							.then(model => {
								return model
							})
							.catch(err => {
								throw err
							})
					])
				})
			}
		})
	},
	getAbsent(req) {
		let query =
			"select abs.*, cred.username username, mclass.class_name class_name, mclass.class_code class_code from ( select credential_id, schedule_id, min(absent_time) 'in', max(absent_time) 'out' from `dicoding-challenge`.absents group by credential_id , schedule_id ) abs join `dicoding-challenge`.credentials cred on cred.id = abs .credential_id join `dicoding-challenge`.class_schedules class on class.id = abs .schedule_id join `dicoding-challenge`.master_classes mclass on mclass.id = class.class_id where 1=1"
		let params = {}

		if (req.query.username !== "") {
			query += " and username = $username"
			params.username = req.query.username
		}
		if (req.query.class_name !== "") {
			query += " and class_name like %$class_name%"
			params.username = req.query.class_name
		}

		return model.sequelize
			.query(query, { bind: params, type: model.Sequelize.QueryTypes.SELECT })
			.then(model => {
				return model
			})
			.catch(err => {
				throw err
			})
	},
	getAbsentHistory(req) {
		let whereAbsent = {}
		let whereClass = {}

		if (req.query.username !== "") {
			whereAbsent.where = {
				username: req.query.username
			}
		}

		if (req.query.class_name !== "") {
			whereClass.where = {
				class_name: { [Op.iLike]: `%${req.query.class_name}%` }
			}
		}

		limitPage = req.query.limit === undefined ? limitPage : parseInt(req.query.limit)
		page = req.query.page === undefined ? page : parseInt(req.query.page) - 1
		let returnPage = page === 0 ? 1 : req.query.page

		return absent
			.findAndCountAll({
				whereAbsent,
				offset: page,
				limit: limitPage,
				include: [
					{
						model: schedule,
						attributes: ["id", "class_id"],
						include: [
							{
								model: master_class,
								attributes: ["class_name", "class_code"],
								whereClass
							}
						]
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
